import React from 'react';
import { ProposalBuilder } from '@/components/proposals/ProposalBuilder';
import { getCompanyByCnpj, getProposals, searchCompanies } from '@/lib/data-service';
import { FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ProposalsPageProps {
  searchParams: {
    cnpj?: string;
    service?: string;
  };
}

export default async function ProposalsPage({ searchParams }: ProposalsPageProps) {
  const { data: allCompanies } = await searchCompanies({ limit: 50 });
  const initialCompany = searchParams.cnpj ? await getCompanyByCnpj(searchParams.cnpj) : undefined;
  const initialProposals = await getProposals();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5" />
          <span>Propostas & Pitches Hiperpersonalizados</span>
        </div>
        <h1 className="text-2xl font-black text-white mt-1">Gerador de Propostas Comerciais</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Gere minutas de propostas adaptadas aos dados de faturamento, capacidade de investimento e histórico de licitações do prospect.
        </p>
      </div>

      <ProposalBuilder
        initialCompany={initialCompany || undefined}
        allCompanies={allCompanies}
        initialProposals={initialProposals}
      />
    </div>
  );
}
