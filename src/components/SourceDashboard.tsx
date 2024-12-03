import React from 'react';
import { TransactionForm } from './TransactionForm';
import { TransactionList } from './TransactionList';
import type { Transaction, Source } from '../types';

interface SourceDashboardProps {
  source: Source;
  transactions: Transaction[];
  onAddTransaction: (data: Partial<Transaction>) => void;
  onEditTransaction: (id: string, data: Partial<Transaction>) => void;
}

export function SourceDashboard({ 
  source, 
  transactions,
  onAddTransaction,
  onEditTransaction
}: SourceDashboardProps) {
  const sourceTransactions = transactions.filter(t => t.sourceId === source.id);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Transaction</h2>
        <TransactionForm
          onSubmit={onAddTransaction}
          selectedSourceId={source.id}
        />
      </div>

      <TransactionList
        transactions={sourceTransactions}
        onEdit={onEditTransaction}
      />
    </div>
  );
}