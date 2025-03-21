/**
 * Meal Planner Module
 * Handles all meal planning functionality
 */
const MealPlanner = {
  /**
   * Initialize meal planner
   */
  init() {
    console.log("Initializing Meal Planner")

    // Set up event listeners
    this.setupEventListeners()

    // Load meal plan from localStorage
    this.loadMealPlan()

    // Make MealPlanner available globally
    window.MealPlanner = this
  },

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    console.log("Setting up meal planner event listeners")

    // Add to meal plan form
    const addMealPlanForm = document.getElementById("add-meal-plan-form")
    if (addMealPlanForm) {
      addMealPlanForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.handleAddToMealPlan()
      })
    }

    // Clear meal plan button
    const clearMealPlanBtn = document.getElementById("clear-meal-plan-btn")
    if (clearMealPlanBtn) {
      clearMealPlanBtn.addEventListener("click", () => {
        this.clearMealPlan()
      })
    }

    // Print meal plan button
    const printMealPlanBtn = document.getElementById("print-meal-plan-btn")
    if (printMealPlanBtn) {
      printMealPlanBtn.addEventListener("click", () => {
        this.printMealPlan()
      })
    }

    // Generate shopping list button
    const generateShoppingListBtn = document.getElementById("generate-shopping-list-btn")
    if (generateShoppingListBtn) {
      generateShoppingListBtn.addEventListener("click", () => {
        this.generateShoppingList()
      })
    }

    // Add meal placeholders click event
    const mealPlaceholders = document.querySelectorAll(".meal-placeholder")
    mealPlaceholders.forEach((placeholder) => {
      placeholder.addEventListener("click", () => {
        // Get day and meal type from parent elements
        const mealSlot = placeholder.closest(".meal-slot")
        const dayCard = placeholder.closest(".day-card")

        if (mealSlot && dayCard) {
          const mealType = mealSlot.querySelector("h5").textContent.toLowerCase().trim()
          const day = dayCard.querySelector("h4").textContent.toLowerCase().trim()

          // Pre-select day and meal type in the form
          this.openAddToMealPlanModal(day, mealType)
        }
      })
    })

    // Show meal planner button
    const showMealPlannerBtn = document.getElementById("show-meal-planner-btn")
    if (showMealPlannerBtn) {
      showMealPlannerBtn.addEventListener("click", () => {
        // Show meal planner view
        const mealPlannerView = document.getElementById("meal-planner-view")
        if (mealPlannerView) {
          // Hide all views
          document.querySelectorAll(".app-view").forEach((view) => {
            view.classList.remove("active")
          })

          // Show meal planner view
          mealPlannerView.classList.add("active")

          // Update active nav link
          document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((link) => {
            link.classList.remove("active")

            if (link.getAttribute("data-view") === "meal-planner") {
              link.classList.add("active")
            }
          })
        }
      })
    }

    // Add to meal plan buttons
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-to-plan-btn") || e.target.closest(".add-to-plan-btn")) {
        const button = e.target.classList.contains("add-to-plan-btn") ? e.target : e.target.closest(".add-to-plan-btn")

        const recipeId = button.getAttribute("data-recipe-id")
        const recipeName = button.getAttribute("data-recipe-name")
        const recipeImage = button.getAttribute("data-recipe-image")

        if (recipeId && recipeName) {
          this.showAddToPlanModal(recipeId, recipeName, recipeImage)
        }
      }
    })

    // Close modal when clicking outside
    document.addEventListener("click", (e) => {
      const modal = document.getElementById("meal-plan-modal")
      if (modal && e.target === modal) {
        this.closeModal()
      }
    })

    // Close modal with escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeModal()
      }
    })

    // Add to meal plan button in Meal Planner view
    const addToMealPlanBtn = document.getElementById("add-to-meal-plan-btn")
    if (addToMealPlanBtn) {
      addToMealPlanBtn.addEventListener("click", () => {
        this.openAddMealPlanModal()
      })
    }

    // Meal planner navigation link
    const mealPlannerLinks = document.querySelectorAll(
      '.nav-link[data-view="meal-planner"], .mobile-nav-link[data-view="meal-planner"]',
    )
    mealPlannerLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        if (window.UI) {
          window.UI.showView("meal-planner")
          window.UI.updateActiveNavLink("meal-planner")
        }
      })
    })

    // Add event listeners to meal placeholders
    this.setupMealPlaceholders()
  },

  /**
   * Set up meal placeholders
   */
  setupMealPlaceholders() {
    const mealPlaceholders = document.querySelectorAll(".meal-placeholder")

    mealPlaceholders.forEach((placeholder) => {
      placeholder.addEventListener("click", () => {
        this.openAddMealPlanModal()

        // Set day and meal type based on the clicked placeholder
        const dayCard = placeholder.closest(".day-card")
        const day = dayCard.querySelector("h4").textContent.toLowerCase()

        const mealSlot = placeholder.closest(".meal-slot")
        const mealType = mealSlot.querySelector("h5").textContent.toLowerCase()

        const daySelect = document.getElementById("meal-day-select")
        const mealTypeSelect = document.getElementById("meal-type-select")

        if (daySelect) {
          const dayOption = Array.from(daySelect.options).find((option) => option.text.toLowerCase() === day)
          if (dayOption) {
            daySelect.value = dayOption.value
          }
        }

        if (mealTypeSelect) {
          const mealOption = Array.from(mealTypeSelect.options).find((option) => option.text.toLowerCase() === mealType)
          if (mealOption) {
            mealTypeSelect.value = mealOption.value
          }
        }
      })
    })
  },

  /**
   * Show modal to add recipe to meal plan
   * @param {string} recipeId - Recipe ID
   * @param {string} recipeName - Recipe name
   * @param {string} recipeImage - Recipe image URL
   */
  showAddToPlanModal(recipeId, recipeName, recipeImage) {
    // Create modal if it doesn't exist
    let modal = document.getElementById("meal-plan-modal")

    if (!modal) {
      modal = document.createElement("div")
      modal.id = "meal-plan-modal"
      modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      document.body.appendChild(modal)
    }

    // Get current date and next 7 days
    const days = this.getNextSevenDays()

    // Create modal content
    modal.innerHTML = `
            <div class="bg-white dark:bg-dark-card rounded-xl max-w-md w-full p-6 animate-fade-in">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-heading text-xl font-bold dark:text-dark-text">Add to Meal Plan</h3>
                    <button id="close-modal-btn" class="text-light-textLight dark:text-dark-textLight hover:text-primary">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <div class="flex items-center mb-6">
                    <img src="${recipeImage || "/placeholder.svg?height=80&width=80"}" alt="${recipeName}" 
                        class="w-16 h-16 rounded-md object-cover mr-4">
                    <div>
                        <h4 class="font-medium dark:text-dark-text">${recipeName}</h4>
                        <p class="text-sm text-light-textLight dark:text-dark-textLight">Select day and meal type</p>
                    </div>
                </div>
                
                <div class="mb-4">
                    <label class="block mb-2 font-medium dark:text-dark-text">Day</label>
                    <select id="meal-plan-day" class="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
                        ${days
                          .map(
                            (day) => `
                            <option value="${day.value}">${day.label}</option>
                        `,
                          )
                          .join("")}
                    </select>
                </div>
                
                <div class="mb-6">
                    <label class="block mb-2 font-medium dark:text-dark-text">Meal Type</label>
                    <select id="meal-plan-type" class="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                    </select>
                </div>
                
                <div class="flex justify-end">
                    <button id="cancel-plan-btn" class="px-4 py-2 mr-2 border border-light-border dark:border-dark-border rounded-md">
                        Cancel
                    </button>
                    <button id="add-to-plan-confirm-btn" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition duration-300">
                        Add to Plan
                    </button>
                </div>
            </div>
        `

    // Show modal
    modal.style.display = "flex"

    // Add event listeners
    document.getElementById("close-modal-btn").addEventListener("click", () => {
      this.closeModal()
    })

    document.getElementById("cancel-plan-btn").addEventListener("click", () => {
      this.closeModal()
    })

    document.getElementById("add-to-plan-confirm-btn").addEventListener("click", () => {
      const day = document.getElementById("meal-plan-day").value
      const mealType = document.getElementById("meal-plan-type").value

      this.addToPlan(recipeId, recipeName, recipeImage, day, mealType)
      this.closeModal()

      // Show success message
      this.showNotification("Recipe added to your meal plan!")
    })
  },

  /**
   * Open add meal plan modal
   */
  openAddMealPlanModal() {
    const modal = document.getElementById("add-meal-plan-modal")
    if (modal) {
      // Populate recipe select options
      this.populateRecipeOptions()

      modal.classList.remove("hidden")
    }
  },

  /**
   * Close add meal plan modal
   */
  closeAddMealPlanModal() {
    const modal = document.getElementById("add-meal-plan-modal")
    if (modal) {
      modal.classList.add("hidden")

      // Reset form
      const form = document.getElementById("add-meal-plan-form")
      if (form) {
        form.reset()
      }
    }
  },

  /**
   * Populate recipe options
   */
  populateRecipeOptions() {
    const recipeSelect = document.getElementById("meal-recipe-select")
    if (!recipeSelect) return

    // Clear existing options except the first one
    while (recipeSelect.options.length > 1) {
      recipeSelect.remove(1)
    }

    // Get recipes from favorites
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")

    // Get recent search results
    const recentRecipes = JSON.parse(localStorage.getItem("recent-recipes") || "[]")

    // Combine and remove duplicates
    const recipes = [...favorites]

    recentRecipes.forEach((recipe) => {
      if (!recipes.some((r) => r.id === recipe.id)) {
        recipes.push(recipe)
      }
    })

    // Add recipe options
    recipes.forEach((recipe) => {
      const option = document.createElement("option")
      option.value = JSON.stringify(recipe)
      option.textContent = recipe.name
      recipeSelect.appendChild(option)
    })

    // If no recipes, add a message
    if (recipes.length === 0) {
      const option = document.createElement("option")
      option.value = ""
      option.textContent = "No recipes available. Add some favorites first!"
      option.disabled = true
      recipeSelect.appendChild(option)
    }
  },

  /**
   * Handle add meal plan
   */
  handleAddMealPlan() {
    const recipeSelect = document.getElementById("meal-recipe-select")
    const daySelect = document.getElementById("meal-day-select")
    const mealTypeSelect = document.getElementById("meal-type-select")
    const mealNotes = document.getElementById("meal-notes")

    if (!recipeSelect || !daySelect || !mealTypeSelect) return

    const recipeValue = recipeSelect.value
    const day = daySelect.value
    const mealType = mealTypeSelect.value
    const notes = mealNotes?.value || ""

    if (!recipeValue || !day || !mealType) {
      alert("Please select a recipe, day, and meal type")
      return
    }

    // Parse recipe data
    let recipe
    try {
      recipe = JSON.parse(recipeValue)
    } catch (error) {
      console.error("Error parsing recipe data:", error)
      alert("Invalid recipe data")
      return
    }

    // Get meal plan data
    const mealPlan = JSON.parse(localStorage.getItem("meal-plan") || "{}")

    // Initialize day if it doesn't exist
    if (!mealPlan[day]) {
      mealPlan[day] = {}
    }

    // Add meal
    mealPlan[day][mealType] = {
      recipe,
      notes,
    }

    // Save meal plan
    localStorage.setItem("meal-plan", JSON.stringify(mealPlan))

    // Close modal
    this.closeAddMealPlanModal()

    // Update UI
    this.loadMealPlan()

    // Show success message
    alert("Recipe added to meal plan!")
  },

  /**
   * Close the modal
   */
  closeModal() {
    const modal = document.getElementById("meal-plan-modal")
    if (modal) {
      modal.style.display = "none"
    }
  },

  /**
   * Show notification message
   * @param {string} message - Message to display
   */
  showNotification(message) {
    // Create notification if it doesn't exist
    let notification = document.getElementById("notification")

    if (!notification) {
      notification = document.createElement("div")
      notification.id = "notification"
      notification.className =
        "fixed bottom-4 right-4 bg-secondary text-white px-4 py-2 rounded-md shadow-lg transform transition-transform duration-300 translate-y-20 z-50"
      document.body.appendChild(notification)
    }

    // Set message
    notification.textContent = message

    // Show notification
    setTimeout(() => {
      notification.classList.remove("translate-y-20")
    }, 100)

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.classList.add("translate-y-20")
    }, 3000)
  },

  /**
   * Get next seven days for meal planning
   * @returns {Array} - Array of day objects with value and label
   */
  getNextSevenDays() {
    const days = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      const value = this.formatDateValue(date)
      let label = ""

      if (i === 0) {
        label = "Today"
      } else if (i === 1) {
        label = "Tomorrow"
      } else {
        label = date.toLocaleDateString("en-US", { weekday: "long" })
      }

      label += ` (${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })})`

      days.push({ value, label })
    }

    return days
  },

  /**
   * Format date as YYYY-MM-DD for storage
   * @param {Date} date - Date object
   * @returns {string} - Formatted date string
   */
  formatDateValue(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  },

  /**
   * Add recipe to meal plan
   * @param {string} recipeId - Recipe ID
   * @param {string} recipeName - Recipe name
   * @param {string} recipeImage - Recipe image URL
   * @param {string} day - Day value (YYYY-MM-DD)
   * @param {string} mealType - Meal type (breakfast, lunch, dinner, snack)
   */
  addToPlan(recipeId, recipeName, recipeImage, day, mealType) {
    const mealPlan = this.getMealPlan()

    // Initialize day if it doesn't exist
    if (!mealPlan[day]) {
      mealPlan[day] = {}
    }

    // Add recipe to meal plan
    mealPlan[day][mealType] = {
      id: recipeId,
      name: recipeName,
      image: recipeImage,
    }

    // Save meal plan
    localStorage.setItem(this.storageKey, JSON.stringify(mealPlan))

    // Update meal plan display if visible
    this.updateMealPlanDisplay()
  },

  /**
   * Load meal plan
   */
  loadMealPlan() {
    // Render meal plan
    this.renderMealPlan()
  },

  /**
   * Render meal plan
   */
  renderMealPlan() {
    // Get meal plan
    const mealPlan = JSON.parse(localStorage.getItem("meal-plan") || "[]")

    // Get day cards
    const dayCards = document.querySelectorAll(".day-card")

    if (dayCards.length === 0) return

    // Reset meal slots
    dayCards.forEach((dayCard) => {
      const day = dayCard.querySelector("h4").textContent.toLowerCase().trim()
      const mealSlots = dayCard.querySelectorAll(".meal-slot")

      mealSlots.forEach((mealSlot) => {
        const mealType = mealSlot.querySelector("h5").textContent.toLowerCase().trim()

        // Reset to placeholder
        mealSlot.innerHTML = `
          <h5 class="text-sm font-medium text-light-textLight dark:text-dark-textLight mb-1">${mealType}</h5>
          <div class="meal-placeholder text-center py-2 border border-dashed border-light-border dark:border-dark-border rounded text-light-textLight dark:text-dark-textLight">
            <i class="fas fa-plus-circle mr-1"></i> Add Meal
          </div>
        `

        // Add click event to placeholder
        const placeholder = mealSlot.querySelector(".meal-placeholder")
        if (placeholder) {
          placeholder.addEventListener("click", () => {
            this.openAddToMealPlanModal(day, mealType)
          })
        }
      })
    })

    // Populate meal slots with meal plan items
    mealPlan.forEach((item) => {
      // Find day card
      const dayCard = Array.from(dayCards).find(
        (card) => card.querySelector("h4").textContent.toLowerCase().trim() === item.dayText.toLowerCase(),
      )

      if (dayCard) {
        // Find meal slot
        const mealSlots = dayCard.querySelectorAll(".meal-slot")
        const mealSlot = Array.from(mealSlots).find(
          (slot) => slot.querySelector("h5").textContent.toLowerCase().trim() === item.mealTypeText.toLowerCase(),
        )

        if (mealSlot) {
          // Replace placeholder with meal
          mealSlot.innerHTML = `
            <h5 class="text-sm font-medium text-light-textLight dark:text-dark-textLight mb-1">${item.mealTypeText}</h5>
            <div class="meal-item bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded overflow-hidden">
              <div class="flex items-center p-2">
                <div class="flex-shrink-0 w-12 h-12 bg-light-bg dark:bg-dark-bg rounded overflow-hidden mr-2">
                  <img src="${item.recipeImage || "/placeholder.svg?height=48&width=48"}" alt="${item.recipeName}" class="w-full h-full object-cover">
                </div>
                <div class="flex-grow min-w-0">
                  <h6 class="font-medium text-sm truncate dark:text-dark-text">${item.recipeName}</h6>
                  ${item.notes ? `<p class="text-xs text-light-textLight dark:text-dark-textLight truncate">${item.notes}</p>` : ""}
                </div>
                <button class="remove-meal-btn flex-shrink-0 text-red-500 hover:text-red-700 transition duration-300 ml-2" data-id="${item.id}">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          `

          // Add click event to remove button
          const removeBtn = mealSlot.querySelector(".remove-meal-btn")
          if (removeBtn) {
            removeBtn.addEventListener("click", (e) => {
              e.stopPropagation()
              this.removeFromMealPlan(item.id)
            })
          }
        }
      }
    })

    // Update shopping list
    this.updateMealPlanShoppingList()
  },

  /**
   * Remove recipe from meal plan
   * @param {string} day - Day value (YYYY-MM-DD)
   * @param {string} mealType - Meal type (breakfast, lunch, dinner, snack)
   */
  removeFromPlan(day, mealType) {
    const mealPlan = this.getMealPlan()

    // Remove recipe from meal plan
    if (mealPlan[day] && mealPlan[day][mealType]) {
      delete mealPlan[day][mealType]

      // Remove day if empty
      if (Object.keys(mealPlan[day]).length === 0) {
        delete mealPlan[day]
      }

      // Save meal plan
      localStorage.setItem(this.storageKey, JSON.stringify(mealPlan))

      // Update meal plan display
      this.updateMealPlanDisplay()
    }
  },

  /**
   * Remove meal
   * @param {string} day - Day of the week
   * @param {string} mealType - Type of meal
   */
  removeMeal(day, mealType) {
    // Get meal plan data
    const mealPlan = JSON.parse(localStorage.getItem("meal-plan") || "{}")

    // Remove meal
    if (mealPlan[day] && mealPlan[day][mealType]) {
      delete mealPlan[day][mealType]

      // Remove day if empty
      if (Object.keys(mealPlan[day]).length === 0) {
        delete mealPlan[day]
      }

      // Save meal plan
      localStorage.setItem("meal-plan", JSON.stringify(mealPlan))

      // Update UI
      this.loadMealPlan()
    }
  },

  /**
   * Get meal plan from localStorage
   * @returns {Object} - Meal plan object
   */
  getMealPlan() {
    const mealPlan = localStorage.getItem(this.storageKey)
    return mealPlan ? JSON.parse(mealPlan) : {}
  },

  /**
   * Update meal plan display if visible
   */
  updateMealPlanDisplay() {
    const mealPlanContainer = document.getElementById("meal-plan-container")
    if (mealPlanContainer && mealPlanContainer.offsetParent !== null) {
      this.renderMealPlan(mealPlanContainer)
    }
  },

  /**
   * Render meal plan in container
   * @param {HTMLElement} container - Container element
   */
  renderMealPlan(container) {
    const mealPlan = this.getMealPlan()
    const days = this.getNextSevenDays()

    // Check if meal plan is empty
    const isEmpty = Object.keys(mealPlan).length === 0

    if (isEmpty) {
      container.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-calendar-alt text-5xl text-light-textLight dark:text-dark-textLight mb-4"></i>
                    <p class="text-lg text-light-textLight dark:text-dark-textLight mb-2">Your meal plan is empty</p>
                    <p class="text-light-textLight dark:text-dark-textLight mb-6">Add recipes to your meal plan to get started</p>
                </div>
            `
      return
    }

    // Create meal plan table
    let html = `
            <div class="overflow-x-auto">
                <table class="w-full border-collapse">
                    <thead>
                        <tr>
                            <th class="py-2 px-4 bg-light-bg dark:bg-dark-bg text-left font-medium">Day</th>
                            <th class="py-2 px-4 bg-light-bg dark:bg-dark-bg text-left font-medium">Breakfast</th>
                            <th class="py-2 px-4 bg-light-bg dark:bg-dark-bg text-left font-medium">Lunch</th>
                            <th class="py-2 px-4 bg-light-bg dark:bg-dark-bg text-left font-medium">Dinner</th>
                            <th class="py-2 px-4 bg-light-bg dark:bg-dark-bg text-left font-medium">Snack</th>
                        </tr>
                    </thead>
                    <tbody>
        `

    // Add rows for each day
    days.forEach((day) => {
      const dayData = mealPlan[day.value] || {}

      html += `
                <tr class="border-b border-light-border dark:border-dark-border">
                    <td class="py-3 px-4 font-medium dark:text-dark-text">${day.label}</td>
                    ${this.renderMealCell(dayData.breakfast, day.value, "breakfast")}
                    ${this.renderMealCell(dayData.lunch, day.value, "lunch")}
                    ${this.renderMealCell(dayData.dinner, day.value, "dinner")}
                    ${this.renderMealCell(dayData.snack, day.value, "snack")}
                </tr>
            `
    })

    html += `
                    </tbody>
                </table>
            </div>
            <div class="mt-6 flex justify-end">
                <button id="print-meal-plan-btn" class="flex items-center text-light-textLight dark:text-dark-textLight hover:text-primary transition duration-300 mr-4">
                    <i class="fas fa-print mr-2"></i> Print Meal Plan
                </button>
                <button id="clear-meal-plan-btn" class="flex items-center text-light-textLight dark:text-dark-textLight hover:text-primary transition duration-300">
                    <i class="fas fa-trash-alt mr-2"></i> Clear Meal Plan
                </button>
            </div>
        `

    container.innerHTML = html

    // Add event listeners
    document.getElementById("print-meal-plan-btn").addEventListener("click", () => {
      this.printMealPlan()
    })

    document.getElementById("clear-meal-plan-btn").addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your meal plan?")) {
        this.clearMealPlan()
      }
    })

    // Add event listeners to remove buttons
    document.querySelectorAll(".remove-meal-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const day = button.getAttribute("data-day")
        const mealType = button.getAttribute("data-meal-type")
        this.removeFromPlan(day, mealType)
      })
    })
  },

  /**
   * Clear meal plan
   */
  clearMealPlan() {
    // Confirm before clearing
    if (confirm("Are you sure you want to clear your meal plan?")) {
      // Clear meal plan
      localStorage.removeItem("meal-plan")

      // Update UI
      this.renderMealPlan()

      // Show success message
      alert("Meal plan cleared")
    }
  },

  /**
   * Print meal plan
   */
  printMealPlan() {
    // Get meal plan
    const mealPlan = JSON.parse(localStorage.getItem("meal-plan") || "[]")

    if (mealPlan.length === 0) {
      alert("Your meal plan is empty")
      return
    }

    // Group by day
    const groupedByDay = {}

    mealPlan.forEach((item) => {
      if (!groupedByDay[item.dayText]) {
        groupedByDay[item.dayText] = []
      }

      groupedByDay[item.dayText].push(item)
    })

    // Create print window
    const printWindow = window.open("", "_blank")

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Meal Plan - Flavor Vault</title>
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
          h3 {
            font-size: 16px;
            margin-top: 15px;
            margin-bottom: 5px;
          }
          .meal {
            margin-bottom: 15px;
            padding-left: 15px;
          }
          .notes {
            font-style: italic;
            color: #666;
            margin-top: 5px;
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
        <h1>Weekly Meal Plan</h1>
    `)

    // Add days and meals
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    days.forEach((day) => {
      const dayMeals = groupedByDay[day] || []

      printWindow.document.write(`
        <h2>${day}</h2>
      `)

      if (dayMeals.length === 0) {
        printWindow.document.write(`
          <p>No meals planned</p>
        `)
      } else {
        // Sort by meal type
        const mealOrder = { Breakfast: 1, Lunch: 2, Dinner: 3 }
        dayMeals.sort((a, b) => mealOrder[a.mealTypeText] - mealOrder[b.mealTypeText])

        dayMeals.forEach((meal) => {
          printWindow.document.write(`
            <h3>${meal.mealTypeText}</h3>
            <div class="meal">
              <p>${meal.recipeName}</p>
              ${meal.notes ? `<p class="notes">Notes: ${meal.notes}</p>` : ""}
            </div>
          `)
        })
      }
    })

    printWindow.document.write(`
        <div class="footer">
          <p>Meal Plan from Flavor Vault - Printed on ${new Date().toLocaleDateString()}</p>
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
   * Generate shopping list
   */
  generateShoppingList() {
    // Get meal plan ingredients
    const ingredients = this.getMealPlanIngredients()

    if (ingredients.length === 0) {
      alert("No ingredients found in your meal plan")
      return
    }

    // Convert to shopping list format
    const shoppingList = ingredients.map((ingredient) => ({
      id: `meal-plan-${ingredient.name.replace(/\s+/g, "-")}-${Date.now()}`,
      name: ingredient.name,
      amount: ingredient.amount || "",
      category: ingredient.category || "Other",
      checked: false,
    }))

    // Get existing shopping list
    const existingList = JSON.parse(localStorage.getItem("shopping-list") || "[]")

    // Combine lists (avoiding duplicates)
    const combinedList = [...existingList]

    shoppingList.forEach((item) => {
      // Check if item already exists
      const existingIndex = combinedList.findIndex(
        (existing) => existing.name.toLowerCase() === item.name.toLowerCase(),
      )

      if (existingIndex === -1) {
        // Add new item
        combinedList.push(item)
      }
    })

    // Save to localStorage
    localStorage.setItem("shopping-list", JSON.stringify(combinedList))

    // Show success message
    alert("Shopping list generated from meal plan")

    // Update UI
    this.updateMealPlanShoppingList()
  },

  /**
   * Update meal plan shopping list
   */
  updateMealPlanShoppingList() {
    const shoppingListContainer = document.getElementById("meal-plan-shopping-list")

    if (!shoppingListContainer) return

    // Get meal plan
    const mealPlan = JSON.parse(localStorage.getItem("meal-plan") || "[]")

    if (mealPlan.length === 0) {
      // Show empty message
      shoppingListContainer.innerHTML = `
        <div class="text-center py-8 text-light-textLight dark:text-dark-textLight">
          <i class="fas fa-shopping-basket text-5xl mb-4"></i>
          <p class="text-lg">Your meal plan shopping list is empty</p>
          <p class="mb-4">Add recipes to your meal plan to generate a shopping list</p>
        </div>
      `
      return
    }

    // Get recipe ingredients
    const ingredients = this.getMealPlanIngredients()

    if (ingredients.length === 0) {
      // Show empty message
      shoppingListContainer.innerHTML = `
        <div class="text-center py-8 text-light-textLight dark:text-dark-textLight">
          <i class="fas fa-shopping-basket text-5xl mb-4"></i>
          <p class="text-lg">No ingredients found</p>
          <p class="mb-4">Click "Generate Shopping List" to fetch ingredients</p>
        </div>
      `
      return
    }

    // Group ingredients by category
    const groupedIngredients = this.groupIngredientsByCategory(ingredients)

    // Render shopping list
    let html = ""

    Object.keys(groupedIngredients).forEach((category) => {
      html += `
        <div class="mb-4">
          <h4 class="font-heading font-bold text-lg mb-2 dark:text-dark-text">${category}</h4>
          <ul class="space-y-2">
      `

      groupedIngredients[category].forEach((ingredient) => {
        html += `
          <li class="flex items-center">
            <input type="checkbox" class="mr-2">
            <span class="flex-1 dark:text-dark-text">${ingredient.amount ? ingredient.amount + " " : ""}${ingredient.name}</span>
          </li>
        `
      })

      html += `
          </ul>
        </div>
      `
    })

    shoppingListContainer.innerHTML = html
  },

  /**
   * Get meal plan ingredients
   * @returns {Array} - Array of ingredients
   */
  getMealPlanIngredients() {
    // Get meal plan
    const mealPlan = JSON.parse(localStorage.getItem("meal-plan") || "[]")

    // Get favorites and user recipes
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    const userRecipes = JSON.parse(localStorage.getItem("user-recipes") || "[]")

    // Combine recipes
    const allRecipes = [...favorites, ...userRecipes]

    // Get ingredients for each meal
    const ingredients = []

    mealPlan.forEach((meal) => {
      // Find recipe
      const recipe = allRecipes.find((r) => r.id === meal.recipeId)

      if (recipe && recipe.ingredients) {
        // Add ingredients
        recipe.ingredients.forEach((ingredient) => {
          ingredients.push({
            ...ingredient,
            recipeId: recipe.id,
            recipeName: recipe.name,
            category: recipe.category || "Other",
          })
        })
      }
    })

    return ingredients
  },

  /**
   * Group ingredients by category
   * @param {Array} ingredients - Array of ingredients
   * @returns {Object} - Grouped ingredients
   */
  groupIngredientsByCategory(ingredients) {
    const groupedIngredients = {}

    ingredients.forEach((ingredient) => {
      const category = ingredient.category || "Other"

      if (!groupedIngredients[category]) {
        groupedIngredients[category] = []
      }

      // Check if ingredient already exists
      const existingIndex = groupedIngredients[category].findIndex(
        (item) => item.name.toLowerCase() === ingredient.name.toLowerCase(),
      )

      if (existingIndex !== -1) {
        // Combine amounts if possible
        const existing = groupedIngredients[category][existingIndex]

        if (existing.amount && ingredient.amount) {
          // Try to combine amounts (this is a simplified approach)
          existing.amount += `, ${ingredient.amount}`
        } else if (ingredient.amount) {
          existing.amount = ingredient.amount
        }

        // Add recipe reference
        existing.recipes = existing.recipes || [existing.recipeName]
        if (!existing.recipes.includes(ingredient.recipeName)) {
          existing.recipes.push(ingredient.recipeName)
        }
      } else {
        // Add new ingredient
        groupedIngredients[category].push({
          ...ingredient,
          recipes: [ingredient.recipeName],
        })
      }
    })

    return groupedIngredients
  },

  /**
   * Open add to meal plan modal
   * @param {string} day - Day of the week
   * @param {string} mealType - Type of meal (breakfast, lunch, dinner)
   */
  openAddToMealPlanModal(day, mealType) {
    // Get modal and form elements
    const modal = document.getElementById("add-meal-plan-modal")
    const daySelect = document.getElementById("meal-day-select")
    const mealTypeSelect = document.getElementById("meal-type-select")

    if (modal && daySelect && mealTypeSelect) {
      // Set selected values
      if (day) {
        const dayOption = Array.from(daySelect.options).find(
          (option) => option.text.toLowerCase() === day.toLowerCase(),
        )

        if (dayOption) {
          daySelect.value = dayOption.value
        }
      }

      if (mealType) {
        const mealTypeOption = Array.from(mealTypeSelect.options).find(
          (option) => option.text.toLowerCase() === mealType.toLowerCase(),
        )

        if (mealTypeOption) {
          mealTypeSelect.value = mealTypeOption.value
        }
      }

      // Populate recipe select with favorites and recent recipes
      this.populateRecipeSelect()

      // Show modal
      modal.classList.remove("hidden")
    }
  },

  /**
   * Populate recipe select with favorites and recent recipes
   */
  populateRecipeSelect() {
    const recipeSelect = document.getElementById("meal-recipe-select")

    if (recipeSelect) {
      // Clear existing options
      recipeSelect.innerHTML = '<option value="">Select a recipe</option>'

      // Get favorites
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")

      // Get user recipes
      const userRecipes = JSON.parse(localStorage.getItem("user-recipes") || "[]")

      // Add favorites to select
      if (favorites.length > 0) {
        const favoritesOptgroup = document.createElement("optgroup")
        favoritesOptgroup.label = "Favorites"

        favorites.forEach((recipe) => {
          const option = document.createElement("option")
          option.value = recipe.id
          option.textContent = recipe.name
          option.setAttribute("data-image", recipe.thumbnail || "")
          favoritesOptgroup.appendChild(option)
        })

        recipeSelect.appendChild(favoritesOptgroup)
      }

      // Add user recipes to select
      if (userRecipes.length > 0) {
        const userRecipesOptgroup = document.createElement("optgroup")
        userRecipesOptgroup.label = "Your Recipes"

        userRecipes.forEach((recipe) => {
          const option = document.createElement("option")
          option.value = recipe.id
          option.textContent = recipe.name
          option.setAttribute("data-image", recipe.thumbnail || "")
          userRecipesOptgroup.appendChild(option)
        })

        recipeSelect.appendChild(userRecipesOptgroup)
      }

      // Add some sample recipes if no recipes are available
      if (favorites.length === 0 && userRecipes.length === 0) {
        const sampleRecipes = [
          { id: "sample-1", name: "Spaghetti Carbonara" },
          { id: "sample-2", name: "Chicken Stir Fry" },
          { id: "sample-3", name: "Vegetable Curry" },
          { id: "sample-4", name: "Beef Tacos" },
          { id: "sample-5", name: "Greek Salad" },
        ]

        const sampleOptgroup = document.createElement("optgroup")
        sampleOptgroup.label = "Sample Recipes"

        sampleRecipes.forEach((recipe) => {
          const option = document.createElement("option")
          option.value = recipe.id
          option.textContent = recipe.name
          sampleOptgroup.appendChild(option)
        })

        recipeSelect.appendChild(sampleOptgroup)
      }
    }
  },

  /**
   * Handle add to meal plan form submission
   */
  handleAddToMealPlan() {
    // Get form values
    const recipeSelect = document.getElementById("meal-recipe-select")
    const daySelect = document.getElementById("meal-day-select")
    const mealTypeSelect = document.getElementById("meal-type-select")
    const notesInput = document.getElementById("meal-notes")

    if (!recipeSelect || !daySelect || !mealTypeSelect) return

    const recipeId = recipeSelect.value
    const recipeName = recipeSelect.options[recipeSelect.selectedIndex].text
    const recipeImage = recipeSelect.options[recipeSelect.selectedIndex].getAttribute("data-image") || ""
    const day = daySelect.value
    const dayText = daySelect.options[daySelect.selectedIndex].text
    const mealType = mealTypeSelect.value
    const mealTypeText = mealTypeSelect.options[mealTypeSelect.selectedIndex].text
    const notes = notesInput ? notesInput.value : ""

    // Validate form
    if (!recipeId || !day || !mealType) {
      alert("Please select a recipe, day, and meal type")
      return
    }

    // Add to meal plan
    this.addToMealPlan(recipeId, recipeName, recipeImage, day, dayText, mealType, mealTypeText, notes)

    // Close modal
    const modal = document.getElementById("add-meal-plan-modal")
    if (modal) {
      modal.classList.add("hidden")
    }

    // Reset form
    const form = document.getElementById("add-meal-plan-form")
    if (form) {
      form.reset()
    }
  },

  /**
   * Add recipe to meal plan
   * @param {string} recipeId - Recipe ID
   * @param {string} recipeName - Recipe name
   * @param {string} recipeImage - Recipe image URL
   * @param {string} day - Day of the week (value)
   * @param {string} dayText - Day of the week (text)
   * @param {string} mealType - Type of meal (value)
   * @param {string} mealTypeText - Type of meal (text)
   * @param {string} notes - Additional notes
   */
  addToMealPlan(recipeId, recipeName, recipeImage, day, dayText, mealType, mealTypeText, notes) {
    // Create meal plan item
    const mealPlanItem = {
      id: `${day}-${mealType}-${Date.now()}`,
      recipeId,
      recipeName,
      recipeImage,
      day,
      dayText,
      mealType,
      mealTypeText,
      notes,
      dateAdded: new Date().toISOString(),
    }

    // Get current meal plan
    const mealPlan = JSON.parse(localStorage.getItem("meal-plan") || "[]")

    // Check if there's already a meal for this day and meal type
    const existingIndex = mealPlan.findIndex((item) => item.day === day && item.mealType === mealType)

    if (existingIndex !== -1) {
      // Replace existing meal
      mealPlan[existingIndex] = mealPlanItem
    } else {
      // Add new meal
      mealPlan.push(mealPlanItem)
    }

    // Save to localStorage
    localStorage.setItem("meal-plan", JSON.stringify(mealPlan))

    // Update UI
    this.renderMealPlan()

    // Show success message
    alert(`Added ${recipeName} to ${dayText} ${mealTypeText}`)
  },

  /**
   * Remove recipe from meal plan
   * @param {string} id - Meal plan item ID
   */
  removeFromMealPlan(id) {
    // Get current meal plan
    const mealPlan = JSON.parse(localStorage.getItem("meal-plan") || "[]")

    // Remove item
    const updatedMealPlan = mealPlan.filter((item) => item.id !== id)

    // Save to localStorage
    localStorage.setItem("meal-plan", JSON.stringify(updatedMealPlan))

    // Update UI
    this.renderMealPlan()
  },

  /**
   * Add recipe to meal plan from recipe details
   * @param {string} recipeId - Recipe ID
   * @param {string} recipeName - Recipe name
   * @param {string} recipeImage - Recipe image URL
   */
  addRecipeToMealPlan(recipeId, recipeName, recipeImage) {
    // Open add to meal plan modal
    this.openAddToMealPlanModal()

    // Pre-select recipe
    const recipeSelect = document.getElementById("meal-recipe-select")

    if (recipeSelect) {
      // Find option with matching recipe ID
      const option = Array.from(recipeSelect.options).find((opt) => opt.value === recipeId)

      if (option) {
        // Select option
        recipeSelect.value = recipeId
      } else {
        // Add option if not found
        const newOption = document.createElement("option")
        newOption.value = recipeId
        newOption.textContent = recipeName
        newOption.setAttribute("data-image", recipeImage || "")
        newOption.selected = true

        // Add to select
        recipeSelect.appendChild(newOption)
      }
    }
  },
}

export default MealPlanner

