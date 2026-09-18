'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Company } from '@/types';
import {
  formatCNPJ,
  formatCompactCurrency,
  getCompanySizeBadgeColor,
  getScoreColor,
} from '@/lib/utils';
import {
  Building2,
  Landmark,
  ShieldCheck,
  TrendingUp,
  FileText,
  Calculator,
  ExternalLink,
  Plus,
  Check,
  Sparkles,
  RotateCcw,
  Phone,
  Mail,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ContactModal } from './ContactModal';

interface CompanyTableProps {
  companies: Company[];
  loading?: boolean;
  total?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onAddToList?: (company: Company) => void;
  onResetFilters?: () => void;
}

export function CompanyTable({ companies, loading, total, page = 1, totalPages = 1, onPageChange, onAddToList, onResetFilters }: CompanyTableProps) {
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [selectedCompanyContact, setSelectedCompanyContact] = useState<Company | null>(null);

  const handleAdd = (company: Company) => {
    if (onAddToList) {
      onAddToList(company);
    }
    setAddedIds((prev) => ({ ...prev, [company.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [company.id]: false }));
    }, 2500);
  };

  if (companies.length === 0) {
    return (
      <div className="bg-[#111622] border border-[#1e293b] rounded-2xl p-12 text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
          <Building2 className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">Nenhuma empresa encontrada com estes critérios</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto leading-relaxed">
            Experimente selecionar outros portes empresariais (ex: ME, EPP ou Grande), remover o filtro específico de CNAE ou ampliar a localização.
          </p>
        </div>

        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Redefinir Todos os Filtros</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#111622] border border-[#1e293b] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0e131f] border-b border-[#1e293b] text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Empresa / CNPJ</th>
                <th className="py-3.5 px-4">Setor & Porte</th>
                <th className="py-3.5 px-4">Faturamento Estimado</th>
                <th className="py-3.5 px-4">Contratos Públicos</th>
                <th className="py-3.5 px-4">Contato / Titular</th>
                <th className="py-3.5 px-4 text-center">Score</th>
                <th className="py-3.5 px-4 text-right">Ações Estratégicas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b] text-xs">
              {companies.map((c) => {
                const scoreStyle = getScoreColor(c.financialIndicators.financialCapacityScore);
                const activeContracts = c.publicContracts.filter((pc) => pc.status === 'VIGENTE');
                const totalContractsValue = activeContracts.reduce((sum, item) => sum + item.totalValue, 0);
                const isAdded = !!addedIds[c.id];
                const titular = c.partners[0]?.name || 'Titular / Sócio';

                return (
                  <tr key={c.id} className="hover:bg-[#151c2c] transition-colors group">
                    {/* Empresa / CNPJ */}
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center text-indigo-300 shrink-0 font-bold text-xs mt-0.5">
                          {c.tradeName ? c.tradeName.slice(0, 2).toUpperCase() : c.legalName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => setSelectedCompanyContact(c)}
                            className="font-semibold text-white hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-left"
                          >
                            <span>{c.tradeName || c.legalName}</span>
                          </button>
                          <p className="text-[11px] text-zinc-400 line-clamp-1">{c.legalName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-[11px] text-zinc-400 bg-[#0a0d14] px-1.5 py-0.5 rounded border border-[#1e293b]">
                              {formatCNPJ(c.cnpj)}
                            </span>
                            <span className="text-[11px] text-zinc-400">
                              {c.city}/{c.state}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Setor & Porte */}
                    <td className="py-4 px-4">
                      <div className="space-y-1.5">
                        <span
                          className={cn(
                            'inline-block px-2 py-0.5 rounded text-[10px] font-semibold border',
                            getCompanySizeBadgeColor(c.companySize)
                          )}
                        >
                          {c.companySize}
                        </span>
                        <p className="text-[11px] text-zinc-300 font-medium line-clamp-1" title={c.primaryCnaeDesc}>
                          {c.primaryCnaeDesc}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono">CNAE {c.primaryCnaeCode}</p>
                      </div>
                    </td>

                    {/* Faturamento Estimado */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <p className="font-bold text-white text-xs">
                          {formatCompactCurrency(c.financialIndicators.estimatedAnnualRevenueMin)} –{' '}
                          {formatCompactCurrency(c.financialIndicators.estimatedAnnualRevenueMax)}
                          <span className="text-[10px] text-zinc-400 font-normal"> /ano</span>
                        </p>
                        <p className="text-[10px] text-zinc-400">
                          Cap. Social: {formatCompactCurrency(c.shareCapital)}
                        </p>
                        <div className="text-[10px] text-indigo-400 font-medium flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Ticket ideal: {formatCompactCurrency(c.financialIndicators.suggestedMonthlyTicketMin)}/mês</span>
                        </div>
                      </div>
                    </td>

                    {/* Contratos Públicos */}
                    <td className="py-4 px-4">
                      {activeContracts.length > 0 ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="font-bold text-emerald-300 text-xs">
                              {formatCompactCurrency(totalContractsValue)}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 line-clamp-1 font-medium">
                            {activeContracts[0].buyerAgency}
                          </p>
                          <span className="inline-block text-[10px] bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                            {activeContracts.length} contrato(s) ativo(s)
                          </span>
                        </div>
                      ) : (
                        <span className="text-zinc-500 text-[11px] italic">Sem contratos gov</span>
                      )}
                    </td>

                    {/* Contato / Titular (Quick Click) */}
                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={() => setSelectedCompanyContact(c)}
                        className="text-left group/btn p-2 rounded-lg bg-[#0a0d14] border border-[#1e293b] hover:border-emerald-500/50 hover:bg-[#131b29] transition-all w-full max-w-[200px]"
                      >
                        <div className="flex items-center gap-1.5 text-zinc-200 font-semibold text-[11px] line-clamp-1">
                          <User className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span className="truncate">{titular}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] mt-1">
                          <Phone className="w-3 h-3 shrink-0" />
                          <span>{c.phone || '(84) 98800-0000'}</span>
                        </div>
                      </button>
                    </td>

                    {/* Score */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <div
                          className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border shadow-inner',
                            scoreStyle.bg,
                            scoreStyle.text,
                            scoreStyle.border
                          )}
                        >
                          {c.financialIndicators.financialCapacityScore}
                        </div>
                      </div>
                    </td>

                    {/* Ações Estratégicas */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedCompanyContact(c)}
                          title="Ver Contatos e WhatsApp"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Contatos</span>
                        </button>

                        <Link
                          href={`/company/${c.cnpj}`}
                          title="Ver Dossiê 360"
                          className="px-2.5 py-1.5 rounded-lg bg-[#161e2e] border border-[#1e293b] text-zinc-300 hover:text-white hover:border-indigo-500 hover:bg-indigo-600/20 text-xs font-medium transition-all"
                        >
                          Dossiê
                        </Link>

                        <Link
                          href={`/proposals?cnpj=${c.cnpj}`}
                          title="Gerar Proposta Comercial"
                          className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleAdd(c)}
                          title="Salvar na Lista de Leads"
                          className={cn(
                            'p-1.5 rounded-lg border text-xs font-medium transition-all',
                            isAdded
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-[#161e2e] border-[#1e293b] text-zinc-400 hover:text-white hover:border-cyan-500'
                          )}
                        >
                          {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && onPageChange && (
          <div className="p-4 border-t border-[#1e293b] bg-[#0c101a] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p className="text-zinc-400">
              Página <strong className="text-white">{page}</strong> de <strong className="text-white">{totalPages}</strong>
              {total ? ` (${total} empresas)` : ""}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => onPageChange(page - 1)}
                className="px-3 py-1.5 rounded-lg bg-[#141a27] border border-[#1e293b] text-zinc-300 hover:text-white hover:border-indigo-500 disabled:opacity-40 disabled:pointer-events-none transition-all"
              >
                Anterior
              </button>
              <span className="px-2 font-bold text-indigo-400">{page}</span>
              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => onPageChange(page + 1)}
                className="px-3 py-1.5 rounded-lg bg-[#141a27] border border-[#1e293b] text-zinc-300 hover:text-white hover:border-indigo-500 disabled:opacity-40 disabled:pointer-events-none transition-all"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Contact Modal */}
      {selectedCompanyContact && (
        <ContactModal
          company={selectedCompanyContact}
          onClose={() => setSelectedCompanyContact(null)}
        />
      )}
    </>
  );
}
