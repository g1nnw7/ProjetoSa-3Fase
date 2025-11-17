import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Assumindo que Header.jsx está em 'src/components/Header/'
import { useCart } from '../../contexts/CartContext.jsx'; 
import CartSidebar from '../Cart/CartSidebar.jsx';     
import { useAuth } from '../../contexts/AuthContext.jsx'; 

// Ícone da Sacola de Compras (Carrinho)
function ShoppingBagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.669 0 1.189.578 1.119 1.243Z" />
    </svg>
  );
}

// Ícone de Usuário
function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

// NOVO ÍCONE: Ícone de Sair (Logout)
function LogoutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3-3 3-3m0 0-3-3m3 3H9" />
    </svg>
  );
}


function Header({ openRegisterModal }) {
  const navigate = useNavigate();
  
  // O estado do usuário agora vem do AuthContext (corrigido)
  const { user, logout } = useAuth(); // <-- Pegamos o 'user' e 'logout'
  
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Função de logout para o usuário
  const handleLogout = () => {
    logout(); // Chama a função do AuthContext
    navigate('/'); // Redireciona para a home
  }

  return (
    <>
      <div className="relative z-10 bg-[#FEFEFC] backdrop-blur-md px-6 py-4 flex items-center justify-between font-[Poppins]">
        
        <Link to="/">
          <img
            src="/img/logo.png"
            alt="Logo"
            className="h-12 w-auto object-contain cursor-pointer"
          />
        </Link>

        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          
          {/* Se NÃO houver usuário (user é null) */}
          {!user && (
            <>
              <button
                onClick={() => navigate('/login')}
                className="bg-[#FEFEFC] hover:bg-green-600/40 px-4 py-2 text-[14px] font-[500] rounded-[6px] cursor-pointer transition-all duration-300 ease-in-out"
              >
                Login
              </button>
              <button
                onClick={openRegisterModal}
                className="bg-[#FEFEFC] hover:bg-green-600/40 px-4 py-2 text-[14px] font-[500] rounded-[6px] cursor-pointer transition-all duration-300 ease-in-out"
              >
                Cadastro
              </button>
            </>
          )}

          {/* Se HOUVER usuário (user é um objeto) */}
          {user && (
            <>
              <span className="hidden sm:flex text-lg text-gray-700 font-medium items-center">
                Bem-vindo,&nbsp;
                <span className="text-[#6cc24a] font-semibold">{user.nome}</span>
              </span>

              {/* Ícone de Usuário */}
              <button
                onClick={() => navigate('/dashboard')} // TODO: Criar a página de dashboard
                className="relative p-2 text-gray-600 hover:text-green-600 transition-colors rounded-full hover:bg-gray-100 cursor-pointer"
                aria-label="Minha Conta"
              >
                <UserIcon />
              </button>

              {/* BOTÃO MODIFICADO: Botão de Logout (Ícone) */}
              <button
                onClick={handleLogout}
                className="relative p-2 text-gray-600 hover:text-red-600 transition-colors rounded-full hover:bg-red-100 cursor-pointer"
                aria-label="Sair"
              >
                <LogoutIcon />
              </button>
            </>
          )}

          {/* Botão do Carrinho (sempre aparece) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-600 hover:text-green-600 transition-colors rounded-full hover:bg-gray-100 cursor-pointer"
            aria-label="Abrir carrinho"
          >
            <ShoppingBagIcon />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center 
                               justify-center rounded-full bg-red-600 text-xs 
                               font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>
          
        </div>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default Header;