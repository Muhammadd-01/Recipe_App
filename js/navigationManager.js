/**
 * Navigation Manager
 * Handles all navigation-related functionality
 */
const NavigationManager = {
    /**
     * Initialize navigation manager
     */
    init() {
      console.log("Initializing Navigation Manager")
  
      // Set up view navigation
      this.setupViewNavigation()
  
      // Set up mobile menu
      this.setupMobileMenu()
  
      // Set up back button
      this.setupBackButton()
  
      // Set up back to top button
      this.setupBackToTopButton()
  
      // Make NavigationManager available globally
      window.NavigationManager = this
    },
  
    /**
     * Set up view navigation
     */
    setupViewNavigation() {
      console.log("Setting up view navigation")
  
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
          this.closeMobileMenu()
        })
      })
  
      // Add direct event listener for meal planner navigation
      document.addEventListener("click", (e) => {
        if (e.target.matches('[data-view="meal-planner"]') || e.target.closest('[data-view="meal-planner"]')) {
          e.preventDefault()
          this.showView("meal-planner")
          this.updateActiveNavLink("meal-planner")
          this.closeMobileMenu()
        }
      })
    },
  
    /**
     * Set up mobile menu
     */
    setupMobileMenu() {
      console.log("Setting up mobile menu")
  
      // Get mobile menu button and mobile menu
      const mobileMenuButton = document.getElementById("mobile-menu-button")
      const mobileMenu = document.getElementById("mobile-menu")
  
      if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener("click", () => {
          this.toggleMobileMenu()
        })
      }
    },
  
    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
      const mobileMenu = document.getElementById("mobile-menu")
      const mobileMenuButton = document.getElementById("mobile-menu-button")
  
      if (mobileMenu && mobileMenuButton) {
        mobileMenu.classList.toggle("hidden")
  
        // Update mobile menu button icon
        if (mobileMenu.classList.contains("hidden")) {
          mobileMenuButton.innerHTML = '<i class="fas fa-bars text-2xl"></i>'
        } else {
          mobileMenuButton.innerHTML = '<i class="fas fa-times text-2xl"></i>'
        }
      }
    },
  
    /**
     * Close mobile menu
     */
    closeMobileMenu() {
      const mobileMenu = document.getElementById("mobile-menu")
      const mobileMenuButton = document.getElementById("mobile-menu-button")
  
      if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden")
  
        // Update mobile menu button icon
        if (mobileMenuButton) {
          mobileMenuButton.innerHTML = '<i class="fas fa-bars text-2xl"></i>'
        }
      }
    },
  
    /**
     * Set up back button
     */
    setupBackButton() {
      console.log("Setting up back button")
  
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
     * Set up back to top button
     */
    setupBackToTopButton() {
      console.log("Setting up back to top button")
  
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
     * Show view by name
     * @param {string} viewName - Name of the view to show
     */
    showView(viewName) {
      console.log(`Showing view: ${viewName}`)
  
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
  
        // Scroll to top
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      } else {
        console.warn(`View not found: ${viewName}-view`)
      }
    },
  
    /**
     * Update active nav link
     * @param {string} viewName - Name of the active view
     */
    updateActiveNavLink(viewName) {
      console.log(`Updating active nav link: ${viewName}`)
  
      // Get all nav links
      const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link")
  
      // Remove active class from all nav links
      navLinks.forEach((link) => {
        link.classList.remove("active")
      })
  
      // Add active class to selected nav links
      const selectedNavLinks = document.querySelectorAll(
        `.nav-link[data-view="${viewName}"], .mobile-nav-link[data-view="${viewName}"]`,
      )
  
      selectedNavLinks.forEach((link) => {
        link.classList.add("active")
      })
    },
  }
  
  export default NavigationManager
  
  