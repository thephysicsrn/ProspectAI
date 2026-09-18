const fs = require('fs');
const path = require('path');

const NORDESTE_STATES = [
  {
    uf: 'RN',
    name: 'Rio Grande do Norte',
    ddd: '84',
    target: 1450,
    cep: '59012-000',
    cities: [
      'Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante', 'Macaíba',
      'Ceará-Mirim', 'Caicó', 'Currais Novos', 'Assú', 'Pau dos Ferros',
      'Santa Cruz', 'Nova Cruz', 'Apodi', 'Touros', 'Extremoz'
    ]
  },
  {
    uf: 'BA',
    name: 'Bahia',
    ddd: '71',
    target: 1750,
    cep: '40020-000',
    cities: [
      'Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Juazeiro',
      'Ilhéus', 'Lauro de Freitas', 'Itabuna', 'Jequié', 'Alagoinhas', 'Barreiras',
      'Porto Seguro', 'Luís Eduardo Magalhães', 'Simões Filho', 'Teixeira de Freitas'
    ]
  },
  {
    uf: 'PE',
    name: 'Pernambuco',
    ddd: '81',
    target: 1550,
    cep: '50010-000',
    cities: [
      'Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina',
      'Paulista', 'Cabo de Santo Agostinho', 'Garanhuns', 'Vitória de Santo Antão',
      'Ipojuca', 'Abreu e Lima', 'Santa Cruz do Capibaribe', 'Araripina', 'Serra Talhada'
    ]
  },
  {
    uf: 'CE',
    name: 'Ceará',
    ddd: '85',
    target: 1550,
    cep: '60025-000',
    cities: [
      'Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral',
      'Crato', 'Itapipoca', 'Maranguape', 'Iguatu', 'Quixadá', 'Aquiraz',
      'Russas', 'Tianguá', 'Crateús', 'Cascavel'
    ]
  },
  {
    uf: 'PB',
    name: 'Paraíba',
    ddd: '83',
    target: 1150,
    cep: '58010-000',
    cities: [
      'João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux',
      'Sousa', 'Cajazeiras', 'Guarabira', 'Cabedelo', 'Mamanguape', 'Queimadas'
    ]
  },
  {
    uf: 'MA',
    name: 'Maranhão',
    ddd: '98',
    target: 950,
    cep: '65010-000',
    cities: [
      'São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon', 'Caxias',
      'Codó', 'Paço do Lumiar', 'Açailândia', 'Bacabal', 'Balsas', 'Santa Inês'
    ]
  },
  {
    uf: 'PI',
    name: 'Piauí',
    ddd: '86',
    target: 850,
    cep: '64000-000',
    cities: [
      'Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano',
      'Campo Maior', 'Barras', 'União', 'Altos', 'Esperantina', 'Pedro II'
    ]
  },
  {
    uf: 'AL',
    name: 'Alagoas',
    ddd: '82',
    target: 750,
    cep: '57020-000',
    cities: [
      'Maceió', 'Arapiraca', 'Rio Largo', 'Palmeira dos Índios', 'União dos Palmares',
      'Penedo', 'São Miguel dos Campos', 'Delmiro Gouveia', 'Coruripe', 'Santana do Ipanema'
    ]
  },
  {
    uf: 'SE',
    name: 'Sergipe',
    ddd: '79',
    target: 650,
    cep: '49010-000',
    cities: [
      'Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana', 'Estância',
      'São Cristóvão', 'Tobias Barreto', 'Simão Dias', 'Propriá', 'Itaporanga d\'Ajuda'
    ]
  }
];

