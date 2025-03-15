/**
 * Favorites functionality using localStorage
 */
const Favorites = {
    storageKey: "recipe-app-favorites",
  
    /**
     * Get all favorite recipes from localStorage
     * @returns {Array} - Array of favorite recipe objects
     */
    getFavorites() {
      const favorites = localStorage.getItem(this.storageKey)
      return favorites ? JSON.parse(favorites) : []
    },
  
    /**
     * Check if a recipe is in favorites
     * @param {string} recipeId - Recipe ID
     * @returns {boolean} - True if recipe is in favorites
     */
    isFavorite(recipeId) {
      const favorites = this.getFavorites()
      return favorites.some((recipe) => recipe.id === recipeId)
    },
  
    /**
     * Add a recipe to favorites
     * @param {Object} recipe - Recipe object
     */
    addFavorite(recipe) {
      const favorites = this.getFavorites()
  
      // Only add if not already in favorites
      if (!this.isFavorite(recipe.id)) {
        favorites.push(recipe)
        localStorage.setItem(this.storageKey, JSON.stringify(favorites))
      }
    },
  
    /**
     * Remove a recipe from favorites
     * @param {string} recipeId - Recipe ID
     */
    removeFavorite(recipeId) {
      const favorites = this.getFavorites()
      const updatedFavorites = favorites.filter((recipe) => recipe.id !== recipeId)
      localStorage.setItem(this.storageKey, JSON.stringify(updatedFavorites))
    },
  
    /**
     * Clear all favorites
     */
    clearFavorites() {
      localStorage.removeItem(this.storageKey)
    },
  }
  
  export default Favorites
  
  