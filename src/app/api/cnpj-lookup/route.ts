import { NextRequest, NextResponse } from 'next/server';
import { fetchCompanyFromBrasilApi, fetchPncpContracts } from '@/lib/brasil-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cnpj = searchParams.get('cnpj') || '';
    const clean = cnpj.replace(/\D/g, '');

    if (clean.length !== 14) {
      return NextResponse.json({ error: 'CNPJ inválido.' }, { status: 400 });
    }

    const company = await fetchCompanyFromBrasilApi(clean);
    if (!company) {
      return NextResponse.json({ error: 'CNPJ não encontrado.' }, { status: 404 });
    }

    const contracts = await fetchPncpContracts(clean);
    company.publicContracts = contracts;
    company.totalContractsVolume = contracts.reduce((s, c) => s + (c.totalValue || 0), 0);
    company.activeContractsCount = contracts.filter(c => c.status === 'VIGENTE').length;

    return NextResponse.json(company);
  } catch (error) {
    console.error('CNPJ lookup error:', error);
    return NextResponse.json({ error: 'Erro ao consultar.' }, { status: 500 });
  }
}
