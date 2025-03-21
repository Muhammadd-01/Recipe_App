/**
 * UI Controller
 */
const UI = {
  /**
   * Initialize UI
   */
  init() {
    console.log("Initializing UI")

    // Set up back to top button
    this.setupBackToTopButton()

    // Initialize tooltips
    this.initTooltips()

    // Make UI available globally
    window.UI = this
    // Set up view navigation
    this.setupViewNavigation()

    // Set up back button
    this.setupBackButton()

    // Set up modal triggers
    this.setupModalTriggers()

    console.log("UI initialized")
  },

  /**
   * Set up view navigation
   */
  setupViewNavigation() {
    // Get all nav links with data-view attribute
    const navLinks = document.querySelectorAll(".nav-link[data-view], .mobile-nav-link[data-view]")

    // Add click event listener to each nav link
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()

        // Get view name from data-view attribute
        const viewName = link.getAttribute("data-view")

        // Show view
        this.showView(viewName)

        // Update active nav link
        this.updateActiveNavLink(viewName)

        // Close mobile menu if open
        const mobileMenu = document.getElementById("mobile-menu")
        if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
          mobileMenu.classList.add("hidden")

          // Update mobile menu button icon
          const mobileMenuButton = document.getElementById("mobile-menu-button")
          if (mobileMenuButton) {
            mobileMenuButton.innerHTML = '<i class="fas fa-bars text-2xl"></i>'
          }
        }
      })
    })
  },

  /**
   * Set up back button
   */
  setupBackButton() {
    const backButton = document.getElementById("back-button")
    if (backButton) {
      backButton.addEventListener("click", () => {
        // Show home view
        this.showView("home")

        // Update active nav link
        this.updateActiveNavLink("home")
      })
    }
  },

  /**
   * Set up modal triggers
   */
  setupModalTriggers() {
    console.log("Setting up modal triggers")

    // Account modal
    this.setupModalTrigger("user-account-btn", "login-modal")
    this.setupModalTrigger("mobile-user-account-btn", "login-modal")
    this.setupModalTrigger("show-account-modal-btn", "login-modal")

    // Shopping list modal
    this.setupModalTrigger("show-shopping-list-modal-btn", "shopping-list-modal")

    // Recipe submission modal
    this.setupModalTrigger("show-submit-recipe-modal-btn", "submit-recipe-modal")

    // Recipe rating modal
    this.setupModalTrigger("show-rate-recipe-modal-btn", "rate-recipe-modal", () => {
      // Set a default recipe name for demo purposes
      const recipeNameElement = document.getElementById("rate-recipe-name")
      if (recipeNameElement) {
        recipeNameElement.textContent = "Sample Recipe"
      }
    })

    // Recipe sharing modal
    this.setupModalTrigger("show-share-recipe-modal-btn", "share-recipe-modal", () => {
      // Set a default recipe name for demo purposes
      const recipeNameElement = document.getElementById("share-recipe-name")
      if (recipeNameElement) {
        recipeNameElement.textContent = "Sample Recipe"
      }

      // Set a default share link
      const shareLinkInput = document.getElementById("share-link")
      if (shareLinkInput) {
        shareLinkInput.value = window.location.href
      }
    })

    // Meal planner modal
    this.setupModalTrigger("add-to-meal-plan-btn", "add-meal-plan-modal")

    // Toggle dark mode button
    const toggleDarkModeBtn = document.getElementById("toggle-dark-mode-btn")
    if (toggleDarkModeBtn) {
      toggleDarkModeBtn.addEventListener("click", () => {
        console.log("Toggle dark mode button clicked")
        if (window.DarkMode) {
          window.DarkMode.toggleTheme()
        }
      })
    }

    // Close buttons for all modals
    const closeButtons = document.querySelectorAll("[id^='close-'][id$='-modal-btn']")
    closeButtons.forEach((button) => {
      const modalId = button.id.replace("close-", "").replace("-btn", "")
      const modal = document.getElementById(modalId)

      if (button && modal) {
        button.addEventListener("click", () => {
          console.log(`Closing ${modalId}`)
          modal.classList.add("hidden")
        })
      }
    })

    // Switch between login and signup
    this.setupModalSwitch("show-signup-btn", "login-modal", "signup-modal")
    this.setupModalSwitch("show-login-btn", "signup-modal", "login-modal")
  },

  /**
   * Set up modal trigger
   * @param {string} triggerId - ID of the trigger element
   * @param {string} modalId - ID of the modal element
   * @param {Function} callback - Optional callback function to run when modal is opened
   */
  setupModalTrigger(triggerId, modalId, callback) {
    const trigger = document.getElementById(triggerId)
    const modal = document.getElementById(modalId)

    if (trigger && modal) {
      console.log(`Setting up modal trigger: ${triggerId} -> ${modalId}`)

      trigger.addEventListener("click", (e) => {
        e.preventDefault()
        console.log(`Opening modal: ${modalId}`)
        modal.classList.remove("hidden")

        if (callback && typeof callback === "function") {
          callback()
        }
      })
    } else {
      console.warn(`Modal trigger setup failed: ${triggerId} -> ${modalId}`)
      if (!trigger) console.warn(`Trigger element not found: ${triggerId}`)
      if (!modal) console.warn(`Modal element not found: ${modalId}`)
    }
  },

  /**
   * Set up modal switch
   * @param {string} triggerId - ID of the trigger element
   * @param {string} fromModalId - ID of the modal to hide
   * @param {string} toModalId - ID of the modal to show
   */
  setupModalSwitch(triggerId, fromModalId, toModalId) {
    const trigger = document.getElementById(triggerId)
    const fromModal = document.getElementById(fromModalId)
    const toModal = document.getElementById(toModalId)

    if (trigger && fromModal && toModal) {
      trigger.addEventListener("click", (e) => {
        e.preventDefault()
        fromModal.classList.add("hidden")
        toModal.classList.remove("hidden")
      })
    }
  },

  /**
   * Set up back to top button
   */
  setupBackToTopButton() {
    const backToTopButton = document.getElementById("back-to-top")

    if (backToTopButton) {
      // Show/hide back to top button based on scroll position
      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
          backToTopButton.classList.remove("opacity-0", "invisible")
          backToTopButton.classList.add("opacity-100", "visible")
        } else {
          backToTopButton.classList.remove("opacity-100", "visible")
          backToTopButton.classList.add("opacity-0", "invisible")
        }
      })

      // Scroll to top when button is clicked
      backToTopButton.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      })
    }
  },

  /**
   * Initialize tooltips
   */
  initTooltips() {
    // Add tooltip functionality if needed
  },

  /**
   * Show view by name
   * @param {string} viewName - Name of the view to show
   */
  showView(viewName) {
    // Get all views
    const views = document.querySelectorAll(".app-view")

    // Hide all views
    views.forEach((view) => {
      view.classList.remove("active")
    })

    // Show selected view
    const selectedView = document.getElementById(`${viewName}-view`)
    if (selectedView) {
      selectedView.classList.add("active")
    }
  },

  /**
   * Update active nav link
   * @param {string} viewName - Name of the active view
   */
  updateActiveNavLink(viewName) {
    // Get all nav links
    const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link")

    // Remove active class from all nav links
    navLinks.forEach((link) => {
      link.classList.remove("active")
    })

    // Add active class to selected nav link
    const selectedNavLinks = document.querySelectorAll(
      `.nav-link[data-view="${viewName}"], .mobile-nav-link[data-view="${viewName}"]`,
    )
    selectedNavLinks.forEach((link) => {
      link.classList.add("active")
    })
  },

  /**
   * Show loading spinner
   */
  showLoading() {
    const loadingSpinner = document.getElementById("loading-spinner")
    const recipesContainer = document.getElementById("recipes-container")

    if (loadingSpinner) {
      loadingSpinner.classList.remove("hidden")
    }

    if (recipesContainer) {
      recipesContainer.classList.add("hidden")
    }
  },

  /**
   * Hide loading spinner
   */
  hideLoading() {
    const loadingSpinner = document.getElementById("loading-spinner")
    const recipesContainer = document.getElementById("recipes-container")

    if (loadingSpinner) {
      loadingSpinner.classList.add("hidden")
    }

    if (recipesContainer) {
      recipesContainer.classList.remove("hidden")
    }
  },

  /**
   * Render recipes
   * @param {Array} recipes - Array of recipe objects
   */
  renderRecipes(recipes) {
    const recipesContainer = document.getElementById("recipes-container")

    if (recipesContainer) {
      // Clear container
      recipesContainer.innerHTML = ""

      if (recipes.length === 0) {
        // Show no results message
        recipesContainer.innerHTML = `
          <div class="col-span-full text-center py-16 text-light-textLight dark:text-dark-textLight">
            <i class="fas fa-search text-5xl mb-4"></i>
            <p class="text-lg">No recipes found</p>
            <p class="mb-4">Try different search terms or filters</p>
          </div>
        `
        return
      }

      // Create and append recipe cards
      recipes.forEach((recipe) => {
        const recipeCard = this.createRecipeCard(recipe)
        recipesContainer.appendChild(recipeCard)
      })
    }
  },

  /**
   * Append recipes to existing recipes
   * @param {Array} recipes - Array of recipe objects
   */
  appendRecipes(recipes) {
    const recipesContainer = document.getElementById("recipes-container")

    if (recipesContainer && recipes.length > 0) {
      // Create and append recipe cards
      recipes.forEach((recipe) => {
        const recipeCard = this.createRecipeCard(recipe)
        recipesContainer.appendChild(recipeCard)
      })
    }
  },

  /**
   * Create recipe card
   * @param {Object} recipe - Recipe object
   * @returns {HTMLElement} - Recipe card element
   */
  createRecipeCard(recipe) {
    // Get recipe card template
    const template = document.getElementById("recipe-card-template")

    if (template) {
      // Clone template content
      const recipeCard = template.content.cloneNode(true)

      // Set recipe image
      const img = recipeCard.querySelector("img")
      img.src = recipe.thumbnail || "/placeholder.svg?height=300&width=300"
      img.alt = recipe.name

      // Set favorite button
      const favoriteBtn = recipeCard.querySelector(".favorite-btn")
      if (window.Favorites && window.Favorites.isFavorite(recipe.id)) {
        favoriteBtn.classList.add("active")
        favoriteBtn.textContent = "♥"
      }

      favoriteBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        this.toggleFavorite(favoriteBtn, recipe)
      })

      // Set recipe title
      recipeCard.querySelector(".recipe-title").textContent = recipe.name

      // Set recipe category
      recipeCard.querySelector(".category-tag").textContent = recipe.category

      // Set recipe rating
      recipeCard.querySelector(".recipe-rating").textContent = `★ ${recipe.rating || "0.0"}`

      // Set recipe time
      recipeCard.querySelector(".time-text").textContent = `${recipe.cookingTime || "30"} mins`

      // Set view recipe button
      const viewRecipeBtn = recipeCard.querySelector(".view-recipe-btn")
      viewRecipeBtn.addEventListener("click", () => {
        this.showRecipeDetails(recipe)
      })

      return recipeCard
    }

    return document.createElement("div")
  },

  /**
   * Toggle favorite status
   * @param {HTMLElement} favoriteBtn - Favorite button element
   * @param {Object} recipe - Recipe object
   */
  toggleFavorite(favoriteBtn, recipe) {
    if (window.Favorites) {
      if (window.Favorites.isFavorite(recipe.id)) {
        // Remove from favorites
        window.Favorites.removeFavorite(recipe.id)
        favoriteBtn.classList.remove("active")
        favoriteBtn.textContent = "♡"
      } else {
        // Add to favorites
        window.Favorites.addFavorite(recipe)
        favoriteBtn.classList.add("active")
        favoriteBtn.textContent = "♥"
      }

      // Update favorites view if it's active
      const favoritesView = document.getElementById("favorites-view")
      if (favoritesView && favoritesView.classList.contains("active")) {
        this.renderFavorites(window.Favorites.getFavorites())
      }
    }
  },

  /**
   * Render favorites
   * @param {Array} favorites - Array of favorite recipe objects
   */
  renderFavorites(favorites) {
    const favoritesContainer = document.getElementById("favorites-container")
    const noFavorites = document.getElementById("no-favorites")

    if (favoritesContainer && noFavorites) {
      // Clear container
      favoritesContainer.innerHTML = ""

      if (favorites.length === 0) {
        // Show no favorites message
        favoritesContainer.classList.add("hidden")
        noFavorites.classList.remove("hidden")
      } else {
        // Hide no favorites message
        favoritesContainer.classList.remove("hidden")
        noFavorites.classList.add("hidden")

        // Create and append recipe cards
        favorites.forEach((recipe) => {
          const recipeCard = this.createRecipeCard(recipe)
          favoritesContainer.appendChild(recipeCard)
        })
      }
    }
  },

  /**
   * Show recipe details
   * @param {Object} recipe - Recipe object
   */
  showRecipeDetails(recipe) {
    const recipeDetailsContainer = document.getElementById("recipe-details-container")

    if (recipeDetailsContainer) {
      // Show recipe details view
      if (window.NavigationManager) {
        window.NavigationManager.showView("recipe-details")
      } else {
        // Fallback if NavigationManager is not available
        const views = document.querySelectorAll(".app-view")
        views.forEach((view) => view.classList.remove("active"))

        const recipeDetailsView = document.getElementById("recipe-details-view")
        if (recipeDetailsView) {
          recipeDetailsView.classList.add("active")
        }
      }

      // Create recipe details HTML
      const recipeDetailsHTML = `
        <div class="relative">
          <img src="${recipe.thumbnail || "/placeholder.svg?height=500&width=1000"}" alt="${recipe.name}" class="w-full h-64 md:h-96 object-cover">
          <button class="favorite-btn absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center text-2xl">
            ${window.Favorites && window.Favorites.isFavorite(recipe.id) ? "♥" : "♡"}
          </button>
        </div>
        <div class="p-6 md:p-8">
          <div class="mb-2">
            <span class="bg-primary text-white text-sm py-1 px-2 rounded-sm">${recipe.category}</span>
            ${recipe.area ? `<span class="bg-secondary text-white text-sm py-1 px-2 rounded-sm ml-2">${recipe.area}</span>` : ""}
          </div>
          <h2 class="font-heading text-2xl md:text-3xl font-bold mb-4 dark:text-dark-text">${recipe.name}</h2>
          
          <div class="flex flex-wrap items-center mb-6 text-light-textLight dark:text-dark-textLight">
            <div class="flex items-center mr-6 mb-2">
              <i class="fas fa-star text-highlight mr-2"></i>
              <span>${recipe.rating || "0.0"} Rating</span>
            </div>
            <div class="flex items-center mr-6 mb-2">
              <i class="far fa-clock mr-2"></i>
              <span>${recipe.cookingTime || "30"} mins</span>
            </div>
            <div class="flex items-center mb-2">
              <i class="fas fa-utensils mr-2"></i>
              <span>${recipe.area || "International"} Cuisine</span>
            </div>
          </div>
          
          <div class="mb-8">
            <h3 class="font-heading text-xl font-bold mb-4 dark:text-dark-text">Ingredients</h3>
            <ul class="space-y-2 mb-6">
              ${recipe.ingredients
                .map(
                  (ingredient) => `
                <li class="flex items-start">
                  <i class="fas fa-check-circle text-primary mt-1 mr-3"></i>
                  <span class="dark:text-dark-text">${ingredient.amount ? ingredient.amount + " " : ""}${ingredient.name}</span>
                  <button class="add-to-shopping-list-btn ml-auto text-light-textLight dark:text-dark-textLight hover:text-primary transition duration-300" data-ingredient='${JSON.stringify({ id: `${recipe.id}-${ingredient.name.replace(/\s+/g, "-")}`, name: ingredient.name, amount: ingredient.amount, category: recipe.category })}'>
                    <i class="fas fa-plus-circle"></i>
                  </button>
                </li>
              `,
                )
                .join("")}
            </ul>
          </div>
          
          <div class="mb-8">
            <h3 class="font-heading text-xl font-bold mb-4 dark:text-dark-text">Instructions</h3>
            <div class="prose prose-lg max-w-none dark:prose-invert dark:text-dark-text">
              ${recipe.instructions
                .split("\n")
                .map((paragraph) => `<p>${paragraph}</p>`)
                .join("")}
            </div>
          </div>
          
          <div class="flex flex-wrap gap-4">
            <button class="rate-recipe-btn flex items-center text-light-textLight dark:text-dark-textLight hover:text-primary transition duration-300" data-recipe-id="${recipe.id}" data-recipe-name="${recipe.name}">
              <i class="fas fa-star mr-2"></i> Rate Recipe
            </button>
            <button class="add-to-plan-btn flex items-center text-light-textLight dark:text-dark-textLight hover:text-primary transition duration-300" data-recipe-id="${recipe.id}" data-recipe-name="${recipe.name}" data-recipe-image="${recipe.thumbnail}">
              <i class="fas fa-calendar-plus mr-2"></i> Add to Meal Plan
            </button>
            <button class="share-recipe-btn flex items-center text-light-textLight dark:text-dark-textLight hover:text-primary transition duration-300" data-recipe-id="${recipe.id}" data-recipe-name="${recipe.name}" data-recipe-image="${recipe.thumbnail}">
              <i class="fas fa-share-alt mr-2"></i> Share Recipe
            </button>
            <button class="print-recipe-btn flex items-center text-light-textLight dark:text-dark-textLight hover:text-primary transition duration-300">
              <i class="fas fa-print mr-2"></i> Print Recipe
            </button>
          </div>
          
          ${
            recipe.youtube
              ? `
            <div class="mt-8">
              <h3 class="font-heading text-xl font-bold mb-4 dark:text-dark-text">Video Tutorial</h3>
              <div class="aspect-w-16 aspect-h-9">
                <iframe src="${recipe.youtube.replace("watch?v=", "embed/")}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="rounded-lg"></iframe>
              </div>
            </div>
          `
              : ""
          }
          
          ${
            recipe.source
              ? `
            <div class="mt-8 text-light-textLight dark:text-dark-textLight">
              <p>Source: <a href="${recipe.source}" target="_blank" class="text-primary hover:underline">${recipe.source}</a></p>
            </div>
          `
              : ""
          }
        </div>
      `

      // Set recipe details HTML
      recipeDetailsContainer.innerHTML = recipeDetailsHTML

      // Add event listeners to buttons

      // Favorite button
      const favoriteBtn = recipeDetailsContainer.querySelector(".favorite-btn")
      if (favoriteBtn) {
        favoriteBtn.addEventListener("click", () => {
          this.toggleFavorite(favoriteBtn, recipe)
        })
      }

      // Add to shopping list buttons
      const addToShoppingListBtns = recipeDetailsContainer.querySelectorAll(".add-to-shopping-list-btn")
      addToShoppingListBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const ingredient = JSON.parse(btn.getAttribute("data-ingredient"))
          this.addToShoppingList(ingredient)

          // Show added animation
          btn.innerHTML = '<i class="fas fa-check"></i>'
          btn.classList.add("text-primary")

          setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-plus-circle"></i>'
            btn.classList.remove("text-primary")
          }, 2000)
        })
      })

      // Rate recipe button
      const rateRecipeBtn = recipeDetailsContainer.querySelector(".rate-recipe-btn")
      if (rateRecipeBtn) {
        rateRecipeBtn.addEventListener("click", () => {
          const recipeId = rateRecipeBtn.getAttribute("data-recipe-id")
          const recipeName = rateRecipeBtn.getAttribute("data-recipe-name")

          if (window.openRatingModal) {
            window.openRatingModal(recipeId, recipeName)
          }
        })
      }

      // Add to meal plan button
      const addToPlanBtn = recipeDetailsContainer.querySelector(".add-to-plan-btn")
      if (addToPlanBtn) {
        addToPlanBtn.addEventListener("click", () => {
          const recipeId = addToPlanBtn.getAttribute("data-recipe-id")
          const recipeName = addToPlanBtn.getAttribute("data-recipe-name")
          const recipeImage = addToPlanBtn.getAttribute("data-recipe-image")

          if (window.MealPlanner) {
            window.MealPlanner.addRecipeToMealPlan(recipeId, recipeName, recipeImage)

            // Show added animation
            addToPlanBtn.innerHTML = '<i class="fas fa-check mr-2"></i> Added to Meal Plan'

            setTimeout(() => {
              addToPlanBtn.innerHTML = '<i class="fas fa-calendar-plus mr-2"></i> Add to Meal Plan'
            }, 2000)
          }
        })
      }

      // Share recipe button
      const shareRecipeBtn = recipeDetailsContainer.querySelector(".share-recipe-btn")
      if (shareRecipeBtn) {
        shareRecipeBtn.addEventListener("click", () => {
          const recipeId = shareRecipeBtn.getAttribute("data-recipe-id")
          const recipeName = shareRecipeBtn.getAttribute("data-recipe-name")
          const recipeImage = shareRecipeBtn.getAttribute("data-recipe-image")

          if (window.openSharingModal) {
            window.openSharingModal(recipeId, recipeName, recipeImage)
          }
        })
      }

      // Print recipe button
      const printRecipeBtn = recipeDetailsContainer.querySelector(".print-recipe-btn")
      if (printRecipeBtn) {
        printRecipeBtn.addEventListener("click", () => {
          this.printRecipe(recipe)
        })
      }
    }
  },

  /**
   * Add ingredient to shopping list
   * @param {Object} ingredient - Ingredient object
   */
  addToShoppingList(ingredient) {
    // Get shopping list from localStorage
    const shoppingList = JSON.parse(localStorage.getItem("shopping-list") || "[]")

    // Check if ingredient already exists in shopping list
    const existingIndex = shoppingList.findIndex((item) => item.id === ingredient.id)

    if (existingIndex === -1) {
      // Add ingredient to shopping list
      shoppingList.push(ingredient)

      // Save shopping list to localStorage
      localStorage.setItem("shopping-list", JSON.stringify(shoppingList))

      // Show success message
      this.showToast("Added to shopping list")
    } else {
      // Show already exists message
      this.showToast("Already in shopping list")
    }
  },

  /**
   * Print recipe
   * @param {Object} recipe - Recipe object
   */
  printRecipe(recipe) {
    // Create print window
    const printWindow = window.open("", "_blank")

    // Create print content
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${recipe.name} - Flavor Vault</title>
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
          h2 {
            font-size: 18px;
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
          }
          .meta {
            color: #666;
            margin-bottom: 20px;
            font-size: 14px;
          }
          .meta span {
            margin-right: 15px;
          }
          ul {
            padding-left: 20px;
          }
          li {
            margin-bottom: 5px;
          }
          .instructions p {
            margin-bottom: 15px;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #666;
            text-align: center;
            border-top: 1px solid #eee;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <h1>${recipe.name}</h1>
        <div class="meta">
          <span><strong>Category:</strong> ${recipe.category}</span>
          <span><strong>Cuisine:</strong> ${recipe.area || "International"}</span>
          <span><strong>Cooking Time:</strong> ${recipe.cookingTime || "30"} mins</span>
        </div>
        
        <h2>Ingredients</h2>
        <ul>
          ${recipe.ingredients
            .map(
              (ingredient) => `
            <li>${ingredient.amount ? ingredient.amount + " " : ""}${ingredient.name}</li>
          `,
            )
            .join("")}
        </ul>
        
        <h2>Instructions</h2>
        <div class="instructions">
          ${recipe.instructions
            .split("\n")
            .map((paragraph) => `<p>${paragraph}</p>`)
            .join("")}
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
    `

    // Write content to print window
    printWindow.document.write(printContent)
    printWindow.document.close()
  },

  /**
   * Render category filters
   * @param {Array} categories - Array of category objects
   * @param {Function} handleCategorySelect - Function to handle category selection
   */
  renderCategoryFilters(categories, handleCategorySelect) {
    const categoryButtons = document.getElementById("category-buttons")

    if (categoryButtons) {
      // Add category buttons
      categories.forEach((category) => {
        const button = document.createElement("button")
        button.className =
          "filter-btn bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border px-4 py-2 rounded-md font-medium hover:bg-primary hover:text-white transition duration-300"
        button.setAttribute("data-category", category.name)
        button.textContent = category.name

        button.addEventListener("click", () => {
          handleCategorySelect(category.name)
        })

        categoryButtons.appendChild(button)
      })
    }
  },

  /**
   * Show toast message
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, error, info)
   */
  showToast(message, type = "success") {
    // Check if toast container exists
    let toastContainer = document.getElementById("toast-container")

    // Create toast container if it doesn't exist
    if (!toastContainer) {
      toastContainer = document.createElement("div")
      toastContainer.id = "toast-container"
      toastContainer.className = "fixed bottom-4 right-4 z-50"
      document.body.appendChild(toastContainer)
    }

    // Create toast element
    const toast = document.createElement("div")
    toast.className = `flex items-center p-4 mb-3 rounded-md shadow-lg animate-fade-in ${
      type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"
    } text-white`

    // Set toast content
    toast.innerHTML = `
      <i class="fas ${
        type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"
      } mr-2"></i>
      <span>${message}</span>
    `

    // Add toast to container
    toastContainer.appendChild(toast)

    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.classList.add("animate-fade-out")
      setTimeout(() => {
        toast.remove()
      }, 300)
    }, 3000)
  },
}

export default UI

