import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'
import multer, { type FileFilterCallback } from 'multer'
import config from '../config/index.js'
import path from 'path'
import os from 'os'
import fs from 'fs'
import { type Request } from 'express'
import logger from './logger.js'

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.CLOUDINARY.CLOUD_NAME as string,
  api_key: config.CLOUDINARY.API_KEY as string,
  api_secret: config.CLOUDINARY.API_SECRET as string,
})

// Configure Multer (Store locally first)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine system temp directory
    const tempDir = os.tmpdir()
    cb(null, tempDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    )
  },
})

// Filter for images and documents (PDF)
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedMimetypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
  ]
  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, JPG and PDF are allowed.'))
  }
}

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
})

export const uploadToCloudinary = async (
  file: Express.Multer.File
): Promise<UploadApiResponse> => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'rentmart',
      resource_type: 'auto',
    })

    // Clean up local temp file
    fs.unlink(file.path, (err) => {
      if (err) logger.error('Error deleting temp file:', err)
    })

    return result
  } catch (error) {
    // Ensure cleanup even on error
    fs.unlink(file.path, (err) => {
      if (err) logger.error('Error deleting temp file:', err)
    })
    throw error
  }
}

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId)
}
