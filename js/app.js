import API from "./api.js"
import UI from "./ui.js"
import Favorites from "./favorites.js"
import DarkMode from "./darkMode.js"
import Search from "./search.js"
import MealPlanner from "./mealPlanner.js"
import RestaurantFinder from "./restaurantFinder.js"

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
    // Make API available globally for restaurant finder
    window.API = API

    // Initialize UI and Dark Mode
    UI.init()
    DarkMode.init()

    // Initialize Search
    Search.init(API)

    // Initialize Meal Planner and make it globally available
    MealPlanner.init()
    window.MealPlanner = MealPlanner

    // Initialize Restaurant Finder and make it globally available
    RestaurantFinder.init()
    window.RestaurantFinder = RestaurantFinder

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
        btn.classList.remove("active", "bg-primary", "text-white")
        btn.classList.add("bg-light-bg", "dark:bg-dark-bg", "text-light-text", "dark:text-dark-text")

        if (btn.getAttribute("data-category") === randomCategory) {
          btn.classList.add("active", "bg-primary", "text-white")
          btn.classList.remove("bg-light-bg", "dark:bg-dark-bg", "text-light-text", "dark:text-dark-text")
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
            const description = featuredRecipe.description || featuredRecipe.instructions.split(".")[0] + "."
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
        btn.classList.remove("active", "bg-primary", "text-white")
        btn.classList.add("bg-light-bg", "dark:bg-dark-bg", "text-light-text", "dark:text-dark-text")

        if (btn.getAttribute("data-category") === category) {
          btn.classList.add("active", "bg-primary", "text-white")
          btn.classList.remove("bg-light-bg", "dark:bg-dark-bg", "text-light-text", "dark:text-dark-text")
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
        btn.classList.remove("active", "bg-primary", "text-white")
        btn.classList.add("bg-light-bg", "dark:bg-dark-bg", "text-light-text", "dark:text-dark-text")

        if (btn.getAttribute("data-category") === "all") {
          btn.classList.add("active", "bg-primary", "text-white")
          btn.classList.remove("bg-light-bg", "dark:bg-dark-bg", "text-light-text", "dark:text-dark-text")
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

// Add user account functionality
function initUserAccount() {
  const userAccountBtn = document.getElementById("user-account-btn")
  const mobileUserAccountBtn = document.getElementById("mobile-user-account-btn")
  const loginModal = document.getElementById("login-modal")
  const signupModal = document.getElementById("signup-modal")
  const closeLoginModalBtn = document.getElementById("close-login-modal-btn")
  const closeSignupModalBtn = document.getElementById("close-signup-modal-btn")
  const showSignupBtn = document.getElementById("show-signup-btn")
  const showLoginBtn = document.getElementById("show-login-btn")
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")

  // Show login modal
  if (userAccountBtn) {
    userAccountBtn.addEventListener("click", (e) => {
      e.preventDefault()
      loginModal.classList.remove("hidden")
    })
  }

  if (mobileUserAccountBtn) {
    mobileUserAccountBtn.addEventListener("click", (e) => {
      e.preventDefault()
      loginModal.classList.remove("hidden")
    })
  }

  // Close login modal
  if (closeLoginModalBtn) {
    closeLoginModalBtn.addEventListener("click", () => {
      loginModal.classList.add("hidden")
    })
  }

  // Close signup modal
  if (closeSignupModalBtn) {
    closeSignupModalBtn.addEventListener("click", () => {
      signupModal.classList.add("hidden")
    })
  }

  // Switch to signup modal
  if (showSignupBtn) {
    showSignupBtn.addEventListener("click", (e) => {
      e.preventDefault()
      loginModal.classList.add("hidden")
      signupModal.classList.remove("hidden")
    })
  }

  // Switch to login modal
  if (showLoginBtn) {
    showLoginBtn.addEventListener("click", (e) => {
      e.preventDefault()
      signupModal.classList.add("hidden")
      loginModal.classList.remove("hidden")
    })
  }

  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const email = document.getElementById("login-email").value
      const password = document.getElementById("login-password").value

      // Simulate login (in a real app, this would call an API)
      simulateLogin(email, password)
    })
  }

  // Handle signup form submission
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const name = document.getElementById("signup-name").value
      const email = document.getElementById("signup-email").value
      const password = document.getElementById("signup-password").value
      const confirmPassword = document.getElementById("signup-confirm-password").value

      // Check if passwords match
      if (password !== confirmPassword) {
        alert("Passwords do not match")
        return
      }

      // Simulate signup (in a real app, this would call an API)
      simulateSignup(name, email, password)
    })
  }

  // Simulate login
  function simulateLogin(email, password) {
    // Show loading state
    const submitButton = loginForm.querySelector('button[type="submit"]')
    const originalText = submitButton.innerHTML
    submitButton.disabled = true
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Signing In...'

    // Simulate API call
    setTimeout(() => {
      // Store user data in localStorage (in a real app, this would be a JWT token)
      const userData = {
        email,
        name: email.split("@")[0], // Use part of email as name for demo
        isLoggedIn: true,
      }

      localStorage.setItem("user", JSON.stringify(userData))

      // Update UI
      updateUserUI(userData)

      // Close modal
      loginModal.classList.add("hidden")

      // Reset form
      loginForm.reset()

      // Reset button
      submitButton.disabled = false
      submitButton.innerHTML = originalText
    }, 1500)
  }

  // Simulate signup
  function simulateSignup(name, email, password) {
    // Show loading state
    const submitButton = signupForm.querySelector('button[type="submit"]')
    const originalText = submitButton.innerHTML
    submitButton.disabled = true
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Creating Account...'

    // Simulate API call
    setTimeout(() => {
      // Store user data in localStorage (in a real app, this would be a JWT token)
      const userData = {
        email,
        name,
        isLoggedIn: true,
      }

      localStorage.setItem("user", JSON.stringify(userData))

      // Update UI
      updateUserUI(userData)

      // Close modal
      signupModal.classList.add("hidden")

      // Reset form
      signupForm.reset()

      // Reset button
      submitButton.disabled = false
      submitButton.innerHTML = originalText
    }, 1500)
  }

  // Update UI based on user login state
  function updateUserUI(userData) {
    if (userData && userData.isLoggedIn) {
      // Update account button text
      if (userAccountBtn) {
        userAccountBtn.innerHTML = `<i class="fas fa-user mr-1"></i> ${userData.name}`
      }

      if (mobileUserAccountBtn) {
        mobileUserAccountBtn.innerHTML = `<i class="fas fa-user mr-1"></i> ${userData.name}`
      }
    } else {
      // Reset account button text
      if (userAccountBtn) {
        userAccountBtn.innerHTML = `<i class="fas fa-user mr-1"></i> Account`
      }

      if (mobileUserAccountBtn) {
        mobileUserAccountBtn.innerHTML = `<i class="fas fa-user mr-1"></i> Account`
      }
    }
  }

  // Check if user is already logged in
  const userData = JSON.parse(localStorage.getItem("user") || "null")
  updateUserUI(userData)
}

