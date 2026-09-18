'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SearchFilters, CompanySize } from '@/types';
import {
  Search, SlidersHorizontal, X, ChevronDown, Loader2,
  Building2, MapPin, Tag, TrendingUp, Filter, RotateCcw,
  Globe2, ZapIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ALL_STATES = [
  { uf: 'AC', name: 'Acre' }, { uf: 'AL', name: 'Alagoas' }, { uf: 'AP', name: 'Amapá' },
  { uf: 'AM', name: 'Amazonas' }, { uf: 'BA', name: 'Bahia' }, { uf: 'CE', name: 'Ceará' },
  { uf: 'DF', name: 'Distrito Federal' }, { uf: 'ES', name: 'Espírito Santo' }, { uf: 'GO', name: 'Goiás' },
  { uf: 'MA', name: 'Maranhão' }, { uf: 'MT', name: 'Mato Grosso' }, { uf: 'MS', name: 'Mato Grosso do Sul' },
  { uf: 'MG', name: 'Minas Gerais' }, { uf: 'PA', name: 'Pará' }, { uf: 'PB', name: 'Paraíba' },
  { uf: 'PR', name: 'Paraná' }, { uf: 'PE', name: 'Pernambuco' }, { uf: 'PI', name: 'Piauí' },
  { uf: 'RJ', name: 'Rio de Janeiro' }, { uf: 'RN', name: 'Rio Grande do Norte' },
  { uf: 'RS', name: 'Rio Grande do Sul' }, { uf: 'RO', name: 'Rondônia' }, { uf: 'RR', name: 'Roraima' },
  { uf: 'SC', name: 'Santa Catarina' }, { uf: 'SP', name: 'São Paulo' }, { uf: 'SE', name: 'Sergipe' },
  { uf: 'TO', name: 'Tocantins' },
];

const CNAE_GROUPS = [
  { key: 'TI', label: '💻 TI & Software', prefix: '62' },
  { key: 'ENGENHARIA', label: '🏗️ Engenharia & Construção', prefix: '41,42,43,71' },
  { key: 'SAUDE', label: '🏥 Saúde & Farmácia', prefix: '86,46' },
  { key: 'EDUCACAO', label: '🎓 Educação & Treinamento', prefix: '85' },
  { key: 'SERVICOS', label: '🏛️ Serviços para Governo', prefix: '81,80' },
  { key: 'CONSULTORIA', label: '📊 Consultoria & Auditoria', prefix: '70,69' },
  { key: 'TRANSPORTE', label: '🚛 Transporte & Logística', prefix: '49,52' },
  { key: 'ENERGIA', label: '⚡ Energia & Saneamento', prefix: '35,36' },
];

const SIZES: { key: CompanySize; label: string; desc: string }[] = [
  { key: 'MEI', label: 'MEI', desc: 'Até R$81k/ano' },
  { key: 'ME', label: 'Micro', desc: 'Até R$360k/ano' },
  { key: 'EPP', label: 'Pequena', desc: 'Até R$4,8M/ano' },
  { key: 'MEDIO', label: 'Média', desc: 'Até R$300M/ano' },
  { key: 'GRANDE', label: 'Grande', desc: 'Acima R$300M' },
];

interface Props {
  filters: SearchFilters;
  onChange: (f: SearchFilters) => void;
  total?: number;
  loading?: boolean;
}

export function CompanySearchFilters({ filters, onChange, total, loading }: Props) {
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<CompanySize[]>(
    (filters.companySize as CompanySize[]) || []
  );

  // Load cities when state changes
  useEffect(() => {
    if (filters.state && filters.state !== 'ALL') {
      setLoadingCities(true);
      fetch(`/api/lookup?type=cities&uf=${filters.state}`)
        .then(r => r.json())
        .then(d => setCities(d.cities || []))
        .catch(() => setCities([]))
        .finally(() => setLoadingCities(false));
    } else {
      setCities([]);
    }
  }, [filters.state]);

  const update = useCallback((patch: Partial<SearchFilters>) => {
    onChange({ ...filters, ...patch, page: 1 });
  }, [filters, onChange]);

  const toggleSize = (size: CompanySize) => {
    const next = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(next);
    update({ companySize: next.length > 0 ? next : undefined });
  };

  const hasActiveFilters =
    (filters.state && filters.state !== 'ALL') ||
    (filters.cnae && filters.cnae !== 'ALL') ||
    filters.city ||
    filters.query ||
    selectedSizes.length > 0 ||
    filters.hasPublicContracts;

  const resetFilters = () => {
    setSelectedSizes([]);
    onChange({ sortBy: 'contracts', sortOrder: 'desc', page: 1 });
  };

  return (
    <aside className="w-72 shrink-0 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          Filtros de Prospecção
        </div>
        <div className="flex items-center gap-2">
          {loading && <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
          {total != null && (
            <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
              {total.toLocaleString('pt-BR')} resultados
            </span>
          )}
          {hasActiveFilters && (
            <button onClick={resetFilters} className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors">
              <RotateCcw className="w-3 h-3" />
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Quick Text Search */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filters.query || ''}
          onChange={e => update({ query: e.target.value })}
          placeholder="Buscar por nome ou CNPJ..."
          className="w-full bg-[#0d1220] border border-[#1e293b] text-xs text-zinc-200 pl-9 pr-9 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600"
        />
        {filters.query && (
          <button onClick={() => update({ query: '' })} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Estado */}
      <div className="bg-[#0d1220] border border-[#1e293b] rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          Estado (UF)
        </div>
        <select
          value={filters.state || 'ALL'}
          onChange={e => update({ state: e.target.value === 'ALL' ? undefined : e.target.value, city: undefined })}
          className="w-full bg-[#111827] border border-[#1e293b] text-xs text-zinc-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
        >
          <option value="ALL">🇧🇷 Todos os Estados</option>
          {ALL_STATES.map(s => (
            <option key={s.uf} value={s.uf}>{s.uf} – {s.name}</option>
          ))}
        </select>

        {/* Cidade (carregada via IBGE) */}
        {filters.state && filters.state !== 'ALL' && (
          <div className="space-y-1.5">
            <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              Cidade
              {loadingCities && <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />}
            </div>
            <select
              value={filters.city || ''}
              onChange={e => update({ city: e.target.value || undefined })}
              disabled={loadingCities || cities.length === 0}
              className="w-full bg-[#111827] border border-[#1e293b] text-xs text-zinc-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer disabled:opacity-50"
            >
              <option value="">Todas as Cidades</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* CNAE / Setor */}
      <div className="bg-[#0d1220] border border-[#1e293b] rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          <Tag className="w-3.5 h-3.5 text-indigo-400" />
          Setor / CNAE
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          <button
            onClick={() => update({ cnae: undefined })}
            className={cn(
              'text-left px-3 py-2 rounded-lg text-xs font-medium transition-all border',
              !filters.cnae || filters.cnae === 'ALL'
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                : 'bg-[#111827] border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#151c2c]'
            )}
          >
            🔍 Todos os Setores
          </button>
          {CNAE_GROUPS.map(g => (
            <button
              key={g.key}
              onClick={() => update({ cnae: g.prefix.split(',')[0] })}
              className={cn(
                'text-left px-3 py-2 rounded-lg text-xs font-medium transition-all border',
                filters.cnae === g.prefix.split(',')[0]
                  ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                  : 'bg-[#111827] border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#151c2c]'
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Porte Empresarial */}
      <div className="bg-[#0d1220] border border-[#1e293b] rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
          Porte Empresarial
        </div>
        <div className="space-y-1.5">
          {SIZES.map(s => (
            <button
              key={s.key}
              onClick={() => toggleSize(s.key)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all border',
                selectedSizes.includes(s.key)
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-[#111827] border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-[#151c2c]'
              )}
            >
              <span>{s.label}</span>
              <span className={cn(
                'text-[10px]',
                selectedSizes.includes(s.key) ? 'text-emerald-400' : 'text-zinc-600'
              )}>{s.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contratos Públicos */}
      <div className="bg-[#0d1220] border border-[#1e293b] rounded-xl p-3.5">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <div>
              <p className="text-xs font-semibold text-zinc-200">Com Contratos Públicos</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">PNCP, Compras.gov.br, TCU</p>
            </div>
          </div>
          <div
            onClick={() => update({ hasPublicContracts: !filters.hasPublicContracts })}
            className={cn(
              'relative w-10 h-5 rounded-full transition-all cursor-pointer',
              filters.hasPublicContracts ? 'bg-amber-500' : 'bg-zinc-700'
            )}
          >
            <span className={cn(
              'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all',
              filters.hasPublicContracts ? 'left-5.5' : 'left-0.5'
            )} style={{ left: filters.hasPublicContracts ? '22px' : '2px' }} />
          </div>
        </label>
      </div>

      {/* Ordenação */}
      <div className="bg-[#0d1220] border border-[#1e293b] rounded-xl p-3.5 space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          <ZapIcon className="w-3.5 h-3.5 text-purple-400" />
          Ordenar Por
        </div>
        <select
          value={filters.sortBy || 'contracts'}
          onChange={e => update({ sortBy: e.target.value as SearchFilters['sortBy'] })}
          className="w-full bg-[#111827] border border-[#1e293b] text-xs text-zinc-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer"
        >
          <option value="score">⚡ Score de Capacidade</option>
          <option value="contracts">💰 Volume de Contratos</option>
          <option value="name">🔤 Razão Social A→Z</option>
          <option value="size">🏢 Porte Empresarial</option>
        </select>
      </div>

      {/* Live data indicator */}
      <div className="px-3 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <p className="text-[10px] text-emerald-400 leading-relaxed">
          Dados em tempo real via <strong>BrasilAPI</strong> · Receita Federal · PNCP
        </p>
      </div>
    </aside>
  );
}
