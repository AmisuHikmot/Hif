import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/dashboard/", "/auth/", "/payment/", "/oauth/", "/cart", "/checkout", "/track-order", "/account/"],
      },
    ],
    sitemap: "https://www.hif.com.ng/sitemap.xml",
  }
}
