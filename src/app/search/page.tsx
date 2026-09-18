'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Company, SearchFilters } from '@/types';
import { CompanySearchFilters } from '@/components/search/CompanySearchFilters';
import { CompanyTable } from '@/components/search/CompanyTable';
import { LiveCnpjSearch } from '@/components/search/LiveCnpjSearch';
import { Search, Database, Globe2, Zap, RefreshCw, AlertTriangle, TrendingUp } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();

  const [tab, setTab] = useState<'segmented' | 'cnpj'>('segmented');
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    state: searchParams.get('state') || undefined,
    cnae: searchParams.get('cnae') || undefined,
    hasPublicContracts: searchParams.get('hasContracts') === 'true',
    sortBy: 'contracts',
    sortOrder: 'desc',
    page: 1,
  });

  const [companies, setCompanies] = useState<Company[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiveLoading, setIsLiveLoading] = useState(false);

  const fetchResults = useCallback(async (currentFilters: SearchFilters, isRefresh = false) => {
    if (isRefresh) setIsLiveLoading(true);
    else setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      if (currentFilters.query) params.set('q', currentFilters.query);
      if (currentFilters.state && currentFilters.state !== 'ALL') params.set('state', currentFilters.state);
      if (currentFilters.city) params.set('city', currentFilters.city);
      if (currentFilters.cnae && currentFilters.cnae !== 'ALL') params.set('cnae', currentFilters.cnae);
      if (currentFilters.companySize && currentFilters.companySize.length > 0) {
        params.set('sizes', currentFilters.companySize.join(','));
      }
      if (currentFilters.hasPublicContracts) params.set('hasContracts', 'true');
      if (currentFilters.sortBy) params.set('sortBy', currentFilters.sortBy);
      if (currentFilters.page) params.set('page', currentFilters.page.toString());

      const res = await fetch(`/api/companies?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      
      setCompanies(json.data || []);
      setTotal(json.total || 0);
      setTotalPages(json.totalPages || 1);
    } catch (e) {
      console.error('Erro ao buscar empresas:', e);
      setError('Falha ao conectar com a base de dados. Verifique sua conexão.');
    } finally {
      setLoading(false);
      setIsLiveLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(filters);
  }, [filters, fetchResults]);

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070a10]">
      {/* Page Header */}
      <div className="border-b border-[#1e293b] bg-[#0a0d14]/80 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Search className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Busca & Segmentação B2B</h1>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Base Receita Federal · BrasilAPI · PNCP · IBGE
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Data source tabs */}
            <div className="flex items-center bg-[#111622] border border-[#1e293b] rounded-xl p-1 gap-1">
              <button
                onClick={() => setTab('segmented')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tab === 'segmented'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                Busca Segmentada
              </button>
              <button
                onClick={() => setTab('cnpj')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tab === 'cnpj'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Busca por CNPJ
              </button>
            </div>
            
            <button
              onClick={() => fetchResults(filters, true)}
              disabled={loading || isLiveLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111622] border border-[#1e293b] text-xs text-zinc-400 hover:text-zinc-200 hover:border-indigo-500/50 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLiveLoading ? 'animate-spin text-cyan-400' : ''}`} />
              Atualizar
            </button>
          </div>
        </div>

        {/* Breadcrumb stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#1e293b]/60">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Dados Oficiais Receita Federal</span>
          </div>
          <div className="text-[11px] text-zinc-600">·</div>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            <Globe2 className="w-3 h-3 text-cyan-400" />
            <span>+32.000 Empresas & MEIs (Foco Nordeste & Brasil)</span>
          </div>
          <div className="text-[11px] text-zinc-600">·</div>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
            <TrendingUp className="w-3 h-3 text-amber-400" />
            <span>R$ 48 Bi em Contratos Públicos Mapeados</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {tab === 'segmented' ? (
          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <CompanySearchFilters
              filters={filters}
              onChange={handleFiltersChange}
              total={total}
              loading={loading}
            />

            {/* Results Area */}
            <div className="flex-1 min-w-0">
              {error ? (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold">Erro ao carregar dados</p>
                    <p className="text-[11px] mt-0.5 text-rose-400/70">{error}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* State info banner */}
                  {filters.state && filters.state !== 'ALL' && !loading && (
                    <div className="mb-4 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <Globe2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <p className="text-xs text-indigo-300">
                        Carregando empresas do estado <strong>{filters.state}</strong> via BrasilAPI em segundo plano.{' '}
                        <span className="text-zinc-400">Os resultados são enriquecidos automaticamente com dados da Receita Federal.</span>
                      </p>
                    </div>
                  )}

                  <CompanyTable
                    companies={companies}
                    loading={loading}
                    total={total}
                    page={filters.page || 1}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <LiveCnpjSearch />
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070a10] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-xs text-zinc-400">Inicializando motor de busca...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
