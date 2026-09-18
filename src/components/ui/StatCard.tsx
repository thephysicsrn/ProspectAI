import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  accentColor?: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'purple';
}

const colorStyles = {
  indigo: {
    bg: 'from-indigo-950/30 to-indigo-900/10 border-indigo-500/20 hover:border-indigo-500/40',
    iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    glow: 'group-hover:bg-indigo-500/5',
  },
  cyan: {
    bg: 'from-cyan-950/30 to-cyan-900/10 border-cyan-500/20 hover:border-cyan-500/40',
    iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    glow: 'group-hover:bg-cyan-500/5',
  },
  emerald: {
    bg: 'from-emerald-950/30 to-emerald-900/10 border-emerald-500/20 hover:border-emerald-500/40',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    glow: 'group-hover:bg-emerald-500/5',
  },
  amber: {
    bg: 'from-amber-950/30 to-amber-900/10 border-amber-500/20 hover:border-amber-500/40',
    iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    glow: 'group-hover:bg-amber-500/5',
  },
  purple: {
    bg: 'from-purple-950/30 to-purple-900/10 border-purple-500/20 hover:border-purple-500/40',
    iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    glow: 'group-hover:bg-purple-500/5',
  },
};

export function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendPositive,
  accentColor = 'indigo',
}: StatCardProps) {
  const styles = colorStyles[accentColor];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-gradient-to-b p-5 transition-all duration-300 group',
        'bg-[#111622]',
        styles.bg
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-400 tracking-wide uppercase">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1.5 tracking-tight">{value}</h3>
          {subtext && <p className="text-xs text-zinc-400 mt-1">{subtext}</p>}
        </div>
        <div className={cn('p-3 rounded-xl border', styles.iconBg)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-[#1e293b]/60 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              'font-semibold px-1.5 py-0.5 rounded',
              trendPositive
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-rose-500/20 text-rose-300'
            )}
          >
            {trend}
          </span>
          <span className="text-zinc-500">vs. período anterior</span>
        </div>
      )}
    </div>
  );
}
