import { NextRequest, NextResponse } from 'next/server';
import { getCompanyByCnpj } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: { cnpj: string } }
) {
  try {
    const { cnpj } = params;
    const company = await getCompanyByCnpj(cnpj);

    if (!company) {
      return NextResponse.json(
        { error: 'Empresa não encontrada na base local nem na Receita Federal.' },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error in /api/companies/[cnpj]:', error);
    return NextResponse.json({ error: 'Erro ao carregar dados da empresa.' }, { status: 500 });
  }
}
