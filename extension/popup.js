// ── Le Voyage Chrome Extension — Popup Script ──

const API_BASE = "http://localhost:5000/api"

// ── DOM Elements ──
const authSection = document.getElementById("auth-section")
const mainSection = document.getElementById("main-section")
const loginForm = document.getElementById("login-form")
const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const loginBtn = document.getElementById("login-btn")
const authError = document.getElementById("auth-error")
const logoutBtn = document.getElementById("logout-btn")
const userNameEl = document.getElementById("user-name")
const pageTitle = document.getElementById("page-title")
const platformBadge = document.getElementById("platform-badge")
const analyzeBtn = document.getElementById("analyze-btn")
const userCaption = document.getElementById("user-caption")
const resultSection = document.getElementById("result-section")
const loadingEl = document.getElementById("loading")
const errorMsg = document.getElementById("error-msg")
const saveBtn = document.getElementById("save-btn")
const saveStatus = document.getElementById("save-status")
const savedCountEl = document.getElementById("saved-count")
const openDashboard = document.getElementById("open-dashboard")

let currentAnalysis = null

// ── Init ──
document.addEventListener("DOMContentLoaded", async () => {
  const session = await getSession()
  if (session?.token) {
    showMainSection(session)
    detectCurrentPage()
  } else {
    showAuthSection()
  }
})

// ── Auth Functions ──
function showAuthSection() {
  authSection.classList.remove("hidden")
  mainSection.classList.add("hidden")
}

function showMainSection(session) {
  authSection.classList.add("hidden")
  mainSection.classList.remove("hidden")
  userNameEl.textContent = `Logged in as ${session.userName}`
  savedCountEl.classList.remove("hidden")
}

loginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim()
  const password = passwordInput.value

  if (!email || !password) {
    showError(authError, "Please enter email and password")
    return
  }

  loginBtn.disabled = true
  loginBtn.textContent = "Logging in..."

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      showError(authError, data.message || "Login failed")
      return
    }

    const session = {
      token: data.token,
      userId: data.user._id,
      userName: data.user.name,
    }

    await chrome.storage.local.set({ levoyage_session: session })
    showMainSection(session)
    detectCurrentPage()
  } catch (err) {
    showError(authError, "Connection failed. Is your backend running?")
  } finally {
    loginBtn.disabled = false
    loginBtn.textContent = "Log In"
  }
})

logoutBtn.addEventListener("click", async () => {
  await chrome.storage.local.remove("levoyage_session")
  currentAnalysis = null
  resultSection.classList.add("hidden")
  showAuthSection()
})

// ── Page Detection ──
async function detectCurrentPage() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.url) return

    const url = tab.url
    let platform = "web"
    if (url.includes("youtube.com")) platform = "youtube"
    else if (url.includes("instagram.com")) platform = "instagram"

    pageTitle.textContent = tab.title || url
    platformBadge.textContent = platform
    platformBadge.className = `badge badge-${platform}`
  } catch {
    pageTitle.textContent = "Unable to detect page"
  }
}

// ── Analyze ──
analyzeBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab?.url) {
    showError(errorMsg, "No page detected")
    return
  }

  hideError(errorMsg)
  resultSection.classList.add("hidden")
  loadingEl.classList.remove("hidden")
  analyzeBtn.disabled = true

  try {
    const res = await fetch(`${API_BASE}/places/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: tab.url,
        caption: userCaption.value.trim(),
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      if (res.status === 429) {
        showError(errorMsg, "⏳ AI quota exceeded. Please wait 1-2 minutes and try again.")
      } else {
        showError(errorMsg, data.message || "Analysis failed")
      }
      return
    }

    currentAnalysis = data.place
    displayResult(data.place)
  } catch (err) {
    showError(errorMsg, "Connection failed. Is your backend running?")
  } finally {
    loadingEl.classList.add("hidden")
    analyzeBtn.disabled = false
  }
})

// ── Display Result ──
function displayResult(place) {
  document.getElementById("result-name").textContent = place.placeName || "Unknown Place"
  document.getElementById("result-desc").textContent = place.description || ""

  const loc = place.location || {}
  const locationText = [loc.city, loc.state, loc.country].filter(Boolean).join(", ")
  document.getElementById("result-location").textContent = locationText || "Unknown"

  document.getElementById("result-category").textContent = place.category || "other"
  document.getElementById("result-time").textContent = place.bestTimeToVisit || "—"
  document.getElementById("result-budget").textContent = place.estimatedBudget || "—"

  // Image
  const imgWrapper = document.getElementById("result-image-wrapper")
  const imgEl = document.getElementById("result-image")
  if (place.imageUrl) {
    imgEl.src = place.imageUrl
    imgWrapper.classList.remove("hidden")
  } else {
    imgWrapper.classList.add("hidden")
  }

  // Highlights
  const highlightsEl = document.getElementById("result-highlights")
  highlightsEl.innerHTML = ""
  if (place.highlights?.length) {
    place.highlights.forEach((h) => {
      const tag = document.createElement("span")
      tag.className = "highlight-tag"
      tag.textContent = h
      highlightsEl.appendChild(tag)
    })
  }

  // AI Summary
  document.getElementById("result-summary").textContent = place.aiSummary || ""

  // Reset save button
  saveBtn.disabled = false
  saveBtn.innerHTML = '<span class="btn-icon">♡</span> Save to My Places'
  saveStatus.classList.add("hidden")

  resultSection.classList.remove("hidden")
}

// ── Save ──
saveBtn.addEventListener("click", async () => {
  if (!currentAnalysis) return

  const session = await getSession()
  if (!session?.token) {
    showError(saveStatus, "Please log in first")
    return
  }

  saveBtn.disabled = true
  saveBtn.textContent = "Saving..."

  try {
    const res = await fetch(`${API_BASE}/places/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify(currentAnalysis),
    })

    const data = await res.json()

    if (res.status === 409) {
      saveStatus.textContent = "Already saved!"
      saveStatus.className = "status-msg success"
      saveStatus.classList.remove("hidden")
      saveBtn.innerHTML = '<span class="btn-icon">✓</span> Already Saved'
      return
    }

    if (!res.ok) {
      showError(saveStatus, data.message || "Failed to save")
      return
    }

    saveStatus.textContent = "✓ Saved to your places!"
    saveStatus.className = "status-msg success"
    saveStatus.classList.remove("hidden")
    saveBtn.innerHTML = '<span class="btn-icon">✓</span> Saved!'
  } catch (err) {
    showError(saveStatus, "Connection failed")
  }
})

// ── Dashboard Link ──
openDashboard.addEventListener("click", (e) => {
  e.preventDefault()
  chrome.tabs.create({ url: "http://localhost:5173/saved-places" })
})

// ── Helpers ──
async function getSession() {
  const result = await chrome.storage.local.get("levoyage_session")
  return result.levoyage_session || null
}

function showError(el, msg) {
  el.textContent = msg
  el.className = "error"
  el.classList.remove("hidden")
}

function hideError(el) {
  el.classList.add("hidden")
}
