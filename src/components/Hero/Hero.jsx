import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const Hero = () => {
  const ref = useRef(null); // Referência ao elemento Hero
  const isInView = useInView(ref, { once: true }); // Detecta visibilidade (uma vez)

  return (
    <motion.section
      className='relative h-screen w-full bg-cover bg-center bg-no-repeat border-b-[10px]'
      ref={ref}
      style={{ backgroundImage: `url('/img/fundohero.png')` }} 
      initial={{ opacity: 0, y: 50 }} // Começa invisível e 50px abaixo
      animate={isInView ? { opacity: 1, y: 0 } : {}} // Anima só quando visível
      transition={{ duration: 0.8 }} // Duração da animação
    ></motion.section>
  );
};

export default Hero;