// Add shopping list functionality
function initShoppingList() {
  const shoppingListModal = document.getElementById("shopping-list-modal")
  const closeShoppingListModalBtn = document.getElementById("close-shopping-list-modal-btn")
  const clearShoppingListBtn = document.getElementById("clear-shopping-list-btn")
  const printShoppingListBtn = document.getElementById("print-shopping-list-btn")
  const shoppingListContainer = document.getElementById("shopping-list-container")

  // Close shopping list modal
  if (closeShoppingListModalBtn) {
    closeShoppingListModalBtn.addEventListener("click", () => {
      shoppingListModal.classList.add("hidden")
    })
  }

  // Clear shopping list
  if (clearShoppingListBtn) {
    clearShoppingListBtn.addEventListener("click", () => {
      localStorage.removeItem("shopping-list")
      renderShoppingList()
    })
  }

  // Print shopping list
  if (printShoppingListBtn) {
    printShoppingListBtn.addEventListener("click", () => {
      printShoppingList()
    })
  }

  // Render shopping list
  function renderShoppingList() {
    if (!shoppingListContainer) return

    const shoppingList = JSON.parse(localStorage.getItem("shopping-list") || "[]")

    if (shoppingList.length === 0) {
      shoppingListContainer.innerHTML = `
                <div class="text-center py-8 text-light-textLight dark:text-dark-textLight">
                    <i class="fas fa-shopping-basket text-5xl mb-4"></i>
                    <p class="text-lg">Your shopping list is empty</p>
                    <p class="mb-4">Add ingredients from recipes to create your shopping list</p>
                </div>
            `
      return
    }

    // Group items by category
    const groupedItems = {}

    shoppingList.forEach((item) => {
      if (!groupedItems[item.category]) {
        groupedItems[item.category] = []
      }

      groupedItems[item.category].push(item)
    })

    // Render grouped items
    let html = ""

    Object.keys(groupedItems).forEach((category) => {
      html += `
                <div class="mb-4">
                    <h4 class="font-heading font-bold text-lg mb-2 dark:text-dark-text">${category}</h4>
                    <ul class="space-y-2">
            `

      groupedItems[category].forEach((item) => {
        html += `
                    <li class="flex items-center">
                        <input type="checkbox" class="shopping-item-checkbox mr-2" data-id="${item.id}">
                        <span class="flex-1 dark:text-dark-text">${item.amount ? item.amount + " " : ""}${item.name}</span>
                        <button class="remove-shopping-item-btn text-red-500 hover:text-red-700 transition duration-300" data-id="${item.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </li>
                `
      })

      html += `
                    </ul>
                </div>
            `
    })

    shoppingListContainer.innerHTML = html

    // Add event listeners to checkboxes
    const checkboxes = shoppingListContainer.querySelectorAll(".shopping-item-checkbox")
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const itemId = checkbox.getAttribute("data-id")
        toggleShoppingItem(itemId, checkbox.checked)
      })
    })

    // Add event listeners to remove buttons
    const removeButtons = shoppingListContainer.querySelectorAll(".remove-shopping-item-btn")
    removeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const itemId = button.getAttribute("data-id")
        removeShoppingItem(itemId)
      })
    })
  }

  // Toggle shopping item checked state
  function toggleShoppingItem(itemId, isChecked) {
    const shoppingList = JSON.parse(localStorage.getItem("shopping-list") || "[]")

    const updatedList = shoppingList.map((item) => {
      if (item.id === itemId) {
        return { ...item, checked: isChecked }
      }
      return item
    })

    localStorage.setItem("shopping-list", JSON.stringify(updatedList))
  }

  // Remove shopping item
  function removeShoppingItem(itemId) {
    const shoppingList = JSON.parse(localStorage.getItem("shopping-list") || "[]")

    const updatedList = shoppingList.filter((item) => item.id !== itemId)

    localStorage.setItem("shopping-list", JSON.stringify(updatedList))

    renderShoppingList()
  }

  // Print shopping list
  function printShoppingList() {
    const shoppingList = JSON.parse(localStorage.getItem("shopping-list") || "[]")

    if (shoppingList.length === 0) {
      alert("Your shopping list is empty")
      return
    }

    // Group items by category
    const groupedItems = {}

    shoppingList.forEach((item) => {
      if (!groupedItems[item.category]) {
        groupedItems[item.category] = []
      }

      groupedItems[item.category].push(item)
    })

    // Create print window
    const printWindow = window.open("", "_blank")

    printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Shopping List - Flavor Vault</title>
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
                        margin-bottom: 20px;
                        text-align: center;
                    }
                    h2 {
                        font-size: 18px;
                        margin-top: 20px;
                        margin-bottom: 10px;
                        border-bottom: 1px solid #eee;
                        padding-bottom: 5px;
                    }
                    ul {
                        list-style-type: square;
                        padding-left: 20px;
                    }
                    li {
                        margin-bottom: 5px;
                    }
                    .checked {
                        text-decoration: line-through;
                        color: #999;
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
                <h1>Shopping List</h1>
        `)

    // Add categories and items
    Object.keys(groupedItems).forEach((category) => {
      printWindow.document.write(`
                <h2>${category}</h2>
                <ul>
            `)

      groupedItems[category].forEach((item) => {
        printWindow.document.write(`
                    <li class="${item.checked ? "checked" : ""}">${item.amount ? item.amount + " " : ""}${item.name}</li>
                `)
      })

      printWindow.document.write(`
                </ul>
            `)
    })

    printWindow.document.write(`
                <div class="footer">
                    <p>Shopping List from Flavor Vault - Printed on ${new Date().toLocaleDateString()}</p>
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
  }

  // Initialize shopping list
  renderShoppingList()
}

