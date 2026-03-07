import apiClient from "@/lib/api-client";
import type { Category } from "./category";

export type EquipmentStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface Equipment {
  id: string;
  name: string;
  description?: string;
  pricePerDay: number;
  location?: string;
  status: EquipmentStatus;
  images: string[];
  adminNote?: string;
  verifiedAt?: string;
  createdAt: string;
  category: Pick<Category, "id" | "name" | "slug">;
  owner: { id: string; name: string; email: string };
}

export interface CreateEquipmentPayload {
  name: string;
  description?: string;
  pricePerDay: number;
  location?: string;
  categoryId: string;
  images: File[];
}

export const equipmentApi = {
  /** Public: get single verified equipment by id */
  getById: async (id: string): Promise<Equipment> => {
    const { data } = await apiClient.get(`/equipment/${id}`);
    return data.data as Equipment;
  },

  /** Public: list verified equipment */
  listVerified: async (categoryId?: string): Promise<Equipment[]> => {
    const { data } = await apiClient.get("/equipment", {
      params: categoryId ? { categoryId } : {},
    });
    return data.data as Equipment[];
  },

  /** Owner: submit a new listing (multipart) */
  create: async (payload: CreateEquipmentPayload): Promise<Equipment> => {
    const form = new FormData();
    form.append("name", payload.name);
    form.append("pricePerDay", String(payload.pricePerDay));
    form.append("categoryId", payload.categoryId);
    if (payload.description) form.append("description", payload.description);
    if (payload.location) form.append("location", payload.location);
    payload.images.forEach((img) => form.append("images", img));

    const { data } = await apiClient.post("/equipment", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data as Equipment;
  },

  /** Owner: list own submissions */
  myListings: async (): Promise<Equipment[]> => {
    const { data } = await apiClient.get("/equipment/my");
    return data.data as Equipment[];
  },

  /** Admin: list pending */
  adminPending: async (): Promise<Equipment[]> => {
    const { data } = await apiClient.get("/equipment/admin/pending");
    return data.data as Equipment[];
  },

  /** Admin: approve */
  adminVerify: async (id: string, adminNote?: string): Promise<Equipment> => {
    const { data } = await apiClient.patch(`/equipment/admin/${id}/verify`, {
      adminNote,
    });
    return data.data as Equipment;
  },

  /** Admin: reject */
  adminReject: async (id: string, adminNote: string): Promise<Equipment> => {
    const { data } = await apiClient.patch(`/equipment/admin/${id}/reject`, {
      adminNote,
    });
    return data.data as Equipment;
  },

  /** Admin: hard delete */
  adminDelete: async (id: string): Promise<void> => {
    await apiClient.delete(`/equipment/admin/${id}`);
  },
};
