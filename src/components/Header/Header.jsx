import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const userSalvo = JSON.parse(localStorage.getItem('usuarioLogado'));
    setUsuario(userSalvo);
  }, []);


  return (
    <div className='relative z-10 bg-[#FEFEFC] backdrop-blur-sm px-[30px] py-[15px] flex items-center justify-between'>
      <a href="/"><Logo /></a>
      <div className="flex gap-[15px] flex-wrap">


        {!usuario && (
          <>
            <button className="width: 100%-button" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="menu-width: 100%" onClick={() => navigate('/cadastro')}>
              Cadastro
            </button>
          </>
        )}



        {usuario && (
          <>
                  <button className="bg-[#6cc24a] text-white border-none px-4 py-2 text-sm font-medium font-[Poppins] rounded-md cursor-pointer transition-colors duration-300 ease-in-out-button"
                   onClick={() => navigate('/dashboard')}>
          Minha Conta
        </button>
            <span className="menu-flex text-[20px] text-center m-[10px] font-[Poppins]">
                Olá, {usuario.nome?.toUpperCase() || usuario.usuario?.toUpperCase()}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;