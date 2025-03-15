import API from "./api.js"
import UI from "./ui.js"
import Favorites from "./favorites.js"
import DarkMode from "./darkMode.js"
import Search from "./search.js"

/**
 * Main App Controller
 */
const App = {
  currentPage: 1,
  recipesPerPage: 8,
  currentCategory: "all",
  currentSearchQuery: "",

  /**
   * Initialize the app
   */
  async init() {
    // Initialize UI and Dark Mode
    UI.init()
    DarkMode.init()

    // Initialize Search
    Search.init(API)

    // Set up event listeners
    this.setupEventListeners()

    // Load and render categories
    this.loadCategories()

    // Load initial recipes
    this.loadInitialRecipes()

    // Load favorites
    this.loadFavorites()

    // Make App available globally for Search
    window.App = this
  },

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById("mobile-menu-button")
    const mobileMenu = document.getElementById("mobile-menu")

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden")
        mobileMenuButton.innerHTML = mobileMenu.classList.contains("hidden")
          ? '<i class="fas fa-bars text-2xl"></i>'
          : '<i class="fas fa-times text-2xl"></i>'
      })
    }

    // Load more button
    const loadMoreBtn = document.getElementById("load-more-btn")
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        this.loadMoreRecipes()
      })
    }

    // Trending recipes button
    const trendingBtn = document.getElementById("trending-btn")
    if (trendingBtn) {
      trendingBtn.addEventListener("click", () => {
        this.loadTrendingRecipes()
      })
    }

    // Random recipe button
    const randomRecipeBtn = document.getElementById("random-recipe-btn")
    if (randomRecipeBtn) {
      randomRecipeBtn.addEventListener("click", () => {
        this.loadRandomRecipe()
      })
    }

    // Explore recipes button in favorites
    const exploreRecipesBtn = document.getElementById("explore-recipes-btn")
    if (exploreRecipesBtn) {
      exploreRecipesBtn.addEventListener("click", (e) => {
        e.preventDefault()
        UI.showView("home")

        // Update active nav link
        document.querySelectorAll(".nav-link").forEach((link) => {
          if (link.getAttribute("data-view") === "home") {
            link.classList.add("active")
          } else {
            link.classList.remove("active")
          }
        })
      })
    }

    // Back to top button
    const backToTopButton = document.getElementById("back-to-top")
    if (backToTopButton) {
      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
          backToTopButton.classList.remove("opacity-0", "invisible")
          backToTopButton.classList.add("opacity-100", "visible")
        } else {
          backToTopButton.classList.remove("opacity-100", "visible")
          backToTopButton.classList.add("opacity-0", "invisible")
        }
      })

      backToTopButton.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      })
    }

    // Footer category links
    const footerCategories = document.querySelectorAll("#footer-categories a[data-category]")
    footerCategories.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const category = link.getAttribute("data-category")
        this.handleCategorySelect(category)

        // Show home view
        UI.showView("home")

        // Update active nav link
        document.querySelectorAll(".nav-link").forEach((navLink) => {
          if (navLink.getAttribute("data-view") === "home") {
            navLink.classList.add("active")
          } else {
            navLink.classList.remove("active")
          }
        })

        // Scroll to top
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      })
    })
  },

  /**
   * Load initial recipes
   */
  async loadInitialRecipes() {
    UI.showLoading()
    try {
      // Reset pagination
      this.currentPage = 1
      this.currentCategory = "all"
      this.currentSearchQuery = ""

      // Get random recipes
      const recipes = await API.getRandomRecipes(this.recipesPerPage)

      // Render recipes
      UI.renderRecipes(recipes)

      // Load featured recipe
      this.loadFeaturedRecipe()
    } catch (error) {
      console.error("Error loading initial recipes:", error)
    } finally {
      UI.hideLoading()
    }
  },

  /**
   * Load more recipes
   */
  async loadMoreRecipes() {
    const loadMoreBtn = document.getElementById("load-more-btn")
    if (loadMoreBtn) {
      loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Loading...'
      loadMoreBtn.disabled = true
    }

    try {
      this.currentPage++
      let recipes

      if (this.currentSearchQuery) {
        // If there's a search query, load more search results
        recipes = await API.searchRecipes(this.currentSearchQuery)
        // Simulate pagination (API doesn't support it)
        recipes = recipes.slice((this.currentPage - 1) * this.recipesPerPage, this.currentPage * this.recipesPerPage)
      } else if (this.currentCategory !== "all") {
        // If a category is selected, load more from that category
        recipes = await API.getRecipesByCategory(this.currentCategory)
        // Simulate pagination (API doesn't support it)
        recipes = recipes.slice((this.currentPage - 1) * this.recipesPerPage, this.currentPage * this.recipesPerPage)
      } else {
        // Otherwise load more random recipes
        recipes = await API.getRandomRecipes(this.recipesPerPage)
      }

      // Append recipes
      UI.appendRecipes(recipes)
    } catch (error) {
      console.error("Error loading more recipes:", error)
    } finally {
      if (loadMoreBtn) {
        loadMoreBtn.innerHTML = '<i class="fas fa-plus mr-2"></i> Load More Recipes'
        loadMoreBtn.disabled = false
      }
    }
  },

  /**
   * Load trending recipes
   */
  async loadTrendingRecipes() {
    UI.showLoading()
    try {
      // Reset pagination
      this.currentPage = 1
      this.currentCategory = "all"
      this.currentSearchQuery = ""

      // Get popular categories
      const popularCategories = ["Chicken", "Beef", "Dessert", "Pasta"]
      const randomCategory = popularCategories[Math.floor(Math.random() * popularCategories.length)]

      // Get recipes from random popular category
      const recipes = await API.getRecipesByCategory(randomCategory)

      // Render recipes
      UI.renderRecipes(recipes)

      // Update category buttons
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active")
        if (btn.getAttribute("data-category") === randomCategory) {
          btn.classList.add("active")
        }
      })

      // Update current category
      this.currentCategory = randomCategory
    } catch (error) {
      console.error("Error loading trending recipes:", error)
    } finally {
      UI.hideLoading()
    }
  },

  /**
   * Load random recipe
   */
  async loadRandomRecipe() {
    UI.showLoading()
    try {
      // Get a single random recipe
      const recipes = await API.getRandomRecipes(1)

      if (recipes.length > 0) {
        // Show recipe details
        UI.showRecipeDetails(recipes[0])

        // Load similar recipes
        this.loadSimilarRecipes(recipes[0])
      }
    } catch (error) {
      console.error("Error loading random recipe:", error)
    } finally {
      UI.hideLoading()
    }
  },

  /**
   * Load featured recipe
   */
  async loadFeaturedRecipe() {
    try {
      // Get a random recipe for featured section
      const recipes = await API.getRandomRecipes(1)

      if (recipes.length > 0) {
        const featuredRecipe = recipes[0]

        // Get featured recipe container
        const featuredRecipeContainer = document.getElementById("featured-recipe")
        if (featuredRecipeContainer) {
          // Get template
          const template = document.getElementById("featured-recipe-template")
          if (template) {
            const content = template.content.cloneNode(true)

            // Set recipe image
            const img = content.querySelector("img")
            img.src = featuredRecipe.thumbnail
            img.alt = featuredRecipe.name

            // Set favorite button
            const favoriteBtn = content.querySelector(".favorite-btn")
            if (Favorites.isFavorite(featuredRecipe.id)) {
              favoriteBtn.classList.add("active")
              favoriteBtn.textContent = "♥"
            }

            favoriteBtn.addEventListener("click", (e) => {
              e.stopPropagation()
              UI.toggleFavorite(favoriteBtn, featuredRecipe)
            })

            // Set recipe title
            content.querySelector(".recipe-title").textContent = featuredRecipe.name

            // Set recipe category
            content.querySelector(".category-tag").textContent = featuredRecipe.category

            // Set recipe rating
            content.querySelector(".recipe-rating").textContent = `★ ${featuredRecipe.rating}`

            // Set recipe time
            content.querySelector(".time-text").textContent = `${featuredRecipe.cookingTime} mins`

            // Set recipe description
            const description = featuredRecipe.instructions.split(".")[0] + "."
            content.querySelector(".recipe-description").textContent = description

            // Set view recipe button
            const viewRecipeBtn = content.querySelector(".view-recipe-btn")
            viewRecipeBtn.addEventListener("click", () => {
              UI.showRecipeDetails(featuredRecipe)
              this.loadSimilarRecipes(featuredRecipe)
            })

            // Clear and append content
            featuredRecipeContainer.innerHTML = ""
            featuredRecipeContainer.appendChild(content)

            // Show featured recipe
            featuredRecipeContainer.classList.remove("hidden")
          }
        }
      }
    } catch (error) {
      console.error("Error loading featured recipe:", error)
    }
  },

  /**
   * Load similar recipes based on a recipe
   * @param {Object} recipe - Recipe object
   */
  async loadSimilarRecipes(recipe) {
    try {
      // Get recipes from the same category
      const recipes = await API.getRecipesByCategory(recipe.category)

      // Filter out the current recipe and limit to 4
      const similarRecipes = recipes.filter((r) => r.id !== recipe.id).slice(0, 4)

      if (similarRecipes.length > 0) {
        // Get similar recipes container
        const similarRecipesSection = document.getElementById("similar-recipes-section")
        const similarRecipesContainer = document.getElementById("similar-recipes-container")

        if (similarRecipesSection && similarRecipesContainer) {
          // Render similar recipes
          similarRecipesContainer.innerHTML = ""

          similarRecipes.forEach((recipe) => {
            const recipeCard = UI.createRecipeCard(recipe)
            similarRecipesContainer.appendChild(recipeCard)
          })

          // Show similar recipes section
          similarRecipesSection.classList.remove("hidden")
        }
      }
    } catch (error) {
      console.error("Error loading similar recipes:", error)
    }
  },

  /**
   * Load and render categories
   */
  async loadCategories() {
    try {
      const categories = await API.getCategories()
      UI.renderCategoryFilters(categories, this.handleCategorySelect.bind(this))

      // Also populate footer categories
      this.populateFooterCategories(categories)
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  },

  /**
   * Populate footer categories
   * @param {Array} categories - Array of category objects
   */
  populateFooterCategories(categories) {
    const footerCategories = document.getElementById("footer-categories")
    if (footerCategories && categories.length > 0) {
      // Get 6 random categories
      const randomCategories = categories.sort(() => 0.5 - Math.random()).slice(0, 6)

      // Clear and populate
      footerCategories.innerHTML = ""

      randomCategories.forEach((category) => {
        const li = document.createElement("li")
        const a = document.createElement("a")
        a.href = "#"
        a.className = "text-light-textLight dark:text-dark-textLight hover:text-primary transition duration-300"
        a.setAttribute("data-category", category.name)
        a.textContent = category.name

        a.addEventListener("click", (e) => {
          e.preventDefault()
          this.handleCategorySelect(category.name)

          // Show home view
          UI.showView("home")

          // Update active nav link
          document.querySelectorAll(".nav-link").forEach((link) => {
            if (link.getAttribute("data-view") === "home") {
              link.classList.add("active")
            } else {
              link.classList.remove("active")
            }
          })

          // Scroll to top
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        })

        li.appendChild(a)
        footerCategories.appendChild(li)
      })
    }
  },

  /**
   * Handle category selection
   * @param {string} category - Selected category name
   */
  async handleCategorySelect(category) {
    UI.showLoading()
    try {
      // Reset pagination
      this.currentPage = 1
      this.currentCategory = category
      this.currentSearchQuery = ""

      let recipes

      if (category === "all") {
        recipes = await API.getRandomRecipes(this.recipesPerPage)
      } else {
        recipes = await API.getRecipesByCategory(category)
        // Limit to recipesPerPage
        recipes = recipes.slice(0, this.recipesPerPage)
      }

      UI.renderRecipes(recipes)

      // Update category buttons
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active")
        if (btn.getAttribute("data-category") === category) {
          btn.classList.add("active")
        }
      })
    } catch (error) {
      console.error("Error loading recipes by category:", error)
    } finally {
      UI.hideLoading()
    }
  },

  /**
   * Handle search
   * @param {string} query - Search query
   */
  async handleSearch(query) {
    if (!query.trim()) return

    UI.showLoading()
    try {
      // Reset pagination
      this.currentPage = 1
      this.currentCategory = "all"
      this.currentSearchQuery = query

      const recipes = await API.searchRecipes(query)

      // Limit to recipesPerPage
      const limitedRecipes = recipes.slice(0, this.recipesPerPage)

      UI.renderRecipes(limitedRecipes)

      // Show home view
      UI.showView("home")

      // Update active nav link
      document.querySelectorAll(".nav-link").forEach((link) => {
        if (link.getAttribute("data-view") === "home") {
          link.classList.add("active")
        } else {
          link.classList.remove("active")
        }
      })

      // Reset category buttons
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active")
        if (btn.getAttribute("data-category") === "all") {
          btn.classList.add("active")
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

