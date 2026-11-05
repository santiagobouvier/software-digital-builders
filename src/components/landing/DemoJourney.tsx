import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionStyle } from 'framer-motion';
import { ArrowUpRight, Check, FileText, Mail, Sparkles } from 'lucide-react';
import './DemoJourney.css';

const examples = [
  { kind: 'operations', number: '01', title: 'Un pedido.\nTodo en movimiento.', intro: 'Del correo a tu operación, sin volver a cargar la misma información.', steps: [
    { name: 'Recibir', detail: 'Un pedido llega por correo con un documento adjunto. El flujo reúne la información en un solo lugar.' },
    { name: 'Organizar', detail: 'Identifica los datos necesarios y señala lo que falta. Una excepción se deriva a una persona, no se inventa.' },
    { name: 'Dar seguimiento', detail: 'El pedido queda preparado para el equipo responsable, con estado y próximo paso visibles.' },
  ] },
  { kind: 'agent', number: '02', title: 'Una pregunta.\nEl contexto completo.', intro: 'Un agente que consulta tus fuentes y prepara una respuesta que podés revisar.', steps: [
    { name: 'Consultar', detail: 'Tu equipo pregunta en lenguaje natural. El agente busca únicamente en las fuentes que tiene autorizadas.' },
    { name: 'Relacionar', detail: 'Reúne documentos y antecedentes relevantes. Muestra de dónde sale la información y qué necesita confirmar.' },
    { name: 'Preparar', detail: 'Entrega un resumen y un próximo paso sugerido. Las decisiones y los envíos quedan bajo tu control.' },
  ] },
];

function DemoScene({ example }: { example: typeof examples[number] }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 65, damping: 28, mass: 1 });
  const rotate = useTransform(progress, [0, 1], [-18, 28]);
  const scale = useTransform(progress, [0, .4, .8, 1], [.82, 1, 1.08, 1.08]);
  const spread = useTransform(progress, [0, .45], [90, 0]);
  const left = useTransform(spread, value => -value);
  const mobileLeft = useTransform(left, value => `${value * .22}px`);
  const mobileRight = useTransform(spread, value => `${value * .22}px`);
  const output = useTransform(progress, [.52, .75], [0, 1]);
  const rise = useTransform(progress, [.52, .75], [45, 0]);
  const scan = useTransform(progress, [.1, .6], ['0%', '100%']);
  const isAgent = example.kind === 'agent';
  return <section ref={ref} className={`db-demo-story ${isAgent ? 'db-demo-light' : ''} ${reduced ? 'db-demo-still' : ''}`} aria-labelledby={`demo-${example.number}`}>
    <div className="db-demo-pin">
      <div className="db-demo-heading"><span className="db-eyebrow">EN LA PRÁCTICA / {example.number}</span><h2 id={`demo-${example.number}`}>{example.title.split('\n').map(line => <span key={line}>{line}</span>)}</h2><p>{example.intro}</p></div>
      <div className="db-demo-theatre" aria-hidden="true">
        <motion.div className="db-demo-orbit" style={reduced ? {} : { rotate, scale }}><div/><div/></motion.div>
        <div className="db-demo-sources">
          <motion.div style={reduced ? {} : { x: left, rotate: -7, '--mobile-x': mobileLeft } as MotionStyle}><Mail size={19}/><span>{isAgent ? 'Consulta del equipo' : 'Nuevo pedido'}<small>{isAgent ? '¿Qué falta para avanzar?' : 'Documento recibido'}</small></span></motion.div>
          <motion.div style={reduced ? {} : { x: spread, rotate: 7, '--mobile-x': mobileRight } as MotionStyle}><FileText size={19}/><span>{isAgent ? 'Fuentes autorizadas' : 'Datos del pedido'}<small>{isAgent ? 'Minuta · documento · historial' : 'Detalle · responsable · fecha'}</small></span></motion.div>
        </div>
        <motion.div className="db-demo-engine" style={reduced ? {} : { scale }}><Sparkles/><strong>{isAgent ? 'Contexto conectado' : 'Información organizada'}</strong><span>{isAgent ? 'BUSCAR → RELACIONAR → PREPARAR' : 'LEER → VALIDAR → ORGANIZAR'}</span><motion.div className="db-demo-scan" style={reduced ? { display: 'none' } : { top: scan }}/></motion.div>
        <motion.div className="db-demo-result" style={reduced ? {} : { opacity: output, y: rise }}><span><Check size={17}/>{isAgent ? 'BORRADOR PARA REVISIÓN' : 'LISTO PARA EL EQUIPO'}</span><strong>{isAgent ? 'Lo importante, a mano.' : 'Cada pedido tiene un próximo paso.'}</strong><p>{isAgent ? 'Resumen con fuentes y pendientes por confirmar. Nada se envía automáticamente.' : 'Responsable asignado, información reunida y seguimiento visible.'}</p><div>{isAgent ? 'Revisión humana' : 'Estado: preparado'}<ArrowUpRight size={18}/></div></motion.div>
      </div>
      <div className="db-demo-stages">{example.steps.map((step, index) => <DemoStage key={step.name} step={step} index={index} progress={progress} reduced={!!reduced}/>)}</div>
      <p className="db-demo-note">DEMOSTRACIÓN ILUSTRATIVA · DATOS FICTICIOS · CADA IMPLEMENTACIÓN SE DEFINE A MEDIDA</p>
      <motion.div className="db-demo-timeline" style={{ scaleX: reduced ? 1 : progress }}/>
    </div>
  </section>;
}

function DemoStage({ step, index, progress, reduced }: { step: { name: string; detail: string }; index: number; progress: import('framer-motion').MotionValue<number>; reduced: boolean }) {
  const opacity = useTransform(progress, [index * .26, index * .26 + .15], [.38, 1]);
  const y = useTransform(progress, [index * .26, index * .26 + .15], [15, 0]);
  const phase = useTransform(progress, index === 0 ? [0, .24, .32] : index === 1 ? [.24, .32, .57, .65] : [.57, .65, 1], index === 0 ? [1, 1, 0] : index === 1 ? [0, 1, 1, 0] : [0, 1, 1]);
  return <motion.article style={reduced ? {} : { opacity, y, '--phase-opacity': phase } as MotionStyle}><span>0{index + 1}</span><h3>{step.name}</h3><p>{step.detail}</p></motion.article>;
}

export function DemoJourney() { return <div className="db-demo-collection">{examples.map(example => <DemoScene key={example.number} example={example}/>)}</div>; }