// Add recipe submission functionality
function initRecipeSubmission() {
  const submitRecipeModal = document.getElementById("submit-recipe-modal")
  const closeSubmitRecipeModalBtn = document.getElementById("close-submit-recipe-modal-btn")
  const submitRecipeForm = document.getElementById("submit-recipe-form")
  const addIngredientBtn = document.getElementById("add-ingredient-btn")
  const ingredientsContainer = document.getElementById("ingredients-container")

  // Close submit recipe modal
  if (closeSubmitRecipeModalBtn) {
    closeSubmitRecipeModalBtn.addEventListener("click", () => {
      submitRecipeModal.classList.add("hidden")
    })
  }

  // Add ingredient
  if (addIngredientBtn) {
    addIngredientBtn.addEventListener("click", () => {
      addIngredientField()
    })
  }

  // Add ingredient field
  function addIngredientField() {
    if (!ingredientsContainer) return

    const ingredientField = document.createElement("div")
    ingredientField.className = "flex items-center space-x-2"
    ingredientField.innerHTML = `
            <input type="text" placeholder="Amount" class="ingredient-amount w-1/4 px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary">
            <input type="text" placeholder="Ingredient" class="ingredient-name flex-1 px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary">
            <button type="button" class="remove-ingredient-btn px-2 py-2 text-red-500 hover:text-red-700 transition duration-300">
                <i class="fas fa-times"></i>
            </button>
        `

    ingredientsContainer.appendChild(ingredientField)

    // Add event listener to remove button
    const removeButton = ingredientField.querySelector(".remove-ingredient-btn")
    removeButton.addEventListener("click", () => {
      ingredientField.remove()
    })
  }

  // Handle recipe submission
  if (submitRecipeForm) {
    submitRecipeForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const name = document.getElementById("recipe-name").value
      const category = document.getElementById("recipe-category").value
      const description = document.getElementById("recipe-description").value
      const instructions = document.getElementById("recipe-instructions").value
      const imageFile = document.getElementById("recipe-image").files[0]

      // Get ingredients
      const ingredients = []
      const ingredientAmounts = ingredientsContainer.querySelectorAll(".ingredient-amount")
      const ingredientNames = ingredientsContainer.querySelectorAll(".ingredient-name")

      for (let i = 0; i < ingredientNames.length; i++) {
        const amount = ingredientAmounts[i].value
        const name = ingredientNames[i].value

        if (name.trim()) {
          ingredients.push({
            amount,
            name,
          })
        }
      }

      // Validate form
      if (!name || !category || !description || !instructions || ingredients.length === 0) {
        alert("Please fill in all required fields")
        return
      }

      // Simulate recipe submission (in a real app, this would call an API)
      simulateRecipeSubmission(name, category, description, instructions, ingredients, imageFile)
    })
  }

  // Simulate recipe submission
  function simulateRecipeSubmission(name, category, description, instructions, ingredients, imageFile) {
    // Show loading state
    const submitButton = submitRecipeForm.querySelector('button[type="submit"]')
    const originalText = submitButton.innerHTML
    submitButton.disabled = true
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...'

    // Simulate API call
    setTimeout(() => {
      // Create recipe object
      const recipe = {
        id: "user-" + Date.now(),
        name,
        category,
        description,
        instructions,
        ingredients,
        thumbnail: imageFile ? URL.createObjectURL(imageFile) : "/placeholder.svg?height=300&width=300",
        rating: "0.0",
        cookingTime: Math.floor(Math.random() * 30) + 15, // Random cooking time between 15-45 minutes
        area: "User Submitted",
        source: "",
        youtube: "",
        tags: [category, "User Submitted"],
      }

      // Store recipe in localStorage
      const userRecipes = JSON.parse(localStorage.getItem("user-recipes") || "[]")
      userRecipes.push(recipe)
      localStorage.setItem("user-recipes", JSON.stringify(userRecipes))

      // Show success message
      alert("Recipe submitted successfully!")

      // Close modal
      submitRecipeModal.classList.add("hidden")

      // Reset form
      submitRecipeForm.reset()

      // Clear ingredients
      ingredientsContainer.innerHTML = `
                <div class="flex items-center space-x-2">
                    <input type="text" placeholder="Amount" class="ingredient-amount w-1/4 px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary">
                    <input type="text" placeholder="Ingredient" class="ingredient-name flex-1 px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary">
                    <button type="button" class="remove-ingredient-btn px-2 py-2 text-red-500 hover:text-red-700 transition duration-300">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `

      // Reset button
      submitButton.disabled = false
      submitButton.innerHTML = originalText
    }, 2000)
  }
}

