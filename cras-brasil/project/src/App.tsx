import React, { useEffect, useState } from 'react';
import { Menu, Mic, Search, Home, Facebook, Linkedin, MessageCircle, Link, Users } from 'lucide-react';
import LocalPage from './components/LocalPage';
import RegistrationPage from './components/RegistrationPage';
import AddressPage from './components/AddressPage';
import JobInfoPage from './components/JobInfoPage';
import ExamPage from './components/ExamPage';
import TechnicalAssessmentPage from './components/TechnicalAssessmentPage';
import ApprovalPage from './components/ApprovalPage';
import MedicalExamPage from './components/MedicalExamPage';
import ChatPage from './components/ChatPage';

function App() {
  const [isSticky, setIsSticky] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.pageYOffset > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check URL path to determine which page to show
    const path = window.location.pathname;
    if (path === '/local') {
      setCurrentPage('local');
    } else if (path === '/registration') {
      setCurrentPage('registration');
    } else if (path === '/address') {
      setCurrentPage('address');
    } else if (path === '/job-info') {
      setCurrentPage('job-info');
    } else if (path === '/exame') {
      setCurrentPage('exame');
    } else if (path === '/psicotecnico') {
      setCurrentPage('psicotecnico');
    } else if (path === '/aprovado') {
      setCurrentPage('aprovado');
    } else if (path === '/agendamento') {
      setCurrentPage('agendamento');
    } else if (path === '/chat') {
      setCurrentPage('chat');
    } else {
      setCurrentPage('home');
    }

    // Handle browser back/forward buttons
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/local') {
        setCurrentPage('local');
      } else if (path === '/registration') {
        setCurrentPage('registration');
      } else if (path === '/address') {
        setCurrentPage('address');
      } else if (path === '/job-info') {
        setCurrentPage('job-info');
      } else if (path === '/exame') {
        setCurrentPage('exame');
      } else if (path === '/psicotecnico') {
        setCurrentPage('psicotecnico');
      } else if (path === '/aprovado') {
        setCurrentPage('aprovado');
      } else if (path === '/agendamento') {
        setCurrentPage('agendamento');
      } else if (path === '/chat') {
        setCurrentPage('chat');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToLocal = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPage('local');
    window.history.pushState({}, '', '/local');
  };

  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return `Publicado em ${now.toLocaleString('pt-BR', options)}`;
  };

  const statesData = [
    { state: 'Acre', vacancies: 45 },
    { state: 'Alagoas', vacancies: 124 },
    { state: 'Amapá', vacancies: 38 },
    { state: 'Amazonas', vacancies: 186 },
    { state: 'Bahia', vacancies: 682 },
    { state: 'Ceará', vacancies: 425 },
    { state: 'Distrito Federal', vacancies: 156 },
    { state: 'Espírito Santo', vacancies: 178 },
    { state: 'Goiás', vacancies: 298 },
    { state: 'Maranhão', vacancies: 315 },
    { state: 'Mato Grosso', vacancies: 142 },
    { state: 'Mato Grosso do Sul', vacancies: 118 },
    { state: 'Minas Gerais', vacancies: 896 },
    { state: 'Pará', vacancies: 387 },
    { state: 'Paraíba', vacancies: 168 },
    { state: 'Paraná', vacancies: 524 },
    { state: 'Pernambuco', vacancies: 445 },
    { state: 'Piauí', vacancies: 152 },
    { state: 'Rio de Janeiro', vacancies: 738 },
    { state: 'Rio Grande do Norte', vacancies: 158 },
    { state: 'Rio Grande do Sul', vacancies: 512 },
    { state: 'Rondônia', vacancies: 78 },
    { state: 'Roraima', vacancies: 42 },
    { state: 'Santa Catarina', vacancies: 287 },
    { state: 'São Paulo', vacancies: 1248 },
    { state: 'Sergipe', vacancies: 98 },
    { state: 'Tocantins', vacancies: 78 }
  ];

  if (currentPage === 'local') {
    return <LocalPage />;
  }

  if (currentPage === 'registration') {
    return <RegistrationPage />;
  }

  if (currentPage === 'address') {
    return <AddressPage />;
  }

  if (currentPage === 'job-info') {
    return <JobInfoPage />;
  }

  if (currentPage === 'exame') {
    return <ExamPage />;
  }

  if (currentPage === 'psicotecnico') {
    return <TechnicalAssessmentPage />;
  }

  if (currentPage === 'aprovado') {
    return <ApprovalPage />;
  }

  if (currentPage === 'agendamento') {
    return <MedicalExamPage />;
  }

  if (currentPage === 'chat') {
    return <ChatPage />;
  }

  return (
    <div className="bg-white">
      {/* Government Header Image */}
      <img 
        src="https://i.ibb.co/yvTWdMd/IMG-3113.jpg" 
        alt="Government header" 
        className="w-screen" 
      />
      
      {/* Sticky Navigation Header */}
      <div className={`sticky top-0 bg-white z-50 transition-shadow duration-200 ${isSticky ? 'shadow-md' : ''}`}>
        <div className="container mx-auto px-4 border-b border-black border-opacity-10">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <Menu className="text-sm text-[#1451B4] mr-4 relative -top-1" size={16} />
              <p className="text-[14px] text-[#333333] -ml-[5px] leading-tight relative -top-1">
                Centro de Referência de Assistência Social | CRAS
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Mic className="text-sm text-[#1451B4] relative -top-1" size={16} />
              <Search className="text-sm text-[#1451B4] relative -top-1" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4">
        <div className="py-4">
          <div className="flex items-center space-x-2 text-[13px]">
            <a className="text-[#1451B4]" href="#">
              <Home className="text-sm text-[#1451B4]" size={16} />
            </a>
            <span className="text-[#9E9D9D]">&gt;</span>
            <a className="text-[#1451B4]" href="#">Assuntos</a>
            <span className="text-[#9E9D9D]">&gt;</span>
            <a className="text-[#1451B4]" href="#">Notícias</a>
            <span className="text-[#9E9D9D]">&gt;</span>
            <a className="text-[#1451B4]" href="#">CRAS</a>
            <span className="text-[#9E9D9D]">&gt;</span>
            <span className="font-bold">Vagas 2025</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Title Section */}
        <div className="mb-6">
          <p className="text-[#1451B4] text-sm font-medium mb-2">
            CRAS - CENTRO DE REFERÊNCIA DE ASSISTÊNCIA SOCIAL
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            CRAS está contratando de forma urgente 6.342 novos Assistentes Sociais!
          </h2>
          <p className="text-gray-700 text-base">
            Não perca esta oportunidade única! Salários de R$ 4.500 a R$ 5.500 + benefícios completos. 
            Não é necessária formação prévia - você precisa apenas passar nos exames online de Serviço Social.
          </p>
        </div>

        {/* Social Sharing */}
        <div className="border-t py-4 my-4 -mx-4">
          <div className="flex items-center justify-center">
            <p className="text-gray-700 text-base mr-2">Compartilhe:</p>
            <a className="text-blue-600 mx-2 text-xl hover:text-blue-800 transition-colors" href="#">
              <Facebook size={20} />
            </a>
            <a className="text-blue-600 mx-2 text-xl hover:text-blue-800 transition-colors" href="#">
              <Linkedin size={20} />
            </a>
            <a className="text-blue-600 mx-2 text-xl hover:text-blue-800 transition-colors" href="#">
              <MessageCircle size={20} />
            </a>
            <a className="text-blue-600 mx-2 text-xl hover:text-blue-800 transition-colors" href="#">
              <Link size={20} />
            </a>
          </div>
        </div>

        {/* Publication Info */}
        <div className="text-center mb-4">
          <p className="text-gray-700 text-base">{getCurrentDate()}</p>
          <p className="text-gray-700 text-base">Colaboradores: Secretaria Nacional de Assistência Social</p>
        </div>

        {/* Main Image */}
        <div className="my-6">
          <img 
            alt="Logo do CRAS em fundo azul escuro com letras brancas" 
            className="w-full rounded-lg shadow-sm" 
            height="200" 
            src="https://i.ibb.co/35YPSzXC/Localiza-Fone-2.png" 
            width="600"
          />
        </div>

        {/* Main Content */}
        <div className="my-6">
          <p className="text-gray-700 text-base mb-4">
            <span className="float-left text-6xl font-bold text-[#1451B4] mr-2 mt-2 leading-none">O</span>
            Centro de Referência de Assistência Social (CRAS) anuncia uma <strong>contratação urgente</strong> de 
            6.342 novos Assistentes Sociais para atuar em todo o território nacional. Esta é uma oportunidade única 
            para ingressar no serviço público com excelente remuneração e benefícios completos. <strong>Não é necessária 
            formação prévia</strong> - você precisa apenas ser aprovado nos exames online de Serviço Social que serão 
            realizados nos próximos dias.
          </p>
          
          <img 
            src="https://i.ibb.co/351jh3Tm/Localiza-Fone-3-2.png" 
            alt="Banner do CRAS 2025" 
            className="w-full mt-4 rounded-lg shadow-sm"
          />

          {/* Benefits Section */}
          <div className="container mx-auto pl-2 mt-6 w-full">
            <div className="bg-gray-100 py-3 px-5 mb-5 w-full border-l-8 border-gray-400">
              <p className="text-[16px] font-bold text-[#555555]">Salários e Benefícios - Total de 6.342 vagas</p>
            </div>
            
            <div className="mb-6 p-4">
              <h3 className="font-bold text-lg mb-2">Remuneração e Benefícios:</h3>
              <ul className="list-disc ml-6 space-y-2 text-gray-700 text-base">
                <li><strong>Salário Base:</strong> R$ 4.500,00 a R$ 5.500,00</li>
                <li><strong>Vale Alimentação:</strong> R$ 600,00/mês</li>
                <li><strong>Vale Transporte:</strong> R$ 300,00/mês</li>
                <li><strong>Plano de Saúde:</strong> 100% custeado pelo CRAS</li>
                <li><strong>Plano Odontológico:</strong> Incluso para funcionário e dependentes</li>
                <li><strong>Auxílio Creche:</strong> R$ 400,00/mês (até 6 anos)</li>
                <li><strong>13º Salário:</strong> Garantido</li>
                <li><strong>Férias Remuneradas:</strong> 30 dias + 1/3 constitucional</li>
                <li><strong>FGTS:</strong> 8% sobre o salário</li>
              </ul>
            </div>

            {/* States Table */}
            <p className="mb-3 leading-relaxed text-gray-700 text-base">
              <strong>Distribuição das 6.342 vagas por estado:</strong>
            </p>
            
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse border border-gray-300 mx-auto text-left text-gray-700 text-base w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 font-semibold">Estado</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">Quantidade de Vagas</th>
                  </tr>
                </thead>
                <tbody>
                  {statesData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{item.state}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">{item.vacancies}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <br />

            {/* Application Steps */}
            <div className="mb-6 p-4">
              <h3 className="font-bold text-lg mb-2">Como se candidatar às vagas do CRAS:</h3>
              <ol className="list-decimal ml-6 space-y-2 text-gray-700 text-base">
                <li><strong>Passo 1:</strong> Clique no botão "Realizar Inscrição" abaixo</li>
                <li><strong>Passo 2:</strong> Preencha seus dados pessoais completos</li>
                <li><strong>Passo 3:</strong> Realize o exame online de Serviço Social</li>
                <li><strong>Passo 4:</strong> Aguarde a confirmação da aprovação</li>
              </ol>
              <p className="mt-3 text-gray-700 text-base">
                <strong>Importante:</strong> O processo é totalmente gratuito e online. Não é necessária formação prévia 
                em Serviço Social - o conhecimento pode ser adquirido através do exame preparatório incluído no processo.
              </p>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <a 
                href="/local" 
                onClick={navigateToLocal}
                className="inline-block bg-[#1351b4] text-white px-8 py-3 rounded-[30px] font-bold hover:bg-[#0c3d8a] transition-colors duration-200 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
              >
                REALIZAR INSCRIÇÃO AGORA
              </a>
            </div>
          </div>
        </div>

        {/* Final Text */}
        <div className="my-6">
          <p className="text-gray-700 text-base mb-2">
            <strong>Contratação Imediata após Aprovação –</strong>
          </p>
          <p className="text-gray-700 text-base">
            Após a aprovação no exame online, a contratação é imediata e você inicia suas atividades no CRAS em 
            até 15 dias. Esta é uma oportunidade única de ingressar no serviço público com estabilidade, excelente 
            remuneração e benefícios completos. As vagas são limitadas e o processo seletivo é por ordem de aprovação!
          </p>
        </div>
      </main>

      {/* Footer Image */}
      <div className="w-full">
        <img 
          src="https://i.ibb.co/DHjL5PHX/IMG-3117.jpg" 
          alt="Imagem de rodapé do site" 
          className="w-full"
        />
      </div>

      {/* Floating Accessibility Icon */}
      <a 
        href="#" 
        className="fixed bottom-4 right-4 bg-blue-600 p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        <Users className="w-6 h-6 text-white" />
      </a>
    </div>
  );
}

export default App;