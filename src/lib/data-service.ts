/**
 * DATA SERVICE - Motor Central de Busca e Inteligência B2B
 * 
 * Estratégia de dados de alta escala:
 * 1. Base Nacional com mais de 10.500 empresas e MEIs cobrindo todos os 27 estados do Brasil
 * 2. Carregamento em lote indexado com Maps em memória (O(1) para CNPJ, Estado e Porte)
 * 3. Consulta em tempo real via BrasilAPI e PNCP para qualquer CNPJ brasileiro sob demanda
 * 4. Paginação, filtros avançados, CRM de listas e gerador de propostas
 */

import fs from 'fs';
import path from 'path';
import { INITIAL_COMPANIES } from './constants';
import { BRAZIL_DATABASE_COMPANIES } from './brazil-database';
import { fetchCompanyFromBrasilApi, fetchPncpContracts, getCnpjSeedsByState } from './brasil-api';
import { Company, Proposal, ProspectList, ProspectStatus, SearchFilters, CompanySize } from '@/types';
import { calculateFinancialCapacity, generatePitchRationale } from './estimators';

// ─────────────────────────────────────────────────────────────
// UTILITÁRIOS
// ─────────────────────────────────────────────────────────────
function cleanCnae(code: string): string {
  return code.replace(/\D/g, '');
}

function dedupeCompanies(companies: Company[]): Company[] {
  const seen = new Set<string>();
  return companies.filter(c => {
    if (seen.has(c.cnpj)) return false;
    seen.add(c.cnpj);
    return true;
  });
}

// ─────────────────────────────────────────────────────────────
// STORE INDEXADO EM MEMÓRIA (10.000+ EMPRESAS)
// ─────────────────────────────────────────────────────────────
let companiesStore: Company[] | null = null;
const cnpjIndex = new Map<string, Company>();
const stateIndex = new Map<string, Company[]>();
const sizeIndex = new Map<CompanySize, Company[]>();
const stateLoadedMap = new Map<string, boolean>();

function getCompaniesStore(): Company[] {
  if (companiesStore !== null && companiesStore.length > 0) {
    return companiesStore;
  }

  let list: Company[] = [...INITIAL_COMPANIES, ...BRAZIL_DATABASE_COMPANIES];

  try {
    const jsonPath = path.join(process.cwd(), 'data/brazil-companies-10k.json');
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf8');
      const loaded: Company[] = JSON.parse(raw);
      list = [...list, ...loaded];
    }
  } catch (err) {
    console.error('Aviso: data/brazil-companies-10k.json não encontrado ou com erro, usando base padrão:', err);
  }

  companiesStore = dedupeCompanies(list);

  // Inicializa índices rápidos
  cnpjIndex.clear();
  stateIndex.clear();
  sizeIndex.clear();

  for (let i = 0; i < companiesStore.length; i++) {
    const c = companiesStore[i];
    cnpjIndex.set(c.cnpj, c);
    
    // Índice por Estado
    if (c.state) {
      const st = c.state.toUpperCase();
      if (!stateIndex.has(st)) {
        stateIndex.set(st, []);
      }
      stateIndex.get(st)!.push(c);
    }

    // Índice por Porte
    if (c.companySize) {
      if (!sizeIndex.has(c.companySize)) {
        sizeIndex.set(c.companySize, []);
      }
      sizeIndex.get(c.companySize)!.push(c);
    }
  }

  return companiesStore;
}

// Inicialização imediata
getCompaniesStore();

