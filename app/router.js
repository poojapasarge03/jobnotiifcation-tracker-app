/**
 * Job Notification Tracker - Client-Side Router & Job Management
 */

class Router {
  constructor() {
    this.routes = {
      '/': 'landing',
      '/dashboard': 'dashboard',
      '/saved': 'saved',
      '/digest': 'digest',
      '/settings': 'settings',
      '/proof': 'proof',
      '/jt/proof': 'proof-final',
      '/jt/07-test': 'test',
      '/jt/08-ship': 'ship'
    };
    
    this.allJobs = jobData || [];
    this.filters = {
      keyword: '',
      location: '',
      mode: '',
      experience: '',
      source: '',
      status: '',
      sort: 'latest',
      showMatchesOnly: false
    };
    this.preferences = this.getPreferences();

    this.init();
  }

  init() {
    // Handle hash changes
    window.addEventListener('hashchange', () => {
      this.handleRoute();
    });

    // Handle navigation link clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('.nav-link')) {
        e.preventDefault();
        const route = e.target.getAttribute('href');
        this.navigate(route);
      }
      // Handle CTA button clicks
      if (e.target.matches('.btn[href^="#"]')) {
        e.preventDefault();
        const route = e.target.getAttribute('href');
        this.navigate(route);
      }
      // Handle job actions
      if (e.target.matches('.btn-view')) {
        const jobId = parseInt(e.target.dataset.jobId);
        this.showJobModal(jobId);
      }
      if (e.target.matches('.btn-save')) {
        const jobId = parseInt(e.target.dataset.jobId);
        this.toggleSaveJob(jobId);
      }
      if (e.target.matches('.btn-apply')) {
        const jobId = parseInt(e.target.dataset.jobId);
        const job = this.allJobs.find(j => j.id === jobId);
        if (job && job.applyUrl) {
          window.open(job.applyUrl, '_blank');
        }
      }
      // Handle modal close
      if (e.target.matches('.modal-close, .modal-overlay')) {
        this.closeModal();
      }
      // Handle filter changes
      if (e.target.matches('.filter-input, .filter-select')) {
        this.handleFilterChange(e.target);
      }
      // Handle toggle
      if (e.target.matches('.toggle-input')) {
        this.handleFilterChange(e.target);
      }
      // Handle settings save
      if (e.target.matches('.btn-save-preferences')) {
        this.savePreferences();
      }
      // Handle digest generation
      if (e.target.matches('.btn-generate-digest')) {
        this.generateDigest();
      }
      // Handle copy digest
      if (e.target.matches('.btn-copy-digest')) {
        this.copyDigestToClipboard();
      }
      // Handle email draft
      if (e.target.matches('.btn-email-digest')) {
        this.createEmailDraft();
      }
      // Handle status change
      if (e.target.matches('.btn-status')) {
        const jobId = parseInt(e.target.dataset.jobId);
        const newStatus = e.target.dataset.status;
        this.updateJobStatus(jobId, newStatus);
      }
      // Handle test checklist
      if (e.target.matches('.test-checkbox')) {
        const testId = e.target.dataset.testId;
        const checked = e.target.checked;
        this.updateTestStatus(testId, checked);
      }
      // Handle reset test status
      if (e.target.matches('.btn-reset-tests')) {
        this.resetTestStatus();
      }
      // Handle artifact input changes
      if (e.target.matches('.artifact-input')) {
        this.handleArtifactChange(e.target);
      }
      // Handle copy final submission
      if (e.target.matches('.btn-copy-submission')) {
        this.copyFinalSubmission();
      }
    });

    // Handle slider input change
    document.addEventListener('input', (e) => {
      if (e.target.matches('#minMatchScore')) {
        const valueDisplay = document.getElementById('minMatchScoreValue');
        if (valueDisplay) {
          valueDisplay.textContent = e.target.value;
        }
      }
    });

    // Handle initial route on page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.handleRoute();
        this.initModal();
      });
    } else {
      this.handleRoute();
      this.initModal();
    }
  }

  initModal() {
    const modal = document.getElementById('jobModal');
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');
    
    if (overlay) {
      overlay.addEventListener('click', () => this.closeModal());
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }

  navigate(path) {
    window.location.hash = path;
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const route = this.routes[hash] || 'landing';
    
    // Check ship lock
    if (route === 'ship') {
      const testResults = this.getTestResults();
      const passedCount = Object.values(testResults).filter(Boolean).length;
      const artifacts = this.getArtifacts();
      const allArtifactsProvided = artifacts.lovableLink && artifacts.githubLink && artifacts.deployedLink;
      
      if (passedCount < 10 || !allArtifactsProvided) {
        // Ship is locked, render ship page with lock message
        this.renderPage('ship');
        this.updateActiveNav(route);
        this.closeMobileMenu();
        return;
      }
    }
    
    this.renderPage(route);
    this.updateActiveNav(route);
    this.closeMobileMenu();
  }

  updateActiveNav(route) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const linkRoute = link.getAttribute('data-route');
      if (route === 'landing') {
        link.classList.remove('active');
      } else if (linkRoute === route) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  renderPage(route) {
    const main = document.getElementById('appMain');
    
    switch(route) {
      case 'landing':
        main.innerHTML = this.renderLandingPage();
        break;
      case 'dashboard':
        main.innerHTML = this.renderDashboardPage();
        break;
      case 'saved':
        main.innerHTML = this.renderSavedPage();
        break;
      case 'digest':
        main.innerHTML = this.renderDigestPage();
        break;
      case 'settings':
        main.innerHTML = this.renderSettingsPage();
        break;
      case 'proof':
        main.innerHTML = this.renderProofPage();
        break;
      case 'test':
        main.innerHTML = this.renderTestPage();
        break;
      case 'ship':
        main.innerHTML = this.renderShipPage();
        break;
      case 'proof-final':
        main.innerHTML = this.renderProofFinalPage();
        break;
      default:
        main.innerHTML = this.renderLandingPage();
    }
  }

  renderLandingPage() {
    return `
      <div class="landing-page">
        <div class="landing-content">
          <h1 class="landing-headline">Stop Missing The Right Jobs.</h1>
          <p class="landing-subtext">Precision-matched job discovery delivered daily at 9AM.</p>
          <div class="landing-cta">
            <a href="#/settings" class="btn btn-primary">Start Tracking</a>
          </div>
        </div>
      </div>
    `;
  }

  renderDashboardPage() {
    const hasPreferences = this.hasPreferences();
    const filteredJobs = this.getFilteredJobs();
    
    return `
      <div class="page-container">
        <div class="page-header">
          <h1 class="page-title">Dashboard</h1>
        </div>
        ${!hasPreferences ? this.renderPreferencesBanner() : ''}
        ${this.renderFilterBar()}
        <div class="jobs-grid">
          ${filteredJobs.length > 0 
            ? filteredJobs.map(job => this.renderJobCard(job)).join('')
            : this.renderEmptyState()
          }
        </div>
      </div>
    `;
  }

  renderSavedPage() {
    const savedJobIds = this.getSavedJobs();
    let savedJobs = this.allJobs.filter(job => savedJobIds.includes(job.id));
    
    // Calculate match scores for saved jobs
    savedJobs = savedJobs.map(job => ({
      ...job,
      matchScore: this.calculateMatchScore(job)
    }));
    
    return `
      <div class="page-container">
        <div class="page-header">
          <h1 class="page-title">Saved</h1>
        </div>
        <div class="jobs-grid">
          ${savedJobs.length > 0 
            ? savedJobs.map(job => this.renderJobCard(job)).join('')
            : '<div class="empty-state"><h3 class="empty-state-title">No saved jobs</h3><p>Jobs you save will appear here.</p></div>'
          }
        </div>
      </div>
    `;
  }

  renderDigestPage() {
    // Check if preferences are set
    if (!this.hasPreferences()) {
      return `
        <div class="page-container">
          <div class="page-header">
            <h1 class="page-title">Digest</h1>
          </div>
          <div class="digest-blocking-message">
            <h3 class="empty-state-title">Set preferences to generate a personalized digest.</h3>
            <p>Configure your job preferences in Settings to receive your daily 9AM digest.</p>
            <div class="empty-state-action">
              <a href="#/settings" class="btn btn-primary">Go to Settings</a>
            </div>
          </div>
        </div>
      `;
    }

    // Check if digest exists for today
    const today = new Date().toISOString().split('T')[0];
    const existingDigest = this.getDigest(today);

    if (existingDigest) {
      return this.renderDigestContent(existingDigest, today);
    }

    // Show generate button
    return `
      <div class="page-container">
        <div class="page-header">
          <h1 class="page-title">Digest</h1>
          <p class="page-subtext">Generate your personalized daily job digest.</p>
        </div>
        <div class="digest-generate-section">
          <p class="digest-generate-text">Click below to generate today's 9AM digest with your top matching jobs.</p>
          <button class="btn btn-primary btn-generate-digest">Generate Today's 9AM Digest (Simulated)</button>
          <p class="digest-demo-note">Demo Mode: Daily 9AM trigger simulated manually.</p>
        </div>
      </div>
    `;
  }

  renderDigestContent(digest, date) {
    const formattedDate = new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    if (digest.jobs.length === 0) {
      return `
        <div class="page-container">
          <div class="page-header">
            <h1 class="page-title">Digest</h1>
          </div>
          <div class="digest-empty-message">
            <h3 class="empty-state-title">No matching roles today</h3>
            <p>Check again tomorrow for new opportunities.</p>
            <div class="empty-state-action">
              <button class="btn btn-secondary btn-generate-digest">Regenerate Digest</button>
            </div>
          </div>
        </div>
      `;
    }

    const statusUpdates = this.getStatusUpdates();
    const recentUpdates = statusUpdates.slice(0, 5);

    return `
      <div class="page-container">
        <div class="page-header">
          <h1 class="page-title">Digest</h1>
        </div>
        <div class="digest-actions">
          <button class="btn btn-secondary btn-copy-digest">Copy Digest to Clipboard</button>
          <button class="btn btn-secondary btn-email-digest">Create Email Draft</button>
          <button class="btn btn-secondary btn-generate-digest">Regenerate Digest</button>
        </div>
        ${recentUpdates.length > 0 ? this.renderStatusUpdatesSection(recentUpdates) : ''}
        <div class="digest-card">
          <div class="digest-header">
            <h2 class="digest-title">Top 10 Jobs For You — 9AM Digest</h2>
            <p class="digest-date">${formattedDate}</p>
          </div>
          <div class="digest-jobs">
            ${digest.jobs.map((job, index) => this.renderDigestJob(job, index + 1)).join('')}
          </div>
          <div class="digest-footer">
            <p>This digest was generated based on your preferences.</p>
            <p class="digest-demo-note">Demo Mode: Daily 9AM trigger simulated manually.</p>
          </div>
        </div>
      </div>
    `;
  }

  renderStatusUpdatesSection(updates) {
    return `
      <div class="status-updates-card">
        <h3 class="status-updates-title">Recent Status Updates</h3>
        <div class="status-updates-list">
          ${updates.map(update => {
            const date = new Date(update.dateChanged);
            const formattedDate = date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
            const statusClass = update.status.toLowerCase().replace(' ', '-');
            return `
              <div class="status-update-item">
                <div class="status-update-content">
                  <div class="status-update-job">
                    <strong>${update.title}</strong> at <strong>${update.company}</strong>
                  </div>
                  <div class="status-update-meta">
                    <span class="status-update-status badge-status-${statusClass}">${update.status}</span>
                    <span class="status-update-date">${formattedDate}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  renderDigestJob(job, index) {
    const matchScoreBadge = this.renderMatchScoreBadge(job.matchScore);
    const postedText = job.postedDaysAgo === 0 ? 'Today' : 
                      job.postedDaysAgo === 1 ? '1 day ago' : 
                      `${job.postedDaysAgo} days ago`;

    return `
      <div class="digest-job-item">
        <div class="digest-job-number">${index}</div>
        <div class="digest-job-content">
          <div class="digest-job-header">
            <h3 class="digest-job-title">${job.title}</h3>
            ${matchScoreBadge}
          </div>
          <div class="digest-job-company">${job.company}</div>
          <div class="digest-job-meta">
            <span>📍 ${job.location}</span>
            <span>•</span>
            <span>${job.mode}</span>
            <span>•</span>
            <span>${job.experience}</span>
            <span>•</span>
            <span>${postedText}</span>
          </div>
          <div class="digest-job-salary">${job.salaryRange}</div>
          <div class="digest-job-actions">
            <a href="${job.applyUrl}" target="_blank" class="btn btn-primary btn-sm">Apply</a>
          </div>
        </div>
      </div>
    `;
  }

  renderSettingsPage() {
    const prefs = this.preferences || {};
    const locations = [...new Set(this.allJobs.map(j => j.location))].sort();
    
    return `
      <div class="page-container">
        <div class="page-header">
          <h1 class="page-title">Settings</h1>
          <p class="page-subtext">Configure your job tracking preferences.</p>
        </div>
        <div class="settings-form">
          <div class="form-group">
            <label for="roleKeywords" class="form-label">Role Keywords</label>
            <input type="text" id="roleKeywords" class="input" placeholder="e.g., Software Engineer, Product Manager, Developer" value="${prefs.roleKeywords || ''}">
            <p class="form-hint">Enter comma-separated keywords or job titles you're interested in.</p>
          </div>
          
          <div class="form-group">
            <label for="preferredLocations" class="form-label">Preferred Locations</label>
            <select id="preferredLocations" class="input" multiple size="5">
              ${locations.map(loc => `<option value="${loc}" ${(prefs.preferredLocations || []).includes(loc) ? 'selected' : ''}>${loc}</option>`).join('')}
            </select>
            <p class="form-hint">Hold Ctrl/Cmd to select multiple locations.</p>
          </div>
          
          <div class="form-group">
            <label class="form-label">Preferred Mode</label>
            <div class="checkbox-group-row">
              <div class="checkbox-group">
                <input type="checkbox" id="modeRemote" value="Remote" ${(prefs.preferredMode || []).includes('Remote') ? 'checked' : ''}>
                <label for="modeRemote" class="checkbox-label">Remote</label>
              </div>
              <div class="checkbox-group">
                <input type="checkbox" id="modeHybrid" value="Hybrid" ${(prefs.preferredMode || []).includes('Hybrid') ? 'checked' : ''}>
                <label for="modeHybrid" class="checkbox-label">Hybrid</label>
              </div>
              <div class="checkbox-group">
                <input type="checkbox" id="modeOnsite" value="Onsite" ${(prefs.preferredMode || []).includes('Onsite') ? 'checked' : ''}>
                <label for="modeOnsite" class="checkbox-label">Onsite</label>
              </div>
            </div>
            <p class="form-hint">Select your preferred work arrangements.</p>
          </div>
          
          <div class="form-group">
            <label for="experienceLevel" class="form-label">Experience Level</label>
            <select id="experienceLevel" class="input">
              <option value="">Select experience level</option>
              <option value="Fresher" ${prefs.experienceLevel === 'Fresher' ? 'selected' : ''}>Fresher</option>
              <option value="0-1" ${prefs.experienceLevel === '0-1' ? 'selected' : ''}>0-1 years</option>
              <option value="1-3" ${prefs.experienceLevel === '1-3' ? 'selected' : ''}>1-3 years</option>
              <option value="3-5" ${prefs.experienceLevel === '3-5' ? 'selected' : ''}>3-5 years</option>
            </select>
            <p class="form-hint">Select your experience level.</p>
          </div>
          
          <div class="form-group">
            <label for="skills" class="form-label">Skills</label>
            <input type="text" id="skills" class="input" placeholder="e.g., React, Python, Java, Node.js" value="${prefs.skills || ''}">
            <p class="form-hint">Enter comma-separated skills you possess.</p>
          </div>
          
          <div class="form-group">
            <label for="minMatchScore" class="form-label">Minimum Match Score: <span id="minMatchScoreValue">${prefs.minMatchScore || 40}</span></label>
            <input type="range" id="minMatchScore" class="slider-input" min="0" max="100" value="${prefs.minMatchScore || 40}">
            <p class="form-hint">Jobs below this score will be hidden when "Show only matches" is enabled.</p>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn btn-primary btn-save-preferences">Save Preferences</button>
          </div>
        </div>
      </div>
    `;
  }

  renderProofPage() {
    return `
      <div class="page-container">
        <div class="page-header">
          <h1 class="page-title">Proof</h1>
          <p class="page-subtext">Placeholder for artifact collection.</p>
        </div>
      </div>
    `;
  }

  renderTestPage() {
    const testResults = this.getTestResults();
    const passedCount = Object.values(testResults).filter(Boolean).length;
    const totalTests = 10;
    const allPassed = passedCount === totalTests;

    return `
      <div class="page-container">
        <div class="page-header">
          <h1 class="page-title">Test Checklist</h1>
          <p class="page-subtext">Verify all functionality before shipping.</p>
        </div>
        
        <div class="test-summary">
          <div class="test-summary-header">
            <h2 class="test-summary-title">Tests Passed: ${passedCount} / ${totalTests}</h2>
            ${!allPassed ? '<p class="test-warning">Resolve all issues before shipping.</p>' : '<p class="test-success">All tests passed! Ready to ship.</p>'}
          </div>
          <button class="btn btn-secondary btn-reset-tests">Reset Test Status</button>
        </div>

        <div class="test-checklist">
          <div class="test-item">
            <label class="test-item-label">
              <input type="checkbox" class="test-checkbox" data-test-id="preferences-persist" ${testResults['preferences-persist'] ? 'checked' : ''}>
              <span class="test-item-text">Preferences persist after refresh</span>
            </label>
            <div class="test-tooltip">
              <span class="test-tooltip-icon">ℹ️</span>
              <div class="test-tooltip-content">Set preferences in Settings, refresh page, verify preferences are still set.</div>
            </div>
          </div>

          <div class="test-item">
            <label class="test-item-label">
              <input type="checkbox" class="test-checkbox" data-test-id="match-score-calculates" ${testResults['match-score-calculates'] ? 'checked' : ''}>
              <span class="test-item-text">Match score calculates correctly</span>
            </label>
            <div class="test-tooltip">
              <span class="test-tooltip-icon">ℹ️</span>
              <div class="test-tooltip-content">Set preferences, check job cards show match score badges (0-100%).</div>
            </div>
          </div>

          <div class="test-item">
            <label class="test-item-label">
              <input type="checkbox" class="test-checkbox" data-test-id="show-matches-toggle" ${testResults['show-matches-toggle'] ? 'checked' : ''}>
              <span class="test-item-text">"Show only matches" toggle works</span>
            </label>
            <div class="test-tooltip">
              <span class="test-tooltip-icon">ℹ️</span>
              <div class="test-tooltip-content">Enable toggle, verify only jobs above threshold are shown.</div>
            </div>
          </div>

          <div class="test-item">
            <label class="test-item-label">
              <input type="checkbox" class="test-checkbox" data-test-id="save-persists" ${testResults['save-persists'] ? 'checked' : ''}>
              <span class="test-item-text">Save job persists after refresh</span>
            </label>
            <div class="test-tooltip">
              <span class="test-tooltip-icon">ℹ️</span>
              <div class="test-tooltip-content">Save a job, refresh page, verify it appears in Saved page.</div>
            </div>
          </div>

          <div class="test-item">
            <label class="test-item-label">
              <input type="checkbox" class="test-checkbox" data-test-id="apply-opens-tab" ${testResults['apply-opens-tab'] ? 'checked' : ''}>
              <span class="test-item-text">Apply opens in new tab</span>
            </label>
            <div class="test-tooltip">
              <span class="test-tooltip-icon">ℹ️</span>
              <div class="test-tooltip-content">Click Apply button, verify URL opens in new browser tab.</div>
            </div>
          </div>

          <div class="test-item">
            <label class="test-item-label">
              <input type="checkbox" class="test-checkbox" data-test-id="status-persists" ${testResults['status-persists'] ? 'checked' : ''}>
              <span class="test-item-text">Status update persists after refresh</span>
            </label>
            <div class="test-tooltip">
              <span class="test-tooltip-icon">ℹ️</span>
              <div class="test-tooltip-content">Change job status, refresh page, verify status remains.</div>
            </div>
          </div>

          <div class="test-item">
            <label class="test-item-label">
              <input type="checkbox" class="test-checkbox" data-test-id="status-filter-works" ${testResults['status-filter-works'] ? 'checked' : ''}>
              <span class="test-item-text">Status filter works correctly</span>
            </label>
            <div class="test-tooltip">
              <span class="test-tooltip-icon">ℹ️</span>
              <div class="test-tooltip-content">Filter by status (Applied/Rejected/etc), verify correct jobs shown.</div>
            </div>
          </div>

          <div class="test-item">
            <label class="test-item-label">
              <input type="checkbox" class="test-checkbox" data-test-id="digest-generates-top10" ${testResults['digest-generates-top10'] ? 'checked' : ''}>
              <span class="test-item-text">Digest generates top 10 by score</span>
            </label>
            <div class="test-tooltip">
              <span class="test-tooltip-icon">ℹ️</span>
              <div class="test-tooltip-content">Generate digest, verify exactly 10 jobs sorted by match score.</div>
            </div>
          </div>

          <div class="test-item">
            <label class="test-item-label">
              <input type="checkbox" class="test-checkbox" data-test-id="digest-persists-day" ${testResults['digest-persists-day'] ? 'checked' : ''}>
              <span class="test-item-text">Digest persists for the day</span>
            </label>
            <div class="test-tooltip">
              <span class="test-tooltip-icon">ℹ️</span>
              <div class="test-tooltip-content">Generate digest, refresh page, verify same digest loads.</div>
            </div>
          </div>

          <div class="test-item">
            <label class="test-item-label">
              <input type="checkbox" class="test-checkbox" data-test-id="no-console-errors" ${testResults['no-console-errors'] ? 'checked' : ''}>
              <span class="test-item-text">No console errors on main pages</span>
            </label>
            <div class="test-tooltip">
              <span class="test-tooltip-icon">ℹ️</span>
              <div class="test-tooltip-content">Open browser console, navigate all pages, verify no errors.</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderShipPage() {
    const testResults = this.getTestResults();
    const passedCount = Object.values(testResults).filter(Boolean).length;
    const totalTests = 10;
    const allTestsPassed = passedCount === totalTests;
    
    const artifacts = this.getArtifacts();
    const allArtifactsProvided = artifacts.lovableLink && artifacts.githubLink && artifacts.deployedLink;
    
    const projectStatus = this.getProjectStatus();
    const canShip = allTestsPassed && allArtifactsProvided;

    if (!canShip) {
      const missingItems = [];
      if (!allTestsPassed) missingItems.push(`${totalTests - passedCount} test(s)`);
      if (!allArtifactsProvided) {
        if (!artifacts.lovableLink) missingItems.push('Lovable link');
        if (!artifacts.githubLink) missingItems.push('GitHub link');
        if (!artifacts.deployedLink) missingItems.push('Deployed URL');
      }

      return `
        <div class="page-container">
          <div class="page-header">
            <h1 class="page-title">Ship Locked</h1>
            <p class="page-subtext">Complete all requirements before shipping.</p>
          </div>
          <div class="ship-locked-message">
            <h2 class="ship-locked-title">🚫 Shipping Locked</h2>
            <p>You must complete all requirements before shipping:</p>
            <ul class="ship-requirements-list">
              ${!allTestsPassed ? `<li>Complete all 10 tests (Current: ${passedCount} / ${totalTests})</li>` : '<li>✅ All tests completed</li>'}
              ${!artifacts.lovableLink ? '<li>Provide Lovable Project Link</li>' : '<li>✅ Lovable link provided</li>'}
              ${!artifacts.githubLink ? '<li>Provide GitHub Repository Link</li>' : '<li>✅ GitHub link provided</li>'}
              ${!artifacts.deployedLink ? '<li>Provide Deployed URL</li>' : '<li>✅ Deployed URL provided</li>'}
            </ul>
            <div class="ship-locked-actions">
              <a href="#/jt/07-test" class="btn btn-secondary">Go to Test Checklist</a>
              <a href="#/jt/proof" class="btn btn-primary">Go to Proof Page</a>
            </div>
          </div>
        </div>
      `;
    }

    // Can ship - mark as shipped if not already
    if (projectStatus !== 'Shipped') {
      this.updateProjectStatus('Shipped');
    }

    return `
      <div class="page-container">
        <div class="page-header">
          <h1 class="page-title">Ship</h1>
          <p class="page-subtext">All requirements completed. Ready to ship!</p>
        </div>
        <div class="ship-ready-message">
          <h2 class="ship-ready-title">✅ Project 1 Shipped Successfully.</h2>
          <p>All tests have been completed and all artifacts have been provided.</p>
          <p>Your application is ready for submission.</p>
        </div>
      </div>
    `;
  }

  renderProofFinalPage() {
    const artifacts = this.getArtifacts();
    const projectStatus = this.getProjectStatus();
    const testResults = this.getTestResults();
    const passedCount = Object.values(testResults).filter(Boolean).length;
    
    // Calculate step completion
    const steps = [
      { id: 'preferences', name: 'Preferences System', completed: this.hasPreferences() },
      { id: 'match-scoring', name: 'Match Score Engine', completed: this.hasPreferences() && passedCount > 0 },
      { id: 'filters', name: 'Filter System', completed: true },
      { id: 'saved-jobs', name: 'Save Jobs Feature', completed: true },
      { id: 'status-tracking', name: 'Status Tracking', completed: true },
      { id: 'digest', name: 'Daily Digest', completed: true },
      { id: 'test-checklist', name: 'Test Checklist', completed: passedCount === 10 },
      { id: 'artifacts', name: 'Artifact Collection', completed: artifacts.lovableLink && artifacts.githubLink && artifacts.deployedLink }
    ];

    const completedSteps = steps.filter(s => s.completed).length;

    return `
      <div class="page-container">
        <div class="page-header">
          <h1 class="page-title">Project 1 — Job Notification Tracker</h1>
          <div class="project-status-badge badge-status-${projectStatus.toLowerCase().replace(' ', '-')}">
            ${projectStatus}
          </div>
        </div>

        <div class="proof-section">
          <h2 class="proof-section-title">Step Completion Summary</h2>
          <div class="steps-summary">
            <div class="steps-progress">${completedSteps} / ${steps.length} steps completed</div>
            <div class="steps-list">
              ${steps.map(step => `
                <div class="step-item ${step.completed ? 'completed' : 'pending'}">
                  <span class="step-checkbox">${step.completed ? '✓' : '□'}</span>
                  <span class="step-name">${step.name}</span>
                  <span class="step-status">${step.completed ? 'Completed' : 'Pending'}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="proof-section">
          <h2 class="proof-section-title">Artifact Collection</h2>
          <div class="artifacts-form">
            <div class="form-group">
              <label for="lovableLink" class="form-label">Lovable Project Link *</label>
              <input 
                type="url" 
                id="lovableLink" 
                class="input artifact-input" 
                placeholder="https://lovable.dev/project/..."
                value="${artifacts.lovableLink || ''}"
              >
              <p class="form-hint">Enter your Lovable project URL</p>
            </div>

            <div class="form-group">
              <label for="githubLink" class="form-label">GitHub Repository Link *</label>
              <input 
                type="url" 
                id="githubLink" 
                class="input artifact-input" 
                placeholder="https://github.com/username/repo"
                value="${artifacts.githubLink || ''}"
              >
              <p class="form-hint">Enter your GitHub repository URL</p>
            </div>

            <div class="form-group">
              <label for="deployedLink" class="form-label">Deployed URL (Vercel or equivalent) *</label>
              <input 
                type="url" 
                id="deployedLink" 
                class="input artifact-input" 
                placeholder="https://your-app.vercel.app"
                value="${artifacts.deployedLink || ''}"
              >
              <p class="form-hint">Enter your deployed application URL</p>
            </div>

            <div class="form-actions">
              <button class="btn btn-primary btn-copy-submission">Copy Final Submission</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderFilterBar() {
    const locations = [...new Set(this.allJobs.map(j => j.location))].sort();
    const modes = [...new Set(this.allJobs.map(j => j.mode))].sort();
    const experiences = [...new Set(this.allJobs.map(j => j.experience))].sort();
    const sources = [...new Set(this.allJobs.map(j => j.source))].sort();
    const hasPreferences = this.hasPreferences();

    return `
      <div class="filter-bar">
        ${hasPreferences ? `
        <div class="filter-group filter-toggle-group">
          <label class="toggle-label">
            <input type="checkbox" class="toggle-input" id="showMatchesOnly" ${this.filters.showMatchesOnly ? 'checked' : ''}>
            <span>Show only jobs above my threshold</span>
          </label>
        </div>
        ` : ''}
        <div class="filter-group">
          <input 
            type="text" 
            class="filter-input" 
            id="filterKeyword" 
            placeholder="Search jobs..." 
            value="${this.filters.keyword}"
          >
        </div>
        <div class="filter-group">
          <select class="filter-select" id="filterLocation">
            <option value="">All Locations</option>
            ${locations.map(loc => `<option value="${loc}" ${this.filters.location === loc ? 'selected' : ''}>${loc}</option>`).join('')}
          </select>
        </div>
        <div class="filter-group">
          <select class="filter-select" id="filterMode">
            <option value="">All Modes</option>
            ${modes.map(mode => `<option value="${mode}" ${this.filters.mode === mode ? 'selected' : ''}>${mode}</option>`).join('')}
          </select>
        </div>
        <div class="filter-group">
          <select class="filter-select" id="filterExperience">
            <option value="">All Experience</option>
            ${experiences.map(exp => `<option value="${exp}" ${this.filters.experience === exp ? 'selected' : ''}>${exp}</option>`).join('')}
          </select>
        </div>
        <div class="filter-group">
          <select class="filter-select" id="filterSource">
            <option value="">All Sources</option>
            ${sources.map(src => `<option value="${src}" ${this.filters.source === src ? 'selected' : ''}>${src}</option>`).join('')}
          </select>
        </div>
        <div class="filter-group">
          <select class="filter-select" id="filterStatus">
            <option value="">All Status</option>
            <option value="Not Applied" ${this.filters.status === 'Not Applied' ? 'selected' : ''}>Not Applied</option>
            <option value="Applied" ${this.filters.status === 'Applied' ? 'selected' : ''}>Applied</option>
            <option value="Rejected" ${this.filters.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
            <option value="Selected" ${this.filters.status === 'Selected' ? 'selected' : ''}>Selected</option>
          </select>
        </div>
        <div class="filter-group">
          <select class="filter-select" id="filterSort">
            <option value="latest" ${this.filters.sort === 'latest' ? 'selected' : ''}>Latest</option>
            <option value="oldest" ${this.filters.sort === 'oldest' ? 'selected' : ''}>Oldest</option>
            <option value="match-score" ${this.filters.sort === 'match-score' ? 'selected' : ''}>Match Score</option>
            <option value="salary-high" ${this.filters.sort === 'salary-high' ? 'selected' : ''}>Salary: High to Low</option>
            <option value="salary-low" ${this.filters.sort === 'salary-low' ? 'selected' : ''}>Salary: Low to High</option>
          </select>
        </div>
      </div>
    `;
  }

  renderJobCard(job) {
    const isSaved = this.getSavedJobs().includes(job.id);
    const postedText = job.postedDaysAgo === 0 ? 'Today' : 
                      job.postedDaysAgo === 1 ? '1 day ago' : 
                      `${job.postedDaysAgo} days ago`;
    
    // Calculate match score
    const matchScore = this.calculateMatchScore(job);
    const matchScoreBadge = this.renderMatchScoreBadge(matchScore);
    
    // Get job status
    const jobStatus = this.getJobStatus(job.id);
    const statusBadge = this.renderStatusBadge(jobStatus);

    return `
      <div class="job-card">
        <div class="job-card-header">
          <div class="job-title-row">
            <h3 class="job-title">${job.title}</h3>
            <div class="job-badges">
              ${matchScoreBadge}
              <span class="badge badge-${job.source.toLowerCase()}">${job.source}</span>
            </div>
          </div>
          <div class="job-company">${job.company}</div>
        </div>
        <div class="job-card-body">
          <div class="job-meta">
            <span class="job-location">📍 ${job.location}</span>
            <span class="job-mode">${job.mode}</span>
            <span class="job-experience">${job.experience}</span>
          </div>
          <div class="job-salary">${job.salaryRange}</div>
          <div class="job-posted">${postedText}</div>
          ${statusBadge}
        </div>
        <div class="job-card-actions">
          <button class="btn btn-secondary btn-view" data-job-id="${job.id}">View</button>
          <button class="btn btn-secondary btn-save ${isSaved ? 'saved' : ''}" data-job-id="${job.id}">
            ${isSaved ? 'Saved' : 'Save'}
          </button>
          <button class="btn btn-primary btn-apply" data-job-id="${job.id}">Apply</button>
        </div>
        <div class="job-status-group">
          <button class="btn-status ${jobStatus === 'Not Applied' ? 'active' : ''}" data-job-id="${job.id}" data-status="Not Applied">Not Applied</button>
          <button class="btn-status ${jobStatus === 'Applied' ? 'active' : ''}" data-job-id="${job.id}" data-status="Applied">Applied</button>
          <button class="btn-status ${jobStatus === 'Rejected' ? 'active' : ''}" data-job-id="${job.id}" data-status="Rejected">Rejected</button>
          <button class="btn-status ${jobStatus === 'Selected' ? 'active' : ''}" data-job-id="${job.id}" data-status="Selected">Selected</button>
        </div>
      </div>
    `;
  }

  getFilteredJobs() {
    let jobs = [...this.allJobs];

    // Calculate match scores for all jobs
    jobs = jobs.map(job => ({
      ...job,
      matchScore: this.calculateMatchScore(job)
    }));

    // Apply "Show only matches" filter if enabled
    if (this.filters.showMatchesOnly && this.hasPreferences()) {
      const minScore = (this.preferences?.minMatchScore || 40);
      jobs = jobs.filter(job => job.matchScore >= minScore);
    }

    // Keyword filter (AND behavior)
    if (this.filters.keyword) {
      const keyword = this.filters.keyword.toLowerCase();
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword)
      );
    }

    // Location filter (AND behavior)
    if (this.filters.location) {
      jobs = jobs.filter(job => job.location === this.filters.location);
    }

    // Mode filter (AND behavior)
    if (this.filters.mode) {
      jobs = jobs.filter(job => job.mode === this.filters.mode);
    }

    // Experience filter (AND behavior)
    if (this.filters.experience) {
      jobs = jobs.filter(job => job.experience === this.filters.experience);
    }

    // Source filter (AND behavior)
    if (this.filters.source) {
      jobs = jobs.filter(job => job.source === this.filters.source);
    }

    // Status filter (AND behavior)
    if (this.filters.status) {
      jobs = jobs.filter(job => {
        const jobStatus = this.getJobStatus(job.id);
        return jobStatus === this.filters.status;
      });
    }

    // Sort
    if (this.filters.sort === 'latest') {
      jobs.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    } else if (this.filters.sort === 'oldest') {
      jobs.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
    } else if (this.filters.sort === 'match-score') {
      jobs.sort((a, b) => b.matchScore - a.matchScore);
    } else if (this.filters.sort === 'salary-high') {
      jobs.sort((a, b) => this.parseSalary(b.salaryRange) - this.parseSalary(a.salaryRange));
    } else if (this.filters.sort === 'salary-low') {
      jobs.sort((a, b) => this.parseSalary(a.salaryRange) - this.parseSalary(b.salaryRange));
    }

    return jobs;
  }

  parseSalary(salaryRange) {
    // Simple parsing for sorting - extract first number
    const match = salaryRange.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  handleFilterChange(element) {
    if (element.id === 'showMatchesOnly') {
      this.filters.showMatchesOnly = element.checked;
    } else if (element.id === 'minMatchScore') {
      // Update display value
      const valueDisplay = document.getElementById('minMatchScoreValue');
      if (valueDisplay) {
        valueDisplay.textContent = element.value;
      }
      // Don't update filters, this is for settings page
      return;
    } else {
      const filterType = element.id.replace('filter', '').toLowerCase();
      this.filters[filterType] = element.value;
    }
    
    // Re-render dashboard if on dashboard page
    const hash = window.location.hash.slice(1) || '/';
    if (hash === '/dashboard') {
      this.renderPage('dashboard');
    }
  }

  showJobModal(jobId) {
    const job = this.allJobs.find(j => j.id === jobId);
    if (!job) return;

    const modal = document.getElementById('jobModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;

    const matchScore = this.calculateMatchScore(job);
    const matchScoreBadge = this.hasPreferences() ? this.renderMatchScoreBadge(matchScore) : '';

    modalBody.innerHTML = `
      <div class="modal-job-header">
        <div class="modal-job-title-row">
          <h2 class="modal-job-title">${job.title}</h2>
          ${matchScoreBadge}
        </div>
        <div class="modal-job-company">${job.company}</div>
      </div>
      <div class="modal-job-meta">
        <div class="modal-meta-item">
          <strong>Location:</strong> ${job.location}
        </div>
        <div class="modal-meta-item">
          <strong>Mode:</strong> ${job.mode}
        </div>
        <div class="modal-meta-item">
          <strong>Experience:</strong> ${job.experience}
        </div>
        <div class="modal-meta-item">
          <strong>Salary:</strong> ${job.salaryRange}
        </div>
        <div class="modal-meta-item">
          <strong>Source:</strong> ${job.source}
        </div>
        <div class="modal-meta-item">
          <strong>Posted:</strong> ${job.postedDaysAgo === 0 ? 'Today' : job.postedDaysAgo === 1 ? '1 day ago' : `${job.postedDaysAgo} days ago`}
        </div>
      </div>
      <div class="modal-job-skills">
        <h3>Skills Required</h3>
        <div class="skills-list">
          ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
      </div>
      <div class="modal-job-description">
        <h3>Description</h3>
        <p>${job.description}</p>
      </div>
      <div class="modal-job-actions">
        <button class="btn btn-secondary btn-save ${this.getSavedJobs().includes(job.id) ? 'saved' : ''}" data-job-id="${job.id}">
          ${this.getSavedJobs().includes(job.id) ? 'Saved' : 'Save'}
        </button>
        <a href="${job.applyUrl}" target="_blank" class="btn btn-primary">Apply Now</a>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    const modal = document.getElementById('jobModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  toggleSaveJob(jobId) {
    const savedJobs = this.getSavedJobs();
    const index = savedJobs.indexOf(jobId);
    
    if (index > -1) {
      savedJobs.splice(index, 1);
    } else {
      savedJobs.push(jobId);
    }
    
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    
    // Update UI
    const hash = window.location.hash.slice(1) || '/';
    if (hash === '/dashboard' || hash === '/saved') {
      this.renderPage(hash === '/dashboard' ? 'dashboard' : 'saved');
    }
    
    // Update modal if open
    const modal = document.getElementById('jobModal');
    if (modal && modal.classList.contains('active')) {
      this.showJobModal(jobId);
    }
  }

  getSavedJobs() {
    try {
      const saved = localStorage.getItem('savedJobs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  closeMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    if (navMenu) navMenu.classList.remove('active');
    if (navToggle) navToggle.classList.remove('active');
  }

  // Match Score Calculation Engine
  calculateMatchScore(job) {
    if (!this.hasPreferences()) {
      return 0;
    }

    const prefs = this.preferences;
    let score = 0;

    // +25 if any roleKeyword appears in job.title (case-insensitive)
    if (prefs.roleKeywords) {
      const keywords = prefs.roleKeywords.split(',').map(k => k.trim().toLowerCase());
      const titleLower = job.title.toLowerCase();
      if (keywords.some(keyword => titleLower.includes(keyword))) {
        score += 25;
      }
    }

    // +15 if any roleKeyword appears in job.description
    if (prefs.roleKeywords && score < 25) {
      const keywords = prefs.roleKeywords.split(',').map(k => k.trim().toLowerCase());
      const descLower = job.description.toLowerCase();
      if (keywords.some(keyword => descLower.includes(keyword))) {
        score += 15;
      }
    }

    // +15 if job.location matches preferredLocations
    if (prefs.preferredLocations && prefs.preferredLocations.length > 0) {
      if (prefs.preferredLocations.includes(job.location)) {
        score += 15;
      }
    }

    // +10 if job.mode matches preferredMode
    if (prefs.preferredMode && prefs.preferredMode.length > 0) {
      if (prefs.preferredMode.includes(job.mode)) {
        score += 10;
      }
    }

    // +10 if job.experience matches experienceLevel
    if (prefs.experienceLevel && job.experience === prefs.experienceLevel) {
      score += 10;
    }

    // +15 if overlap between job.skills and user.skills (any match)
    if (prefs.skills && job.skills && job.skills.length > 0) {
      const userSkills = prefs.skills.split(',').map(s => s.trim().toLowerCase());
      const jobSkills = job.skills.map(s => s.toLowerCase());
      if (userSkills.some(skill => jobSkills.some(js => js.includes(skill) || skill.includes(js)))) {
        score += 15;
      }
    }

    // +5 if postedDaysAgo <= 2
    if (job.postedDaysAgo <= 2) {
      score += 5;
    }

    // +5 if source is LinkedIn
    if (job.source === 'LinkedIn') {
      score += 5;
    }

    // Cap score at 100
    return Math.min(score, 100);
  }

  renderMatchScoreBadge(score) {
    if (!this.hasPreferences() || score === 0) {
      return '';
    }

    let badgeClass = 'badge-match';
    if (score >= 80) {
      badgeClass += ' badge-match-high';
    } else if (score >= 60) {
      badgeClass += ' badge-match-medium';
    } else if (score >= 40) {
      badgeClass += ' badge-match-low';
    } else {
      badgeClass += ' badge-match-subtle';
    }

    return `<span class="${badgeClass}">${score}% Match</span>`;
  }

  // Preferences Management
  getPreferences() {
    try {
      const saved = localStorage.getItem('jobTrackerPreferences');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  hasPreferences() {
    return this.preferences !== null && this.preferences !== undefined;
  }

  savePreferences() {
    const roleKeywords = document.getElementById('roleKeywords')?.value || '';
    const preferredLocations = Array.from(document.getElementById('preferredLocations')?.selectedOptions || [])
      .map(opt => opt.value);
    const preferredMode = [];
    if (document.getElementById('modeRemote')?.checked) preferredMode.push('Remote');
    if (document.getElementById('modeHybrid')?.checked) preferredMode.push('Hybrid');
    if (document.getElementById('modeOnsite')?.checked) preferredMode.push('Onsite');
    const experienceLevel = document.getElementById('experienceLevel')?.value || '';
    const skills = document.getElementById('skills')?.value || '';
    const minMatchScore = parseInt(document.getElementById('minMatchScore')?.value || '40');

    const preferences = {
      roleKeywords,
      preferredLocations,
      preferredMode,
      experienceLevel,
      skills,
      minMatchScore
    };

    localStorage.setItem('jobTrackerPreferences', JSON.stringify(preferences));
    this.preferences = preferences;

    // Show success message
    alert('Preferences saved successfully!');
    
    // Navigate to dashboard
    this.navigate('#/dashboard');
  }

  renderPreferencesBanner() {
    return `
      <div class="preferences-banner">
        <p>Set your preferences to activate intelligent matching.</p>
        <a href="#/settings" class="btn btn-primary btn-sm">Go to Settings</a>
      </div>
    `;
  }

  renderEmptyState() {
    const hasPreferences = this.hasPreferences();
    const showMatchesOnly = this.filters.showMatchesOnly;
    
    if (hasPreferences && showMatchesOnly) {
      return `
        <div class="empty-state">
          <h3 class="empty-state-title">No roles match your criteria</h3>
          <p>Adjust filters or lower threshold.</p>
        </div>
      `;
    } else {
      return `
        <div class="empty-state">
          <h3 class="empty-state-title">No jobs found</h3>
          <p>Try adjusting your filters.</p>
        </div>
      `;
    }
  }

  // Job Status Management
  getJobStatus(jobId) {
    try {
      const statuses = this.getAllJobStatuses();
      return statuses[jobId] || 'Not Applied';
    } catch (e) {
      return 'Not Applied';
    }
  }

  getAllJobStatuses() {
    try {
      const saved = localStorage.getItem('jobTrackerStatus');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  updateJobStatus(jobId, status) {
    const statuses = this.getAllJobStatuses();
    statuses[jobId] = status;
    
    // Store status update with timestamp
    const statusUpdates = this.getStatusUpdates();
    const job = this.allJobs.find(j => j.id === jobId);
    
    if (job) {
      statusUpdates.unshift({
        jobId: jobId,
        title: job.title,
        company: job.company,
        status: status,
        dateChanged: new Date().toISOString()
      });
      
      // Keep only last 20 updates
      if (statusUpdates.length > 20) {
        statusUpdates.pop();
      }
      
      localStorage.setItem('jobTrackerStatusUpdates', JSON.stringify(statusUpdates));
    }
    
    localStorage.setItem('jobTrackerStatus', JSON.stringify(statuses));
    
    // Show toast notification
    this.showToast(`Status updated: ${status}`);
    
    // Update UI
    const hash = window.location.hash.slice(1) || '/';
    if (hash === '/dashboard' || hash === '/saved') {
      this.renderPage(hash === '/dashboard' ? 'dashboard' : 'saved');
    }
    
    // Update modal if open
    const modal = document.getElementById('jobModal');
    if (modal && modal.classList.contains('active')) {
      this.showJobModal(jobId);
    }
  }

  getStatusUpdates() {
    try {
      const saved = localStorage.getItem('jobTrackerStatusUpdates');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  renderStatusBadge(status) {
    const statusClass = status.toLowerCase().replace(' ', '-');
    return `
      <div class="job-status-badge badge-status-${statusClass}">
        ${status}
      </div>
    `;
  }

  showToast(message) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Hide and remove toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }

  // Test Checklist Management
  getTestResults() {
    try {
      const saved = localStorage.getItem('jobTrackerTestResults');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  }

  updateTestStatus(testId, checked) {
    const testResults = this.getTestResults();
    testResults[testId] = checked;
    localStorage.setItem('jobTrackerTestResults', JSON.stringify(testResults));
    
    // Re-render test page to update summary
    const hash = window.location.hash.slice(1) || '/';
    if (hash === '/jt/07-test') {
      this.renderPage('test');
    }
  }

  resetTestStatus() {
    if (confirm('Reset all test results? This will uncheck all tests.')) {
      localStorage.removeItem('jobTrackerTestResults');
      const hash = window.location.hash.slice(1) || '/';
      if (hash === '/jt/07-test') {
        this.renderPage('test');
      }
    }
  }

  // Artifact Management
  getArtifacts() {
    try {
      const saved = localStorage.getItem('jobTrackerArtifacts');
      return saved ? JSON.parse(saved) : { lovableLink: '', githubLink: '', deployedLink: '' };
    } catch (e) {
      return { lovableLink: '', githubLink: '', deployedLink: '' };
    }
  }

  handleArtifactChange(element) {
    const artifacts = this.getArtifacts();
    const field = element.id;
    
    // Validate URL format
    const url = element.value.trim();
    if (url && !this.isValidUrl(url)) {
      element.classList.add('input-error');
      return;
    } else {
      element.classList.remove('input-error');
    }

    // Map field IDs to artifact properties
    if (field === 'lovableLink') {
      artifacts.lovableLink = url;
    } else if (field === 'githubLink') {
      artifacts.githubLink = url;
    } else if (field === 'deployedLink') {
      artifacts.deployedLink = url;
    }

    localStorage.setItem('jobTrackerArtifacts', JSON.stringify(artifacts));
    
    // Update project status if needed
    this.updateProjectStatusBasedOnCompletion();
    
    // Re-render proof page if on it
    const hash = window.location.hash.slice(1) || '/';
    if (hash === '/jt/proof') {
      this.renderPage('proof-final');
    }
  }

  isValidUrl(string) {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  copyFinalSubmission() {
    const artifacts = this.getArtifacts();
    
    if (!artifacts.lovableLink || !artifacts.githubLink || !artifacts.deployedLink) {
      alert('Please provide all three links before copying submission.');
      return;
    }

    const submission = `Job Notification Tracker — Final Submission

Lovable Project:
${artifacts.lovableLink}

GitHub Repository:
${artifacts.githubLink}

Live Deployment:
${artifacts.deployedLink}

Core Features:
- Intelligent match scoring
- Daily digest simulation
- Status tracking
- Test checklist enforced`;

    navigator.clipboard.writeText(submission).then(() => {
      this.showToast('Final submission copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
      alert('Failed to copy submission. Please try again.');
    });
  }

  // Project Status Management
  getProjectStatus() {
    const testResults = this.getTestResults();
    const passedCount = Object.values(testResults).filter(Boolean).length;
    const artifacts = this.getArtifacts();
    const allArtifactsProvided = artifacts.lovableLink && artifacts.githubLink && artifacts.deployedLink;
    
    if (passedCount === 10 && allArtifactsProvided) {
      return 'Shipped';
    } else if (passedCount > 0 || allArtifactsProvided) {
      return 'In Progress';
    } else {
      return 'Not Started';
    }
  }

  updateProjectStatus(status) {
    localStorage.setItem('jobTrackerProjectStatus', status);
  }

  updateProjectStatusBasedOnCompletion() {
    const status = this.getProjectStatus();
    this.updateProjectStatus(status);
  }

  // Digest Generation Logic
  generateDigest() {
    if (!this.hasPreferences()) {
      alert('Please set your preferences first.');
      return;
    }

    // Calculate match scores for all jobs
    let jobs = this.allJobs.map(job => ({
      ...job,
      matchScore: this.calculateMatchScore(job)
    }));

    // Filter jobs with match score > 0
    jobs = jobs.filter(job => job.matchScore > 0);

    // Sort by matchScore descending, then postedDaysAgo ascending
    jobs.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return a.postedDaysAgo - b.postedDaysAgo;
    });

    // Take top 10
    const topJobs = jobs.slice(0, 10);

    // Store digest
    const today = new Date().toISOString().split('T')[0];
    const digest = {
      date: today,
      generatedAt: new Date().toISOString(),
      jobs: topJobs
    };

    localStorage.setItem(`jobTrackerDigest_${today}`, JSON.stringify(digest));

    // Re-render digest page
    this.renderPage('digest');
  }

  getDigest(date) {
    try {
      const digestKey = `jobTrackerDigest_${date}`;
      const saved = localStorage.getItem(digestKey);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  copyDigestToClipboard() {
    const today = new Date().toISOString().split('T')[0];
    const digest = this.getDigest(today);
    
    if (!digest || digest.jobs.length === 0) {
      alert('No digest available to copy.');
      return;
    }

    const formattedDate = new Date(digest.date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    let text = `Top 10 Jobs For You — 9AM Digest\n`;
    text += `${formattedDate}\n\n`;

    digest.jobs.forEach((job, index) => {
      const postedText = job.postedDaysAgo === 0 ? 'Today' : 
                        job.postedDaysAgo === 1 ? '1 day ago' : 
                        `${job.postedDaysAgo} days ago`;
      
      text += `${index + 1}. ${job.title}\n`;
      text += `   Company: ${job.company}\n`;
      text += `   Location: ${job.location} | ${job.mode} | ${job.experience}\n`;
      text += `   Salary: ${job.salaryRange}\n`;
      text += `   Match Score: ${job.matchScore}%\n`;
      text += `   Posted: ${postedText}\n`;
      text += `   Apply: ${job.applyUrl}\n\n`;
    });

    text += `This digest was generated based on your preferences.\n`;
    text += `Demo Mode: Daily 9AM trigger simulated manually.`;

    navigator.clipboard.writeText(text).then(() => {
      alert('Digest copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
      alert('Failed to copy digest. Please try again.');
    });
  }

  createEmailDraft() {
    const today = new Date().toISOString().split('T')[0];
    const digest = this.getDigest(today);
    
    if (!digest || digest.jobs.length === 0) {
      alert('No digest available to email.');
      return;
    }

    const formattedDate = new Date(digest.date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    let body = `Top 10 Jobs For You — 9AM Digest\n`;
    body += `${formattedDate}\n\n`;

    digest.jobs.forEach((job, index) => {
      const postedText = job.postedDaysAgo === 0 ? 'Today' : 
                        job.postedDaysAgo === 1 ? '1 day ago' : 
                        `${job.postedDaysAgo} days ago`;
      
      body += `${index + 1}. ${job.title}\n`;
      body += `   Company: ${job.company}\n`;
      body += `   Location: ${job.location} | ${job.mode} | ${job.experience}\n`;
      body += `   Salary: ${job.salaryRange}\n`;
      body += `   Match Score: ${job.matchScore}%\n`;
      body += `   Posted: ${postedText}\n`;
      body += `   Apply: ${job.applyUrl}\n\n`;
    });

    body += `This digest was generated based on your preferences.\n`;
    body += `Demo Mode: Daily 9AM trigger simulated manually.`;

    const subject = encodeURIComponent('My 9AM Job Digest');
    const bodyEncoded = encodeURIComponent(body);
    const mailtoLink = `mailto:?subject=${subject}&body=${bodyEncoded}`;

    window.location.href = mailtoLink;
  }
}

// Initialize router
const router = new Router();

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  }
});
