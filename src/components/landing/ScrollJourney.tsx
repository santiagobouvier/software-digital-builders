import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ArrowUpRight, ArrowRight, Check, Files, Workflow, Sparkles } from 'lucide-react';

function useChapter() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']});
  const progress=useSpring(scrollYProgress,{stiffness:65,damping:28,mass:1,restDelta:0.0001});
  return {ref,progress,reduced};
}
function InkLine({children,progress,start,end}:{children:React.ReactNode;progress:MotionValue<number>;start:number;end:number}) {
  const color=useTransform(progress,[start,end],['#a8b7b5','#101719']);
  const y=useTransform(progress,[start,end],[14,0]);
  return <motion.span style={{color,y}}>{children}</motion.span>;
}
export function VisionJourney(){
  const {ref,progress,reduced}=useChapter();
  const spin=useTransform(progress,[0,1],[0,180]);
  const x=useTransform(progress,[0,1],['7%','-8%']);
  return <section id="vision" ref={ref} className={`db-journey db-vision-journey ${reduced?'is-still':''}`}><div className="db-journey-pin db-vision db-section">
    <div className="db-eyebrow"><span>01 / NUESTRA MIRADA</span><span>LA TECNOLOGÍA ES EL MEDIO.</span></div>
    <motion.div className="db-vision-watermark" style={reduced?{}:{x}} aria-hidden="true">RE:PENSAR</motion.div>
    <h2 className="db-ink-title">{reduced?<>No necesitás más herramientas.<br/>Necesitás que todo funcione mejor.</>:<><InkLine progress={progress} start={0} end={.15}>No necesitás más</InkLine><InkLine progress={progress} start={.12} end={.35}>herramientas.</InkLine><InkLine progress={progress} start={.32} end={.56}>Necesitás que todo</InkLine><InkLine progress={progress} start={.53} end={.78}>funcione mejor.</InkLine></>}</h2>
    <div className="db-vision-bottom"><motion.span className="db-asterisk" style={reduced?{}:{rotate:spin}} aria-hidden="true">✳</motion.span><p>Entendemos dónde se pierde tiempo, se repiten tareas o se desconecta la información. Después construimos la solución adecuada para tu negocio.</p><p>Software, automatización e inteligencia artificial. Con un objetivo concreto: mejorar tu operación.</p></div>
    <motion.div className="db-chapter-progress" style={{scaleX:reduced?1:progress}}/>
  </div></section>;
}
function InputNode({label,index,progress,reduced}:{label:string;index:number;progress:MotionValue<number>;reduced:boolean}) {
  const x=useTransform(progress,[.08+index*.12,.3+index*.12],[[ -65,10,65][index],0]);
  const y=useTransform(progress,[.08+index*.12,.3+index*.12],[[55,-30,95][index],0]);
  const rotate=useTransform(progress,[.08+index*.12,.3+index*.12],[[-22,15,22][index],0]);
  return <motion.span style={reduced?{}:{x,y,rotate}}>{label}<Files size={14}/></motion.span>;
}
export function FlowJourney(){
  const {ref,progress,reduced}=useChapter();
  const line=useTransform(progress,[.5,.73],[0,1]);
  const core=useTransform(progress,[.35,.7],[.65,1]);
  const output=useTransform(progress,[.73,.88],[0,1]);
  const outputY=useTransform(progress,[.73,.88],[30,0]);
  const turn=useTransform(progress,[0,1],[-15,15]);
  return <section ref={ref} className={`db-journey db-flow-journey ${reduced?'is-still':''}`} aria-labelledby="transform-title"><div className="db-journey-pin db-transformation db-section"><div className="db-eyebrow"><span>DE LA FRICCIÓN AL FLUJO</span><span>UNA FORMA MEJOR DE TRABAJAR</span></div><div className="db-transform-layout"><div><h2 id="transform-title">Lo complejo,<br/><em>conectado.</em></h2><p>Menos copiar y pegar.<br/>Menos información perdida.<br/>Más espacio para hacer crecer tu negocio.</p><motion.div className="db-orbit-mark" style={reduced?{}:{rotate:turn}} aria-hidden="true"><Workflow size={50}/></motion.div></div><div className="db-flow-demo" aria-label="La información dispersa se conecta y produce un resultado"><div className="db-flow-inputs">{['Mensajes','Documentos','Tu sistema'].map((label,index)=><InputNode key={label} label={label} index={index} progress={progress} reduced={!!reduced}/>)}</div><motion.div className="db-flow-lines" style={{scaleY:reduced?1:line,transformOrigin:'top'}}/><motion.div className="db-flow-core" style={{scale:reduced?1:core}}><span>db.</span><small>CONECTAR · PROCESAR · RESOLVER</small></motion.div><motion.div className="db-flow-output" style={reduced?{}:{opacity:output,y:outputY}}><Check size={18}/>La información correcta.<br/>En el lugar correcto.<ArrowUpRight/></motion.div><div className="db-demo-caption">ESQUEMA ILUSTRATIVO / CADA SOLUCIÓN ES A MEDIDA</div></div></div><motion.div className="db-chapter-progress" style={{scaleX:reduced?1:progress}}/></div></section>;
}
type Service={n:string;title:string;tag:string;text:string;items:string[]};
function ServiceCard({service,index}:{service:Service;index:number}){
  const ref=useRef<HTMLDivElement>(null), reduced=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:['start end','start start']});
  const scale=useTransform(scrollYProgress,[0,.7],[.88,1]);
  const rotateX=useTransform(scrollYProgress,[0,.7],[14,0]);
  return <div className="db-service-stage" ref={ref}><motion.article className={`db-service-panel db-panel-${index}`} style={reduced?{}:{scale,rotateX}}><div className="db-service-panel-top"><span>CAPACIDAD / {service.n}</span><Sparkles size={20}/></div><div className="db-service-panel-layout"><span className="db-service-giant" aria-hidden="true">{service.n}</span><div><span className="db-eyebrow">{service.tag}</span><h3>{service.title}</h3><p>{service.text}</p><ul>{service.items.map(item=><li key={item}>{item}</li>)}</ul><a href="#contacto">Exploremos tu proyecto <ArrowUpRight size={20}/></a></div></div></motion.article></div>;
}
export function ServicesJourney({services}:{services:Service[]}){
  return <section id="soluciones" className="db-services db-section db-services-journey"><div className="db-section-heading"><div className="db-eyebrow">02 / LO QUE CONSTRUIMOS</div><h2>Un problema real.<br/><span>La solución correcta.</span></h2><p>Desde Montevideo, desarrollamos sitios web, software y soluciones de automatización e IA para empresas de Uruguay. Elegimos la tecnología después de entender el desafío.</p></div><div className="db-service-deck">{services.map((service,index)=><ServiceCard key={service.n} service={service} index={index}/>)}</div></section>;
}
const steps=[['01','Entender.','Primero, tu negocio.','Conversamos sobre tu operación, detectamos el problema y definimos qué debería mejorar.'],['02','Construir.','Algo concreto para probar.','Diseñamos y desarrollamos una solución con alcance claro. La ves, la probás y la ajustamos.'],['03','Evolucionar.','Una solución en marcha.','Implementamos, acompañamos a tu equipo y revisamos el resultado. El desarrollo no termina en una entrega.']];
function ProcessStep({step,index}:{step:string[];index:number}){
  const ref=useRef<HTMLDivElement>(null),reduced=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});
  const x=useTransform(scrollYProgress,[0,.4,.8],[60,0,-20]);
  const opacity=useTransform(scrollYProgress,[0,.25,.75,1],[.2,1,1,.3]);
  return <motion.div ref={ref} className="db-process-chapter" style={reduced?{}:{x,opacity}}><span className="db-eyebrow">ETAPA {step[0]} / 03</span><h3>{step[1]}</h3><h4>{step[2]}</h4><p>{step[3]}</p><span className="db-process-orbit" aria-hidden="true">{index===0?<Files/>:index===1?<Workflow/>:<Sparkles/>}</span></motion.div>;
}
export function ProcessJourney(){return <section id="proceso" className="db-process db-section db-process-journey"><div className="db-process-fixed"><div className="db-eyebrow">03 / DEL PROBLEMA A LA SOLUCIÓN</div><h2>Una idea.<br/>Un recorrido.<br/><span>Un cambio real.</span></h2><a href="#contacto">Empecemos por tu desafío <ArrowRight size={18}/></a></div><div>{steps.map((step,index)=><ProcessStep key={step[0]} step={step} index={index}/>)}</div></section>}
export function ExperienceJourney({clients}:{clients:string[][]}){
  const {ref,progress,reduced}=useChapter();
  const x=useTransform(progress,[0,1],['0%','-18%']);
  return <section id="experiencia" ref={ref} className={`db-journey db-experience-journey ${reduced?'is-still':''}`}><div className="db-journey-pin db-experience db-section"><div className="db-eyebrow">04 / RELACIONES QUE CONSTRUIMOS</div><motion.h2>Distintos negocios.<br/><span>La misma dedicación.</span></motion.h2><p>Algunas de las empresas que nos eligieron para su presencia digital.</p><motion.div className="db-client-ribbon" style={reduced?{}:{x}} aria-hidden="true">CONFIANZA. CONSTRUIDA.</motion.div><div className="db-client-list">{clients.map(([name,url])=><a href={url} target="_blank" rel="noopener noreferrer" key={name}>{name}<ArrowUpRight size={20}/></a>)}</div><motion.div className="db-chapter-progress" style={{scaleX:reduced?1:progress}}/></div></section>;
}
export function ContactJourney(){
  const ref=useRef<HTMLElement>(null),reduced=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:['start end','end end']});
  const scale=useTransform(scrollYProgress,[0,.8],[.8,1]);
  const radius=useTransform(scrollYProgress,[0,1],[110,0]);
  return <section id="contacto" ref={ref} className="db-contact-shell"><motion.div className="db-contact db-section" style={reduced?{}:{scale,borderRadius:radius}}><div className="db-eyebrow"><span>EL PRÓXIMO PASO EMPIEZA CON UNA CONVERSACIÓN.</span><span>↙</span></div><motion.h2>¿Qué podemos<br/><em>simplificar?</em></motion.h2><div className="db-contact-bottom"><p>Contanos qué tarea te consume tiempo,<br/>qué proceso se traba o qué idea querés construir.</p><a className="db-button db-button-dark" href="mailto:info@digitalbuilders.net?subject=Hablemos%20de%20mi%20proyecto">Hablemos de tu proyecto <ArrowUpRight size={22}/></a></div><a className="db-mail" href="mailto:info@digitalbuilders.net">info@digitalbuilders.net</a></motion.div></section>;
}
