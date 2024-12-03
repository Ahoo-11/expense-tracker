import React from 'react';
import { useForm } from 'react-hook-form';
import type { Transaction } from '../types';

interface TransactionFormProps {
  onSubmit: (data: Partial<Transaction>) => void;
  isLoading?: boolean;
  initialData?: Partial<Transaction>;
  submitLabel?: string;
  selectedSourceId?: string | null;
}

export function TransactionForm({ 
  onSubmit, 
  isLoading = false, 
  initialData,
  submitLabel = 'Add Transaction',
  selectedSourceId
}: TransactionFormProps) {
  const { register, handleSubmit, reset, watch, setValue } = useForm<Partial<Transaction>>({
    defaultValues: initialData || {
      type: 'EXPENSE',
      category: 'OTHER',
      date: new Date().toISOString().split('T')[0],
      sourceId: selectedSourceId || undefined,
    },
  });

  const currentType = watch('type');

  const onFormSubmit = async (data: Partial<Transaction>) => {
    await onSubmit({
      ...data,
      sourceId: selectedSourceId,
    });
    if (!initialData) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            step="0.01"
            {...register('amount', { required: true, min: 0 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <input type="hidden" {...register('type')} />
          <div className="mt-1 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setValue('type', 'INCOME')}
              className={`py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                currentType === 'INCOME'
                  ? 'bg-green-100 text-green-800 border-2 border-green-500'
                  : 'bg-gray-50 text-gray-600 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setValue('type', 'EXPENSE')}
              className={`py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                currentType === 'EXPENSE'
                  ? 'bg-red-100 text-red-800 border-2 border-red-500'
                  : 'bg-gray-50 text-gray-600 border border-gray-300 hover:bg-gray-100'
              }`}
            >
              Expense
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            {...register('category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="SALARY">Salary</option>
            <option value="FREELANCE">Freelance</option>
            <option value="INVESTMENT">Investment</option>
            <option value="FOOD">Food</option>
            <option value="TRANSPORT">Transport</option>
            <option value="UTILITIES">Utilities</option>
            <option value="ENTERTAINMENT">Entertainment</option>
            <option value="HEALTHCARE">Healthcare</option>
            <option value="SHOPPING">Shopping</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            {...register('date')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : submitLabel}
      </button>
    </form>
  );
}