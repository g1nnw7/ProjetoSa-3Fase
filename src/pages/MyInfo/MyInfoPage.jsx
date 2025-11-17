import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

// Componente de cartão reutilizável
function InfoCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">{title}</h2>
      {children}
    </div>
  );
}

export default function MyInfoPage() {
  const { user, login } = useAuth(); 
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false); 

  const [nome, setNome] = useState(user ? user.nome : '');
  const [email, setEmail] = useState(user ? user.email : '');

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setLoadingInfo(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Sessão expirada. Por favor, faça login novamente.');
      setLoadingInfo(false);
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:3000/usuarios/${user.id}`, 
        { nome, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = response.data.data;
      login(updatedUser); 
      toast.success('Informações atualizadas com sucesso!');
    } catch (error) {
      console.error("Erro ao atualizar informações:", error);
      toast.error('Erro ao atualizar informações.');
    } finally {
      setLoadingInfo(false);
    }
  };


  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoadingPass(true);

    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Sessão expirada. Por favor, faça login novamente.');
      setLoadingPass(false);
      return;
    }

    if (novaSenha.length < 8) {
      toast.error("A nova senha deve ter pelo menos 8 caracteres.");
      setLoadingPass(false);
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/auth/change-password',
        { senhaAtual, novaSenha }, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Senha alterada com sucesso!");
      setSenhaAtual('');
      setNovaSenha('');

    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      if (error.response?.status === 401) {
        toast.error("A senha atual está incorreta.");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.error); 
      } else {
        toast.error("Erro ao conectar com o servidor.");
      }
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-4xl p-4 md:p-8">
        
        {/* CORREÇÃO AQUI: Link de navegação substituído pelo comentário */}
        <div className="mb-6">
          <Link 
            to="/dashboard"
            className="flex items-center text-base font-medium text-gray-600 hover:text-green-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Voltar ao Dashboard
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Minhas Informações</h1>

        {/* Formulário de Informações Pessoais */}
        <InfoCard title="Informações Pessoais">
          <form onSubmit={handleInfoSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              disabled={loadingInfo} 
              className="w-full py-2 px-4 rounded-lg bg-green-600 text-white 
                         font-semibold hover:bg-green-700 transition-colors
                         disabled:bg-gray-400 cursor-pointer"
            >
              {loadingInfo ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </InfoCard>

        {/* Formulário de Mudança de Senha */}
        <div className="mt-8">
          <InfoCard title="Mudar Senha">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="senhaAtual" className="block text-sm font-medium text-gray-700">
                  Senha Atual
                </label>
                <input
                  type="password"
                  id="senhaAtual"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  required 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700">
                  Nova Senha (mín. 8 caracteres)
                </label>
                <input
                  type="password"
                  id="novaSenha"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  required 
                  minLength={8} 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                type="submit"
                disabled={loadingPass} 
                className="w-full py-2 px-4 rounded-lg bg-gray-700 text-white 
                           font-semibold hover:bg-gray-800 transition-colors
                           disabled:bg-gray-400 cursor-pointer"
              >
                {loadingPass ? 'Alterando...' : 'Mudar Senha'}
              </button>
            </form>
          </InfoCard>
        </div>

      </div>
    </div>
  );
}