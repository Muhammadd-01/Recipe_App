/**
 * Meal Planner functionality
 */
const MealPlanner = {
    storageKey: "recipe-app-meal-plan",
  
    /**
     * Initialize meal planner
     */
    init() {
      this.setupEventListeners()
      this.loadMealPlan()
    },
  
    /**
     * Set up event listeners
     */
    setupEventListeners() {
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
     * Get meal plan from localStorage
     * @returns {Object} - Meal plan object
     */
    getMealPlan() {
      const mealPlan = localStorage.getItem(this.storageKey)
      return mealPlan ? JSON.parse(mealPlan) : {}
    },
  
    /**
     * Load meal plan and render it
     */
    loadMealPlan() {
      const mealPlanContainer = document.getElementById("meal-plan-container")
      if (mealPlanContainer) {
        this.renderMealPlan(mealPlanContainer)
      }
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
     * Render a meal cell for the meal plan table
     * @param {Object} meal - Meal object
     * @param {string} day - Day value
     * @param {string} mealType - Meal type
     * @returns {string} - HTML for meal cell
     */
    renderMealCell(meal, day, mealType) {
      if (!meal) {
        return `<td class="py-3 px-4 text-light-textLight dark:text-dark-textLight italic">Not planned</td>`
      }
  
      return `
              <td class="py-3 px-4">
                  <div class="flex items-center">
                      <img src="${meal.image || "/placeholder.svg?height=40&width=40"}" alt="${meal.name}" 
                          class="w-10 h-10 rounded-md object-cover mr-3">
                      <div class="flex-1">
                          <div class="font-medium dark:text-dark-text">${meal.name}</div>
                          <button class="remove-meal-btn text-xs text-primary hover:underline" 
                              data-day="${day}" data-meal-type="${mealType}">
                              Remove
                          </button>
                      </div>
                  </div>
              </td>
          `
    },
  
    /**
     * Print meal plan
     */
    printMealPlan() {
      const mealPlan = this.getMealPlan()
      const days = this.getNextSevenDays()
  
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
                      table {
                          width: 100%;
                          border-collapse: collapse;
                          margin-bottom: 30px;
                      }
                      th, td {
                          border: 1px solid #ddd;
                          padding: 10px;
                          text-align: left;
                      }
                      th {
                          background-color: #f5f5f5;
                          font-weight: bold;
                      }
                      .meal-name {
                          font-weight: bold;
                      }
                      .empty-meal {
                          font-style: italic;
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
                  <h1>Your Meal Plan</h1>
                  <table>
                      <thead>
                          <tr>
                              <th>Day</th>
                              <th>Breakfast</th>
                              <th>Lunch</th>
                              <th>Dinner</th>
                              <th>Snack</th>
                          </tr>
                      </thead>
                      <tbody>
          `)
  
      days.forEach((day) => {
        const dayData = mealPlan[day.value] || {}
  
        printWindow.document.write(`
                  <tr>
                      <td>${day.label}</td>
                      <td>${dayData.breakfast ? `<div class="meal-name">${dayData.breakfast.name}</div>` : '<div class="empty-meal">Not planned</div>'}</td>
                      <td>${dayData.lunch ? `<div class="meal-name">${dayData.lunch.name}</div>` : '<div class="empty-meal">Not planned</div>'}</td>
                      <td>${dayData.dinner ? `<div class="meal-name">${dayData.dinner.name}</div>` : '<div class="empty-meal">Not planned</div>'}</td>
                      <td>${dayData.snack ? `<div class="meal-name">${dayData.snack.name}</div>` : '<div class="empty-meal">Not planned</div>'}</td>
                  </tr>
              `)
      })
  
      printWindow.document.write(`
                      </tbody>
                  </table>
                  
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
     * Clear meal plan
     */
    clearMealPlan() {
      localStorage.removeItem(this.storageKey)
      this.updateMealPlanDisplay()
      this.showNotification("Meal plan cleared!")
    },
  }
  
  export default MealPlanner
  
  