// Add recipe rating functionality
function initRecipeRating() {
  const rateRecipeModal = document.getElementById("rate-recipe-modal")
  const closeRateRecipeModalBtn = document.getElementById("close-rate-recipe-modal-btn")
  const stars = document.querySelectorAll(".star")
  const ratingText = document.getElementById("rating-text")
  const submitRatingBtn = document.getElementById("submit-rating-btn")

  let currentRating = 0
  let currentRecipeId = null

  // Close rate recipe modal
  if (closeRateRecipeModalBtn) {
    closeRateRecipeModalBtn.addEventListener("click", () => {
      rateRecipeModal.classList.add("hidden")
    })
  }

  // Handle star rating
  if (stars.length > 0) {
    stars.forEach((star) => {
      // Hover effect
      star.addEventListener("mouseover", () => {
        const rating = Number.parseInt(star.getAttribute("data-rating"))
        highlightStars(rating)
        updateRatingText(rating)
      })

      // Click to set rating
      star.addEventListener("click", () => {
        currentRating = Number.parseInt(star.getAttribute("data-rating"))
        highlightStars(currentRating)
        updateRatingText(currentRating)
      })
    })

    // Reset on mouseout
    document.querySelector(".star").parentElement.addEventListener("mouseout", () => {
      highlightStars(currentRating)
      updateRatingText(currentRating)
    })
  }

  // Highlight stars up to rating
  function highlightStars(rating) {
    stars.forEach((star) => {
      const starRating = Number.parseInt(star.getAttribute("data-rating"))
      if (starRating <= rating) {
        star.classList.add("text-highlight")
        star.classList.remove("text-gray-300")
      } else {
        star.classList.remove("text-highlight")
        star.classList.add("text-gray-300")
      }
    })
  }

  // Update rating text
  function updateRatingText(rating) {
    if (!ratingText) return

    if (rating === 0) {
      ratingText.textContent = "Select a rating"
    } else {
      const ratingTexts = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"]

      ratingText.textContent = `${ratingTexts[rating]} (${rating} star${rating !== 1 ? "s" : ""})`
    }
  }

  // Handle rating submission
  if (submitRatingBtn) {
    submitRatingBtn.addEventListener("click", () => {
      if (currentRating === 0) {
        alert("Please select a rating")
        return
      }

      const reviewText = document.getElementById("review-text").value

      // Simulate rating submission (in a real app, this would call an API)
      simulateRatingSubmission(currentRecipeId, currentRating, reviewText)
    })
  }

  // Simulate rating submission
  function simulateRatingSubmission(recipeId, rating, reviewText) {
    // Show loading state
    const submitButton = submitRatingBtn
    const originalText = submitButton.innerHTML
    submitButton.disabled = true
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...'

    // Simulate API call
    setTimeout(() => {
      // Store rating in localStorage
      const ratings = JSON.parse(localStorage.getItem("recipe-ratings") || "{}")

      ratings[recipeId] = {
        rating,
        review: reviewText,
        date: new Date().toISOString(),
      }

      localStorage.setItem("recipe-ratings", JSON.stringify(ratings))

      // Show success message
      alert("Rating submitted successfully!")

      // Close modal
      rateRecipeModal.classList.add("hidden")

      // Reset form
      currentRating = 0
      highlightStars(0)
      updateRatingText(0)
      document.getElementById("review-text").value = ""

      // Reset button
      submitButton.disabled = false
      submitButton.innerHTML = originalText
    }, 1500)
  }

  // Open rating modal for a recipe
  window.openRatingModal = (recipeId, recipeName) => {
    if (!rateRecipeModal) return

    currentRecipeId = recipeId

    // Set recipe name
    const recipeNameElement = document.getElementById("rate-recipe-name")
    if (recipeNameElement) {
      recipeNameElement.textContent = recipeName
    }

    // Check if user has already rated this recipe
    const ratings = JSON.parse(localStorage.getItem("recipe-ratings") || "{}")
    if (ratings[recipeId]) {
      currentRating = ratings[recipeId].rating
      highlightStars(currentRating)
      updateRatingText(currentRating)

      if (ratings[recipeId].review) {
        document.getElementById("review-text").value = ratings[recipeId].review
      }
    } else {
      currentRating = 0
      highlightStars(0)
      updateRatingText(0)
      document.getElementById("review-text").value = ""
    }

    // Show modal
    rateRecipeModal.classList.remove("hidden")
  }
}

