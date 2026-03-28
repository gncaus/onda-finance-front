import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { QueryClient } from '@tanstack/react-query'
import Login from '@/pages/Login'
import { useAuthStore } from '@/store/authStore'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('@/mocks/api', () => ({
  loginMock: vi.fn(async (email: string, password: string) => {
    if (email === 'gabriel@email.com' && password === '123456') {
      return {
        user: { id: '1', name: 'Gabriel Oliveira', email },
        token: 'mock-token-123',
      }
    }
    throw new Error('Credenciais inválidas')
  }),
}))

function renderLogin() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  mockNavigate.mockClear()
  useAuthStore.setState({ user: null, token: null, isAuthenticated: false })
})

describe('Login', () => {
  it('renderiza os campos de e-mail e senha', () => {
    renderLogin()
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('exibe erros de validação ao submeter formulário vazio', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole('button', { name: /entrar/i }))

    expect(await screen.findByText(/e-mail inválido/i)).toBeInTheDocument()
    expect(await screen.findByText(/senha deve ter pelo menos/i)).toBeInTheDocument()
  })

  it('exibe erro de validação com e-mail inválido', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText(/e-mail/i), 'nao-e-um-email')
    await user.type(screen.getByPlaceholderText('••••••••'), '123456')
    await user.click(screen.getByRole('button', { name: /entrar na conta/i }))

    expect(await screen.findByText(/e-mail inválido/i)).toBeInTheDocument()
  })

  it('exibe erro do servidor com credenciais incorretas', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText(/e-mail/i), 'errado@email.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'senhaerrada')
    await user.click(screen.getByRole('button', { name: /entrar na conta/i }))

    expect(await screen.findByText(/e-mail ou senha incorretos/i)).toBeInTheDocument()
  })

  it('faz login com sucesso, popula o store e redireciona', async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText(/e-mail/i), 'gabriel@email.com')
    await user.type(screen.getByPlaceholderText('••••••••'), '123456')
    await user.click(screen.getByRole('button', { name: /entrar na conta/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })

    const { isAuthenticated, token, user: storeUser } = useAuthStore.getState()
    expect(isAuthenticated).toBe(true)
    expect(token).toBe('mock-token-123')
    expect(storeUser?.email).toBe('gabriel@email.com')
  })

  it('mostra e oculta a senha ao clicar no botão de olho', async () => {
    const user = userEvent.setup()
    renderLogin()

    const input = screen.getByPlaceholderText('••••••••')
    expect(input).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: /mostrar senha/i }))
    expect(input).toHaveAttribute('type', 'text')

    await user.click(screen.getByRole('button', { name: /ocultar senha/i }))
    expect(input).toHaveAttribute('type', 'password')
  })
})