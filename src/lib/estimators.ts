import { Company, CompanySize, FinancialIndicator, PublicContract, TaxRegime } from '@/types';

export interface CompanyEstimationInput {
  companySize: CompanySize;
  shareCapital: number;
  taxRegime?: TaxRegime;
  activePublicContractsAnnualSum: number;
  primaryCnaeCode?: string;
}

export function calculateFinancialCapacity(input: CompanyEstimationInput): Omit<FinancialIndicator, 'id' | 'companyId' | 'calculatedAt'> {
  let revenueMin = 0;
  let revenueMax = 0;
  let employeesMin = 1;
  let employeesMax = 5;
  const insights: string[] = [];

  // 1. Faixa Base por Porte Empresarial Brasileiro (Norma RFB / Simples Nacional / IBGE)
  switch (input.companySize) {
    case 'MEI':
      revenueMin = 36_000;
      revenueMax = 81_000;
      employeesMin = 1;
      employeesMax = 1;
      break;
    case 'ME':
      revenueMin = 120_000;
      revenueMax = 360_000;
      employeesMin = 2;
      employeesMax = 9;
      break;
    case 'EPP':
      revenueMin = 360_000;
      revenueMax = 4_800_000;
      employeesMin = 10;
      employeesMax = 49;
      break;
    case 'MEDIO':
      revenueMin = 4_800_000;
      revenueMax = 50_000_000;
      employeesMin = 50;
      employeesMax = 249;
      break;
    case 'GRANDE':
      revenueMin = 50_000_000;
      revenueMax = Math.max(180_000_000, input.shareCapital * 2.2);
      employeesMin = 250;
      employeesMax = 1500;
      break;
  }

  // 2. Refinamento por Capital Social
  if (input.shareCapital > 0) {
    if (input.shareCapital > 5_000_000 && input.companySize !== 'GRANDE') {
      revenueMin = Math.max(revenueMin, input.shareCapital * 0.8);
      revenueMax = Math.max(revenueMax, input.shareCapital * 2.5);
      insights.push(`Capital social expressivo (R$ ${input.shareCapital.toLocaleString('pt-BR')}) eleva a capacidade presumida de giro.`);
    } else if (input.shareCapital > 500_000 && (input.companySize === 'ME' || input.companySize === 'EPP')) {
      revenueMin = Math.max(revenueMin, input.shareCapital * 0.9);
      insights.push(`Estrutura patrimonial sólida para o enquadramento de porte.`);
    }
  }

  // 3. Impacto de Contratos Públicos Vigentes (PNCP / Transparência)
  const contractsSum = input.activePublicContractsAnnualSum || 0;
  if (contractsSum > 0) {
    // A receita da empresa deve contemplar integralmente os contratos ganhos + estimativa de clientes privados
    const contractsMultiplier = contractsSum > 2_000_000 ? 1.25 : 1.45;
    revenueMin = Math.max(revenueMin, contractsSum * 1.1);
    revenueMax = Math.max(revenueMax, contractsSum * contractsMultiplier);
    
    insights.push(`Fornecedora pública ativa: R$ ${contractsSum.toLocaleString('pt-BR')} em contratos governamentais vigentes neste ciclo.`);
  }

  // 4. Cálculo de Score de Capacidade Financeira (0 - 100)
  let score = 25; // Base inicial

  if (input.companySize === 'ME') score += 15;
  if (input.companySize === 'EPP') score += 30;
  if (input.companySize === 'MEDIO') score += 50;
  if (input.companySize === 'GRANDE') score += 65;

  if (contractsSum > 100_000) score += 10;
  if (contractsSum > 1_000_000) score += 15;
  if (contractsSum > 5_000_000) score += 20;

  if (input.shareCapital > 1_000_000) score += 10;

  // Normalização
  score = Math.min(100, Math.max(10, score));

  // 5. Nível de Risco e Confiabilidade Comercial
  let riskLevel: 'BAIXO' | 'MEDIO' | 'ALTO' = 'MEDIO';
  if (score >= 70) riskLevel = 'BAIXO';
  else if (score < 40) riskLevel = 'ALTO';

  // 6. Dimensionamento de Ticket Sugerido
  // Modelo SaaS / Serviços B2B: 0.4% a 2.5% do faturamento mensal estimado
  const monthlyRevenueMin = revenueMin / 12;
  const monthlyRevenueMax = revenueMax / 12;

  const suggestedMonthlyTicketMin = Math.max(500, Math.round(monthlyRevenueMin * 0.006));
  const suggestedMonthlyTicketMax = Math.max(1500, Math.round(monthlyRevenueMax * 0.022));

  // Modelo Pontual / Consultoria / Implantação: 2% a 6% do faturamento anual estimado
  const suggestedOneOffTicketMin = Math.max(2500, Math.round(revenueMin * 0.018));
  const suggestedOneOffTicketMax = Math.max(8000, Math.round(revenueMax * 0.055));

  if (contractsSum > 0) {
    insights.push(`Recomendado ofertar planos com pagamento atrelado ao cronograma físico-financeiro de licitações.`);
  }

  return {
    taxRegime: input.taxRegime || 'UNKNOWN',
    estimatedAnnualRevenueMin: Math.round(revenueMin),
    estimatedAnnualRevenueMax: Math.round(revenueMax),
    estimatedEmployeeCountMin: employeesMin,
    estimatedEmployeeCountMax: employeesMax,
    financialCapacityScore: score,
    suggestedMonthlyTicketMin,
    suggestedMonthlyTicketMax,
    suggestedOneOffTicketMin,
    suggestedOneOffTicketMax,
    publicContractsVolumeTotal: contractsSum,
    riskLevel,
    insights,
  };
}

export function generatePitchRationale(
  company: Company,
  contracts: PublicContract[],
  serviceName: string = 'Solução Corporativa'
): string {
  const activeContracts = contracts.filter((c) => c.status === 'VIGENTE');
  const totalGovVolume = activeContracts.reduce((acc, curr) => acc + curr.totalValue, 0);
  const mainAgency = activeContracts[0]?.buyerAgency || 'órgãos governamentais';

  let pitch = `Abordagem estratégica para a ${company.tradeName || company.legalName}:\n\n`;

  pitch += `1. **Contexto & Validação:** Identificamos que a empresa possui sólida atuação no setor de ${company.primaryCnaeDesc} em ${company.city}/${company.state}`;

  if (totalGovVolume > 0) {
    pitch += `, com contratos públicos ativos somando mais de R$ ${(totalGovVolume / 1_000_000).toFixed(2)} milhões (destaque para fornecimento junto ao ${mainAgency}).\n\n`;
  } else {
    pitch += ` com capital social registrado de R$ ${company.shareCapital.toLocaleString('pt-BR')}.\n\n`;
  }

  pitch += `2. **Proposta de Valor:** Apresentar a implementação de ${serviceName} focada em otimizar a eficiência operacional, garantir conformidade com as exigências técnicas de novos certames e potencializar a margem líquida dos projetos.\n\n`;

  pitch += `3. **Alavanca Comercial:** O ticket proposto encontra-se 100% alinhado à sua capacidade de investimento estimada (faixa de faturamento anual entre R$ ${(company.financialIndicators.estimatedAnnualRevenueMin / 1_000_000).toFixed(1)}M e R$ ${(company.financialIndicators.estimatedAnnualRevenueMax / 1_000_000).toFixed(1)}M), gerando payback acelerado no curto prazo.`;

  return pitch;
}
