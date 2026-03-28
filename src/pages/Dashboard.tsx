import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpRight, ArrowDownLeft, Eye, EyeOff, LogOut, Send, RefreshCw } from 'lucide-react'
import { getTransactionsMock } from '@/mocks/api'
import { useAuthStore } from '@/store/authStore'
import { useBalanceStore } from '@/store/balanceStore'
import { queryKeys } from '@/lib/queryKeys'
import type { Transaction } from '@/mocks/data'

const CURRENCY_SYMBOL: Record<string, string> = {
  BRL: 'R$', USD: '$', EUR: '€', USDT: 'USDT', USDC: 'USDC',
}

function formatAmount(amount: number, currency: string) {
  const symbol = CURRENCY_SYMBOL[currency] ?? currency
  const formatted = amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
  return `${symbol} ${formatted}`
}

function TransactionSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3 animate-pulse">
      <div className="w-9 h-9 rounded-full bg-zinc-800 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-32 bg-zinc-800 rounded" />
        <div className="h-2.5 w-20 bg-zinc-800 rounded" />
      </div>
      <div className="h-3 w-20 bg-zinc-800 rounded" />
    </div>
  )
}

function TransactionItem({ tx }: { tx: Transaction }) {
  const isCredit = tx.type === 'credit'
  return (
    <div className="flex items-center gap-3 py-3 border-b border-zinc-800/60 last:border-0">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
        isCredit ? 'bg-blue-500/10' : 'bg-zinc-800'
      }`}>
        {isCredit
          ? <ArrowDownLeft size={16} className="text-blue-400" />
          : <ArrowUpRight size={16} className="text-zinc-400" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{tx.description}</p>
        <p className="text-xs text-zinc-500 truncate">{tx.recipient}</p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-sm font-medium ${isCredit ? 'text-blue-400' : 'text-white'}`}>
          {isCredit ? '+' : '-'}{formatAmount(tx.amount, tx.currency)}
        </p>
        <p className="text-xs text-zinc-500">
          {new Date(tx.date + 'T00:00:00').toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const balance = useBalanceStore((s) => s.balance)
  const [showBalance, setShowBalance] = useState(true)
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all')

  const { data: transactions = [], isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.transactions.list(),
    queryFn: getTransactionsMock,
  })

  const filtered = filter === 'all'
    ? transactions
    : transactions.filter((tx) => tx.type === filter)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* Header */}
      <header className="border-b border-zinc-800/60 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M2 8 Q5 2 8 8 Q11 14 14 8" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">Onda Finance</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-400 text-sm hidden sm:block">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-zinc-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-zinc-800"
              aria-label="Sair"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Card de saldo */}
        <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <p className="text-zinc-400 text-sm">Saldo disponível</p>
              <button
                onClick={() => setShowBalance((v) => !v)}
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label={showBalance ? 'Ocultar saldo' : 'Mostrar saldo'}
              >
                {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-3xl font-semibold text-white tracking-tight">
              {showBalance
                ? `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                : 'R$ ••••••'
              }
            </p>
            <div className="flex items-center gap-2 mt-4">
              {['BRL', 'USD', 'USDT'].map((c) => (
                <span key={c} className="text-xs text-zinc-500 bg-zinc-800 rounded-full px-2.5 py-1 font-mono">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Ação rápida */}
        <button
          onClick={() => navigate('/transfer')}
          className="w-full flex items-center justify-between bg-blue-600 hover:bg-blue-500 transition-colors rounded-xl px-5 py-4 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <Send size={16} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-medium text-sm">Nova transferência</p>
              <p className="text-blue-200 text-xs">Envie para qualquer lugar do mundo</p>
            </div>
          </div>
          <ArrowUpRight size={18} className="text-white/60 group-hover:text-white transition-colors" />
        </button>

        {/* Transações */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/60">
            <h2 className="text-white font-medium text-sm">Transações</h2>
            <button
              onClick={() => refetch()}
              className="text-zinc-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800"
              aria-label="Atualizar"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Filtros */}
          <div className="flex gap-1 px-5 py-3 border-b border-zinc-800/60">
            {(['all', 'credit', 'debit'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {{ all: 'Todas', credit: 'Entradas', debit: 'Saídas' }[f]}
              </button>
            ))}
          </div>

          {/* Lista */}
          <div className="px-5">
            {isLoading && (
              Array.from({ length: 5 }).map((_, i) => <TransactionSkeleton key={i} />)
            )}
            {isError && (
              <div className="py-8 text-center">
                <p className="text-zinc-400 text-sm">Erro ao carregar transações.</p>
                <button onClick={() => refetch()} className="text-blue-400 text-sm mt-1 hover:underline">
                  Tentar novamente
                </button>
              </div>
            )}
            {!isLoading && !isError && filtered.length === 0 && (
              <p className="py-8 text-center text-zinc-500 text-sm">Nenhuma transação encontrada.</p>
            )}
            {!isLoading && !isError && filtered.map((tx) => (
              <TransactionItem key={tx.id} tx={tx} />
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}