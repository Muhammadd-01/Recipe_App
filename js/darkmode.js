/**
 * Dark mode functionality with enhanced features
 */
const DarkMode = {
  storageKey: "recipe-app-theme",

  /**
   * Initialize dark mode
   */
  init() {
    // Get all theme toggle inputs
    const toggleInputs = [
      document.getElementById("theme-toggle"),
      document.getElementById("mobile-theme-toggle"),
    ].filter((input) => input !== null)

    // Set initial state based on localStorage or user preference
    this.setInitialTheme()

    // Update toggle states
    toggleInputs.forEach((input) => {
      input.checked = this.isDarkMode()

      // Update toggle appearance
      this.updateToggleAppearance(input)

      // Add event listener for theme toggle
      input.addEventListener("change", () => {
        this.toggleTheme()

        // Update all toggles to match
        toggleInputs.forEach((otherInput) => {
          otherInput.checked = this.isDarkMode()
          this.updateToggleAppearance(otherInput)
        })
      })
    })

    // Add keyboard shortcut for theme toggle (Alt+T)
    document.addEventListener("keydown", (e) => {
      if (e.altKey && e.key === "t") {
        this.toggleTheme()
        toggleInputs.forEach((input) => {
          input.checked = this.isDarkMode()
          this.updateToggleAppearance(input)
        })
      }
    })
  },

  /**
   * Update toggle appearance based on current theme
   * @param {HTMLElement} input - Toggle input element
   */
  updateToggleAppearance(input) {
    const label = input.nextElementSibling
    if (label) {
      const slider = label.querySelector("div")
      if (slider) {
        if (this.isDarkMode()) {
          slider.style.transform = "translateX(24px)"
        } else {
          slider.style.transform = "translateX(0)"
        }
      }
    }
  },

  /**
   * Set initial theme based on localStorage or user preference
   */
  setInitialTheme() {
    const savedTheme = localStorage.getItem(this.storageKey)

    if (savedTheme) {
      // Use saved theme preference
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark")
      }
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

      if (prefersDark) {
        document.documentElement.classList.add("dark")
        localStorage.setItem(this.storageKey, "dark")
      } else {
        localStorage.setItem(this.storageKey, "light")
      }
    }

    // Add transition class after initial load to enable smooth transitions
    // This prevents flash of incorrect theme on page load
    setTimeout(() => {
      document.body.classList.add("transition-colors", "duration-300")
    }, 100)

    // Listen for system theme changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem(this.storageKey)) {
        if (e.matches) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
    })
  },

  /**
   * Toggle between light and dark theme
   */
  toggleTheme() {
    if (this.isDarkMode()) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem(this.storageKey, "light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem(this.storageKey, "dark")
    }

    // Dispatch custom event for theme change
    document.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { isDarkMode: this.isDarkMode() },
      }),
    )
  },

  /**
   * Check if dark mode is currently active
   * @returns {boolean} - True if dark mode is active
   */
  isDarkMode() {
    return document.documentElement.classList.contains("dark")
  },
}

export default DarkMode

