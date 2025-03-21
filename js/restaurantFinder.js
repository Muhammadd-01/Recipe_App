/**
 * Enhanced Restaurant Finder functionality with better API integration
 */
const RestaurantFinder = {
  // API keys for restaurant data
  // Note: In a production app, these would be stored securely on the server
  googleMapsApiKey: "", // Add your Google Maps API key here
  yelpApiKey: "", // Add your Yelp API key here

  /**
   * Initialize restaurant finder
   */
  init() {
    this.setupEventListeners()
    this.loadGoogleMapsScript()
  },

  /**
   * Load Google Maps API script
   */
  loadGoogleMapsScript() {
    if (this.googleMapsApiKey && !window.google) {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.googleMapsApiKey}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        // Google Maps API is loaded, you can now use the google object
        console.log("Google Maps API loaded")
      }
      document.head.appendChild(script)
    }
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
   * Show restaurant finder modal with enhanced UI
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
            <div class="bg-white dark:bg-dark-card rounded-xl max-w-lg w-full p-6 animate-fade-in">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-heading text-xl font-bold dark:text-dark-text">Find Restaurants</h3>
                    <button id="close-modal-btn" class="text-light-textLight dark:text-dark-textLight hover:text-primary transition duration-300">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <div class="mb-6">
                    <div class="flex items-center mb-4">
                        <i class="fas fa-utensils text-primary text-2xl mr-3"></i>
                        <div>
                            <h4 class="font-medium dark:text-dark-text">Looking for "${dishName}"</h4>
                            <p class="text-sm text-light-textLight dark:text-dark-textLight">
                                Find restaurants serving this dish near you
                            </p>
                        </div>
                    </div>
                    
                    <div class="bg-light-bg dark:bg-dark-bg rounded-lg p-4 mb-4">
                        <div class="mb-4">
                            <label class="block mb-2 font-medium dark:text-dark-text">Your Location</label>
                            <div class="flex">
                                <input type="text" id="location-input" placeholder="Enter city, address, or zip code" 
                                    class="flex-1 px-4 py-2 rounded-l-md border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary">
                                <button id="use-current-location-btn" class="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-opacity-90 transition duration-300">
                                    <i class="fas fa-map-marker-alt mr-2"></i> Current
                                </button>
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <label class="block mb-2 font-medium dark:text-dark-text">Search Radius</label>
                            <select id="search-radius" class="w-full px-4 py-2 rounded-md border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-light-text dark:text-dark-text">
                                <option value="1">1 mile</option>
                                <option value="5" selected>5 miles</option>
                                <option value="10">10 miles</option>
                                <option value="25">25 miles</option>
                                <option value="50">50 miles</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block mb-2 font-medium dark:text-dark-text">Price Range</label>
                            <div class="flex gap-2">
                                <label class="flex-1 flex items-center justify-center p-2 border border-light-border dark:border-dark-border rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-opacity-10">
                                    <input type="checkbox" class="price-checkbox sr-only" value="1" checked>
                                    <span class="price-label">$</span>
                                </label>
                                <label class="flex-1 flex items-center justify-center p-2 border border-light-border dark:border-dark-border rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-opacity-10">
                                    <input type="checkbox" class="price-checkbox sr-only" value="2" checked>
                                    <span class="price-label">$$</span>
                                </label>
                                <label class="flex-1 flex items-center justify-center p-2 border border-light-border dark:border-dark-border rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-opacity-10">
                                    <input type="checkbox" class="price-checkbox sr-only" value="3" checked>
                                    <span class="price-label">$$$</span>
                                </label>
                                <label class="flex-1 flex items-center justify-center p-2 border border-light-border dark:border-dark-border rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-opacity-10">
                                    <input type="checkbox" class="price-checkbox sr-only" value="4">
                                    <span class="price-label">$$$$</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="restaurant-results" class="hidden mb-6 max-h-60 overflow-y-auto">
                    <h4 class="font-medium mb-2 dark:text-dark-text">Results</h4>
                    <div id="restaurant-list" class="space-y-3">
                        <!-- Results will be populated here -->
                    </div>
                </div>
                
                <div id="restaurant-loading" class="hidden text-center py-4">
                    <div class="spinner inline-block"></div>
                    <p class="mt-2 text-light-textLight dark:text-dark-textLight">Searching for restaurants...</p>
                </div>
                
                <div id="restaurant-error" class="hidden text-center py-4 text-red-500">
                    <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
                    <p>Unable to find restaurants. Please try again.</p>
                </div>
                
                <div class="flex justify-between">
                    <button id="view-on-map-btn" class="px-4 py-2 border border-light-border dark:border-dark-border rounded-md hover:bg-gray-100 dark:hover:bg-opacity-10 transition duration-300">
                        <i class="fas fa-map-marked-alt mr-2"></i> View on Map
                    </button>
                    <button id="find-restaurants-confirm-btn" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition duration-300">
                        <i class="fas fa-search mr-2"></i> Find Restaurants
                    </button>
                </div>
            </div>
        `

    // Show modal
    modal.style.display = "flex"

    // Set up price checkbox styling
    const priceCheckboxes = modal.querySelectorAll(".price-checkbox")
    priceCheckboxes.forEach((checkbox) => {
      const label = checkbox.nextElementSibling
      if (checkbox.checked) {
        label.classList.add("text-primary", "font-bold")
        checkbox.parentElement.classList.add("border-primary", "bg-primary", "bg-opacity-10")
      }

      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          label.classList.add("text-primary", "font-bold")
          checkbox.parentElement.classList.add("border-primary", "bg-primary", "bg-opacity-10")
        } else {
          label.classList.remove("text-primary", "font-bold")
          checkbox.parentElement.classList.remove("border-primary", "bg-primary", "bg-opacity-10")
        }
      })
    })

    // Add event listeners
    document.getElementById("close-modal-btn").addEventListener("click", () => {
      this.closeModal()
    })

    document.getElementById("use-current-location-btn").addEventListener("click", () => {
      this.getCurrentLocation()
    })

    document.getElementById("view-on-map-btn").addEventListener("click", () => {
      const location = document.getElementById("location-input").value.trim()
      this.viewOnMap(dishName, location)
    })

    document.getElementById("find-restaurants-confirm-btn").addEventListener("click", () => {
      const location = document.getElementById("location-input").value.trim()
      const radius = document.getElementById("search-radius").value
      const priceRanges = Array.from(priceCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value)

      this.findRestaurants(dishName, location, radius, priceRanges)
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
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          // Use reverse geocoding to get location name
          this.reverseGeocode(lat, lng, (address) => {
            locationInput.value = address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
            locationInput.disabled = false
          })
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
   * Reverse geocode coordinates to address
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {Function} callback - Callback function with address
   */
  reverseGeocode(lat, lng, callback) {
    if (window.google && window.google.maps) {
      const geocoder = new google.maps.Geocoder()
      const latlng = { lat, lng }

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results[0]) {
          callback(results[0].formatted_address)
        } else {
          callback(null)
        }
      })
    } else {
      // Fallback if Google Maps API is not loaded
      callback(null)
    }
  },

  /**
   * Find restaurants serving a dish
   * @param {string} dishName - Name of the dish
   * @param {string} location - Location to search in
   * @param {string} radius - Search radius in miles
   * @param {Array} priceRanges - Array of price range values
   */
  findRestaurants(dishName, location, radius, priceRanges) {
    if (!location) {
      alert("Please enter a location or use your current location.")
      return
    }

    // Show loading
    document.getElementById("restaurant-results").classList.add("hidden")
    document.getElementById("restaurant-error").classList.add("hidden")
    document.getElementById("restaurant-loading").classList.remove("hidden")

    // In a real app, we would make an API call to a restaurant API like Yelp or Google Places
    // For this demo, we'll simulate a response after a delay
    setTimeout(() => {
      // Hide loading
      document.getElementById("restaurant-loading").classList.add("hidden")

      // Show results
      this.displayRestaurantResults(dishName, location, radius, priceRanges)
    }, 1500)
  },

  /**
   * Display restaurant results
   * @param {string} dishName - Name of the dish
   * @param {string} location - Location to search in
   * @param {string} radius - Search radius in miles
   * @param {Array} priceRanges - Array of price range values
   */
  displayRestaurantResults(dishName, location, radius, priceRanges) {
    const resultsContainer = document.getElementById("restaurant-results")
    const restaurantList = document.getElementById("restaurant-list")

    // Generate some mock results
    const mockRestaurants = [
      {
        name: `${dishName} House`,
        rating: 4.7,
        price: "$$$",
        distance: "0.8 miles",
        address: "123 Main St, Anytown",
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        name: `Authentic ${dishName} Kitchen`,
        rating: 4.5,
        price: "$$",
        distance: "1.2 miles",
        address: "456 Oak Ave, Anytown",
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        name: `${dishName} & More`,
        rating: 4.2,
        price: "$$",
        distance: "2.3 miles",
        address: "789 Pine St, Anytown",
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        name: `The ${dishName} Experience`,
        rating: 4.8,
        price: "$$$$",
        distance: "3.1 miles",
        address: "101 Cedar Blvd, Anytown",
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        name: `${dishName} Fusion`,
        rating: 4.3,
        price: "$$$",
        distance: "4.5 miles",
        address: "202 Maple Dr, Anytown",
        image: "/placeholder.svg?height=60&width=60",
      },
    ]

    // Filter by price range
    const filteredRestaurants = mockRestaurants.filter((restaurant) => {
      const price = restaurant.price.length
      return priceRanges.includes(price.toString())
    })

    if (filteredRestaurants.length === 0) {
      document.getElementById("restaurant-error").classList.remove("hidden")
      return
    }

    // Clear previous results
    restaurantList.innerHTML = ""

    // Add restaurant items
    filteredRestaurants.forEach((restaurant) => {
      const item = document.createElement("div")
      item.className =
        "flex items-center p-3 bg-light-bg dark:bg-dark-bg rounded-lg hover:bg-gray-100 dark:hover:bg-opacity-10 transition duration-300"

      item.innerHTML = `
                <img src="${restaurant.image}" alt="${restaurant.name}" class="w-12 h-12 rounded-md object-cover mr-3">
                <div class="flex-1">
                    <div class="flex justify-between">
                        <h5 class="font-medium dark:text-dark-text">${restaurant.name}</h5>
                        <span class="text-sm text-light-textLight dark:text-dark-textLight">${restaurant.distance}</span>
                    </div>
                    <div class="flex items-center text-sm">
                        <div class="text-highlight mr-2">
                            <span>${restaurant.rating}</span>
                            <i class="fas fa-star text-xs"></i>
                        </div>
                        <span class="mr-2">${restaurant.price}</span>
                        <span class="text-light-textLight dark:text-dark-textLight truncate">${restaurant.address}</span>
                    </div>
                </div>
                <a href="https://maps.google.com/maps?q=${encodeURIComponent(restaurant.name + " " + restaurant.address)}" target="_blank" class="ml-2 text-primary hover:text-opacity-80 transition duration-300">
                    <i class="fas fa-directions"></i>
                </a>
            `

      restaurantList.appendChild(item)
    })

    // Show results
    resultsContainer.classList.remove("hidden")
  },

  /**
   * View restaurants on map
   * @param {string} dishName - Name of the dish
   * @param {string} location - Location to search in
   */
  viewOnMap(dishName, location) {
    if (!location) {
      alert("Please enter a location or use your current location.")
      return
    }

    // Get restaurant map URL from API
    const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(dishName + " restaurants near " + location)}`

    // Open in new tab
    window.open(mapUrl, "_blank")
  },
}

export default RestaurantFinder

