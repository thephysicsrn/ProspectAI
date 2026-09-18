'use client';

import React, { useState, useEffect } from 'react';
import { Company, CompanySize, TaxRegime } from '@/types';
import { calculateFinancialCapacity } from '@/lib/estimators';
import {
  formatCurrency,
  formatCompactCurrency,
  getScoreColor,
} from '@/lib/utils';
import {
  Calculator,
  Sparkles,
  TrendingUp,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface TicketCalculatorWidgetProps {
  initialCompany?: Company;
  allCompanies?: Company[];
}

export function TicketCalculatorWidget({
  initialCompany,
  allCompanies = [],
}: TicketCalculatorWidgetProps) {
  const [selectedCnpj, setSelectedCnpj] = useState<string>(initialCompany?.cnpj || '');
  const [companySize, setCompanySize] = useState<CompanySize>(initialCompany?.companySize || 'EPP');
  const [shareCapital, setShareCapital] = useState<number>(initialCompany?.shareCapital || 500000);
  const [govContracts, setGovContracts] = useState<number>(
    initialCompany?.publicContracts
      ? initialCompany.publicContracts.reduce((s, c) => s + c.totalValue, 0)
      : 1200000
  );
  const [taxRegime, setTaxRegime] = useState<TaxRegime>(
    initialCompany?.financialIndicators?.taxRegime || 'SIMPLES_NACIONAL'
  );

  // When company changes from dropdown
  useEffect(() => {
    if (selectedCnpj && allCompanies.length > 0) {
      const comp = allCompanies.find((c) => c.cnpj === selectedCnpj);
      if (comp) {
        setCompanySize(comp.companySize);
        setShareCapital(comp.shareCapital);
        const totalContracts = comp.publicContracts.reduce((s, c) => s + c.totalValue, 0);
        setGovContracts(totalContracts);
        setTaxRegime(comp.financialIndicators.taxRegime);
      }
    }
  }, [selectedCnpj, allCompanies]);

  const estimation = calculateFinancialCapacity({
    companySize,
    shareCapital,
    activePublicContractsAnnualSum: govContracts,
    taxRegime,
  });

  const scoreStyle = getScoreColor(estimation.financialCapacityScore);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Form: Inputs & Parameters */}
      <div className="lg:col-span-5 bg-[#111622] border border-[#1e293b] rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#1e293b]">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Parâmetros do Prospect</h2>
            <p className="text-[11px] text-zinc-400">Ajuste os dados cadastrais e contratos</p>
          </div>
        </div>

        {/* Optional: Select Existing Company */}
        {allCompanies.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Carregar dados de empresa existente</label>
            <select
              value={selectedCnpj}
              onChange={(e) => setSelectedCnpj(e.target.value)}
              className="w-full bg-[#0a0d14] border border-[#1e293b] text-xs text-white px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Inserção Manual Livre --</option>
              {allCompanies.map((c) => (
                <option key={c.id} value={c.cnpj}>
                  {c.tradeName || c.legalName} ({c.companySize} - {c.city}/{c.state})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Company Size */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">Porte Empresarial (Enquadramento)</label>
          <div className="grid grid-cols-5 gap-1.5">
            {(['MEI', 'ME', 'EPP', 'MEDIO', 'GRANDE'] as CompanySize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  setCompanySize(size);
                  setSelectedCnpj('');
                }}
                className={cn(
                  'py-2 text-xs font-bold rounded-lg border transition-all',
                  companySize === size
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-[#0a0d14] border-[#1e293b] text-zinc-400 hover:text-zinc-200'
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Capital Social Slider & Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-zinc-300">Capital Social Registrado</span>
            <span className="font-mono text-cyan-400 font-bold">{formatCurrency(shareCapital)}</span>
          </div>
          <input
            type="range"
            min={10000}
            max={20000000}
            step={50000}
            value={shareCapital}
            onChange={(e) => {
              setShareCapital(Number(e.target.value));
              setSelectedCnpj('');
            }}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* Volume de Contratos Públicos */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5 text-emerald-400" />
              Contratos Governamentais Vigentes (Ano)
            </span>
            <span className="font-mono text-emerald-400 font-bold">{formatCurrency(govContracts)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={50000000}
            step={100000}
            value={govContracts}
            onChange={(e) => {
              setGovContracts(Number(e.target.value));
              setSelectedCnpj('');
            }}
            className="w-full accent-emerald-400 cursor-pointer"
          />
          <p className="text-[11px] text-zinc-500">
            Contratos ativos em órgãos federais, estaduais ou municipais (PNCP).
          </p>
        </div>

        {/* Regime Tributário */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">Regime Tributário Estimado</label>
          <select
            value={taxRegime}
            onChange={(e) => setTaxRegime(e.target.value as TaxRegime)}
            className="w-full bg-[#0a0d14] border border-[#1e293b] text-xs text-white px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
          >
            <option value="SIMPLES_NACIONAL">Simples Nacional (Até R$ 4.8M)</option>
            <option value="LUCRO_PRESUMIDO">Lucro Presumido (Até R$ 78M)</option>
            <option value="LUCRO_REAL">Lucro Real (Acima de R$ 78M / Financeiro)</option>
            <option value="MEI">Microempreendedor Individual (MEI)</option>
          </select>
        </div>
      </div>

      {/* Right Results: Calculation Output & Sizing */}
      <div className="lg:col-span-7 space-y-6">
        {/* Score & Capacity Highlight */}
        <div className="bg-[#111622] border border-[#1e293b] rounded-2xl p-6 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#1e293b]">
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Diagnóstico de Capacidade Financeira
              </span>
              <h3 className="text-xl font-black text-white mt-1">
                Faturamento Presumido: {formatCompactCurrency(estimation.estimatedAnnualRevenueMin)} a{' '}
                {formatCompactCurrency(estimation.estimatedAnnualRevenueMax)} / ano
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Estimativa de colaboradores: {estimation.estimatedEmployeeCountMin} a {estimation.estimatedEmployeeCountMax} pessoas
              </p>
            </div>

            <div className="flex items-center gap-3 bg-[#0a0d14] p-3 rounded-xl border border-[#1e293b]">
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border',
                  scoreStyle.bg,
                  scoreStyle.text,
                  scoreStyle.border
                )}
              >
                {estimation.financialCapacityScore}
              </div>
              <div>
                <p className="text-[10px] text-zinc-400 uppercase font-bold">Score de Saúde</p>
                <p className={cn('text-xs font-black', scoreStyle.text)}>Risco {estimation.riskLevel}</p>
              </div>
            </div>
          </div>

          {/* Sizing Recommendations: Monthly Ticket vs One-Off */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {/* Monthly Retainer / SaaS */}
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between text-indigo-300 text-xs font-bold">
                <span>Mensalidade Sugerida (SaaS / Fee)</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-black text-white">
                {formatCurrency(estimation.suggestedMonthlyTicketMin)} – {formatCurrency(estimation.suggestedMonthlyTicketMax)}
                <span className="text-xs font-normal text-zinc-400"> /mês</span>
              </p>
              <p className="text-[11px] text-zinc-400">
                Calculado com base em 0.5% - 2.2% do fluxo de caixa mensal estimado.
              </p>
            </div>

            {/* Project / One-off */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between text-cyan-300 text-xs font-bold">
                <span>Projeto Pontual / Implantação</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-white">
                {formatCurrency(estimation.suggestedOneOffTicketMin)} – {formatCurrency(estimation.suggestedOneOffTicketMax)}
              </p>
              <p className="text-[11px] text-zinc-400">
                Ideal para contratos fechados com escopo definido e entregáveis.
              </p>
            </div>
          </div>
        </div>

        {/* Strategic Insights */}
        <div className="bg-[#111622] border border-[#1e293b] rounded-2xl p-6 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Insights Acionáveis para a Abordagem de Vendas
          </h4>

          <div className="space-y-2.5">
            {estimation.insights.map((ins, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#0a0d14] border border-[#1e293b] text-xs text-zinc-300 flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span>{ins}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1e293b] flex justify-end">
            <Link
              href={
                selectedCnpj
                  ? `/proposals?cnpj=${selectedCnpj}`
                  : `/proposals?value=${estimation.suggestedMonthlyTicketMin}`
              }
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Gerar Proposta com estes Valores</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
