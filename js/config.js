/**
 * Configuration file for the Flavor Vault application
 */
const Config = {
    // API configuration
    api: {
      // TheMealDB API base URL and key
      // Free API key from TheMealDB (limited to 100 calls per day)
      // For more calls, get a premium key from https://www.themealdb.com/api.php
      mealDbBaseUrl: "https://www.themealdb.com/api/json/v1/1",
      mealDbApiKey: "1", // Default free API key
  
      // Spoonacular API (alternative API for more features)
      // Get your API key from https://spoonacular.com/food-api
      spoonacularBaseUrl: "https://api.spoonacular.com",
      spoonacularApiKey: "", // Add your API key here
  
      // Edamam API (another alternative with nutrition data)
      // Get your API key from https://developer.edamam.com/
      edamamBaseUrl: "https://api.edamam.com",
      edamamAppId: "", // Add your App ID here
      edamamAppKey: "", // Add your App Key here
    },
  
    // Application settings
    app: {
      // Number of recipes to load per page
      recipesPerPage: 8,
  
      // Default category
      defaultCategory: "all",
  
      // Featured categories to show on homepage
      featuredCategories: ["Breakfast", "Vegetarian", "Dessert", "Chicken", "Pasta", "Seafood"],
  
      // Default theme (light or dark)
      defaultTheme: "light",
  
      // Enable analytics
      enableAnalytics: false,
  
      // Enable notifications
      enableNotifications: true,
    },
  
    // User preferences (will be overridden by localStorage)
    userPreferences: {
      theme: "light",
      favoriteCategories: [],
      dietaryRestrictions: [],
      cookingLevel: "intermediate", // beginner, intermediate, advanced
    },
  }
  
  export default Config
  