import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  // Pega o pathname (ex: "/", "/loja") da URL atual
  const { pathname } = useLocation();

  // Roda este efeito toda vez que o 'pathname' mudar
  useEffect(() => {
    // Força a janela do navegador a ir para o topo (posição 0, 0)
    window.scrollTo(0, 0);
  }, [pathname]); // O array de dependências garante que isso rode a cada nova rota

  // Este componente não renderiza nada visível
  return null;
}