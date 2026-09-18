import React from 'react';
import { TicketCalculatorWidget } from '@/components/calculator/TicketCalculatorWidget';
import { searchCompanies, getCompanyByCnpj } from '@/lib/data-service';
import { Calculator } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface CalculatorPageProps {
  searchParams: {
    cnpj?: string;
  };
}

export default async function CalculatorPage({ searchParams }: CalculatorPageProps) {
  const { data: allCompanies } = await searchCompanies({ limit: 50 });
  const initialCompany = searchParams.cnpj ? await getCompanyByCnpj(searchParams.cnpj) : undefined;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
          <Calculator className="w-3.5 h-3.5" />
          <span>Dimensionamento & Precificação Estratégica</span>
        </div>
        <h1 className="text-2xl font-black text-white mt-1">Calculadora de Capacidade Financeira & Ticket Médio</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Algoritmo que cruza porte cadastral, faturamento presumido e contratos públicos vigentes para calcular o ticket ideal de venda.
        </p>
      </div>

      <TicketCalculatorWidget
        initialCompany={initialCompany || undefined}
        allCompanies={allCompanies}
      />
    </div>
  );
}
