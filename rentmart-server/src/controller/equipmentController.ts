import type { NextFunction, Request, RequestHandler, Response } from "express";
import responseMessage from "../constant/responseMessage.js";
import { prisma } from "../lib/db.js";
import {
  createEquipmentSchema,
  rejectEquipmentSchema,
  verifyEquipmentSchema,
} from "../schema/equipment.schema.js";
import {
  deleteFromCloudinary,
  upload,
  uploadToCloudinary,
} from "../util/fileUpload.js";
import { httpError } from "../util/httpError.js";
import { httpResponse } from "../util/httpResponse.js";

const EQUIPMENT_SELECT = {
  id: true,
  name: true,
  description: true,
  pricePerDay: true,
  location: true,
  status: true,
  images: true,
  adminNote: true,
  verifiedAt: true,
  createdAt: true,
  category: { select: { id: true, name: true, slug: true } },
  owner: { select: { id: true, name: true, email: true } },
};

export const uploadMiddleware: RequestHandler = upload.array("images", 5);

export default {
  /** POST /equipment — owner: submit a new listing with images */
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.user?.id;
      if (!ownerId)
        return httpError(
          next,
          new Error(responseMessage.UNAUTHORIZED),
          req,
          401,
        );

      const result = createEquipmentSchema.safeParse(req.body);
      if (!result.success) {
        const msg = result.error.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ");
        return httpError(next, new Error(msg), req, 422);
      }

      const files = req.files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) {
        return httpError(
          next,
          new Error("At least one image is required."),
          req,
          422,
        );
      }

      // Upload all images to Cloudinary
      const uploads = await Promise.all(
        files.map((f) => uploadToCloudinary(f)),
      );
      const images = uploads.map((u) => u.secure_url);
      const publicIds = uploads.map((u) => u.public_id);

      const { name, description, pricePerDay, location, categoryId } =
        result.data;

      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        // Clean up uploaded images
        await Promise.all(publicIds.map((id) => deleteFromCloudinary(id)));
        return httpError(
          next,
          new Error(responseMessage.NOT_FOUND("Category")),
          req,
          404,
        );
      }

      const equipment = await prisma.equipment.create({
        data: {
          ownerId,
          categoryId,
          name,
          description: description ?? null,
          pricePerDay,
          location: location ?? null,
          images,
          publicIds,
        },
        select: EQUIPMENT_SELECT,
      });

      httpResponse(req, res, 201, responseMessage.SUCCESS, equipment);
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },

  /** GET /equipment/my — owner: list their own submissions */
  myListings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ownerId = req.user?.id;
      if (!ownerId)
        return httpError(
          next,
          new Error(responseMessage.UNAUTHORIZED),
          req,
          401,
        );

      const items = await prisma.equipment.findMany({
        where: { ownerId },
        orderBy: { createdAt: "desc" },
        select: EQUIPMENT_SELECT,
      });
      httpResponse(req, res, 200, responseMessage.SUCCESS, items);
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },
  /** GET /equipment/:id — public: get a single verified equipment by id */
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const equipment = await prisma.equipment.findFirst({
        where: { id: id as string, status: "VERIFIED" },
        select: EQUIPMENT_SELECT,
      });
      if (!equipment)
        return httpError(
          next,
          new Error(responseMessage.NOT_FOUND("Equipment")),
          req,
          404,
        );
      httpResponse(req, res, 200, responseMessage.SUCCESS, equipment);
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },
  /** GET /equipment — public: list only verified equipment, optionally filter by category */
  listVerified: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categoryId } = req.query;
      const items = await prisma.equipment.findMany({
        where: {
          status: "VERIFIED",
          ...(categoryId ? { categoryId: categoryId as string } : {}),
        },
        orderBy: { verifiedAt: "desc" },
        select: EQUIPMENT_SELECT,
      });
      httpResponse(req, res, 200, responseMessage.SUCCESS, items);
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },

  /** GET /admin/equipment/pending — admin: list pending submissions */
  adminPending: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await prisma.equipment.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "asc" },
        select: EQUIPMENT_SELECT,
      });
      httpResponse(req, res, 200, responseMessage.SUCCESS, items);
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },

  /** PATCH /admin/equipment/:id/verify — admin: approve listing */
  adminVerify: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const result = verifyEquipmentSchema.safeParse(req.body);
      if (!result.success) {
        const msg = result.error.issues.map((e) => e.message).join(", ");
        return httpError(next, new Error(msg), req, 422);
      }

      const equipment = await prisma.equipment.findUnique({ where: { id } });
      if (!equipment)
        return httpError(
          next,
          new Error(responseMessage.NOT_FOUND("Equipment")),
          req,
          404,
        );

      const updated = await prisma.equipment.update({
        where: { id },
        data: {
          status: "VERIFIED",
          adminNote: result.data.adminNote ?? null,
          verifiedAt: new Date(),
        },
        select: EQUIPMENT_SELECT,
      });
      httpResponse(req, res, 200, responseMessage.SUCCESS, updated);
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },

  /** PATCH /admin/equipment/:id/reject — admin: reject listing */
  adminReject: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const result = rejectEquipmentSchema.safeParse(req.body);
      if (!result.success) {
        const msg = result.error.issues.map((e) => e.message).join(", ");
        return httpError(next, new Error(msg), req, 422);
      }

      const equipment = await prisma.equipment.findUnique({ where: { id } });
      if (!equipment)
        return httpError(
          next,
          new Error(responseMessage.NOT_FOUND("Equipment")),
          req,
          404,
        );

      const updated = await prisma.equipment.update({
        where: { id },
        data: { status: "REJECTED", adminNote: result.data.adminNote },
        select: EQUIPMENT_SELECT,
      });
      httpResponse(req, res, 200, responseMessage.SUCCESS, updated);
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },

  /** DELETE /admin/equipment/:id — admin: hard delete + remove images from Cloudinary */
  adminDelete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const equipment = await prisma.equipment.findUnique({ where: { id } });
      if (!equipment)
        return httpError(
          next,
          new Error(responseMessage.NOT_FOUND("Equipment")),
          req,
          404,
        );

      await Promise.all(
        equipment.publicIds.map((pid) => deleteFromCloudinary(pid)),
      );
      await prisma.equipment.delete({ where: { id } });
      httpResponse(req, res, 200, responseMessage.SUCCESS, null);
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },
};