let prospectListsStore: ProspectList[] = [
  {
    id: 'list-01',
    name: '🎯 Fornecedores de TI & Gov no RN',
    description: 'Empresas de software e tecnologia ativas com contratos governamentais em vigor no estado do RN.',
    itemsCount: 1,
    filterCriteria: { state: 'RN', cnae: '62.01-5-01', hasPublicContracts: true },
    createdAt: '2024-09-01T10:00:00Z',
    updatedAt: '2024-09-18T10:00:00Z',
    items: [
      {
        id: 'item-01',
        prospectListId: 'list-01',
        companyId: 'comp-01',
        company: INITIAL_COMPANIES[0],
        status: 'QUALIFICADO' as ProspectStatus,
        notes: 'Lead estratégico com faturamento garantido pela SEPLAN-RN.',
        tags: ['TI', 'Governo', 'Alta Capacidade'],
        addedAt: '2024-09-02T14:30:00Z',
        updatedAt: '2024-09-15T09:20:00Z',
      },
    ],
  },
  {
    id: 'list-02',
    name: '🏢 Grandes Contratadas de Engenharia & Infra',
    description: 'Empresas de construção pesada com contratos federais e estaduais acima de R$ 10 Milhões.',
    itemsCount: 1,
    filterCriteria: { minContractsVolume: 10000000 },
    createdAt: '2024-09-05T11:00:00Z',
    updatedAt: '2024-09-17T16:00:00Z',
    items: [
      {
        id: 'item-02',
        prospectListId: 'list-02',
        companyId: 'comp-02',
        company: INITIAL_COMPANIES.length > 2 ? INITIAL_COMPANIES[2] : INITIAL_COMPANIES[0],
        status: 'NOVO' as ProspectStatus,
        notes: 'Volume extraordinário de contratos ativos (DNIT + CAERN).',
        tags: ['Infraestrutura', 'Grande Porte', 'DNIT'],
        addedAt: '2024-09-05T11:30:00Z',
        updatedAt: '2024-09-05T11:30:00Z',
      },
    ],
  },
  {
    id: 'list-03',
    name: '⚡ MEIs Estratégicos com Contratos Públicos',
    description: 'Microempreendedores individuais com prestação de serviços ativos para prefeituras e órgãos públicos.',
    itemsCount: 1,
    filterCriteria: { companySize: ['MEI'], hasPublicContracts: true },
    createdAt: '2024-09-10T08:00:00Z',
    updatedAt: '2024-09-18T14:00:00Z',
    items: [
      {
        id: 'item-03',
        prospectListId: 'list-03',
        companyId: 'comp-rn-mei-1',
        company: BRAZIL_DATABASE_COMPANIES.find(c => c.companySize === 'MEI' && c.state === 'RN') || BRAZIL_DATABASE_COMPANIES[0],
        status: 'EM_CONTATO' as ProspectStatus,
        notes: 'Contrato ativo com a prefeitura local. Abordagem inicial de assessoria financeira feita via WhatsApp.',
        tags: ['MEI', 'Contrato Ativo', 'WhatsApp'],
        addedAt: '2024-09-10T09:00:00Z',
        updatedAt: '2024-09-18T11:30:00Z',
      },
    ],
  },
];

let proposalsStore: Proposal[] = [];

// ─────────────────────────────────────────────────────────────
// ENRIQUECIMENTO ASSÍNCRONO POR ESTADO (BRASILAPI)
// ─────────────────────────────────────────────────────────────
async function ensureStateLoaded(state: string): Promise<void> {
  if (stateLoadedMap.get(state)) return;
  stateLoadedMap.set(state, true);

  const seeds = getCnpjSeedsByState(state);
  const store = getCompaniesStore();
  const existing = new Set(store.map(c => c.cnpj));
  const toFetch = seeds.filter(cnpj => !existing.has(cnpj)).slice(0, 8);

  if (toFetch.length === 0) return;

  const results = await Promise.allSettled(
    toFetch.map(cnpj => fetchCompanyFromBrasilApi(cnpj))
  );

  const newCompanies: Company[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value) {
      newCompanies.push(r.value);
      cnpjIndex.set(r.value.cnpj, r.value);
    }
  }

  if (newCompanies.length > 0) {
    companiesStore = dedupeCompanies([...companiesStore!, ...newCompanies]);
  }
}

