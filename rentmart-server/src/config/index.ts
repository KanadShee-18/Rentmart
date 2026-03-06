import dotenvFlow from 'dotenv-flow'
dotenvFlow.config()

export default {
  ENV: process.env.ENV,
  PORT: process.env.PORT,
  SERVER_URL: process.env.SERVER_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  ACCESS_TOKEN: {
    SECRET: process.env.ACCESS_TOKEN_SECRET || 'secret',
    EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || '7d',
  },
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    API_KEY: process.env.CLOUDINARY_API_KEY,
    API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
}
