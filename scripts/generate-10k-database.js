const fs = require('fs');
const path = require('path');

const TOTAL_TARGET = 20800; // Mais de 10 mil empresas

const STATES = [
  { uf: 'AC', name: 'Acre', ddd: '68', cities: ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá'], cep: '69900-000' },
  { uf: 'AL', name: 'Alagoas', ddd: '82', cities: ['Maceió', 'Arapiraca', 'Rio Largo', 'Palmeira dos Índios'], cep: '57020-000' },
  { uf: 'AP', name: 'Amapá', ddd: '96', cities: ['Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque'], cep: '68900-000' },
  { uf: 'AM', name: 'Amazonas', ddd: '92', cities: ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru'], cep: '69010-000' },
  { uf: 'BA', name: 'Bahia', ddd: '71', cities: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Juazeiro', 'Ilhéus', 'Lauro de Freitas'], cep: '40020-000' },
  { uf: 'CE', name: 'Ceará', ddd: '85', cities: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral', 'Crato'], cep: '60025-000' },
  { uf: 'DF', name: 'Distrito Federal', ddd: '61', cities: ['Brasília', 'Taguatinga', 'Ceilândia', 'Águas Claras', 'Guará', 'Samambaia'], cep: '70040-000' },
  { uf: 'ES', name: 'Espírito Santo', ddd: '27', cities: ['Vitória', 'Vila Velha', 'Serra', 'Cariacica', 'Cachoeiro de Itapemirim'], cep: '29010-000' },
  { uf: 'GO', name: 'Goiás', ddd: '62', cities: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia', 'Águas Lindas de Goiás'], cep: '74013-000' },
  { uf: 'MA', name: 'Maranhão', ddd: '98', cities: ['São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon', 'Caxias'], cep: '65010-000' },
  { uf: 'MT', name: 'Mato Grosso', ddd: '65', cities: ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra'], cep: '78005-000' },
  { uf: 'MS', name: 'Mato Grosso do Sul', ddd: '67', cities: ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã'], cep: '79002-000' },
  { uf: 'MG', name: 'Minas Gerais', ddd: '31', cities: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim', 'Montes Claros', 'Uberaba'], cep: '30130-000' },
  { uf: 'PA', name: 'Pará', ddd: '91', cities: ['Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Parauapebas', 'Castanhal'], cep: '66010-000' },
  { uf: 'PB', name: 'Paraíba', ddd: '83', cities: ['João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux', 'Sousa'], cep: '58010-000' },
  { uf: 'PR', name: 'Paraná', ddd: '41', cities: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'São José dos Pinhais', 'Foz do Iguaçu'], cep: '80010-000' },
  { uf: 'PE', name: 'Pernambuco', ddd: '81', cities: ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina', 'Paulista'], cep: '50010-000' },
  { uf: 'PI', name: 'Piauí', ddd: '86', cities: ['Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano'], cep: '64000-000' },
  { uf: 'RJ', name: 'Rio de Janeiro', ddd: '21', cities: ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói', 'Belford Roxo', 'Campos dos Goytacazes'], cep: '20010-000' },
  { uf: 'RN', name: 'Rio Grande do Norte', ddd: '84', cities: ['Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante', 'Macaíba', 'Ceará-Mirim', 'Caicó', 'Currais Novos'], cep: '59012-000' },
  { uf: 'RS', name: 'Rio Grande do Sul', ddd: '51', cities: ['Porto Alegre', 'Caxias do Sul', 'Canoas', 'Pelotas', 'Santa Maria', 'Gravataí', 'Novo Hamburgo'], cep: '90010-000' },
  { uf: 'RO', name: 'Rondônia', ddd: '69', cities: ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena', 'Cacoal'], cep: '76801-000' },
  { uf: 'RR', name: 'Roraima', ddd: '95', cities: ['Boa Vista', 'Rorainópolis', 'Caracaraí', 'Pacaraima'], cep: '69301-000' },
  { uf: 'SC', name: 'Santa Catarina', ddd: '48', cities: ['Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Chapecó', 'Itajaí', 'Criciúma'], cep: '88010-000' },
  { uf: 'SP', name: 'São Paulo', ddd: '11', cities: ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santo André', 'Osasco', 'Sorocaba', 'Ribeirão Preto', 'Santos'], cep: '01001-000' },
  { uf: 'SE', name: 'Sergipe', ddd: '79', cities: ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'Estância'], cep: '49010-000' },
  { uf: 'TO', name: 'Tocantins', ddd: '63', cities: ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional'], cep: '77001-000' }
];

const SECTORS = [
  {
    category: 'Comércio & Varejo B2B',
    cnae: '47.11-3-02',
    cnaeDesc: 'Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios',
    secCnae: '46.91-5-00',
    secDesc: 'Comércio atacadista de mercadorias em geral',
    keywords: ['DISTRIBUIDORA', 'ATACADO', 'SUPRIMENTOS', 'COMERCIO', 'IMPORTACAO', 'CENTRAL'],
    contractObj: 'Fornecimento contínuo de suprimentos, materiais de consumo e itens operacionais',
  },
  {
    category: 'Energia Solar & Instalações',
    cnae: '43.21-5-00',
    cnaeDesc: 'Instalação e manutenção elétrica',
    secCnae: '35.11-5-01',
    secDesc: 'Geração de energia elétrica através de usinas solares fotovoltaicas',
    keywords: ['SOLAR', 'ENERGIA', 'VOLTAICA', 'ELETRICA', 'FOTOVOLTAICA', 'POTENCIA'],
    contractObj: 'Implantação, homologação e manutenção preventiva de sistemas de geração de energia solar',
  },
  {
    category: 'Indústria & Metalurgia',
    cnae: '25.11-0-00',
    cnaeDesc: 'Fabricação de estruturas metálicas e caldeiraria pesada',
    secCnae: '25.39-0-01',
    secDesc: 'Serviços de usinagem, solda e tratamento de metais',
    keywords: ['METALURGICA', 'ESTRUTURAS', 'ACO', 'CALDEIRARIA', 'USINAGEM', 'FABRICA'],
    contractObj: 'Fabricação e montagem de estruturas metálicas e componentes industriais para órgãos e empresas',
  },
  {
    category: 'Marketing & Comunicação',
    cnae: '73.11-4-00',
    cnaeDesc: 'Agências de publicidade e propaganda',
    secCnae: '73.19-0-02',
    secDesc: 'Promoção de vendas e eventos corporativos',
    keywords: ['COMUNICACAO', 'MARKETING', 'MIDIA', 'PROPAGANDA', 'CRIATIVA', 'PUBLICIDADE'],
    contractObj: 'Planejamento e execução de campanhas institucionais e gestão de canais digitais',
  },

  {
    category: 'TI & Software',
    cnae: '62.01-5-01',
    cnaeDesc: 'Desenvolvimento de programas de computador sob encomenda (TI)',
    secCnae: '62.09-1-00',
    secDesc: 'Suporte técnico, manutenção e outros serviços em TI',
    keywords: ['SISTEMAS', 'TECNOLOGIA', 'SOFTWARE', 'CLOUD', 'DIGITAL', 'INFO', 'INFORMATICA', 'DADOS'],
    contractObj: 'Licenciamento e suporte técnico de soluções digitais e governança eletrônica',
  },
  {
    category: 'Engenharia & Obras',
    cnae: '41.20-4-00',
    cnaeDesc: 'Construção de edifícios e obras de infraestrutura civil',
    secCnae: '43.21-5-00',
    secDesc: 'Instalações elétricas e manutenção predial',
    keywords: ['CONSTRUCOES', 'ENGENHARIA', 'OBRAS', 'EDIFICACOES', 'REFORMAS', 'ELETRICA', 'INFRAESTRUTURA'],
    contractObj: 'Execução de obras de manutenção, reforma predial e instalações elétricas',
  },
  {
    category: 'Saúde & Medicamentos',
    cnae: '46.45-1-01',
    cnaeDesc: 'Comércio atacadista de instrumentos e materiais para uso médico-hospitalar',
    secCnae: '86.10-1-01',
    secDesc: 'Atividades de atendimento hospitalar e serviços médicos',
    keywords: ['MED', 'HOSPITALAR', 'SAUDE', 'DISTRIBUIDORA', 'FARMA', 'BIOTEC', 'CIRURGICA'],
    contractObj: 'Fornecimento continuado de medicamentos, materiais hospitalares e equipamentos clínicos',
  },
  {
    category: 'Serviços Terceirizados',
    cnae: '81.21-4-00',
    cnaeDesc: 'Limpeza em prédios e em domicílios',
    secCnae: '80.11-1-01',
    secDesc: 'Atividades de vigilância e segurança privada',
    keywords: ['FACILITIES', 'SERVICOS', 'TERCEIRIZACAO', 'LIMPEZA', 'VIGILANCIA', 'ASSEIO', 'OPERACIONAL'],
    contractObj: 'Prestação de serviços contínuos de conservação predial, portaria e apoio administrativo',
  },
  {
    category: 'Consultoria & Treinamento',
    cnae: '70.20-4-00',
    cnaeDesc: 'Atividades de consultoria em gestão empresarial',
    secCnae: '85.99-6-04',
    secDesc: 'Treinamento em desenvolvimento profissional e gerencial',
    keywords: ['CONSULTORIA', 'GESTAO', 'TREINAMENTOS', 'ASSESSORIA', 'ESTRATEGIA', 'CAPACITACAO'],
    contractObj: 'Serviços especializados de capacitação profissional e assessoria em gestão de projetos',
  },
  {
    category: 'Alimentação & Logística',
    cnae: '56.20-1-01',
    cnaeDesc: 'Fornecimento de alimentos preparados preponderantemente para empresas',
    secCnae: '49.30-2-02',
    secDesc: 'Transporte rodoviário de carga intermunicipal e interestadual',
    keywords: ['ALIMENTOS', 'NUTRICAO', 'REFEICOES', 'LOGISTICA', 'TRANSPORTES', 'EXPRESS', 'CARGAS'],
    contractObj: 'Fornecimento de gêneros alimentícios preparados e logística de distribuição de suprimentos',
  }
];

const FIRST_NAMES = [
  'Carlos', 'Ana', 'Rodrigo', 'Juliana', 'Marcos', 'Fernanda', 'Lucas', 'Patricia',
  'Rafael', 'Beatriz', 'Eduardo', 'Camila', 'Felipe', 'Mariana', 'Thiago', 'Larissa',
  'Gabriel', 'Aline', 'Diego', 'Renata', 'Bruno', 'Vanessa', 'Gustavo', 'Jessica',
  'Marcelo', 'Priscila', 'Leonardo', 'Renan', 'Daniela', 'Vinicius', 'Simone', 'Andre',
  'Tatiana', 'Caio', 'Sabrina', 'Guilherme', 'Flavia', 'Henrique', 'Monica', 'Alexandre'
];

const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
  'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes',
  'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade',
  'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas', 'Cardoso', 'Ramos'
];

const NEIGHBORHOODS = [
  'Centro', 'Distrito Industrial', 'Jardim América', 'Bela Vista', 'Vila Nova',
  'Boa Viagem', 'Alecrim', 'Tirol', 'Moema', 'Savassi', 'Batel', 'Aldeota',
  'Plano Piloto', 'Setor Bueno', 'Ponta Verde', 'Ponta Negra', 'Centro Empresarial'
];

function generateValidCnpj(prefix12) {
  const digits = prefix12.split('').map(Number);
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum1 = 0;
  for (let i = 0; i < 12; i++) sum1 += digits[i] * w1[i];
  let rem1 = sum1 % 11;
  const d1 = rem1 < 2 ? 0 : 11 - rem1;
  digits.push(d1);
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum2 = 0;
  for (let i = 0; i < 13; i++) sum2 += digits[i] * w2[i];
  let rem2 = sum2 % 11;
  const d2 = rem2 < 2 ? 0 : 11 - rem2;
  digits.push(d2);
  return digits.join('');
}

let cnpjCounter = 61000000;
function getNextCnpj() {
  cnpjCounter += 1;
  const base = String(cnpjCounter).padStart(8, '0');
  const prefix12 = `${base}0001`;
  return generateValidCnpj(prefix12);
}

function randItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

console.log('Iniciando geração em lote de 10.000+ empresas brasileiras...');

const companies = [];
const perStateBase = Math.floor(TOTAL_TARGET / STATES.length); // ~379 per state

let globalIndex = 0;

for (let s = 0; s < STATES.length; s++) {
  const st = STATES[s];
  // Weight larger states slightly more
  const weight = ['SP', 'RJ', 'MG', 'BA', 'PR', 'RS'].includes(st.uf) ? 1.35 : ['CE', 'PE', 'SC', 'GO', 'DF', 'RN'].includes(st.uf) ? 1.15 : 0.85;
  const targetForState = Math.round(perStateBase * weight);

  for (let i = 0; i < targetForState; i++) {
    globalIndex++;
    const cnpj = getNextCnpj();
    const city = randItem(st.cities);
    const sector = randItem(SECTORS);
    const keyword = randItem(sector.keywords);
    const fn1 = randItem(FIRST_NAMES);
    const ln1 = randItem(LAST_NAMES);
    const ln2 = randItem(LAST_NAMES);
    const personName = `${fn1} ${ln1} ${ln2}`;
    const cleanPerson = `${fn1} ${ln1}`;

    // Size distribution: 55% MEI, 25% ME, 12% EPP, 6% MEDIO, 2% GRANDE
    const randPct = Math.random();
    let size = 'MEI';
    let shareCapital = 8000;
    let employees = 1;
    let payroll = 1412;
    let revMin = 36000;
    let revMax = 81000;
    let ticketMin = 350;
    let ticketMax = 980;
    let contractVal = randInt(18000, 54000);
    let legalNature = '213-5 - Empresário (Individual)';
    let isMei = true;
    let isSimples = true;
    let legalName = `${personName.toUpperCase()} - ${keyword} ${st.uf} MEI`;
    let tradeName = `${cleanPerson.toUpperCase()} ${keyword} ${st.uf}`;

    if (randPct > 0.55 && randPct <= 0.80) {
      size = 'ME';
      isMei = false;
      isSimples = true;
      shareCapital = randInt(50000, 250000);
      employees = randInt(2, 9);
      payroll = employees * randInt(2200, 2800);
      revMin = 180000;
      revMax = 360000;
      ticketMin = 850;
      ticketMax = 2200;
      contractVal = randInt(120000, 450000);
      legalNature = '206-2 - Sociedade Empresária Limitada';
      legalName = `${st.name.toUpperCase()} ${keyword} E SERVICOS LTDA`;
      tradeName = `${keyword} ${st.uf} SOLUCOES`;
    } else if (randPct > 0.80 && randPct <= 0.92) {
      size = 'EPP';
      isMei = false;
      isSimples = true;
      shareCapital = randInt(400000, 1500000);
      employees = randInt(12, 45);
      payroll = employees * randInt(2900, 3800);
      revMin = 850000;
      revMax = 4800000;
      ticketMin = 2400;
      ticketMax = 7500;
      contractVal = randInt(850000, 3800000);
      legalNature = '206-2 - Sociedade Empresária Limitada';
      legalName = `DISTRIBUIDORA E ${keyword} ${st.name.toUpperCase()} LTDA`;
      tradeName = `${keyword} BRASIL ${st.uf}`;
    } else if (randPct > 0.92 && randPct <= 0.98) {
      size = 'MEDIO';
      isMei = false;
      isSimples = false;
      shareCapital = randInt(2500000, 12000000);
      employees = randInt(50, 180);
      payroll = employees * randInt(3500, 5200);
      revMin = 4800000;
      revMax = 35000000;
      ticketMin = 8500;
      ticketMax = 28000;
      contractVal = randInt(4500000, 18000000);
      legalNature = '205-4 - Sociedade Anônima Fechada';
      legalName = `${keyword} E ENGENHARIA NACIONAL ${st.uf} S.A.`;
      tradeName = `${keyword} CORP ${st.uf}`;
    } else if (randPct > 0.98) {
      size = 'GRANDE';
      isMei = false;
      isSimples = false;
      shareCapital = randInt(25000000, 120000000);
      employees = randInt(250, 1200);
      payroll = employees * randInt(4800, 7500);
      revMin = 50000000;
      revMax = 280000000;
      ticketMin = 28000;
      ticketMax = 95000;
      contractVal = randInt(25000000, 85000000);
      legalNature = '204-6 - Sociedade Anônima Aberta';
      legalName = `BRASIL ${keyword} E PARTICIPACOES S.A.`;
      tradeName = `GRUPO ${keyword} ${st.uf}`;
    }

    const phoneNum = `9${randInt(8000, 9999)}-${randInt(1000, 9999)}`;
    const fullPhone = `(${st.ddd}) ${phoneNum}`;
    const rawDigitsPhone = `55${st.ddd}${phoneNum.replace(/\D/g, '')}`;
    const slug = `${cleanPerson.toLowerCase().replace(/\s+/g, '')}${st.uf.toLowerCase()}${i}`;
    const email = `contato@${slug}.com.br`;
    const neighborhood = randItem(NEIGHBORHOODS);
    const street = `Rua Principal de ${city}, ${randInt(10, 2500)}`;

    const hasContract = Math.random() < 0.72; // 72% de chances de ter contrato gov
    const contracts = [];
    if (hasContract) {
      const buyer = isMei
        ? `Prefeitura Municipal de ${city} - ${st.uf}`
        : `Secretaria de Estado de ${st.name} - GOV/${st.uf}`;
      const contractNum = `CT-${st.uf}-${2024}-${String(randInt(10, 999)).padStart(3, '0')}`;
      contracts.push({
        id: `cnt-${cnpj}-01`,
        companyId: `brz-${cnpj}`,
        contractNumber: contractNum,
        buyerAgency: buyer,
        buyerUf: st.uf,
        modality: isMei ? 'Dispensa Eletrônica' : 'Pregão Eletrônico',
        object: sector.contractObj,
        category: sector.category,
        totalValue: contractVal,
        startDate: '2024-01-15',
        endDate: '2025-01-15',
        status: 'VIGENTE',
        sourceUrl: `https://pncp.gov.br/app/contratos/${cnpj}/2024`,
        sourceSystem: 'PNCP / Compras Governamentais',
      });
    }

    const capacityScore = Math.min(98, Math.max(50, Math.floor(
      (size === 'MEI' ? 64 : size === 'ME' ? 76 : size === 'EPP' ? 88 : 94) +
      (hasContract ? 5 : 0) + (Math.random() * 6 - 3)
    )));

    const partners = [
      {
        id: `soc-${cnpj}-01`,
        name: personName,
        document: `***.${randInt(100, 899)}.${randInt(100, 899)}-**`,
        role: isMei ? 'Titular / Microempreendedor Individual' : 'Sócio-Administrador',
        startDate: '2020-03-10',
      }
    ];

    if (!isMei) {
      const fn2 = randItem(FIRST_NAMES);
      const lnX = randItem(LAST_NAMES);
      partners.push({
        id: `soc-${cnpj}-02`,
        name: `${fn2} ${lnX}`,
        document: `***.${randInt(100, 899)}.${randInt(100, 899)}-**`,
        role: 'Sócio Diretor Comercial',
        startDate: '2021-08-15',
      });
    }

    const comp = {
      id: `brz-${cnpj}`,
      cnpj,
      legalName,
      tradeName,
      status: 'ATIVA',
      registrationDate: '2020-03-10',
      primaryCnaeCode: sector.cnae,
      primaryCnaeDesc: sector.cnaeDesc,
      secondaryCnaes: [{ code: sector.secCnae, desc: sector.secDesc }],
      legalNature,
      companySize: size,
      shareCapital,
      state: st.uf,
      city,
      neighborhood,
      zipCode: st.cep,
      street,
      number: String(randInt(10, 1500)),
      phone: fullPhone,
      email,
      whatsapp: `https://wa.me/${rawDigitsPhone}`,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${legalName} ${city} ${st.uf}`)}`,
      partners,
      publicContracts: contracts,
      hasPublicContracts: contracts.length > 0,
      totalContractsVolume: hasContract ? contractVal : 0,
      activeContractsCount: hasContract ? 1 : 0,
      lastContractDate: hasContract ? '2024-01-15' : undefined,
      capacityScore,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-09-18T12:00:00Z',
      fiscalData: {
        taxRegime: isMei ? 'MEI' : isSimples ? 'SIMPLES_NACIONAL' : 'LUCRO_PRESUMIDO',
        taxRegimeDescription: isMei ? 'Microempreendedor Individual (SIMEI)' : isSimples ? 'Simples Nacional' : 'Lucro Presumido',
        isSimplesNacional: isSimples,
        simplesOptInDate: isSimples ? '2020-03-10' : undefined,
        isSimei: isMei,
        simeiOptInDate: isMei ? '2020-03-10' : undefined,
        federalTaxDebtStatus: 'REGULAR',
        cndFederal: 'VÁLIDA / EMITIDA',
        cndFgts: 'REGULAR (CRF ATIVO)',
        cndTrabalhista: 'CERTIDÃO NEGATIVA (CNDT VÁLIDA)',
        stateRegistration: `10.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}-${cnpj.slice(8, 9)}`,
        municipalRegistration: `${cnpj.slice(0, 6)}/REG`,
        employeeCountDeclared: employees,
        employeeRangeDescription: `${employees} colaborador(es) formal(is) registrado(s) no eSocial`,
        estimatedPayrollMonthly: payroll,
        dasnStatus: isMei ? 'ENTREGUE / REGULAR' : undefined,
      },
      financialIndicators: {
        id: `ind-${cnpj}`,
        companyId: `brz-${cnpj}`,
        taxRegime: isMei ? 'MEI' : isSimples ? 'SIMPLES_NACIONAL' : 'LUCRO_PRESUMIDO',
        estimatedAnnualRevenueMin: revMin,
        estimatedAnnualRevenueMax: revMax,
        estimatedEmployeeCountMin: employees,
        estimatedEmployeeCountMax: employees + (isMei ? 0 : 4),
        financialCapacityScore: capacityScore,
        suggestedMonthlyTicketMin: ticketMin,
        suggestedMonthlyTicketMax: ticketMax,
        suggestedOneOffTicketMin: ticketMin * 6,
        suggestedOneOffTicketMax: ticketMax * 8,
        publicContractsVolumeTotal: hasContract ? contractVal : 0,
        calculatedAt: '2024-09-18T12:00:00Z',
        riskLevel: capacityScore >= 80 ? 'BAIXO' : 'MEDIO',
        insights: [
          hasContract ? `Contrato ativo com órgão público no valor de R$ ${contractVal.toLocaleString('pt-BR')}.` : 'Histórico fiscal regularizado perante a Receita Federal.',
          `Quadro do eSocial ativo com ${employees} colaborador(es) registrado(s).`,
          'Capacidade comprovada de contratação e pagamento de soluções B2B.'
        ],
      }
    };

    companies.push(comp);
  }
}

console.log(`Geração concluída com sucesso! Total gerado: ${companies.length} empresas.`);

const outputPath = path.join(__dirname, '../data/brazil-companies-10k.json');
fs.writeFileSync(outputPath, JSON.stringify(companies), 'utf8');

const stats = fs.statSync(outputPath);
console.log(`Arquivo salvo com sucesso em ${outputPath} (${(stats.size / (1024 * 1024)).toFixed(2)} MB).`);
