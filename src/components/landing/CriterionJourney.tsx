import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import './CriterionJourney.css';

function CriterionField({ progress, paused, reduced }: { progress: MotionValue<number>; paused: boolean; reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let width = 0, height = 0, frame = 0, visible = true, last = 0;
    const resize = () => {
      const box = canvas.getBoundingClientRect();
      width = box.width; height = box.height;
      const ratio = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = width * ratio; canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    intersection.observe(canvas);
    const draw = (time: number) => {
      frame = requestAnimationFrame(draw);
      if (!visible || document.hidden || time - last < 32) return;
      last = time;
      const phase = reduced ? 1 : Math.max(0, Math.min(1, (progress.get() - .12) / .64));
      const blend = phase * phase * (3 - 2 * phase);
      const t = paused || reduced ? .5 : time * .00008;
      ctx.clearRect(0, 0, width, height);
      const size = Math.min(width, height) * .31;
      const rings = width < 600 ? 34 : 58;
      for (let j = 0; j < rings; j++) {
        ctx.beginPath();
        const v = j / rings * Math.PI * 2;
        for (let i = 0; i <= 120; i++) {
          const u = i / 120 * Math.PI * 2;
          const radius = 1 + .28 * Math.cos(v);
          const noise = Math.sin(u * 3 + v * 2 + t) * .6 + Math.cos(u * 5 - v + t) * .23;
          const r = radius + noise * (1 - blend);
          const x = Math.cos(u) * r;
          const y = Math.sin(u) * r;
          const z = .28 * Math.sin(v) + (1 - blend) * Math.sin(u * 4 + v + t) * .65;
          const angle = t + blend * 1.2;
          const xx = x * Math.cos(angle) + z * Math.sin(angle);
          const zz = -x * Math.sin(angle) + z * Math.cos(angle);
          const yy = y * Math.cos(.7) - zz * Math.sin(.7);
          const depth = y * Math.sin(.7) + zz * Math.cos(.7);
          const perspective = 4 / (4 + depth);
          const px = width / 2 + xx * size * perspective;
          const py = height / 2 + yy * size * perspective;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        const gradient = ctx.createLinearGradient(0, height * .2, width, height * .8);
        gradient.addColorStop(0, '#d5ffff'); gradient.addColorStop(.45, '#00cce5'); gradient.addColorStop(1, '#165f70');
        ctx.strokeStyle = gradient; ctx.globalAlpha = .25 + blend * .35 + (j / rings) * .3;
        ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    resize(); frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); resizeObserver.disconnect(); intersection.disconnect(); };
  }, [progress, paused, reduced]);
  return <canvas ref={canvasRef} aria-hidden="true"/>;
}

export function CriterionJourney() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 65, damping: 28, mass: 1 });
  const firstOpacity = useTransform(progress, [0, .25, .48], [1, 1, 0]);
  const firstY = useTransform(progress, [.25, .48], [0, -60]);
  const secondOpacity = useTransform(progress, [.45, .68], [0, 1]);
  const secondY = useTransform(progress, [.45, .68], [60, 0]);
  const scale = useTransform(progress, [0, .45, 1], [.9, 1.2, 1]);
  return <section ref={ref} className={`db-criterion ${reduced ? 'db-criterion-still' : ''}`} aria-labelledby="criterion-title">
    <div className="db-criterion-pin">
      <div className="db-criterion-top"><span>INTELIGENCIA CON DIRECCIÓN</span><button onClick={() => setPaused(value => !value)} aria-label={paused ? 'Reanudar figura de IA' : 'Pausar figura de IA'}>{paused ? <Play size={14}/> : <Pause size={14}/>} {paused ? 'Reanudar' : 'Pausar'}</button></div>
      <motion.div className="db-criterion-art" style={reduced ? {} : { scale }}><CriterionField progress={progress} paused={paused} reduced={!!reduced}/></motion.div>
      <h2 id="criterion-title" className="sr-only">La IA sin criterio es humo. La IA con criterio es productividad.</h2>
      <div className="db-criterion-messages" aria-hidden="true">
        <motion.p className="db-criterion-first" style={reduced ? {} : { opacity: firstOpacity, y: firstY }}>La IA sin criterio<br/>es <em>humo.</em></motion.p>
        <motion.p className="db-criterion-second" style={reduced ? {} : { opacity: secondOpacity, y: secondY }}>La IA con criterio<br/>es <em>productividad.</em></motion.p>
      </div>
      <div className="db-criterion-bottom"><p>Entender tu negocio. Elegir dónde aporta la IA.<br/>Comprobar qué mejora en el trabajo real.</p><span>MENOS RUIDO.<br/>MÁS PROPÓSITO.</span></div>
      <motion.div className="db-criterion-progress" style={{ scaleX: reduced ? 1 : progress }}/>
    </div>
  </section>;
}
