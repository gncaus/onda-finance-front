import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { transferMock } from '@/mocks/api'
import { useBalanceStore } from '@/store/balanceStore'
import { queryClient } from '@/lib/queryClient'
import { queryKeys } from '@/lib/queryKeys'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Transaction } from '@/mocks/data'

const CURRENCIES: Transaction['currency'][] = ['BRL', 'USD', 'EUR', 'USDT', 'USDC']

const transferSchema = z.object({
  recipient: z.string().min(2, 'Informe o destinatário'),
  amount: z
    .string()
    .min(1, 'Informe o valor')
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, 'Valor deve ser maior que zero'),
  currency: z.enum(['BRL', 'USD', 'EUR', 'USDT', 'USDC']),
  description: z.string().min(2, 'Informe uma descrição'),
})

type TransferForm = z.infer<typeof transferSchema>

export default function Transfer() {
  const navigate = useNavigate()
  const balance = useBalanceStore((s) => s.balance)
  const deduct = useBalanceStore((s) => s.deduct)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TransferForm>({
    resolver: zodResolver(transferSchema),
    defaultValues: { currency: 'BRL' },
  })

  const selectedCurrency = watch('currency')
  const amountValue = watch('amount')

  const { mutate, isPending, isSuccess, reset } = useMutation({
    mutationFn: (data: TransferForm) =>
      transferMock(Number(data.amount), data.recipient, data.description, data.currency),
    onSuccess: (_, variables) => {
      if (variables.currency === 'BRL') {
        deduct(Number(variables.amount))
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all })
    },
  })

  const onSubmit = (data: TransferForm) => mutate(data)

  // Tela de sucesso
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-blue-400" />
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">Transferência enviada!</h2>
          <p className="text-zinc-400 text-sm mb-8">
            Sua transação foi processada com sucesso.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={reset}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold"
            >
              Nova transferência
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              Voltar ao dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* Header */}
      <header className="border-b border-zinc-800/60 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-zinc-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-zinc-800"
            aria-label="Voltar"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M2 8 Q5 2 8 8 Q11 14 14 8" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">Nova transferência</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">

        {/* Saldo disponível */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 mb-6 flex items-center justify-between">
          <p className="text-zinc-400 text-sm">Saldo disponível</p>
          <p className="text-white font-semibold">
            R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            {/* Destinatário */}
            <div className="space-y-1.5">
              <Label htmlFor="recipient" className="text-zinc-300 text-sm">
                Destinatário
              </Label>
              <Input
                id="recipient"
                placeholder="Nome ou empresa"
                {...register('recipient')}
                className="bg-zinc-800/80 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 h-11"
              />
              {errors.recipient && (
                <p className="text-red-400 text-xs">{errors.recipient.message}</p>
              )}
            </div>

            {/* Valor + Moeda */}
            <div className="space-y-1.5">
              <Label className="text-zinc-300 text-sm">Valor</Label>
              <div className="flex gap-2">

                {/* Seletor de moeda */}
                <select
                  {...register('currency')}
                  className="bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg px-3 h-11 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0,00"
                  {...register('amount')}
                  className="flex-1 bg-zinc-800/80 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 h-11"
                />
              </div>
              {errors.amount && (
                <p className="text-red-400 text-xs">{errors.amount.message}</p>
              )}
              {/* Aviso de saldo insuficiente para BRL */}
              {selectedCurrency === 'BRL' && amountValue && Number(amountValue) > balance && (
                <p className="text-amber-400 text-xs">Saldo insuficiente para esta transferência.</p>
              )}
            </div>

            {/* Descrição */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-zinc-300 text-sm">
                Descrição
              </Label>
              <Input
                id="description"
                placeholder="Ex: Pagamento fornecedor, Importação..."
                {...register('description')}
                className="bg-zinc-800/80 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 h-11"
              />
              {errors.description && (
                <p className="text-red-400 text-xs">{errors.description.message}</p>
              )}
            </div>

            {/* Resumo antes de confirmar */}
            {amountValue && Number(amountValue) > 0 && (
              <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl px-4 py-3">
                <p className="text-zinc-400 text-xs mb-1">Você está enviando</p>
                <p className="text-white font-semibold">
                  {selectedCurrency} {Number(amountValue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
            >
              {isPending
                ? <><Loader2 size={16} className="animate-spin mr-2" />Processando...</>
                : 'Confirmar transferência'
              }
            </Button>

          </form>
        </div>
      </main>
    </div>
  )
}