// ─────────────────────────────────────────────────────────────
// BUSCA PRINCIPAL (Indexada para 10.000+ empresas)
// ─────────────────────────────────────────────────────────────
export async function searchCompanies(filters: SearchFilters = {}): Promise<{
  data: Company[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const store = getCompaniesStore();

  // If a specific 14-digit CNPJ is in query and not in store, attempt live fetch
  if (filters.query) {
    const rawDigits = filters.query.replace(/\D/g, '');
    if (rawDigits.length === 14) {
      let liveCompany = cnpjIndex.get(rawDigits);
      if (!liveCompany) {
        try {
          liveCompany = (await fetchCompanyFromBrasilApi(rawDigits)) || undefined;
          if (liveCompany) {
            cnpjIndex.set(rawDigits, liveCompany);
            companiesStore = dedupeCompanies([liveCompany, ...(companiesStore || [])]);
          }
        } catch {
          // fallback to local search
        }
      }
    }
  }

  // Background state enrichment
  if (filters.state && filters.state !== 'ALL') {
    ensureStateLoaded(filters.state).catch(() => {});
  }

  // 1. Ponto de partida otimizado por índice de Estado
  let results: Company[];
  if (filters.state && filters.state.trim() !== '' && filters.state !== 'ALL') {
    const st = filters.state.toUpperCase().trim();
    results = [...(stateIndex.get(st) || [])];
  } else {
    results = [...store];
  }

  // 2. Filtro de porte (MEI, ME, EPP, MEDIO, GRANDE)
  if (filters.companySize && filters.companySize.length > 0) {
    const targetSizes = new Set(filters.companySize);
    results = results.filter(c => targetSizes.has(c.companySize));
  }

  // 3. Filtro de texto (Razão Social, Nome Fantasia, CNPJ ou Cidade)
  if (filters.query && filters.query.trim() !== '') {
    const q = filters.query.toLowerCase().trim();
    const qDigits = filters.query.replace(/\D/g, '');

    results = results.filter(c => {
      const inLegalName = c.legalName.toLowerCase().includes(q);
      const inTradeName = (c.tradeName || '').toLowerCase().includes(q);
      const inCity = c.city.toLowerCase().includes(q);
      const inCnpj = qDigits.length >= 3 && c.cnpj.includes(qDigits);
      const inPartner = (c.partners || []).some(p => p.name.toLowerCase().includes(q));
      return inLegalName || inTradeName || inCity || inCnpj || inPartner;
    });
  }

  // 4. Filtro de cidade
  if (filters.city && filters.city.trim() !== '') {
    const cityQ = filters.city.toLowerCase().trim();
    results = results.filter(c => c.city.toLowerCase().includes(cityQ));
  }

  // 5. Filtro CNAE (primário e secundários)
  if (filters.cnae && filters.cnae.trim() !== '') {
    const cnaeParts = cleanCnae(filters.cnae);
    results = results.filter(c => {
      const primary = cleanCnae(c.primaryCnaeCode || '');
      const matches = primary.startsWith(cnaeParts.slice(0, 4)) || primary.includes(cnaeParts);
      const secondaryMatches = (c.secondaryCnaes || []).some(sc =>
        cleanCnae(sc.code).startsWith(cnaeParts.slice(0, 4)) || cleanCnae(sc.code).includes(cnaeParts)
      );
      return matches || secondaryMatches;
    });
  }

  // 6. Filtro de contratos públicos
  if (filters.hasPublicContracts) {
    results = results.filter(c => c.publicContracts && c.publicContracts.length > 0);
  }

  // 7. Filtro de score mínimo
  if (filters.minScore != null) {
    results = results.filter(c => (c.capacityScore || 0) >= filters.minScore!);
  }

  // 8. Filtro de volume mínimo de contratos
  if (filters.minContractsVolume != null) {
    results = results.filter(c => (c.totalContractsVolume || 0) >= filters.minContractsVolume!);
  }

  // 9. Ordenação
  const sortBy = filters.sortBy || 'score';
  results.sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return (b.capacityScore || 0) - (a.capacityScore || 0);
      case 'contracts':
        return (b.totalContractsVolume || 0) - (a.totalContractsVolume || 0);
      case 'name':
        return a.legalName.localeCompare(b.legalName, 'pt-BR');
      case 'size': {
        const order: CompanySize[] = ['GRANDE', 'MEDIO', 'EPP', 'ME', 'MEI'];
        return order.indexOf(a.companySize) - order.indexOf(b.companySize);
      }
      default:
        return (b.capacityScore || 0) - (a.capacityScore || 0);
    }
  });

  // 10. Paginação
  const page = Math.max(1, filters.page || 1);
  const perPage = Math.min(100, filters.limit || 20);
  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const data = results.slice(start, start + perPage);

  return { data, total, page, totalPages };
}

