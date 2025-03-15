/**
 * Enhanced search functionality with autocomplete
 */
const Search = {
    searchTimeout: null,
    minChars: 2,
    maxResults: 5,
    recentSearches: [],
  
    /**
     * Initialize search functionality
     * @param {Object} API - API object for fetching recipes
     */
    init(API) {
      this.API = API
      this.setupSearchInputs()
      this.loadRecentSearches()
    },
  
    /**
     * Set up search input event listeners
     */
    setupSearchInputs() {
      // Desktop search
      const searchInput = document.getElementById("search-input")
      const autocompleteList = document.getElementById("autocomplete-list")
  
      if (searchInput) {
        this.setupAutocomplete(searchInput, autocompleteList)
      }
  
      // Mobile search
      const mobileSearchInput = document.getElementById("mobile-search-input")
      const mobileAutocompleteList = document.getElementById("mobile-autocomplete-list")
  
      if (mobileSearchInput) {
        this.setupAutocomplete(mobileSearchInput, mobileAutocompleteList)
      }
    },
  
    /**
     * Set up autocomplete for a search input
     * @param {HTMLElement} input - Search input element
     * @param {HTMLElement} autocompleteList - Autocomplete list container
     */
    setupAutocomplete(input, autocompleteList) {
      // Input event for autocomplete
      input.addEventListener("input", () => {
        const query = input.value.trim()
  
        // Clear previous timeout
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout)
        }
  
        // Clear autocomplete list if query is too short
        if (query.length < this.minChars) {
          autocompleteList.innerHTML = ""
          return
        }
  
        // Set timeout to prevent too many API calls
        this.searchTimeout = setTimeout(() => {
          this.getAutocompleteResults(query, autocompleteList)
        }, 300)
      })
  
      // Focus event to show recent searches
      input.addEventListener("focus", () => {
        const query = input.value.trim()
  
        // If query is empty, show recent searches
        if (query.length === 0 && this.recentSearches.length > 0) {
          this.showRecentSearches(autocompleteList)
        }
      })
  
      // Click outside to close autocomplete
      document.addEventListener("click", (e) => {
        if (e.target !== input && e.target !== autocompleteList) {
          autocompleteList.innerHTML = ""
        }
      })
  
      // Enter key to submit search
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const query = input.value.trim()
          if (query.length >= this.minChars) {
            this.performSearch(query)
            autocompleteList.innerHTML = ""
            this.addToRecentSearches(query)
          }
        }
      })
    },
  
    /**
     * Get autocomplete results for a query
     * @param {string} query - Search query
     * @param {HTMLElement} autocompleteList - Autocomplete list container
     */
    async getAutocompleteResults(query, autocompleteList) {
      try {
        // First try to get matching recipes from API
        const recipes = await this.API.searchRecipes(query)
  
        // Clear previous results
        autocompleteList.innerHTML = ""
  
        if (recipes.length === 0) {
          // If no results, show a message
          const noResults = document.createElement("div")
          noResults.textContent = `No recipes found for "${query}"`
          noResults.className = "p-3 text-light-textLight dark:text-dark-textLight"
          autocompleteList.appendChild(noResults)
          return
        }
  
        // Show limited number of results
        const limitedResults = recipes.slice(0, this.maxResults)
  
        limitedResults.forEach((recipe) => {
          const item = document.createElement("div")
          item.className = "flex items-center p-3 hover:bg-gray-100 dark:hover:bg-dark-bg cursor-pointer"
  
          // Create thumbnail
          const thumbnail = document.createElement("img")
          thumbnail.src = recipe.thumbnail
          thumbnail.alt = recipe.name
          thumbnail.className = "w-10 h-10 rounded-full object-cover mr-3"
  
          // Create text content
          const textContent = document.createElement("div")
          textContent.className = "flex-1"
  
          const recipeName = document.createElement("div")
          recipeName.textContent = recipe.name
          recipeName.className = "font-medium dark:text-dark-text"
  
          const recipeCategory = document.createElement("div")
          recipeCategory.textContent = recipe.category
          recipeCategory.className = "text-xs text-light-textLight dark:text-dark-textLight"
  
          textContent.appendChild(recipeName)
          textContent.appendChild(recipeCategory)
  
          item.appendChild(thumbnail)
          item.appendChild(textContent)
  
          // Add click event
          item.addEventListener("click", () => {
            this.performSearch(recipe.name)
            autocompleteList.innerHTML = ""
            this.addToRecentSearches(recipe.name)
          })
  
          autocompleteList.appendChild(item)
        })
  
        // Add "View all results" option
        if (recipes.length > this.maxResults) {
          const viewAll = document.createElement("div")
          viewAll.className =
            "p-3 text-center text-primary font-medium hover:bg-gray-100 dark:hover:bg-dark-bg cursor-pointer"
          viewAll.textContent = `View all ${recipes.length} results for "${query}"`
  
          viewAll.addEventListener("click", () => {
            this.performSearch(query)
            autocompleteList.innerHTML = ""
            this.addToRecentSearches(query)
          })
  
          autocompleteList.appendChild(viewAll)
        }
      } catch (error) {
        console.error("Error getting autocomplete results:", error)
      }
    },
  
    /**
     * Show recent searches in autocomplete
     * @param {HTMLElement} autocompleteList - Autocomplete list container
     */
    showRecentSearches(autocompleteList) {
      // Clear previous results
      autocompleteList.innerHTML = ""
  
      if (this.recentSearches.length === 0) {
        return
      }
  
      // Add header
      const header = document.createElement("div")
      header.className =
        "p-2 text-xs font-medium text-light-textLight dark:text-dark-textLight bg-gray-50 dark:bg-dark-bg"
      header.textContent = "Recent Searches"
      autocompleteList.appendChild(header)
  
      // Add recent searches
      this.recentSearches.slice(0, 5).forEach((search) => {
        const item = document.createElement("div")
        item.className = "flex items-center p-3 hover:bg-gray-100 dark:hover:bg-dark-bg cursor-pointer"
  
        // Create icon
        const icon = document.createElement("i")
        icon.className = "fas fa-history text-light-textLight dark:text-dark-textLight mr-3"
  
        // Create text content
        const textContent = document.createElement("div")
        textContent.textContent = search
        textContent.className = "flex-1 dark:text-dark-text"
  
        item.appendChild(icon)
        item.appendChild(textContent)
  
        // Add click event
        item.addEventListener("click", () => {
          this.performSearch(search)
          autocompleteList.innerHTML = ""
        })
  
        autocompleteList.appendChild(item)
      })
  
      // Add clear recent searches option
      if (this.recentSearches.length > 0) {
        const clearAll = document.createElement("div")
        clearAll.className = "p-2 text-center text-primary text-sm hover:bg-gray-100 dark:hover:bg-dark-bg cursor-pointer"
        clearAll.textContent = "Clear Recent Searches"
  
        clearAll.addEventListener("click", (e) => {
          e.stopPropagation()
          this.clearRecentSearches()
          autocompleteList.innerHTML = ""
        })
  
        autocompleteList.appendChild(clearAll)
      }
    },
  
    /**
     * Perform search and update UI
     * @param {string} query - Search query
     */
    performSearch(query) {
      // Update search inputs
      const searchInput = document.getElementById("search-input")
      const mobileSearchInput = document.getElementById("mobile-search-input")
  
      if (searchInput) {
        searchInput.value = query
      }
  
      if (mobileSearchInput) {
        mobileSearchInput.value = query
      }
  
      // Trigger search in App
      if (window.App && typeof window.App.handleSearch === "function") {
        window.App.handleSearch(query)
      }
    },
  
    /**
     * Add a query to recent searches
     * @param {string} query - Search query
     */
    addToRecentSearches(query) {
      // Remove if already exists
      this.recentSearches = this.recentSearches.filter((search) => search !== query)
  
      // Add to beginning of array
      this.recentSearches.unshift(query)
  
      // Limit to 10 recent searches
      if (this.recentSearches.length > 10) {
        this.recentSearches.pop()
      }
  
      // Save to localStorage
      localStorage.setItem("recipe-app-recent-searches", JSON.stringify(this.recentSearches))
    },
  
    /**
     * Load recent searches from localStorage
     */
    loadRecentSearches() {
      const saved = localStorage.getItem("recipe-app-recent-searches")
      if (saved) {
        try {
          this.recentSearches = JSON.parse(saved)
        } catch (error) {
          console.error("Error loading recent searches:", error)
          this.recentSearches = []
        }
      }
    },
  
    /**
     * Clear recent searches
     */
    clearRecentSearches() {
      this.recentSearches = []
      localStorage.removeItem("recipe-app-recent-searches")
    },
  }
  
  export default Search
  
  