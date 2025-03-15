/**
 * Dark mode functionality
 */
const DarkMode = {
    storageKey: "recipe-app-theme",
  
    /**
     * Initialize dark mode
     */
    init() {
      const toggleInput = document.getElementById("theme-toggle")
  
      // Set initial state based on localStorage or user preference
      this.setInitialTheme()
  
      // Update toggle state
      toggleInput.checked = this.isDarkMode()
  
      // Add event listener for theme toggle
      toggleInput.addEventListener("change", () => {
        this.toggleTheme()
      })
    },
  
    /**
     * Set initial theme based on localStorage or user preference
     */
    setInitialTheme() {
      const savedTheme = localStorage.getItem(this.storageKey)
  
      if (savedTheme) {
        // Use saved theme preference
        if (savedTheme === "dark") {
          document.body.classList.add("dark")
        }
      } else {
        // Check for system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  
        if (prefersDark) {
          document.body.classList.add("dark")
          localStorage.setItem(this.storageKey, "dark")
        } else {
          localStorage.setItem(this.storageKey, "light")
        }
      }
    },
  
    /**
     * Toggle between light and dark theme
     */
    toggleTheme() {
      if (this.isDarkMode()) {
        document.body.classList.remove("dark")
        localStorage.setItem(this.storageKey, "light")
      } else {
        document.body.classList.add("dark")
        localStorage.setItem(this.storageKey, "dark")
      }
    },
  
    /**
     * Check if dark mode is currently active
     * @returns {boolean} - True if dark mode is active
     */
    isDarkMode() {
      return document.body.classList.contains("dark")
    },
  }
  
  export default DarkMode
  
  