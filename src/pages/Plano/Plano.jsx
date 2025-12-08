import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify'; // Assumindo uso do toastify

// Componentes de ícones
function CheckIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function ClockIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function FireIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
    </svg>
  );
}

function CalendarIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function PrinterIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
    </svg>
  );
}

function Plano() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [plano, setPlano] = useState(null);
  const [loading, setLoading] = useState(true);
  const [diaAtual, setDiaAtual] = useState(0);
  const [variacoesDia, setVariacoesDia] = useState({});
  const [progresso, setProgresso] = useState(0);
  const [refeicoesConcluidas, setRefeicoesConcluidas] = useState([]);

  const diasSemana = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
  const diasAbreviados = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      toast.error('Você precisa estar logado para acessar seu plano!');
      return;
    }

    // Prioridade: Plano vindo via navegação (state) OU buscar no servidor
    if (location.state?.plano) {
      processarDadosPlano(location.state.plano);
    } else {
      carregarPlanoDoServidor();
    }
  }, [user, navigate, location]);

  const processarDadosPlano = (dados) => {
    setPlano(dados);
    // O backend agora DEVE retornar 'variacoesSemanais' dentro do objeto
    if (dados.variacoesSemanais) {
      setVariacoesDia(dados.variacoesSemanais);
    }
    setLoading(false);
    calcularProgressoInicial();
  };

  const carregarPlanoDoServidor = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken'); // 1. Pega o token
      
      if (!token) {
        throw new Error('Token não encontrado');
      }

      // 2. Envia o token no header Authorization
      const response = await axios.get('http://localhost:3000/quiz/plano-salvo', {
        headers: { 
          'Authorization': `Bearer ${token}`, // <--- ESSENCIAL
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        processarDadosPlano(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar plano:', error);
      if (error.response?.status === 401) {
          navigate('/login'); // Redireciona se o token expirou
      }
      // ... resto do tratamento de erro
    } finally {
      setLoading(false);
    }
  };

  // REMOVIDO: criarPlanoExemplo (Lógica movida para o backend ou descartada)
  // REMOVIDO: gerarVariacoesDia (Lógica movida para o backend)

  const calcularProgressoInicial = () => {
    // ... (Mantém igual, pois é lógica de UI/Tempo real) ...
    // Dica: Se quiser salvar o progresso no banco, isso também deveria virar uma chamada de API
    setRefeicoesConcluidas([]); 
    setProgresso(0);
  };

  const marcarRefeicaoConcluida = (refeicao) => {
    // ... (Mantém a lógica visual) ...
    // SUGESTÃO DE MELHORIA FUTURA:
    // await axios.post('/api/marcar-refeicao', { dia: diaAtual, refeicao, status: true })
    
    if (refeicoesConcluidas.includes(refeicao)) {
      setRefeicoesConcluidas(refeicoesConcluidas.filter(r => r !== refeicao));
    } else {
      setRefeicoesConcluidas([...refeicoesConcluidas, refeicao]);
    }
    
    const totalRefeicoes = 6;
    const concluidas = refeicoesConcluidas.includes(refeicao) 
      ? refeicoesConcluidas.length - 1
      : refeicoesConcluidas.length + 1;
    
    const novoProgresso = Math.round((concluidas / totalRefeicoes) * 100);
    setProgresso(novoProgresso);
  };

  // ... (imprimirPlano, exportarPlano, compartilharPlano permanecem no front pois manipulam o DOM/Browser API) ...

  // Renderização
  if (loading) {
    return (
       // ... seu loading
       <div>Carregando...</div>
    );
  }

  if (!plano) {
    // ... seu estado vazio
    return <div>Plano não encontrado</div>;
  }

  // A lógica de pegar o dia atual agora busca no objeto que veio do backend
  const planoDiaAtual = variacoesDia[diasAbreviados[diaAtual]] || plano.planoDiario;

  const horariosRefeicoes = {
    cafeManha: '07:00 - 08:00',
    lancheManha: '10:00 - 10:30',
    almoco: '12:30 - 13:30',
    lancheTarde: '16:00 - 16:30',
    jantar: '19:00 - 20:00',
    ceia: '21:30 - 22:00'
  };

  const imprimirPlano = () => {
    window.print();
  };

  const exportarPlano = () => {
    if (!plano) return;
    
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(plano, null, 2)], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "meu-plano-alimentar.json";
    document.body.appendChild(element); // Necessário para Firefox
    element.click();
    document.body.removeChild(element);
  };

  const compartilharPlano = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu Plano Alimentar',
          text: 'Confira meu novo plano alimentar!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Erro ao compartilhar', error);
      }
    } else {
      toast.info('Compartilhamento não suportado neste navegador');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-green-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-green-800">Meu Plano Alimentar</h1>
              <p className="text-gray-600 mt-1">
                Personalizado para você • Criado em {new Date(plano.dataCriacao).toLocaleDateString('pt-BR')}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition flex items-center cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar
              </button>
              
              <button
                onClick={() => navigate('/quiz')}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition flex items-center cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Atualizar
              </button>
            </div>
          </div>

          {/* Cards de informações rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <p className="text-sm text-gray-600 flex items-center">
                <FireIcon className="w-4 h-4 mr-2" />
                Meta Calórica
              </p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {plano.resultados.caloriasDiarias}
                <span className="text-sm font-normal text-gray-500"> kcal/dia</span>
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="text-sm text-gray-600">IMC Atual</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {plano.resultados.imc}
              </p>
              <p className="text-sm text-gray-500">{plano.resultados.classificacaoIMC}</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
              <p className="text-sm text-gray-600 flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Dia da Semana
              </p>
              <p className="text-2xl font-bold text-yellow-700 mt-1">
                {diasAbreviados[diaAtual]}
              </p>
              <p className="text-sm text-gray-500">{diasSemana[diaAtual]}</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
              <p className="text-sm text-gray-600">Progresso Diário</p>
              <p className="text-2xl font-bold text-red-700 mt-1">
                {progresso}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progresso}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Seletor de Dias */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Selecione o Dia</h3>
            <div className="flex flex-wrap gap-2">
              {diasAbreviados.map((dia, index) => (
                <button
                  key={dia}
                  onClick={() => setDiaAtual(index)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                    diaAtual === index
                      ? 'bg-green-600 text-white shadow-md transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dia}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Coluna 1: Cronograma Diário */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card: Cronograma de Refeições */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Cronograma do Dia - {diasSemana[diaAtual]}
                </h2>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  {Object.keys(horariosRefeicoes).length} refeições
                </span>
              </div>
              
              <div className="space-y-4">
                {Object.entries({
                  cafeManha: '☕ Café da Manhã',
                  lancheManha: '🍎 Lanche da Manhã',
                  almoco: '🍽️ Almoço',
                  lancheTarde: '🥪 Lanche da Tarde',
                  jantar: '🌙 Jantar',
                  ceia: '🌜 Ceia'
                }).map(([key, label]) => {
                  const concluida = refeicoesConcluidas.includes(key);
                  return (
                    <div 
                      key={key}
                      className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                        concluida
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <ClockIcon className="w-5 h-5 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-500">
                              {horariosRefeicoes[key]}
                            </span>
                          </div>
                          
                          <h3 className={`font-semibold text-lg mb-2 ${
                            concluida ? 'text-green-700 line-through' : 'text-gray-800'
                          }`}>
                            {label}
                          </h3>
                          
                          <p className={`text-gray-600 ${
                            concluida ? 'opacity-70' : ''
                          }`}>
                            {planoDiaAtual[key] || plano.planoDiario[key]}
                          </p>
                          
                          {key === 'almoco' && plano.dadosUsuario.alergias !== 'Nenhuma' && (
                            <div className="mt-2">
                              <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                                ⚠️ Ajustado para: {plano.dadosUsuario.alergias}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => marcarRefeicaoConcluida(key)}
                          className={`ml-4 p-2 rounded-full transition ${
                            concluida
                              ? 'bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-green-600 cursor-pointer'
                          }`}
                        >
                          <CheckIcon className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Nota do nutricionista */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-3 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-blue-800">Nota do Nutricionista</p>
                    <p className="text-blue-700 text-sm mt-1">
                      Mantenha a hidratação ao longo do dia. Beba água regularmente, especialmente entre as refeições.
                      Adapte as porções conforme sua fome e nível de atividade física.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Macronutrientes */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Distribuição de Macronutrientes
              </h2>
              
              <div className="space-y-6">
                {/* Gráfico de barras */}
                <div className="space-y-4">
                  {[
                    { 
                      nome: 'Proteínas', 
                      porcentagem: plano.resultados.macros.proteinas, 
                      cor: 'bg-blue-500', 
                      texto: 'text-blue-700',
                      gramas: plano.resultados.gramasMacros.proteinas,
                      alimentos: 'Carnes, ovos, laticínios, leguminosas'
                    },
                    { 
                      nome: 'Carboidratos', 
                      porcentagem: plano.resultados.macros.carboidratos, 
                      cor: 'bg-yellow-500', 
                      texto: 'text-yellow-700',
                      gramas: plano.resultados.gramasMacros.carboidratos,
                      alimentos: 'Arroz, batata, pães, frutas, aveia'
                    },
                    { 
                      nome: 'Gorduras', 
                      porcentagem: plano.resultados.macros.gorduras, 
                      cor: 'bg-red-500', 
                      texto: 'text-red-700',
                      gramas: plano.resultados.gramasMacros.gorduras,
                      alimentos: 'Azeite, abacate, castanhas, sementes'
                    }
                  ].map((macro) => (
                    <div key={macro.nome} className="space-y-2">
                      <div className="flex justify-between">
                        <span className={`font-medium ${macro.texto}`}>
                          {macro.nome}
                        </span>
                        <span className="font-bold text-gray-700">
                          {macro.porcentagem}% • {macro.gramas}g
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`${macro.cor} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${macro.porcentagem}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Fontes: {macro.alimentos}
                      </p>
                    </div>
                  ))}
                </div>
                
                {/* Resumo de calorias */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total de Calorias Diárias</p>
                      <p className="text-2xl font-bold text-green-700">
                        {plano.resultados.caloriasDiarias} kcal
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Taxa Metabólica Basal</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {plano.resultados.tmb} kcal
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2: Informações e Ações */}
          <div className="space-y-6">
            
            {/* Card: Seu Perfil */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Seu Perfil</h2>
              
              <div className="space-y-4">
                {[
                  { label: 'Idade', value: `${plano.dadosUsuario.idade} anos` },
                  { label: 'Sexo', value: plano.dadosUsuario.sexo },
                  { label: 'Altura', value: `${plano.dadosUsuario.altura} cm` },
                  { label: 'Peso', value: `${plano.dadosUsuario.peso} kg` },
                  { 
                    label: 'Objetivo', 
                    value: plano.dadosUsuario.objetivo.replace(/_/g, ' '),
                    cor: 'text-green-700',
                    bg: 'bg-green-100'
                  },
                  { 
                    label: 'Nível de Atividade', 
                    value: plano.dadosUsuario.atividade,
                    cor: 'text-blue-700',
                    bg: 'bg-blue-100'
                  },
                  ...(plano.dadosUsuario.condicoes !== 'Nenhuma' ? [{
                    label: 'Condição',
                    value: plano.dadosUsuario.condicoes,
                    cor: 'text-orange-700',
                    bg: 'bg-orange-100'
                  }] : []),
                  ...(plano.dadosUsuario.alergias !== 'Nenhuma' ? [{
                    label: 'Alergia/Intolerância',
                    value: plano.dadosUsuario.alergias,
                    cor: 'text-red-700',
                    bg: 'bg-red-100'
                  }] : [])
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className={`font-semibold px-3 py-1 rounded-full text-sm ${item.cor || 'text-gray-800'} ${item.bg || 'bg-gray-100'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-600">
                    Perfil atualizado em {new Date().toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Card: Ações Rápidas */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Ações</h2>
              
              <div className="space-y-3">
                <button
                  onClick={imprimirPlano}
                  className="w-full flex items-center justify-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition transform hover:translate-x-1 cursor-pointer"
                >
                  <PrinterIcon className="w-5 h-5 mr-3" />
                  Imprimir Plano
                </button>
                
                <button
                  onClick={exportarPlano}
                  className="w-full flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition transform hover:translate-x-1 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exportar Plano
                </button>
                
                <button
                  onClick={compartilharPlano}
                  className="w-full flex items-center justify-center p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition transform hover:translate-x-1 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Compartilhar
                </button>
                
                <button
                  onClick={() => navigate('/devreceitas')}
                  className="cursor-pointer w-full flex items-center justify-center p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition transform hover:translate-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Ver Receitas
                </button>
              </div>
            </div>

            {/* Card: Recomendações */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                💡 Recomendações
              </h2>
              
              <div className="space-y-3">
                {plano.recomendacoes.map((recomendacao, index) => (
                  <div 
                    key={index} 
                    className="flex items-start p-3 bg-green-50 rounded-lg hover:bg-green-100 transition"
                  >
                    <CheckIcon className="w-5 h-5 text-green-600 mr-3 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{recomendacao}</span>
                  </div>
                ))}
              </div>
              
              {/* Dicas extras */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">💧 Hidratação</p>
                <p className="text-sm text-blue-700">
                  Beba pelo menos 2-3 litros de água por dia. Consuma 1 copo 30min antes das refeições principais.
                </p>
              </div>
            </div>

            {/* Card: Progresso Semanal */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Progresso Semanal
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Esta semana</span>
                    <span className="font-bold text-green-700">{progresso}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progresso}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {diasAbreviados.map((dia, index) => (
                    <div 
                      key={dia}
                      className={`text-center p-2 rounded-lg ${
                        index === diaAtual
                          ? 'bg-green-100 text-green-700 font-bold'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      onClick={() => setDiaAtual(index)}
                    >
                      <div className="text-xs">{dia}</div>
                      <div className={`text-lg font-bold ${
                        index === diaAtual ? 'text-green-800' : 'text-gray-800'
                      }`}>
                        {index === diaAtual ? '●' : index < diaAtual ? '✓' : index}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center">
                  <button
                    onClick={() => {
                      setRefeicoesConcluidas([]);
                      setProgresso(0);
                      toast.success('Progresso resetado!');
                    }}
                    className="text-sm text-gray-500 hover:text-red-600 transition cursor-pointer"
                  >
                    Reiniciar progresso da semana
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Área de impressão (oculta) */}
        <div id="plano-impressao" className="hidden">
          <div className="header">
            <h1>Meu Plano Alimentar Personalizado</h1>
            <p>Gerado em: {new Date(plano.dataCriacao).toLocaleDateString('pt-BR')}</p>
            <p>Dia: {diasSemana[diaAtual]}</p>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <strong>Idade:</strong> {plano.dadosUsuario.idade} anos
            </div>
            <div className="info-card">
              <strong>Sexo:</strong> {plano.dadosUsuario.sexo}
            </div>
            <div className="info-card">
              <strong>Altura:</strong> {plano.dadosUsuario.altura} cm
            </div>
            <div className="info-card">
              <strong>Peso:</strong> {plano.dadosUsuario.peso} kg
            </div>
            <div className="info-card">
              <strong>IMC:</strong> {plano.resultados.imc} ({plano.resultados.classificacaoIMC})
            </div>
            <div className="info-card">
              <strong>Objetivo:</strong> {plano.dadosUsuario.objetivo.replace(/_/g, ' ')}
            </div>
          </div>

          <h2>Metas Nutricionais</h2>
          <div className="macros">
            <div className="macro-item proteina">
              <div>Proteínas</div>
              <div className="text-xl font-bold">{plano.resultados.macros.proteinas}%</div>
              <div>{plano.resultados.gramasMacros.proteinas}g/dia</div>
            </div>
            <div className="macro-item carbo">
              <div>Carboidratos</div>
              <div className="text-xl font-bold">{plano.resultados.macros.carboidratos}%</div>
              <div>{plano.resultados.gramasMacros.carboidratos}g/dia</div>
            </div>
            <div className="macro-item gordura">
              <div>Gorduras</div>
              <div className="text-xl font-bold">{plano.resultados.macros.gorduras}%</div>
              <div>{plano.resultados.gramasMacros.gorduras}g/dia</div>
            </div>
          </div>
          <p style={{ textAlign: 'center', margin: '15px 0' }}>
            <strong>Total de Calorias:</strong> {plano.resultados.caloriasDiarias} kcal/dia
          </p>

          <h2>Plano Alimentar - {diasSemana[diaAtual]}</h2>
          {Object.entries({
            'Café da Manhã (07:00)': planoDiaAtual.cafeManha || plano.planoDiario.cafeManha,
            'Lanche da Manhã (10:00)': planoDiaAtual.lancheManha || plano.planoDiario.lancheManha,
            'Almoço (12:30)': planoDiaAtual.almoco || plano.planoDiario.almoco,
            'Lanche da Tarde (16:00)': planoDiaAtual.lancheTarde || plano.planoDiario.lancheTarde,
            'Jantar (19:00)': planoDiaAtual.jantar || plano.planoDiario.jantar,
            'Ceia (21:30)': planoDiaAtual.ceia || plano.planoDiario.ceia
          }).map(([refeicao, conteudo]) => (
            <div key={refeicao} className="refeicao">
              <div className="horario">{refeicao}</div>
              <p>{conteudo}</p>
            </div>
          ))}

          <h2>Recomendações</h2>
          <ul className="recomendacoes">
            {plano.recomendacoes.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>

          <div className="footer">
            <p>Este plano foi gerado automaticamente com base nas suas informações pessoais.</p>
            <p>Consulte um profissional de nutrição para ajustes personalizados.</p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} NutriPlan. Plano gerado especialmente para você.</p>
          <p className="mt-1">Para dúvidas ou ajustes, consulte um nutricionista.</p>
        </div>
      </div>
    </div>
  );
}

export default Plano;