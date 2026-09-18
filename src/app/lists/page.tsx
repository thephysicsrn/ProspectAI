import React from 'react';
import { getProspectLists } from '@/lib/data-service';
import {
  BookmarkCheck,
  Building2,
  Calendar,
  ExternalLink,
  Plus,
  Tag,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { formatCNPJ, formatCompactCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function ListsPage() {
  const lists = await getProspectLists();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Gestão de Leads & Segmentações</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Listas de Prospecção & Pipeline B2B</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Organize prospects por verticais, critérios de licitação e acompanhe a evolução do contato comercial.
          </p>
        </div>
      </div>

      {/* Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lists.map((list) => (
          <div
            key={list.id}
            className="bg-[#111622] border border-[#1e293b] rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">{list.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{list.description}</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 shrink-0">
                  {list.itemsCount} Lead(s)
                </span>
              </div>

              {/* Items Preview */}
              {list.items && list.items.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#1e293b]">
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Empresas na lista:</p>
                  {list.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-[#0a0d14] border border-[#1e293b] flex items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-white line-clamp-1">
                          {item.company.tradeName || item.company.legalName}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-mono">
                          {formatCNPJ(item.company.cnpj)} • {item.company.city}/{item.company.state}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-800/50">
                          {item.status}
                        </span>
                        <Link
                          href={`/company/${item.company.cnpj}`}
                          className="p-1 rounded bg-[#161e2e] text-zinc-400 hover:text-white"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#1e293b] flex items-center justify-between text-xs">
              <span className="text-[11px] text-zinc-500">
                Criada em {new Date(list.createdAt).toLocaleDateString('pt-BR')}
              </span>
              <Link
                href="/search"
                className="text-cyan-400 hover:underline font-semibold flex items-center gap-1"
              >
                Adicionar mais prospects <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
