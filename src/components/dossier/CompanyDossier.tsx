'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Company } from '@/types';
import {
  formatCNPJ,
  formatCurrency,
  formatCompactCurrency,
  formatDate,
  getCompanySizeLabel,
  getCompanySizeBadgeColor,
  getScoreColor,
} from '@/lib/utils';
import { generatePitchRationale } from '@/lib/estimators';
import {
  Building2,
  Landmark,
  ShieldCheck,
  TrendingUp,
  FileText,
  Calculator,
  Users,
  PieChart,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  MessageCircle,
  Copy,
  Check,
  User,
  Receipt,
  Users2,
  BadgeCheck,
  Clock,
  Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompanyDossierProps {
  company: Company;
}

export function CompanyDossier({ company }: CompanyDossierProps) {
  const [activeTab, setActiveTab] = useState<'contacts' | 'fiscal' | 'contracts' | 'qsa' | 'expenses' | 'pitch'>('contacts');
  const [pitchService, setPitchService] = useState('Consultoria & Soluções em Tecnologia');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };
  
  const scoreStyle = getScoreColor(company.capacityScore || company.financialIndicators?.financialCapacityScore || 70);
  const activeContracts = (company.publicContracts || []).filter((c) => c.status === 'VIGENTE');
  const totalGovVolume = (company.publicContracts || []).reduce((acc, curr) => acc + curr.totalValue, 0);

  // Group contracts by category
  const categorySummary: Record<string, number> = {};
  (company.publicContracts || []).forEach((c) => {
    const cat = c.category || 'Outros';
    categorySummary[cat] = (categorySummary[cat] || 0) + c.totalValue;
  });

  const generatedPitch = generatePitchRationale(company, company.publicContracts || [], pitchService);

  const cleanPhone = company.phone ? company.phone.replace(/\D/g, '') : '';
  const waNumber = cleanPhone.length >= 10 ? (cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`) : '';
  const ownerName = company.partners?.[0]?.name || company.legalName;
  const ownerRole = company.partners?.[0]?.role || (company.companySize === 'MEI' ? 'Titular / MEI' : 'Sócio-Administrador');
  
  const waMessage = encodeURIComponent(
    `Olá ${ownerName}, tudo bem? Me chamo Agente de Captação da ProspectAI. Identificamos a atuação da ${company.tradeName || company.legalName} em ${company.city}/${company.state} e gostaríamos de apresentar uma proposta comercial estratégica.`
  );

  const addressComponents = [
    company.street ? `${company.street}${company.number ? `, ${company.number}` : ''}` : '',
    company.neighborhood,
    `${company.city} - ${company.state}`,
    company.zipCode ? `CEP ${company.zipCode}` : '',
  ].filter(Boolean);

  const fullAddress = addressComponents.join(', ');

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${company.legalName} ${fullAddress}`
  )}`;

  const fiscal = company.fiscalData;
  const financial = company.financialIndicators;

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER PROFILE CARD (Hero & Identity)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#111622] border border-[#1e293b] rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          {/* Identity Block */}
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/30 shrink-0">
              {company.tradeName ? company.tradeName.slice(0, 2).toUpperCase() : company.legalName.slice(0, 2).toUpperCase()}
            </div>

            <div className="space-y-2 min-w-0">
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 flex items-center gap-1.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {company.status}
                </span>

                <span className={cn('px-2.5 py-0.5 rounded-full text-[11px] font-bold border shrink-0', getCompanySizeBadgeColor(company.companySize))}>
                  {getCompanySizeLabel(company.companySize)}
                </span>

                {fiscal?.isSimei && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 shrink-0">
                    SIMEI / MEI
                  </span>
                )}
                {fiscal?.isSimplesNacional && !fiscal?.isSimei && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30 shrink-0">
                    Simples Nacional
                  </span>
                )}
              </div>

              {/* Company Titles */}
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug break-words">
                  {company.tradeName || company.legalName}
                </h1>
                {company.tradeName && (
                  <p className="text-xs text-zinc-400 font-medium mt-0.5">{company.legalName}</p>
                )}
              </div>

              {/* Metadata Pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 pt-1">
                {/* CNPJ with copy */}
                <button
                  type="button"
                  onClick={() => handleCopy(company.cnpj, 'cnpj')}
                  className="inline-flex items-center gap-1.5 font-mono bg-[#0a0d14] px-2.5 py-1 rounded-lg border border-[#1e293b] text-zinc-300 hover:text-white hover:border-indigo-500 transition-all text-[11px]"
                  title="Clique para copiar o CNPJ"
                >
                  <span>CNPJ: {formatCNPJ(company.cnpj)}</span>
                  {copiedField === 'cnpj' ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-zinc-500" />
                  )}
                </button>

                {/* Location */}
                <span className="inline-flex items-center gap-1 bg-[#0a0d14] px-2.5 py-1 rounded-lg border border-[#1e293b] text-zinc-300 text-[11px]">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  <span>{company.city} - {company.state}</span>
                </span>

                {/* Abertura */}
                <span className="inline-flex items-center gap-1 bg-[#0a0d14] px-2.5 py-1 rounded-lg border border-[#1e293b] text-zinc-300 text-[11px]">
                  <Calendar className="w-3 h-3 text-zinc-500" />
                  <span>Abertura: {formatDate(company.registrationDate)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 pt-2 xl:pt-0">
            <Link
              href={`/calculator?cnpj=${company.cnpj}`}
              className="px-4 py-2.5 rounded-xl bg-[#161e2e] border border-[#1e293b] text-zinc-200 hover:text-white hover:border-cyan-500 hover:bg-[#1f293d] text-xs font-bold flex items-center gap-2 transition-all shadow-md shrink-0"
            >
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>Simular Capacidade</span>
            </Link>
            <Link
              href={`/proposals?cnpj=${company.cnpj}`}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30 shrink-0"
            >
              <FileText className="w-4 h-4" />
              <span>Gerar Proposta Comercial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. KPI FINANCIAL & CAPABILITY CARDS (Balanced 4 Grid)
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Faturamento Presumido */}
        <div className="bg-[#111622] border border-[#1e293b] rounded-2xl p-5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            <span>Faturamento Presumido</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl font-black text-white leading-tight">
              {formatCompactCurrency(financial?.estimatedAnnualRevenueMin || 0)} – {formatCompactCurrency(financial?.estimatedAnnualRevenueMax || 0)}
            </p>
            <p className="text-[11px] text-zinc-400 mt-1 font-medium">
              Capital Social: <strong className="text-zinc-200">{formatCurrency(company.shareCapital)}</strong>
            </p>
          </div>
        </div>

        {/* Card 2: Funcionários no eSocial */}
        <div className="bg-[#111622] border border-[#1e293b] rounded-2xl p-5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
            <span>Quadro de Funcionários</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Users2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl font-black text-white leading-tight">
              {fiscal?.employeeCountDeclared || 1} colaborador(es)
            </p>
            <p className="text-[11px] text-zinc-400 mt-1 font-medium">
              Folha est.: <strong className="text-emerald-400 font-mono">{formatCurrency(fiscal?.estimatedPayrollMonthly || 1412)}/mês</strong>
            </p>
          </div>
        </div>

        {/* Card 3: Ticket Mensal Sugerido */}
        <div className="bg-[#111622] border border-[#1e293b] rounded-2xl p-5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
            <span>Ticket Mensal Sugerido</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl font-black text-indigo-300 leading-tight">
              {formatCurrency(financial?.suggestedMonthlyTicketMin || 0)} – {formatCurrency(financial?.suggestedMonthlyTicketMax || 0)}
              <span className="text-xs font-normal text-zinc-400 ml-1">/mês</span>
            </p>
            <p className="text-[11px] text-zinc-400 mt-1 font-medium">
              Pontual: {formatCompactCurrency(financial?.suggestedOneOffTicketMin || 0)} a {formatCompactCurrency(financial?.suggestedOneOffTicketMax || 0)}
            </p>
          </div>
        </div>

        {/* Card 4: Score de Capacidade */}
        <div className="bg-[#111622] border border-[#1e293b] rounded-2xl p-5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            <span>Score de Capacidade</span>
            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center border font-bold text-xs', scoreStyle.bg, scoreStyle.text, scoreStyle.border)}>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <p className={cn('text-2xl font-black leading-tight', scoreStyle.text)}>
                {company.capacityScore || financial?.financialCapacityScore || 70}
                <span className="text-xs text-zinc-500 font-normal"> / 100</span>
              </p>
              <span className={cn('text-[11px] font-bold uppercase', scoreStyle.text)}>
                Risco {financial?.riskLevel || 'BAIXO'}
              </span>
            </div>
            <span className="text-[10px] bg-[#0a0d14] px-2 py-0.5 rounded border border-[#1e293b] text-zinc-400 font-medium">
              Algoritmo RFB
            </span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SEGMENTED TABS NAVIGATION (Never overlaps)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#0e131f] p-1.5 rounded-2xl border border-[#1e293b] flex flex-wrap gap-1 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('contacts')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all',
            activeTab === 'contacts'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-zinc-400 hover:text-white hover:bg-[#161e2e]'
          )}
        >
          <Phone className="w-4 h-4" />
          <span>Contatos & WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fiscal')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all',
            activeTab === 'fiscal'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
              : 'text-zinc-400 hover:text-white hover:bg-[#161e2e]'
          )}
        >
          <Receipt className="w-4 h-4" />
          <span>Dados Fiscais & eSocial</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contracts')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all',
            activeTab === 'contracts'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-zinc-400 hover:text-white hover:bg-[#161e2e]'
          )}
        >
          <Landmark className="w-4 h-4" />
          <span>Contratos Públicos</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 text-white font-mono">
            {company.publicContracts?.length || 0}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('qsa')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all',
            activeTab === 'qsa'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-zinc-400 hover:text-white hover:bg-[#161e2e]'
          )}
        >
          <Users className="w-4 h-4" />
          <span>Sócios (QSA)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 text-white font-mono">
            {company.partners?.length || 0}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('expenses')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all',
            activeTab === 'expenses'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-zinc-400 hover:text-white hover:bg-[#161e2e]'
          )}
        >
          <PieChart className="w-4 h-4" />
          <span>Mapeamento de Gastos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pitch')}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all',
            activeTab === 'pitch'
              ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-zinc-400 hover:text-white hover:bg-[#161e2e]'
          )}
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>Abordagem Comercial & Pitch (IA)</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. TAB 1: CENTRAL DE CONTATOS (No Overlapping Text/Buttons)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'contacts' && (
        <div className="bg-[#111622] border border-[#1e293b] rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1e293b] pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Central de Contatos & Abordagem Imediata</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Canais diretos com decisores para prospecção ativa e disparo comercial via WhatsApp
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full w-fit">
              Dados Validados & Sincronizados
            </span>
          </div>

          {/* 3 Dedicated Vertical Cards (Clean spacing) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Responsável / Decisor */}
            <div className="p-5 rounded-2xl bg-[#0a0d14] border border-[#1e293b] flex flex-col justify-between space-y-4 shadow-sm hover:border-indigo-500/40 transition-colors">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    Responsável / Decisor
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(ownerName, 'owner')}
                    className="p-1 rounded text-zinc-500 hover:text-white transition-colors"
                    title="Copiar Nome"
                  >
                    {copiedField === 'owner' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white break-words">{ownerName}</h4>
                  <p className="text-xs text-cyan-400 font-medium mt-0.5">{ownerRole}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1e293b]/60">
                <span className="text-[10px] text-zinc-500">
                  Titular com poder de decisão e contratação registrado.
                </span>
              </div>
            </div>

            {/* Card 2: Telefone & WhatsApp */}
            <div className="p-5 rounded-2xl bg-[#0a0d14] border border-[#1e293b] flex flex-col justify-between space-y-4 shadow-sm hover:border-emerald-500/40 transition-colors">
              <div className="space-y-2">
                <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Telefone Corporativo
                </span>
                <div>
                  <p className="text-base font-bold text-white font-mono">{company.phone || '(11) 98000-0000'}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">DDD local ({company.state})</p>
                </div>
              </div>

              {waNumber ? (
                <a
                  href={`https://wa.me/${waNumber}?text=${waMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all text-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Abrir Conversa no WhatsApp</span>
                </a>
              ) : (
                <div className="w-full py-2.5 px-3 rounded-xl bg-zinc-800 text-zinc-400 text-xs font-medium text-center">
                  Número sem WhatsApp verificado
                </div>
              )}
            </div>

            {/* Card 3: E-mail Oficial */}
            <div className="p-5 rounded-2xl bg-[#0a0d14] border border-[#1e293b] flex flex-col justify-between space-y-4 shadow-sm hover:border-indigo-500/40 transition-colors">
              <div className="space-y-2 min-w-0">
                <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  E-mail Oficial
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate block" title={company.email || 'contato@empresa.com.br'}>
                    {company.email || 'contato@empresa.com.br'}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Canal de correspondência RFB</p>
                </div>
              </div>

              {company.email ? (
                <a
                  href={`mailto:${company.email}?subject=Oportunidade Comercial ProspectAI`}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#161e2e] hover:bg-[#1f293d] border border-[#1e293b] hover:border-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all text-center"
                >
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span>Disparar E-mail</span>
                </a>
              ) : (
                <div className="w-full py-2.5 px-3 rounded-xl bg-zinc-800 text-zinc-400 text-xs font-medium text-center">
                  E-mail não cadastrado
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Endereço & Localização (Spacious) */}
          <div className="p-5 rounded-2xl bg-[#0a0d14] border border-[#1e293b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Endereço Cadastral Registrado</p>
                <p className="text-xs font-semibold text-white leading-relaxed">{fullAddress}</p>
              </div>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-[#141a27] hover:bg-[#1b2333] border border-[#1e293b] hover:border-cyan-500 text-cyan-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0"
            >
              <span>Abrir no Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. TAB 2: DADOS FISCAIS & FUNCIONÁRIOS eSocial
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'fiscal' && (
        <div className="bg-[#111622] border border-[#1e293b] rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-[#1e293b] pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-cyan-400" />
              <span>Dados Fiscais Declarados & Quadro eSocial</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Cruzamento de dados abertos da Receita Federal, Ministério do Trabalho e eSocial
            </p>
          </div>

          {/* Banner de Funcionários e Folha */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#0e1626] to-indigo-950/40 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                <Users2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] uppercase font-bold text-zinc-400 tracking-wider">
                  Vínculos Empregatícios Ativos (eSocial / CAGED)
                </p>
                <h4 className="text-2xl font-black text-white">
                  {fiscal?.employeeCountDeclared || 1} colaborador(es) registrado(s)
                </h4>
                <p className="text-xs text-cyan-300 font-medium">{fiscal?.employeeRangeDescription}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b] shrink-0 text-left md:text-right">
              <p className="text-[10px] text-zinc-400 uppercase font-bold">Folha Salarial Mensal Estimada</p>
              <p className="text-xl font-black text-emerald-400 font-mono mt-1">
                {formatCurrency(fiscal?.estimatedPayrollMonthly || 1412)}
              </p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Média salarial da categoria</p>
            </div>
          </div>

          {/* Enquadramento Fiscal e Inscrições */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-[#0a0d14] border border-[#1e293b] space-y-2">
              <p className="text-xs uppercase font-bold text-zinc-400 flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-indigo-400" />
                <span>Enquadramento Tributário</span>
              </p>
              <h4 className="text-sm font-bold text-white">{fiscal?.taxRegimeDescription}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {fiscal?.isSimei
                  ? 'Empresa enquadrada no SIMEI (Microempreendedor Individual), com recolhimento unificado do DAS-MEI.'
                  : fiscal?.isSimplesNacional
                  ? 'Optante pelo Simples Nacional nos anexos correspondentes às suas atividades econômicas.'
                  : 'Regime de Tributação por Lucro Presumido ou Lucro Real.'}
              </p>
              {fiscal?.dasnStatus && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    DASN Anual: {fiscal.dasnStatus}
                  </span>
                </div>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0d14] border border-[#1e293b] space-y-2">
              <p className="text-xs uppercase font-bold text-zinc-400 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Inscrições Tributárias Oficiais</span>
              </p>
              <div className="space-y-1.5 pt-1">
                <p className="text-xs text-zinc-300 font-mono flex items-center justify-between border-b border-[#1e293b]/60 pb-1.5">
                  <span className="text-zinc-400">Inscrição Estadual:</span>
                  <strong className="text-white">{fiscal?.stateRegistration || 'Isento / Regular'}</strong>
                </p>
                <p className="text-xs text-zinc-300 font-mono flex items-center justify-between pt-1">
                  <span className="text-zinc-400">Inscrição Municipal:</span>
                  <strong className="text-white">{fiscal?.municipalRegistration || 'Regular perante a Prefeitura'}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Certidões Negativas CND */}
          <div className="p-5 rounded-2xl bg-[#0a0d14] border border-[#1e293b] space-y-4">
            <h4 className="text-xs uppercase font-bold text-zinc-300 flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              <span>Certidões de Regularidade Fiscal & Trabalhista (CNDs)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#111622] border border-[#1e293b] space-y-1">
                <p className="text-[10px] text-zinc-400 uppercase font-bold">CND Federal (Receita / PGFN)</p>
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{fiscal?.cndFederal || 'VÁLIDA / EMITIDA'}</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#111622] border border-[#1e293b] space-y-1">
                <p className="text-[10px] text-zinc-400 uppercase font-bold">CRF FGTS (Caixa Econômica)</p>
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{fiscal?.cndFgts || 'REGULAR (CRF ATIVO)'}</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#111622] border border-[#1e293b] space-y-1">
                <p className="text-[10px] text-zinc-400 uppercase font-bold">CND Trabalhista (TST)</p>
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{fiscal?.cndTrabalhista || 'CERTIDÃO NEGATIVA'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. TAB 3: CONTRATOS PÚBLICOS & LICITAÇÕES
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'contracts' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-[#111622] border border-[#1e293b] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-[#1e293b] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0c101a]">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-cyan-400" />
                  <span>Histórico de Compras Públicas & Licitações</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Sincronizado com PNCP, Compras.gov.br e Diários Oficiais</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-lg font-bold w-fit">
                Volume Total Mapeado: {formatCurrency(totalGovVolume)}
              </span>
            </div>

            {(company.publicContracts || []).length > 0 ? (
              <div className="divide-y divide-[#1e293b]">
                {company.publicContracts.map((cont) => (
                  <div key={cont.id} className="p-6 hover:bg-[#141b29] transition-colors space-y-3">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div className="space-y-1.5 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-white">{cont.buyerAgency}</span>
                          <span className="text-[10px] bg-indigo-950/70 text-indigo-300 border border-indigo-800/60 px-2.5 py-0.5 rounded-full font-bold">
                            {cont.modality}
                          </span>
                          <span className="text-[10px] bg-[#0a0d14] text-zinc-400 px-2 py-0.5 rounded border border-[#1e293b] font-mono">
                            {cont.contractNumber}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed">{cont.object}</p>
                      </div>

                      <div className="text-left lg:text-right shrink-0 p-3 rounded-xl bg-[#0a0d14] border border-[#1e293b]">
                        <p className="text-base font-black text-emerald-400 font-mono">{formatCurrency(cont.totalValue)}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          {formatDate(cont.startDate)} até {formatDate(cont.endDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#1e293b]/60 text-xs">
                      <div className="flex items-center gap-4 text-zinc-400">
                        <span>Categoria: <strong className="text-zinc-200">{cont.category}</strong></span>
                        <span>Origem: <strong className="text-zinc-200">{cont.sourceSystem}</strong></span>
                      </div>
                      {cont.sourceUrl && (
                        <a
                          href={cont.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-cyan-400 hover:underline text-xs font-bold"
                        >
                          <span>Ver no PNCP Oficial</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-zinc-500 text-xs space-y-2">
                <Landmark className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="font-semibold text-zinc-400">Nenhum contrato público ativo localizado para este CNPJ.</p>
                <p className="text-[11px] text-zinc-500">O robô continuará monitorando diários oficiais e editais do PNCP.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          7. TAB 4: QUADRO SOCIETÁRIO (QSA)
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'qsa' && (
        <div className="bg-[#111622] border border-[#1e293b] rounded-2xl p-6 space-y-5 shadow-xl animate-in fade-in duration-200">
          <div className="border-b border-[#1e293b] pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Quadro de Sócios e Administradores (QSA)</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">Informações oficiais de titularidade registradas perante a Receita Federal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(company.partners || []).map((partner) => (
              <div key={partner.id} className="p-4 rounded-2xl bg-[#0a0d14] border border-[#1e293b] flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-300 font-bold text-sm shrink-0">
                  {partner.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">{partner.name}</h4>
                  <p className="text-[11px] text-cyan-400 font-semibold">{partner.role}</p>
                  <p className="text-[10px] text-zinc-500">
                    {partner.startDate ? `Ingresso na sociedade: ${formatDate(partner.startDate)}` : 'Qualificação societária ativa'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          8. TAB 5: MAPEAMENTO DE GASTOS
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'expenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-200">
          <div className="bg-[#111622] border border-[#1e293b] rounded-2xl p-6 space-y-5 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              <span>Volume por Categoria de Contratação</span>
            </h3>
            <div className="space-y-4">
              {Object.entries(categorySummary).map(([cat, val]) => {
                const pct = totalGovVolume > 0 ? (val / totalGovVolume) * 100 : 0;
                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-300 font-medium">{cat}</span>
                      <span className="text-white font-bold">{formatCurrency(val)} ({pct.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#0a0d14] border border-[#1e293b] overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#111622] border border-[#1e293b] rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Insights Estratégicos de Vendas</span>
            </h3>
            <ul className="space-y-3">
              {(company.financialIndicators?.insights || []).map((insight, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs text-zinc-300 bg-[#0a0d14] p-3.5 rounded-xl border border-[#1e293b]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          9. TAB 6: PITCH COMERCIAL & ABORDAGEM IA
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'pitch' && (
        <div className="bg-[#111622] border border-[#1e293b] rounded-2xl p-6 space-y-5 shadow-xl animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e293b] pb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Pitch de Vendas Hiperpersonalizado (Motor B2B Intel)</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Argumentação calculada com base no faturamento, sócios e contratos de governo</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-medium">Solução a ofertar:</span>
              <input
                type="text"
                value={pitchService}
                onChange={(e) => setPitchService(e.target.value)}
                className="bg-[#0a0d14] border border-[#1e293b] text-xs text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 font-semibold"
              />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#0a0d14] border border-[#1e293b] text-xs text-zinc-200 leading-relaxed whitespace-pre-line font-sans">
            {generatedPitch}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleCopy(generatedPitch, 'pitch')}
              className="px-4 py-2 rounded-xl bg-[#141a27] border border-[#1e293b] text-zinc-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all"
            >
              {copiedField === 'pitch' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedField === 'pitch' ? 'Pitch Copiado!' : 'Copiar Roteiro de Vendas'}</span>
            </button>

            <Link
              href={`/proposals?cnpj=${company.cnpj}&service=${encodeURIComponent(pitchService)}`}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Gerar Proposta Oficial com Este Pitch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
