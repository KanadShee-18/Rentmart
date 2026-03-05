import apiClient from "@/lib/api-client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export const categoryApi = {
  list: async (): Promise<Category[]> => {
    const { data } = await apiClient.get("/categories");
    return data.data as Category[];
  },

  create: async (payload: {
    name: string;
    description?: string;
  }): Promise<Category> => {
    const { data } = await apiClient.post("/categories", payload);
    return data.data as Category;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
