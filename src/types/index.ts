export type CompanySize = 'MEI' | 'ME' | 'EPP' | 'MEDIO' | 'GRANDE';

export type TaxRegime = 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL' | 'MEI' | 'UNKNOWN';

export type ContractStatus = 'VIGENTE' | 'ENCERRADO' | 'CANCELADO' | 'SUSPENSO';

export type ProspectStatus = 'NOVO' | 'QUALIFICADO' | 'EM_CONTATO' | 'PROPOSTA_ENVIADA' | 'CONVERTIDO' | 'PERDIDO';

export type ProposalStatus = 'DRAFT' | 'GENERATED' | 'SENT' | 'ACCEPTED' | 'REJECTED';

export interface CompanyPartner {
  id: string;
  name: string;
  document?: string;
  role: string;
  startDate?: string;
}

export interface PublicContract {
  id: string;
  companyId: string;
  contractNumber: string;
  buyerAgency: string;
  buyerUf: string;
  modality: string;
  object: string;
  category: 'TI & Software' | 'Engenharia & Obras' | 'Saúde & Medicamentos' | 'Consultoria & Treinamento' | 'Serviços Terceirizados' | 'Alimentação & Logística' | 'Outros';
  totalValue: number;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  sourceUrl?: string;
  sourceSystem: string;
}

export interface FinancialIndicator {
  id: string;
  companyId: string;
  taxRegime: TaxRegime;
  estimatedAnnualRevenueMin: number;
  estimatedAnnualRevenueMax: number;
  estimatedEmployeeCountMin: number;
  estimatedEmployeeCountMax: number;
  financialCapacityScore: number;
  suggestedMonthlyTicketMin: number;
  suggestedMonthlyTicketMax: number;
  suggestedOneOffTicketMin: number;
  suggestedOneOffTicketMax: number;
  publicContractsVolumeTotal: number;
  calculatedAt: string;
  riskLevel: 'BAIXO' | 'MEDIO' | 'ALTO';
  insights: string[];
}

export interface FiscalData {
  taxRegime: TaxRegime;
  taxRegimeDescription: string;
  isSimplesNacional: boolean;
  simplesOptInDate?: string;
  isSimei: boolean;
  simeiOptInDate?: string;
  federalTaxDebtStatus: 'REGULAR' | 'PENDENTE';
  cndFederal: 'VÁLIDA / EMITIDA' | 'PENDENTE';
  cndFgts: 'REGULAR (CRF ATIVO)' | 'PENDENTE';
  cndTrabalhista: 'CERTIDÃO NEGATIVA (CNDT VÁLIDA)' | 'PENDENTE';
  stateRegistration?: string;
  municipalRegistration?: string;
  employeeCountDeclared: number;
  employeeRangeDescription: string;
  estimatedPayrollMonthly: number;
  dasnStatus?: 'ENTREGUE / REGULAR' | 'PENDENTE';
}

export interface Company {
  id: string;
  cnpj: string;
  legalName: string;
  tradeName?: string;
  status: 'ATIVA' | 'BAIXADA' | 'INAPTA' | 'SUSPENSA';
  registrationDate: string;

  // CNAE (supports both old and new field names)
  primaryCnaeCode: string;
  primaryCnaeDesc: string;
  secondaryCnaes?: Array<{ code: string; desc: string }>;

  legalNature?: string;
  companySize: CompanySize;
  shareCapital: number;

  // Location
  state: string;
  city: string;
  neighborhood?: string;
  zipCode?: string;
  street?: string;
  number?: string;

  // Contact
  email?: string;
  phone?: string;
  website?: string;
  whatsapp?: string;
  mapsUrl?: string;

  // Relations
  partners: CompanyPartner[];
  financialIndicators: FinancialIndicator;
  fiscalData: FiscalData;
  publicContracts: PublicContract[];

  // Computed aggregates
  hasPublicContracts: boolean;
  totalContractsVolume: number;
  activeContractsCount: number;
  lastContractDate?: string;
  capacityScore: number;

  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  query?: string;
  state?: string;
  city?: string;
  cnae?: string;
  companySize?: CompanySize[];
  minShareCapital?: number;
  maxShareCapital?: number;
  minRevenue?: number;
  maxRevenue?: number;
  hasPublicContracts?: boolean;
  minContractsVolume?: number;
  minScore?: number;
  taxRegime?: TaxRegime[];
  status?: string;
  sortBy?: 'revenue' | 'contracts' | 'capital' | 'score' | 'name' | 'date' | 'size';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
  limit?: number;
}

export interface ProspectListItem {
  id: string;
  prospectListId: string;
  companyId: string;
  company: Company;
  status: ProspectStatus;
  notes?: string;
  tags: string[];
  addedAt: string;
  updatedAt: string;
}

export interface ProspectList {
  id: string;
  name: string;
  description?: string;
  filterCriteria?: SearchFilters;
  itemsCount: number;
  items?: ProspectListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ProposalItem {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Proposal {
  id: string;
  companyId: string;
  company?: Company;
  companyName?: string;
  companyCnpj?: string;
  title: string;
  status: ProposalStatus;
  sellerCompanyName?: string;
  sellerRepresentativeName?: string;
  sellerEmail?: string;
  sellerPhone?: string;
  proposedSolution?: string;
  proposedValue: number;
  paymentTerms?: string;
  pricingModel?: 'MENSAL' | 'PONTUAL' | 'HIBRIDO';
  items?: ProposalItem[];
  pitchRationale?: string;
  aiGeneratedPitch?: string;
  keyInsights?: string[];
  clientContext?: {
    estimatedRevenue: string;
    contractsSummary: string;
    financialScore: number;
    suggestedTicket: string;
  };
  termsAndConditions?: string;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
}