// ─────────────────────────────────────────────────────────────
// BUSCA POR CNPJ (O(1) com enriquecimento PNCP)
// ─────────────────────────────────────────────────────────────
export async function getCompanyByCnpj(cnpj: string): Promise<Company | undefined> {
  const clean = cnpj.replace(/\D/g, '');
  getCompaniesStore();

  // 1. Verifica no índice instantâneo
  let company = cnpjIndex.get(clean);

  // 2. Se não existir no store, busca ao vivo na BrasilAPI
  if (!company) {
    const fetched = await fetchCompanyFromBrasilApi(clean);
    if (fetched) {
      company = fetched;
      cnpjIndex.set(clean, company);
      companiesStore = dedupeCompanies([company, ...(companiesStore || [])]);
    }
  }

  if (!company) return undefined;

  // 3. Enriquece com contratos PNCP se ainda não tiver
  if (!company.publicContracts || company.publicContracts.length === 0) {
    const contracts = await fetchPncpContracts(clean);
    if (contracts.length > 0) {
      const totalVolume = contracts.reduce((sum, c) => sum + c.totalValue, 0);
      const activeContracts = contracts.filter(c => c.status === 'VIGENTE');
      const activeAnnualSum = activeContracts.reduce((sum, c) => sum + c.totalValue, 0);

      // Recalcula capacidade com os dados de contratos
      const updatedFinancial = calculateFinancialCapacity({
        companySize: company.companySize,
        shareCapital: company.shareCapital || 0,
        activePublicContractsAnnualSum: activeAnnualSum,
        primaryCnaeCode: company.primaryCnaeCode || '',
        taxRegime: company.fiscalData?.taxRegime || 'SIMPLES_NACIONAL',
      });

      company = {
        ...company,
        publicContracts: contracts,
        hasPublicContracts: true,
        totalContractsVolume: totalVolume,
        activeContractsCount: activeContracts.length,
        lastContractDate: contracts[0]?.startDate,
        financialIndicators: {
          id: `ind-${company.id}`,
          companyId: company.id,
          calculatedAt: new Date().toISOString(),
          ...updatedFinancial,
        },
        capacityScore: updatedFinancial.financialCapacityScore,
      };

      // Atualiza o índice e store
      cnpjIndex.set(clean, company);
      if (companiesStore) {
        companiesStore = companiesStore.map(c => c.cnpj === clean ? company! : c);
      }
    }
  }

  return company;
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD STATS (Totalizando mais de 10.000 empresas)
// ─────────────────────────────────────────────────────────────
export function getDashboardStats() {
  const store = getCompaniesStore();
  const total = store.length;
  const active = store.filter(c => c.status === 'ATIVA').length;
  const withContracts = store.filter(c => c.publicContracts && c.publicContracts.length > 0).length;
  const totalContracts = store.reduce((sum, c) => sum + (c.totalContractsVolume || 0), 0);
  
  const bySize = {
    MEI: sizeIndex.get('MEI')?.length || 0,
    ME: sizeIndex.get('ME')?.length || 0,
    EPP: sizeIndex.get('EPP')?.length || 0,
    MEDIO: sizeIndex.get('MEDIO')?.length || 0,
    GRANDE: sizeIndex.get('GRANDE')?.length || 0,
  };

  const byState: Record<string, number> = {};
  stateIndex.forEach((list, st) => {
    byState[st] = list.length;
  });

  return { total, active, withContracts, totalContracts, bySize, byState };
}

// ─────────────────────────────────────────────────────────────
// LISTS / PIPELINE CRM
// ─────────────────────────────────────────────────────────────
export function getProspectLists(): ProspectList[] {
  return prospectListsStore;
}

export function getProspectListById(id: string): ProspectList | null {
  return prospectListsStore.find(l => l.id === id) || null;
}

export function createProspectList(
  nameOrData: string | { name: string; description?: string; filterCriteria?: any },
  description?: string,
  filterCriteria?: any
): ProspectList {
  let name = '';
  let desc: string | undefined = description;
  let criteria: any = filterCriteria;

  if (typeof nameOrData === 'object' && nameOrData !== null) {
    name = nameOrData.name;
    desc = nameOrData.description;
    criteria = nameOrData.filterCriteria;
  } else {
    name = String(nameOrData);
  }

  const list: ProspectList = {
    id: `list-${Date.now()}`,
    name,
    description: desc,
    filterCriteria: criteria,
    itemsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [],
  };
  prospectListsStore.push(list);
  return list;
}

export function addCompanyToList(
  listId: string,
  companyOrId: Company | string,
  statusOrNotes: ProspectStatus | string = 'NOVO',
  notesOrTags?: string | string[]
): boolean {
  const list = prospectListsStore.find(l => l.id === listId);
  if (!list) return false;
  if (!list.items) list.items = [];

  let targetCompany: Company | undefined;
  if (typeof companyOrId === 'string') {
    const cleanId = companyOrId.replace(/\D/g, '');
    targetCompany = cnpjIndex.get(cleanId) || getCompaniesStore().find(c => c.id === companyOrId);
  } else {
    targetCompany = companyOrId;
  }

  if (!targetCompany) return false;
  
  const exists = list.items.find(i => i.companyId === targetCompany!.id);
  if (exists) return false;

  const status: ProspectStatus = typeof statusOrNotes === 'string' && ['NOVO', 'QUALIFICADO', 'EM_CONTATO', 'PROPOSTA_ENVIADA', 'CONVERTIDO', 'PERDIDO'].includes(statusOrNotes)
    ? (statusOrNotes as ProspectStatus)
    : 'NOVO';

  const notes = typeof notesOrTags === 'string' ? notesOrTags : (typeof statusOrNotes === 'string' && !['NOVO', 'QUALIFICADO', 'EM_CONTATO', 'PROPOSTA_ENVIADA', 'CONVERTIDO', 'PERDIDO'].includes(statusOrNotes) ? statusOrNotes : undefined);

  list.items.push({
    id: `item-${Date.now()}`,
    prospectListId: listId,
    companyId: targetCompany.id,
    company: targetCompany,
    status,
    notes,
    tags: [targetCompany.companySize, targetCompany.state],
    addedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  list.itemsCount = list.items.length;
  list.updatedAt = new Date().toISOString();
  return true;
}

export function updateProspectStatus(listId: string, itemId: string, status: ProspectStatus, notes?: string): boolean {
  const list = prospectListsStore.find(l => l.id === listId);
  if (!list || !list.items) return false;
  const item = list.items.find(i => i.id === itemId);
  if (!item) return false;
  item.status = status;
  if (notes) item.notes = notes;
  item.updatedAt = new Date().toISOString();
  return true;
}

export function removeCompanyFromList(listId: string, itemId: string): boolean {
  const list = prospectListsStore.find(l => l.id === listId);
  if (!list || !list.items) return false;
  list.items = list.items.filter(i => i.id !== itemId);
  list.itemsCount = list.items.length;
  list.updatedAt = new Date().toISOString();
  return true;
}

export function deleteProspectList(listId: string): boolean {
  const initialLen = prospectListsStore.length;
  prospectListsStore = prospectListsStore.filter(l => l.id !== listId);
  return prospectListsStore.length < initialLen;
}

// ─────────────────────────────────────────────────────────────
// PROPOSTAS
// ─────────────────────────────────────────────────────────────
export function getProposals(): Proposal[] {
  return proposalsStore;
}

export function getProposalById(id: string): Proposal | null {
  return proposalsStore.find(p => p.id === id) || null;
}

export function createProposal(data: Partial<Proposal>): Proposal {
  const proposal: Proposal = {
    id: `prop-${Date.now()}`,
    title: data.title || 'Nova Proposta Comercial B2B',
    companyId: data.companyId || '',
    company: data.company,
    status: 'DRAFT',
    sellerCompanyName: data.sellerCompanyName || 'Sua Empresa / Agência B2B',
    sellerRepresentativeName: data.sellerRepresentativeName || 'Agente de Captação',
    sellerEmail: data.sellerEmail || 'comercial@empresa.com.br',
    sellerPhone: data.sellerPhone || '(11) 99999-9999',
    proposedSolution: data.proposedSolution || 'Soluções Integradas de Eficiência Operacional e Gestão',
    proposedValue: data.proposedValue || 0,
    paymentTerms: data.paymentTerms || '12 parcelas mensais ou à vista com 10% de desconto',
    validUntil: data.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    aiGeneratedPitch: data.aiGeneratedPitch || '',
    keyInsights: data.keyInsights || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  proposalsStore.push(proposal);
  return proposal;
}

export function updateProposal(id: string, updates: Partial<Proposal>): Proposal | null {
  const idx = proposalsStore.findIndex(p => p.id === id);
  if (idx === -1) return null;
  proposalsStore[idx] = { ...proposalsStore[idx], ...updates, updatedAt: new Date().toISOString() };
  return proposalsStore[idx];
}
