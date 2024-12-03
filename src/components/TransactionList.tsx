import React, { useState } from 'react';
import { format } from 'date-fns';
import { ArrowDownCircle, ArrowUpCircle, Pencil } from 'lucide-react';
import type { Transaction } from '../types';
import { TransactionForm } from './TransactionForm';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (id: string, data: Partial<Transaction>) => void;
}

export function TransactionList({ transactions, onEdit }: TransactionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleEdit = (id: string, data: Partial<Transaction>) => {
    onEdit(id, data);
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id}>
              {editingId === transaction.id ? (
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Edit Transaction</h3>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                  <TransactionForm
                    onSubmit={(data) => handleEdit(transaction.id, data)}
                    initialData={transaction}
                    submitLabel="Save Changes"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    {transaction.type === 'INCOME' ? (
                      <ArrowUpCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <ArrowDownCircle className="w-8 h-8 text-red-500" />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(transaction.date), 'MMM d, yyyy')} • {transaction.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span
                      className={`text-lg font-semibold ${
                        transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'INCOME' ? '+' : '-'}$
                      {Math.abs(transaction.amount).toFixed(2)}
                    </span>
                    <button
                      onClick={() => setEditingId(transaction.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}