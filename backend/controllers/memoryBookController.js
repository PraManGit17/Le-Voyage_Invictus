const { ChatGoogleGenerativeAI, HumanMessage } = require("@langchain/google-genai")
const { HumanMessage: HMsg } = require("@langchain/core/messages")

const MODEL_PRIORITY = [
  "gemini-2.5-flash",
  "gemini-3-flash-preview",
  "gemini-2.5-flash-lite",
]

async function invokeWithFallback(messages) {
  for (const modelName of MODEL_PRIORITY) {
    try {
      const model = new ChatGoogleGenerativeAI({
        model: modelName,
        apiKey: process.env.GEMINI_API_KEY,
        temperature: 0.7,
      })
      return await model.invoke(messages)
    } catch (err) {
      if (err.message?.includes("429") || err.message?.includes("quota")) continue
      throw err
    }
  }
  throw new Error("All Gemini models rate-limited. Try again in a few minutes.")
}

// POST /api/memory-book/generate-story
// Accepts: { pages: [{ caption, location, dayLabel, tripTitle, highlights, summary }] }
exports.generateStory = async (req, res) => {
  try {
    const { pages } = req.body

    if (!pages || !pages.length) {
      return res.status(400).json({ message: "Provide at least one page with caption/location." })
    }

    const pagesContext = pages
      .map((p, i) => {
        const highlights = Array.isArray(p.highlights) && p.highlights.length
          ? p.highlights.join(", ")
          : "None provided"

        return [
          `Page ${i + 1}:`,
          `Trip title: "${p.tripTitle || "Untitled Journey"}"`,
          `Day label: "${p.dayLabel || `Day ${i + 1}`}"`,
          `Caption: "${p.caption || "No caption"}"`,
          `Location: "${p.location || "Unknown"}"`,
          `Highlights: "${highlights}"`,
          `Trip summary: "${p.summary || "No summary provided"}"`,
        ].join(" ")
      })
      .join("\n")

    const prompt = `You are a poetic travel storyteller helping write a travel memory book.
For each page described below, write one beautiful, immersive paragraph of 3 to 5 sentences.
Write in first person, as if the traveler is remembering the day.
Use the caption and trip details as anchors, but make the writing feel natural, nostalgic, vivid, and personal.
Do not mention that the text was AI-generated. Do not output titles or bullet points.
Keep each paragraph distinct from the others.

${pagesContext}

Return a JSON array of strings — one story paragraph per page. Return ONLY valid JSON, no markdown fences.
Example: ["Story for page 1...", "Story for page 2..."]`

    const response = await invokeWithFallback([new HMsg(prompt)])
    const text = response.content

    let stories
    try {
      const match = text.match(/\[[\s\S]*\]/)
      stories = match ? JSON.parse(match[0]) : null
    } catch {
      stories = null
    }

    if (!stories) {
      return res.status(500).json({ message: "Failed to generate stories. Try again." })
    }

    res.json({ stories })
  } catch (error) {
    console.error("Memory book error:", error.message)
    const is429 = error.message?.includes("429") || error.message?.includes("rate-limited")
    res.status(is429 ? 429 : 500).json({ message: error.message })
  }
}
