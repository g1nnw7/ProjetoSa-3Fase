import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext'; 
import CartSidebar from '../Cart/CartSidebar';     
import { useAuth } from '../../contexts/AuthContext'; 
import { toast } from 'react-toastify';


function ShoppingBagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.669 0 1.189.578 1.119 1.243Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function LogoutIcon() { 
  return ( 
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"> 
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3-3 3-3m0 0-3-3m3 3H9" /> 
    </svg> 
  ); 
}

function AdminIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5Zm0 3.9a3 3 0 1 1-3 3a3 3 0 0 1 3-3Zm0 7.9c2 0 6 1.09 6 3.08a7.2 7.2 0 0 1-12 0c0-1.99 4-3.08 6-3.08Z" />
    </svg>
  );
}

function Header({ openRegisterModal }) {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { user, logout } = useAuth(); 
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = location.pathname === '/';


  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout(); 
    toast.error("Usuário deslogado com sucesso!", {
      autoClose: 3000,
      hideProgressBar: true,
    });
    navigate('/'); 
  }

  const headerBackgroundClass = scrolled || !isHome
    ? 'bg-white backdrop-blur-md' 
    : 'bg-transparent'; 

  return (
    <>
      <div 
        className={`fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between font-[Poppins] transition-all duration-300 ease-in-out ${headerBackgroundClass}`}
      >
        
        <Link to="/">
          <img
            src="/img/logo.png"
            alt="Logo"
            className="h-12 w-auto object-contain cursor-pointer bg-white/80 px-2 py-2 rounded-full shadow-sm mx-2"
          />
        </Link>

        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          
          {!user && (
            <>
              <button
                onClick={() => navigate('/login')}
                className="bg-[#FEFEFC] hover:bg-green-600/40 px-4 py-2 text-[14px] font-[500] rounded-[6px] cursor-pointer transition-all duration-300 ease-in-out shadow-sm border border-gray-200"
              >
                Login
              </button>
              <button
                onClick={openRegisterModal}
                className="bg-[#FEFEFC] hover:bg-green-600/40 px-4 py-2 text-[14px] font-[500] rounded-[6px] cursor-pointer transition-all duration-300 ease-in-out shadow-sm border border-gray-200"
              >
                Cadastro
              </button>
            </>
          )}

          {user && (
            <>
              <span 
                className={`hidden sm:flex text-lg font-medium items-center transition-all duration-300 ease-in-out
                  ${scrolled || !isHome
                    ? 'text-gray-700' 
                    : 'text-gray-800 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm mx-2' 
                  }`
                }
              >
                Bem-vindo,&nbsp;
                <span className="text-[#6cc24a] font-semibold">{user.nome}</span>
              </span>
              
              {user.role === 'ADMIN' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="relative p-2 bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-800 rounded-full transition-colors cursor-pointer shadow-sm border border-gray-200"
                  title="Painel Administrativo"
                >
                  <AdminIcon />
                </button>
              )}

              <button
                onClick={() => navigate('/dashboard')} 
                className="relative p-2 bg-white hover:bg-gray-100 text-gray-600 hover:text-green-600 transition-colors rounded-full cursor-pointer shadow-sm border border-gray-200"
                aria-label="Minha Conta"
              >
                <UserIcon />
              </button>

              <button
                onClick={handleLogout}
                className="relative p-2 bg-white hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors rounded-full cursor-pointer shadow-sm border border-gray-200"
                aria-label="Sair"
              >
                <LogoutIcon/>
              </button>
            </>
          )}

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 bg-white hover:bg-gray-100 text-gray-600 hover:text-green-600 transition-colors rounded-full cursor-pointer shadow-sm border border-gray-200"
            aria-label="Abrir carrinho"
          >
            <ShoppingBagIcon />
            {totalItems > 0 && (
              <span 
                className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center 
                           rounded-full bg-red-600 text-xs font-bold text-white"
              >
                {totalItems}
              </span>
            )}
          </button>
          
        </div>
      </div>

      {!isHome && <div className="h-20 w-full bg-transparent"></div>}

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default Header;