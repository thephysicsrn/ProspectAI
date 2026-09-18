import { NextRequest, NextResponse } from 'next/server';
import { createProposal, getProposalById, getProposals } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const proposal = await getProposalById(id);
      if (!proposal) {
        return NextResponse.json({ error: 'Proposta não encontrada' }, { status: 404 });
      }
      return NextResponse.json(proposal);
    }

    const proposals = await getProposals();
    return NextResponse.json(proposals);
  } catch (error) {
    console.error('Error in GET /api/proposals:', error);
    return NextResponse.json({ error: 'Erro ao buscar propostas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const proposal = await createProposal(body);
    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/proposals:', error);
    return NextResponse.json({ error: 'Erro ao salvar proposta' }, { status: 500 });
  }
}
