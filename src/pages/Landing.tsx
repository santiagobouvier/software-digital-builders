import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ArrowUp, ArrowDown, Pause, Play, Menu, X } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { FlowSculpture } from '@/components/landing/FlowSculpture';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { VisionJourney, FlowJourney, OperatingJourney, ServicesJourney, ProcessJourney, ContactJourney } from '@/components/landing/ScrollJourney';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { DemoJourney } from '@/components/landing/DemoJourney';
import { CriterionJourney } from '@/components/landing/CriterionJourney';
import './Landing.css';

const services = [
  {n:'01',title:'Software a medida',tag:'TU OPERACIÓN, TU SISTEMA',text:'Desarrollamos software a medida para centralizar información, tareas y equipos. Sistemas de gestión y aplicaciones que se adaptan a los procesos de tu empresa.',items:['Sistemas de gestión','Portales y plataformas','Integración de herramientas']},
  {n:'02',title:'Automatización de procesos',tag:'MENOS REPETICIÓN. MÁS FOCO.',text:'Automatizamos tareas repetitivas y conectamos tus herramientas: carga de datos, documentos, reportes y seguimiento. Menos trabajo manual y más tiempo para tu equipo.',items:['Flujos entre aplicaciones','Documentos y reportes','Seguimiento operativo']},
  {n:'03',title:'Agentes de inteligencia artificial',tag:'IA CON UN TRABAJO CONCRETO',text:'Implementamos inteligencia artificial para empresas: agentes que consultan información, organizan documentos y asisten a tu equipo. Con permisos definidos y revisión humana donde corresponde.',items:['Asistentes internos','Clasificación de información','Acciones conectadas a tus sistemas']},
  {n:'04',title:'Diseño y desarrollo web',tag:'UNA PRESENCIA A TU ALTURA',text:'Creamos páginas web para empresas, sitios institucionales y landing pages. Diseño a medida, navegación clara y una experiencia responsive para mostrar tu negocio en cada pantalla.',items:['Sitios institucionales','Landing pages','Experiencias interactivas']},
];
const links=[['Soluciones','#soluciones'],['Cómo trabajamos','#proceso']];
export default function Landing() {
  const [paused,setPaused]=useState(false);
  // Navegación por anclas robusta en cualquier entorno (iframe de preview,
  // producción, PWA): desplazamiento con animador propio por frames, inmune a
  // bloqueos/restauraciones de scroll de terceros (data-navgo=v3).
  const pendingHash=useRef<string|null>(null);
  const navClosing=useRef(false);
  const [menuOpen,setMenuOpen]=useState(false);
  useEffect(()=>{
    let raf=0;
    // El CSS global pone scroll-behavior:smooth en html: cada scrollTo se vuelve
    // asíncrono y rompe sondeo y animación por frames. Escribir siempre en modo
    // instantáneo anulando ese comportamiento durante el write.
    const put=(y:number)=>{
      const r=document.documentElement;
      const prev=r.style.scrollBehavior;
      r.style.scrollBehavior='auto';
      window.scrollTo(0,y);
      r.style.scrollBehavior=prev;
    };
    const targetYOf=(hash:string)=>{
      const el=document.querySelector(hash);
      if(!el) return null;
      const margin=hash==='#inicio'?0:25;
      const max=document.documentElement.scrollHeight-window.innerHeight;
      return Math.max(0,Math.min(max,el.getBoundingClientRect().top+window.scrollY-margin));
    };
    const animateTo=(hash:string)=>{
      cancelAnimationFrame(raf);
      const to0=targetYOf(hash); if(to0==null) return;
      if(matchMedia('(prefers-reduced-motion: reduce)').matches){put(to0);return;}
      const from=window.scrollY;
      const dur=Math.min(1100,450+Math.abs(to0-from)*0.04);
      const t0=performance.now();
      const ease=(t:number)=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
      const step=(now:number)=>{
        const k=Math.min(1,(now-t0)/dur);
        const to=targetYOf(hash)??to0; // el layout puede asentar en vuelo
        put(from+(to-from)*ease(k));
        if(k<1) raf=requestAnimationFrame(step);
        else {
          const tf=targetYOf(hash); if(tf!=null) put(tf);
          const el=document.querySelector(hash) as HTMLElement|null;
          if(el){ if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex','-1'); el.focus({preventScroll:true}); }
        }
      };
      raf=requestAnimationFrame(step);
    };
    // El lock de scroll del menú deja window.scrollTo inerte un tiempo después
    // de cerrarse (y resetea scrollY). Sondear hasta que la página responda.
    const whenScrollable=(cb:()=>void)=>{
      const t0=performance.now();
      const probe=()=>{
        const y=window.scrollY;
        const max=document.documentElement.scrollHeight-window.innerHeight;
        const test=y<max?y+1:Math.max(0,y-1);
        put(test);
        const moved=Math.abs(window.scrollY-test)<=1&&window.scrollY!==y;
        put(y);
        if(moved||max<=0||performance.now()-t0>3500) cb();
        else setTimeout(probe,80);
      };
      probe();
    };
    const go=(hash:string)=>{history.pushState(null,'',hash);whenScrollable(()=>animateTo(hash));};
    (window as unknown as {__dbNavGo?:(h:string)=>void}).__dbNavGo=go;
    const onClick=(e:MouseEvent)=>{
      const a=(e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement|null;
      if(!a||a.closest('.db-mobile-sheet')) return; // los del menú móvil tienen su propio camino
      const hash=a.getAttribute('href')||'';
      if(hash.length<2||!document.querySelector(hash)) return;
      e.preventDefault();
      go(hash);
    };
    document.addEventListener('click',onClick);
    // Hash inicial: doble pasada, el alto de las escenas asienta tras fuentes y canvas.
    if(location.hash){const h=location.hash;requestAnimationFrame(()=>{setTimeout(()=>{const y=targetYOf(h);if(y!=null)put(y);},150);setTimeout(()=>{const y=targetYOf(h);if(y!=null)put(y);},700);});}
    return ()=>{document.removeEventListener('click',onClick);cancelAnimationFrame(raf);};
  },[]);
  // Al cerrarse el menú móvil con un destino pendiente, desplazar cuando el
  // sheet ya soltó la página (tras su animación de salida).
  useEffect(()=>{
    if(menuOpen||!pendingHash.current) return;
    const hash=pendingHash.current; pendingHash.current=null;
    const t=setTimeout(()=>{(window as unknown as {__dbNavGo?:(h:string)=>void}).__dbNavGo?.(hash);},150);
    return ()=>clearTimeout(t);
  },[menuOpen]);
  const reduced=useReducedMotion();
  const hero=useRef<HTMLElement>(null);
  const {scrollYProgress}=useScroll({target:hero,offset:['start start','end end']});
  const y=useTransform(scrollYProgress,[0,.8],[0,-90]);
  const rotate=useTransform(scrollYProgress,[0,.8],[0,110]);
  const scale=useTransform(scrollYProgress,[0,.35,.8],[1,1.7,3.5]);
  const artX=useTransform(scrollYProgress,[0,.65],['0%','-27%']);
  const copyOpacity=useTransform(scrollYProgress,[0,.12,.32],[1,1,0]);
  const copyY=useTransform(scrollYProgress,[0,.35],[0,-130]);
  const artOpacity=useTransform(scrollYProgress,[0,.4,.78,.97],[1,1,.2,0]);
  const nextOpacity=useTransform(scrollYProgress,[0,.3,.43,.84,.985],[0,0,1,1,0]);
  const nextY=useTransform(scrollYProgress,[.3,.5], [90,0]);
  return <div className="db-site">
    <WhatsAppButton/>
    <a className="db-back-top" href="#inicio" aria-label="Volver a la portada" title="Volver a la portada"><ArrowUp size={23}/></a>
    <a className="db-skip" href="#contenido">Ir al contenido</a>
    <header className="db-nav">
      <a href="#inicio" aria-label="Digital Builders, inicio"><Logo size="md" /></a>
      <nav aria-label="Navegación principal">{links.map(([label,href])=><a key={href} href={href}>{label}</a>)}</nav>
      <a className="db-nav-cta" href="#contacto">Hablemos <ArrowUpRight size={17}/></a>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen} modal={false}><SheetTrigger className="db-mobile-menu" aria-label="Abrir menú"><Menu/></SheetTrigger><SheetContent className="db-mobile-sheet db-menu-immersive" aria-describedby={undefined} onCloseAutoFocus={(e)=>{if(navClosing.current){e.preventDefault();navClosing.current=false;}}}>
        <SheetTitle className="sr-only">Menú de Digital Builders</SheetTitle>
        <div className="db-menu-halo" aria-hidden="true"><i/><i/><i/><i/></div>
        <div className="db-menu-top"><Logo size="md"/><SheetClose className="db-menu-close" aria-label="Cerrar menú"><X size={22}/></SheetClose></div>
        <nav className="db-menu-links" aria-label="Navegación móvil">{[['Inicio','#inicio'],...links,['Hablemos','#contacto']].map(([label,href],index)=><a key={href} href={href} data-navgo="v3" style={{'--menu-order':index} as React.CSSProperties} onClick={(e)=>{e.preventDefault();pendingHash.current=href;navClosing.current=true;setMenuOpen(false);}}><span className="db-menu-number">0{index+1}</span><span className="db-menu-label">{label}</span><ArrowUpRight size={25}/></a>)}</nav>
        <div className="db-menu-footer"><span>MENOS LÍMITES.<br/><strong>MÁS POSIBILIDADES.</strong></span><a href="mailto:info@digitalbuilders.net">Conversemos <ArrowUpRight size={16}/></a></div>
      </SheetContent></Sheet>
    </header>
    <main id="contenido">
      <section id="inicio" className={`db-hero ${reduced?'db-no-motion':''}`} ref={hero}><div className="db-hero-sticky">
        <div className="db-hero-top" aria-hidden="true" />
        <motion.div className="db-art" style={reduced?{}:{y,rotate,scale,x:artX,opacity:artOpacity}}><FlowSculpture paused={paused}/><span className="db-art-coordinate">DB / CONEXIONES QUE TRANSFORMAN</span></motion.div>
        <motion.div className="db-hero-copy" style={reduced?{}:{opacity:copyOpacity,y:copyY}}><h1>Tu negocio.<br/>Menos límites.<br/><span>Más posibilidades.</span></h1><p>Transformamos procesos complejos en soluciones digitales que simplifican tu trabajo.</p><a className="db-button db-button-light" href="#contacto">Contanos tu desafío <ArrowUpRight size={20}/></a></motion.div>
        {!reduced && <motion.div className="db-hero-chapter" style={{opacity:nextOpacity,y:nextY}} aria-hidden="true"><span>LA PRÓXIMA VERSIÓN DE TU NEGOCIO</span><p>Menos fricción.<br/>Más <em>evolución.</em></p><small>Conectamos lo que hoy trabaja separado.</small></motion.div>}
        <div className="db-hero-bottom"><a href="#vision"><ArrowDown size={18}/> EXPLORÁ LO QUE PODEMOS HACER</a><button onClick={()=>setPaused(!paused)} aria-label={paused?'Reanudar animación':'Pausar animación'}>{paused?<Play size={16}/>:<Pause size={16}/>}<span>{paused?'Reanudar':'Pausar'}</span></button><span>DISEÑADO PARA AVANZAR ↗</span></div>
      </div></section>
      <CriterionJourney/>
      <VisionJourney/>
      <FlowJourney/>
      <OperatingJourney/>
      <ServicesJourney services={services}/>
      <DemoJourney/>
      <ProcessJourney/>
      <ContactJourney/>
    </main>
    <footer className="db-footer"><Logo size="md"/><span>SOFTWARE CON PROPÓSITO.</span><div><a href="https://www.instagram.com/digitalbuilders_oficial/" target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={14}/></a><span>© {new Date().getFullYear()} Digital Builders</span></div><a href="#inicio" aria-label="Volver al inicio"><ArrowUpRight/></a></footer>
  </div>;
}
