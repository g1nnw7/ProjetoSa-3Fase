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
      } items-center justify-between bg-[#f5f5f5]`}
    >
      {/* Imagem */}
      <motion.div
        className="w-1/2 h-175 flex justify-center items-center"
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
        className="flex flex-col items-center justify-center text-center w-1/2 h-1/2"
        initial={{ opacity: 0, x: textInitialX }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.2, delay: 0.2 }}
      >
        <h2 className="text-3xl text-center md:text-4xl lg:text-5xl font-bold text-green-700 leading-tight mb-4 animate-fadeIn -translate-y-15 relative">
          {title}
        </h2>
        <p className="text-gray-600 text-center text-xl md:text-xl max-w-xl leading-relaxed mb-8 animate-fadeIn delay-150">
          {description}
        </p>
        <button
          onClick={handleClick}
          className="w-fit px-12 align-center py-5 bg-[#6cc24a] hover:bg-[#5aa73e] text-white rounded-md font-medium cursor-pointer transition-all duration-300 text-[1.3rem]"
        >
          {buttonText}
        </button>
      </motion.div>
    </section>
  );
};

export default Section;