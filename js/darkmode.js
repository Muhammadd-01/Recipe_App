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
      if (input) {
        input.checked = this.isDarkMode()

        // Update toggle appearance
        this.updateToggleAppearance(input)

        // Add event listener for theme toggle
        input.addEventListener("change", () => {
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
  },

  /**
   * Check if dark mode is currently active
   * @returns {boolean} - True if dark mode is active
   */
  isDarkMode() {
    return document.documentElement.classList.contains("dark") || document.body.classList.contains("dark")
  },
}

export default DarkMode

