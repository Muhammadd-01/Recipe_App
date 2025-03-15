import Favorites from "./favorites.js"

/**
 * UI functions for rendering and managing the recipe app interface
 */
const UI = {
  elements: {
    views: {
      home: document.getElementById("home-view"),
      favorites: document.getElementById("favorites-view"),
      recipeDetails: document.getElementById("recipe-details-view"),
    },
    recipesContainer: document.getElementById("recipes-container"),
    favoritesContainer: document.getElementById("favorites-container"),
    recipeDetailsContainer: document.getElementById("recipe-details-container"),
    loadingSpinner: document.getElementById("loading-spinner"),
    searchInput: document.getElementById("search-input"),
    mobileSearchInput: document.getElementById("mobile-search-input"),
    categoryButtons: document.getElementById("category-buttons"),
    backButton: document.getElementById("back-button"),
    noFavorites: document.getElementById("no-favorites"),
    navLinks: document.querySelectorAll(".nav-link[data-view]"),
    mobileNavLinks: document.querySelectorAll(".mobile-nav-link[data-view]"),
  },

  templates: {
    recipeCard: document.getElementById("recipe-card-template"),
  },

  /**
   * Initialize UI event listeners
   */
  init() {
    // Navigation
    this.elements.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const viewName = link.getAttribute("data-view")
        this.showView(viewName)

        // Update active nav link
        this.elements.navLinks.forEach((l) => l.classList.remove("active"))
        link.classList.add("active")

        // Close mobile menu if open
        const mobileMenu = document.getElementById("mobile-menu")
        if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
          mobileMenu.classList.add("hidden")
          const mobileMenuButton = document.getElementById("mobile-menu-button")
          if (mobileMenuButton) {
            mobileMenuButton.innerHTML = '<i class="fas fa-bars text-2xl"></i>'
          }
        }
      })
    })

    // Mobile Navigation
    this.elements.mobileNavLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const viewName = link.getAttribute("data-view")
        this.showView(viewName)

        // Update active nav link
        this.elements.mobileNavLinks.forEach((l) => l.classList.remove("active"))
        link.classList.add("active")

        // Also update desktop nav
        this.elements.navLinks.forEach((l) => {
          if (l.getAttribute("data-view") === viewName) {
            l.classList.add("active")
          } else {
            l.classList.remove("active")
          }
        })

        // Close mobile menu
        const mobileMenu = document.getElementById("mobile-menu")
        if (mobileMenu) {
          mobileMenu.classList.add("hidden")
          const mobileMenuButton = document.getElementById("mobile-menu-button")
          if (mobileMenuButton) {
            mobileMenuButton.innerHTML = '<i class="fas fa-bars text-2xl"></i>'
          }
        }
      })
    })

    // Back button
    if (this.elements.backButton) {
      this.elements.backButton.addEventListener("click", () => {
        this.showView("home")

        // Update active nav link
        this.elements.navLinks.forEach((link) => {
          if (link.getAttribute("data-view") === "home") {
            link.classList.add("active")
          } else {
            link.classList.remove("active")
          }
        })

        // Also update mobile nav
        this.elements.mobileNavLinks.forEach((link) => {
          if (link.getAttribute("data-view") === "home") {
            link.classList.add("active")
          } else {
            link.classList.remove("active")
          }
        })
      })
    }
  },

  /**
   * Show a specific view and hide others
   * @param {string} viewName - Name of the view to show
   */
  showView(viewName) {
    Object.keys(this.elements.views).forEach((key) => {
      if (this.elements.views[key]) {
        this.elements.views[key].classList.remove("active")
      }
    })

    if (this.elements.views[viewName]) {
      this.elements.views[viewName].classList.add("active")
    }
  },

  /**
   * Show loading spinner
   */
  showLoading() {
    if (this.elements.loadingSpinner) {
      this.elements.loadingSpinner.style.display = "flex"
    }
    if (this.elements.recipesContainer) {
      this.elements.recipesContainer.style.display = "none"
    }
  },

  /**
   * Hide loading spinner
   */
  hideLoading() {
    if (this.elements.loadingSpinner) {
      this.elements.loadingSpinner.style.display = "none"
    }
    if (this.elements.recipesContainer) {
      this.elements.recipesContainer.style.display = "grid"
    }
  },

  /**
   * Render recipes to the recipes container
   * @param {Array} recipes - Array of recipe objects
   */
  renderRecipes(recipes) {
    if (!this.elements.recipesContainer) return

    this.elements.recipesContainer.innerHTML = ""

    if (recipes.length === 0) {
      this.elements.recipesContainer.innerHTML = `
                <div class="col-span-full text-center py-16 text-light-textLight dark:text-dark-textLight">
                    <i class="fas fa-search text-5xl mb-4"></i>
                    <p class="text-lg">No recipes found.</p>
                    <p class="mb-6">Try a different search or category.</p>
                </div>
            `
      return
    }

    recipes.forEach((recipe) => {
      const recipeCard = this.createRecipeCard(recipe)
      this.elements.recipesContainer.appendChild(recipeCard)
    })
  },

  /**
   * Append recipes to the existing recipes in the container
   * @param {Array} recipes - Array of recipe objects
   */
  appendRecipes(recipes) {
    if (!this.elements.recipesContainer) return

    if (recipes.length === 0) return

    recipes.forEach((recipe) => {
      const recipeCard = this.createRecipeCard(recipe)
      this.elements.recipesContainer.appendChild(recipeCard)
    })
  },

  /**
   * Render favorite recipes
   * @param {Array} favorites - Array of favorite recipe objects
   */
  renderFavorites(favorites) {
    if (!this.elements.favoritesContainer || !this.elements.noFavorites) return

    this.elements.favoritesContainer.innerHTML = ""

    if (favorites.length === 0) {
      this.elements.noFavorites.style.display = "block"
      return
    }

    this.elements.noFavorites.style.display = "none"

    favorites.forEach((recipe) => {
      const recipeCard = this.createRecipeCard(recipe)
      this.elements.favoritesContainer.appendChild(recipeCard)
    })
  },

  /**
   * Create a recipe card element
   * @param {Object} recipe - Recipe object
   * @returns {HTMLElement} - Recipe card element
   */
  createRecipeCard(recipe) {
    if (!this.templates.recipeCard) return document.createElement("div")

    const template = this.templates.recipeCard.content.cloneNode(true)

    // Set recipe image
    const img = template.querySelector(".recipe-image img")
    img.src = recipe.thumbnail
    img.alt = recipe.name

    // Set favorite button
    const favoriteBtn = template.querySelector(".favorite-btn")
    if (Favorites.isFavorite(recipe.id)) {
      favoriteBtn.classList.add("active")
      favoriteBtn.textContent = "♥"
    }

    favoriteBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      this.toggleFavorite(favoriteBtn, recipe)
    })

    // Set recipe title
    template.querySelector(".recipe-title").textContent = recipe.name

    // Set recipe category
    template.querySelector(".category-tag").textContent = recipe.category

    // Set recipe rating
    template.querySelector(".recipe-rating").textContent = `★ ${recipe.rating}`

    // Set recipe time
    template.querySelector(".time-text").textContent = `${recipe.cookingTime} mins`

    // Set view recipe button
    const viewRecipeBtn = template.querySelector(".view-recipe-btn")
    viewRecipeBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      this.showRecipeDetails(recipe)

      // Load similar recipes if App is available
      if (window.App && typeof window.App.loadSimilarRecipes === "function") {
        window.App.loadSimilarRecipes(recipe)
      }
    })

    // Make the whole card clickable
    const card = template.querySelector(".recipe-card")
    card.addEventListener("click", () => {
      this.showRecipeDetails(recipe)

      // Load similar recipes if App is available
      if (window.App && typeof window.App.loadSimilarRecipes === "function") {
        window.App.loadSimilarRecipes(recipe)
      }
    })

    return template
  },

  /**
   * Show recipe details
   * @param {Object} recipe - Recipe object
   */
  showRecipeDetails(recipe) {
    if (!this.elements.recipeDetailsContainer) return

    this.elements.recipeDetailsContainer.innerHTML = `
            <div class="relative">
                <div class="h-64 md:h-96 overflow-hidden">
                    <img src="${recipe.thumbnail}" alt="${recipe.name}" class="w-full h-full object-cover">
                </div>
                <button class="favorite-btn absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center text-2xl ${Favorites.isFavorite(recipe.id) ? "active" : ""}">${Favorites.isFavorite(recipe.id) ? "♥" : "♡"}</button>
                <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-6">
                    <div class="text-white">
                        <span class="bg-primary text-white text-sm font-medium py-1 px-2 rounded-sm">${recipe.category}</span>
                        <h2 class="font-heading text-2xl md:text-3xl font-bold mt-2">${recipe.name}</h2>
                    </div>
                </div>
            </div>
            <div class="p-6 md:p-8">
                <div class="flex flex-wrap gap-4 mb-6 text-light-textLight dark:text-dark-textLight">
                    <div class="flex items-center">
                        <i class="fas fa-globe-americas mr-2 text-primary"></i>
                        <span>${recipe.area || "International"}</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-star mr-2 text-highlight"></i>
                        <span>${recipe.rating} Rating</span>
                    </div>
                    <div class="flex items-center">
                        <i class="far fa-clock mr-2 text-primary"></i>
                        <span>${recipe.cookingTime} mins</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-utensils mr-2 text-primary"></i>
                        <span>${recipe.ingredients.length} Ingredients</span>
                    </div>
                </div>
                
                <div class="flex gap-4 mb-8">
                    <button class="print-recipe-btn flex items-center text-light-textLight dark:text-dark-textLight hover:text-primary transition duration-300">
                        <i class="fas fa-print mr-2"></i> Print Recipe
                    </button>
                    <button class="share-recipe-btn flex items-center text-light-textLight dark:text-dark-textLight hover:text-primary transition duration-300">
                        <i class="fas fa-share-alt mr-2"></i> Share Recipe
                    </button>
                </div>
                
                <div class="mb-8">
                    <h3 class="font-heading text-xl font-bold mb-4 dark:text-dark-text">Ingredients</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        ${recipe.ingredients
                          .map(
                            (ingredient) => `
                            <div class="flex items-center p-3 bg-light-bg dark:bg-dark-bg rounded-md">
                                <i class="fas fa-check-circle text-secondary mr-3"></i>
                                <span class="dark:text-dark-text">${ingredient.measure} ${ingredient.name}</span>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
                
                <div class="mb-8">
                    <h3 class="font-heading text-xl font-bold mb-4 dark:text-dark-text">Instructions</h3>
                    ${this.formatInstructions(recipe.instructions)}
                </div>
                
                ${
                  recipe.youtube
                    ? `
                <div class="mb-8">
                    <h3 class="font-heading text-xl font-bold mb-4 dark:text-dark-text">Video Tutorial</h3>
                    <a href="${recipe.youtube}" target="_blank" class="inline-flex items-center bg-red-600 text-white font-medium py-2 px-4 rounded-md hover:bg-red-700 transition duration-300">
                        <i class="fab fa-youtube mr-2"></i> Watch on YouTube
                    </a>
                </div>
                `
                    : ""
                }
                
                ${
                  recipe.source
                    ? `
                <div class="pt-6 border-t border-light-border dark:border-dark-border">
                    <p class="text-light-textLight dark:text-dark-textLight">
                        Source: <a href="${recipe.source}" target="_blank" class="text-primary hover:underline">Original Recipe</a>
                    </p>
                </div>
                `
                    : ""
                }
            </div>
        `

    // Add favorite toggle event listener
    const favoriteBtn = this.elements.recipeDetailsContainer.querySelector(".favorite-btn")
    favoriteBtn.addEventListener("click", () => {
      this.toggleFavorite(favoriteBtn, recipe)
    })

    // Add print recipe event listener
    const printBtn = this.elements.recipeDetailsContainer.querySelector(".print-recipe-btn")
    printBtn.addEventListener("click", () => {
      this.printRecipe(recipe)
    })

    // Add share recipe event listener
    const shareBtn = this.elements.recipeDetailsContainer.querySelector(".share-recipe-btn")
    shareBtn.addEventListener("click", () => {
      this.shareRecipe(recipe)
    })

    this.showView("recipe-details")
  },

  /**
   * Format recipe instructions into steps
   * @param {string} instructions - Recipe instructions text
   * @returns {string} - Formatted HTML
   */
  formatInstructions(instructions) {
    if (!instructions) return '<p class="text-light-textLight dark:text-dark-textLight">No instructions available.</p>'

    // Split instructions by periods or by numbered steps
    const steps = instructions
      .split(/\.\s+/)
      .filter((step) => step.trim().length > 0)
      .map((step) => step.trim())

    // Remove the last empty step if the instructions end with a period
    if (steps[steps.length - 1] === "") {
      steps.pop()
    }

    // If the last step doesn't end with a period, add one
    if (steps.length > 0 && !steps[steps.length - 1].endsWith(".")) {
      steps[steps.length - 1] += "."
    }

    return steps
      .map(
        (step, index) => `
            <div class="flex mb-4">
                <div class="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold mr-4">
                    ${index + 1}
                </div>
                <div class="flex-1 text-light-textLight dark:text-dark-textLight">
                    ${step}
                </div>
            </div>
        `,
      )
      .join("")
  },

  /**
   * Toggle favorite status for a recipe
   * @param {HTMLElement} button - Favorite button element
   * @param {Object} recipe - Recipe object
   */
  toggleFavorite(button, recipe) {
    if (Favorites.isFavorite(recipe.id)) {
      Favorites.removeFavorite(recipe.id)
      button.classList.remove("active")
      button.textContent = "♡"
    } else {
      Favorites.addFavorite(recipe)
      button.classList.add("active")
      button.textContent = "♥"
    }

    // Update favorites view if it's currently visible
    if (this.elements.views.favorites && this.elements.views.favorites.classList.contains("active")) {
      this.renderFavorites(Favorites.getFavorites())
    }
  },

  /**
   * Print recipe
   * @param {Object} recipe - Recipe object
   */
  printRecipe(recipe) {
    const printWindow = window.open("", "_blank")

    printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print Recipe - ${recipe.name}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    h1 {
                        font-size: 24px;
                        margin-bottom: 10px;
                    }
                    .meta {
                        display: flex;
                        gap: 20px;
                        margin-bottom: 20px;
                        color: #666;
                    }
                    .ingredients {
                        margin-bottom: 30px;
                    }
                    .ingredients h2, .instructions h2 {
                        font-size: 18px;
                        margin-bottom: 10px;
                        border-bottom: 1px solid #eee;
                        padding-bottom: 5px;
                    }
                    .ingredients ul {
                        padding-left: 20px;
                    }
                    .ingredients li {
                        margin-bottom: 5px;
                    }
                    .step {
                        margin-bottom: 15px;
                    }
                    .step-number {
                        font-weight: bold;
                        margin-right: 10px;
                    }
                    .footer {
                        margin-top: 30px;
                        font-size: 12px;
                        color: #666;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <h1>${recipe.name}</h1>
                <div class="meta">
                    <div>Category: ${recipe.category}</div>
                    <div>Cooking Time: ${recipe.cookingTime} mins</div>
                    <div>Rating: ${recipe.rating}/5</div>
                </div>
                
                <div class="ingredients">
                    <h2>Ingredients</h2>
                    <ul>
                        ${recipe.ingredients
                          .map(
                            (ingredient) => `
                            <li>${ingredient.measure} ${ingredient.name}</li>
                        `,
                          )
                          .join("")}
                    </ul>
                </div>
                
                <div class="instructions">
                    <h2>Instructions</h2>
                    ${this.formatPrintInstructions(recipe.instructions)}
                </div>
                
                <div class="footer">
                    <p>Recipe from Flavor Vault - Printed on ${new Date().toLocaleDateString()}</p>
                </div>
                
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `)

    printWindow.document.close()
  },

  /**
   * Format instructions for printing
   * @param {string} instructions - Recipe instructions
   * @returns {string} - Formatted HTML for printing
   */
  formatPrintInstructions(instructions) {
    if (!instructions) return "<p>No instructions available.</p>"

    // Split instructions by periods or by numbered steps
    const steps = instructions
      .split(/\.\s+/)
      .filter((step) => step.trim().length > 0)
      .map((step) => step.trim())

    // Remove the last empty step if the instructions end with a period
    if (steps[steps.length - 1] === "") {
      steps.pop()
    }

    // If the last step doesn't end with a period, add one
    if (steps.length > 0 && !steps[steps.length - 1].endsWith(".")) {
      steps[steps.length - 1] += "."
    }

    return steps
      .map(
        (step, index) => `
            <div class="step">
                <span class="step-number">${index + 1}.</span>
                <span>${step}</span>
            </div>
        `,
      )
      .join("")
  },

  /**
   * Share recipe
   * @param {Object} recipe - Recipe object
   */
  shareRecipe(recipe) {
    // Check if Web Share API is available
    if (navigator.share) {
      navigator
        .share({
          title: recipe.name,
          text: `Check out this delicious ${recipe.name} recipe I found on Flavor Vault!`,
          url: window.location.href,
        })
        .catch((error) => {
          console.error("Error sharing recipe:", error)
          this.showShareFallback(recipe)
        })
    } else {
      this.showShareFallback(recipe)
    }
  },

  /**
   * Show fallback share options
   * @param {Object} recipe - Recipe object
   */
  showShareFallback(recipe) {
    // Create a temporary input to copy the URL
    const input = document.createElement("input")
    input.value = window.location.href
    document.body.appendChild(input)
    input.select()
    document.execCommand("copy")
    document.body.removeChild(input)

    // Show a simple alert
    alert("Link copied to clipboard! Share this recipe with your friends.")
  },

  /**
   * Render category filter buttons
   * @param {Array} categories - Array of category objects
   * @param {Function} onCategorySelect - Callback function when a category is selected
   */
  renderCategoryFilters(categories, onCategorySelect) {
    const categoryButtons = this.elements.categoryButtons
    if (!categoryButtons) return

    // Keep the "All" button
    const allButton = categoryButtons.querySelector(".filter-btn")
    categoryButtons.innerHTML = ""
    categoryButtons.appendChild(allButton)

    // Add category buttons
    categories.forEach((category) => {
      const button = document.createElement("button")
      button.classList.add(
        "filter-btn",
        "bg-light-bg",
        "dark:bg-dark-bg",
        "border",
        "border-light-border",
        "dark:border-dark-border",
        "px-4",
        "py-2",
        "rounded-md",
        "font-medium",
        "hover:bg-primary",
        "hover:text-white",
        "transition",
        "duration-300",
      )
      button.setAttribute("data-category", category.name)
      button.textContent = category.name

      button.addEventListener("click", () => {
        // Update active button
        categoryButtons.querySelectorAll(".filter-btn").forEach((btn) => {
          btn.classList.remove("active", "bg-primary", "text-white")
          btn.classList.add("bg-light-bg", "dark:bg-dark-bg", "text-light-text", "dark:text-dark-text")
        })
        button.classList.add("active", "bg-primary", "text-white")
        button.classList.remove("bg-light-bg", "dark:bg-dark-bg", "text-light-text", "dark:text-dark-text")

        // Call the callback
        onCategorySelect(category.name)
      })

      categoryButtons.appendChild(button)
    })

    // Add click event for "All" button
    allButton.addEventListener("click", () => {
      categoryButtons.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active", "bg-primary", "text-white")
        btn.classList.add("bg-light-bg", "dark:bg-dark-bg", "text-light-text", "dark:text-dark-text")
      })
      allButton.classList.add("active", "bg-primary", "text-white")
      allButton.classList.remove("bg-light-bg", "dark:bg-dark-bg", "text-light-text", "dark:text-dark-text")

      onCategorySelect("all")
    })
  },
}

export default UI

