'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  Search,
  Building2,
  Calculator,
  FileText,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  Users2,
  Receipt,
  HelpCircle,
  Star,
  Layers,
  BarChart3,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [sdrCount, setSdrCount] = useState(3);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const calculatedPipeline = sdrCount * 180000;
  const calculatedDeals = sdrCount * 14;

  const faqs = [
    {
      q: 'De onde vêm os dados de contratos públicos e empresas?',
      a: 'Nossos robôs de inteligência integram-se diariamente com APIs oficiais do Governo Federal, PNCP (Portal Nacional de Contratações Públicas), Compras.gov.br, Portal da Transparência, Receita Federal (CNPJ Abertos) e bases do eSocial/CAGED.',
    },
    {
      q: 'Como a plataforma estima o faturamento e quantidade de funcionários?',
      a: 'Utilizamos algoritmos proprietários que cruzam a faixa de enquadramento de porte (MEI, ME, EPP, Médio, Grande), capital social registrado, soma anual de contratos governamentais vigentes e histórico de retenções tributárias.',
    },
    {
      q: 'Posso exportar os contatos e propostas geradas?',
      a: 'Sim! Você pode exportar listas de leads em CSV para seu CRM (HubSpot, RD Station, Pipedrive) ou gerar propostas comerciais em PDF com 1 clique diretamente na plataforma.',
    },
    {
      q: 'A plataforma está em conformidade com a LGPD?',
      a: 'Sim, 100%. Todos os dados cadastrais, licitatórios e empresariais são oriundos de bases públicas e dados abertos disponibilizados conforme a Lei de Acesso à Informação (Lei 12.527/2011) e princípios da LGPD.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070a10] text-zinc-100 selection:bg-indigo-500 selection:text-white relative">
      {/* Background Ambience Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-cyan-500/10 to-transparent blur-[140px] pointer-events-none" />

      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#070a10]/80 border-b border-[#1e293b]/70">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/landing" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-bold group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tight leading-none flex items-center gap-1">
                Prospect<span className="text-cyan-400">AI</span>
              </h1>
              <p className="text-[10px] text-zinc-400 mt-0.5">Inteligência B2B & Captação</p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">
              Módulos da Plataforma
            </a>
            <a href="#intel" className="hover:text-cyan-400 transition-colors">
              Inteligência Pública
            </a>
            <a href="#calculator" className="hover:text-cyan-400 transition-colors">
              Simulador de ROI
            </a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">
              Planos & Preços
            </a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-[#141b29] border border-transparent hover:border-[#1e293b] transition-all"
            >
              Área de Login
            </Link>

            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
            >
              <span>Acessar Plataforma</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-16 pb-24 px-6 max-w-7xl mx-auto text-center space-y-8 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-inner">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>+500.000 Contratos Públicos Governamentais Rastreados em Tempo Real</span>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Venda para Empresas com{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
              Poder de Compra Aprovado
            </span>{' '}
            por Órgãos Públicos.
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            A única plataforma que cruza a base da <strong>Receita Federal</strong> com dados do <strong>PNCP, Transparência e Compras.gov</strong> para identificar prospects com caixa garantido, dimensionar tickets e gerar propostas comerciais com IA.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/search"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:scale-105 transition-all text-white text-sm font-bold shadow-xl shadow-indigo-600/35 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Buscar Empresas Agora</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/login"
            className="px-6 py-3.5 rounded-2xl bg-[#111622] hover:bg-[#161e2e] border border-[#1e293b] text-zinc-200 hover:text-white text-sm font-bold flex items-center gap-2 transition-all shadow-md"
          >
            <span>Acessar Login do Vendedor</span>
          </Link>
        </div>

        {/* Live Metrics Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-12">
          <div className="p-5 rounded-2xl bg-[#0e131f]/80 border border-[#1e293b] text-center space-y-1">
            <h3 className="text-3xl font-black text-white">+22 Milhões</h3>
            <p className="text-xs text-zinc-400">Empresas e MEIs no Brasil</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0e131f]/80 border border-[#1e293b] text-center space-y-1">
            <h3 className="text-3xl font-black text-emerald-400">R$ 48 Bilhões</h3>
            <p className="text-xs text-zinc-400">Em Oportunidades Mapeadas</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0e131f]/80 border border-[#1e293b] text-center space-y-1">
            <h3 className="text-3xl font-black text-cyan-400">1-Clique</h3>
            <p className="text-xs text-zinc-400">WhatsApp & Contatos Diretos</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0e131f]/80 border border-[#1e293b] text-center space-y-1">
            <h3 className="text-3xl font-black text-purple-400">4.2x</h3>
            <p className="text-xs text-zinc-400">Mais Conversão em Vendas</p>
          </div>
        </div>
      </section>

      {/* 3. The 3 Modules Showcase */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Módulos de Engenharia de Vendas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Do Filtro ao Contrato Fechado em uma Só Plataforma
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Três pilares integrados para abastecer seu time comercial com os prospects mais lucrativos do país.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Módulo A */}
          <div className="p-8 rounded-3xl bg-[#0e131f] border border-[#1e293b] hover:border-indigo-500/50 transition-all space-y-5 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-black text-base">
                A
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                Busca, Segmentação & Filtros
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Filtre por CNAE primário/secundário, UF, cidade, porte cadastral e ative o botão exclusivo de empresas com contratos públicos vigentes.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Segmentação por 27 estados e cidades</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  <span>Enquadramento MEI a Grande Porte</span>
                </li>
              </ul>
            </div>

            <Link
              href="/search"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 pt-4 border-t border-[#1e293b]"
            >
              <span>Explorar Motor de Busca</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Módulo B */}
          <div className="p-8 rounded-3xl bg-[#0e131f] border border-[#1e293b] hover:border-cyan-500/50 transition-all space-y-5 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-black text-base">
                B
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                Dossiê 360 & Inteligência Estratégica
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Acesse o histórico de licitações ganhas, órgãos compradores, categorias de gastos, quadro de sócios (QSA) e dados fiscais declarados no eSocial.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Contatos com WhatsApp sob 1 clique</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Quadro de funcionários e CNDs</span>
                </li>
              </ul>
            </div>

            <Link
              href="/company/08453912000140"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 pt-4 border-t border-[#1e293b]"
            >
              <span>Ver Exemplo de Dossiê</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Módulo C */}
          <div className="p-8 rounded-3xl bg-[#0e131f] border border-[#1e293b] hover:border-purple-500/50 transition-all space-y-5 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-black text-base">
                C
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                Calculadora & Propostas com IA
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Calcule o ticket de produto ideal com base no caixa da empresa e gere propostas comerciais com pitch de vendas contextualizado em compras públicas.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Dimensionamento de ticket mensal e pontual</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Exportação em PDF e formato de impressão</span>
                </li>
              </ul>
            </div>

            <Link
              href="/proposals"
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 pt-4 border-t border-[#1e293b]"
            >
              <span>Ver Gerador de Propostas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. ROI Simulator Section */}
      <section id="calculator" className="py-16 px-6 bg-[#0c101a] border-y border-[#1e293b]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase">
              <BarChart3 className="w-4 h-4" />
              <span>Simulador de Pipeline de Captação</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Quanto sua equipe pode faturar a mais prospectando fornecedores públicos?
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Arraste para definir o número de vendedores (SDRs/Closers) e veja a estimativa de novas contas abertas todo mês.
            </p>

            <div className="pt-4 space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-zinc-300">Tamanho da Equipe Comercial:</span>
                <span className="text-cyan-400 font-mono text-sm">{sdrCount} Vendedores / SDRs</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={sdrCount}
                onChange={(e) => setSdrCount(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="lg:col-span-6 p-8 rounded-3xl bg-[#111622] border border-[#1e293b] shadow-2xl space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b]">
                <p className="text-[10px] text-zinc-400 uppercase font-bold">Novas Contas Estimadas</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">~{calculatedDeals}/mês</p>
                <p className="text-[10px] text-zinc-500">Conversão de alto ticket</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b]">
                <p className="text-[10px] text-zinc-400 uppercase font-bold">Pipeline Novo Gerado</p>
                <p className="text-2xl font-black text-cyan-400 mt-1">
                  R$ {(calculatedPipeline / 1000).toFixed(0)}k/mês
                </p>
                <p className="text-[10px] text-zinc-500">Com poder de compra</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-zinc-300 flex items-center justify-between">
              <span>Payback Médio do SaaS:</span>
              <span className="font-bold text-white text-sm">Menos de 14 dias</span>
            </div>

            <Link
              href="/signup"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Contratar Acesso para {sdrCount} Vendedores</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Pricing Plans Table */}
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Planos Flexíveis para Times Comerciais</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Escolha o Plano Ideal para Sua Operação
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Libere acessos individuais para seus vendedores e feche contratos com segurança.
          </p>

          {/* Toggle Mensal / Anual */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span className={cn('text-xs font-semibold', billingCycle === 'monthly' ? 'text-white' : 'text-zinc-500')}>
              Mensal
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-12 h-6 bg-[#1e293b] rounded-full p-0.5 relative transition-colors"
            >
              <div
                className={cn(
                  'w-5 h-5 rounded-full bg-cyan-400 shadow-md transition-transform',
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                )}
              />
            </button>
            <span className={cn('text-xs font-semibold flex items-center gap-1.5', billingCycle === 'annual' ? 'text-white' : 'text-zinc-500')}>
              Anual <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">20% OFF</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Plan 1: Starter */}
          <div className="p-8 rounded-3xl bg-[#0e131f] border border-[#1e293b] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Starter SDR</h3>
                <p className="text-xs text-zinc-400 mt-1">Para consultores autônomos e SDRs individuais</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">
                  R$ {billingCycle === 'annual' ? '247' : '297'}
                </span>
                <span className="text-xs text-zinc-400">/mês</span>
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-300 pt-4 border-t border-[#1e293b]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>1 Usuário / Login de Vendas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Busca de Empresas por CNAE e UF</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Contatos e WhatsApp liberados</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>50 Propostas geradas por mês</span>
                </li>
              </ul>
            </div>

            <Link
              href="/signup?plan=starter"
              className="w-full py-3 rounded-xl bg-[#161e2e] hover:bg-[#1f293d] border border-[#1e293b] text-white text-xs font-bold text-center transition-all block"
            >
              Começar com Starter
            </Link>
          </div>

          {/* Plan 2: Scale B2B (Featured) */}
          <div className="p-8 rounded-3xl bg-[#111622] border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 space-y-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-500 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-bl-xl">
              Mais Escolhido
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Scale B2B Pro</h3>
                <p className="text-xs text-zinc-400 mt-1">Para times de vendas e agências de captação</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">
                  R$ {billingCycle === 'annual' ? '630' : '790'}
                </span>
                <span className="text-xs text-zinc-400">/mês</span>
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-300 pt-4 border-t border-[#1e293b]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Até 5 Logins de Vendedores</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Rastreamento completo do PNCP e Transparência</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Dados Fiscais & Funcionários eSocial</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Propostas Ilimitadas com IA</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Exportação CSV ilimitada para CRM</span>
                </li>
              </ul>
            </div>

            <Link
              href="/signup?plan=scale"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold text-center shadow-lg shadow-indigo-600/30 transition-all block"
            >
              Assinar Plano Scale Pro
            </Link>
          </div>

          {/* Plan 3: Enterprise */}
          <div className="p-8 rounded-3xl bg-[#0e131f] border border-[#1e293b] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Enterprise AI</h3>
                <p className="text-xs text-zinc-400 mt-1">Para grandes corporações e federações</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">
                  R$ {billingCycle === 'annual' ? '1.490' : '1.890'}
                </span>
                <span className="text-xs text-zinc-400">/mês</span>
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-300 pt-4 border-t border-[#1e293b]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Usuários Ilimitados</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>API Dedicada & Webhooks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Gerente de Contas Dedicado</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>SLA de Suporte em 1 hora</span>
                </li>
              </ul>
            </div>

            <Link
              href="/signup?plan=enterprise"
              className="w-full py-3 rounded-xl bg-[#161e2e] hover:bg-[#1f293d] border border-[#1e293b] text-white text-xs font-bold text-center transition-all block"
            >
              Falar com Consultor
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section id="faq" className="py-16 px-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Perguntas Frequentes (FAQ)</h2>
          <p className="text-xs text-zinc-400">Tudo o que você precisa saber sobre a plataforma e dados públicos</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-[#0e131f] border border-[#1e293b] transition-all cursor-pointer"
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            >
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-white">
                <span>{faq.q}</span>
                <span className="text-cyan-400 font-mono text-base">{openFaq === index ? '−' : '+'}</span>
              </div>
              {openFaq === index && (
                <p className="text-xs text-zinc-400 mt-3 leading-relaxed border-t border-[#1e293b] pt-3 animate-in fade-in duration-200">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-[#1e293b] bg-[#05080e] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white">ProspectAI</p>
              <p className="text-[10px] text-zinc-500">© 2026 Todos os direitos reservados.</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/search" className="hover:text-white transition-colors">
              Buscar Empresas
            </Link>
            <Link href="/calculator" className="hover:text-white transition-colors">
              Calculadora
            </Link>
            <Link href="/proposals" className="hover:text-white transition-colors">
              Propostas
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
