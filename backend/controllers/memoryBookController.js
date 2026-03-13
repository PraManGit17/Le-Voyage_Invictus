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
// Accepts: { pages: [{ caption, location }] } — generates story text for each page
exports.generateStory = async (req, res) => {
  try {
    const { pages } = req.body

    if (!pages || !pages.length) {
      return res.status(400).json({ message: "Provide at least one page with caption/location." })
    }

    const pagesContext = pages
      .map((p, i) => `Page ${i + 1}: Caption: "${p.caption || "No caption"}", Location: "${p.location || "Unknown"}"`)
      .join("\n")

    const prompt = `You are a poetic travel storyteller. The user has a trip memory book with photos.
For each page described below, write a beautiful, immersive story paragraph (3-5 sentences) that brings the travel memory to life.
Write in first person, as if the traveler is recounting the memory.
Make it emotional, vivid, and nostalgic.

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
