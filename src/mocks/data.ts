export interface Transaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  recipient: string
  date: string
}

export const mockUser = {
  id: '1',
  name: 'Gabriel Oliveira',
  email: 'gabriel@email.com',
  password: '123456',
}

export const mockTransactions: Transaction[] = [
  { id: '1', type: 'credit', amount: 3500, description: 'Salário', recipient: 'Empresa XYZ', date: '2025-03-01' },
  { id: '2', type: 'debit', amount: 150, description: 'Supermercado', recipient: 'Mercado ABC', date: '2025-03-03' },
  { id: '3', type: 'debit', amount: 89.9, description: 'Streaming', recipient: 'Netflix', date: '2025-03-05' },
  { id: '4', type: 'credit', amount: 200, description: 'Transferência recebida', recipient: 'João Silva', date: '2025-03-07' },
  { id: '5', type: 'debit', amount: 320, description: 'Aluguel', recipient: 'Imobiliária Central', date: '2025-03-10' },
  { id: '6', type: 'debit', amount: 45.5, description: 'Farmácia', recipient: 'Drogasil', date: '2025-03-12' },
  { id: '7', type: 'credit', amount: 750, description: 'Freela', recipient: 'Cliente PJ', date: '2025-03-14' },
  { id: '8', type: 'debit', amount: 120, description: 'Restaurante', recipient: 'Restaurante Bom Sabor', date: '2025-03-17' },
  { id: '9', type: 'debit', amount: 60, description: 'Combustível', recipient: 'Posto Shell', date: '2025-03-20' },
  { id: '10', type: 'credit', amount: 180, description: 'Reembolso', recipient: 'Empresa XYZ', date: '2025-03-22' },
]