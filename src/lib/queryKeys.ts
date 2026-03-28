export const queryKeys = {
  transactions: {
    all: ['transactions'] as const,
    list: () => [...queryKeys.transactions.all, 'list'] as const,
  },
  auth: {
    me: ['auth', 'me'] as const,
  },
}