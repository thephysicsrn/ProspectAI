'use client';

import React, { useState, useEffect } from 'react';
import { Company, Proposal, ProposalItem } from '@/types';
import { generatePitchRationale } from '@/lib/estimators';
import { formatCurrency, formatCNPJ, formatCompactCurrency } from '@/lib/utils';
import {
  FileText,
  Sparkles,
  Plus,
  Trash2,
  Download,
  Printer,
  Save,
  CheckCircle,
  Building,
  Landmark,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProposalBuilderProps {
  initialCompany?: Company;
  allCompanies: Company[];
  initialProposals: Proposal[];
}

export function ProposalBuilder({
  initialCompany,
  allCompanies,
  initialProposals,
}: ProposalBuilderProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    initialCompany?.id || allCompanies[0]?.id || ''
  );
  const [title, setTitle] = useState<string>(
    'Proposta Comercial de Transformação Digital & Consultoria Estratégica'
  );
  const [pricingModel, setPricingModel] = useState<'MENSAL' | 'PONTUAL' | 'HIBRIDO'>('MENSAL');
  const [items, setItems] = useState<ProposalItem[]>([
    {
      id: 'item-1',
      title: 'Implantação de Plataforma de Inteligência & Automação',
      description: 'Setup completo, parametrização de fluxos e integração com sistemas legados.',
      category: 'Tecnologia',
      quantity: 1,
      unitPrice: 12000,
      totalPrice: 12000,
    },
    {
      id: 'item-2',
      title: 'Consultoria Mensal & Suporte Dedicado',
      description: 'Acompanhamento contínuo de metas, suporte 24/7 e relatórios analíticos de eficiência.',
      category: 'Serviços',
      quantity: 1,
      unitPrice: 6500,
      totalPrice: 6500,
    },
  ]);
  const [pitchRationale, setPitchRationale] = useState<string>('');
  const [terms, setTerms] = useState<string>(
    'Pagamento até o 10º dia útil. Vigência de 12 meses renovável. Impostos e tributos já inclusos no valor.'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const currentCompany = allCompanies.find((c) => c.id === selectedCompanyId) || initialCompany;

  // Auto update pitch when company changes
  useEffect(() => {
    if (currentCompany) {
      const generated = generatePitchRationale(
        currentCompany,
        currentCompany.publicContracts,
        'Plataforma de Inteligência & Otimização de Processos'
      );
      setPitchRationale(generated);
      
      // Auto-suggest values based on capability
      if (currentCompany.financialIndicators) {
        const monthly = currentCompany.financialIndicators.suggestedMonthlyTicketMin;
        setItems([
          {
            id: 'item-1',
            title: 'Sustentação Estratégica & Gestão de Performance',
            description: `Alinhado às operações e contratos governamentais em execução (${currentCompany.city}/${currentCompany.state}).`,
            category: 'Consultoria',
            quantity: 1,
            unitPrice: monthly,
            totalPrice: monthly,
          },
        ]);
      }
    }
  }, [selectedCompanyId]);

  const totalProposedValue = items.reduce((acc, curr) => acc + curr.totalPrice, 0);

  const addItem = () => {
    const newItem: ProposalItem = {
      id: `item-${Date.now()}`,
      title: 'Novo Módulo / Serviço Personalizado',
      description: 'Descrição detalhada dos entregáveis e escopo de atuação.',
      category: 'Geral',
      quantity: 1,
      unitPrice: 3000,
      totalPrice: 3000,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<ProposalItem>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          updated.totalPrice = updated.quantity * updated.unitPrice;
          return updated;
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSave = async () => {
    if (!currentCompany) return;
    try {
      const payload = {
        companyId: currentCompany.id,
        companyName: currentCompany.tradeName || currentCompany.legalName,
        companyCnpj: currentCompany.cnpj,
        title,
        status: 'GENERATED',
        proposedValue: totalProposedValue,
        pricingModel,
        items,
        pitchRationale,
        clientContext: {
          estimatedRevenue: `${formatCompactCurrency(currentCompany.financialIndicators.estimatedAnnualRevenueMin)} - ${formatCompactCurrency(currentCompany.financialIndicators.estimatedAnnualRevenueMax)}`,
          contractsSummary: `${currentCompany.publicContracts.length} contratos vigentes`,
          financialScore: currentCompany.financialIndicators.financialCapacityScore,
          suggestedTicket: `${formatCurrency(currentCompany.financialIndicators.suggestedMonthlyTicketMin)}/mês`,
        },
        termsAndConditions: terms,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };

      await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error('Erro ao salvar proposta:', e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Selector & Mode Switch */}
      <div className="bg-[#111622] border border-[#1e293b] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-indigo-400" />
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-white">Gerador de Propostas Hiperpersonalizadas</h2>
            <p className="text-xs text-zinc-400">Propostas comerciais baseadas em dados e contratos públicos</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all',
              previewMode
                ? 'bg-cyan-600 text-white border-cyan-500'
                : 'bg-[#161e2e] text-zinc-300 border-[#1e293b] hover:text-white'
            )}
          >
            {previewMode ? 'Modo de Edição' : 'Visualizar Proposta Final'}
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-lg bg-[#161e2e] border border-[#1e293b] text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir / PDF
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
          >
            {savedSuccess ? <CheckCircle className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
            {savedSuccess ? 'Salvo com Sucesso!' : 'Salvar Proposta'}
          </button>
        </div>
      </div>

      {!previewMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* Target Company & Title */}
            <div className="bg-[#111622] border border-[#1e293b] rounded-xl p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Prospect / Empresa Destino</label>
                  <select
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                    className="w-full bg-[#0a0d14] border border-[#1e293b] text-xs text-white px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                    {allCompanies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.tradeName || c.legalName} ({formatCNPJ(c.cnpj)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Modelo de Cobrança</label>
                  <select
                    value={pricingModel}
                    onChange={(e) => setPricingModel(e.target.value as any)}
                    className="w-full bg-[#0a0d14] border border-[#1e293b] text-xs text-white px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                    <option value="MENSAL">Mensalidade / Fee Recorrente</option>
                    <option value="PONTUAL">Projeto Fechado / Pontual</option>
                    <option value="HIBRIDO">Híbrido (Setup + Mensalidade)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Título da Proposta</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0a0d14] border border-[#1e293b] text-xs text-white px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Line Items Builder */}
            <div className="bg-[#111622] border border-[#1e293b] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Itens e Serviços Ofertados</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.id} className="p-4 rounded-xl bg-[#0a0d14] border border-[#1e293b] space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateItem(item.id, { title: e.target.value })}
                        placeholder="Nome do serviço ou entregável"
                        className="w-full bg-[#111622] border border-[#1e293b] text-xs text-white px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length <= 1}
                        className="text-zinc-500 hover:text-rose-400 disabled:opacity-30 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      placeholder="Descrição detalhada do escopo"
                      rows={2}
                      className="w-full bg-[#111622] border border-[#1e293b] text-xs text-zinc-300 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 leading-relaxed"
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] text-zinc-400">Quantidade</label>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
                          className="w-full bg-[#111622] border border-[#1e293b] text-xs text-white px-2 py-1 rounded"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-zinc-400">Valor Unitário (R$)</label>
                        <input
                          type="number"
                          step={500}
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })}
                          className="w-full bg-[#111622] border border-[#1e293b] text-xs text-white px-2 py-1 rounded font-mono"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1 text-right">
                        <label className="text-[10px] text-zinc-400">Subtotal</label>
                        <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                          {formatCurrency(item.totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#1e293b] flex justify-between items-center">
                <span className="text-xs text-zinc-400">Valor Total Proposto:</span>
                <span className="text-lg font-black text-white font-mono">
                  {formatCurrency(totalProposedValue)} {pricingModel === 'MENSAL' ? '/mês' : ''}
                </span>
              </div>
            </div>

            {/* AI Pitch Rationale */}
            <div className="bg-[#111622] border border-[#1e293b] rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Argumentação Estratégica & Contexto de Compras Públicas
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (currentCompany) {
                      setPitchRationale(
                        generatePitchRationale(
                          currentCompany,
                          currentCompany.publicContracts,
                          title
                        )
                      );
                    }
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> Regenerar com IA
                </button>
              </div>

              <textarea
                value={pitchRationale}
                onChange={(e) => setPitchRationale(e.target.value)}
                rows={5}
                className="w-full bg-[#0a0d14] border border-[#1e293b] text-xs text-zinc-200 p-3 rounded-lg focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
              />
            </div>
          </div>

          {/* Right Column: Prospect Intelligence Summary */}
          <div className="lg:col-span-4 space-y-6">
            {currentCompany && (
              <div className="bg-[#111622] border border-[#1e293b] rounded-xl p-5 space-y-4">
                <div className="pb-3 border-b border-[#1e293b]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Dossiê do Prospect Selecionado
                  </h3>
                  <p className="text-sm font-bold text-white mt-1">
                    {currentCompany.tradeName || currentCompany.legalName}
                  </p>
                  <p className="text-xs text-zinc-400 font-mono">{formatCNPJ(currentCompany.cnpj)}</p>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Porte:</span>
                    <span className="font-semibold text-white">{currentCompany.companySize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Faturamento Presumido:</span>
                    <span className="font-semibold text-cyan-400">
                      {formatCompactCurrency(currentCompany.financialIndicators.estimatedAnnualRevenueMin)} –{' '}
                      {formatCompactCurrency(currentCompany.financialIndicators.estimatedAnnualRevenueMax)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Contratos PNCP Ativos:</span>
                    <span className="font-semibold text-emerald-400">
                      {currentCompany.publicContracts.length} ({formatCompactCurrency(
                        currentCompany.publicContracts.reduce((s, c) => s + c.totalValue, 0)
                      )})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Ticket Sugerido:</span>
                    <span className="font-semibold text-indigo-400">
                      {formatCurrency(currentCompany.financialIndicators.suggestedMonthlyTicketMin)}/mês
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#0a0d14] border border-[#1e293b] text-[11px] text-zinc-400 leading-relaxed">
                  <p className="font-semibold text-zinc-300 mb-1">Dica de Negociação:</p>
                  A empresa possui orçamento alocado e lastreado em órgãos públicos. Proponha cronograma de pagamentos compatível com os empenhos governamentais.
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Preview / Printable Document Sheet */
        <div className="max-w-4xl mx-auto bg-white text-zinc-900 rounded-2xl p-10 shadow-2xl space-y-8 print:p-0 print:shadow-none print:max-w-none">
          {/* Document Header */}
          <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-6">
            <div>
              <span className="text-xs uppercase font-bold text-indigo-600 tracking-widest">
                Proposta Comercial B2B
              </span>
              <h1 className="text-2xl font-black text-zinc-900 mt-1">{title}</h1>
              <p className="text-xs text-zinc-500 mt-1">
                Data de Emissão: {new Date().toLocaleDateString('pt-BR')} | Validade: 30 dias
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black tracking-tight text-zinc-900">ProspectAI</span>
              <p className="text-xs text-zinc-500">Unidade de Soluções Corporativas</p>
            </div>
          </div>

          {/* Client Info Block */}
          {currentCompany && (
            <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-200 grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-zinc-500 uppercase font-semibold text-[10px]">Cliente / Prospect</p>
                <p className="font-bold text-zinc-900 text-sm mt-0.5">
                  {currentCompany.tradeName || currentCompany.legalName}
                </p>
                <p className="text-zinc-600">{currentCompany.legalName}</p>
                <p className="font-mono text-zinc-600">CNPJ: {formatCNPJ(currentCompany.cnpj)}</p>
              </div>
              <div className="text-right">
                <p className="text-zinc-500 uppercase font-semibold text-[10px]">Localização & Atuação</p>
                <p className="font-medium text-zinc-800 mt-0.5">{currentCompany.city} - {currentCompany.state}</p>
                <p className="text-zinc-600">{currentCompany.primaryCnaeDesc}</p>
              </div>
            </div>
          )}

          {/* Context & Pitch Block */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-zinc-900 tracking-wider">
              1. Justificativa Estratégica & Contexto do Negócio
            </h3>
            <div className="text-xs text-zinc-700 leading-relaxed whitespace-pre-line bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
              {pitchRationale}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-zinc-900 tracking-wider">
              2. Escopo dos Serviços & Investimento
            </h3>
            <table className="w-full text-left text-xs border-collapse border border-zinc-200 rounded-lg overflow-hidden">
              <thead className="bg-zinc-100 border-b border-zinc-200 text-zinc-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Item / Serviço</th>
                  <th className="py-2.5 px-3">Qtd</th>
                  <th className="py-2.5 px-3 text-right">Valor Unitário</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 px-3">
                      <p className="font-bold text-zinc-900">{item.title}</p>
                      <p className="text-zinc-500 text-[11px]">{item.description}</p>
                    </td>
                    <td className="py-3 px-3 text-zinc-700">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono text-zinc-700">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-zinc-900">
                      {formatCurrency(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-zinc-100 font-bold border-t-2 border-zinc-300">
                <tr>
                  <td colSpan={3} className="py-3 px-3 text-right uppercase text-[11px] text-zinc-800">
                    Investimento Total ({pricingModel === 'MENSAL' ? 'Recorrência Mensal' : 'Projeto'}):
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-base font-black text-indigo-700">
                    {formatCurrency(totalProposedValue)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Terms */}
          <div className="space-y-1 text-xs pt-4 border-t border-zinc-200 text-zinc-600">
            <h4 className="font-bold text-zinc-900 uppercase text-[10px]">Condições Gerais:</h4>
            <p>{terms}</p>
          </div>
        </div>
      )}
    </div>
  );
}
