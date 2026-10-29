/** Gemini first, Groq if Gemini is down or rate-limited. Keys stay on the server. */

export type Turn = { role: "user" | "model"; text: string }

export type ImageInput = { mime: string; data: string }

export type LlmOptions = {
  system: string
  turns: Turn[]
  /** Attached to the last user turn. */
  image?: ImageInput
  /** Let the model search the web (Gemini Google Search; Groq compound). */
  search?: boolean
  json?: boolean
  maxTokens?: number
  temperature?: number
}

export type LlmResult = { text: string; model: string; webSources?: { title: string; uri: string }[] }

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash"
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile"
const GROQ_VISION_MODEL = process.env.GROQ_VISION_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct"
const GROQ_SEARCH_MODEL = process.env.GROQ_SEARCH_MODEL || "groq/compound-mini"

async function gemini(o: LlmOptions): Promise<LlmResult> {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error("no gemini key")
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: o.system }] },
      contents: o.turns.map((t, i) => ({
        role: t.role,
        parts:
          o.image && i === o.turns.length - 1
            ? [{ text: t.text }, { inlineData: { mimeType: o.image.mime, data: o.image.data } }]
            : [{ text: t.text }],
      })),
      ...(o.search ? { tools: [{ google_search: {} }] } : {}),
      generationConfig: {
        temperature: o.temperature ?? 0.2,
        maxOutputTokens: o.maxTokens ?? 1400,
        // Thinking tokens would eat the answer budget on the free tier.
        thinkingConfig: { thinkingBudget: 0 },
        ...(o.json && !o.search ? { responseMimeType: "application/json" } : {}),
      },
    }),
    signal: AbortSignal.timeout(30000),
  })
  if (!r.ok) throw new Error(`gemini ${r.status}`)
  const j = await r.json()
  const text: string = (j?.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("").trim()
  if (!text) throw new Error("gemini empty")
  const chunks: { web?: { title?: string; uri?: string } }[] = j?.candidates?.[0]?.groundingMetadata?.groundingChunks ?? []
  const webSources = chunks.flatMap((c) => (c.web?.uri ? [{ title: c.web.title ?? c.web.uri, uri: c.web.uri }] : []))
  return { text, model: GEMINI_MODEL, ...(webSources.length ? { webSources } : {}) }
}

async function groq(o: LlmOptions): Promise<LlmResult> {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new Error("no groq key")
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: o.image ? GROQ_VISION_MODEL : o.search ? GROQ_SEARCH_MODEL : GROQ_MODEL,
      temperature: o.temperature ?? 0.2,
      max_tokens: o.maxTokens ?? 1400,
      ...(o.json && !o.image && !o.search ? { response_format: { type: "json_object" } } : {}),
      messages: [
        { role: "system", content: o.system },
        ...o.turns.map((t, i) => ({
          role: t.role === "model" ? "assistant" : "user",
          content:
            o.image && i === o.turns.length - 1
              ? [
                  { type: "text", text: t.text },
                  { type: "image_url", image_url: { url: `data:${o.image.mime};base64,${o.image.data}` } },
                ]
              : t.text,
        })),
      ],
    }),
    signal: AbortSignal.timeout(25000),
  })
  if (!r.ok) throw new Error(`groq ${r.status}`)
  const j = await r.json()
  const text: string = j?.choices?.[0]?.message?.content?.trim() ?? ""
  if (!text) throw new Error("groq empty")
  return { text, model: j?.model ?? GROQ_MODEL }
}

export async function generate(o: LlmOptions): Promise<LlmResult> {
  try {
    return await gemini(o)
  } catch (first) {
    try {
      return await groq(o)
    } catch {
      throw first
    }
  }
}
