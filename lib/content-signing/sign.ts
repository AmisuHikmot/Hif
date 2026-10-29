import crypto from "node:crypto"

/** The exact bytes signed for a hadith. Must match the app (ContentVerifier.hadithMessage). */
export function hadithMessage(collection: string, number: string, arabic: string, translation: string) {
  return `hif-hadith-v1\n${collection}\n${number}\n${arabic}\n${translation}`
}

/**
 * The private key lives only in the CONTENT_SIGNING_KEY environment variable,
 * as the base64 of the PEM file. It is never logged or returned.
 */
function privateKey() {
  const b64 = process.env.CONTENT_SIGNING_KEY
  if (!b64) throw new Error("CONTENT_SIGNING_KEY is not set on the server.")
  return crypto.createPrivateKey(Buffer.from(b64, "base64").toString("utf8"))
}

export function signText(message: string): string {
  return crypto.sign(null, Buffer.from(message, "utf8"), privateKey()).toString("base64")
}
