// Function to load HTML components
async function loadComponent(url, targetSelector) {
  try {
    const response = await fetch(url)
    const html = await response.text()
    document.querySelector(targetSelector).innerHTML = html

    // Set active class for current page in navigation
    const currentPage = window.location.pathname.split("/").pop() || "index.html"
    const navItem = document.querySelector(`.nav-${currentPage.replace(".html", "")}`)
    if (navItem) {
      navItem.classList.add("active")
    } else if (currentPage === "" || currentPage === "index.html") {
      document.querySelector(".nav-home").classList.add("active")
    }
  } catch (error) {
    console.error(`Error loading component from ${url}:`, error)
  }
}

// Load components when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  // Load header and footer components
  await loadComponent("header.html", "#header-container")
  await loadComponent("footer.html", "#footer-container")

  // Initialize the main script after components are loaded
  // Declare initializeApp if it's not already declared
  let initializeApp
  if (typeof window.initializeApp === "function") {
    initializeApp = window.initializeApp
  } else {
    initializeApp = () => {
      console.warn("initializeApp function is not defined.")
    }
  }

  if (typeof initializeApp === "function") {
    initializeApp()
  }
})

