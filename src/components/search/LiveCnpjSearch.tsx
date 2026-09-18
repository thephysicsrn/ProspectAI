'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Company, CompanySize } from '@/types';
import { formatCNPJ } from '@/lib/utils';
import {
  Search, Loader2, Building2, MapPin, ExternalLink,
  Zap, AlertCircle, ShieldCheck, Phone, CheckCircle2
} from 'lucide-react';

const SIZE_COLORS: Record<string, string> = {
  MEI: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  ME: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  EPP: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  MEDIO: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  GRANDE: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
};

export function LiveCnpjSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Company | null>(null);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setQuery(raw);
    setResult(null);
    setError('');
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const clean = query.replace(/\D/g, '');
    if (clean.length !== 14) {
      setError('Digite um CNPJ completo com 14 dígitos.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // 1. Tenta buscar na API local / enriquecimento
      const res = await fetch(`/api/companies/${clean}`);
      if (res.ok) {
        const company: Company = await res.json();
        setResult(company);
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.error || 'CNPJ não encontrado na Receita Federal.');
      }
    } catch {
      setError('Erro de conexão com o servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const sizeLabel: Record<CompanySize, string> = {
    MEI: 'MEI', ME: 'Micro (ME)', EPP: 'Pequena (EPP)', MEDIO: 'Média Empresa', GRANDE: 'Grande Porte',
  };

  return (
    <div className="space-y-4">
      {/* Barra de Pesquisa */}
      <form onSubmit={handleSearch} className="relative flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={formatCNPJ(query)}
            onChange={handleInput}
            placeholder="Digite qualquer CNPJ do Brasil (ex: 00.000.000/0001-00)"
            maxLength={18}
            className="w-full bg-[#0a0d14] border border-[#1e293b] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 text-white text-sm pl-10 pr-4 py-3 rounded-xl transition-all placeholder:text-zinc-600 outline-none font-mono"
          />
          {loading && (
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
          )}
        </div>
        <button
          type="submit"
          disabled={loading || query.length < 14}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-40 transition-all shadow-lg shadow-indigo-500/20 shrink-0"
        >
          <Zap className="w-4 h-4" />
          <span>Consultar Receita Federal</span>
        </button>
      </form>

      {/* Erro */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-sm text-rose-300 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Resultado */}
      {result && (
        <div className="p-6 rounded-2xl bg-[#0e131f] border border-[#1e293b] hover:border-indigo-500/40 transition-all space-y-4 animate-in fade-in duration-200 shadow-xl">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600/30 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base leading-tight">{result.legalName}</h3>
                {result.tradeName && (
                  <p className="text-xs text-zinc-400 mt-0.5">{result.tradeName}</p>
                )}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${result.status === 'ATIVA' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border-rose-500/30'}`}>
                    {result.status}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${SIZE_COLORS[result.companySize] || ''}`}>
                    {sizeLabel[result.companySize] || result.companySize}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono bg-[#141a27] px-2 py-0.5 rounded border border-[#1e293b]">
                    {formatCNPJ(result.cnpj)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push(`/company/${result.cnpj}`)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 shrink-0"
            >
              <span>Abrir Dossiê 360°</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dados rápidos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#0a0d14] border border-[#1e293b]">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">CNAE Principal</p>
              <p className="text-xs text-white font-medium mt-1 leading-tight line-clamp-2">{result.primaryCnaeDesc}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0a0d14] border border-[#1e293b]">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Localização</p>
              <p className="text-xs text-white font-medium mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>{result.city} – {result.state}</span>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#0a0d14] border border-[#1e293b]">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Funcionários (eSocial)</p>
              <p className="text-xs text-white font-bold mt-1">
                {result.fiscalData?.employeeCountDeclared != null ? `${result.fiscalData.employeeCountDeclared} colaboradores` : '–'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#0a0d14] border border-[#1e293b]">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Capital Social</p>
              <p className="text-xs text-emerald-400 font-bold mt-1">
                {result.shareCapital > 0
                  ? `R$ ${result.shareCapital.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '–'
                }
              </p>
            </div>
          </div>

          {/* Endereço e contato */}
          <div className="flex items-center justify-between border-t border-[#1e293b] pt-3 flex-wrap gap-2 text-xs">
            <p className="text-zinc-400">
              {[result.street, result.number, result.neighborhood].filter(Boolean).join(', ')} — CEP {result.zipCode || '–'}
            </p>
            <div className="flex items-center gap-2">
              {result.phone && (
                <a href={`tel:${result.phone}`} className="text-zinc-300 hover:text-cyan-400 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{result.phone}</span>
                </a>
              )}
              {result.whatsapp && (
                <a
                  href={result.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold hover:bg-emerald-600/30 transition-all flex items-center gap-1"
                >
                  <span>Chamar no WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
