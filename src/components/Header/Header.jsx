import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Header({ openRegisterModal }) {
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
          className="h-12 w-auto object-contain cursor-pointer"
        />
      </a>

      <div className="flex flex-wrap gap-3 md:gap-4">
        {!usuario && (
          <>
            <button
              onClick={() => navigate('/login')}
              className="bg-[#FEFEFC] hover:bg-green-600/40 px-4 py-2 text-[14px] font-[500] rounded-[6px] cursor-pointer transition-all duration-300 ease-in-out"
            >
              Login
            </button>

            {/* Agora o botão CADASTRO abre o modal */}
            <button
              onClick={openRegisterModal}
              className="bg-[#FEFEFC] hover:bg-green-600/40 px-4 py-2 text-[14px] font-[500] rounded-[6px] cursor-pointer transition-all duration-300 ease-in-out"
            >
              Cadastro
            </button>
          </>
        )}

        {usuario && (
          <>
            <span className="flex text-lg text-gray-700 font-medium items-center">
              Bem-vindo,&nbsp;
              <span className="text-[#6cc24a] font-semibold">{usuario.nome}</span>
            </span>

            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#FEFEFC] hover:bg-green-600/40 px-4 py-2 text-[14px] font-[500] rounded-[6px] cursor-pointer transition-all duration-300 ease-in-out"
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
