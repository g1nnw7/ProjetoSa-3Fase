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

  const imageInitialX = rowReverse ? 100 : -100;
  const textInitialX = rowReverse ? -100 : 100;

  const clipNormal = "polygon(0 0, 100% 0, 85% 100%, 0 100%)";
  const clipReverse = "polygon(15% 0, 100% 0, 100% 100%, 0 100%)";

  return (
    <section
      ref={ref}
      className={`w-full flex ${
        rowReverse ? "md:flex-row-reverse" : "md:flex-row"
      } flex-col items-center justify-between bg-gradient-to-b from-white to-gray-50`}
    >
      {/* Imagem */}
      <motion.div
        className="w-full md:w-[60%] h-[350px] md:h-[600px] flex justify-center items-center overflow-hidden rounded-2xl shadow-2xl"
        style={{
          clipPath: rowReverse ? clipReverse : clipNormal,
        }}
        initial={{ opacity: 0, x: imageInitialX }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.2 }}
      >
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-[1.03]"
          loading="lazy"
        />
      </motion.div>

      {/* Texto */}
      <motion.div
        className="w-full md:w-[40%] px-10 flex flex-col items-center md:items-start text-center md:text-left mt-12 md:mt-0"
        initial={{ opacity: 0, x: textInitialX }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.2, delay: 0.2 }}
      >
        <h2 className="text-4xl md:text-5xl font-semibold text-green-700 leading-tight mb-6 font-[Poppins]">
          {title}
        </h2>

        <p className="text-gray-600 font-[Poppins] text-lg md:text-xl max-w-xl leading-relaxed mb-10">
          {description}
        </p>

        <button
          onClick={handleClick}
          className="px-12 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.05] font-[Poppins] text-lg cursor-pointer"
        >
          {buttonText}
        </button>
      </motion.div>
    </section>
  );
};

export default Section;