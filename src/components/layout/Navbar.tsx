'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Bell, Sparkles, Building, ChevronDown, LogOut } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [quickCnpj, setQuickCnpj] = useState('');

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

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Inteligência Ativa</span>
        </div>

        {/* User Profile with logout link */}
        <Link
          href="/login"
          title="Clique para trocar de usuário"
          className="flex items-center gap-3 pl-2 border-l border-[#1e293b] hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs shadow-md">
            AC
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">Agente de Captação</p>
            <p className="text-[11px] text-zinc-400">FIERN / Unidade B2B</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
