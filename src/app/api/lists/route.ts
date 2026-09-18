import { NextRequest, NextResponse } from 'next/server';
import { addCompanyToList, createProspectList, getProspectLists, updateProspectStatus } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const lists = getProspectLists();
    return NextResponse.json(lists);
  } catch (error) {
    console.error('Error in GET /api/lists:', error);
    return NextResponse.json({ error: 'Erro ao buscar listas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create_list') {
      const { name, description, filterCriteria } = body;
      const list = createProspectList(name, description, filterCriteria);
      return NextResponse.json(list, { status: 201 });
    }

    if (action === 'add_company') {
      const { listId, companyId, notes, tags } = body;
      const success = addCompanyToList(listId, companyId, notes, tags);
      return NextResponse.json({ success });
    }

    if (action === 'update_status') {
      const { listId, itemId, status, notes } = body;
      const success = updateProspectStatus(listId, itemId, status, notes);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: 'Ação não especificada ou inválida' }, { status: 400 });
  } catch (error) {
    console.error('Error in POST /api/lists:', error);
    return NextResponse.json({ error: 'Erro ao processar lista' }, { status: 500 });
  }
}
