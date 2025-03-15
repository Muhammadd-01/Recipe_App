/**
 * UI functions for rendering and managing the recipe app interface
 */
import Favorites from "./favorites.js"

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
    searchButton: document.getElementById("search-button"),
    categoryButtons: document.getElementById("category-buttons"),
    backButton: document.getElementById("back-button"),
    noFavorites: document.getElementById("no-favorites"),
    navLinks: document.querySelectorAll(".main-nav a[data-view]"),
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
      })
    })

    // Back button
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
    })
  },

  /**
   * Show a specific view and hide others
   * @param {string} viewName - Name of the view to show
   */
  showView(viewName) {
    Object.keys(this.elements.views).forEach((key) => {
      this.elements.views[key].classList.remove("active")
    })

    this.elements.views[viewName].classList.add("active")
  },

  /**
   * Show loading spinner
   */
  showLoading() {
    this.elements.loadingSpinner.style.display = "flex"
    this.elements.recipesContainer.style.display = "none"
  },

  /**
   * Hide loading spinner
   */
  hideLoading() {
    this.elements.loadingSpinner.style.display = "none"
    this.elements.recipesContainer.style.display = "grid"
  },

  /**
   * Render recipes to the recipes container
   * @param {Array} recipes - Array of recipe objects
   */
  renderRecipes(recipes) {
    this.elements.recipesContainer.innerHTML = ""

    if (recipes.length === 0) {
      this.elements.recipesContainer.innerHTML = `
                <div class="no-content">
                    <p>No recipes found. Try a different search or category.</p>
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
   * Render favorite recipes
   * @param {Array} favorites - Array of favorite recipe objects
   */
  renderFavorites(favorites) {
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
    template.querySelector(".recipe-category").textContent = recipe.category

    // Set recipe rating
    template.querySelector(".recipe-rating").textContent = `★ ${recipe.rating}`

    // Set recipe time
    template.querySelector(".time-text").textContent = `${recipe.cookingTime} mins`

    // Set view recipe button
    const viewRecipeBtn = template.querySelector(".view-recipe-btn")
    viewRecipeBtn.addEventListener("click", () => {
      this.showRecipeDetails(recipe)
    })

    // Make the whole card clickable
    const card = template.querySelector(".recipe-card")
    card.addEventListener("click", () => {
      this.showRecipeDetails(recipe)
    })

    return template
  },

  /**
   * Show recipe details
   * @param {Object} recipe - Recipe object
   */
  showRecipeDetails(recipe) {
    this.elements.recipeDetailsContainer.innerHTML = `
            <div class="recipe-details-image">
                <img src="${recipe.thumbnail}" alt="${recipe.name}">
                <button class="favorite-btn ${Favorites.isFavorite(recipe.id) ? "active" : ""}">${Favorites.isFavorite(recipe.id) ? "♥" : "♡"}</button>
            </div>
            <div class="recipe-details-content">
                <div class="recipe-details-header">
                    <h2 class="recipe-details-title">${recipe.name}</h2>
                    <div class="recipe-details-meta">
                        <div class="recipe-details-category">
                            <span>📋</span> ${recipe.category}
                        </div>
                        <div class="recipe-details-cuisine">
                            <span>🌍</span> ${recipe.area}
                        </div>
                        <div class="recipe-details-rating">
                            <span>★</span> ${recipe.rating}
                        </div>
                        <div class="recipe-details-time">
                            <span>⏱</span> ${recipe.cookingTime} mins
                        </div>
                    </div>
                </div>
                
                <div class="recipe-ingredients">
                    <h3>Ingredients</h3>
                    <div class="ingredients-list">
                        ${recipe.ingredients
                          .map(
                            (ingredient) => `
                            <div class="ingredient-item">
                                <span>🍴</span> ${ingredient.measure} ${ingredient.name}
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
                
                <div class="recipe-instructions">
                    <h3>Instructions</h3>
                    ${this.formatInstructions(recipe.instructions)}
                </div>
                
                ${
                  recipe.youtube
                    ? `
                <div class="recipe-video">
                    <h3>Video Tutorial</h3>
                    <p><a href="${recipe.youtube}" target="_blank">Watch on YouTube</a></p>
                </div>
                `
                    : ""
                }
                
                ${
                  recipe.source
                    ? `
                <div class="recipe-source">
                    <p>Source: <a href="${recipe.source}" target="_blank">Original Recipe</a></p>
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

    this.showView("recipe-details")
  },

  /**
   * Format recipe instructions into steps
   * @param {string} instructions - Recipe instructions text
   * @returns {string} - Formatted HTML
   */
  formatInstructions(instructions) {
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
            <div class="instruction-step">
                <div class="step-number">${index + 1}</div>
                <div class="step-text">${step}</div>
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
    if (this.elements.views.favorites.classList.contains("active")) {
      this.renderFavorites(Favorites.getFavorites())
    }
  },

  /**
   * Render category filter buttons
   * @param {Array} categories - Array of category objects
   * @param {Function} onCategorySelect - Callback function when a category is selected
   */
  renderCategoryFilters(categories, onCategorySelect) {
    const categoryButtons = this.elements.categoryButtons

    // Keep the "All" button
    const allButton = categoryButtons.querySelector(".filter-btn")
    categoryButtons.innerHTML = ""
    categoryButtons.appendChild(allButton)

    // Add category buttons
    categories.forEach((category) => {
      const button = document.createElement("button")
      button.classList.add("filter-btn")
      button.setAttribute("data-category", category.name)
      button.textContent = category.name

      button.addEventListener("click", () => {
        // Update active button
        categoryButtons.querySelectorAll(".filter-btn").forEach((btn) => {
          btn.classList.remove("active")
        })
        button.classList.add("active")

        // Call the callback
        onCategorySelect(category.name)
      })

      categoryButtons.appendChild(button)
    })

    // Add click event for "All" button
    allButton.addEventListener("click", () => {
      categoryButtons.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("active")
      })
      allButton.classList.add("active")

      onCategorySelect("all")
    })
  },
}

export default UI

