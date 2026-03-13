const { ChatGoogleGenerativeAI } = require("@langchain/google-genai")
const { HumanMessage } = require("@langchain/core/messages")
const { StateGraph, END } = require("@langchain/langgraph")
const { Annotation } = require("@langchain/langgraph")
const axios = require("axios")
const cheerio = require("cheerio")

// Model priority list — use models that have available quota
const MODEL_PRIORITY = [
  "gemini-2.5-flash",
  "gemini-3-flash-preview",
  "gemini-2.5-flash-lite",
]

const getModel = (modelName = MODEL_PRIORITY[0]) => {
  return new ChatGoogleGenerativeAI({
    model: modelName,
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.3,
  })
}

// Invoke with instant model fallback — no slow retries
async function invokeWithRetry(prompt) {
  const errors = []
  for (const modelName of MODEL_PRIORITY) {
    try {
      console.log(`[Gemini] Trying ${modelName}...`)
      const model = getModel(modelName)
      const response = await model.invoke([new HumanMessage(prompt)])
      console.log(`[Gemini] Success with ${modelName}`)
      return response
    } catch (err) {
      const is429 = err.message?.includes("429") || err.message?.includes("quota")
      if (is429) {
        console.log(`[Gemini] ${modelName} quota exhausted, skipping to next model...`)
        errors.push(`${modelName}: quota exceeded`)
        continue // immediately try next model, no waiting
      }
      throw err // non-rate-limit error, throw immediately
    }
  }
  throw new Error(
    "All Gemini models are rate-limited (" + errors.join(", ") + "). Please wait a few minutes or check your API key billing at https://ai.google.dev"
  )
}

// --- Helper: scrape metadata from a URL ---
async function scrapePageMetadata(url) {
  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })
    const $ = cheerio.load(data)

    const title =
      $('meta[property="og:title"]').attr("content") || $("title").text() || ""
    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      ""
    const image =
      $('meta[property="og:image"]').attr("content") || ""

    return { title: title.trim(), description: description.trim(), image }
  } catch {
    return { title: "", description: "", image: "" }
  }
}

// --- Detect platform from URL ---
function detectPlatform(url) {
  if (!url) return "manual"
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube"
  if (url.includes("instagram.com")) return "instagram"
  return "web"
}

// --- Extract YouTube video ID ---
function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

// ── LangGraph state definition ──
const PlaceAnalysisState = Annotation.Root({
  url: Annotation({ reducer: (_, b) => b, default: () => "" }),
  pageTitle: Annotation({ reducer: (_, b) => b, default: () => "" }),
  pageDescription: Annotation({ reducer: (_, b) => b, default: () => "" }),
  pageImage: Annotation({ reducer: (_, b) => b, default: () => "" }),
  platform: Annotation({ reducer: (_, b) => b, default: () => "" }),
  userCaption: Annotation({ reducer: (_, b) => b, default: () => "" }),
  analysisResult: Annotation({ reducer: (_, b) => b, default: () => null }),
})

// ── Node 1: Scrape metadata ──
async function scrapeNode(state) {
  const url = state.url
  if (!url) {
    return { pageTitle: "", pageDescription: "", pageImage: "", platform: "manual" }
  }
  const platform = detectPlatform(url)
  const meta = await scrapePageMetadata(url)
  return {
    pageTitle: meta.title,
    pageDescription: meta.description,
    pageImage: meta.image,
    platform,
  }
}

// ── Node 2: Analyze with Gemini ──
async function analyzeNode(state) {
  const prompt = `You are a travel expert AI. Analyze the following content from a ${state.platform} post and extract tourism/travel place information.

Page Title: ${state.pageTitle}
Page Description: ${state.pageDescription}
URL: ${state.url}
User Caption/Context: ${state.userCaption || "None provided"}

Extract the following information in valid JSON format (no markdown code fences):
{
  "placeName": "Name of the tourist place/destination",
  "description": "A compelling 2-3 sentence description of the place for travelers",
  "location": {
    "city": "City name",
    "state": "State/Province",
    "country": "Country",
    "address": "Approximate address if available",
    "lat": null,
    "lng": null
  },
  "category": "One of: beach, mountain, temple, heritage, city, nature, adventure, food, nightlife, cultural, wildlife, other",
  "bestTimeToVisit": "Best months/season to visit",
  "estimatedBudget": "Rough budget range per person per day in USD",
  "highlights": ["highlight 1", "highlight 2", "highlight 3"],
  "aiSummary": "A brief AI-generated travel tip or summary about visiting this place"
}

If you cannot determine the place, still try your best guess based on available context. Return ONLY valid JSON.`

  const response = await invokeWithRetry(prompt)
  const text = response.content

  // Parse JSON from response
  let parsed
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null
  } catch {
    parsed = null
  }

  return { analysisResult: parsed }
}

