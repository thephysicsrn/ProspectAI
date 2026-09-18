import { NextRequest, NextResponse } from 'next/server';
import { calculateFinancialCapacity } from '@/lib/estimators';
import { CompanySize, TaxRegime } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companySize, shareCapital, activePublicContractsAnnualSum, taxRegime, primaryCnaeCode } = body;

    const result = calculateFinancialCapacity({
      companySize: (companySize as CompanySize) || 'EPP',
      shareCapital: Number(shareCapital) || 0,
      activePublicContractsAnnualSum: Number(activePublicContractsAnnualSum) || 0,
      taxRegime: (taxRegime as TaxRegime) || 'UNKNOWN',
      primaryCnaeCode,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/calculate:', error);
    return NextResponse.json({ error: 'Erro no cálculo de estimativa' }, { status: 500 });
  }
}
