'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Zap,
  Building,
  Mail,
  User,
  Phone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPlan = searchParams.get('plan') || 'scale';
  const { signup } = useAuth();

  const [plan, setPlan] = useState(defaultPlan);
  const [companyName, setCompanyName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await signup({
        email,
        password,
        companyName,
        adminName,
        phone,
        plan,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1200);
    } catch (err: any) {
      console.error('Firebase Auth signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está cadastrado. Faça login ou use outro e-mail.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha é muito fraca. Utilize pelo menos 6 caracteres.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Formato de e-mail inválido.');
      } else {
        setError(err.message || 'Erro ao registrar empresa. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-[#0e131f]/95 border border-[#1e293b] rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1e293b] pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/30">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              Contratação Corporativa ProspectAI
            </h1>
            <p className="text-xs text-zinc-400">Ative o acesso da sua equipe de vendas</p>
          </div>
        </div>

        <Link href="/login" className="text-xs text-cyan-400 hover:underline font-semibold">
          Já tem conta? Entrar
        </Link>
      </div>

      {/* Plan Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          Selecione o Plano Desejado:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'starter', name: 'Starter SDR', price: 'R$ 297/mês', users: '1 Usuário' },
            { id: 'scale', name: 'Scale B2B Pro', price: 'R$ 790/mês', users: 'Até 5 Usuários' },
            { id: 'enterprise', name: 'Enterprise AI', price: 'R$ 1.890/mês', users: 'Ilimitado' },
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlan(p.id)}
              className={cn(
                'p-3 rounded-xl border text-left transition-all cursor-pointer',
                plan === p.id
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                  : 'bg-[#0a0d14] border-[#1e293b] text-zinc-400 hover:text-white'
              )}
            >
              <p className="text-xs font-bold text-white">{p.name}</p>
              <p className="text-[11px] text-cyan-400 font-semibold mt-0.5">{p.price}</p>
              <p className="text-[10px] text-zinc-500 mt-1">{p.users}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Error / Success Messages */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>Conta criada e salva no Firebase com sucesso! Redirecionando...</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Razão Social / Nome da Empresa</label>
            <div className="relative">
              <Building className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ex: Alfa Soluções Corporativas"
                className="w-full bg-[#0a0d14] border border-[#1e293b] text-xs text-white pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Nome do Gestor / Diretor</label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full bg-[#0a0d14] border border-[#1e293b] text-xs text-white pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">E-mail Corporativo</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="diretoria@suaempresa.com.br"
                className="w-full bg-[#0a0d14] border border-[#1e293b] text-xs text-white pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">WhatsApp Comercial</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(84) 99999-9999"
                className="w-full bg-[#0a0d14] border border-[#1e293b] text-xs text-white pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">Criar Senha de Acesso (mínimo 6 dígitos)</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite uma senha segura para a conta"
              className="w-full bg-[#0a0d14] border border-[#1e293b] text-xs text-white pl-9 pr-10 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
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

        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all mt-4 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span className="animate-pulse">Criando conta no Firebase & Provisionando ambiente...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Finalizar Cadastro & Liberar Acesso da Equipe</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-[#1e293b] flex items-center justify-center gap-2 text-xs text-zinc-500">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Dados armazenados de forma criptografada no Firebase Auth & Firestore.</span>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#070a10] text-zinc-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Carregando formulário...</div>}>
        <SignUpContent />
      </Suspense>
    </div>
  );
}
