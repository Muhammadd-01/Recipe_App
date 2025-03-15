import API from "./api.js"
import UI from "./ui.js"
import Favorites from "./favorites.js"
import DarkMode from "./darkMode.js"

/**
 * Main App Controller
 */
const App = {
  /**
   * Initialize the app
   */
  async init() {
    // Initialize UI and Dark Mode
    UI.init()
    DarkMode.init()

    // Set up search functionality
    this.setupSearch()

    // Load and render categories
    this.loadCategories()

    // Load initial recipes
    this.loadInitialRecipes()

    // Load favorites
    this.loadFavorites()
  },

  /**
   * Load initial recipes
   */
  async loadInitialRecipes() {
    UI.showLoading()
    try {
      const recipes = await API.getRandomRecipes(12)
      UI.renderRecipes(recipes)
    } catch (error) {
      console.error("Error loading initial recipes:", error)
    } finally {
      UI.hideLoading()
    }
  },

  /**
   * Load and render categories
   */
  async loadCategories() {
    try {
      const categories = await API.getCategories()
      UI.renderCategoryFilters(categories, this.handleCategorySelect.bind(this))
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  },

  /**
   * Handle category selection
   * @param {string} category - Selected category name
   */
  async handleCategorySelect(category) {
    UI.showLoading()
    try {
      let recipes

      if (category === "all") {
        recipes = await API.getRandomRecipes(12)
      } else {
        recipes = await API.getRecipesByCategory(category)
      }

      UI.renderRecipes(recipes)
    } catch (error) {
      console.error("Error loading recipes by category:", error)
    } finally {
      UI.hideLoading()
    }
  },

  /**
   * Set up search functionality
   */
  setupSearch() {
    const searchButton = document.getElementById("search-button")
    const searchInput = document.getElementById("search-input")

    searchButton.addEventListener("click", () => {
      this.handleSearch(searchInput.value)
    })

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleSearch(searchInput.value)
      }
    })
  },

  /**
   * Handle search
   * @param {string} query - Search query
   */
  async handleSearch(query) {
    if (!query.trim()) return

    UI.showLoading()
    try {
      const recipes = await API.searchRecipes(query)
      UI.renderRecipes(recipes)

      // Show home view
      UI.showView("home")

      // Update active nav link
      document.querySelectorAll(".main-nav a").forEach((link) => {
        if (link.getAttribute("data-view") === "home") {
          link.classList.add("active")
        } else {
          link.classList.remove("active")
        }
      })
    } catch (error) {
      console.error("Error searching recipes:", error)
    } finally {
      UI.hideLoading()
    }
  },

  /**
   * Load and render favorites
   */
  loadFavorites() {
    const favorites = Favorites.getFavorites()
    UI.renderFavorites(favorites)
  },
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  App.init()
})

