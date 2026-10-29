import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      console.error("Download API: No token provided")
      return NextResponse.json({ error: "Download token is required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Look up the download token with detailed logging
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

    if (downloadError) {
      console.error("Download lookup error:", downloadError)
      return NextResponse.json({ error: "Download link not found" }, { status: 404 })
    }

    if (!downloadData) {
      console.error("No download data found for token")
      return NextResponse.json({ error: "Download link not found" }, { status: 404 })
    }


    // Check if expired
    const expiresAt = new Date(downloadData.expires_at)
    if (expiresAt < new Date()) {
      console.error("Download link expired at:", expiresAt)
      return NextResponse.json(
        { error: "Download link has expired" },
        { status: 410 }
      )
    }

    // Check if max downloads reached
    if (downloadData.download_count >= downloadData.max_downloads) {
      console.error("Max downloads reached:", downloadData.download_count, ">=", downloadData.max_downloads)
      return NextResponse.json(
        { error: "Maximum downloads reached for this link" },
        { status: 403 }
      )
    }

    const product = downloadData.shop_products_enhanced as any
    if (!product) {
      console.error("Product not found for product_id:", downloadData.product_id)
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // If digital_file_path is already a complete signed URL, return it directly
    if (product.digital_file_path && (product.digital_file_path.startsWith("http") || product.digital_file_path.includes("supabase"))) {
      
      // Increment download count
      const { error: updateError } = await supabase
        .from("shop_digital_downloads")
        .update({
          download_count: downloadData.download_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", downloadData.id)

      if (updateError) {
        console.error("Failed to update download count:", updateError)
      }

      return NextResponse.json({
        downloadUrl: product.digital_file_path,
        productName: product.name,
        expiresIn: 3600, // 1 hour
      })
    }

    // Otherwise, try to generate a signed URL from storage
    if (!product.digital_file_path) {
      console.error("No digital_file_path found in product")
      return NextResponse.json(
        { error: "Digital file not configured for this product" },
        { status: 404 }
      )
    }


    // Generate signed URL for the file
    const { data: signedUrl, error: signError } = await supabase.storage
      .from("digital-products")
      .createSignedUrl(product.digital_file_path, 3600) // 1 hour expiry

    if (signError) {
      console.error("Failed to generate signed URL:", signError)
      return NextResponse.json(
        { error: "Failed to generate download link: " + signError.message },
        { status: 500 }
      )
    }

    if (!signedUrl) {
      console.error("Signed URL is null")
      return NextResponse.json(
        { error: "Failed to generate download link" },
        { status: 500 }
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
      console.error("Failed to update download count:", updateError)
    }

    return NextResponse.json({
      downloadUrl: signedUrl.signedUrl,
      productName: product.name,
      expiresIn: 3600, // seconds
    })
  } catch (error) {
    console.error("Download API error:", error)
    return NextResponse.json(
      { error: "Internal server error: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    )
  }
}
