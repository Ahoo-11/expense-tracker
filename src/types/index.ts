export type TransactionType = 'EXPENSE' | 'INCOME';

export type TransactionCategory =
  | 'SALARY'
  | 'FREELANCE'
  | 'INVESTMENT'
  | 'FOOD'
  | 'TRANSPORT'
  | 'UTILITIES'
  | 'ENTERTAINMENT'
  | 'HEALTHCARE'
  | 'SHOPPING'
  | 'OTHER';

export interface Source {
  id: string;
  name: string;
  type: 'PERSONAL' | 'SIDE_HUSTLE';
  platform?: string;
  description?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  sourceId: string;
  category: TransactionCategory;
  description: string;
  date: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface FinancialInsight {
  type: 'SPENDING_PATTERN' | 'BUDGET_RECOMMENDATION' | 'SAVING_OPPORTUNITY';
  message: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  category?: TransactionCategory;
  sourceId?: string;
}