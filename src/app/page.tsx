import React from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/ui/StatCard';
import { CompanyTable } from '@/components/search/CompanyTable';
import { searchCompanies, getDashboardStats } from '@/lib/data-service';
import {
  Building2,
  Landmark,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Calculator,
  FileText,
  Search,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { formatCompactCurrency, formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const stats = getDashboardStats();
  const { data: topCompanies } = await searchCompanies({ limit: 6, sortBy: 'contracts' });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#131929] via-[#111726] to-[#0d121d] border border-[#1e293b] p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Motor de Inteligência B2B & Licitações Governamentais</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            Identifique Prospects B2B com{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
              Poder de Compra Comprovado
            </span>
          </h1>

          <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl">
            Cruze dados da Receita Federal com contratos públicos ativos do PNCP e Portal da Transparência.
            Calcule o faturamento estimado, dimensione tickets de venda e gere propostas hiperpersonalizadas.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              href="/search"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Explorar Mais de 32 Mil Empresas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/calculator"
              className="px-5 py-2.5 rounded-xl bg-[#161e2e] border border-[#1e293b] text-zinc-200 hover:text-white hover:border-cyan-500 text-xs font-bold flex items-center gap-2 transition-all"
            >
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>Calculadora de Capacidade</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Empresas Mapeadas"
          value={stats.total.toLocaleString('pt-BR')}
          subtext="Base nacional ativa em todos os 27 estados"
          icon={Building2}
          trend={`${stats.bySize.MEI.toLocaleString('pt-BR')} MEIs com WhatsApp`}
          trendPositive={true}
          accentColor="indigo"
        />

        <StatCard
          title="Volume Contratos Gov"
          value={formatCompactCurrency(stats.totalContracts)}
          subtext="Rastreados via PNCP e Transparência"
          icon={Landmark}
          trend={`${stats.withContracts.toLocaleString('pt-BR')} empresas com contratos`}
          trendPositive={true}
          accentColor="emerald"
        />

        <StatCard
          title="Ticket Mensal Médio"
          value="R$ 14.800"
          subtext="Estimado por capacidade financeira"
          icon={TrendingUp}
          trend="Score Médio 74/100"
          trendPositive={true}
          accentColor="cyan"
        />

        <StatCard
          title="Propostas Geradas"
          value="18 minutas"
          subtext="Argumentação customizada por IA"
          icon={FileText}
          trend="+12 esta semana"
          trendPositive={true}
          accentColor="purple"
        />
      </div>

      {/* Distribution by Size Banner */}
      <div className="bg-[#111622] border border-[#1e293b] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1e293b] pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Distribuição Nacional por Porte Empresarial</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Segmentação estratégica pronta para prospecção ativa de vendas B2B</p>
          </div>
          <Link
            href="/search"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>Ver filtros avançados</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          <Link
            href="/search?sizes=MEI"
            className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b] hover:border-teal-500/50 transition-all text-center group"
          >
            <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">MEI (SIMEI)</span>
            <p className="text-2xl font-black text-white mt-1 group-hover:text-teal-300 transition-colors">
              {stats.bySize.MEI.toLocaleString('pt-BR')}
            </p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Contatos diretos WhatsApp</p>
          </Link>

          <Link
            href="/search?sizes=ME"
            className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b] hover:border-blue-500/50 transition-all text-center group"
          >
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Microempresa (ME)</span>
            <p className="text-2xl font-black text-white mt-1 group-hover:text-blue-300 transition-colors">
              {stats.bySize.ME.toLocaleString('pt-BR')}
            </p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Até R$ 360k/ano</p>
          </Link>

          <Link
            href="/search?sizes=EPP"
            className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b] hover:border-indigo-500/50 transition-all text-center group"
          >
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Pequeno Porte (EPP)</span>
            <p className="text-2xl font-black text-white mt-1 group-hover:text-indigo-300 transition-colors">
              {stats.bySize.EPP.toLocaleString('pt-BR')}
            </p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Até R$ 4,8M/ano</p>
          </Link>

          <Link
            href="/search?sizes=MEDIO"
            className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b] hover:border-amber-500/50 transition-all text-center group"
          >
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Médio Porte</span>
            <p className="text-2xl font-black text-white mt-1 group-hover:text-amber-300 transition-colors">
              {stats.bySize.MEDIO.toLocaleString('pt-BR')}
            </p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Até R$ 300M/ano</p>
          </Link>

          <Link
            href="/search?sizes=GRANDE"
            className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b] hover:border-purple-500/50 transition-all text-center group col-span-2 sm:col-span-1"
          >
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Grande Porte</span>
            <p className="text-2xl font-black text-white mt-1 group-hover:text-purple-300 transition-colors">
              {stats.bySize.GRANDE.toLocaleString('pt-BR')}
            </p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Grandes contratações</p>
          </Link>
        </div>
      </div>

      {/* Top Opportunities Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>Oportunidades em Destaque (Maiores Contratos Gov Ativos)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Empresas com maior faturamento governamental mapeado no PNCP e alta capacidade de contratação
            </p>
          </div>
          <Link
            href="/search"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>Ver todas as {stats.total.toLocaleString('pt-BR')} empresas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <CompanyTable companies={topCompanies} />
      </div>
    </div>
  );
}
