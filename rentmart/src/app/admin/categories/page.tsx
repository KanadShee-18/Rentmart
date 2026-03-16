"use client";

import { useRef, useState } from "react";
import Image from "next/image";
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("name", name);
    if (description) formData.append("description", description);
    formData.append("image", imageFile);
    createCategory(formData, {
      onSuccess: () => {
        setName("");
        setDescription("");
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteCategory(id, { onSettled: () => setDeletingId(null) });
  };

  const createErrorMsg =
    createError && "response" in (createError as object)
      ? ((createError as any).response?.data?.message ?? createError.message)
      : createError?.message;

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-semibold tracking-[-0.045em] text-neutral-900'>
          Categories
        </h1>
        <p className='text-sm text-neutral-600'>
          Create and manage the catalog displayed to owners and renters.
        </p>
      </div>

      <div className='grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]'>
        <div className='rounded-[1.8rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-neutral-200/70'>
          <h2 className='font-semibold text-neutral-900'>Add New Category</h2>
          <form onSubmit={handleCreate} className='mt-4 space-y-3'>
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
                rows={4}
              />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='cat-image'>Category Image</Label>
              <Input
                id='cat-image'
                type='file'
                accept='image/jpeg,image/png,image/jpg'
                ref={fileInputRef}
                onChange={handleImageChange}
                required
              />
              {imagePreview && (
                <div className='mt-2 overflow-hidden rounded-2xl border bg-muted'>
                  <Image
                    src={imagePreview}
                    alt='Preview'
                    width={320}
                    height={220}
                    className='h-40 w-full object-cover'
                  />
                </div>
              )}
            </div>
            {createErrorMsg && (
              <p className='text-destructive text-sm'>{createErrorMsg}</p>
            )}
            <Button type='submit' size='sm' disabled={isCreating || !imageFile}>
              {isCreating ? "Adding…" : "Add Category"}
            </Button>
          </form>
        </div>

        <div className='rounded-[1.8rem] border border-white/70 bg-white/80 shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-neutral-200/70'>
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
                  className='flex items-center justify-between gap-3 px-5 py-4'
                >
                  <div className='flex items-center gap-3'>
                    {cat.imageUrl ? (
                      <div className='h-14 w-14 shrink-0 overflow-hidden rounded-xl border bg-muted'>
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          width={56}
                          height={56}
                          className='w-full h-full object-cover'
                        />
                      </div>
                    ) : (
                      <div className='h-14 w-14 shrink-0 rounded-xl bg-muted' />
                    )}
                    <div className='min-w-0'>
                      <p className='font-medium text-sm text-neutral-900'>
                        {cat.name}
                      </p>
                      {cat.description && (
                        <p className='line-clamp-2 text-xs text-muted-foreground'>
                          {cat.description}
                        </p>
                      )}
                      <p className='text-xs text-muted-foreground/60 font-mono'>
                        {cat.slug}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-destructive hover:bg-destructive/10 shrink-0'
                    disabled={isDeleting && deletingId === cat.id}
                    onClick={() => handleDelete(cat.id)}
                  >
                    {isDeleting && deletingId === cat.id
                      ? "Deleting…"
                      : "Delete"}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
