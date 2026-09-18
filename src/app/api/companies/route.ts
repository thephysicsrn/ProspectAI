import { NextRequest, NextResponse } from 'next/server';
import { searchCompanies } from '@/lib/data-service';
import { CompanySize, SearchFilters } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('q') || searchParams.get('query') || undefined;
    const state = searchParams.get('state') || undefined;
    const city = searchParams.get('city') || undefined;
    const cnae = searchParams.get('cnae') || undefined;
    const sizesParam = searchParams.get('sizes');
    const companySize = sizesParam ? (sizesParam.split(',') as CompanySize[]) : undefined;
    const hasContracts = searchParams.get('hasContracts') === 'true';
    const minContractsVolume = searchParams.get('minContractsVolume') ? Number(searchParams.get('minContractsVolume')) : undefined;
    const minRevenue = searchParams.get('minRevenue') ? Number(searchParams.get('minRevenue')) : undefined;
    const maxRevenue = searchParams.get('maxRevenue') ? Number(searchParams.get('maxRevenue')) : undefined;
    const sortBy = (searchParams.get('sortBy') as any) || 'contracts';
    const sortOrder = (searchParams.get('sortOrder') as any) || 'desc';
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 20;

    const filters: SearchFilters = {
      query,
      state,
      city,
      cnae,
      companySize,
      hasPublicContracts: hasContracts,
      minContractsVolume,
      minRevenue,
      maxRevenue,
      sortBy,
      sortOrder,
      page,
      limit,
    };

    const result = await searchCompanies(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/companies:', error);
    return NextResponse.json({ error: 'Erro ao buscar empresas' }, { status: 500 });
  }
}
