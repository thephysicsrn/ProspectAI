'use client';

import React, { useState } from 'react';
import { Company } from '@/types';
import { formatCNPJ, formatCurrency, formatCompactCurrency, formatDate } from '@/lib/utils';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  User,
  X,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Building2,
  Sparkles,
  ShieldCheck,
  FileText,
  FileCheck2,
  Users2,
  Receipt,
  BadgeCheck,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ContactModalProps {
  company: Company | null;
  onClose: () => void;
}

export function ContactModal({ company, onClose }: ContactModalProps) {
  const [activeTab, setActiveTab] = useState<'contacts' | 'fiscal'>('contacts');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!company) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const cleanPhone = company.phone ? company.phone.replace(/\D/g, '') : '';
  const waNumber = cleanPhone.length >= 10 ? `55${cleanPhone}` : '';

  const ownerName = company.partners[0]?.name || company.legalName;
  const waMessage = encodeURIComponent(
    `Olá ${ownerName}, tudo bem? Me chamo Agente de Captação da ProspectAI. Identificamos a atuação da ${company.tradeName || company.legalName} em ${company.city}/${company.state} e gostaríamos de apresentar uma proposta sob medida.`
  );

  const fullAddress = `${company.street ? `${company.street}, ${company.number || 'S/N'}` : ''}${
    company.neighborhood ? ` - ${company.neighborhood}` : ''
  }, ${company.city} - ${company.state}, CEP ${company.zipCode || '59000-000'}`;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${company.legalName} ${fullAddress}`
  )}`;

  const fiscal = company.fiscalData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#111622] border border-[#1e293b] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#1e293b] flex items-start justify-between bg-[#0e131f]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-600/20 shrink-0">
              {company.tradeName ? company.tradeName.slice(0, 2).toUpperCase() : company.legalName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight leading-tight">
                  {company.tradeName || company.legalName}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {company.companySize}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                  {company.status}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 font-mono">{formatCNPJ(company.cnpj)}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#161e2e] text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#1e293b] bg-[#0c101a] px-5 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('contacts')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all',
              activeTab === 'contacts'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            )}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Contatos & Decisores (WhatsApp)</span>
          </button>

          <button
            onClick={() => setActiveTab('fiscal')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all',
              activeTab === 'fiscal'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            )}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Dados Fiscais & Funcionários (eSocial / RFB)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {activeTab === 'contacts' ? (
            <div className="space-y-4">
              {/* Decisor / Sócio Titular */}
              <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-300">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      Responsável / Titular MEI
                    </p>
                    <p className="text-xs font-bold text-white mt-0.5">{ownerName}</p>
                    <p className="text-[10px] text-cyan-400 font-medium">
                      {company.partners[0]?.role || 'Empresário Individual'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(ownerName, 'owner')}
                  className="p-2 rounded-lg bg-[#161e2e] text-zinc-400 hover:text-white transition-colors"
                  title="Copiar Nome"
                >
                  {copiedField === 'owner' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Telefone & WhatsApp / E-mail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Telefone / WhatsApp */}
                <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Telefone / WhatsApp</span>
                    </div>
                    <button
                      onClick={() => handleCopy(company.phone || '', 'phone')}
                      className="text-zinc-500 hover:text-white"
                      title="Copiar Telefone"
                    >
                      {copiedField === 'phone' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <p className="text-sm font-bold text-white font-mono">{company.phone || '(84) 98800-0000'}</p>

                  {waNumber && (
                    <a
                      href={`https://wa.me/${waNumber}?text=${waMessage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Conversar no WhatsApp</span>
                    </a>
                  )}
                </div>

                {/* E-mail de Contato */}
                <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                      <Mail className="w-3.5 h-3.5" />
                      <span>E-mail Oficial</span>
                    </div>
                    <button
                      onClick={() => handleCopy(company.email || '', 'email')}
                      className="text-zinc-500 hover:text-white"
                      title="Copiar E-mail"
                    >
                      {copiedField === 'email' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <p className="text-xs font-medium text-zinc-200 truncate" title={company.email}>
                    {company.email || 'contato@empresa.com.br'}
                  </p>

                  {company.email && (
                    <a
                      href={`mailto:${company.email}?subject=Oportunidade Comercial ProspectAI`}
                      className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Enviar E-mail Direto</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Endereço */}
              <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Endereço Cadastral Registrado</span>
                  </div>
                  <button
                    onClick={() => handleCopy(fullAddress, 'address')}
                    className="text-zinc-500 hover:text-white"
                    title="Copiar Endereço"
                  >
                    {copiedField === 'address' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{fullAddress}</p>
                <div className="pt-2 flex justify-end">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Abrir no Google Maps <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* TAB DADOS FISCAIS & ESOCIAL */
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Quantidade de Funcionários (eSocial / CAGED) */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border border-cyan-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                    <Users2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400">Vínculos Ativos no eSocial / RAIS</p>
                    <h4 className="text-lg font-black text-white mt-0.5">
                      {fiscal?.employeeCountDeclared || 1} colaborador(es) registrado(s)
                    </h4>
                    <p className="text-[11px] text-cyan-300 font-medium">{fiscal?.employeeRangeDescription}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">Folha Mensal Estimada</p>
                  <p className="text-sm font-bold text-emerald-400 font-mono">
                    {formatCurrency(fiscal?.estimatedPayrollMonthly || 1412)}
                  </p>
                </div>
              </div>

              {/* Regime Tributário Declarado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b] space-y-1.5">
                  <p className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                    <Receipt className="w-3.5 h-3.5 text-indigo-400" /> Enquadramento Fiscal
                  </p>
                  <p className="text-xs font-bold text-white">{fiscal?.taxRegimeDescription}</p>
                  <p className="text-[10px] text-zinc-500">
                    {fiscal?.isSimei ? 'Optante pelo SIMEI (MEI)' : fiscal?.isSimplesNacional ? 'Optante pelo Simples Nacional' : 'Regime Geral'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b] space-y-1.5">
                  <p className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Registros Estaduais & Municipais
                  </p>
                  <p className="text-xs font-mono text-zinc-200">
                    Insc. Estadual: <strong className="text-white">{fiscal?.stateRegistration || 'Isento / Não aplicável'}</strong>
                  </p>
                  <p className="text-xs font-mono text-zinc-200">
                    Insc. Municipal: <strong className="text-white">{fiscal?.municipalRegistration || 'Regular'}</strong>
                  </p>
                </div>
              </div>

              {/* Regularidade Fiscal & CNDs */}
              <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b] space-y-3">
                <p className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-emerald-400" /> Certidões Negativas de Débitos (CNDs Governamentais)
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#111622] border border-[#1e293b] space-y-1">
                    <p className="text-[10px] text-zinc-400">CND Receita Federal</p>
                    <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> {fiscal?.cndFederal || 'VÁLIDA'}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#111622] border border-[#1e293b] space-y-1">
                    <p className="text-[10px] text-zinc-400">CRF do FGTS (Caixa)</p>
                    <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> {fiscal?.cndFgts || 'REGULAR'}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#111622] border border-[#1e293b] space-y-1">
                    <p className="text-[10px] text-zinc-400">CND Trabalhista (TST)</p>
                    <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> {fiscal?.cndTrabalhista || 'NEGATIVA'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Capital Social & Faturamento Declarado */}
              <div className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b] flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">Capital Social Registrado</p>
                  <p className="text-sm font-black text-white font-mono">{formatCurrency(company.shareCapital)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">Faturamento Presumido Anual</p>
                  <p className="text-sm font-black text-cyan-400 font-mono">
                    {formatCompactCurrency(company.financialIndicators.estimatedAnnualRevenueMin)} –{' '}
                    {formatCompactCurrency(company.financialIndicators.estimatedAnnualRevenueMax)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#1e293b] bg-[#0e131f] flex items-center justify-between gap-3">
          <Link
            href={`/company/${company.cnpj}`}
            className="px-4 py-2 rounded-xl bg-[#161e2e] border border-[#1e293b] text-zinc-200 hover:text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ver Dossiê 360 Completo</span>
          </Link>

          <Link
            href={`/proposals?cnpj=${company.cnpj}`}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Gerar Proposta Comercial</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
