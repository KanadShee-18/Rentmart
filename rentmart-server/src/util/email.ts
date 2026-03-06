import nodemailer from 'nodemailer'
import logger from './logger.js'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"RentMart Support" <support@rentmart.com>',
      to,
      subject,
      text,
    })
    logger.info(`Message sent: ${info.messageId}`)
    return info
  } catch (error) {
    logger.error('Error sending email', error)
    throw error
  }
}
