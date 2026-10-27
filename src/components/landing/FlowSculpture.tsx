import { useEffect, useRef } from 'react';

/** Original procedural sculpture: no external models or tracking. */
export function FlowSculpture({ paused = false }: { paused?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, visible = true, width = 0, height = 0, last = 0;
    const pointer = { x: 0, y: 0 };
    const resize = () => {
      const box = canvas.getBoundingClientRect(); width = box.width; height = box.height;
      const dpr = Math.min(devicePixelRatio, 1.5);
      canvas.width = width * dpr; canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const observer = new ResizeObserver(resize); observer.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); intersection.observe(canvas);
    const move = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); pointer.x = (e.clientX-r.left)/r.width-.5; pointer.y=(e.clientY-r.top)/r.height-.5; };
    canvas.addEventListener('pointermove', move);
    const draw = (time: number) => {
      frame = requestAnimationFrame(draw);
      if (!visible || document.hidden || time-last < 32) return;
      last = time;
      const t = paused || media.matches ? .6 : time * .00012;
      ctx.clearRect(0,0,width,height);
      const scale = Math.min(width,height) * .29;
      const ry = t + pointer.x*.2, rx = .55 + pointer.y*.15;
      const project = (x:number,y:number,z:number) => {
        const xx=x*Math.cos(ry)+z*Math.sin(ry), zz=-x*Math.sin(ry)+z*Math.cos(ry);
        const yy=y*Math.cos(rx)-zz*Math.sin(rx), zzz=y*Math.sin(rx)+zz*Math.cos(rx);
        const p=4.7/(4.7+zzz);
        return {x:width/2+xx*scale*p,y:height/2+yy*scale*p,z:zzz};
      };
      const rings: {points:ReturnType<typeof project>[]; depth:number; band:number}[]=[];
      const count=width<600?40:62;
      for(let j=0;j<count;j++) {
        const v=j/count*Math.PI*2; const points=[];
        for(let i=0;i<=160;i++) {
          const u=i/160*Math.PI*2;
          const radius=1.12+.29*Math.cos(v+u*3);
          points.push(project(radius*Math.cos(u),radius*Math.sin(u),.42*Math.sin(u*3)+.28*Math.sin(v+u*3)));
        }
        rings.push({points,depth:points.reduce((a,p)=>a+p.z,0)/points.length,band:j/count});
      }
      rings.sort((a,b)=>b.depth-a.depth);
      for(const ring of rings) {
        ctx.beginPath(); ring.points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
        const g=ctx.createLinearGradient(width*.2,height*.2,width*.8,height*.8);
        g.addColorStop(0,'#e7ffff'); g.addColorStop(.27,'#77e9ee'); g.addColorStop(.53,'#0693a6'); g.addColorStop(.74,'#befaff'); g.addColorStop(1,'#047082');
        ctx.strokeStyle=g; ctx.globalAlpha=.55+ring.band*.4; ctx.lineWidth=width<600?1.25:1.5; ctx.stroke();
      }
      ctx.globalAlpha=1;
    };
    resize(); frame=requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); canvas.removeEventListener('pointermove',move); };
  },[paused]);
  return <canvas ref={ref} className="db-sculpture" aria-hidden="true" />;
}
