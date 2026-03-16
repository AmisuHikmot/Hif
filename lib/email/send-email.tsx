// Email configuration and sending utilities
import nodemailer from "nodemailer"

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com"
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587")
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASSWORD = process.env.SMTP_PASSWORD
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER
const FROM_NAME = process.env.FROM_NAME || "HIF Store"

// Create transporter instance
let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (!transporter && SMTP_USER && SMTP_PASSWORD) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    })
  }
  return transporter
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
  try {
    const mailer = getTransporter()

    if (!mailer) {
      console.warn("[v0] Email service not configured. Email not sent to:", to)
      return false
    }

    const result = await mailer.sendMail({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""),
    })

    console.log("[v0] Email sent successfully:", result.messageId)
    return true
  } catch (error) {
    console.error("[v0] Failed to send email:", error)
    return false
  }
}

export async function sendOrderConfirmationEmail(
  email: string,
  customerName: string,
  orderReference: string,
  orderTotal: number,
  items: Array<{ productName: string; quantity: number; unitPrice: number }>,
  hasDigital: boolean
) {
  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.productName}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₦${(item.unitPrice * item.quantity).toLocaleString("en-NG")}</td>
    </tr>`
    )
    .join("")

  const downloadNote = hasDigital
    ? `<div style="background-color: #f0f7ff; padding: 15px; border-left: 4px solid #0066cc; margin-top: 20px; border-radius: 4px;">
    <p style="margin: 0; color: #0066cc; font-weight: bold;">📥 Digital Products Available</p>
    <p style="margin: 5px 0 0 0; color: #333; font-size: 14px;">You can download your digital products from your account.</p>
  </div>`
    : ""

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1a1a1a; color: white; padding: 20px; border-radius: 4px 4px 0 0; }
        .content { border: 1px solid #ddd; padding: 20px; }
        .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 4px 4px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background-color: #f5f5f5; padding: 10px; text-align: left; font-weight: bold; }
        .total-row { background-color: #f0f0f0; font-weight: bold; font-size: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Order Confirmation</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your purchase!</p>
        </div>

        <div class="content">
          <p>Hi ${customerName},</p>
          
          <p>Your order has been confirmed and payment received. Below are your order details:</p>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Order Reference:</strong> ${orderReference}</p>
            <p style="margin: 5px 0 0 0;"><strong>Order Date:</strong> ${new Date().toLocaleDateString("en-NG")}</p>
          </div>

          <h3 style="margin-top: 20px;">Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr class="total-row">
                <td colspan="2" style="padding: 10px; text-align: right;">Total:</td>
                <td style="padding: 10px; text-align: right;">₦${orderTotal.toLocaleString("en-NG")}</td>
              </tr>
            </tbody>
          </table>

          ${downloadNote}

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="margin: 0; color: #666; font-size: 14px;">If you have any questions about your order, please don't hesitate to contact us.</p>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Best regards,<br><strong>HIF Store Team</strong></p>
          </div>
        </div>

        <div class="footer">
          <p style="margin: 0;">© ${new Date().getFullYear()} HIF. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Order Confirmation - ${orderReference}`,
    html,
  })
}

export async function sendDigitalDownloadEmail(
  email: string,
  customerName: string,
  productName: string,
  downloadLink: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1a1a1a; color: white; padding: 20px; border-radius: 4px 4px 0 0; }
        .content { border: 1px solid #ddd; padding: 20px; }
        .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 4px 4px; }
        .download-button { display: inline-block; padding: 12px 30px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Your Digital Download</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your purchase!</p>
        </div>

        <div class="content">
          <p>Hi ${customerName},</p>
          
          <p>Your digital product is ready for download!</p>

          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Product:</strong> ${productName}</p>
          </div>

          <p>Click the button below to download your file:</p>

          <center>
            <a href="${downloadLink}" class="download-button">Download Now</a>
          </center>

          <p style="font-size: 12px; color: #666; margin-top: 20px;">
            <strong>Note:</strong> This download link will expire in 7 days. Make sure to save your file before the expiration date.
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="margin: 0; color: #666; font-size: 14px;">If you have any issues downloading, please contact us.</p>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Best regards,<br><strong>HIF Store Team</strong></p>
          </div>
        </div>

        <div class="footer">
          <p style="margin: 0;">© ${new Date().getFullYear()} HIF. All rights reserved.</p>
          <p style="margin: 5px 0 0 0;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `Your Digital Download: ${productName}`,
    html,
  })
}
