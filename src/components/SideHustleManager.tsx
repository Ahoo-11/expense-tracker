import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import type { SideHustle } from '../types';

interface SideHustleManagerProps {
  sideHustles: SideHustle[];
  onAdd: (sideHustle: Omit<SideHustle, 'id'>) => void;
  onDelete: (id: string) => void;
}

export function SideHustleManager({ sideHustles, onAdd, onDelete }: SideHustleManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newHustle, setNewHustle] = useState({ name: '', platform: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newHustle);
    setNewHustle({ name: '', platform: '', description: '' });
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Side Hustles</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add New</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={newHustle.name}
                onChange={(e) => setNewHustle({ ...newHustle, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Platform</label>
              <input
                type="text"
                value={newHustle.platform}
                onChange={(e) => setNewHustle({ ...newHustle, platform: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={newHustle.description}
                onChange={(e) => setNewHustle({ ...newHustle, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Side Hustle
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {sideHustles.map((hustle) => (
          <div
            key={hustle.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div>
              <h3 className="font-medium text-gray-900">{hustle.name}</h3>
              <p className="text-sm text-gray-500">
                {hustle.platform}
                {hustle.description && ` • ${hustle.description}`}
              </p>
            </div>
            <button
              onClick={() => onDelete(hustle.id)}
              className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}