import { createAdminClient } from "@/lib/supabase/admin"

export type CertificateCheck =
  | { status: "unknown" }
  | { status: "valid" | "revoked"; name: string; course: string; grade: number; issued: string }

const CODE = /^[A-Za-z0-9]{12}$/

export async function checkCertificate(code: string): Promise<CertificateCheck> {
  if (!CODE.test(code)) return { status: "unknown" }
  const { data, error } = await createAdminClient().rpc("verify_certificate", { p_code: code })
  if (error || !data || data.status === "unknown") return { status: "unknown" }
  return data as CertificateCheck
}
