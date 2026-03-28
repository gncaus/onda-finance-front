import { mockUser, mockTransactions, type Transaction } from './data'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function loginMock(email: string, password: string) {
  await delay(800)

  if (email !== mockUser.email || password !== mockUser.password) {
    throw new Error('Credenciais inválidas')
  }

  const { password: _, ...user } = mockUser

  return {
    user,
    token: 'mock-jwt-token-' + Date.now(),
  }
}

export async function getTransactionsMock(): Promise<Transaction[]> {
  await delay(600)
  return mockTransactions
}

export async function transferMock(amount: number, recipient: string, description: string) {
  await delay(1000)

  if (amount <= 0) {
    throw new Error('Valor inválido')
  }

  const newTransaction: Transaction = {
    id: String(Date.now()),
    type: 'debit',
    amount,
    description,
    recipient,
    date: new Date().toISOString().split('T')[0],
  }

  mockTransactions.unshift(newTransaction)

  return newTransaction
}