import { NextRequest, NextResponse } from 'next/server';
import { fetchMunicipiosByState } from '@/lib/brasil-api';
import { CNAE_MARKET_GROUPS, TOP_CNAES_PROSPECTING } from '@/lib/cnae-map';

export const dynamic = 'force-dynamic';

const UF_NOMES: Record<string, string> = {
  AC:'Acre',AL:'Alagoas',AP:'Amapá',AM:'Amazonas',BA:'Bahia',CE:'Ceará',
  DF:'Distrito Federal',ES:'Espírito Santo',GO:'Goiás',MA:'Maranhão',
  MT:'Mato Grosso',MS:'Mato Grosso do Sul',MG:'Minas Gerais',PA:'Pará',
  PB:'Paraíba',PR:'Paraná',PE:'Pernambuco',PI:'Piauí',RJ:'Rio de Janeiro',
  RN:'Rio Grande do Norte',RS:'Rio Grande do Sul',RO:'Rondônia',RR:'Roraima',
  SC:'Santa Catarina',SP:'São Paulo',SE:'Sergipe',TO:'Tocantins',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'states') {
      return NextResponse.json({
        states: Object.entries(UF_NOMES).map(([uf, name]) => ({ uf, name })).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
      });
    }

    if (type === 'cities') {
      const uf = searchParams.get('uf');
      if (!uf || !UF_NOMES[uf]) {
        return NextResponse.json({ error: 'UF inválida' }, { status: 400 });
      }
      const cities = await fetchMunicipiosByState(uf);
      return NextResponse.json({ uf, cities });
    }

    if (type === 'cnaes') {
      return NextResponse.json({
        groups: CNAE_MARKET_GROUPS,
        all: TOP_CNAES_PROSPECTING,
      });
    }

    // Default: return all reference data
    return NextResponse.json({
      states: Object.entries(UF_NOMES).map(([uf, name]) => ({ uf, name })),
      cnaeGroups: CNAE_MARKET_GROUPS,
    });
  } catch (error) {
    console.error('Error in /api/lookup:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
