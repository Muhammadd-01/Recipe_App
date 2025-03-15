/**
 * API functions for TheMealDB
 */
const API = {
    baseUrl: "https://www.themealdb.com/api/json/v1/1",
  
    /**
     * Fetch random recipes
     * @param {number} count - Number of recipes to fetch
     * @returns {Promise<Array>} - Array of recipe objects
     */
    async getRandomRecipes(count = 10) {
      try {
        const recipes = []
        // TheMealDB only returns one random meal at a time,
        // so we need to make multiple requests
        for (let i = 0; i < count; i++) {
          const response = await fetch(`${this.baseUrl}/random.php`)
          const data = await response.json()
          if (data.meals && data.meals.length > 0) {
            recipes.push(this.formatRecipe(data.meals[0]))
          }
        }
        return recipes
      } catch (error) {
        console.error("Error fetching random recipes:", error)
        return []
      }
    },
  
    /**
     * Search recipes by name
     * @param {string} query - Search query
     * @returns {Promise<Array>} - Array of recipe objects
     */
    async searchRecipes(query) {
      try {
        const response = await fetch(`${this.baseUrl}/search.php?s=${query}`)
        const data = await response.json()
  
        if (!data.meals) return []
  
        return data.meals.map((meal) => this.formatRecipe(meal))
      } catch (error) {
        console.error("Error searching recipes:", error)
        return []
      }
    },
  
    /**
     * Filter recipes by category
     * @param {string} category - Category name
     * @returns {Promise<Array>} - Array of recipe objects
     */
    async getRecipesByCategory(category) {
      try {
        const response = await fetch(`${this.baseUrl}/filter.php?c=${category}`)
        const data = await response.json()
  
        if (!data.meals) return []
  
        // Since the filter endpoint doesn't return full recipe details,
        // we need to fetch each recipe individually
        const recipes = await Promise.all(
          data.meals.map(async (meal) => {
            const detailsResponse = await fetch(`${this.baseUrl}/lookup.php?i=${meal.idMeal}`)
            const detailsData = await detailsResponse.json()
            if (detailsData.meals && detailsData.meals.length > 0) {
              return this.formatRecipe(detailsData.meals[0])
            }
            return null
          }),
        )
  
        return recipes.filter((recipe) => recipe !== null)
      } catch (error) {
        console.error("Error fetching recipes by category:", error)
        return []
      }
    },
  
    /**
     * Get recipe details by ID
     * @param {string} id - Recipe ID
     * @returns {Promise<Object|null>} - Recipe object or null if not found
     */
    async getRecipeById(id) {
      try {
        const response = await fetch(`${this.baseUrl}/lookup.php?i=${id}`)
        const data = await response.json()
  
        if (!data.meals || data.meals.length === 0) return null
  
        return this.formatRecipe(data.meals[0])
      } catch (error) {
        console.error("Error fetching recipe details:", error)
        return null
      }
    },
  
    /**
     * Get all categories
     * @returns {Promise<Array>} - Array of category objects
     */
    async getCategories() {
      try {
        const response = await fetch(`${this.baseUrl}/categories.php`)
        const data = await response.json()
  
        if (!data.categories) return []
  
        return data.categories.map((category) => ({
          id: category.idCategory,
          name: category.strCategory,
          thumbnail: category.strCategoryThumb,
          description: category.strCategoryDescription,
        }))
      } catch (error) {
        console.error("Error fetching categories:", error)
        return []
      }
    },
  
    /**
     * Format recipe data from API to a more usable structure
     * @param {Object} meal - Meal object from TheMealDB API
     * @returns {Object} - Formatted recipe object
     */
    formatRecipe(meal) {
      // Extract ingredients and measurements
      const ingredients = []
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`]
        const measure = meal[`strMeasure${i}`]
  
        if (ingredient && ingredient.trim() !== "") {
          ingredients.push({
            name: ingredient,
            measure: measure || "",
          })
        }
      }
  
      // Generate a random cooking time between 15 and 60 minutes
      // (TheMealDB doesn't provide cooking time)
      const cookingTime = Math.floor(Math.random() * 46) + 15
  
      // Generate a random rating between 3.5 and 5.0
      // (TheMealDB doesn't provide ratings)
      const rating = (Math.random() * 1.5 + 3.5).toFixed(1)
  
      return {
        id: meal.idMeal,
        name: meal.strMeal,
        category: meal.strCategory || "",
        area: meal.strArea || "",
        instructions: meal.strInstructions || "",
        thumbnail: meal.strMealThumb,
        tags: meal.strTags ? meal.strTags.split(",") : [],
        youtube: meal.strYoutube || "",
        ingredients,
        source: meal.strSource || "",
        cookingTime,
        rating,
      }
    },
  }
  
  export default API
  
  