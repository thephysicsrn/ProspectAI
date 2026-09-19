'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Zap,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      console.error('Firebase Auth login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('E-mail ou senha incorretos. Verifique suas credenciais.');
      } else if (err.code === 'auth/user-not-found') {
        setError('Nenhuma conta encontrada com este e-mail. Crie uma conta no formulário de cadastro.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Formato de e-mail inválido.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Muitas tentativas sem sucesso. Tente novamente em instantes.');
      } else {
        setError(err.message || 'Erro ao autenticar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a10] text-zinc-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-[#1e293b] bg-[#0e131f]/90 backdrop-blur-xl shadow-2xl overflow-hidden relative z-10">
        {/* Left Form Panel */}
        <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-between">
          <div>
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-white text-base tracking-tight leading-none flex items-center gap-1">
                  Prospect<span className="text-cyan-400">AI</span>
                </h1>
                <p className="text-[11px] text-zinc-400 mt-0.5">Plataforma de Captação B2B</p>
              </div>
            </div>

            {/* Title */}
            <div className="mt-8 space-y-1.5">
              <h2 className="text-2xl font-black text-white tracking-tight">Acesse sua conta</h2>
              <p className="text-xs text-zinc-400">
                Entre com as credenciais cadastradas da sua equipe para prospectar empresas
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">E-mail Cadastrado</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.nome@empresa.com.br"
                    className="w-full bg-[#0a0d14] border border-[#1e293b] text-xs text-white pl-10 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-zinc-300">Senha de Acesso</label>
                  <a href="#" className="text-cyan-400 hover:underline text-[11px]">
                    Esqueceu a senha?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha secreta"
                    className="w-full bg-[#0a0d14] border border-[#1e293b] text-xs text-white pl-10 pr-10 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-400">
                  <input type="checkbox" defaultChecked className="rounded border-zinc-700 bg-zinc-900 accent-indigo-600" />
                  <span>Manter conectado neste dispositivo</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 mt-2 cursor-pointer"
              >
                {loading ? (
                  <span className="animate-pulse">Validando credenciais...</span>
                ) : (
                  <>
                    <span>Entrar no Portal Comercial</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 pt-4 text-center text-xs text-zinc-500">
            Ainda não tem acesso?{' '}
            <Link href="/signup" className="text-cyan-400 hover:underline font-bold">
              Contrate um plano corporativo
            </Link>
          </div>
        </div>

        {/* Right Intelligence Preview Panel */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#111728] via-[#0d121f] to-[#070a10] p-8 md:p-12 border-t lg:border-t-0 lg:border-l border-[#1e293b] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Base Oficial PNCP & Receita Federal Sincronizada</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white leading-tight">
                Transforme dados de gastos públicos em vendas B2B recorrentes
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Empresas com contratos públicos vigentes possuem caixa aprovado e necessidade imediata de parceiros qualificados.
              </p>
            </div>

            {/* Feature Checkpoints */}
            <div className="space-y-3 pt-2">
              {[
                { title: 'Contatos e Decisores sob 1 Clique', desc: 'Acesso a WhatsApp, e-mail e sócios cadastrais.' },
                { title: 'Faturamento Presumido & eSocial', desc: 'Quadro real de colaboradores e capacidade de pagamento.' },
                { title: 'Gerador de Propostas com IA', desc: 'Pitches de venda customizados em menos de 10 segundos.' },
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#0a0d14]/70 border border-[#1e293b]">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{feat.title}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-[#1e293b]/60 flex items-center justify-between text-xs text-zinc-400 relative z-10">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Firebase Auth & Banco Firestore Conectados
            </span>
            <Link href="/landing" className="text-zinc-400 hover:text-white underline">
              Ver Landing Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
