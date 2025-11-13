import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Section = ({
  title,
  description,
  buttonText,
  imageSrc,
  url,
  rowReverse = false,
}) => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleClick = () => navigate(url);

  // Direção da animação depende do lado da imagem
  const imageInitialX = rowReverse ? 100 : -100;
  const textInitialX = rowReverse ? -100 : 100;

  return (
    <section
      ref={ref}
      className={`w-full flex ${
        rowReverse ? "flex-row-reverse" : "flex-row"
      } items-center justify-between bg-[#F5EEEE]`}
    >
      {/* Imagem */}
      <motion.div
        className="w-1/2 flex justify-center items-center"
        initial={{ opacity: 0, x: imageInitialX }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.2 }}
      >
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </motion.div>

      {/* Texto */}
      <motion.div
        className="w-1/2 flex flex-col justify-center px-12 py-16"
        initial={{ opacity: 0, x: textInitialX }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.2, delay: 0.2 }}
      >
        <h2 className="text-[3rem] mb-6 text-[#0c7403] font-Poppins">
          {title}
        </h2>
        <p className="text-lg mb-10 text-[#333] leading-relaxed">
          {description}
        </p>
        <button
          onClick={handleClick}
          className="w-fit px-12 py-5 bg-[#6cc24a] hover:bg-[#5aa73e] text-white rounded-md font-medium cursor-pointer transition-all duration-300 text-[1.3rem]"
        >
          {buttonText}
        </button>
      </motion.div>
    </section>
  );
};

export default Section;