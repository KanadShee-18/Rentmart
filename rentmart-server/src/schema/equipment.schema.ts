import { z } from "zod";

export const createEquipmentSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().optional(),
  pricePerDay: z.coerce.number().positive(),
  location: z.string().optional(),
  categoryId: z.string().uuid(),
});

export const verifyEquipmentSchema = z.object({
  adminNote: z.string().optional(),
});

export const rejectEquipmentSchema = z.object({
  adminNote: z.string().min(1, "Rejection reason is required"),
});
