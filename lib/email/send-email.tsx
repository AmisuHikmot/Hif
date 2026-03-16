import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const result = await resend.emails.send({
      from: "orders@hif.com.ng",
      to,
      subject,
      html: htmlContent,
    })

    if (result.error) {
      console.error("[v0] Resend error:", result.error)
      return { success: false, error: result.error.message }
    }

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error("[v0] Email sending failed:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function sendOrderConfirmationEmail(
  customerEmail: string,
  customerName: string,
  orderReference: string,
  totalAmount: number,
  items: Array<{ productName: string; quantity: number; unitPrice: number }>,
  hasDigital: boolean
) {
  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.productName}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">₦${(item.unitPrice / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">₦${((item.unitPrice * item.quantity) / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</td>
        </tr>`
    )
    .join("")

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 8px; }
          .header h1 { margin: 0; color: #064e3b; }
          .content { padding: 20px 0; }
          .order-info { background: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .order-info p { margin: 8px 0; }
          .label { font-weight: bold; color: #064e3b; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          table th { background: #f3f4f6; padding: 8px; text-align: left; font-weight: bold; border-bottom: 2px solid #e5e7eb; }
          .footer { text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 10px 20px; background: #064e3b; color: white; text-decoration: none; border-radius: 4px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Order Confirmed!</h1>
            <p style="margin: 10px 0 0 0; color: #666;">Thank you for your purchase</p>
          </div>

          <div class="content">
            <p>Assalamu alaykum wa rahmatullahi wa barakatuh,</p>
            
            <p>Thank you <span class="label">${customerName}</span>, your order has been confirmed and payment has been received.</p>

            <div class="order-info">
              <p><span class="label">Order Reference:</span> ${orderReference}</p>
              <p><span class="label">Total Amount:</span> ₦${(totalAmount / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
              <p><span class="label">Order Date:</span> ${new Date().toLocaleDateString("en-NG")}</p>
            </div>

            <h3 style="color: #064e3b; margin-top: 20px;">Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <p style="margin-top: 20px;">
              ${hasDigital ? '📥 <strong>Your digital downloads will be available immediately after payment confirmation.</strong> You will receive a separate email with download links for your digital products.' : '📦 Your order is being processed and will be dispatched soon. You will receive a tracking update via email.'}
            </p>

            <p style="margin-top: 20px;">
              <a href="https://www.hif.com.ng/track-order?ref=${orderReference}" class="button">Track Your Order</a>
            </p>

            <p style="margin-top: 20px;">
              If you have any questions, please don't hesitate to contact us at <a href="mailto:support@hif.com.ng">support@hif.com.ng</a>.
            </p>

            <p>Baarak Allaahu feek,<br/>The HIF Team</p>
          </div>

          <div class="footer">
            <p>© 2026 Hamduk Islamic Foundation. All rights reserved.</p>
            <p><a href="https://www.hif.com.ng">www.hif.com.ng</a> | <a href="mailto:support@hif.com.ng">support@hif.com.ng</a></p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail(customerEmail, `Order Confirmation - ${orderReference}`, htmlContent)
}

export async function sendDigitalDownloadEmail(
  customerEmail: string,
  customerName: string,
  productName: string,
  downloadLink: string
) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 8px; }
          .header h1 { margin: 0; color: #064e3b; }
          .content { padding: 20px 0; }
          .download-box { background: #ecfdf5; border: 2px solid #064e3b; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 30px; background: #064e3b; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 10px 0; }
          .footer { text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 12px; }
          .warning { color: #d97706; font-size: 12px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📥 Your Download is Ready!</h1>
            <p style="margin: 10px 0 0 0; color: #666;">Access your digital product now</p>
          </div>

          <div class="content">
            <p>Assalamu alaykum wa rahmatullahi wa barakatuh,</p>
            
            <p>Your digital product <span style="font-weight: bold; color: #064e3b;">${productName}</span> is ready for download!</p>

            <div class="download-box">
              <p style="margin: 0 0 15px 0;">Click the button below to download your product:</p>
              <a href="${downloadLink}" class="button">Download Now</a>
              <p class="warning">This link will expire in 7 days. Download your files before then.</p>
            </div>

            <p style="margin-top: 20px;">
              If you have any trouble downloading, please let us know at <a href="mailto:support@hif.com.ng">support@hif.com.ng</a>.
            </p>

            <p>Baarak Allaahu feek,<br/>The HIF Team</p>
          </div>

          <div class="footer">
            <p>© 2026 Hamduk Islamic Foundation. All rights reserved.</p>
            <p><a href="https://www.hif.com.ng">www.hif.com.ng</a> | <a href="mailto:support@hif.com.ng">support@hif.com.ng</a></p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendEmail(customerEmail, `Your Digital Download: ${productName}`, htmlContent)
}
