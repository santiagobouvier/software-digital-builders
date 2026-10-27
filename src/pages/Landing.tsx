import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ArrowUp, ArrowDown, Pause, Play, Menu } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { FlowSculpture } from '@/components/landing/FlowSculpture';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { VisionJourney, FlowJourney, ServicesJourney, ProcessJourney, ExperienceJourney, ContactJourney } from '@/components/landing/ScrollJourney';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import './Landing.css';

const services = [
  {n:'01',title:'Software a medida',tag:'TU OPERACIÓN, TU SISTEMA',text:'Unificamos información, tareas y equipos en herramientas que se adaptan a cómo trabaja tu empresa. De una operación dispersa a una visión clara.',items:['Sistemas de gestión','Portales y plataformas','Integración de herramientas']},
  {n:'02',title:'Automatización de procesos',tag:'MENOS REPETICIÓN. MÁS FOCO.',text:'Conectamos los pasos que hoy hacés a mano. Para que la información fluya y tu equipo pueda dedicar su tiempo a lo que realmente importa.',items:['Flujos entre aplicaciones','Documentos y reportes','Seguimiento operativo']},
  {n:'03',title:'Agentes de inteligencia artificial',tag:'IA CON UN TRABAJO CONCRETO',text:'Agentes que consultan información, organizan documentos y asisten a tu equipo. Con instrucciones claras, permisos definidos y revisión humana donde corresponde.',items:['Asistentes internos','Clasificación de información','Acciones conectadas a tus sistemas']},
  {n:'04',title:'Experiencias web',tag:'UNA PRESENCIA A TU ALTURA',text:'Diseñamos sitios y experiencias digitales que hacen tangible el valor de tu negocio. Claros para quien los visita. Distintivos para quien los recuerda.',items:['Sitios institucionales','Landing pages','Experiencias interactivas']},
];
const clients = [ ['Consteel','https://www.consteelconstrucciones.com/'], ['Shinrin-yoku','https://shinrinyoku.uy'], ['Quevedo Arte','https://quevedoarte.com'], ['The English Room','https://theenglishroom.edu.uy/'], ['Tabeira de León','https://tabeiradeleon.com/'] ];
const links=[['Soluciones','#soluciones'],['Cómo trabajamos','#proceso'],['Experiencia','#experiencia']];
export default function Landing() {
  const [paused,setPaused]=useState(false);
  const reduced=useReducedMotion();
  const hero=useRef<HTMLElement>(null);
  const {scrollYProgress}=useScroll({target:hero,offset:['start start','end end']});
  const y=useTransform(scrollYProgress,[0,.8],[0,-90]);
  const rotate=useTransform(scrollYProgress,[0,.8],[0,110]);
  const scale=useTransform(scrollYProgress,[0,.35,.8],[1,1.7,3.5]);
  const artX=useTransform(scrollYProgress,[0,.65],['0%','-27%']);
  const copyOpacity=useTransform(scrollYProgress,[0,.12,.32],[1,1,0]);
  const copyY=useTransform(scrollYProgress,[0,.35],[0,-130]);
  const artOpacity=useTransform(scrollYProgress,[0,.4,.75,1],[1,1,.22,.08]);
  const nextOpacity=useTransform(scrollYProgress,[0,.3,.43,.76,.9],[0,0,1,1,0]);
  const nextY=useTransform(scrollYProgress,[.3,.5], [90,0]);
  return <div className="db-site">
    <WhatsAppButton/>
    <a className="db-back-top" href="#inicio" aria-label="Volver a la portada" title="Volver a la portada"><ArrowUp size={23}/></a>
    <a className="db-skip" href="#contenido">Ir al contenido</a>
    <header className="db-nav">
      <a href="#inicio" aria-label="Digital Builders, inicio"><Logo size="md" /></a>
      <nav aria-label="Navegación principal">{links.map(([label,href])=><a key={href} href={href}>{label}</a>)}</nav>
      <a className="db-nav-cta" href="#contacto">Hablemos <ArrowUpRight size={17}/></a>
      <Sheet><SheetTrigger className="db-mobile-menu" aria-label="Abrir menú"><Menu/></SheetTrigger><SheetContent className="db-mobile-sheet"><SheetTitle>Digital Builders</SheetTitle>{[...links,['Hablemos','#contacto']].map(([label,href])=><SheetClose asChild key={href}><a href={href}>{label}<ArrowUpRight/></a></SheetClose>)}</SheetContent></Sheet>
    </header>
    <main id="contenido">
      <section id="inicio" className={`db-hero ${reduced?'db-no-motion':''}`} ref={hero}><div className="db-hero-sticky">
        <div className="db-hero-top" aria-hidden="true" />
        <motion.div className="db-art" style={reduced?{}:{y,rotate,scale,x:artX,opacity:artOpacity}}><FlowSculpture paused={paused}/><span className="db-art-coordinate">DB / CONEXIONES QUE TRANSFORMAN</span></motion.div>
        <motion.div className="db-hero-copy" style={reduced?{}:{opacity:copyOpacity,y:copyY}}><h1>Tu negocio.<br/>Menos límites.<br/><span>Más posibilidades.</span></h1><p>Transformamos procesos complejos en soluciones digitales que simplifican tu trabajo.</p><a className="db-button db-button-light" href="#contacto">Contanos tu desafío <ArrowUpRight size={20}/></a></motion.div>
        {!reduced && <motion.div className="db-hero-chapter" style={{opacity:nextOpacity,y:nextY}} aria-hidden="true"><span>LA PRÓXIMA VERSIÓN DE TU NEGOCIO</span><p>Menos fricción.<br/>Más <em>evolución.</em></p><small>Conectamos lo que hoy trabaja separado.</small></motion.div>}
        <div className="db-hero-bottom"><a href="#vision"><ArrowDown size={18}/> EXPLORÁ LO QUE PODEMOS HACER</a><button onClick={()=>setPaused(!paused)} aria-label={paused?'Reanudar animación':'Pausar animación'}>{paused?<Play size={16}/>:<Pause size={16}/>}<span>{paused?'Reanudar':'Pausar'}</span></button><span>DISEÑADO PARA AVANZAR ↗</span></div>
      </div></section>
      <VisionJourney/>
      <FlowJourney/>
      <section className="db-operating-steps db-section" aria-labelledby="operating-title">
        <div className="db-eyebrow">DEL EFECTO VISUAL AL CAMBIO REAL</div>
        <h2 id="operating-title">Así cambia tu día a día.</h2>
        <div className="db-operating-grid">
          <article><span>01 / CENTRALIZAR</span><h3>La información deja de estar dispersa.</h3><p>Pedidos, documentos y tareas reunidos en un mismo flujo. Menos búsquedas entre mensajes y planillas.</p></article>
          <article><span>02 / SIMPLIFICAR</span><h3>Lo repetitivo deja de ocupar tu tiempo.</h3><p>Los datos pasan de una herramienta a otra sin volver a cargarlos. Tu equipo revisa las excepciones y conserva el control.</p></article>
          <article><span>03 / ENTENDER</span><h3>Sabés qué pasó y qué sigue.</h3><p>Estados claros, responsables y próximos pasos visibles. Una operación que podés seguir y mejorar.</p></article>
        </div>
      </section>
      <ServicesJourney services={services}/>
      <ProcessJourney/>
      <ExperienceJourney clients={clients}/>
      <ContactJourney/>
    </main>
    <footer className="db-footer"><Logo size="md"/><span>SOFTWARE CON PROPÓSITO.</span><div><a href="https://www.instagram.com/digitalbuilders_oficial/" target="_blank" rel="noopener noreferrer">Instagram <ArrowUpRight size={14}/></a><span>© {new Date().getFullYear()} Digital Builders</span></div><a href="#inicio" aria-label="Volver al inicio"><ArrowUpRight/></a></footer>
  </div>;
}
