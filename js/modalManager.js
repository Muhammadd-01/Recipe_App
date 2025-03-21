/**
 * Modal Manager
 * Handles all modal-related functionality
 */
const ModalManager = {
    /**
     * Initialize modal manager
     */
    init() {
      console.log("Initializing Modal Manager")
  
      // Set up modal triggers
      this.setupModalTriggers()
  
      // Set up modal close buttons
      this.setupModalCloseButtons()
  
      // Set up modal switches
      this.setupModalSwitches()
  
      // Make ModalManager available globally
      window.ModalManager = this
    },
  
    /**
     * Set up modal triggers
     */
    setupModalTriggers() {
      console.log("Setting up modal triggers")
  
      // Define modal triggers
      const modalTriggers = [
        { triggerId: "show-account-modal-btn", modalId: "login-modal" },
        { triggerId: "user-account-btn", modalId: "login-modal" },
        { triggerId: "mobile-user-account-btn", modalId: "login-modal" },
        { triggerId: "show-shopping-list-modal-btn", modalId: "shopping-list-modal" },
        { triggerId: "show-submit-recipe-modal-btn", modalId: "submit-recipe-modal" },
        { triggerId: "show-submit-recipe-modal-btn-footer", modalId: "submit-recipe-modal" },
        { triggerId: "show-rate-recipe-modal-btn", modalId: "rate-recipe-modal" },
        { triggerId: "show-share-recipe-modal-btn", modalId: "share-recipe-modal" },
        { triggerId: "show-meal-planner-btn", modalId: "add-meal-plan-modal" },
        { triggerId: "add-to-meal-plan-btn", modalId: "add-meal-plan-modal" },
      ]
  
      // Set up each modal trigger
      modalTriggers.forEach(({ triggerId, modalId }) => {
        this.setupModalTrigger(triggerId, modalId)
      })
  
      // Set up direct event listeners for all buttons
      document.addEventListener("click", (e) => {
        // Account modal buttons
        if (
          e.target.matches("#user-account-btn, #mobile-user-account-btn, #show-account-modal-btn") ||
          e.target.closest("#user-account-btn, #mobile-user-account-btn, #show-account-modal-btn")
        ) {
          e.preventDefault()
          this.openModal("login-modal")
        }
  
        // Shopping list modal button
        if (e.target.matches("#show-shopping-list-modal-btn") || e.target.closest("#show-shopping-list-modal-btn")) {
          e.preventDefault()
          this.openModal("shopping-list-modal")
        }
  
        // Submit recipe modal button
        if (
          e.target.matches("#show-submit-recipe-modal-btn, #show-submit-recipe-modal-btn-footer") ||
          e.target.closest("#show-submit-recipe-modal-btn, #show-submit-recipe-modal-btn-footer")
        ) {
          e.preventDefault()
          this.openModal("submit-recipe-modal")
        }
  
        // Rate recipe modal button
        if (e.target.matches("#show-rate-recipe-modal-btn") || e.target.closest("#show-rate-recipe-modal-btn")) {
          e.preventDefault()
          this.openModal("rate-recipe-modal", () => {
            const recipeNameElement = document.getElementById("rate-recipe-name")
            if (recipeNameElement) {
              recipeNameElement.textContent = "Sample Recipe"
            }
          })
        }
  
        // Share recipe modal button
        if (e.target.matches("#show-share-recipe-modal-btn") || e.target.closest("#show-share-recipe-modal-btn")) {
          e.preventDefault()
          this.openModal("share-recipe-modal", () => {
            const recipeNameElement = document.getElementById("share-recipe-name")
            if (recipeNameElement) {
              recipeNameElement.textContent = "Sample Recipe"
            }
            const shareLinkInput = document.getElementById("share-link")
            if (shareLinkInput) {
              shareLinkInput.value = window.location.href
            }
          })
        }
  
        // Meal planner modal buttons
        if (
          e.target.matches("#show-meal-planner-btn, #add-to-meal-plan-btn") ||
          e.target.closest("#show-meal-planner-btn, #add-to-meal-plan-btn")
        ) {
          e.preventDefault()
          this.openModal("add-meal-plan-modal")
        }
      })
    },
  
    /**
     * Set up a modal trigger
     * @param {string} triggerId - ID of the trigger element
     * @param {string} modalId - ID of the modal element
     */
    setupModalTrigger(triggerId, modalId) {
      const trigger = document.getElementById(triggerId)
      const modal = document.getElementById(modalId)
  
      if (trigger && modal) {
        console.log(`Setting up modal trigger: ${triggerId} -> ${modalId}`)
  
        trigger.addEventListener("click", (e) => {
          e.preventDefault()
          this.openModal(modalId)
        })
      } else {
        if (!trigger) console.warn(`Trigger element not found: ${triggerId}`)
        if (!modal) console.warn(`Modal element not found: ${modalId}`)
      }
    },
  
    /**
     * Set up modal close buttons
     */
    setupModalCloseButtons() {
      console.log("Setting up modal close buttons")
  
      // Get all close buttons
      const closeButtons = document.querySelectorAll('[id^="close-"][id$="-modal-btn"]')
  
      // Set up each close button
      closeButtons.forEach((button) => {
        const modalId = button.id.replace("close-", "").replace("-btn", "")
        const modal = document.getElementById(modalId)
  
        if (button && modal) {
          button.addEventListener("click", () => {
            this.closeModal(modalId)
          })
        }
      })
  
      // Add click event listener to close modals when clicking outside
      document.addEventListener("click", (e) => {
        const modals = document.querySelectorAll('[id$="-modal"]')
  
        modals.forEach((modal) => {
          if (e.target === modal) {
            this.closeModal(modal.id)
          }
        })
      })
    },
  
    /**
     * Set up modal switches
     */
    setupModalSwitches() {
      console.log("Setting up modal switches")
  
      // Define modal switches
      const modalSwitches = [
        { triggerId: "show-signup-btn", fromModalId: "login-modal", toModalId: "signup-modal" },
        { triggerId: "show-login-btn", fromModalId: "signup-modal", toModalId: "login-modal" },
      ]
  
      // Set up each modal switch
      modalSwitches.forEach(({ triggerId, fromModalId, toModalId }) => {
        const trigger = document.getElementById(triggerId)
        const fromModal = document.getElementById(fromModalId)
        const toModal = document.getElementById(toModalId)
  
        if (trigger && fromModal && toModal) {
          trigger.addEventListener("click", (e) => {
            e.preventDefault()
            this.switchModal(fromModalId, toModalId)
          })
        }
      })
    },
  
    /**
     * Open a modal
     * @param {string} modalId - ID of the modal to open
     * @param {Function} callback - Optional callback function to run after opening the modal
     */
    openModal(modalId, callback) {
      console.log(`Opening modal: ${modalId}`)
  
      const modal = document.getElementById(modalId)
  
      if (modal) {
        modal.classList.remove("hidden")
  
        if (callback && typeof callback === "function") {
          callback()
        }
      } else {
        console.warn(`Modal not found: ${modalId}`)
      }
    },
  
    /**
     * Close a modal
     * @param {string} modalId - ID of the modal to close
     */
    closeModal(modalId) {
      console.log(`Closing modal: ${modalId}`)
  
      const modal = document.getElementById(modalId)
  
      if (modal) {
        modal.classList.add("hidden")
      } else {
        console.warn(`Modal not found: ${modalId}`)
      }
    },
  
    /**
     * Switch from one modal to another
     * @param {string} fromModalId - ID of the modal to close
     * @param {string} toModalId - ID of the modal to open
     */
    switchModal(fromModalId, toModalId) {
      console.log(`Switching modal: ${fromModalId} -> ${toModalId}`)
  
      this.closeModal(fromModalId)
      this.openModal(toModalId)
    },
  }
  
  export default ModalManager
  
  