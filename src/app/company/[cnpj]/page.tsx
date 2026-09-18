import React from 'react';
import { notFound } from 'next/navigation';
import { getCompanyByCnpj } from '@/lib/data-service';
import { CompanyDossier } from '@/components/dossier/CompanyDossier';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

interface CompanyPageProps {
  params: {
    cnpj: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function CompanyDetailPage({ params }: CompanyPageProps) {
  const company = await getCompanyByCnpj(params.cnpj);

  if (!company) {
    notFound();
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-[#1e293b]/50">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111622] border border-[#1e293b] text-xs font-semibold text-zinc-300 hover:text-white hover:border-cyan-500 transition-all w-fit group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Voltar para Busca de Empresas</span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-300 font-semibold">Dossiê 360°</span>
          <span className="text-zinc-500">·</span>
          <span>Inteligência Governamental & Fiscal</span>
        </div>
      </div>

      {/* Dossier Component */}
      <CompanyDossier company={company} />
    </div>
  );
}
