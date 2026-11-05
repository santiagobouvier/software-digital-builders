import { motion, useReducedMotion } from "framer-motion";

interface WhatsAppButtonProps { phoneNumber?: string; message?: string }
export const WhatsAppButton = ({phoneNumber="59898543623",message="Hola Digital Builders, me gustaría conversar sobre un proyecto."}:WhatsAppButtonProps) => {
  const reduced=useReducedMotion();
  return <motion.a className="db-whatsapp" href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" aria-label="Contactar a Digital Builders por WhatsApp" initial={reduced?false:{opacity:0,y:20,scale:.8}} animate={{opacity:1,y:0,scale:1}} transition={{type:"spring",stiffness:180,damping:20,delay:.5}} whileHover={reduced?{}:{y:-4,scale:1.06}} whileTap={reduced?{}:{scale:.95}}>
    <span className="db-whatsapp-halo" aria-hidden="true"/>
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.91 11.91 0 0 0 12.05 0C5.46 0 .1 5.35.1 11.94c0 2.1.55 4.16 1.6 5.98L0 24l6.26-1.64a11.96 11.96 0 0 0 5.78 1.47h.01c6.58 0 11.94-5.35 11.95-11.94a11.87 11.87 0 0 0-3.48-8.41ZM12.05 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.97.99-3.63-.24-.37a9.88 9.88 0 0 1-1.52-5.24c0-5.47 4.45-9.92 9.93-9.92a9.86 9.86 0 0 1 7.02 2.91 9.85 9.85 0 0 1 2.9 7.02c0 5.48-4.45 9.85-9.96 9.85Zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z"/></svg>
    <span className="db-whatsapp-label">Hablemos por WhatsApp</span>
  </motion.a>;
};
