/**
 * Mapeamento completo de CNAEs Brasileiros (Classificação Nacional de Atividades Econômicas)
 * Baseado na tabela CNAE 2.3 da CONCLA/IBGE
 */

export interface CnaeEntry {
  code: string;
  numeric: string;
  description: string;
  section: string;
  division: string;
}

export const CNAE_SECTIONS: Record<string, string> = {
  A: 'Agricultura, Pecuária, Produção Florestal, Pesca e Aquicultura',
  B: 'Indústrias Extrativas',
  C: 'Indústrias de Transformação',
  D: 'Eletricidade e Gás',
  E: 'Água, Esgoto, Atividades de Gestão de Resíduos e Descontaminação',
  F: 'Construção',
  G: 'Comércio; Reparação de Veículos Automotores e Motocicletas',
  H: 'Transporte, Armazenagem e Correio',
  I: 'Alojamento e Alimentação',
  J: 'Informação e Comunicação',
  K: 'Atividades Financeiras, de Seguros e Serviços Relacionados',
  L: 'Atividades Imobiliárias',
  M: 'Atividades Profissionais, Científicas e Técnicas',
  N: 'Atividades Administrativas e Serviços Complementares',
  O: 'Administração Pública, Defesa e Seguridade Social',
  P: 'Educação',
  Q: 'Saúde Humana e Serviços Sociais',
  R: 'Artes, Cultura, Esporte e Recreação',
  S: 'Outras Atividades de Serviços',
  T: 'Serviços Domésticos',
  U: 'Organismos Internacionais e Outras Instituições Extraterritoriais',
};

export const TOP_CNAES_PROSPECTING: CnaeEntry[] = [
  { code: '6201-5/01', numeric: '6201501', description: 'Desenvolvimento de Programas de Computador sob Encomenda', section: 'J', division: '62' },
  { code: '6201-5/02', numeric: '6201502', description: 'Web Design', section: 'J', division: '62' },
  { code: '6202-3/00', numeric: '6202300', description: 'Desenvolvimento e Licenciamento de Programas de Computador', section: 'J', division: '62' },
  { code: '6203-1/00', numeric: '6203100', description: 'Desenvolvimento e Licenciamento de Programas de Computador não-Customizáveis', section: 'J', division: '62' },
  { code: '6204-0/00', numeric: '6204000', description: 'Consultoria em Tecnologia da Informação', section: 'J', division: '62' },
  { code: '6209-1/00', numeric: '6209100', description: 'Suporte Técnico, Manutenção e Outros Serviços em TI', section: 'J', division: '62' },
  { code: '6311-9/00', numeric: '6311900', description: 'Tratamento de Dados, Provedores de Serviços de Aplicação e Serviços de Hospedagem', section: 'J', division: '63' },
  { code: '6319-4/00', numeric: '6319400', description: 'Portais, Provedores de Conteúdo e Outros Serviços de Informação na Internet', section: 'J', division: '63' },
  { code: '4120-4/00', numeric: '4120400', description: 'Construção de Edifícios', section: 'F', division: '41' },
  { code: '4211-1/01', numeric: '4211101', description: 'Construção de Rodovias e Ferrovias', section: 'F', division: '42' },
  { code: '4212-0/00', numeric: '4212000', description: 'Construção de Obras de Arte Especiais', section: 'F', division: '42' },
  { code: '4213-8/00', numeric: '4213800', description: 'Obras de Urbanização – Ruas, Praças e Calçadas', section: 'F', division: '42' },
  { code: '4222-7/01', numeric: '4222701', description: 'Construção de Redes de Abastecimento de Água, Coleta de Esgoto e Construções Correlatas', section: 'F', division: '42' },
  { code: '4291-0/00', numeric: '4291000', description: 'Obras Portuárias, Marítimas e Fluviais', section: 'F', division: '42' },
  { code: '4321-5/00', numeric: '4321500', description: 'Instalação e Manutenção Elétrica', section: 'F', division: '43' },
  { code: '8610-1/01', numeric: '8610101', description: 'Atividades de Atendimento Hospitalar', section: 'Q', division: '86' },
  { code: '8630-5/01', numeric: '8630501', description: 'Atividade Médica Ambulatorial com Recursos para Realização de Procedimentos Cirúrgicos', section: 'Q', division: '86' },
  { code: '4644-3/01', numeric: '4644301', description: 'Comércio Atacadista de Medicamentos e Drogas de Uso Humano', section: 'G', division: '46' },
  { code: '8511-2/00', numeric: '8511200', description: 'Educação Infantil - Creche', section: 'P', division: '85' },
  { code: '8521-0/00', numeric: '8521000', description: 'Educação Superior - Graduação', section: 'P', division: '85' },
  { code: '8599-6/04', numeric: '8599604', description: 'Treinamento em Desenvolvimento Profissional e Gerencial', section: 'P', division: '85' },
  { code: '8121-4/00', numeric: '8121400', description: 'Limpeza em Prédios e em Domicílios', section: 'N', division: '81' },
  { code: '8011-1/01', numeric: '8011101', description: 'Atividades de Vigilância e Segurança Privada', section: 'N', division: '80' },
  { code: '8020-0/01', numeric: '8020001', description: 'Atividades de Monitoramento de Sistemas de Segurança Eletrônica', section: 'N', division: '80' },
  { code: '7020-4/00', numeric: '7020400', description: 'Atividades de Consultoria em Gestão Empresarial', section: 'M', division: '70' },
  { code: '6920-6/01', numeric: '6920601', description: 'Atividades de Contabilidade', section: 'M', division: '69' },
  { code: '6911-7/01', numeric: '6911701', description: 'Serviços Advocatícios', section: 'M', division: '69' },
  { code: '7111-1/00', numeric: '7111100', description: 'Serviços de Arquitetura', section: 'M', division: '71' },
  { code: '7112-0/00', numeric: '7112000', description: 'Serviços de Engenharia', section: 'M', division: '71' },
  { code: '4930-2/01', numeric: '4930201', description: 'Transporte Rodoviário de Carga', section: 'H', division: '49' },
  { code: '4921-3/01', numeric: '4921301', description: 'Transporte Rodoviário Coletivo de Passageiros', section: 'H', division: '49' },
  { code: '5620-1/04', numeric: '5620104', description: 'Fornecimento de Alimentos Preparados Preponderantemente para Empresas', section: 'I', division: '56' },
  { code: '3511-5/01', numeric: '3511501', description: 'Geração de Energia Elétrica a partir de Fonte Solar Fotovoltaica', section: 'D', division: '35' },
  { code: '3600-6/01', numeric: '3600601', description: 'Captação, Tratamento e Distribuição de Água', section: 'E', division: '36' },
  { code: '4663-0/00', numeric: '4663000', description: 'Comércio Atacadista de Máquinas e Equipamentos', section: 'G', division: '46' },
  { code: '3312-1/02', numeric: '3312102', description: 'Manutenção e Reparação de Aparelhos e Instrumentos de Medida e Teste', section: 'C', division: '33' },
];

