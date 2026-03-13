// ── Le Voyage Content Script ──
// Adds a floating "Save Place" button on YouTube and Instagram pages
// Survives SPA navigation (Instagram/YouTube are SPAs)

(() => {
  function injectFAB() {
    // Don't inject twice
    if (document.getElementById("levoyage-fab")) return

    // Wait for body
    if (!document.body) {
      setTimeout(injectFAB, 500)
      return
    }

    const fab = document.createElement("button")
    fab.id = "levoyage-fab"
    fab.title = "Analyze this place with Le Voyage"
    fab.setAttribute("style", `
      position: fixed !important;
      bottom: 24px !important;
      right: 24px !important;
      z-index: 2147483647 !important;
      width: 56px !important;
      height: 56px !important;
      border-radius: 16px !important;
      background: #0f172a !important;
      color: #fff !important;
      border: none !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.35) !important;
      padding: 0 !important;
      margin: 0 !important;
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: auto !important;
      transform: none !important;
      transition: background 0.2s, transform 0.2s !important;
    `)
    fab.innerHTML = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    `

    fab.addEventListener("mouseenter", () => {
      fab.style.background = "#2563eb"
      fab.style.transform = "scale(1.08)"
    })
    fab.addEventListener("mouseleave", () => {
      fab.style.background = "#0f172a"
      fab.style.transform = "none"
    })

    fab.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      showToast("Click the Wayfarer extension icon (W) in your toolbar to analyze this place!")
    })

    document.body.appendChild(fab)
    console.log("[Le Voyage] FAB injected on", window.location.hostname)
  }

  function showToast(message) {
    const existing = document.getElementById("levoyage-toast")
    if (existing) existing.remove()

    const toast = document.createElement("div")
    toast.id = "levoyage-toast"
    toast.textContent = message
    toast.setAttribute("style", `
      position: fixed !important;
      bottom: 92px !important;
      right: 24px !important;
      z-index: 2147483647 !important;
      background: #0f172a !important;
      color: #fff !important;
      padding: 12px 20px !important;
      border-radius: 14px !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.35) !important;
      max-width: 300px !important;
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: none !important;
      transition: opacity 0.3s !important;
    `)
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.style.opacity = "0"
      setTimeout(() => toast.remove(), 300)
    }, 3500)
  }

  // Inject immediately
  injectFAB()

  // Re-inject on SPA navigation (Instagram and YouTube are SPAs)
  // Watch for URL changes that remove the FAB
  let lastUrl = location.href
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href
      // Small delay to let the SPA settle
      setTimeout(injectFAB, 800)
    }
    // Also re-inject if someone removed our FAB
    if (!document.getElementById("levoyage-fab")) {
      injectFAB()
    }
  })
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  })
})()
