import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Slider from 'react-slick';
// Importando estilos do slider (caso ainda não estejam globais)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Certifique-se de que estas imagens existem na pasta public/img/
const images = [
  '/img/fundohero.png',
  '/img/Promo.png',
  '/img/fundohero2.png',
];

const Hero = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: false,
    customPaging: () => <div className="hidden" />, // Esconde os dots padrão
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          zIndex: 10 // Garante que os dots fiquem acima da imagem
        }}
      >
        <ul className="flex items-center gap-2 md:gap-3">
          {dots.map((dot, index) => {
            // Verifica se o dot está ativo de forma segura
            const isActive = dot.props.className && dot.props.className.includes("slick-active");

            return (
              <li key={index} className="flex items-center justify-center">
                <button
                  // Passa o evento de clique do dot original
                  onClick={dot.props.children.props.onClick}
                  className={`
                    block transition-all duration-300 ease-in-out border-2 border-white rounded-full
                    ${isActive 
                      ? "w-3 h-3 md:w-4 md:h-4 bg-white" 
                      : "w-2.5 h-2.5 md:w-3 md:h-3 bg-transparent hover:bg-white/30"
                    }
                  `}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              </li>
            );
          })}
        </ul>
      </div>
    ),
  };

  return (
    <motion.section
      ref={ref}
      className="relative h-[70vh] md:h-screen w-full overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      {/* NOTA: Adicionei h-full e w-full aqui para garantir que o Slider ocupe o espaço
         e removi padding/margin extras que o slick às vezes adiciona
      */}
      <Slider {...settings} className="h-full w-full hero-slider">
        {images.map((url, index) => (
          <div key={index} className="outline-none border-none h-full w-full">
            <div
              className="
                h-[70vh] md:h-screen w-full 
                bg-cover bg-center bg-no-repeat
              "
              style={{
                // CORREÇÃO AQUI: Sintaxe correta de Template String
                backgroundImage: `url(${url})`, 
              }}
            >
              {/* Opcional: Adicionar um overlay escuro para melhorar contraste de texto se tiver */}
              {/* <div className="absolute inset-0 bg-black/30"></div> */}
            </div>
          </div>
        ))}
      </Slider>
    </motion.section>
  );
};

export default Hero;