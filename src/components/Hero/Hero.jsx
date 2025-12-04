import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Slider from 'react-slick';

// Importe o CSS do slick no seu arquivo principal (App.js ou index.js) se ainda não tiver feito:
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

const images = [
  '/img/fundohero.png', 
  '/img/Promos.png', 
  '/img/wheyConcentreado900g.png', 
];

const Hero = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000, // Aumentei um pouco para o fade ficar mais suave
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: false,
    
    // Esta função controla apenas a renderização dos "cliques", mas deixaremos vazio
    // pois controlaremos o visual inteiramente no appendDots abaixo
    customPaging: () => <div className="hidden" />,

    // Aqui construímos a barra de navegação do zero para evitar o estilo "quadrado" padrão
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ul className="flex items-center gap-3">
          {dots.map((dot, index) => {
            // Verifica se este dot é o ativo olhando a classe que o Slick injetou
            const isActive = dot.props.className && dot.props.className.includes("slick-active");
            
            return (
              <li key={index} className="flex items-center justify-center">
                {/* Criamos nosso próprio botão para garantir que seja redondo */}
                <button
                  // Pega a função onClick original do dot para fazer a troca de slide funcionar
                  onClick={dot.props.children.props.onClick}
                  className={`
                    block transition-all duration-300 ease-in-out border-2 border-white rounded-full
                    ${isActive ? "w-4 h-4 bg-white" : "w-3 h-3 bg-transparent hover:bg-white/30"}
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
      className='relative h-screen w-full overflow-hidden'
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      <Slider {...settings} className="h-full w-full">
        {images.map((url, index) => (
          <div key={index} className="outline-none border-none">
            <div
              className='h-screen w-full bg-cover bg-center bg-no-repeat'
              style={{ 
                backgroundImage: `url('${url}')`,
              }}
            >
              {/* Camada escura opcional para melhorar leitura do texto (descomente se precisar) */}
              {/* <div className="absolute inset-0 bg-black/20"></div> */}
            </div>
          </div>
        ))}
      </Slider>


    </motion.section>
  );
};

export default Hero;