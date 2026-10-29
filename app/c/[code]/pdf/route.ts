import { NextResponse } from "next/server"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { checkCertificate } from "@/lib/certificates/verify"
import { rateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"

// The standard PDF fonts only hold Latin letters; anything else becomes "?".
const latin = (s: string) => s.replace(/[^\x20-\x7E -ÿ]/g, "?")

export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const limited = await rateLimit(req, "cert-pdf", 20, 3600)
  if (limited) return limited
  const { code } = await params
  const c = await checkCertificate(code)
  if (c.status !== "valid") return new NextResponse("Not found", { status: 404 })

  const doc = await PDFDocument.create()
  const page = doc.addPage([842, 595]) // A4 landscape
  const serif = await doc.embedFont(StandardFonts.TimesRoman)
  const bold = await doc.embedFont(StandardFonts.TimesRomanBold)
  const mono = await doc.embedFont(StandardFonts.Courier)
  const green = rgb(0.05, 0.35, 0.25)
  const center = (text: string, y: number, size: number, font = serif, color = rgb(0.1, 0.1, 0.1)) => {
    const t = latin(text)
    page.drawText(t, { x: (842 - font.widthOfTextAtSize(t, size)) / 2, y, size, font, color })
  }

  page.drawRectangle({ x: 24, y: 24, width: 794, height: 547, borderColor: green, borderWidth: 3 })
  page.drawRectangle({ x: 34, y: 34, width: 774, height: 527, borderColor: green, borderWidth: 0.8 })
  center("HAMDUK ISLAMIC FOUNDATION", 505, 16, bold, green)
  center("Certificate of Completion", 450, 34, bold)
  center("This is to certify that", 400, 15)
  center(c.name, 350, 32, bold, green)
  center("has successfully completed the course", 305, 15)
  center(c.course, 265, 24, bold)
  center(`with a grade of ${c.grade}%`, 225, 15)
  center(`Issued on ${new Date(c.issued).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, 190, 13)
  center(`Certificate code ${code.toUpperCase()}`, 110, 12, mono)
  center(`Check this certificate at hif.com.ng/c/${code.toUpperCase()}`, 90, 12)

  const bytes = await doc.save()
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="HIF-certificate-${code.toUpperCase()}.pdf"`,
      "Cache-Control": "private, max-age=300",
    },
  })
}
