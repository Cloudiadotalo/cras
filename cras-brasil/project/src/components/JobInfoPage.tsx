import React from 'react';
import { AlertTriangle, CheckCircle, ClipboardList, Tag as Tasks, PlayCircle, Users, Facebook, Instagram } from 'lucide-react';

const JobInfoPage: React.FC = () => {
  const startAssessment = () => {
    console.log('startAssessment function called');
    try {
      const button = document.querySelector('button') as HTMLButtonElement;
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="inline-flex items-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Preparando testes...</span>';
        button.disabled = true;
        
        setTimeout(() => {
          console.log('Redirecting to /exame');
          window.history.pushState({}, '', '/exame');
          window.location.reload();
        }, 1500);
      } else {
        console.error('Button not found');
        window.history.pushState({}, '', '/exame');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error in startAssessment:', error);
      window.history.pushState({}, '', '/exame');
      window.location.reload();
    }
  };

  React.useEffect(() => {
    localStorage.setItem('infoPageCompleted', 'true');
    console.log('Info page accessed - marking as completed');
  }, []);

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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {/* Urgency Alert */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="text-red-500" size={20} />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">Contratação Urgente</h3>
                <p className="text-red-700">
                  O CRAS está precisando urgentemente de novos Assistentes Sociais para atender à crescente demanda de famílias em situação de vulnerabilidade social.
                </p>
              </div>
            </div>
          </div>

          {/* Job Benefits */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Funcionário Público Efetivo
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Estabilidade Profissional</h3>
                <ul className="text-blue-700 space-y-1">
                  <li><CheckCircle className="inline mr-2" size={16} />Contrato definitivo como funcionário público</li>
                  <li><CheckCircle className="inline mr-2" size={16} />Estabilidade no emprego garantida</li>
                  <li><CheckCircle className="inline mr-2" size={16} />Não pode ser demitido sem justa causa</li>
                  <li><CheckCircle className="inline mr-2" size={16} />Progressão de carreira</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Benefícios Completos</h3>
                <ul className="text-green-700 space-y-1">
                  <li><CheckCircle className="inline mr-2" size={16} />Salário de R$ 4.500 - R$ 5.500</li>
                  <li><CheckCircle className="inline mr-2" size={16} />13º salário e férias</li>
                  <li><CheckCircle className="inline mr-2" size={16} />Plano de saúde e odontológico</li>
                  <li><CheckCircle className="inline mr-2" size={16} />Vale alimentação R$ 1.320/mês</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              <ClipboardList className="inline text-[#044785] mr-2" size={24} />
              Requisitos para a Vaga
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">✅ O que é EXIGIDO:</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>→ Boa comunicação com o público</li>
                    <li>→ Disposição para ajudar famílias carentes</li>
                    <li>→ Empatia e paciência</li>
                    <li>→ Responsabilidade social</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
                <p className="text-yellow-800">
                  <strong>Importante:</strong> O CRAS oferecerá toda a capacitação necessária para que você possa exercer a função com excelência.
                </p>
              </div>
            </div>
          </div>

          {/* Assessment Process */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              <Tasks className="inline text-[#044785] mr-2" size={24} />
              Processo de Seleção
            </h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-blue-800 mb-4">
                Para garantir que você está preparado para atender as famílias com qualidade, realizaremos <strong>2 testes online</strong> simples:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Teste 1: Inteligência Emocional
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Avalia sua capacidade de lidar com situações emocionais e relacionar-se com pessoas em vulnerabilidade.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Teste 2: Avaliação Psicotécnica
                  </h4>
                  <p className="text-blue-700 text-sm">
                    Verifica suas habilidades de raciocínio e aptidão para o trabalho social.
                  </p>
                </div>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <p className="text-green-800">
                  🏆 <strong>Resultado:</strong> Obtendo uma boa nota nos testes, o CRAS fará sua contratação imediata como funcionário público efetivo!
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button 
              onClick={startAssessment}
              className="bg-[#044785] hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-300 shadow-lg"
            >
              <PlayCircle className="inline mr-2" size={20} />
              Iniciar Testes de Seleção
            </button>
            <p className="text-gray-600 mt-3 text-sm">
              Os testes levam aproximadamente 15 minutos para serem concluídos
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#044785] text-white py-8 md:py-12 w-full">
        <div className="container mx-auto px-4 max-w-6xl">
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
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <span>© Copyright 2025 CRAS - Centro de Referência de Assistência Social</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4 md:mb-0">
              <a href="#" className="hover:text-gray-200">Mapa do Site</a>
              <span className="hidden md:inline">|</span>
              <a href="#" className="hover:text-gray-200">Política de Privacidade</a>
              <span className="hidden md:inline">|</span>
              <a href="#" className="hover:text-gray-200">Lei de Acesso à Informação</a>
              <span className="hidden md:inline">|</span>
              <a href="#" className="hover:text-gray-200">Acessibilidade</a>
              <span className="hidden md:inline">|</span>
              <a href="#" className="hover:text-gray-200">Ouvidoria</a>
            </div>
            <div className="flex space-x-4">
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

export default JobInfoPage;