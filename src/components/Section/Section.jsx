
import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Section = ({ title, description, buttonText, imageSrc, url, rowReverse}) => {
  const navigate = useNavigate();
  const ref = useRef(null); // Referência ao elemento da seção
  const isInView = useInView(ref, { once: true }); // Detecta quando está visível (executa uma vez)

  const handleClick = () => {
    navigate(url);
  };

  return (
    <div className={`w-full flex ${rowReverse ? 'flex-row-reverse' : 'flex-row'} items-center p-0 box-border bg-[#F5EEEE]`} ref={ref}>
      <motion.div
        className="section-flex-[2] max-w-[50%] mx-0"
        initial={{ opacity: 0, x: -100 }} // Começa invisível e 100px à esquerda
        animate={isInView ? { opacity: 1, x: 0 } : {}} // Anima só quando visível
        transition={{ duration: 1.2 }} // Duração da animação
      >
        <img src={imageSrc} alt={title} />
      </motion.div>
      <motion.div
        className="section-flex-[2]"
        initial={{ opacity: 0, x: -150 }} // Começa invisível e 100px à esquerda
        animate={isInView ? { opacity: 1, x: 0 } : {}} // Anima só quando visível
        transition={{ duration: 1.2, delay: 0.2 }} // Pequeno delay para sequência
      >
        <h2 className='text-[3rem] mb-[70px] ml-[50px] mr-[30px] text-[#0c7403] font-[Poppins]'>{title}</h2>
        <p>{description}</p>
        <button onClick={handleClick} className="px-[50px] py-[20px] bg-[#6cc24a] hover:bg-[#5aa73e] text-white border-none rounded-md font-medium cursor-pointer transition-colors duration-300 text-[1.3rem]">
          {buttonText}
        </button>
      </motion.div>
    </div>
  );
};

export default Section;