export const CNAE_BY_NUMERIC: Record<string, CnaeEntry> = {};
TOP_CNAES_PROSPECTING.forEach(c => {
  CNAE_BY_NUMERIC[c.numeric] = c;
  CNAE_BY_NUMERIC[c.code.replace(/\D/g, '')] = c;
});

export function getCnaeDescription(numericCode: string | number): string {
  const str = String(numericCode).replace(/\D/g, '');
  return CNAE_BY_NUMERIC[str]?.description || CNAE_BY_NUMERIC[str.slice(0, 6)]?.description || 'Atividade Econômica';
}

export const CNAE_MARKET_GROUPS: Record<string, { label: string; icon: string; cnaes: string[] }> = {
  TI: { label: 'TI & Software', icon: '💻', cnaes: ['6201501', '6201502', '6202300', '6203100', '6204000', '6209100', '6311900', '6319400'] },
  ENGENHARIA: { label: 'Engenharia & Construção', icon: '🏗️', cnaes: ['4120400', '4211101', '4212000', '4213800', '4222701', '4291000', '4321500', '7112000', '7111100'] },
  SAUDE: { label: 'Saúde & Farmácia', icon: '🏥', cnaes: ['8610101', '8630501', '4644301'] },
  EDUCACAO: { label: 'Educação & Treinamento', icon: '🎓', cnaes: ['8511200', '8521000', '8599604'] },
  SERVICOS_GOV: { label: 'Serviços para Governo', icon: '🏛️', cnaes: ['8121400', '8011101', '8020001', '5620104'] },
  CONSULTORIA: { label: 'Consultoria & Auditoria', icon: '📊', cnaes: ['7020400', '6920601', '6911701'] },
  TRANSPORTE: { label: 'Transporte & Logística', icon: '🚛', cnaes: ['4921301', '4930201'] },
  ENERGIA: { label: 'Energia & Saneamento', icon: '⚡', cnaes: ['3511501', '3600601'] },
};