// ── Node 3: Geocode (get lat/lng if missing) ──
async function geocodeNode(state) {
  const result = state.analysisResult
  if (!result || (result.location?.lat && result.location?.lng)) {
    return {}
  }

  // Use Nominatim (free) for geocoding
  const query = [
    result.location?.address,
    result.location?.city,
    result.location?.state,
    result.location?.country,
  ]
    .filter(Boolean)
    .join(", ")

  if (!query) return {}

  try {
    const { data } = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: { q: query, format: "json", limit: 1 },
        headers: { "User-Agent": "LeVoyage-TravelApp/1.0" },
        timeout: 5000,
      }
    )

    if (data && data.length > 0) {
      result.location.lat = parseFloat(data[0].lat)
      result.location.lng = parseFloat(data[0].lon)
    }
  } catch {
    // Geocoding failed — leave lat/lng as null
  }

  return { analysisResult: result }
}

// ── Build the LangGraph ──
function buildAnalysisGraph() {
  const graph = new StateGraph(PlaceAnalysisState)
    .addNode("scrape", scrapeNode)
    .addNode("analyze", analyzeNode)
    .addNode("geocode", geocodeNode)
    .addEdge("__start__", "scrape")
    .addEdge("scrape", "analyze")
    .addEdge("analyze", "geocode")
    .addEdge("geocode", END)

  return graph.compile()
}

// ── Public API ──
async function analyzePlaceFromUrl(url, userCaption) {
  const app = buildAnalysisGraph()

  const result = await app.invoke({
    url: url || "",
    userCaption: userCaption || "",
  })

  if (!result.analysisResult) {
    throw new Error("Could not analyze the content. Try a different URL or add more context.")
  }

  return {
    ...result.analysisResult,
    imageUrl: result.pageImage || "",
    sourceUrl: url || "",
    sourcePlatform: result.platform || "manual",
  }
}

async function analyzePlaceFromText(text) {
  const prompt = `You are a travel expert AI. The user described a place they saw on social media:

"${text}"

Extract tourism/travel place information in valid JSON format (no markdown code fences):
{
  "placeName": "Name of the tourist place/destination",
  "description": "A compelling 2-3 sentence description",
  "location": {
    "city": "City",
    "state": "State/Province",
    "country": "Country",
    "address": "",
    "lat": null,
    "lng": null
  },
  "category": "One of: beach, mountain, temple, heritage, city, nature, adventure, food, nightlife, cultural, wildlife, other",
  "bestTimeToVisit": "Best months/season",
  "estimatedBudget": "Budget range per person per day in USD",
  "highlights": ["highlight 1", "highlight 2", "highlight 3"],
  "aiSummary": "A brief travel tip"
}

Return ONLY valid JSON.`

  const response = await invokeWithRetry(prompt)
  const text2 = response.content

  let parsed
  try {
    const jsonMatch = text2.match(/\{[\s\S]*\}/)
    parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null
  } catch {
    parsed = null
  }

  if (!parsed) {
    throw new Error("Could not analyze the text. Please provide more details.")
  }

  // Geocode
  const query = [parsed.location?.city, parsed.location?.state, parsed.location?.country]
    .filter(Boolean)
    .join(", ")

  if (query) {
    try {
      const { data } = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: { q: query, format: "json", limit: 1 },
          headers: { "User-Agent": "LeVoyage-TravelApp/1.0" },
          timeout: 5000,
        }
      )
      if (data && data.length > 0) {
        parsed.location.lat = parseFloat(data[0].lat)
        parsed.location.lng = parseFloat(data[0].lon)
      }
    } catch {
      // Geocoding failed
    }
  }

  return {
    ...parsed,
    imageUrl: "",
    sourceUrl: "",
    sourcePlatform: "manual",
  }
}

module.exports = { analyzePlaceFromUrl, analyzePlaceFromText }
