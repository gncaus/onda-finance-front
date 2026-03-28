import { create } from 'zustand'

interface BalanceState {
  balance: number
  setBalance: (value: number) => void
  deduct: (amount: number) => void
}

export const useBalanceStore = create<BalanceState>()((set) => ({
  balance: 10000,

  setBalance: (value) => set({ balance: value }),

  deduct: (amount) =>
    set((state) => ({ balance: state.balance - amount })),
}))