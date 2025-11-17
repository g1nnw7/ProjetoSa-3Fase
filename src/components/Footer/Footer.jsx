import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2 }}
      className="bg-[#1e1e1e] text-white py-5 font-['Poppins']"
    >
      {/* Conteúdo principal */}
      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-around px-5">
        {/* Seção Sobre */}
        <div className="my-4">
          <h3 className="text-base mb-2 font-semibold">Sobre</h3>
          <ul className="list-none p-0">
            <li className="my-2">
              <a
                href="#nossa-historia"
                className="text-sm text-white no-underline hover:text-[#6cc24a] hover:underline"
              >
                Nossa História
              </a>
            </li>
            <li className="my-2">
              <a
                href="#missao"
                className="text-sm text-white no-underline hover:text-[#6cc24a] hover:underline"
              >
                Missão
              </a>
            </li>
            <li className="my-2">
              <a
                href="#contato"
                className="text-sm text-white no-underline hover:text-[#6cc24a] hover:underline"
              >
                Contato
              </a>
            </li>
          </ul>
        </div>

        {/* Seção Contato */}
        <div className="my-4">
          <h3 className="text-base mb-2 font-semibold">Contato</h3>
          <p className="text-sm my-1">Telefone: (48) 99902-2880</p>
          <p className="text-sm my-1">Email: nutrifit@gmail.com</p>
        </div>

        {/* Seção Redes Sociais */}
        <div className="my-4">
          <h3 className="text-base mb-2 font-semibold">Siga-nos</h3>
          <div className="flex space-x-4">
            <a
              href="#facebook"
              className="text-white text-sm hover:text-[#6cc24a]"
            >
              Facebook
            </a>
            <a
              href="#instagram"
              className="text-white text-sm hover:text-[#6cc24a]"
            >
              Instagram
            </a>
            <a
              href="#twitter"
              className="text-white text-sm hover:text-[#6cc24a]"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>


      <div className="mt-5 text-xs border-t border-[#333] pt-3 text-center">
        © 2025 <span className="font-semibold">NutriFit</span>. Todos os direitos
        reservados.
      </div>
    </motion.footer>
  );
};

export default Footer;
