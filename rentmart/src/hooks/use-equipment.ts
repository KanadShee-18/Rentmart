"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  equipmentApi,
  type CreateEquipmentPayload,
  type Equipment,
} from "@/lib/api/equipment";

export const EQUIPMENT_BY_ID_KEY = (id: string) => ["equipment", "detail", id];
export const VERIFIED_EQUIPMENT_KEY = (categoryId?: string) =>
  categoryId
    ? ["equipment", "verified", categoryId]
    : ["equipment", "verified"];

export const MY_LISTINGS_KEY = ["equipment", "my"] as const;
export const PENDING_EQUIPMENT_KEY = ["equipment", "admin", "pending"] as const;

export function useEquipmentById(id: string) {
  return useQuery({
    queryKey: EQUIPMENT_BY_ID_KEY(id),
    queryFn: () => equipmentApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useVerifiedEquipment(categoryId?: string) {
  return useQuery({
    queryKey: VERIFIED_EQUIPMENT_KEY(categoryId),
    queryFn: () => equipmentApi.listVerified(categoryId),
  });
}

export function useMyListings() {
  return useQuery({
    queryKey: MY_LISTINGS_KEY,
    queryFn: equipmentApi.myListings,
  });
}

export function useCreateEquipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEquipmentPayload) =>
      equipmentApi.create(payload),
    onSuccess: (item) => {
      qc.setQueryData<Equipment[]>(MY_LISTINGS_KEY, (prev = []) => [
        item,
        ...prev,
      ]);
    },
  });
}

export function useAdminPendingEquipment() {
  return useQuery({
    queryKey: PENDING_EQUIPMENT_KEY,
    queryFn: equipmentApi.adminPending,
  });
}

export function useAdminVerifyEquipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, adminNote }: { id: string; adminNote?: string }) =>
      equipmentApi.adminVerify(id, adminNote),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PENDING_EQUIPMENT_KEY });
    },
  });
}

export function useAdminRejectEquipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, adminNote }: { id: string; adminNote: string }) =>
      equipmentApi.adminReject(id, adminNote),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PENDING_EQUIPMENT_KEY });
    },
  });
}

export function useAdminDeleteEquipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => equipmentApi.adminDelete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PENDING_EQUIPMENT_KEY });
    },
  });
}
