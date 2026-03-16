"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryApi, type Category } from "@/lib/api/category";

export const CATEGORIES_KEY = ["categories"] as const;

export function useCategories() {
  return useQuery({ queryKey: CATEGORIES_KEY, queryFn: categoryApi.list });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: FormData) => categoryApi.create(payload),
    onSuccess: (newCategory) => {
      qc.setQueryData<Category[]>(CATEGORIES_KEY, (prev = []) => [
        ...prev,
        newCategory,
      ]);
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryApi.remove(id),
    onSuccess: (_data, id) => {
      qc.setQueryData<Category[]>(CATEGORIES_KEY, (prev = []) =>
        prev.filter((c) => c.id !== id),
      );
    },
  });
}
