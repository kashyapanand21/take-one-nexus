/**
 * PREMIUM SCREENPLAY SUBMISSION HELPER
 * Logline Builder & Crew Requirement Planner
 */

const SubmissionHelper = {
  // Configured roles for the planner
  crewRoles: [
    'Director', 
    'Cinematographer (DP)', 
    'Assistant Director (AD)', 
    'Editor', 
    'Sound Designer', 
    'Gaffer (Lighting)', 
    'Art Director', 
    'Actor', 
    'Production Assistant'
  ],

  /**
   * Initializes logline builder and crew planner
   * Called dynamically after forms are rendered in project.js
   */
  init() {
    const synopsisTextarea = document.getElementById('workSynopsis');
    const teamInput = document.getElementById('workTeam');

    if (synopsisTextarea) {
      this.setupLoglineBuilder(synopsisTextarea);
    }

    if (teamInput) {
      this.setupCrewPlanner(teamInput);
    }
  },

  setupLoglineBuilder(synopsisTextarea) {
    // Hide standard textarea but keep it in DOM as hidden input to preserve form validation and payload submission
    synopsisTextarea.style.display = 'none';

    // Check if widget already exists
    let widget = document.getElementById('loglineBuilderWidget');
    if (widget) widget.remove();

    widget = document.createElement('div');
    widget.id = 'loglineBuilderWidget';
    widget.className = 'logline-builder-widget';

    widget.innerHTML = `
      <div class="logline-input-grid">
        <div class="logline-input-field">
          <label>1. Protagonist / Hero</label>
          <input type="text" id="loglineProtagonist" placeholder="e.g. A brilliant but anxious student editor" value="">
        </div>
        <div class="logline-input-field">
          <label>2. Inciting Incident</label>
          <input type="text" id="loglineIncident" placeholder="e.g. finds a hidden room containing a temporal reel" value="">
        </div>
        <div class="logline-input-field">
          <label>3. Main Goal</label>
          <input type="text" id="loglineGoal" placeholder="e.g. must finish their degree thesis film" value="">
        </div>
        <div class="logline-input-field">
          <label>4. Conflict / Stakes</label>
          <input type="text" id="loglineStakes" placeholder="e.g. before the campus time-loop resets" value="">
        </div>
      </div>
      <div class="logline-input-field" style="margin-top: 8px;">
        <label>Pitch Output / Live Preview</label>
        <div class="logline-preview-box" id="loglinePreview">Start filling out the steps above to build a cinematic logline...</div>
      </div>
    `;

    // Insert widget right after the textarea label
    synopsisTextarea.parentNode.insertBefore(widget, synopsisTextarea.nextSibling);

    // Bind inputs to dynamic preview and hidden sync
    const inputs = [
      document.getElementById('loglineProtagonist'),
      document.getElementById('loglineIncident'),
      document.getElementById('loglineGoal'),
      document.getElementById('loglineStakes')
    ];

    const updatePreview = () => {
      const protagonist = inputs[0].value.trim();
      const incident = inputs[1].value.trim();
      const goal = inputs[2].value.trim();
      const stakes = inputs[3].value.trim();

      let logline = '';
      if (protagonist || incident || goal || stakes) {
        // Construct standard cinematic logline sentence structure
        const part1 = protagonist ? `${protagonist}` : 'A protagonist';
        const part2 = incident ? ` who ${incident}` : '';
        const part3 = goal ? ` must ${goal}` : '';
        const part4 = stakes ? ` ${stakes}` : '';
        logline = `${part1}${part2}${part3}${part4}.`.replace(/\.\.$/, '.');
      }

      const previewBox = document.getElementById('loglinePreview');
      if (previewBox) {
        if (logline) {
          previewBox.textContent = logline;
          synopsisTextarea.value = logline; // Sync to hidden form field
        } else {
          previewBox.textContent = 'Start filling out the steps above to build a cinematic logline...';
          synopsisTextarea.value = '';
        }
      }
    };

    inputs.forEach(inp => {
      if (inp) {
        inp.addEventListener('input', updatePreview);
      }
    });

    // Populate logline values if textarea already has content
    if (synopsisTextarea.value) {
      document.getElementById('loglinePreview').textContent = synopsisTextarea.value;
      // Pre-fill protagonist for convenience
      inputs[0].value = synopsisTextarea.value;
    }
  },

  setupCrewPlanner(teamInput) {
    // Hide standard team input
    teamInput.style.display = 'none';

    // Check if widget already exists
    let widget = document.getElementById('crewPlannerWidget');
    if (widget) widget.remove();

    widget = document.createElement('div');
    widget.id = 'crewPlannerWidget';
    widget.className = 'crew-planner-widget';

    let chipsHtml = this.crewRoles.map(role => {
      return `<div class="crew-planner-chip" data-role="${role}">${role}</div>`;
    }).join('');

    widget.innerHTML = `
      <label style="font-family: 'Space Mono', monospace; font-size: 8px; color: var(--silver); opacity: 0.7;">
        Select Positions Needed (Tap to Toggle)
      </label>
      <div class="crew-planner-chips">
        ${chipsHtml}
      </div>
    `;

    // Insert widget right after the team input
    teamInput.parentNode.insertBefore(widget, teamInput.nextSibling);

    const chips = widget.querySelectorAll('.crew-planner-chip');
    const selectedRoles = new Set();

    // Re-populate from existing value if any
    if (teamInput.value) {
      const existing = teamInput.value.split(',').map(s => s.trim());
      existing.forEach(r => {
        selectedRoles.add(r);
        const match = Array.from(chips).find(c => c.dataset.role === r);
        if (match) match.classList.add('selected');
      });
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const role = chip.dataset.role;
        if (selectedRoles.has(role)) {
          selectedRoles.delete(role);
          chip.classList.remove('selected');
        } else {
          selectedRoles.add(role);
          chip.classList.add('selected');
        }
        
        // Sync to hidden input
        teamInput.value = Array.from(selectedRoles).join(', ');
      });
    });
  }
};

// Global export
window.SubmissionHelper = SubmissionHelper;
