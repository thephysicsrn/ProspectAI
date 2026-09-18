const fs = require('fs');
const path = require('path');

const STATES = [
  { uf: 'AC', name: 'Acre', ddd: '68', cap: 'Rio Branco', int: 'Cruzeiro do Sul', cep: '69900-000' },
  { uf: 'AL', name: 'Alagoas', ddd: '82', cap: 'Maceió', int: 'Arapiraca', cep: '57020-000' },
  { uf: 'AP', name: 'Amapá', ddd: '96', cap: 'Macapá', int: 'Santana', cep: '68900-000' },
  { uf: 'AM', name: 'Amazonas', ddd: '92', cap: 'Manaus', int: 'Parintins', cep: '69010-000' },
  { uf: 'BA', name: 'Bahia', ddd: '71', cap: 'Salvador', int: 'Feira de Santana', cep: '40020-000' },
  { uf: 'CE', name: 'Ceará', ddd: '85', cap: 'Fortaleza', int: 'Juazeiro do Norte', cep: '60025-000' },
  { uf: 'DF', name: 'Distrito Federal', ddd: '61', cap: 'Brasília', int: 'Taguatinga', cep: '70040-000' },
  { uf: 'ES', name: 'Espírito Santo', ddd: '27', cap: 'Vitória', int: 'Vila Velha', cep: '29010-000' },
  { uf: 'GO', name: 'Goiás', ddd: '62', cap: 'Goiânia', int: 'Anápolis', cep: '74013-000' },
  { uf: 'MA', name: 'Maranhão', ddd: '98', cap: 'São Luís', int: 'Imperatriz', cep: '65010-000' },
  { uf: 'MT', name: 'Mato Grosso', ddd: '65', cap: 'Cuiabá', int: 'Rondonópolis', cep: '78005-000' },
  { uf: 'MS', name: 'Mato Grosso do Sul', ddd: '67', cap: 'Campo Grande', int: 'Dourados', cep: '79002-000' },
  { uf: 'MG', name: 'Minas Gerais', ddd: '31', cap: 'Belo Horizonte', int: 'Uberlândia', cep: '30130-000' },
  { uf: 'PA', name: 'Pará', ddd: '91', cap: 'Belém', int: 'Santarém', cep: '66010-000' },
  { uf: 'PB', name: 'Paraíba', ddd: '83', cap: 'João Pessoa', int: 'Campina Grande', cep: '58010-000' },
  { uf: 'PR', name: 'Paraná', ddd: '41', cap: 'Curitiba', int: 'Londrina', cep: '80010-000' },
  { uf: 'PE', name: 'Pernambuco', ddd: '81', cap: 'Recife', int: 'Caruaru', cep: '50010-000' },
  { uf: 'PI', name: 'Piauí', ddd: '86', cap: 'Teresina', int: 'Parnaíba', cep: '64000-000' },
  { uf: 'RJ', name: 'Rio de Janeiro', ddd: '21', cap: 'Rio de Janeiro', int: 'Niterói', cep: '20010-000' },
  { uf: 'RN', name: 'Rio Grande do Norte', ddd: '84', cap: 'Natal', int: 'Mossoró', cep: '59012-000' },
  { uf: 'RS', name: 'Rio Grande do Sul', ddd: '51', cap: 'Porto Alegre', int: 'Caxias do Sul', cep: '90010-000' },
  { uf: 'RO', name: 'Rondônia', ddd: '69', cap: 'Porto Velho', int: 'Ji-Paraná', cep: '76801-000' },
  { uf: 'RR', name: 'Roraima', ddd: '95', cap: 'Boa Vista', int: 'Rorainópolis', cep: '69301-000' },
  { uf: 'SC', name: 'Santa Catarina', ddd: '48', cap: 'Florianópolis', int: 'Joinville', cep: '88010-000' },
  { uf: 'SP', name: 'São Paulo', ddd: '11', cap: 'São Paulo', int: 'Campinas', cep: '01001-000' },
  { uf: 'SE', name: 'Sergipe', ddd: '79', cap: 'Aracaju', int: 'Nossa Senhora do Socorro', cep: '49010-000' },
  { uf: 'TO', name: 'Tocantins', ddd: '63', cap: 'Palmas', int: 'Araguaína', cep: '77001-000' }
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

let cnpjSeed = 51000000;
function getNextCnpj() {
  cnpjSeed += 137;
  const base = String(cnpjSeed).padStart(8, '0');
  const prefix12 = `${base}0001`;
  return generateValidCnpj(prefix12);
}

const FIRST_NAMES = [
  'Carlos', 'Ana', 'Rodrigo', 'Juliana', 'Marcos', 'Fernanda', 'Lucas', 'Patricia',
  'Rafael', 'Beatriz', 'Eduardo', 'Camila', 'Felipe', 'Mariana', 'Thiago', 'Larissa',
  'Gabriel', 'Aline', 'Diego', 'Renata', 'Bruno', 'Vanessa', 'Gustavo', 'Jessica'
];

const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
  'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes'
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const MEI_TEMPLATES = [
  {
    role: 'Tecnologia & Suporte',
    nameSuffix: 'TECNOLOGIA E SUPORTE DE TI MEI',
    tradeSuffix: 'TECH & SERVICOS DIGITAIS',
    cnae: '62.09-1-00',
    cnaeDesc: 'Suporte técnico, manutenção e outros serviços em tecnologia da informação',
    secCnae: '62.01-5-01',
    secDesc: 'Desenvolvimento de programas de computador sob encomenda',
    capital: 8000,
    contractObj: 'Prestação de serviços contínuos de suporte técnico em microinformática e redes locais',
    contractCat: 'TI & Software',
    valRange: [18000, 48000],
    modality: 'Dispensa Eletrônica',
  },
  {
    role: 'Instalações Elétricas & Manutenção',
    nameSuffix: 'INSTALACOES ELETRICAS E REPAROS MEI',
    tradeSuffix: 'ELETRICA & MANUTENCAO PREDIAL',
    cnae: '43.21-5-00',
    cnaeDesc: 'Instalação e manutenção elétrica',
    secCnae: '43.22-3-01',
    secDesc: 'Instalações hidráulicas, sanitárias e de gás',
    capital: 10000,
    contractObj: 'Serviços de manutenção preventiva e corretiva nas instalações elétricas e quadros de força',
    contractCat: 'Engenharia & Obras',
    valRange: [22000, 54000],
    modality: 'Dispensa de Licitação',
  },
  {
    role: 'Consultoria & Treinamento',
    nameSuffix: 'CONSULTORIA E CAPACITACAO PROFISSIONAL MEI',
    tradeSuffix: 'GESTAO & TREINAMENTOS',
    cnae: '85.99-6-04',
    cnaeDesc: 'Treinamento em desenvolvimento profissional e gerencial',
    secCnae: '82.11-3-00',
    secDesc: 'Serviços combinados de escritório e apoio administrativo',
    capital: 6000,
    contractObj: 'Contratação de instrutor credenciado para capacitação em atendimento e ferramentas digitais para servidores',
    contractCat: 'Consultoria & Treinamento',
    valRange: [15000, 36000],
    modality: 'Inexigibilidade de Licitação',
  },
  {
    role: 'Comunicação Visual & Design',
    nameSuffix: 'COMUNICACAO VISUAL E DESIGN GRAFICO MEI',
    tradeSuffix: 'ARTE & MIDIA VISUAL',
    cnae: '18.13-0-01',
    cnaeDesc: 'Impressão de material para uso publicitário',
    secCnae: '73.19-0-02',
    secDesc: 'Promoção de vendas e publicidade no local de venda',
    capital: 12000,
    contractObj: 'Confecção e instalação de placas indicativas, faixas, banners e envelopamento para campanhas públicas',
    contractCat: 'Outros',
    valRange: [24000, 62000],
    modality: 'Dispensa Eletrônica',
  },
  {
    role: 'Serviços Administrativos & Apoio',
    nameSuffix: 'SERVICOS ADMINISTRATIVOS E APOIO OPERACIONAL MEI',
    tradeSuffix: 'SOLUCOES & APOIO CORPORATIVO',
    cnae: '82.11-3-00',
    cnaeDesc: 'Serviços combinados de escritório e apoio administrativo',
    secCnae: '82.19-9-99',
    secDesc: 'Preparação de documentos e serviços especializados de apoio administrativo',
    capital: 5000,
    contractObj: 'Serviços de apoio operacional à digitalização de acervo e protocolo de documentos',
    contractCat: 'Serviços Terceirizados',
    valRange: [19000, 42000],
    modality: 'Dispensa Eletrônica',
  }
];

const SME_TEMPLATES = [
  {
    size: 'ME',
    namePrefix: 'SOLUCOES DIGITAIS',
    tradeSuffix: 'TECNOLOGIA & INOVACAO',
    cnae: '62.01-5-01',
    cnaeDesc: 'Desenvolvimento de programas de computador sob encomenda (TI)',
    secCnae: '62.02-3-00',
    secDesc: 'Desenvolvimento e licenciamento de programas customizáveis',
    capital: 150000,
    employees: 6,
    payroll: 16800,
    contractVal: 285000,
    contractCat: 'TI & Software',
    contractObj: 'Licenciamento e sustentação de sistema web de gestão de processos e protocolo digital',
    modality: 'Pregão Eletrônico',
  },
  {
    size: 'ME',
    namePrefix: 'ENGENHARIA E REFORMAS',
    tradeSuffix: 'CONSTRUCOES CIVIS',
    cnae: '41.20-4-00',
    cnaeDesc: 'Construção de edifícios e obras de infraestrutura civil',
    secCnae: '43.30-4-04',
    secDesc: 'Serviços de pintura de edifícios em geral',
    capital: 200000,
    employees: 8,
    payroll: 21500,
    contractVal: 340000,
    contractCat: 'Engenharia & Obras',
    contractObj: 'Reforma e adequação estrutural com acessibilidade em prédios de atendimento ao público',
    modality: 'Tomada de Preços',
  },
  {
    size: 'EPP',
    namePrefix: 'DISTRIBUIDORA E LOGISTICA',
    tradeSuffix: 'SUPRIMENTOS & LOGISTICA',
    cnae: '46.45-1-01',
    cnaeDesc: 'Comércio atacadista de instrumentos e materiais para uso médico-hospitalar',
    secCnae: '49.30-2-02',
    secDesc: 'Transporte rodoviário de carga intermunicipal e interestadual',
    capital: 850000,
    employees: 28,
    payroll: 86800,
    contractVal: 2450000,
    contractCat: 'Saúde & Medicamentos',
    contractObj: 'Fornecimento continuado de insumos hospitalares descartáveis e materiais de enfermagem',
    modality: 'Pregão Eletrônico (SRP)',
  },
  {
    size: 'EPP',
    namePrefix: 'SERVICOS E FACILITIES',
    tradeSuffix: 'TERCEIRIZACAO & FACILITIES',
    cnae: '81.21-4-00',
    cnaeDesc: 'Limpeza em prédios e em domicílios',
    secCnae: '80.11-1-01',
    secDesc: 'Atividades de vigilância e segurança privada',
    capital: 1200000,
    employees: 42,
    payroll: 135000,
    contractVal: 3850000,
    contractCat: 'Serviços Terceirizados',
    contractObj: 'Prestação de serviços contínuos de conservação, asseio predial e controle de acesso',
    modality: 'Pregão Eletrônico',
  },
  {
    size: 'MEDIO',
    namePrefix: 'INFRAESTRUTURA E OBRAS',
    tradeSuffix: 'CONSTRUTORA & INFRAESTRUTURA',
    cnae: '71.12-0-00',
    cnaeDesc: 'Serviços de engenharia e consultoria técnica',
    secCnae: '42.11-1-01',
    secDesc: 'Construção de rodovias e ferrovias',
    capital: 6500000,
    employees: 120,
    payroll: 420000,
    contractVal: 14500000,
    contractCat: 'Engenharia & Obras',
    contractObj: 'Execução de obras de pavimentação asfáltica, drenagem pluvial e sinalização viária',
    modality: 'Concorrência Pública',
  }
];

const allCompanies = [];
let idCount = 100;

for (const st of STATES) {
  // 1. Generate 5 MEIs for this state
  for (let i = 0; i < MEI_TEMPLATES.length; i++) {
    const tmpl = MEI_TEMPLATES[i];
    const fn = getRandomItem(FIRST_NAMES);
    const ln1 = getRandomItem(LAST_NAMES);
    const ln2 = getRandomItem(LAST_NAMES);
    const personName = `${fn} ${ln1} ${ln2}`;
    const cleanPerson = `${fn} ${ln1}`;
    
    const cnpj = getNextCnpj();
    const city = i % 2 === 0 ? st.cap : st.int;
    const phoneNum = `9${Math.floor(8000 + Math.random() * 1999)}-${Math.floor(1000 + Math.random() * 8999)}`;
    const fullPhone = `(${st.ddd}) ${phoneNum}`;
    const rawDigitsPhone = `55${st.ddd}${phoneNum.replace(/\D/g, '')}`;
    const slug = `${fn.toLowerCase()}${ln1.toLowerCase()}${st.uf.toLowerCase()}`;
    const email = `contato@${slug}solucoes.com.br`;
    const contractVal = Math.floor(tmpl.valRange[0] + Math.random() * (tmpl.valRange[1] - tmpl.valRange[0]));
    const contractNum = `PE-${st.uf}-${2024}-${String(Math.floor(10 + Math.random() * 89)).padStart(3, '0')}`;
    const buyer = i % 2 === 0 ? `Prefeitura Municipal de ${city} - ${st.uf}` : `Câmara Municipal de ${city} - ${st.uf}`;

    const compId = `comp-${st.uf.toLowerCase()}-mei-${i + 1}`;

    const pubContracts = [
      {
        id: `cnt-${compId}-01`,
        companyId: compId,
        contractNumber: contractNum,
        buyerAgency: buyer,
        buyerUf: st.uf,
        modality: tmpl.modality,
        object: tmpl.contractObj,
        category: tmpl.contractCat,
        totalValue: contractVal,
        startDate: '2024-02-01',
        endDate: '2025-02-01',
        status: 'VIGENTE',
        sourceUrl: `https://pncp.gov.br/app/contratos/${cnpj}/${2024}`,
        sourceSystem: 'PNCP / Compras Públicas',
      }
    ];

    const capacityScore = Math.min(95, Math.floor(62 + (contractVal / 1000) * 0.45));

    const company = {
      id: compId,
      cnpj,
      legalName: `${personName.toUpperCase()} - ${tmpl.nameSuffix}`,
      tradeName: `${cleanPerson.toUpperCase()} ${tmpl.tradeSuffix}`,
      status: 'ATIVA',
      registrationDate: '2021-04-12',
      primaryCnaeCode: tmpl.cnae,
      primaryCnaeDesc: tmpl.cnaeDesc,
      secondaryCnaes: [
        { code: tmpl.secCnae, desc: tmpl.secDesc }
      ],
      legalNature: '213-5 - Empresário (Individual)',
      companySize: 'MEI',
      shareCapital: tmpl.capital,
      state: st.uf,
      city,
      neighborhood: 'Centro Empresarial',
      zipCode: st.cep,
      street: `Avenida Principal de ${city}`,
      number: String(Math.floor(100 + Math.random() * 800)),
      phone: fullPhone,
      email,
      whatsapp: `https://wa.me/${rawDigitsPhone}`,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${personName} ${city} ${st.uf}`)}`,
      partners: [
        {
          id: `soc-${compId}-01`,
          name: personName,
          document: `***.${Math.floor(100 + Math.random() * 899)}.${Math.floor(100 + Math.random() * 899)}-**`,
          role: 'Titular / Microempreendedor Individual',
          startDate: '2021-04-12',
        }
      ],
      publicContracts: pubContracts,
      hasPublicContracts: true,
      totalContractsVolume: contractVal,
      activeContractsCount: 1,
      lastContractDate: '2024-02-01',
      capacityScore,
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-09-18T12:00:00Z',
      fiscalData: {
        taxRegime: 'MEI',
        taxRegimeDescription: 'Microempreendedor Individual (SIMEI)',
        isSimplesNacional: true,
        simplesOptInDate: '2021-04-12',
        isSimei: true,
        simeiOptInDate: '2021-04-12',
        federalTaxDebtStatus: 'REGULAR',
        cndFederal: 'VÁLIDA / EMITIDA',
        cndFgts: 'REGULAR (CRF ATIVO)',
        cndTrabalhista: 'CERTIDÃO NEGATIVA (CNDT VÁLIDA)',
        stateRegistration: `20.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}-${cnpj.slice(8, 9)}`,
        municipalRegistration: `${cnpj.slice(0, 6)}/MEI`,
        employeeCountDeclared: 1,
        employeeRangeDescription: '1 colaborador formal registrado no eSocial (Limite MEI)',
        estimatedPayrollMonthly: 1412,
        dasnStatus: 'ENTREGUE / REGULAR',
      },
      financialIndicators: {
        id: `ind-${compId}`,
        companyId: compId,
        taxRegime: 'MEI',
        estimatedAnnualRevenueMin: 36000,
        estimatedAnnualRevenueMax: 81000,
        estimatedEmployeeCountMin: 1,
        estimatedEmployeeCountMax: 1,
        financialCapacityScore: capacityScore,
        suggestedMonthlyTicketMin: 350,
        suggestedMonthlyTicketMax: 980,
        suggestedOneOffTicketMin: 2200,
        suggestedOneOffTicketMax: 6500,
        publicContractsVolumeTotal: contractVal,
        calculatedAt: '2024-09-18T12:00:00Z',
        riskLevel: 'BAIXO',
        insights: [
          `MEI regularizado com contrato público ativo de ${contractVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`,
          'Quadro do eSocial regularizado com 1 colaborador.',
          'Capacidade comprovada de pagamento para soluções de tecnologia e automação comercial.'
        ],
      }
    };

    allCompanies.push(company);
  }

  // 2. Generate 3 to 4 SMEs (ME, EPP, MEDIO) for this state
  const smeCount = st.uf === 'SP' || st.uf === 'RJ' || st.uf === 'MG' || st.uf === 'BA' || st.uf === 'PR' || st.uf === 'RN' ? 5 : 3;
  for (let j = 0; j < smeCount; j++) {
    const tmpl = SME_TEMPLATES[j % SME_TEMPLATES.length];
    const cnpj = getNextCnpj();
    const city = j === 0 ? st.cap : st.int;
    const phoneNum = `9${Math.floor(8000 + Math.random() * 1999)}-${Math.floor(1000 + Math.random() * 8999)}`;
    const fullPhone = `(${st.ddd}) ${phoneNum}`;
    const rawDigitsPhone = `55${st.ddd}${phoneNum.replace(/\D/g, '')}`;
    const compSlug = `${st.uf.toLowerCase()}${tmpl.size.toLowerCase()}${j}`;
    const legalName = `${st.name.toUpperCase()} ${tmpl.namePrefix} ${tmpl.size === 'MEDIO' ? 'S.A.' : 'LTDA'}`;
    const tradeName = `${tmpl.tradeSuffix} ${st.uf}`;
    const compId = `comp-${st.uf.toLowerCase()}-${tmpl.size.toLowerCase()}-${j + 1}`;

    const buyerAgency = j % 2 === 0
      ? `Secretaria de Estado da Saúde de ${st.name} - SESAP/${st.uf}`
      : `Tribunal de Justiça do Estado de ${st.name} - TJ/${st.uf}`;

    const contractNum = `CT-${st.uf}-${2024}-${String(Math.floor(100 + Math.random() * 899))}`;

    const pubContracts = [
      {
        id: `cnt-${compId}-01`,
        companyId: compId,
        contractNumber: contractNum,
        buyerAgency,
        buyerUf: st.uf,
        modality: tmpl.modality,
        object: tmpl.contractObj,
        category: tmpl.contractCat,
        totalValue: tmpl.contractVal,
        startDate: '2023-08-01',
        endDate: '2025-08-01',
        status: 'VIGENTE',
        sourceUrl: `https://pncp.gov.br/app/contratos/${cnpj}/${2024}`,
        sourceSystem: 'PNCP / Compras Governamentais',
      }
    ];

    const capacityScore = tmpl.size === 'ME' ? 76 : tmpl.size === 'EPP' ? 88 : 94;

    const isSimples = tmpl.size === 'ME' || tmpl.size === 'EPP';
    const regime = isSimples ? 'SIMPLES_NACIONAL' : 'LUCRO_PRESUMIDO';
    const regimeDesc = isSimples ? 'Simples Nacional' : 'Lucro Presumido';

    const fn1 = getRandomItem(FIRST_NAMES);
    const ln1 = getRandomItem(LAST_NAMES);
    const fn2 = getRandomItem(FIRST_NAMES);
    const ln2 = getRandomItem(LAST_NAMES);

    const company = {
      id: compId,
      cnpj,
      legalName,
      tradeName,
      status: 'ATIVA',
      registrationDate: '2018-06-20',
      primaryCnaeCode: tmpl.cnae,
      primaryCnaeDesc: tmpl.cnaeDesc,
      secondaryCnaes: [
        { code: tmpl.secCnae, desc: tmpl.secDesc }
      ],
      legalNature: tmpl.size === 'MEDIO' ? '205-4 - Sociedade Anônima Fechada' : '206-2 - Sociedade Empresária Limitada',
      companySize: tmpl.size,
      shareCapital: tmpl.capital,
      state: st.uf,
      city,
      neighborhood: 'Distrito Industrial',
      zipCode: st.cep,
      street: `Rodovia Estadual ${st.uf}-010, Km 4`,
      number: String(Math.floor(1000 + Math.random() * 5000)),
      phone: fullPhone,
      email: `comercial@${compSlug}.com.br`,
      whatsapp: `https://wa.me/${rawDigitsPhone}`,
      mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${legalName} ${city} ${st.uf}`)}`,
      partners: [
        {
          id: `soc-${compId}-01`,
          name: `${fn1} ${ln1}`,
          document: `***.${Math.floor(100 + Math.random() * 899)}.${Math.floor(100 + Math.random() * 899)}-**`,
          role: 'Sócio-Administrador',
          startDate: '2018-06-20',
        },
        {
          id: `soc-${compId}-02`,
          name: `${fn2} ${ln2}`,
          document: `***.${Math.floor(100 + Math.random() * 899)}.${Math.floor(100 + Math.random() * 899)}-**`,
          role: 'Sócio Diretor Comercial',
          startDate: '2019-01-15',
        }
      ],
      publicContracts: pubContracts,
      hasPublicContracts: true,
      totalContractsVolume: tmpl.contractVal,
      activeContractsCount: 1,
      lastContractDate: '2023-08-01',
      capacityScore,
      createdAt: '2023-01-15T10:00:00Z',
      updatedAt: '2024-09-18T12:00:00Z',
      fiscalData: {
        taxRegime: regime,
        taxRegimeDescription: regimeDesc,
        isSimplesNacional: isSimples,
        simplesOptInDate: isSimples ? '2018-06-20' : undefined,
        isSimei: false,
        federalTaxDebtStatus: 'REGULAR',
        cndFederal: 'VÁLIDA / EMITIDA',
        cndFgts: 'REGULAR (CRF ATIVO)',
        cndTrabalhista: 'CERTIDÃO NEGATIVA (CNDT VÁLIDA)',
        stateRegistration: `12.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}-${cnpj.slice(8, 9)}`,
        municipalRegistration: `${cnpj.slice(0, 6)}/LTDA`,
        employeeCountDeclared: tmpl.employees,
        employeeRangeDescription: `${tmpl.employees} funcionários registrados no eSocial/CAGED`,
        estimatedPayrollMonthly: tmpl.payroll,
        dasnStatus: undefined,
      },
      financialIndicators: {
        id: `ind-${compId}`,
        companyId: compId,
        taxRegime: regime,
        estimatedAnnualRevenueMin: tmpl.size === 'ME' ? 120000 : tmpl.size === 'EPP' ? 850000 : 4500000,
        estimatedAnnualRevenueMax: tmpl.size === 'ME' ? 360000 : tmpl.size === 'EPP' ? 4800000 : 25000000,
        estimatedEmployeeCountMin: tmpl.employees,
        estimatedEmployeeCountMax: tmpl.employees + 4,
        financialCapacityScore: capacityScore,
        suggestedMonthlyTicketMin: tmpl.size === 'ME' ? 850 : tmpl.size === 'EPP' ? 2400 : 8500,
        suggestedMonthlyTicketMax: tmpl.size === 'ME' ? 2200 : tmpl.size === 'EPP' ? 7500 : 26000,
        suggestedOneOffTicketMin: tmpl.size === 'ME' ? 6500 : tmpl.size === 'EPP' ? 22000 : 85000,
        suggestedOneOffTicketMax: tmpl.size === 'ME' ? 18000 : tmpl.size === 'EPP' ? 65000 : 240000,
        publicContractsVolumeTotal: tmpl.contractVal,
        calculatedAt: '2024-09-18T12:00:00Z',
        riskLevel: 'BAIXO',
        insights: [
          `Forte presença governamental com contrato de ${tmpl.contractVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`,
          `Quadro do eSocial ativo com ${tmpl.employees} colaboradores contratados CLT.`,
          'Excelente liquidez financeira e capacidade de contratação imediata.'
        ],
      }
    };

    allCompanies.push(company);
  }
}

console.log(`Generated total of ${allCompanies.length} companies across ${STATES.length} Brazilian states.`);

// Write to src/lib/brazil-database.ts
const fileHeader = `/**
 * BRAZIL COMPREHENSIVE ENTERPRISE DATABASE
 * 
 * Auto-generated dataset covering all 27 Brazilian States (UFs) with realistic,
 * fully-formed enterprises: MEIs, Microempresas (ME), Empresas de Pequeno Porte (EPP),
 * e Médio Porte, com dados fiscais declarados (eSocial, CNDs, SIMEI),
 * contatos telefônicos com DDD local, WhatsApp direto e contratos públicos PNCP.
 */

import { Company } from '@/types';

export const BRAZIL_DATABASE_COMPANIES: Company[] = `;

const fileContent = fileHeader + JSON.stringify(allCompanies, null, 2) + ';\n';

fs.writeFileSync(path.join(__dirname, '../src/lib/brazil-database.ts'), fileContent, 'utf-8');
console.log('Successfully wrote src/lib/brazil-database.ts');
