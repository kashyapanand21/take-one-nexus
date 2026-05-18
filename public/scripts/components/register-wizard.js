/**
 * REGISTRATION MULTI-STEP WIZARD CONTROLLER
 * Manages clean state transitions, pathway sorting, and validation.
 */

(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const registerModal = document.getElementById('registerModal');
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    const steps = registerForm.querySelectorAll('.wizard-step');
    const progressSteps = registerForm.querySelectorAll('.progress-step');
    
    // Step 1 Buttons
    const btnNext1 = document.getElementById('registerNext1');
    
    // Step 2 Buttons
    const btnBack1 = document.getElementById('registerBack1');
    const btnNext2 = document.getElementById('registerNext2');
    
    // Step 3 Buttons
    const btnBack2 = document.getElementById('registerBack2');

    // Pathway Cards
    const cardCreator = document.getElementById('pathwayCreator');
    const cardCrew = document.getElementById('pathwayCrew');
    const selectRole = document.getElementById('registerRole');

    let currentStep = 1;

    // Define creator vs crew roles for smart filtering
    const CREATOR_ROLES = ['Director', 'Writer', 'Producer'];
    const CREW_ROLES = ['Cinematographer / DP', 'Editor', 'Sound Designer', 'Designer', 'Actor', 'Lighting Crew', 'Set Support', 'Other'];

    // ── STEP NAVIGATION FUNCTIONS ──
    
    function navigateToStep(stepNum) {
      if (stepNum < 1 || stepNum > 3) return;

      // Hide all steps
      steps.forEach(step => step.classList.remove('active'));
      progressSteps.forEach(p => p.classList.remove('active'));

      // Show active step
      const targetStep = registerForm.querySelector(`.wizard-step[data-step="${stepNum}"]`);
      if (targetStep) targetStep.classList.add('active');

      // Update progress bar status
      for (let i = 1; i <= stepNum; i++) {
        const pStep = registerForm.querySelector(`.progress-step[data-step="${i}"]`);
        if (pStep) pStep.classList.add('active');
      }

      currentStep = stepNum;
    }

    // Reset Wizard to step 1
    window.resetRegisterWizard = function() {
      navigateToStep(1);
      // Deselect cards
      if (cardCreator) cardCreator.classList.remove('selected');
      if (cardCrew) cardCrew.classList.remove('selected');
      // Reset dropdown filter
      restoreAllRoles();
    };

    // Listen for register modal opens/closes to reset
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (!registerModal.classList.contains('show')) {
            window.resetRegisterWizard();
          }
        }
      });
    });
    if (registerModal) {
      observer.observe(registerModal, { attributes: true });
    }

    // ── PATHWAY CARD EVENT HANDLERS ──

    if (cardCreator && cardCrew && selectRole) {
      cardCreator.addEventListener('click', () => {
        cardCreator.classList.add('selected');
        cardCrew.classList.remove('selected');
        filterRoles(CREATOR_ROLES);
        selectRole.focus();
      });

      cardCrew.addEventListener('click', () => {
        cardCrew.classList.add('selected');
        cardCreator.classList.remove('selected');
        filterRoles(CREW_ROLES);
        selectRole.focus();
      });
    }

    function filterRoles(allowedRoles) {
      // Clear options first, but preserve placeholder
      const options = selectRole.querySelectorAll('option');
      options.forEach(opt => {
        if (opt.value === "") {
          opt.disabled = true;
          opt.selected = true;
          return;
        }

        const isAllowed = allowedRoles.includes(opt.value);
        if (isAllowed) {
          opt.style.display = 'block';
          opt.disabled = false;
        } else {
          opt.style.display = 'none';
          opt.disabled = true;
        }
      });
    }

    function restoreAllRoles() {
      if (!selectRole) return;
      const options = selectRole.querySelectorAll('option');
      options.forEach(opt => {
        opt.style.display = 'block';
        opt.disabled = false;
        if (opt.value === "") {
          opt.disabled = true;
          opt.selected = true;
        }
      });
    }

    // ── STEP VALIDATIONS ──

    function validateStep1() {
      const name = document.getElementById('registerName');
      const email = document.getElementById('registerEmail');
      const password = document.getElementById('registerPassword');
      const confirmPassword = document.getElementById('registerConfirmPassword');

      if (!name.value.trim()) {
        showValidationMessage(name, 'Please enter your full name.');
        return false;
      }

      if (!email.value.trim() || !validateEmailFormat(email.value)) {
        showValidationMessage(email, 'Please enter a valid email address.');
        return false;
      }

      if (!password.value || password.value.length < 6) {
        showValidationMessage(password, 'Password must be at least 6 characters.');
        return false;
      }

      if (password.value !== confirmPassword.value) {
        showValidationMessage(confirmPassword, 'Passwords do not match.');
        return false;
      }

      return true;
    }

    function validateStep2() {
      const role = document.getElementById('registerRole');
      const dispPref = document.getElementById('registerDisplayPreference');

      // Check if pathway is chosen (at least one selected)
      const pathwayChosen = (cardCreator && cardCreator.classList.contains('selected')) || 
                            (cardCrew && cardCrew.classList.contains('selected'));
      
      if (!pathwayChosen) {
        showToast('Please select your Pathway (Creator or Crew).');
        return false;
      }

      if (!role.value) {
        showValidationMessage(role, 'Please select your core specialty role.');
        return false;
      }

      if (!dispPref.value) {
        showValidationMessage(dispPref, 'Please select your display preference.');
        return false;
      }

      return true;
    }

    function validateEmailFormat(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email.toLowerCase());
    }

    function showValidationMessage(inputEl, msg) {
      if (inputEl.reportValidity) {
        inputEl.setCustomValidity(msg);
        inputEl.reportValidity();
        // Clear message on input focus
        inputEl.addEventListener('input', function clearVal() {
          inputEl.setCustomValidity('');
          inputEl.removeEventListener('input', clearVal);
        });
      } else {
        showToast(msg);
      }
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      if (toast) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
      }
    }

    // ── BUTTON CLICK BINDINGS ──

    if (btnNext1) {
      btnNext1.addEventListener('click', () => {
        if (validateStep1()) {
          navigateToStep(2);
        }
      });
    }

    if (btnBack1) {
      btnBack1.addEventListener('click', () => {
        navigateToStep(1);
      });
    }

    if (btnNext2) {
      btnNext2.addEventListener('click', () => {
        if (validateStep2()) {
          navigateToStep(3);
        }
      });
    }

    if (btnBack2) {
      btnBack2.addEventListener('click', () => {
        navigateToStep(2);
      });
    }
  });
})();
