import type { NextFunction, Request, RequestHandler, Response } from "express";
import responseMessage from "../constant/responseMessage.js";
import { prisma } from "../lib/db.js";
import { createCategorySchema } from "../schema/category.schema.js";
import {
  deleteFromCloudinary,
  upload,
  uploadToCloudinary,
} from "../util/fileUpload.js";
import { httpError } from "../util/httpError.js";
import { httpResponse } from "../util/httpResponse.js";

export const uploadCategoryImage: RequestHandler = upload.single("image");

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default {
  /** GET /categories — public: list all categories */
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          imageUrl: true,
        },
      });
      httpResponse(req, res, 200, responseMessage.SUCCESS, categories);
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },

  /** POST /admin/categories — admin: create category */
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = createCategorySchema.safeParse(req.body);
      if (!result.success) {
        const msg = result.error.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ");
        return httpError(next, new Error(msg), req, 422);
      }

      const file = req.file as Express.Multer.File | undefined;
      if (!file) {
        return httpError(
          next,
          new Error("Category image is required."),
          req,
          422,
        );
      }

      const { name, description } = result.data;
      const slug = slugify(name);

      const existing = await prisma.category.findFirst({
        where: { OR: [{ name }, { slug }] },
      });
      if (existing) {
        return httpError(
          next,
          new Error(responseMessage.ALREADY_EXISTS("Category", name)),
          req,
          400,
        );
      }

      const uploaded = await uploadToCloudinary(file);

      const category = await prisma.category.create({
        data: {
          name,
          slug,
          description: description ?? null,
          imageUrl: uploaded.secure_url,
          imagePublicId: uploaded.public_id,
        },
      });
      httpResponse(req, res, 201, responseMessage.SUCCESS, category);
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },

  /** DELETE /admin/categories/:id — admin: delete category */
  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const category = await prisma.category.findUnique({ where: { id } });
      if (!category) {
        return httpError(
          next,
          new Error(responseMessage.NOT_FOUND("Category")),
          req,
          404,
        );
      }
      if (category.imagePublicId) {
        await deleteFromCloudinary(category.imagePublicId);
      }
      await prisma.category.delete({ where: { id } });
      httpResponse(req, res, 200, responseMessage.SUCCESS, null);
    } catch (error) {
      httpError(next, error, req, 500);
    }
  },
};
