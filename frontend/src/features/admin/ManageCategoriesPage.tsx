import React, { useMemo, useState } from 'react';
import { Edit3, FolderKanban, Plus, Save, Trash2, X } from 'lucide-react';
import { GlassButton } from '../../components/ui/GlassButton';
import { InputField } from '../../components/ui/InputField';
import { useCategories, useOffers } from '../../hooks/useOffers';
import { Category } from '../../types';
import { getBusinessById } from '../../services/dataStore';

interface ManageCategoriesPageProps {
  businessId: string;
}

export const ManageCategoriesPage: React.FC<ManageCategoriesPageProps> = ({ businessId }) => {
  const business = getBusinessById(businessId);
  const { categories, saveCategory, deleteCategory } = useCategories(businessId);
  const { offers } = useOffers(businessId);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const offerCountByCategory = useMemo(() => {
    return offers.reduce<Record<string, number>>((acc, offer) => {
      acc[offer.category] = (acc[offer.category] || 0) + 1;
      return acc;
    }, {});
  }, [offers]);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setError('');
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || '');
    setError('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Category name is required.');
      return;
    }

    const duplicate = categories.find(
      (category) => category.name.toLowerCase() === trimmedName.toLowerCase() && category.id !== editingId,
    );

    if (duplicate) {
      setError('This business already has a category with that name.');
      return;
    }

    const current = categories.find((category) => category.id === editingId);
    saveCategory({
      id: editingId || undefined,
      businessId,
      name: trimmedName,
      description,
      color: current?.color || 'blue',
      createdAt: current?.createdAt,
    });
    resetForm();
  };

  const handleDelete = (categoryId: string) => {
    const result = deleteCategory(categoryId);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    resetForm();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 md:p-8">
      <div>
        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{business.name}</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">Category Management</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Create, edit, and remove categories for this business only.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={handleSave} className="h-fit rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-sm shadow-slate-950/5 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/65 dark:shadow-black/20">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <FolderKanban className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-950 dark:text-white">{editingId ? 'Edit Category' : 'New Category'}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Available while creating offers.</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <InputField label="Category Name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g., Weekend Specials" />
            <div className="flex w-full flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Description</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-300 bg-white/70 px-4 py-2.5 text-slate-900 backdrop-blur-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-slate-700 dark:bg-slate-950/50 dark:text-white"
                placeholder="Short internal description"
              />
            </div>
            <div className="flex gap-3">
              {editingId && (
                <GlassButton type="button" variant="secondary" onClick={resetForm} className="flex-1">
                  <X className="h-4 w-4" />
                  Cancel
                </GlassButton>
              )}
              <GlassButton type="submit" className="flex-1">
                {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingId ? 'Save' : 'Add'}
              </GlassButton>
            </div>
          </div>
        </form>

        <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 shadow-sm shadow-slate-950/5 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/65 dark:shadow-black/20">
          <div className="border-b border-slate-200/70 p-5 dark:border-slate-800/70">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Business Categories</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{categories.length} categories configured.</p>
          </div>
          <div className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
            {categories.map((category) => (
              <div key={category.id} className="flex flex-col gap-4 p-5 transition-colors hover:bg-slate-50/90 dark:hover:bg-slate-800/35 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-950 dark:text-white">{category.name}</h3>
                    <span className="rounded-full bg-slate-950/5 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      {offerCountByCategory[category.name] || 0} offers
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{category.description || 'No description yet.'}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <GlassButton variant="secondary" className="px-3 py-2 text-sm" onClick={() => handleEdit(category)}>
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </GlassButton>
                  <GlassButton variant="danger" className="px-3 py-2 text-sm" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </GlassButton>
                </div>
              </div>
            ))}
            {!categories.length && (
              <div className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">
                No categories yet. Add one to start creating offers.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
