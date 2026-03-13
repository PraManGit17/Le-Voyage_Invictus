# Le Voyage Chrome Extension

Save travel places directly from YouTube and Instagram into your Le Voyage trip planner.

## Setup

### 1. Generate Extension Icons

You need PNG icons at 16x16, 48x48, and 128x128. You can convert the provided `icons/icon.svg` using any tool, or create simple placeholder PNGs:

- Save a 16x16 PNG as `icons/icon16.png`
- Save a 48x48 PNG as `icons/icon48.png`
- Save a 128x128 PNG as `icons/icon128.png`

### 2. Add Gemini API Key

In your `backend/.env` file, add:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get one from [Google AI Studio](https://aistudio.google.com/apikey).

### 3. Start the Backend

```bash
cd backend
npm run dev
```

### 4. Load the Extension in Chrome

1. Open `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `extension/` folder
5. The Wayfarer icon will appear in your toolbar

### 5. Using the Extension

1. Go to any YouTube video or Instagram post about a travel destination
2. Click the Wayfarer extension icon in your toolbar
3. Log in with your Le Voyage account
4. Click **"Analyze This Place"** — the AI will identify the destination
5. Optionally add context (e.g., "the waterfall at 2:30 in the video")
6. Click **"Save to My Places"** to save it
7. View all saved places at `/saved-places` on your dashboard

## How It Works

- **Content Script**: Adds a floating button on YouTube/Instagram pages
- **Popup**: Main UI — login, analyze pages with AI, save places
- **Backend**: Uses LangChain + LangGraph with Gemini API to:
  1. Scrape page metadata (title, description, OG image)
  2. Analyze content with Gemini to extract place details
  3. Geocode the location using Nominatim (OpenStreetMap)
- **Frontend**: `/saved-places` page shows all saved places with:
  - Search & filter by category/platform
  - Distance calculation from your current location
  - Detail panel with AI summary and travel tips
  - Add to itinerary or view original source
