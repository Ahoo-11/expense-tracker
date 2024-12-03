import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { PlusCircle, Menu, Home, X } from 'lucide-react';
import { MainDashboard } from './components/MainDashboard';
import { SourceDashboard } from './components/SourceDashboard';
import type { Transaction, Source } from './types';

const queryClient = new QueryClient();

// Initialize with Personal source
const DEFAULT_SOURCES: Source[] = [
  {
    id: 'personal',
    name: 'Personal',
    type: 'PERSONAL',
    description: 'Primary personal income and expenses',
  },
];

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sources, setSources] = useState<Source[]>(DEFAULT_SOURCES);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [newSource, setNewSource] = useState({ name: '', type: 'SIDE_HUSTLE' as const, platform: '', description: '' });

  const handleAddTransaction = async (data: Partial<Transaction>) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      amount: Number(data.amount),
      type: data.type as Transaction['type'],
      sourceId: selectedSourceId || 'personal',
      category: data.category as Transaction['category'],
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      userId: '1',
    };

    setTransactions([...transactions, newTransaction]);
  };

  const handleEditTransaction = (id: string, data: Partial<Transaction>) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id
          ? {
              ...t,
              ...data,
              amount: Number(data.amount),
            }
          : t
      )
    );
  };

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    const newSourceData: Source = {
      id: Math.random().toString(36).substr(2, 9),
      ...newSource,
    };
    setSources([...sources, newSourceData]);
    setNewSource({ name: '', type: 'SIDE_HUSTLE', platform: '', description: '' });
    setIsAddingSource(false);
  };

  const handleDeleteSource = (id: string) => {
    if (id === 'personal') return; // Prevent deleting personal source
    setSources(sources.filter((s) => s.id !== id));
    if (selectedSourceId === id) {
      setSelectedSourceId(null);
    }
  };

  const selectedSource = selectedSourceId 
    ? sources.find((s) => s.id === selectedSourceId)
    : null;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? 'w-64' : 'w-0'
          } bg-white shadow-md transition-all duration-300 overflow-hidden`}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Navigation</h2>
            <nav className="space-y-2">
              <button
                onClick={() => setSelectedSourceId(null)}
                className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-2 ${
                  !selectedSourceId
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Overview</span>
              </button>
              
              <div className="py-2 border-t border-gray-200">
                <h3 className="px-4 py-2 text-sm font-medium text-gray-500">Income Sources</h3>
                {sources.map((source) => (
                  <div key={source.id} className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedSourceId(source.id)}
                      className={`flex-1 text-left px-4 py-2 rounded-md ${
                        selectedSourceId === source.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {source.name}
                    </button>
                    {source.id !== 'personal' && (
                      <button
                        onClick={() => handleDeleteSource(source.id)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setIsAddingSource(true)}
                  className="w-full text-left px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-md flex items-center space-x-2"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Add Income Source</span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900">
                  {selectedSource ? `${selectedSource.name} Dashboard` : 'Overview'}
                </h1>
                <div className="w-8" /> {/* Spacer for alignment */}
              </div>

              <div className="space-y-8">
                {selectedSource ? (
                  <SourceDashboard
                    source={selectedSource}
                    transactions={transactions}
                    onAddTransaction={handleAddTransaction}
                    onEditTransaction={handleEditTransaction}
                  />
                ) : (
                  <MainDashboard transactions={transactions} sources={sources} />
                )}
              </div>
            </div>
          </div>
          
          {/* Add Source Modal */}
          {isAddingSource && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Add Income Source</h2>
                  <button
                    onClick={() => setIsAddingSource(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleAddSource} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={newSource.name}
                      onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Platform</label>
                    <input
                      type="text"
                      value={newSource.platform}
                      onChange={(e) => setNewSource({ ...newSource, platform: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={newSource.description}
                      onChange={(e) => setNewSource({ ...newSource, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsAddingSource(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Add Source
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          <Toaster position="top-right" />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;