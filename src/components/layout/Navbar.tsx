'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Sparkles, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [quickCnpj, setQuickCnpj] = useState('');
  const { user, userProfile, logout } = useAuth();

  // If in public landing, login, or signup pages, hide internal app navbar
  if (pathname === '/landing' || pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickCnpj.trim()) {
      const clean = quickCnpj.replace(/\D/g, '');
      if (clean.length === 14) {
        router.push(`/company/${clean}`);
      } else {
        router.push(`/search?q=${encodeURIComponent(quickCnpj.trim())}`);
      }
      setQuickCnpj('');
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const getPlanBadge = (plan?: string) => {
    switch (plan) {
      case 'starter':
        return { label: 'Starter SDR', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'enterprise':
        return { label: 'Enterprise AI', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'scale':
      default:
        return { label: 'Scale B2B Pro', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
    }
  };

  const planBadge = getPlanBadge(userProfile?.plan);
  const initials = userProfile?.adminName
    ? userProfile.adminName.substring(0, 2).toUpperCase()
    : user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : 'PA';

  return (
    <header className="h-16 bg-[#0a0d14]/80 backdrop-blur-md border-b border-[#1e293b] px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar */}
      <form onSubmit={handleQuickSearch} className="relative w-96 max-w-md">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={quickCnpj}
          onChange={(e) => setQuickCnpj(e.target.value)}
          placeholder="Busca rápida por Razão Social, CNAE ou CNPJ..."
          className="w-full bg-[#111622] border border-[#1e293b] text-xs text-zinc-200 pl-10 pr-20 py-2 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-500"
        />
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-[#1a2333] text-zinc-400 px-1.5 py-0.5 rounded border border-[#2d3a4f]">
          Enter ↵
        </span>
      </form>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/landing"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141b29] border border-[#1e293b] text-xs text-zinc-300 hover:text-white transition-all"
        >
          <span>Página Institucional</span>
        </Link>

        {/* Plan status badge */}
        <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${planBadge.color}`}>
          <Sparkles className="w-3 h-3" />
          <span>{planBadge.label}</span>
        </div>

        {/* User Profile info */}
        <div className="flex items-center gap-3 pl-3 border-l border-[#1e293b]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-md">
            {initials}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">
              {userProfile?.adminName || userProfile?.companyName || user?.email?.split('@')[0] || 'Gestor B2B'}
            </p>
            <p className="text-[10px] text-zinc-400 truncate max-w-[140px]">
              {userProfile?.companyName || user?.email || 'ProspectAI Conectado'}
            </p>
          </div>

          <button
            onClick={handleLogout}
            title="Sair da conta"
            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 transition-colors ml-1 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
