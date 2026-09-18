import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = getDashboardStats();
    const brazilUniverse = {
      totalCnpjsAtivos: 21832000,
      totalMeis: 15200000,
      totalContratosGov: 580000,
      volumeContratosGov: 480000000000,
      totalLicitacoesAbertas: 12400,
    };
    return NextResponse.json({ ...stats, brazilUniverse, lastUpdate: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: 'Erro.' }, { status: 500 });
  }
}