const SECTORS_NORDESTE = [
  {
    category: 'Energia Solar & Eólica',
    cnae: '43.21-5-00',
    cnaeDesc: 'Instalação e manutenção elétrica e usinas fotovoltaicas',
    secCnae: '35.11-5-01',
    secDesc: 'Geração de energia elétrica eólica e solar',
    keywords: ['SOLAR', 'EOLICA', 'RENOVAVEL', 'ENERGIA', 'VOLTAICA', 'POTENCIA', 'PARQUES', 'VENTOS'],
    contractObj: 'Implantação, homologação e manutenção preventiva de parques solares e eólicos em polos regionais',
  },
  {
    category: 'Fruticultura & Agroindústria',
    cnae: '01.21-1-01',
    cnaeDesc: 'Horticultura e cultivo de frutas tropicais irrigadas',
    secCnae: '10.31-7-00',
    secDesc: 'Fabricação de conservas de frutas e polpas tropicais',
    keywords: ['AGRO', 'FRUTAS', 'IRRIGACAO', 'AGRONEGOCIO', 'EXPORTADORA', 'SAFRA', 'CULTIVO', 'VALE'],
    contractObj: 'Fornecimento e distribuição de hortifrúti, grãos e produtos agroindustriais certificados',
  },
  {
    category: 'Construção Civil & Infraestrutura',
    cnae: '41.20-4-00',
    cnaeDesc: 'Construção de edifícios e obras de infraestrutura regional',
    secCnae: '42.11-1-01',
    secDesc: 'Construção de rodovias, ferrovias e obras de urbanização',
    keywords: ['CONSTRUCOES', 'INFRAESTRUTURA', 'OBRAS', 'ENGENHARIA', 'PAVIMENTACAO', 'EDIFICACOES', 'NORDESTE'],
    contractObj: 'Execução de obras civis, contenção, saneamento básico e modernização predial',
  },
  {
    category: 'Polo Têxtil, Confecção & Calçados',
    cnae: '14.12-6-01',
    cnaeDesc: 'Confecção de peças do vestuário e fardamentos',
    secCnae: '15.31-9-01',
    secDesc: 'Fabricação de calçados de couro e materiais sintéticos',
    keywords: ['TEXTIL', 'CONFECCAO', 'MODA', 'CALCADOS', 'VESTUARIO', 'UNIFORMES', 'FABRICA', 'BORDADOS'],
    contractObj: 'Confecção e fornecimento continuado de uniformes profissionais e fardamentos corporativos',
  },
  {
    category: 'TI & Inovação Digital',
    cnae: '62.01-5-01',
    cnaeDesc: 'Desenvolvimento de programas de computador sob encomenda (TI)',
    secCnae: '62.09-1-00',
    secDesc: 'Suporte técnico, manutenção e infraestrutura em nuvem',
    keywords: ['TECNOLOGIA', 'SOFTWARE', 'DIGITAL', 'SYSTEMS', 'CLOUD', 'DADOS', 'INOVACAO', 'TECH'],
    contractObj: 'Licenciamento e suporte técnico de soluções digitais corporativas e governança eletrônica',
  },
  {
    category: 'Saúde, Clínicas & Medicamentos',
    cnae: '46.45-1-01',
    cnaeDesc: 'Comércio atacadista de instrumentos e materiais médico-hospitalares',
    secCnae: '86.10-1-01',
    secDesc: 'Atividades de atendimento hospitalar e serviços médicos',
    keywords: ['MED', 'SAUDE', 'HOSPITALAR', 'DIAGNOSTICOS', 'FARMA', 'CLINICA', 'DISTRIBUIDORA', 'BIOTEC'],
    contractObj: 'Fornecimento continuado de medicamentos, materiais hospitalares e insumos laboratoriais',
  },
  {
    category: 'Serviços Terceirizados & Segurança',
    cnae: '81.21-4-00',
    cnaeDesc: 'Limpeza em prédios e manutenção predial integrada',
    secCnae: '80.11-1-01',
    secDesc: 'Atividades de vigilância e segurança privada patrimonial',
    keywords: ['SERVICOS', 'TERCEIRIZACAO', 'VIGILANCIA', 'FACILITIES', 'LIMPEZA', 'SEGURANCA', 'PORTARIA'],
    contractObj: 'Prestação de serviços contínuos de conservação predial, portaria e apoio administrativo',
  },
  {
    category: 'Comércio Atacadista & Distribuição',
    cnae: '46.91-5-00',
    cnaeDesc: 'Comércio atacadista de mercadorias em geral',
    secCnae: '47.11-3-02',
    secDesc: 'Comércio varejista de mercadorias em geral',
    keywords: ['ATACADO', 'DISTRIBUIDORA', 'LOGISTICA', 'SUPRIMENTOS', 'COMERCIO', 'CENTRAL', 'ARMAZEM'],
    contractObj: 'Distribuição contínua de suprimentos operacionais, materiais de consumo e alimentos',
  },
  {
    category: 'Alimentação Corporativa & Hotelaria',
    cnae: '56.20-1-01',
    cnaeDesc: 'Fornecimento de alimentos preparados preponderantemente para empresas',
    secCnae: '49.30-2-02',
    secDesc: 'Transporte rodoviário de carga intermunicipal e interestadual',
    keywords: ['NUTRICAO', 'REFEICOES', 'ALIMENTOS', 'SABOR', 'BUFFET', 'EXPRESS', 'CARGAS', 'COLETIVAS'],
    contractObj: 'Fornecimento de gêneros alimentícios preparados e logística de distribuição de refeições',
  }
];

