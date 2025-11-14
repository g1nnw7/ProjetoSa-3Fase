import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const userSalvo = JSON.parse(localStorage.getItem('usuarioLogado'));
    setUsuario(userSalvo);
  }, []);

  return (
    <div className="relative z-10 bg-[#FEFEFC] backdrop-blur-md px-6 py-4 flex items-center justify-between font-[Poppins]">
      <a href="/">
        <img
          src="/img/logo.png"
          alt="Logo"
          className="h-12 w-auto object-contain"
        />
      </a>

      <div className="flex flex-wrap gap-3 md:gap-4">
        {!usuario && (
          <>
            <button
              onClick={() => navigate('/login')}
              className=" font-Poppins bg-[#FEFEFC]  hover:bg-green-600/40  border-none px-4 py-2 text-[14px] font-[500] font-[Poppins] rounded-[6px] cursor-pointer transition-all duration-300 ease-in-out"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/cadastro')}
              className=" font-Poppins bg-[#FEFEFC]  hover:bg-green-600/40  border-none px-4 py-2 text-[14px] font-[500] font-[Poppins] rounded-[6px] cursor-pointer transition-all duration-300 ease-in-out"
            >
              Cadastro
            </button>
          </>
        )}

        {usuario && (
          <>
            <span className="flex text-lg text-gray-700 font-medium items-center">
              Bem-vindo,&nbsp;
              <span className="text-[#6cc24a] font-semibold">{usuario.usuario}</span>
            </span>
            <button
              onClick={() => navigate('/dashboard')}
              className=" font-Poppins bg-[#FEFEFC]  hover:bg-green-600/40  border-none px-4 py-2 text-[14px] font-[500] font-[Poppins] rounded-[6px] cursor-pointer transition-all duration-300 ease-in-out"
            >
              Minha Conta
            </button>

          </>
        )}
      </div>
    </div>
  );
}

export default Header;
