"use client";

import { useState } from "react";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/hooks/use-category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const {
    mutate: createCategory,
    isPending: isCreating,
    error: createError,
  } = useCreateCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createCategory(
      { name, description: description || undefined },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
        },
      },
    );
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteCategory(id, { onSettled: () => setDeletingId(null) });
  };

  const createErrorMsg =
    createError && "response" in (createError as object)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((createError as any).response?.data?.message ?? createError.message)
      : createError?.message;

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold tracking-tight'>Categories</h1>

      {/* Create form */}
      <div className='rounded-2xl border ring-1 ring-foreground/10 bg-card p-5 space-y-4'>
        <h2 className='font-semibold'>Add New Category</h2>
        <form onSubmit={handleCreate} className='space-y-3'>
          <div className='space-y-1.5'>
            <Label htmlFor='cat-name'>Name</Label>
            <Input
              id='cat-name'
              placeholder='e.g. Cameras'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='cat-desc'>Description (optional)</Label>
            <Textarea
              id='cat-desc'
              placeholder='Brief description…'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          {createErrorMsg && (
            <p className='text-destructive text-sm'>{createErrorMsg}</p>
          )}
          <Button type='submit' size='sm' disabled={isCreating}>
            {isCreating ? "Adding…" : "Add Category"}
          </Button>
        </form>
      </div>

      {/* List */}
      <div className='rounded-2xl border ring-1 ring-foreground/10 bg-card'>
        {isLoading ? (
          <p className='text-muted-foreground text-sm p-5'>Loading…</p>
        ) : categories.length === 0 ? (
          <p className='text-muted-foreground text-sm p-5'>
            No categories yet.
          </p>
        ) : (
          <ul className='divide-y'>
            {categories.map((cat) => (
              <li
                key={cat.id}
                className='flex items-center justify-between px-5 py-3 gap-3'
              >
                <div>
                  <p className='font-medium text-sm'>{cat.name}</p>
                  {cat.description && (
                    <p className='text-xs text-muted-foreground'>
                      {cat.description}
                    </p>
                  )}
                  <p className='text-xs text-muted-foreground/60 font-mono'>
                    {cat.slug}
                  </p>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  className='text-destructive hover:bg-destructive/10 shrink-0'
                  disabled={isDeleting && deletingId === cat.id}
                  onClick={() => handleDelete(cat.id)}
                >
                  {isDeleting && deletingId === cat.id ? "Deleting…" : "Delete"}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
