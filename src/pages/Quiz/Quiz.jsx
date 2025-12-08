import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';
import { useAuth } from '../../contexts/AuthContext';

// Componente auxiliar CheckIcon
function CheckIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

function Quiz() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [etapa, setEtapa] = useState(1);
  const [formData, setFormData] = useState({
    idade: '',
    sexo: '',
    altura: '',
    peso: '',
    objetivo: '',
    atividade: '',
    condicoes: '',
    alergias: '',
  });
  const [planoCompleto, setPlanoCompleto] = useState(null);
  const [loading, setLoading] = useState(false);

  const etapasTotais = 6;

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!user) {
      navigate('/login');
      toast.error("Para gerar o seu plano você precisa estar logado!", {
        autoClose: 3000,
        hideProgressBar: true
      });
    }
  }, [user, navigate]);

  // Atualizar dados do formulário
  const handleChange = (campo, valor) => {
    setFormData({ ...formData, [campo]: valor });
  };

  // Função para calcular IMC
  const calcularIMC = (peso, altura) => {
    const alturaM = altura / 100;
    const imc = peso / (alturaM * alturaM);
    return imc.toFixed(1);
  };

  // Função para classificar IMC
  const classificarIMC = (imc) => {
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 24.9) return 'Peso normal';
    if (imc < 29.9) return 'Sobrepeso';
    if (imc < 34.9) return 'Obesidade Grau I';
    if (imc < 39.9) return 'Obesidade Grau II';
    return 'Obesidade Grau III';
  };

  // Função para calcular Taxa Metabólica Basal (TMB)
  const calcularTMB = (idade, peso, altura, sexo) => {
    if (sexo.toLowerCase() === 'masculino') {
      return 10 * peso + 6.25 * altura - 5 * idade + 5;
    } else {
      return 10 * peso + 6.25 * altura - 5 * idade - 161;
    }
  };

  // Função para calcular calorias baseado no nível de atividade
  const calcularCalorias = (tmb, atividade) => {
    const fatores = {
      'Sedentário': 1.2,
      'Levemente ativo': 1.375,
      'Moderadamente ativo': 1.55,
      'Altamente ativo': 1.725
    };
    return Math.round(tmb * (fatores[atividade] || 1.2));
  };

  // Função para ajustar calorias baseado no objetivo
  const ajustarCaloriasObjetivo = (calorias, objetivo) => {
    const ajustes = {
      'perda_de_peso': -500,
      'ganho_de_massa_magra': 500,
      'ganho_de_peso': 300,
      'manter_peso': 0
    };
    return calorias + (ajustes[objetivo] || 0);
  };

  // Função para gerar refeições personalizadas
  const gerarRefeicao = (tipoRefeicao, objetivo, condicoes, alergias, sexo) => {
    // Banco de dados de alimentos
    const alimentos = {
      proteinas: {
        normal: ['Frango grelhado', 'Peixe assado', 'Ovos', 'Carne magra', 'Tofu', 'Lentilha'],
        diabetico: ['Peixe', 'Frango sem pele', 'Claras de ovo', 'Soja'],
        hipertenso: ['Peixe fresco', 'Frango sem pele', 'Feijão', 'Grão-de-bico']
      },
      carboidratos: {
        normal: ['Arroz integral', 'Batata doce', 'Quinoa', 'Aveia', 'Pão integral'],
        diabetico: ['Batata doce', 'Aveia', 'Quinoa', 'Legumes'],
        semGluten: ['Quinoa', 'Arroz', 'Batata doce', 'Mandioca']
      },
      vegetais: ['Brócolis', 'Espinafre', 'Alface', 'Tomate', 'Cenoura', 'Abobrinha'],
      frutas: {
        normal: ['Banana', 'Maçã', 'Laranja', 'Morango', 'Abacate'],
        diabetico: ['Morango', 'Framboesa', 'Amora', 'Mirtilo']
      }
    };

    // Filtrar por restrições
    let opcoesProteinas = alimentos.proteinas.normal;
    let opcoesCarboidratos = alimentos.carboidratos.normal;
    let opcoesFrutas = alimentos.frutas.normal;

    if (condicoes === 'Diabetes') {
      opcoesProteinas = alimentos.proteinas.diabetico;
      opcoesCarboidratos = alimentos.carboidratos.diabetico;
      opcoesFrutas = alimentos.frutas.diabetico;
    } else if (condicoes === 'Hipertensão') {
      opcoesProteinas = alimentos.proteinas.hipertenso;
    }

    if (alergias === 'Glúten') {
      opcoesCarboidratos = alimentos.carboidratos.semGluten;
    }

    // Tamanho da porção baseado no sexo
    const porcao = sexo.toLowerCase() === 'masculino' ? 'grande' : 'média';

    // Gerar refeição baseada no tipo e objetivo
    let refeicao = '';
    const randomProtein = opcoesProteinas[Math.floor(Math.random() * opcoesProteinas.length)];
    const randomCarb = opcoesCarboidratos[Math.floor(Math.random() * opcoesCarboidratos.length)];
    const randomVegetal = alimentos.vegetais[Math.floor(Math.random() * alimentos.vegetais.length)];
    const randomFruta = opcoesFrutas[Math.floor(Math.random() * opcoesFrutas.length)];

    switch (tipoRefeicao) {
      case 'cafeManha':
        if (objetivo === 'perda_de_peso') {
          refeicao = `2 ovos mexidos com espinafre, 1 fatia de pão integral, 1 xícara de chá verde`;
        } else if (objetivo === 'ganho_de_massa_magra') {
          refeicao = `Aveia com whey protein, 2 fatias de pão integral com pasta de amendoim, 1 banana`;
        } else {
          refeicao = `1 xícara de iogurte natural com granola e ${randomFruta}`;
        }
        break;

      case 'lancheManha':
        refeicao = objetivo === 'perda_de_peso'
          ? `1 ${randomFruta} com 10 amêndoas`
          : `1 ${randomFruta} com 1 colher de pasta de amendoim`;
        break;

      case 'almoco':
        const porcaoProteina = porcao === 'grande' ? '200g' : '150g';
        const porcaoCarb = porcao === 'grande' ? '100g' : '80g';
        refeicao = `${porcaoProteina} de ${randomProtein}, ${porcaoCarb} de ${randomCarb}, salada de ${randomVegetal} à vontade`;
        break;

      case 'lancheTarde':
        if (objetivo === 'ganho_de_massa_magra') {
          refeicao = `Shake de whey protein com 1 banana e aveia`;
        } else {
          refeicao = `1 iogurte natural ou 1 porção de ${randomFruta}`;
        }
        break;

      case 'jantar':
        const porcaoJantar = porcao === 'grande' ? '180g' : '130g';
        refeicao = `${porcaoJantar} de ${randomProtein} com legumes grelhados (${randomVegetal})`;
        break;

      case 'ceia':
        refeicao = objetivo === 'perda_de_peso'
          ? `1 xícara de chá de camomila`
          : `1 copo de leite desnatado ou 1 iogurte grego`;
        break;

      default:
        refeicao = `${randomProtein} com ${randomCarb} e ${randomVegetal}`;
    }

    // Ajustar para alergias
    if (alergias === 'Lactose') {
      refeicao = refeicao.replace(/leite|iogurte|queijo/gi, 'alternativa sem lactose');
    }

    return refeicao;
  };

  // Função para gerar recomendações personalizadas
  const gerarRecomendacoes = (objetivo, atividade, condicoes, alergias) => {
    const recomendacoes = [];

    // Recomendações baseadas no objetivo
    switch (objetivo) {
      case 'perda_de_peso':
        recomendacoes.push(
          'Beba 2-3 litros de água por dia',
          'Faça 5-6 refeições diárias em porções menores',
          'Priorize alimentos integrais e ricos em fibras',
          'Evite alimentos ultraprocessados e bebidas açucaradas'
        );
        break;
      case 'ganho_de_massa_magra':
        recomendacoes.push(
          'Consuma proteína em todas as refeições',
          'Mantenha superávit calórico moderado (300-500 kcal)',
          'Treine com pesos 4-5 vezes por semana',
          'Descanse adequadamente entre os treinos'
        );
        break;
      case 'ganho_de_peso':
        recomendacoes.push(
          'Aumente gradualmente as porções',
          'Inclua alimentos calóricos saudáveis como abacate e oleaginosas',
          'Faça refeições a cada 3 horas',
          'Combine carboidratos complexos com proteínas'
        );
        break;
      default:
        recomendacoes.push(
          'Mantenha a consistência alimentar',
          'Equilibre os grupos alimentares',
          'Pratique atividade física regular',
          'Monitore seu peso semanalmente'
        );
    }

    // Recomendações baseadas na atividade
    if (atividade === 'Sedentário') {
      recomendacoes.push('Inicie atividades físicas leves como caminhadas 3x por semana');
    } else if (atividade === 'Altamente ativo') {
      recomendacoes.push('Aumente a ingestão de carboidratos nos dias de treino intenso');
    }

    // Recomendações baseadas em condições
    if (condicoes === 'Diabetes') {
      recomendacoes.push(
        'Monitore os níveis de glicose regularmente',
        'Prefira carboidratos de baixo índice glicêmico',
        'Evite açúcares simples e refinados'
      );
    } else if (condicoes === 'Hipertensão') {
      recomendacoes.push(
        'Reduza o consumo de sódio',
        'Evite alimentos enlatados e processados',
        'Aumente a ingestão de potássio (banana, abacate)'
      );
    } else if (condicoes === 'Dislipidemias') {
      recomendacoes.push(
        'Reduza gorduras saturadas e trans',
        'Aumente o consumo de fibras solúveis',
        'Prefira gorduras insaturadas (azeite, abacate)'
      );
    }

    // Recomendações baseadas em alergias
    if (alergias === 'Glúten') {
      recomendacoes.push('Leia atentamente os rótulos dos alimentos');
    } else if (alergias === 'Lactose') {
      recomendacoes.push('Opte por leites vegetais (amêndoas, aveia, soja)');
    } else if (alergias === 'Amendoim') {
      recomendacoes.push('Evite alimentos que possam conter traços de amendoim');
    }

    return recomendacoes.slice(0, 6); // Limitar a 6 recomendações
  };

  // Função principal para gerar plano alimentar
  const gerarPlanoAlimentar = () => {
    const { idade, sexo, altura, peso, objetivo, atividade, condicoes, alergias } = formData;

    // Converter para números
    const idadeNum = parseInt(idade);
    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura);

    // Calcular valores básicos
    const imc = calcularIMC(pesoNum, alturaNum);
    const classificacaoIMC = classificarIMC(parseFloat(imc));
    const tmb = calcularTMB(idadeNum, pesoNum, alturaNum, sexo);
    const caloriasDiarias = ajustarCaloriasObjetivo(
      calcularCalorias(tmb, atividade),
      objetivo
    );

    // Distribuição de macros baseada no objetivo
    let macros;
    switch (objetivo) {
      case 'perda_de_peso':
        macros = { proteinas: 40, carboidratos: 30, gorduras: 30 };
        break;
      case 'ganho_de_massa_magra':
        macros = { proteinas: 35, carboidratos: 40, gorduras: 25 };
        break;
      case 'ganho_de_peso':
        macros = { proteinas: 25, carboidratos: 50, gorduras: 25 };
        break;
      default:
        macros = { proteinas: 30, carboidratos: 40, gorduras: 30 };
    }

    // Calcular gramas de cada macronutriente
    const proteinasG = Math.round((caloriasDiarias * macros.proteinas / 100) / 4);
    const carboidratosG = Math.round((caloriasDiarias * macros.carboidratos / 100) / 4);
    const gordurasG = Math.round((caloriasDiarias * macros.gorduras / 100) / 9);

    // Gerar refeições
    const planoDiario = {
      cafeManha: gerarRefeicao('cafeManha', objetivo, condicoes, alergias, sexo),
      lancheManha: gerarRefeicao('lancheManha', objetivo, condicoes, alergias, sexo),
      almoco: gerarRefeicao('almoco', objetivo, condicoes, alergias, sexo),
      lancheTarde: gerarRefeicao('lancheTarde', objetivo, condicoes, alergias, sexo),
      jantar: gerarRefeicao('jantar', objetivo, condicoes, alergias, sexo),
      ceia: gerarRefeicao('ceia', objetivo, condicoes, alergias, sexo)
    };

    // Gerar recomendações
    const recomendacoes = gerarRecomendacoes(objetivo, atividade, condicoes, alergias);

    // Montar plano completo
    const planoCompleto = {
      dadosUsuario: {
        idade: idadeNum,
        sexo,
        altura: alturaNum,
        peso: pesoNum,
        objetivo,
        atividade,
        condicoes,
        alergias
      },
      resultados: {
        imc,
        classificacaoIMC,
        tmb: Math.round(tmb),
        caloriasDiarias,
        macros,
        gramasMacros: {
          proteinas: proteinasG,
          carboidratos: carboidratosG,
          gorduras: gordurasG
        }
      },
      planoDiario,
      recomendacoes,
      dataCriacao: new Date().toISOString()
    };

    return planoCompleto;
  };

  // Função para salvar plano no servidor
  const salvarPlanoNoServidor = async (plano) => {
    try {
      const token = localStorage.getItem('accessToken');

      if (!token || !user?.id) {
        console.log('Token ou usuário não encontrado, salvando apenas localmente');
        return null;
      }

      const response = await axios.post('http://localhost:3000/quiz/salvar-plano', {
        ...plano,
        usuarioId: user.id
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      return response.data;
    } catch (error) {
      console.log('Erro ao salvar no servidor, plano será mantido localmente:', error);
      return null;
    }
  };

  // Função principal para gerar plano
  const salvarQuizNoBanco = async (planoGerado) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.log('Token não encontrado, salvando apenas localmente');
      
      // MUDANÇA AQUI: Salvar múltiplos planos no localStorage
      const historicoPlano = JSON.parse(localStorage.getItem('historicoPlanos') || '[]');
      
      const novoPlano = {
        id: Date.now().toString(),
        respostas: formData,
        planoGerado,
        dataSalvamento: new Date().toISOString()
      };
      
      // Adicionar novo plano ao histórico
      historicoPlano.unshift(novoPlano); // unshift adiciona no início do array
      
      // Salvar histórico atualizado
      localStorage.setItem('historicoPlanos', JSON.stringify(historicoPlano));
      
      // Também salvar plano atual separadamente
      localStorage.setItem('planoAtual', JSON.stringify(novoPlano));
      
      return { success: true, local: true };
    }

    const response = await axios.post('http://localhost:3000/api/quiz/salvar', {
      respostas: formData,
      planoGerado
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao salvar no banco:', error);
    
    // MUDANÇA AQUI: Fallback com múltiplos planos no localStorage
    const historicoPlano = JSON.parse(localStorage.getItem('historicoPlanos') || '[]');
    
    const novoPlano = {
      id: Date.now().toString(),
      respostas: formData,
      planoGerado,
      dataSalvamento: new Date().toISOString()
    };
    
    historicoPlano.unshift(novoPlano);
    localStorage.setItem('historicoPlanos', JSON.stringify(historicoPlano));
    localStorage.setItem('planoAtual', JSON.stringify(novoPlano));
    
    return { 
      success: true, 
      local: true,
      message: 'Salvo localmente (offline)' 
    };
  }
};

const gerarPlano = async () => {
  setLoading(true);
  
  try {
    // 1. Gerar plano alimentar localmente
    const planoGerado = gerarPlanoAlimentar();
    
    // 2. Salvar no banco de dados
    const resultadoSalvamento = await salvarQuizNoBanco(planoGerado);
    
    // 3. Atualizar estado com o plano
    setPlanoCompleto(planoGerado);
    
    if (resultadoSalvamento.local) {
      toast.success('Plano gerado e salvo localmente!');
    } else {
      toast.success('Plano salvo no seu perfil! 🎉');
    }
    
  } catch (error) {
    console.error('Erro ao gerar plano:', error);
    toast.error('Ocorreu um erro ao gerar seu plano. Tente novamente.');
    
    // Fallback: plano básico em caso de erro
    const planoBasico = {
      dadosUsuario: formData,
      resultados: {
        imc: calcularIMC(formData.peso, formData.altura),
        classificacaoIMC: 'Calculando...',
        caloriasDiarias: 2000,
        macros: { proteinas: 30, carboidratos: 40, gorduras: 30 }
      },
      planoDiario: {
        cafeManha: '2 ovos mexidos, 1 fatia de pão integral, 1 fruta',
        almoco: '150g de proteína, 100g de carboidrato, salada à vontade',
        jantar: 'Omelete com vegetais ou sopa de legumes'
      },
      recomendacoes: ['Beba bastante água', 'Mantenha uma alimentação balanceada'],
      dataCriacao: new Date().toISOString()
    };
    
    setPlanoCompleto(planoBasico);
  } finally {
    setLoading(false);
  }
};

  // Avançar para a etapa de resultados
  const finalizar = async () => {
    await gerarPlano();
    setEtapa(etapa + 1);
  };

  // Efeito para confetti quando chegar na última etapa
  useEffect(() => {
    if (etapa === 6 && planoCompleto) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#3b82f6', '#eab308']
      });
    }
  }, [etapa, planoCompleto]);

  // Funções de navegação
  const proxima = () => setEtapa(etapa + 1);
  const voltar = () => setEtapa(etapa - 1);

  // Frases motivacionais para cada etapa
  const frases = {
    1: 'Vamos começar com algumas informações básicas para personalizar seu plano',
    2: 'Qual é seu foco? Tudo começa com um objetivo claro',
    3: 'Nos diga como é sua rotina física',
    4: 'Precisamos saber se você possui alguma condição específica',
    5: 'Nos avise sobre restrições alimentares',
    6: 'Tudo pronto! Veja o resultado final',
  };

  // --- CONSTANTES NECESSÁRIAS PARA RENDERIZAÇÃO ---
  const horariosRefeicoes = {
    cafeManha: '07:00 - 08:00',
    lancheManha: '10:00 - 10:30',
    almoco: '12:30 - 13:30',
    lancheTarde: '16:00 - 16:30',
    jantar: '19:00 - 20:00',
    ceia: '21:30 - 22:00'
  };

  // --- FUNÇÕES DE INTERAÇÃO (BOTÕES) ---

  const imprimirPlano = () => {
    // Abre a janela de impressão do navegador
    window.print();
  };

  const exportarPlano = () => {
    if (!plano) {
      toast.error("Nenhum plano carregado para exportar.");
      return;
    }
    
    try {
      // Cria um arquivo JSON formatado para download
      const fileName = `plano-alimentar-${new Date().toISOString().split('T')[0]}.json`;
      const json = JSON.stringify(plano, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const href = URL.createObjectURL(blob);
      
      // Cria um link temporário e clica nele
      const link = document.createElement('a');
      link.href = href;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Limpeza
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
      
      toast.success('Plano exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error('Erro ao exportar o arquivo.');
    }
  };

  const compartilharPlano = async () => {
    const titulo = 'Meu Plano Alimentar';
    const texto = `Confira meu plano alimentar para ${plano?.dadosUsuario?.objetivo?.replace(/_/g, ' ') || 'melhorar a saúde'}!`;
    const url = window.location.href;

    // Tenta usar a API nativa de compartilhamento (Celular/Tablet)
    if (navigator.share) {
      try {
        await navigator.share({
          title: titulo,
          text: texto,
          url: url
        });
      } catch (error) {
        // Ignora erro se o usuário cancelar o compartilhamento
        if (error.name !== 'AbortError') {
          console.error('Erro ao compartilhar', error);
          toast.error('Não foi possível compartilhar.');
        }
      }
    } else {
      // Fallback para PC: Copia o link para a área de transferência
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copiado para a área de transferência!');
      } catch (err) {
        toast.info('Copie o link do navegador para compartilhar.');
      }
    }
  };

  return (
    <div className="min-h-screen  from-green-50 to-green-100 flex items-center justify-center p-4 font-[Poppins]">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 md:p-10 relative overflow-hidden">

        {/* Barra de progresso */}
        <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-green-500 transition-all duration-500 ease-out"
            style={{ width: `${(etapa / etapasTotais) * 100}%` }}
          />
        </div>

        {/* Frase motivacional */}
        <p className="text-sm text-gray-500 italic mb-6 text-center font-medium">
          {frases[etapa]}
        </p>

        <div className="animate-fadeIn">

          {/* ETAPA 1: Informações básicas */}
          {etapa === 1 && (
            <div className="space-y-5">
              <div className="flex justify-center mb-4">
                <img
                  src="/img/logo.png"
                  alt="Logo"
                  className="cursor-pointer h-20 object-contain"
                />
              </div>

              <h2 className="text-2xl font-bold text-green-800 text-center">
                Informações Básicas
              </h2>

              {/* Campo Idade */}
              <div>
                <label className="block text-left font-semibold text-gray-700 mb-1">
                  Idade
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  placeholder="Ex: 25"
                  value={formData.idade}
                  onChange={(e) => handleChange('idade', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                />
              </div>

              {/* Campo Sexo */}
              <div>
                <label className="block text-left font-semibold text-gray-700 mb-1">
                  Sexo
                </label>
                <select
                  value={formData.sexo}
                  onChange={(e) => handleChange('sexo', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                >
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              {/* Campos Altura e Peso */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-left font-semibold text-gray-700 mb-1">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="250"
                    placeholder="Ex: 170"
                    value={formData.altura}
                    onChange={(e) => handleChange('altura', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-left font-semibold text-gray-700 mb-1">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="300"
                    placeholder="Ex: 65.5"
                    value={formData.peso}
                    onChange={(e) => handleChange('peso', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>

              {/* Botão Avançar */}
              <button
                onClick={proxima}
                disabled={!formData.idade || !formData.sexo || !formData.altura || !formData.peso}
                className="w-full mt-6 py-3 cursor-pointer bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition transform hover:scale-105 shadow-md"
              >
                Avançar
              </button>
            </div>
          )}

          {/* ETAPA 2: Objetivo */}
          {etapa === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-green-800 text-center">
                Qual é o seu objetivo?
              </h2>

              <div className="grid gap-3">
                {[
                  {
                    label: 'Ganho de massa magra',
                    value: 'ganho_de_massa_magra',
                    desc: 'Aumentar músculos com definição'
                  },
                  {
                    label: 'Perder Peso',
                    value: 'perda_de_peso',
                    desc: 'Reduzir gordura corporal'
                  },
                  {
                    label: 'Ganhar Peso',
                    value: 'ganho_de_peso',
                    desc: 'Aumentar peso de forma saudável'
                  },
                  {
                    label: 'Manter Peso',
                    value: 'manter_peso',
                    desc: 'Manter o peso atual'
                  },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleChange('objetivo', opt.value)}
                    className={`p-4 rounded-xl cursor-pointer font-medium text-left transition-all transform hover:translate-x-1 ${formData.objetivo === opt.value
                      ? 'bg-green-600 text-white shadow-lg ring-2 ring-green-300'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-green-50 hover:border-green-300'
                      }`}
                  >
                    <div className="font-semibold">{opt.label}</div>
                    <div className="text-sm opacity-80 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={voltar}
                  className="cursor-pointer flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Voltar
                </button>
                <button
                  onClick={proxima}
                  disabled={!formData.objetivo}
                  className="flex-1 py-3 bg-green-600 cursor-pointer text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition shadow-md"
                >
                  Avançar
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 3: Nível de atividade */}
          {etapa === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-green-800 text-center">
                Nível de atividade física
              </h2>

              <div className="grid gap-3">
                {[
                  {
                    label: 'Sedentário',
                    desc: 'Pouco ou nenhum exercício'
                  },
                  {
                    label: 'Levemente ativo',
                    desc: 'Exercício leve 1-3 dias/semana'
                  },
                  {
                    label: 'Moderadamente ativo',
                    desc: 'Exercício moderado 3-5 dias/semana'
                  },
                  {
                    label: 'Altamente ativo',
                    desc: 'Exercício intenso 6-7 dias/semana'
                  },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleChange('atividade', opt.label)}
                    className={`p-4 rounded-xl cursor-pointer font-medium text-left transition-all transform hover:translate-x-1 ${formData.atividade === opt.label
                      ? 'bg-green-600 text-white shadow-lg ring-2 ring-green-300'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-green-50 hover:border-green-300'
                      }`}
                  >
                    <div className="font-semibold">{opt.label}</div>
                    <div className="text-sm opacity-80 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={voltar}
                  className="flex-1 py-3 cursor-pointer bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Voltar
                </button>
                <button
                  onClick={proxima}
                  disabled={!formData.atividade}
                  className="flex-1 py-3 bg-green-600 cursor-pointer text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition shadow-md"
                >
                  Avançar
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 4: Condições crônicas */}
          {etapa === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-green-800 text-center">
                Condições crônicas?
              </h2>

              <div className="grid gap-3">
                {[
                  { label: 'Diabetes', desc: 'Controle de glicose' },
                  { label: 'Hipertensão', desc: 'Pressão arterial alta' },
                  { label: 'Dislipidemias', desc: 'Colesterol ou triglicerídeos altos' },
                  { label: 'Nenhuma', desc: 'Não possuo condições crônicas' },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleChange('condicoes', opt.label)}
                    className={`p-4 rounded-xl cursor-pointer font-medium text-left transition-all transform hover:translate-x-1 ${formData.condicoes === opt.label
                      ? 'bg-green-600 text-white shadow-lg ring-2 ring-green-300'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-green-50 hover:border-green-300'
                      }`}
                  >
                    <div className="font-semibold">{opt.label}</div>
                    <div className="text-sm opacity-80 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={voltar}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  onClick={proxima}
                  disabled={!formData.condicoes}
                  className="flex-1 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition shadow-md cursor-pointer"
                >
                  Avançar
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 5: Alergias */}
          {etapa === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-green-800 text-center">
                Alergias ou intolerâncias?
              </h2>

              <div className="grid gap-3">
                {[
                  { label: 'Glúten', desc: 'Intolerância ao glúten' },
                  { label: 'Lactose', desc: 'Intolerância à lactose' },
                  { label: 'Amendoim', desc: 'Alergia a amendoim' },
                  { label: 'Nenhuma', desc: 'Não tenho alergias' },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleChange('alergias', opt.label)}
                    className={`p-4 rounded-xl font-medium text-left transition-all transform hover:translate-x-1 ${formData.alergias === opt.label
                      ? 'bg-green-600 text-white shadow-lg ring-2 ring-green-300'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-green-50 hover:border-green-300 cursor-pointer'
                      }`}
                  >
                    <div className="font-semibold">{opt.label}</div>
                    <div className="text-sm opacity-80 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={voltar}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  onClick={finalizar}
                  disabled={!formData.alergias || loading}
                  className="flex-1 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition shadow-md flex justify-center items-center cursor-pointer"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Gerando plano...
                    </div>
                  ) : 'Finalizar'}
                </button>
              </div>
            </div>
          )}

          {/* ETAPA 6: Resultados */}
          {etapa === 6 && planoCompleto && (
            <div className="text-center space-y-6 animate-fadeIn">
              <div className="flex justify-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckIcon className="w-10 h-10 text-green-600" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-green-800">
                Plano Gerado com Sucesso!
              </h2>

              <div className="bg-green-50 p-6 rounded-2xl space-y-6 text-left border border-green-100 shadow-inner">

                {/* Resumo dos resultados */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-gray-600 font-medium">IMC Calculado</p>
                    <p className="text-2xl font-bold text-green-700">
                      {planoCompleto.resultados.imc}
                    </p>
                    <p className="text-sm text-gray-500">
                      {planoCompleto.resultados.classificacaoIMC}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-gray-600 font-medium">Meta Calórica Diária</p>
                    <p className="text-2xl font-bold text-green-700">
                      {planoCompleto.resultados.caloriasDiarias} kcal
                    </p>
                    <p className="text-sm text-gray-500">
                      Personalizada para você
                    </p>
                  </div>
                </div>

                {/* Macronutrientes */}
                <div>
                  <h3 className="text-green-800 font-semibold mb-3">
                    Distribuição de Macronutrientes
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
                      <p className="font-bold text-blue-700 text-lg">
                        {planoCompleto.resultados.macros.proteinas}%
                      </p>
                      <p className="text-sm text-gray-600">Proteínas</p>
                      <p className="text-xs text-gray-500">
                        {planoCompleto.resultados.gramasMacros.proteinas}g/dia
                      </p>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg text-center border border-yellow-100">
                      <p className="font-bold text-yellow-700 text-lg">
                        {planoCompleto.resultados.macros.carboidratos}%
                      </p>
                      <p className="text-sm text-gray-600">Carboidratos</p>
                      <p className="text-xs text-gray-500">
                        {planoCompleto.resultados.gramasMacros.carboidratos}g/dia
                      </p>
                    </div>

                    <div className="bg-red-50 p-3 rounded-lg text-center border border-red-100">
                      <p className="font-bold text-red-700 text-lg">
                        {planoCompleto.resultados.macros.gorduras}%
                      </p>
                      <p className="text-sm text-gray-600">Gorduras</p>
                      <p className="text-xs text-gray-500">
                        {planoCompleto.resultados.gramasMacros.gorduras}g/dia
                      </p>
                    </div>
                  </div>
                </div>

                {/* Plano alimentar diário */}
                <div>
                  <h3 className="text-green-800 font-semibold mb-3">
                    Plano Alimentar Diário
                  </h3>
                  <div className="space-y-3">
                    {Object.entries({
                      cafeManha: '☕ Café da Manhã',
                      lancheManha: '🍎 Lanche da Manhã',
                      almoco: '🍽️ Almoço',
                      lancheTarde: '🥪 Lanche da Tarde',
                      jantar: '🌙 Jantar',
                      ceia: '🌜 Ceia'
                    }).map(([key, label]) => (
                      <div key={key} className="bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                        <h4 className="text-green-700 font-medium mb-1">
                          {label}
                        </h4>
                        <p className="text-gray-700 text-sm">
                          {planoCompleto.planoDiario[key]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recomendações */}
                {planoCompleto.recomendacoes && planoCompleto.recomendacoes.length > 0 && (
                  <div>
                    <h3 className="text-green-800 font-semibold mb-3">
                      💡 Recomendações Personalizadas
                    </h3>
                    <ul className="space-y-2">
                      {planoCompleto.recomendacoes.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <CheckIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/plano', { state: { plano: planoCompleto } })}
                  className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition transform hover:scale-105 shadow-lg cursor-pointer"
                >
                  Ver Plano Detalhado
                </button>

                <button
                  onClick={() => navigate('/dashboard/myplan')}
                  className="flex-1 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition transform hover:scale-105 shadow-lg cursor-pointer"
                >
                  Ir para Dashboard
                </button>
              </div>

              <p className="text-sm text-gray-500">
                Seu plano foi salvo e você pode acessá-lo a qualquer momento pelo Dashboard.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;