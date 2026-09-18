import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `R$ ${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toFixed(0)}k`;
  }
  return formatCurrency(value);
}

export function formatCNPJ(cnpj: string): string {
  const clean = cnpj.replace(/\D/g, '');
  if (clean.length !== 14) return cnpj;
  return clean.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  } catch {
    return dateString;
  }
}

export function getCompanySizeLabel(size: string): string {
  const map: Record<string, string> = {
    MEI: 'Microempreendedor Individual',
    ME: 'Microempresa (ME)',
    EPP: 'Empresa de Pequeno Porte (EPP)',
    MEDIO: 'Médio Porte',
    GRANDE: 'Grande Porte',
  };
  return map[size] || size;
}

export function getCompanySizeBadgeColor(size: string): string {
  const map: Record<string, string> = {
    MEI: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    ME: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
    EPP: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60',
    MEDIO: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
    GRANDE: 'bg-purple-950/60 text-purple-300 border-purple-800/60',
  };
  return map[size] || 'bg-zinc-800 text-zinc-300 border-zinc-700';
}

export function getScoreColor(score: number): { text: string; bg: string; border: string; ring: string } {
  if (score >= 80) {
    return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      ring: 'stroke-emerald-500',
    };
  }
  if (score >= 60) {
    return {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      ring: 'stroke-cyan-500',
    };
  }
  if (score >= 40) {
    return {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      ring: 'stroke-amber-500',
    };
  }
  return {
    text: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    ring: 'stroke-rose-500',
  };
}
