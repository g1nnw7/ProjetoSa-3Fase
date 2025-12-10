import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function Dashboard() {
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
    
    // MUDANÇA AQUI: Primeiro tentar carregar do servidor
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await axios.get('http://localhost:3000/api/quiz/historico', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data && response.data.length > 0) {
          setHistoricoPlanos(response.data);
          setPlanoAtual(response.data[0]); // Primeiro é o mais recente
          return;
        }
      }
    } catch (serverError) {
      console.log('Servidor offline, usando localStorage...');
    }

    // MUDANÇA AQUI: Carregar múltiplos planos do localStorage
    const historicoLocal = JSON.parse(localStorage.getItem('historicoPlanos') || '[]');
    const planoAtualLocal = JSON.parse(localStorage.getItem('planoAtual') || 'null');
    
    // Se tiver histórico, usar ele
    if (historicoLocal.length > 0) {
      setHistoricoPlanos(historicoLocal);
      setPlanoAtual(planoAtualLocal || historicoLocal[0]);
    } 
    // Fallback: plano antigo (para compatibilidade)
    else {
      const planoLocal = JSON.parse(localStorage.getItem('planoLocal') || 'null');
      if (planoLocal) {
        setHistoricoPlanos([planoLocal]);
        setPlanoAtual(planoLocal);
      }
    }

  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    toast.error('Erro ao carregar seus dados');
  } finally {
    setLoading(false);
  }
};

  const formatarData = (dataString) => {
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
    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
      {historicoPlanos.map((plano, index) => {
        const dados = plano.planoGerado || plano;
        const respostas = plano.respostas || dados.dadosUsuario;
        
        return (
          <div key={plano.id || index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-gray-800">
                  Plano #{index + 1}
                  {index === 0 && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Mais recente
                    </span>
                  )}
                </h4>
                <p className="text-sm text-gray-500">
                  {plano.dataSalvamento ? formatarData(plano.dataSalvamento) : 
                   plano.dataCriacao ? formatarData(plano.dataCriacao) : 'Data não disponível'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-700">
                  {dados.resultados?.caloriasDiarias || 0} kcal
                </p>
                <p className="text-sm text-gray-600">
                  IMC: {dados.resultados?.imc || 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Objetivo:</span>
                <span className="font-medium ml-2 capitalize">
                  {(respostas.objetivo || '').replace(/_/g, ' ')}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Atividade:</span>
                <span className="font-medium ml-2">{respostas.atividade || 'N/A'}</span>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => navigate('/plano', { 
                  state: { plano: dados } 
                })}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Ver Detalhes
              </button>
              
              <button
                onClick={() => {
                  // Tornar este plano o atual
                  localStorage.setItem('planoAtual', JSON.stringify(plano));
                  setPlanoAtual(plano);
                  toast.success('Plano definido como atual!');
                }}
                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
              >
                Usar Este
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-green-800">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Seja bem-vindo aos seus planos alimentares, <span className="text-green-600">{user.nome}!</span>
              </p>
            </div>

            
            
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/quiz')}
                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-md"
              >
                + Novo Plano
              </button>
            </div>
          </div>
        </div>

        

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Coluna 1: Plano Atual */}
          <div className="lg:col-span-2">
            {renderHistorico()}
            
            {/* Estatísticas */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow">
                <p className="text-sm text-gray-600">Total de Planos</p>
                <p className="text-2xl font-bold text-gray-800">{historicoPlanos.length}</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow">
                <p className="text-sm text-gray-600">Dias Ativos</p>
                <p className="text-2xl font-bold text-gray-800">
                  {planoAtual ? 
                    Math.floor((new Date() - new Date(planoAtual.dataSalvamento || Date.now())) / (1000 * 60 * 60 * 24)) 
                    : 0}
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow">
                <p className="text-sm text-gray-600">Meta Calórica</p>
                <p className="text-2xl font-bold text-gray-800">
                  {planoAtual?.planoGerado?.resultados?.caloriasDiarias || 
                   planoAtual?.resultados?.caloriasDiarias || 
                   'N/A'}
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow">
                <p className="text-sm text-gray-600">Progresso</p>
                <p className="text-2xl font-bold text-gray-800">
                  {historicoPlanos.length > 0 ? 'Em andamento' : 'Não iniciado'}
                </p>
              </div>
            </div>
          </div>

          {/* Coluna 2: Histórico */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Histórico de Planos</h2>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                  {historicoPlanos.length} itens
                </span>
              </div>
              
              {renderHistorico()}
            </div>

            {/* Ações Rápidas */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Ações Rápidas</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/quiz')}
                  className="w-full flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Novo Plano
                </button>

                <button
         onClick={() => setModalAberto (true)}
             className="w-full flex items-center justify-center p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
            >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <p>Dashboard • {new Date().toLocaleDateString('pt-BR')}</p>
          <p className="mt-1">Seus dados estão {planoAtual?.local ? 'armazenados localmente' : 'sincronizados com o servidor'}</p>
        </div>
      </div>

      {/* MODAL DE CONFIRMAÇÃO - ADICIONADO AQUI */}
      {modalAberto && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Atenção!</h3>
            </div>
            
            <p className="text-gray-600 text-center mb-6">
              Tem certeza que deseja limpar TODO o histórico de planos? Esta ação não pode ser desfeita!
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setModalAberto(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('historicoPlanos');
                  localStorage.removeItem('planoAtual');
                  localStorage.removeItem('planoLocal');
                  setPlanoAtual(null);
                  setHistoricoPlanos([]);
                  setModalAberto(false);
                  toast.success('Histórico limpo com sucesso!');
                }}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700"
              >
                Sim, limpar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* FIM DO MODAL */}
      
    </div>
  );
}

export default Dashboard;