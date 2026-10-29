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

// Model names change often and Google retires them for new users, so each
// provider tries a list in order. Override the first with an env variable.
const GEMINI_MODELS = [process.env.GEMINI_MODEL, "gemini-3.8-flash", "gemini-3.5-flash-lite", "gemini-3.6-flash", "gemini-3.1-flash-lite"].filter(
  (m, i, a): m is string => !!m && a.indexOf(m) === i,
)
const GROQ_TEXT_MODELS = [process.env.GROQ_MODEL, "openai/gpt-oss-120b", "llama-3.3-70b-versatile", "llama-3.1-8b-instant"].filter(
  (m, i, a): m is string => !!m && a.indexOf(m) === i,
)
// Groq's docs list no vision or search model by default; set these to use them.
const GROQ_VISION_MODEL = process.env.GROQ_VISION_MODEL
const GROQ_SEARCH_MODEL = process.env.GROQ_SEARCH_MODEL

// A model that answered 404 or timed out is skipped for ten minutes on this
// server instance, so one dead name does not eat the whole request time.
const benched = new Map<string, number>()
const bench = (m: string) => benched.set(m, Date.now() + 10 * 60_000)
const usable = (m: string) => (benched.get(m) ?? 0) < Date.now()

async function gemini(o: LlmOptions): Promise<LlmResult> {
  let last: unknown = new Error("no gemini model")
  for (const model of GEMINI_MODELS.filter(usable).length ? GEMINI_MODELS.filter(usable) : GEMINI_MODELS) {
    try {
      return await geminiOnce(o, model)
    } catch (e) {
      last = e
      bench(model)
      console.error("[ai] gemini", model, "failed:", e instanceof Error ? e.message.slice(0, 160) : e)
    }
  }
  throw last
}

async function geminiOnce(o: LlmOptions, model: string): Promise<LlmResult> {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error("no gemini key")
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
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
        maxOutputTokens: (o.maxTokens ?? 1400) + 1200,
        // 2.5 models can switch thinking off; newer ones manage it themselves.
        ...(model.startsWith("gemini-2.5") ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
        // Gemini 3 models think for a long time by default and were timing out.
        ...(model.startsWith("gemini-3") ? { thinkingConfig: { thinkingLevel: "low" } } : {}),
        ...(o.json && !o.search ? { responseMimeType: "application/json" } : {}),
      },
    }),
    signal: AbortSignal.timeout(15000),
  })
  if (!r.ok) throw new Error(`gemini ${r.status} ${(await r.text()).replace(/\s+/g, " ").slice(0, 300)}`)
  const j = await r.json()
  const text: string = (j?.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("").trim()
  if (!text) throw new Error("gemini empty")
  const chunks: { web?: { title?: string; uri?: string } }[] = j?.candidates?.[0]?.groundingMetadata?.groundingChunks ?? []
  const webSources = chunks.flatMap((c) => (c.web?.uri ? [{ title: c.web.title ?? c.web.uri, uri: c.web.uri }] : []))
  return { text, model, ...(webSources.length ? { webSources } : {}) }
}

async function groq(o: LlmOptions): Promise<LlmResult> {
  const models = o.image ? [GROQ_VISION_MODEL] : o.search ? [GROQ_SEARCH_MODEL] : GROQ_TEXT_MODELS
  let last: unknown = new Error("no groq model for this request")
  for (const model of models) {
    if (!model || !usable(model)) continue
    try {
      return await groqOnce(o, model)
    } catch (e) {
      last = e
      bench(model)
      console.error("[ai] groq", model, "failed:", e instanceof Error ? e.message.slice(0, 160) : e)
    }
  }
  throw last
}

async function groqOnce(o: LlmOptions, model: string): Promise<LlmResult> {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new Error("no groq key")
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
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
    signal: AbortSignal.timeout(12000),
  })
  if (!r.ok) throw new Error(`groq ${r.status} ${(await r.text()).replace(/\s+/g, " ").slice(0, 300)}`)
  const j = await r.json()
  const text: string = j?.choices?.[0]?.message?.content?.trim() ?? ""
  if (!text) throw new Error("groq empty")
  return { text, model: j?.model ?? model }
}

export async function generate(o: LlmOptions): Promise<LlmResult> {
  try {
    return await gemini(o)
  } catch (first) {
    console.error("[ai] gemini failed:", first instanceof Error ? first.message : first)
    try {
      return await groq(o)
    } catch (second) {
      console.error("[ai] groq failed:", second instanceof Error ? second.message : second)
      throw first
    }
  }
}
