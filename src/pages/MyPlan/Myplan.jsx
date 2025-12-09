import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function Myplan() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [planoAtual, setPlanoAtual] = useState(null);
  const [historicoPlanos, setHistoricoPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    carregarDados();
  }, [user, navigate]);

  const carregarDados = async () => {
    try {
     setLoading(true);
      
      // 1. Pega do localStorage
      let token = localStorage.getItem('accessToken');
      
      if (!token) throw new Error('Sem token');

      // --- CORREÇÃO AQUI ---
      // Remove todas as aspas duplas (") que estiverem sobrando
      token = token.replace(/"/g, ''); 
      // ---------------------

      // Busca do Backend
      const response = await axios.get('http://localhost:3000/api/dashboard/myplan', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const planos = response.data || [];
      
      if (planos.length > 0) {
        setHistoricoPlanos(planos);
        // Assume que o primeiro (index 0) é o ativo pois o backend ordena por data
        setPlanoAtual(planos[0]); 
      } else {
        setHistoricoPlanos([]);
        setPlanoAtual(null);
      }

    } catch (error) {
      console.error('Erro ao carregar:', error);
      toast.error('Erro ao carregar seus dados.');
    } finally {
      setLoading(false);
    }
  };

  // --- FUNÇÃO: CHAMADA AO CONTROLLER (DEFINIR ATIVO) ---
  const handleDefinirAtivo = async (planoId) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      await axios.patch('http://localhost:3000/api/dashboard/definir-ativo', 
        { planoId },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      toast.success('Plano atualizado!');
      carregarDados(); // Recarrega a lista para refletir a nova ordem
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar plano');
    }
  };

  // --- FUNÇÃO: CHAMADA AO CONTROLLER (LIMPAR HISTÓRICO) ---
  const handleLimparHistorico = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      await axios.delete('http://localhost:3000/api/dashboard/historico', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Limpa estado local e localStorage
      setHistoricoPlanos([]);
      setPlanoAtual(null);
      localStorage.removeItem('historicoPlanos'); 
      localStorage.removeItem('planoAtual');
      
      setModalAberto(false);
      toast.success('Histórico apagado do servidor!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao limpar histórico no servidor');
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return 'Data desconhecida';
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  const renderHistorico = () => {
    if (historicoPlanos.length === 0) {
      return (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500">Nenhum histórico disponível</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {historicoPlanos.map((plano, index) => {
          // Normaliza os dados (caso venha do Mongo ou estrutura antiga)
          const dados = plano.planoGerado || plano; 
          const isAtual = index === 0; // O primeiro da lista é o atual

          return (
            <div key={plano._id || index} className={`rounded-lg border p-4 transition ${isAtual ? 'border-green-500 bg-green-50 shadow-sm' : 'bg-white border-gray-200 hover:shadow-md'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800 flex items-center">
                    Plano #{historicoPlanos.length - index}
                    {isAtual && (
                      <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-bold">
                        Atual
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {formatarData(plano.dataCriacao || plano.dataSalvamento)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-700">
                    {dados.resultados?.caloriasDiarias || 0} kcal
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {(dados.dadosUsuario?.objetivo || '').replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between gap-3">
                <button
                  onClick={() => navigate('/plano', { state: { plano: plano } })}
                  className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Ver Detalhes
                </button>
                
                {!isAtual && (
                  <button
                    onClick={() => handleDefinirAtivo(plano._id)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium"
                  >
                    Usar Este
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Sincronizando seus dados...</p>
        </div>
      </div>
    );
  }

  // Preparar dados para exibição nos cards de estatística
  const dadosPlanoAtual = planoAtual?.planoGerado || planoAtual;
  const diasAtivos = planoAtual 
    ? Math.floor((new Date() - new Date(planoAtual.dataCriacao || Date.now())) / (1000 * 60 * 60 * 24)) 
    : 0;

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-green-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-green-800">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Gerencie seus planos alimentares, <span className="text-green-600 font-bold">{user?.nome}!</span>
              </p>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => navigate('/quiz')}
                className="w-full md:w-auto px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Novo Plano
              </button>
            </div>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Coluna Esquerda: Estatísticas do Plano ATUAL */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Cards de Resumo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
                <p className="text-sm text-gray-500 mb-1">Total de Planos</p>
                <p className="text-2xl font-bold text-gray-800">{historicoPlanos.length}</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
                <p className="text-sm text-gray-500 mb-1">Dias do Plano Atual</p>
                <p className="text-2xl font-bold text-gray-800">{diasAtivos} <span className="text-xs font-normal text-gray-400">dias</span></p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
                <p className="text-sm text-gray-500 mb-1">Meta Calórica</p>
                <p className="text-2xl font-bold text-green-600">
                  {dadosPlanoAtual?.resultados?.caloriasDiarias || '-'}
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${planoAtual ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <p className="text-lg font-bold text-gray-800">
                    {planoAtual ? 'Ativo' : 'Inativo'}
                  </p>
                </div>
              </div>
            </div>

            {/* Banner do Plano Atual */}
            {planoAtual ? (
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-8 border-green-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Seu Plano Atual</h2>
                <p className="text-gray-600 mb-6 max-w-lg">
                  Focado em <strong className="text-green-700 capitalize">{(dadosPlanoAtual.dadosUsuario?.objetivo || '').replace(/_/g, ' ')}</strong>. 
                  Continue firme para atingir seus resultados!
                </p>
                
                <button
                  onClick={() => navigate('/plano', { state: { plano: planoAtual } })}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-md z-10 relative"
                >
                  Ver Cardápio de Hoje
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhum plano ativo</h3>
                <p className="text-gray-500 mb-6">Você ainda não tem um plano alimentar definido. Faça o quiz agora!</p>
                <button
                  onClick={() => navigate('/quiz')}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Começar Quiz
                </button>
              </div>
            )}
          </div>

          {/* Coluna Direita: Histórico e Ações */}
          <div className="space-y-6">
            
            {/* Lista de Histórico */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">Histórico</h2>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md">
                  {historicoPlanos.length}
                </span>
              </div>
              
              {renderHistorico()}
            </div>

            {/* Ações Rápidas / Zona de Perigo */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Gerenciamento</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/quiz')}
                  className="w-full flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition border border-green-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Criar Novo Plano
                </button>

                <button
                  onClick={() => setModalAberto(true)}
                  disabled={historicoPlanos.length === 0}
                  className={`w-full flex items-center justify-center p-3 rounded-lg transition border ${
                    historicoPlanos.length === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                    : 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Limpar Todo Histórico
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Dashboard NutriLife • {new Date().toLocaleDateString('pt-BR')}</p>
          <p className="mt-1 flex items-center justify-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Dados sincronizados com o servidor
          </p>
        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl transform transition-all">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Atenção!</h3>
            </div>
            
            <p className="text-gray-600 text-center mb-6">
              Tem certeza que deseja apagar <strong>TODOS</strong> os seus planos salvos? 
              <br/><br/>
              <span className="text-sm text-red-500">Esta ação é irreversível e os dados serão removidos do servidor.</span>
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setModalAberto(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleLimparHistorico}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition shadow-lg"
              >
                Sim, limpar tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Myplan;