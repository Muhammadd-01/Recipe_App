/**
 * Dark mode functionality with enhanced features
 */
const DarkMode = {
  storageKey: "recipe-app-theme",

  /**
   * Initialize dark mode
   */
  init() {
    console.log("Initializing Dark Mode")

    // Get all theme toggle inputs
    const toggleInputs = [
      document.getElementById("theme-toggle"),
      document.getElementById("mobile-theme-toggle"),
    ].filter((input) => input !== null)

    console.log("Found toggle inputs:", toggleInputs.length)

    // Set initial state based on localStorage or user preference
    this.setInitialTheme()

    // Update toggle states
    toggleInputs.forEach((input) => {
      if (input) {
        input.checked = this.isDarkMode()

        // Update toggle appearance
        this.updateToggleAppearance(input)

        // Add event listener for theme toggle
        input.addEventListener("change", () => {
          console.log("Toggle changed, current state:", input.checked)
          this.toggleTheme()

          // Update all toggles to match
          toggleInputs.forEach((otherInput) => {
            if (otherInput) {
              otherInput.checked = this.isDarkMode()
              this.updateToggleAppearance(otherInput)
            }
          })
        })
      }
    })

    // Add keyboard shortcut for theme toggle (Alt+T)
    document.addEventListener("keydown", (e) => {
      if (e.altKey && e.key === "t") {
        this.toggleTheme()
        toggleInputs.forEach((input) => {
          if (input) {
            input.checked = this.isDarkMode()
            this.updateToggleAppearance(input)
          }
        })
      }
    })

    // Debug log
    console.log("DarkMode initialized, current state:", this.isDarkMode())

    // Make DarkMode globally available
    window.DarkMode = this
  },

  /**
   * Update toggle appearance based on current theme
   * @param {HTMLElement} input - Toggle input element
   */
  updateToggleAppearance(input) {
    if (!input) return

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
    console.log("Saved theme:", savedTheme)

    if (savedTheme) {
      // Use saved theme preference
      if (savedTheme === "dark") {
        this.applyDarkMode()
      } else {
        this.removeDarkMode()
      }
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      console.log("System prefers dark:", prefersDark)

      if (prefersDark) {
        this.applyDarkMode()
        localStorage.setItem(this.storageKey, "dark")
      } else {
        this.removeDarkMode()
        localStorage.setItem(this.storageKey, "light")
      }
    }

    // Add transition class after initial load to enable smooth transitions
    // This prevents flash of incorrect theme on page load
    setTimeout(() => {
      document.body.classList.add("transition-colors", "duration-300")
      document.documentElement.classList.add("transition-colors", "duration-300")
    }, 100)

    // Listen for system theme changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem(this.storageKey)) {
        if (e.matches) {
          this.applyDarkMode()
        } else {
          this.removeDarkMode()
        }
      }
    })
  },

  /**
   * Apply dark mode to all necessary elements
   */
  applyDarkMode() {
    console.log("Applying dark mode")
    document.documentElement.classList.add("dark")
    document.body.classList.add("dark")

    // Update any other elements that need dark mode classes
    const elementsToUpdate = document.querySelectorAll("[data-theme-toggle]")
    elementsToUpdate.forEach((el) => {
      el.classList.add("dark")
    })
  },

  /**
   * Remove dark mode from all necessary elements
   */
  removeDarkMode() {
    console.log("Removing dark mode")
    document.documentElement.classList.remove("dark")
    document.body.classList.remove("dark")

    // Update any other elements that need dark mode classes
    const elementsToUpdate = document.querySelectorAll("[data-theme-toggle]")
    elementsToUpdate.forEach((el) => {
      el.classList.remove("dark")
    })
  },

  /**
   * Toggle between light and dark theme
   */
  toggleTheme() {
    console.log("Toggling theme, current state:", this.isDarkMode())
    if (this.isDarkMode()) {
      this.removeDarkMode()
      localStorage.setItem(this.storageKey, "light")
    } else {
      this.applyDarkMode()
      localStorage.setItem(this.storageKey, "dark")
    }

    // Dispatch custom event for theme change
    document.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { isDarkMode: this.isDarkMode() },
      }),
    )

    // Debug log
    console.log("Theme toggled, new state:", this.isDarkMode())
  },

  /**
   * Check if dark mode is currently active
   * @returns {boolean} - True if dark mode is active
   */
  isDarkMode() {
    return document.documentElement.classList.contains("dark") || document.body.classList.contains("dark")
  },
}

// Initialize DarkMode immediately to prevent flash of incorrect theme
DarkMode.init()

export default DarkMode

