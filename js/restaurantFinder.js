/**
 * Restaurant Finder functionality
 */
const RestaurantFinder = {
    /**
     * Initialize restaurant finder
     */
    init() {
      this.setupEventListeners()
    },
  
    /**
     * Set up event listeners
     */
    setupEventListeners() {
      // Find restaurants button
      document.addEventListener("click", (e) => {
        if (e.target.classList.contains("find-restaurants-btn") || e.target.closest(".find-restaurants-btn")) {
          const button = e.target.classList.contains("find-restaurants-btn")
            ? e.target
            : e.target.closest(".find-restaurants-btn")
  
          const dishName = button.getAttribute("data-dish-name")
  
          if (dishName) {
            this.showRestaurantFinderModal(dishName)
          }
        }
      })
  
      // Close modal when clicking outside
      document.addEventListener("click", (e) => {
        const modal = document.getElementById("restaurant-finder-modal")
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
     * Show restaurant finder modal
     * @param {string} dishName - Name of the dish
     */
    showRestaurantFinderModal(dishName) {
      // Create modal if it doesn't exist
      let modal = document.getElementById("restaurant-finder-modal")
  
      if (!modal) {
        modal = document.createElement("div")
        modal.id = "restaurant-finder-modal"
        modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        document.body.appendChild(modal)
      }
  
      // Create modal content
      modal.innerHTML = `
              <div class="bg-white dark:bg-dark-card rounded-xl max-w-md w-full p-6 animate-fade-in">
                  <div class="flex justify-between items-center mb-4">
                      <h3 class="font-heading text-xl font-bold dark:text-dark-text">Find Restaurants</h3>
                      <button id="close-modal-btn" class="text-light-textLight dark:text-dark-textLight hover:text-primary">
                          <i class="fas fa-times text-xl"></i>
                      </button>
                  </div>
                  
                  <p class="mb-4 text-light-textLight dark:text-dark-textLight">
                      Find restaurants serving ${dishName} near you.
                  </p>
                  
                  <div class="mb-6">
                      <label class="block mb-2 font-medium dark:text-dark-text">Your Location</label>
                      <input type="text" id="location-input" placeholder="Enter city or zip code (optional)" 
                          class="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
                  </div>
                  
                  <div class="flex justify-between">
                      <button id="use-current-location-btn" class="flex items-center text-primary hover:underline">
                          <i class="fas fa-map-marker-alt mr-2"></i> Use Current Location
                      </button>
                      <button id="find-restaurants-confirm-btn" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition duration-300">
                          Find Restaurants
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
  
      document.getElementById("use-current-location-btn").addEventListener("click", () => {
        this.getCurrentLocation()
      })
  
      document.getElementById("find-restaurants-confirm-btn").addEventListener("click", () => {
        const location = document.getElementById("location-input").value.trim()
        this.findRestaurants(dishName, location)
      })
    },
  
    /**
     * Close the modal
     */
    closeModal() {
      const modal = document.getElementById("restaurant-finder-modal")
      if (modal) {
        modal.style.display = "none"
      }
    },
  
    /**
     * Get current location
     */
    getCurrentLocation() {
      if (navigator.geolocation) {
        const locationInput = document.getElementById("location-input")
        locationInput.value = "Getting your location..."
        locationInput.disabled = true
  
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Use reverse geocoding to get location name
            const lat = position.coords.latitude
            const lng = position.coords.longitude
  
            // For simplicity, we'll just use coordinates
            locationInput.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`
            locationInput.disabled = false
          },
          (error) => {
            console.error("Error getting location:", error)
            locationInput.value = ""
            locationInput.disabled = false
            alert("Unable to get your location. Please enter it manually.")
          },
        )
      } else {
        alert("Geolocation is not supported by your browser. Please enter your location manually.")
      }
    },
  
    /**
     * Find restaurants serving a dish
     * @param {string} dishName - Name of the dish
     * @param {string} location - Location to search in
     */
    findRestaurants(dishName, location) {
      // Get restaurant map URL from API
      const mapUrl = window.API.getRestaurantMapUrl(dishName, location)
  
      // Open in new tab
      window.open(mapUrl, "_blank")
  
      // Close modal
      this.closeModal()
    },
  }
  
  export default RestaurantFinder
  
  