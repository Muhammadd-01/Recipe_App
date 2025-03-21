/**
 * Dark Mode Controller
 */
const DarkMode = {
  /**
   * Initialize dark mode
   */
  init() {
    console.log("Initializing Dark Mode")
    // Check if dark mode is enabled in localStorage
    const isDarkMode = localStorage.getItem("dark-mode") === "true"

    // Apply dark mode if enabled
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Set up theme toggle
    this.setupThemeToggle()

    // Make DarkMode available globally
    window.DarkMode = this
  },

  /**
   * Set up theme toggle
   */
  setupThemeToggle() {
    // Get theme toggle elements
    const themeToggle = document.getElementById("theme-toggle")
    const mobileThemeToggle = document.getElementById("mobile-theme-toggle")

    // Set initial state of theme toggles
    if (themeToggle) {
      themeToggle.checked = this.isDarkMode()
      this.updateToggleAppearance(themeToggle)

      // Add event listener to theme toggle
      themeToggle.addEventListener("change", () => {
        console.log("Theme toggle changed")
        this.toggleTheme()
      })
    }

    if (mobileThemeToggle) {
      mobileThemeToggle.checked = this.isDarkMode()
      this.updateToggleAppearance(mobileThemeToggle)

      // Add event listener to mobile theme toggle
      mobileThemeToggle.addEventListener("change", () => {
        console.log("Mobile theme toggle changed")
        this.toggleTheme()
      })
    }

    // Add event listener to toggle dark mode button
    const toggleDarkModeBtn = document.getElementById("toggle-dark-mode-btn")
    if (toggleDarkModeBtn) {
      toggleDarkModeBtn.addEventListener("click", () => {
        console.log("Toggle dark mode button clicked")
        this.toggleTheme()
      })
    }
  },

  /**
   * Toggle theme between light and dark
   */
  toggleTheme() {
    console.log("Toggling theme")
    // Toggle dark class on html element
    document.documentElement.classList.toggle("dark")

    // Update localStorage
    const isDarkMode = document.documentElement.classList.contains("dark")
    localStorage.setItem("dark-mode", isDarkMode)

    // Update theme toggles
    const themeToggle = document.getElementById("theme-toggle")
    const mobileThemeToggle = document.getElementById("mobile-theme-toggle")

    if (themeToggle) {
      themeToggle.checked = isDarkMode
      this.updateToggleAppearance(themeToggle)
    }

    if (mobileThemeToggle) {
      mobileThemeToggle.checked = isDarkMode
      this.updateToggleAppearance(mobileThemeToggle)
    }

    console.log("Theme toggled to", isDarkMode ? "dark" : "light")
  },

  /**
   * Check if dark mode is enabled
   * @returns {boolean} - True if dark mode is enabled
   */
  isDarkMode() {
    return document.documentElement.classList.contains("dark")
  },

  /**
   * Update toggle appearance
   * @param {HTMLElement} toggle - Toggle element
   */
  updateToggleAppearance(toggle) {
    if (!toggle) return

    const toggleLabel = toggle.nextElementSibling
    if (!toggleLabel) return

    const toggleCircle = toggleLabel.querySelector("div")
    if (!toggleCircle) return

    if (toggle.checked) {
      toggleCircle.classList.add("translate-x-6")
      toggleCircle.classList.remove("translate-x-0")
    } else {
      toggleCircle.classList.add("translate-x-0")
      toggleCircle.classList.remove("translate-x-6")
    }
  },
}

export default DarkMode

