'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  Calculator,
  FileText,
  BookmarkCheck,
  ShieldCheck,
  Zap,
  Globe,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'Busca & Filtros B2B',
    href: '/search',
    icon: Search,
    badge: null,
  },
  {
    name: 'Calculadora de Ticket',
    href: '/calculator',
    icon: Calculator,
    badge: null,
  },
  {
    name: 'Gerador de Propostas',
    href: '/proposals',
    icon: FileText,
    badge: null,
  },
  {
    name: 'Listas & Pipeline',
    href: '/lists',
    icon: BookmarkCheck,
    badge: null,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  // If in public landing, login, or signup pages, hide sidebar
  if (pathname === '/landing' || pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <aside className="w-64 bg-[#0d121d] border-r border-[#1e293b] flex flex-col justify-between h-screen sticky top-0 z-40">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-[#1e293b] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tight leading-none flex items-center gap-1">
                Prospect<span className="text-cyan-400">AI</span>
              </h1>
              <p className="text-xs text-zinc-400 mt-1">Captação & Inteligência B2B</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          <p className="px-3 py-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Navegação Principal
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#151c2c]'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive ? 'text-cyan-400' : 'text-zinc-400 group-hover:text-zinc-200'
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-medium px-2 py-0.5 rounded-full',
                      isActive
                        ? 'bg-indigo-500/30 text-indigo-200'
                        : 'bg-[#1e293b] text-zinc-400 group-hover:bg-[#283548]'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-[#1e293b]/60 space-y-1">
            <Link
              href="/landing"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-[#151c2c] transition-all"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Ver Landing Page</span>
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair / Trocar Login</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Bottom Status Card */}
      <div className="p-4 border-t border-[#1e293b]">
        <div className="p-3 rounded-xl bg-[#131a29] border border-[#1e293b] space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Base RFB Online
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Inteligência de mercado e dados abertos em tempo real.
          </p>
        </div>
      </div>
    </aside>
  );
}
