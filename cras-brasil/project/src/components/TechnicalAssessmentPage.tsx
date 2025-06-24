import React, { useState, useEffect } from 'react';
import { Users, Facebook, Instagram } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
}

const TechnicalAssessmentPage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const educationalContent = [
    "O CRAS é a porta de entrada do SUAS e oferece serviços de proteção básica. Atende famílias em situação de vulnerabilidade social, desenvolvendo atividades preventivas e fortalecendo vínculos comunitários.",
    "O território de abrangência do CRAS deve ter até 1.000 famílias referenciadas. Cada técnico deve conhecer as características socioeconômicas, demográficas e culturais do seu território de atuação.",
    "O PAIF (Serviço de Proteção e Atendimento Integral à Família) é o principal serviço do CRAS. Desenvolve trabalho social com famílias através de atendimentos individuais, grupais e comunitários.",
    "A matricialidade sociofamiliar é um dos princípios organizativos do SUAS. Significa que a família é a unidade de referência para o planejamento e execução das ações de assistência social.",
    "O diagnóstico socioterritorial é fundamental para o planejamento das ações do CRAS. Identifica situações de vulnerabilidade, recursos e potencialidades do território.",
    "A busca ativa é uma estratégia para identificar e incluir famílias em situação de vulnerabilidade nos serviços. Envolve mapeamento do território e articulação com outros equipamentos.",
    "O prontuário familiar é o principal instrumento de registro no CRAS. Deve conter histórico familiar, plano de acompanhamento e evolução do trabalho social desenvolvido.",
    "A articulação intersetorial é essencial no trabalho do CRAS. O assistente social deve conhecer e articular com equipamentos de saúde, educação, habitação e trabalho.",
    "O acompanhamento familiar deve ser sistematizado com objetivos claros, metas estabelecidas e avaliação periódica dos resultados alcançados com cada família.",
    "A participação social é promovida através de grupos de convivência, atividades comunitárias e estímulo à participação em instâncias de controle social como conselhos e conferências."
  ];

  const questions: Question[] = [
    {
      question: "O que é o CRAS e qual seu papel no SUAS?",
      options: [
        "É a porta de entrada do SUAS com serviços de proteção básica",
        "É um centro de acolhimento para idosos",
        "É apenas um posto de saúde",
        "É um centro educacional"
      ]
    },
    {
      question: "Quantas famílias deve ter o território de um CRAS?",
      options: [
        "Até 500 famílias",
        "Até 1.000 famílias",
        "Até 1.500 famílias", 
        "Até 2.000 famílias"
      ]
    },
    {
      question: "Qual é o principal serviço do CRAS?",
      options: [
        "Centro de Convivência",
        "Cadastro Único",
        "PAIF - Proteção e Atendimento Integral à Família",
        "Distribuição de cestas básicas"
      ]
    },
    {
      question: "O que significa matricialidade sociofamiliar?",
      options: [
        "Trabalhar apenas com crianças",
        "Atender apenas mulheres",
        "Focar só nos problemas individuais",
        "A família é a unidade de referência"
      ]
    },
    {
      question: "Para que serve o diagnóstico socioterritorial?",
      options: [
        "Para identificar vulnerabilidades e recursos do território",
        "Para controlar as pessoas",
        "Para cobrar impostos",
        "Para fazer estatísticas"
      ]
    },
    {
      question: "O que é busca ativa no CRAS?",
      options: [
        "Procurar pessoas perdidas",
        "Estratégia para identificar famílias vulneráveis",
        "Buscar documentos",
        "Encontrar trabalho para as pessoas"
      ]
    },
    {
      question: "Qual o principal instrumento de registro no CRAS?",
      options: [
        "Ficha de cadastro simples",
        "Lista de presença",
        "Prontuário familiar",
        "Caderno de anotações"
      ]
    },
    {
      question: "Por que articular com outros serviços é importante?",
      options: [
        "Para dividir o trabalho",
        "Para economizar dinheiro",
        "Para ter menos responsabilidade",
        "Para conhecer e articular com saúde, educação e outros"
      ]
    },
    {
      question: "Como deve ser o acompanhamento das famílias?",
      options: [
        "Sistematizado com objetivos e avaliação",
        "Apenas quando elas pedem",
        "Informal sem planejamento",
        "Só para dar benefícios"
      ]
    },
    {
      question: "Como o CRAS promove participação social?",
      options: [
        "Só com palestras obrigatórias",
        "Com grupos de convivência e atividades comunitárias",
        "Apenas reuniões formais",
        "Somente atendimento individual"
      ]
    }
  ];

  const handleOptionSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
  };

  const handleNext = async () => {
    if (!answers[currentQuestion]) {
      alert('Por favor, selecione uma opção antes de prosseguir.');
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentQuestion(prev => prev + 1);
      setIsTransitioning(false);
    } else {
      // Technical assessment completed - redirect to approval page
      try {
        const response = await fetch('/submit_psicotecnico', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ completed: true, answers })
        });
        
        const data = await response.json();
        if (data.success) {
          window.location.href = data.redirect || '/';
        } else {
          window.history.pushState({}, '', '/aprovado');
          window.location.reload();
        }
      } catch (error) {
        console.error('Error:', error);
        window.history.pushState({}, '', '/aprovado');
        window.location.reload();
      }
    }
  };

  const handlePrevious = async () => {
    if (currentQuestion > 0) {
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentQuestion(prev => prev - 1);
      setIsTransitioning(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Government Header */}
      <header className="bg-[#222222] text-white py-2">
        <div className="container mx-auto flex justify-between items-center px-4">
          <a className="font-bold text-sm" href="#">
            <img 
              src="https://i.ibb.co/TDkn2RR4/Imagem-29-03-2025-a-s-17-32.jpg" 
              alt="Logotipo Governo" 
              className="h-6"
            />
          </a>
          <nav>
            <ul className="flex space-x-4 text-[10px]">
              <li>
                <a className="hover:underline" href="#">ACESSO À INFORMAÇÃO</a>
              </li>
              <li>
                <a className="hover:underline" href="#">PARTICIPE</a>
              </li>
              <li>
                <a className="hover:underline" href="#">SERVIÇOS</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* CRAS Header */}
      <div className="bg-[#044785] py-3">
        <div className="container mx-auto px-4 text-center">
          <img 
            src="https://i.postimg.cc/zvmGLmsw-/Localiza-Fone-4-1-1.png" 
            alt="Logo CRAS" 
            className="h-8 mx-auto"
          />
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-[1800px] mx-auto px-2">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Avaliação Técnica CRAS</h1>
            <p className="text-gray-700 mb-2">Segunda etapa - Conhecimentos técnicos sobre trabalho no CRAS</p>
            <div className="h-1 w-32 bg-[#044785]"></div>
          </div>

          <div className="bg-[#044785] p-4 mb-4 rounded-lg">
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">{currentQuestion + 1}</h2>
              <p className="text-white">
                {educationalContent[currentQuestion]}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <form className="flex flex-col min-h-[400px]">
              <div className={`flex-grow transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <div className="question-wrapper">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">{questions[currentQuestion].question}</h2>
                  <div className="space-y-2">
                    {questions[currentQuestion].options.map((option, index) => (
                      <div key={index} className="flex items-center p-1">
                        <input 
                          type="radio" 
                          id={`q${currentQuestion}_option${index}`} 
                          name={`q${currentQuestion}`} 
                          value={option} 
                          checked={answers[currentQuestion] === option}
                          onChange={() => handleOptionSelect(option)}
                          className="hidden"
                        />
                        <label 
                          htmlFor={`q${currentQuestion}_option${index}`} 
                          className={`option-button flex items-center w-full cursor-pointer text-base border rounded-lg p-3 transition-all duration-200 min-h-[3.5rem] ${
                            answers[currentQuestion] === option 
                              ? 'border-[#1451B4] bg-blue-50 border-2' 
                              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-5 h-5 border-2 rounded-full mr-3 flex-shrink-0 relative ${
                            answers[currentQuestion] === option ? 'border-[#044785]' : 'border-gray-300'
                          }`}>
                            {answers[currentQuestion] === option && (
                              <div className="w-3 h-3 bg-[#044785] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                            )}
                          </div>
                          <span className="flex-grow">{option}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                <button 
                  type="button"
                  onClick={handlePrevious}
                  className={`bg-[#044785] hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#044785] transition-colors duration-200 ${
                    currentQuestion === 0 ? 'invisible' : ''
                  }`}
                >
                  ← Voltar
                </button>
                <div className="flex-grow"></div>
                <button 
                  type="button"
                  onClick={handleNext}
                  className={`bg-[#044785] hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#044785] transition-colors duration-200 ${
                    !answers[currentQuestion] ? 'opacity-50' : ''
                  }`}
                  disabled={!answers[currentQuestion]}
                >
                  {currentQuestion === questions.length - 1 ? '✓ Finalizar' : 'Continuar →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#044785] text-white py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 md:mb-12">
            <div>
              <h3 className="text-base font-medium mb-4 text-white">Sobre o CRAS</h3>
              <ul className="space-y-2 text-sm text-white">
                <li><a href="#" className="hover:text-gray-200">O que é o CRAS</a></li>
                <li><a href="#" className="hover:text-gray-200">Missão e Valores</a></li>
                <li><a href="#" className="hover:text-gray-200">Onde Atuamos</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-base font-medium mb-4 text-white">Serviços</h3>
              <ul className="space-y-2 text-sm text-white">
                <li><a href="#" className="hover:text-gray-200">Proteção Social Básica</a></li>
                <li><a href="#" className="hover:text-gray-200">Atendimento às Famílias</a></li>
                <li><a href="#" className="hover:text-gray-200">Grupos de Convivência</a></li>
                <li><a href="#" className="hover:text-gray-200">Benefícios Sociais</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-base font-medium mb-4 text-white">Assistência Social</h3>
              <ul className="space-y-2 text-sm text-white">
                <li><a href="#" className="hover:text-gray-200">Cadastro Único</a></li>
                <li><a href="#" className="hover:text-gray-200">Bolsa Família</a></li>
                <li><a href="#" className="hover:text-gray-200">BPC</a></li>
                <li><a href="#" className="hover:text-gray-200">Auxílio Brasil</a></li>
                <li><a href="#" className="hover:text-gray-200">Programas Sociais</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-base font-medium mb-4 text-white">Trabalhe Conosco</h3>
              <ul className="space-y-2 text-sm text-white">
                <li><a href="#" className="hover:text-gray-200">Vagas</a></li>
                <li><a href="#" className="hover:text-gray-200">Portal do Servidor</a></li>
                <li><a href="#" className="hover:text-gray-200">Capacitações</a></li>
                <li><a href="#" className="hover:text-gray-200">Concursos</a></li>
              </ul>
            </div>
          </div>
          
          <hr className="border-blue-400 mb-6" />
          
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-white">
            <div className="mb-4 md:mb-0">
              <span>© Copyright 2025 CRAS - Centro de Referência de Assistência Social</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              <a href="#" className="hover:text-gray-200">Mapa do Site</a>
              <span>|</span>
              <a href="#" className="hover:text-gray-200">Política de Privacidade</a>
              <span>|</span>
              <a href="#" className="hover:text-gray-200">Lei de Acesso à Informação</a>
              <span>|</span>
              <a href="#" className="hover:text-gray-200">Acessibilidade</a>
              <span>|</span>
              <a href="#" className="hover:text-gray-200">Ouvidoria</a>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-white hover:text-gray-200">
                <Facebook size={16} />
              </a>
              <a href="#" className="text-white hover:text-gray-200">
                <Instagram size={16} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Accessibility Icon */}
      <a 
        href="#" 
        className="fixed bottom-4 right-4 bg-blue-600 p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        <Users className="w-6 h-6 text-white" />
      </a>
    </div>
  );
};

export default TechnicalAssessmentPage;