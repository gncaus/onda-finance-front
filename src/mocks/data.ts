export interface Transaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  currency: 'BRL' | 'USD' | 'EUR' | 'USDT' | 'USDC'
  description: string
  recipient: string
  date: string
}

export const mockUser = {
  id: '1',
  name: 'Gabriel Caus',
  email: 'gabriel@email.com',
  password: '123456',
}

export const mockTransactions: Transaction[] = [
  { id: '1',  type: 'credit', amount: 5000,   currency: 'USDT', description: 'Recebimento OTC',          recipient: 'Onda OTC Desk',        date: '2025-03-01' },
  { id: '2',  type: 'debit',  amount: 1200,   currency: 'USD',  description: 'Pagamento fornecedor',     recipient: 'Supplier Co. — EUA',   date: '2025-03-03' },
  { id: '3',  type: 'credit', amount: 8500,   currency: 'BRL',  description: 'Conversão USD → BRL',      recipient: 'Onda FX',              date: '2025-03-05' },
  { id: '4',  type: 'debit',  amount: 750,    currency: 'USDC', description: 'Transferência global',     recipient: 'João Silva — PT',      date: '2025-03-07' },
  { id: '5',  type: 'credit', amount: 2200,   currency: 'EUR',  description: 'Pagamento recebido',       recipient: 'Cliente EU GmbH',      date: '2025-03-10' },
  { id: '6',  type: 'debit',  amount: 320,    currency: 'BRL',  description: 'Recarga Onda Card',        recipient: 'Onda Card',            date: '2025-03-12' },
  { id: '7',  type: 'credit', amount: 3000,   currency: 'USDT', description: 'Depósito stablecoin',      recipient: 'Onda Wallet',          date: '2025-03-14' },
  { id: '8',  type: 'debit',  amount: 980,    currency: 'USD',  description: 'Pagamento importação',     recipient: 'Asia Imports Ltd.',    date: '2025-03-17' },
  { id: '9',  type: 'debit',  amount: 150,    currency: 'EUR',  description: 'Assinatura SaaS',          recipient: 'Software EU S.A.',     date: '2025-03-20' },
  { id: '10', type: 'credit', amount: 12000,  currency: 'BRL',  description: 'Conversão USDT → BRL',     recipient: 'Onda FX',              date: '2025-03-22' },
]