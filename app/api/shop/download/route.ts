import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Download token is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Look up the download token
    const { data: downloadData, error: downloadError } = await supabase
      .from("shop_digital_downloads")
      .select(
        `
        id,
        download_token,
        expires_at,
        download_count,
        max_downloads,
        product_id,
        order_id,
        shop_products_enhanced:product_id (
          id,
          name,
          digital_file_path
        )
      `
      )
      .eq("download_token", token)
      .single()

    if (downloadError || !downloadData) {
      return NextResponse.json({ error: "Download link not found" }, { status: 404 })
    }

    // Check if expired
    if (new Date(downloadData.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Download link has expired" },
        { status: 410 }
      )
    }

    // Check if max downloads reached
    if (downloadData.download_count >= downloadData.max_downloads) {
      return NextResponse.json(
        { error: "Maximum downloads reached for this link" },
        { status: 403 }
      )
    }

    const product = downloadData.shop_products_enhanced as any
    if (!product?.digital_file_path) {
      return NextResponse.json(
        { error: "Digital file not found" },
        { status: 404 }
      )
    }

    // Increment download count
    const { error: updateError } = await supabase
      .from("shop_digital_downloads")
      .update({
        download_count: downloadData.download_count + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", downloadData.id)

    if (updateError) {
      console.error("[v0] Failed to update download count:", updateError)
    }

    // Generate signed URL for the file
    // The digital_file_path should be like: "digital-products/order-123/filename.pdf"
    const { data: signedUrl, error: signError } = await supabase.storage
      .from("digital-products")
      .createSignedUrl(product.digital_file_path, 60) // 60 second expiry

    if (signError || !signedUrl) {
      console.error("[v0] Failed to generate signed URL:", signError)
      return NextResponse.json(
        { error: "Failed to generate download link" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      downloadUrl: signedUrl.signedUrl,
      productName: product.name,
      expiresIn: 60, // seconds
    })
  } catch (error) {
    console.error("[v0] Download API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
