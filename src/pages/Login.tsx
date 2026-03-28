import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { loginMock } from '@/mocks/api'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setServerError('')
    try {
      const { user, token } = await loginMock(data.email, data.password)
      login(user, token)
      navigate('/')
    } catch {
      setServerError('E-mail ou senha incorretos.')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">

        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8 Q5 2 8 8 Q11 14 14 8" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <span className="text-white text-lg font-semibold tracking-tight">Onda Finance</span>
          </div>
          <h1 className="text-white text-2xl font-semibold tracking-tight">Bem-vindo de volta</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Pagamentos globais em cripto e fiat
          </p>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-zinc-300 text-sm">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                {...register('email')}
                className="bg-zinc-800/80 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 h-11"
              />
              {errors.email && (
                <p className="text-red-400 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-zinc-300 text-sm">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register('password')}
                  className="bg-zinc-800/80 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">
                <p className="text-red-400 text-sm">{serverError}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors mt-2"
            >
              {isSubmitting
                ? <><Loader2 size={16} className="animate-spin mr-2" />Entrando...</>
                : 'Entrar na conta'
              }
            </Button>

          </form>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
          {['USD', 'BRL', 'EUR', 'USDT', 'USDC'].map((currency) => (
            <span
              key={currency}
              className="text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-full px-2.5 py-1 font-mono"
            >
              {currency}
            </span>
          ))}
        </div>

        <div className="mt-3 bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
          <p className="text-zinc-500 text-xs font-medium mb-2">Credenciais de teste</p>
          <p className="text-zinc-400 text-xs font-mono">gabriel@email.com</p>
          <p className="text-zinc-400 text-xs font-mono">123456</p>
        </div>

      </div>
    </div>
  )
}