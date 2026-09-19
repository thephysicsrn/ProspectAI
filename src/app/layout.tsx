import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Providers } from '@/components/providers/Providers';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'ProspectAI | Plataforma SaaS de Inteligência de Prospecção B2B',
  description:
    'Prospecção B2B de alta conversão combinando dados abertos da Receita Federal com inteligência de mercado, estimativa de faturamento e geração de propostas com IA.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`dark ${jakarta.variable}`}>
      <body className="min-h-screen bg-[#070a10] text-zinc-100 font-sans antialiased flex selection:bg-indigo-500/30 selection:text-cyan-300">
        <Providers>
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen">
            <Navbar />
            <main className="flex-1 w-full mx-auto">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