const FIRST_NAMES = [
  'Carlos', 'Ana', 'Rodrigo', 'Juliana', 'Marcos', 'Fernanda', 'Lucas', 'Patricia',
  'Rafael', 'Beatriz', 'Eduardo', 'Camila', 'Felipe', 'Mariana', 'Thiago', 'Larissa',
  'Gabriel', 'Aline', 'Diego', 'Renata', 'Bruno', 'Vanessa', 'Gustavo', 'Jessica',
  'Marcelo', 'Priscila', 'Leonardo', 'Renan', 'Daniela', 'Vinicius', 'Simone', 'Andre',
  'Tatiana', 'Caio', 'Sabrina', 'Guilherme', 'Flavia', 'Henrique', 'Monica', 'Alexandre',
  'Severino', 'Francisco', 'Antonio', 'Raimundo', 'Jose', 'Maria', 'Claudio', 'Gilberto'
];

const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
  'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes',
  'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade',
  'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas', 'Cardoso', 'Ramos',
  'Bezerra', 'Medeiros', 'Dantas', 'Cavalcanti', 'Pessoa', 'Sales', 'Barreto', 'Holanda'
];

const NEIGHBORHOODS_NORDESTE = [
  'Centro', 'Distrito Industrial', 'Tirol', 'Petrópolis', 'Alecrim', 'Capim Macio',
  'Ponta Negra', 'Aldeota', 'Meireles', 'Papicu', 'Boa Viagem', 'Graças', 'Espinheiro',
  'Barris', 'Pituba', 'Itaigara', 'Miramar', 'Manaira', 'Bessa', 'Ponta Verde', 'Jatiúca',
  'Farolândia', 'Atalaia', 'Jardins', 'Calhau', 'Renascença', 'Jóquei', 'Fátima'
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

let cnpjCounter = 61021400; // Começa rigorosamente após a base anterior
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

console.log('Iniciando geração de 10.650 novas empresas do NORDESTE brasileiro...');

const dataPath = path.join(__dirname, '../data/brazil-companies-10k.json');
let existingCompanies = [];
if (fs.existsSync(dataPath)) {
  existingCompanies = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  console.log(`Base existente carregada com sucesso: ${existingCompanies.length} empresas.`);
}

const newNordesteCompanies = [];

for (let s = 0; s < NORDESTE_STATES.length; s++) {
  const st = NORDESTE_STATES[s];
  const targetForState = st.target;

  for (let i = 0; i < targetForState; i++) {
    const cnpj = getNextCnpj();
    const city = randItem(st.cities);
    const sector = randItem(SECTORS_NORDESTE);
    const keyword = randItem(sector.keywords);
    const fn1 = randItem(FIRST_NAMES);
    const ln1 = randItem(LAST_NAMES);
    const ln2 = randItem(LAST_NAMES);
    const personName = `${fn1} ${ln1} ${ln2}`;
    const cleanPerson = `${fn1} ${ln1}`;

    // Distribuição: 52% MEI, 26% ME, 13% EPP, 6% MEDIO, 3% GRANDE
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

    if (randPct > 0.52 && randPct <= 0.78) {
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
      legalName = `${st.name.toUpperCase()} ${keyword} E SERVICOS NORDESTE LTDA`;
      tradeName = `${keyword} ${st.uf} SOLUCOES`;
    } else if (randPct > 0.78 && randPct <= 0.91) {
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
      legalName = `DISTRIBUIDORA E ${keyword} NORDESTE ${st.name.toUpperCase()} LTDA`;
      tradeName = `${keyword} REGIONAL ${st.uf}`;
    } else if (randPct > 0.91 && randPct <= 0.97) {
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
      legalName = `${keyword} E ENGENHARIA NORDESTE ${st.uf} S.A.`;
      tradeName = `${keyword} NORDESTE CORP ${st.uf}`;
    } else if (randPct > 0.97) {
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
      legalName = `NORDESTE ${keyword} E PARTICIPACOES S.A.`;
      tradeName = `GRUPO ${keyword} NORDESTE ${st.uf}`;
    }

    const phoneNum = `9${randInt(8000, 9999)}-${randInt(1000, 9999)}`;
    const fullPhone = `(${st.ddd}) ${phoneNum}`;
    const rawDigitsPhone = `55${st.ddd}${phoneNum.replace(/\D/g, '')}`;
    const slug = `${cleanPerson.toLowerCase().replace(/\s+/g, '')}${st.uf.toLowerCase()}ne${i}`;
    const email = `contato@${slug}.com.br`;
    const neighborhood = randItem(NEIGHBORHOODS_NORDESTE);
    const street = `Avenida Principal de ${city}, ${randInt(10, 2500)}`;

    const hasContract = Math.random() < 0.74;
    const contracts = [];

    if (hasContract) {
      contracts.push({
        id: `cnt-${cnpj}-01`,
        companyId: `brz-${cnpj}`,
        contractNumber: `CT-${st.uf}-NE-${2024}-${randInt(100, 999)}`,
        buyerAgency: `Governo do Estado de ${st.name} / Prefeituras do NE`,
        buyerUf: st.uf,
        modality: randItem(['Pregão Eletrônico', 'Dispensa de Licitação (Lei 14.133/21)', 'Concorrência Pública']),
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
      (size === 'MEI' ? 65 : size === 'ME' ? 77 : size === 'EPP' ? 89 : 95) +
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
          hasContract ? `Contrato ativo com órgão público/prefeitura no valor de R$ ${contractVal.toLocaleString('pt-BR')}.` : 'Histórico fiscal regularizado perante a Receita Federal.',
          `Quadro do eSocial ativo com ${employees} colaborador(es) registrado(s).`,
          'Capacidade comprovada de contratação e pagamento de soluções B2B.'
        ],
      }
    };

    newNordesteCompanies.push(comp);
  }
}

console.log(`Geração de empresas do Nordeste concluída! Total gerado: ${newNordesteCompanies.length} empresas.`);

const combined = [...existingCompanies, ...newNordesteCompanies];
console.log(`Unindo bases... Total final: ${combined.length} empresas.`);

fs.writeFileSync(dataPath, JSON.stringify(combined), 'utf8');

const stats = fs.statSync(dataPath);
console.log(`Arquivo salvo com sucesso em ${dataPath} (${(stats.size / (1024 * 1024)).toFixed(2)} MB).`);
