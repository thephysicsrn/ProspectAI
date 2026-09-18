import { NextRequest, NextResponse } from 'next/server';
import { getCnpjSeedsByState, fetchCompanyFromBrasilApi, fetchPncpContracts } from '@/lib/brasil-api';
import { searchCompanies } from '@/lib/data-service';
import { CompanySize } from '@/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/bulk-search?state=SP&cnae=6201&size=MEI,ME&page=1&limit=20
 *
 * Busca em massa: combina dados locais (in-memory) + API real BrasilAPI
 * para entregar resultados paginados com dados reais da Receita Federal.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || undefined;
    const cnae = searchParams.get('cnae') || undefined;
    const sizesParam = searchParams.get('sizes');
    const sizes = sizesParam ? (sizesParam.split(',') as CompanySize[]) : undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);
    const query = searchParams.get('q') || undefined;
    const includeLive = searchParams.get('live') !== 'false'; // default true

    // 1. Primeiro, buscar na base local (rápido)
    const localResult = await searchCompanies({
      state, cnae, companySize: sizes, query, page, limit,
      sortBy: 'contracts', sortOrder: 'desc',
    });

    // 2. Se pediu dados ao vivo e temos CNPJs seeds para o estado
    if (includeLive && state && localResult.total < limit) {
      const seeds = getCnpjSeedsByState(state);
      const needed = limit - localResult.data.length;
      const toFetch = seeds.slice(0, Math.min(needed, 10)); // máx 10 por request

      const liveCompanies = await Promise.allSettled(
        toFetch.map(async (cnpj) => {
          const company = await fetchCompanyFromBrasilApi(cnpj);
          return company;
        })
      );

      const liveResults = liveCompanies
        .filter((r): r is PromiseFulfilledResult<NonNullable<Awaited<ReturnType<typeof fetchCompanyFromBrasilApi>>>> =>
          r.status === 'fulfilled' && r.value !== null
        )
        .map(r => r.value);

      // Mesclar: locais primeiro, depois live (sem duplicatas de CNPJ)
      const existingCnpjs = new Set(localResult.data.map(c => c.cnpj));
      const merged = [
        ...localResult.data,
        ...liveResults.filter(c => !existingCnpjs.has(c.cnpj)),
      ];

      return NextResponse.json({
        data: merged,
        total: merged.length + (localResult.total - localResult.data.length),
        page,
        totalPages: Math.ceil(localResult.total / limit),
        source: 'hybrid',
        liveCount: liveResults.length,
      });
    }

    return NextResponse.json({
      ...localResult,
      source: 'local',
      liveCount: 0,
    });
  } catch (error) {
    console.error('Bulk search error:', error);
    return NextResponse.json({ error: 'Erro na busca em massa.' }, { status: 500 });
  }
}