// Add enhanced social sharing functionality
function initSocialSharing() {
  const shareRecipeModal = document.getElementById("share-recipe-modal")
  const closeShareRecipeModalBtn = document.getElementById("close-share-recipe-modal-btn")
  const copyLinkBtn = document.getElementById("copy-link-btn")

  // Close share recipe modal
  if (closeShareRecipeModalBtn) {
    closeShareRecipeModalBtn.addEventListener("click", () => {
      shareRecipeModal.classList.add("hidden")
    })
  }

  // Copy link to clipboard
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", () => {
      const linkInput = document.getElementById("share-link")
      if (!linkInput) return

      linkInput.select()
      document.execCommand("copy")

      // Show copied message
      const originalText = copyLinkBtn.innerHTML
      copyLinkBtn.innerHTML = '<i class="fas fa-check"></i>'

      setTimeout(() => {
        copyLinkBtn.innerHTML = originalText
      }, 2000)
    })
  }

  // Open sharing modal for a recipe
  window.openSharingModal = (recipeId, recipeName, recipeImage) => {
    if (!shareRecipeModal) return

    // Set recipe name
    const recipeNameElement = document.getElementById("share-recipe-name")
    if (recipeNameElement) {
      recipeNameElement.textContent = recipeName
    }

    // Set share link
    const shareLink = document.getElementById("share-link")
    if (shareLink) {
      const url = `${window.location.origin}${window.location.pathname}?recipe=${recipeId}`
      shareLink.value = url
    }

    // Set up social sharing links
    const facebookShare = document.getElementById("share-facebook")
    const twitterShare = document.getElementById("share-twitter")
    const pinterestShare = document.getElementById("share-pinterest")
    const emailShare = document.getElementById("share-email")

    if (facebookShare) {
      const url = `${window.location.origin}${window.location.pathname}?recipe=${recipeId}`
      facebookShare.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
      facebookShare.target = "_blank"
    }

    if (twitterShare) {
      const url = `${window.location.origin}${window.location.pathname}?recipe=${recipeId}`
      const text = `Check out this delicious ${recipeName} recipe I found on Flavor Vault!`
      twitterShare.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
      twitterShare.target = "_blank"
    }

    if (pinterestShare) {
      const url = `${window.location.origin}${window.location.pathname}?recipe=${recipeId}`
      const description = `Check out this delicious ${recipeName} recipe I found on Flavor Vault!`
      pinterestShare.href = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(recipeImage)}&description=${encodeURIComponent(description)}`
      pinterestShare.target = "_blank"
    }

    if (emailShare) {
      const url = `${window.location.origin}${window.location.pathname}?recipe=${recipeId}`
      const subject = `Check out this ${recipeName} recipe`
      const body = `I found this delicious ${recipeName} recipe on Flavor Vault that I thought you might enjoy:\n\n${url}`
      emailShare.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }

    // Show modal
    shareRecipeModal.classList.remove("hidden")
  }
}

// Add this at the end of the file, just before the DOMContentLoaded event listener

// Show modals when buttons are clicked
function setupModalTriggers() {
  console.log("Setting up modal triggers")

  // Direct modal buttons
  const showAccountModalBtn = document.getElementById("show-account-modal-btn")
  const showShoppingListModalBtn = document.getElementById("show-shopping-list-modal-btn")
  const showSubmitRecipeModalBtn = document.getElementById("show-submit-recipe-modal-btn")
  const showRateRecipeModalBtn = document.getElementById("show-rate-recipe-modal-btn")
  const showShareRecipeModalBtn = document.getElementById("show-share-recipe-modal-btn")
  const toggleDarkModeBtn = document.getElementById("toggle-dark-mode-btn")

  // Get modals
  const loginModal = document.getElementById("login-modal")
  const shoppingListModal = document.getElementById("shopping-list-modal")
  const submitRecipeModal = document.getElementById("submit-recipe-modal")
  const rateRecipeModal = document.getElementById("rate-recipe-modal")
  const shareRecipeModal = document.getElementById("share-recipe-modal")

  console.log("Modals found:", {
    loginModal: !!loginModal,
    shoppingListModal: !!shoppingListModal,
    submitRecipeModal: !!submitRecipeModal,
    rateRecipeModal: !!rateRecipeModal,
    shareRecipeModal: !!shareRecipeModal,
  })

  // Account modal button
  if (showAccountModalBtn && loginModal) {
    showAccountModalBtn.addEventListener("click", () => {
      console.log("Opening account modal")
      loginModal.classList.remove("hidden")
    })
  }

  // Shopping list modal button
  if (showShoppingListModalBtn && shoppingListModal) {
    showShoppingListModalBtn.addEventListener("click", () => {
      console.log("Opening shopping list modal")
      shoppingListModal.classList.remove("hidden")
    })
  }

  // Submit recipe modal button
  if (showSubmitRecipeModalBtn && submitRecipeModal) {
    showSubmitRecipeModalBtn.addEventListener("click", () => {
      console.log("Opening submit recipe modal")
      submitRecipeModal.classList.remove("hidden")
    })
  }

  // Rate recipe modal button
  if (showRateRecipeModalBtn && rateRecipeModal) {
    showRateRecipeModalBtn.addEventListener("click", () => {
      console.log("Opening rate recipe modal")
      // Set a default recipe name for demo purposes
      const recipeNameElement = document.getElementById("rate-recipe-name")
      if (recipeNameElement) {
        recipeNameElement.textContent = "Sample Recipe"
      }
      rateRecipeModal.classList.remove("hidden")
    })
  }

  // Share recipe modal button
  if (showShareRecipeModalBtn && shareRecipeModal) {
    showShareRecipeModalBtn.addEventListener("click", () => {
      console.log("Opening share recipe modal")
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
      shareRecipeModal.classList.remove("hidden")
    })
  }

  // Toggle dark mode button
  if (toggleDarkModeBtn) {
    toggleDarkModeBtn.addEventListener("click", () => {
      console.log("Toggling dark mode")
      DarkMode.toggleTheme()
    })
  }

  // User account button in nav
  const userAccountBtn = document.getElementById("user-account-btn")
  if (userAccountBtn && loginModal) {
    userAccountBtn.addEventListener("click", (e) => {
      e.preventDefault()
      console.log("Opening account modal from nav")
      loginModal.classList.remove("hidden")
    })
  }

  // Mobile user account button
  const mobileUserAccountBtn = document.getElementById("mobile-user-account-btn")
  if (mobileUserAccountBtn && loginModal) {
    mobileUserAccountBtn.addEventListener("click", (e) => {
      e.preventDefault()
      console.log("Opening account modal from mobile nav")
      loginModal.classList.remove("hidden")
    })
  }

  // Close buttons for all modals
  const closeButtons = document.querySelectorAll('[id$="-modal-btn"]')
  closeButtons.forEach((button) => {
    if (button.id.startsWith("close-")) {
      const modalId = button.id.replace("close-", "")
      const modal = document.getElementById(modalId)
      if (modal) {
        button.addEventListener("click", () => {
          console.log(`Closing ${modalId}`)
          modal.classList.add("hidden")
        })
      }
    }
  })

  // Switch between login and signup
  const showSignupBtn = document.getElementById("show-signup-btn")
  const showLoginBtn = document.getElementById("show-login-btn")
  const signupModal = document.getElementById("signup-modal")

  if (showSignupBtn && loginModal && signupModal) {
    showSignupBtn.addEventListener("click", (e) => {
      e.preventDefault()
      loginModal.classList.add("hidden")
      signupModal.classList.remove("hidden")
    })
  }

  if (showLoginBtn && loginModal && signupModal) {
    showLoginBtn.addEventListener("click", (e) => {
      e.preventDefault()
      signupModal.classList.add("hidden")
      loginModal.classList.remove("hidden")
    })
  }
}

// Replace the existing DOMContentLoaded event listener with this one
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded")

  // Initialize existing features
  App.init()

  // Initialize new features
  initUserAccount()
  initShoppingList()
  initRecipeSubmission()
  initRecipeRating()
  initSocialSharing()

  // Make sure UI is initialized properly
  if (window.UI && typeof window.UI.init === "function") {
    window.UI.init()
  } else {
    console.error("UI module not found or init method not available")
  }

  // Make sure DarkMode is initialized properly
  if (window.DarkMode && typeof window.DarkMode.init === "function") {
    window.DarkMode.init()
  } else {
    console.error("DarkMode module not found or init method not available")
  }

  // Fix dark mode toggle
  const themeToggle = document.getElementById("theme-toggle")
  const mobileThemeToggle = document.getElementById("mobile-theme-toggle")

  if (themeToggle && window.DarkMode) {
    themeToggle.checked = window.DarkMode.isDarkMode()
    window.DarkMode.updateToggleAppearance(themeToggle)

    // Add event listener to ensure it works
    themeToggle.addEventListener("change", () => {
      console.log("Theme toggle changed")
      window.DarkMode.toggleTheme()
    })
  }

  if (mobileThemeToggle && window.DarkMode) {
    mobileThemeToggle.checked = window.DarkMode.isDarkMode()
    window.DarkMode.updateToggleAppearance(mobileThemeToggle)

    // Add event listener to ensure it works
    mobileThemeToggle.addEventListener("change", () => {
      console.log("Mobile theme toggle changed")
      window.DarkMode.toggleTheme()
    })
  }

  // Ensure toggle dark mode button works
  const toggleDarkModeBtn = document.getElementById("toggle-dark-mode-btn")
  if (toggleDarkModeBtn && window.DarkMode) {
    toggleDarkModeBtn.addEventListener("click", () => {
      console.log("Toggle dark mode button clicked")
      window.DarkMode.toggleTheme()

      // Update toggle states
      if (themeToggle) {
        themeToggle.checked = window.DarkMode.isDarkMode()
        window.DarkMode.updateToggleAppearance(themeToggle)
      }

      if (mobileThemeToggle) {
        mobileThemeToggle.checked = window.DarkMode.isDarkMode()
        window.DarkMode.updateToggleAppearance(mobileThemeToggle)
      }
    })
  }

  // Manually setup modal triggers as a fallback
  setupModalTriggers()

  console.log("App fully initialized")
})

// Add this function to ensure modal triggers are set up
function setupModalTriggers() {
  console.log("Setting up modal triggers (fallback)")

  // Direct modal buttons
  const modalTriggers = [
    { triggerId: "show-account-modal-btn", modalId: "login-modal" },
    { triggerId: "user-account-btn", modalId: "login-modal" },
    { triggerId: "mobile-user-account-btn", modalId: "login-modal" },
    { triggerId: "show-shopping-list-modal-btn", modalId: "shopping-list-modal" },
    { triggerId: "show-submit-recipe-modal-btn", modalId: "submit-recipe-modal" },
    { triggerId: "show-rate-recipe-modal-btn", modalId: "rate-recipe-modal" },
    { triggerId: "show-share-recipe-modal-btn", modalId: "share-recipe-modal" },
  ]

  modalTriggers.forEach(({ triggerId, modalId }) => {
    const trigger = document.getElementById(triggerId)
    const modal = document.getElementById(modalId)

    if (trigger && modal) {
      console.log(`Setting up modal trigger: ${triggerId} -> ${modalId}`)

      trigger.addEventListener("click", (e) => {
        e.preventDefault()
        console.log(`Opening modal: ${modalId}`)
        modal.classList.remove("hidden")

        // Special handling for specific modals
        if (modalId === "rate-recipe-modal") {
          const recipeNameElement = document.getElementById("rate-recipe-name")
          if (recipeNameElement) {
            recipeNameElement.textContent = "Sample Recipe"
          }
        }

        if (modalId === "share-recipe-modal") {
          const recipeNameElement = document.getElementById("share-recipe-name")
          if (recipeNameElement) {
            recipeNameElement.textContent = "Sample Recipe"
          }

          const shareLinkInput = document.getElementById("share-link")
          if (shareLinkInput) {
            shareLinkInput.value = window.location.href
          }
        }
      })
    } else {
      if (!trigger) console.warn(`Trigger element not found: ${triggerId}`)
      if (!modal) console.warn(`Modal element not found: ${modalId}`)
    }
  })

  // Close buttons for all modals
  const closeButtons = document.querySelectorAll('[id^="close-"][id$="-modal-btn"]')
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
  const modalSwitches = [
    { triggerId: "show-signup-btn", fromModalId: "login-modal", toModalId: "signup-modal" },
    { triggerId: "show-login-btn", fromModalId: "signup-modal", toModalId: "login-modal" },
  ]

  modalSwitches.forEach(({ triggerId, fromModalId, toModalId }) => {
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
  })
}

