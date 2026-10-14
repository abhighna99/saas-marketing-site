/**
 * FlowMind AI — SaaS Marketing Landing Page
 * Interactive animations, scroll reveals, presets switcher, and billing toggle
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Reveal with IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal-item');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger reveal slightly for grouped items
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, 60);
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 2. Navbar Scroll Glass Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 3. Mobile Navigation Drawer Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileToggle.classList.toggle('open');
    });

    // Close mobile nav when clicking any link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('open');
      });
    });
  }

  // 4. Interactive Hero Prompt Presets & DAG Node Reconfiguration
  const interactivePrompt = document.getElementById('interactivePrompt');
  const presetPills = document.querySelectorAll('.preset-pill');
  const synthesizeBtn = document.getElementById('synthesizeBtn');
  const flowCanvas = document.getElementById('flowCanvas');

  const presetsData = {
    sales: {
      prompt: '"When a Stripe signup occurs, query Clearbit for company size, summarize churn risk with Gemini, and notify #sales-vip on Slack"',
      trigger: { icon: 'S', title: 'Stripe Billing', subtitle: 'customer.created', type: 'TRIGGER', meta: 'Rate: 142 req/min' },
      ai: { icon: '✨', title: 'Lead Enrich & Score', subtitle: 'Analyze ARR & Sector', type: 'NEURAL AGENT', badge: 'Tier A ($50k+)' },
      action: { icon: '#', title: 'Slack & HubSpot', subtitle: '#sales-vip + Deal Created', type: 'ACTION ROUTE', badge: 'Executed' }
    },
    support: {
      prompt: '"On new Zendesk critical ticket, extract error logs with Gemini, search vector DB for solution, and reply with drafted resolution"',
      trigger: { icon: 'Z', title: 'Zendesk Ticket', subtitle: 'ticket.priority = urgent', type: 'TRIGGER', meta: 'Rate: 48 req/min' },
      ai: { icon: '🧠', title: 'Vector DB & RAG', subtitle: 'Search Pinecone Docs', type: 'NEURAL AGENT', badge: '98.4% Match' },
      action: { icon: '✉️', title: 'Auto-Draft Reply', subtitle: 'Send to Agent Inbox', type: 'ACTION ROUTE', badge: 'Draft Ready' }
    },
    devops: {
      prompt: '"When GitHub PR is merged to main, run automated security scan, provision staging cluster, and post metrics to Datadog"',
      trigger: { icon: '🐙', title: 'GitHub Webhook', subtitle: 'pull_request.merged', type: 'TRIGGER', meta: 'Rate: 12 pushes/hr' },
      ai: { icon: '⚡', title: 'Vulnerability Triager', subtitle: 'Static AST & SBOM Check', type: 'NEURAL AGENT', badge: '0 CVEs Found' },
      action: { icon: '📈', title: 'Datadog & Cloud Run', subtitle: 'Cluster provisioned', type: 'ACTION ROUTE', badge: 'Healthy 200' }
    }
  };

  function updateCanvasNodes(data) {
    if (!flowCanvas) return;
    
    // Add brief pulse/re-synthesizing animation
    flowCanvas.style.opacity = '0.5';
    flowCanvas.style.transform = 'scale(0.98)';
    flowCanvas.style.transition = 'all 0.25s ease';

    setTimeout(() => {
      // Trigger node
      const nodeTrigger = flowCanvas.querySelector('.node-trigger');
      if (nodeTrigger) {
        nodeTrigger.querySelector('.node-icon').textContent = data.trigger.icon;
        nodeTrigger.querySelector('.node-info h4').textContent = data.trigger.title;
        nodeTrigger.querySelector('.node-info p').textContent = data.trigger.subtitle;
        nodeTrigger.querySelector('.node-meta span:first-child').textContent = data.trigger.meta;
      }

      // AI node
      const nodeAi = flowCanvas.querySelector('.node-ai');
      if (nodeAi) {
        nodeAi.querySelector('.node-icon').textContent = data.ai.icon;
        nodeAi.querySelector('.node-info h4').textContent = data.ai.title;
        nodeAi.querySelector('.node-info p').textContent = data.ai.subtitle;
        nodeAi.querySelector('.score-badge').textContent = data.ai.badge;
      }

      // Action node
      const nodeAction = flowCanvas.querySelector('.node-action');
      if (nodeAction) {
        nodeAction.querySelector('.node-icon').textContent = data.action.icon;
        nodeAction.querySelector('.node-info h4').textContent = data.action.title;
        nodeAction.querySelector('.node-info p').textContent = data.action.subtitle;
        nodeAction.querySelector('.code-badge').textContent = data.action.badge;
      }

      flowCanvas.style.opacity = '1';
      flowCanvas.style.transform = 'scale(1)';
    }, 250);
  }

  // Preset pill click event
  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      presetPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const presetKey = pill.getAttribute('data-preset');
      const selected = presetsData[presetKey];
      if (selected && interactivePrompt) {
        interactivePrompt.innerHTML = `<span class="typing-text">${selected.prompt}</span>`;
        updateCanvasNodes(selected);
      }
    });
  });

  // Synthesize button click effect
  if (synthesizeBtn) {
    synthesizeBtn.addEventListener('click', () => {
      const activePill = document.querySelector('.preset-pill.active');
      const presetKey = activePill ? activePill.getAttribute('data-preset') : 'sales';
      synthesizeBtn.innerHTML = `<span>Synthesizing...</span>`;
      synthesizeBtn.style.filter = 'brightness(1.3)';
      
      setTimeout(() => {
        synthesizeBtn.innerHTML = `<span>Synthesized ✓</span> <span class="kbd">⌘K</span>`;
        updateCanvasNodes(presetsData[presetKey]);
        
        setTimeout(() => {
          synthesizeBtn.innerHTML = `<span>Synthesize</span> <span class="kbd">⌘K</span>`;
          synthesizeBtn.style.filter = 'none';
        }, 1500);
      }, 450);
    });
  }

  // 5. Pricing Billing Period Toggle (Monthly vs Annual with 20% discount)
  const billingToggle = document.getElementById('billingToggle');
  const monthlyLabel = document.querySelector('.billing-label.monthly');
  const annualLabel = document.querySelector('.billing-label.annual');
  const priceValues = document.querySelectorAll('.price-val[data-monthly]');
  let isAnnual = false;

  if (billingToggle) {
    billingToggle.addEventListener('click', () => {
      isAnnual = !isAnnual;
      billingToggle.classList.toggle('checked', isAnnual);
      billingToggle.setAttribute('aria-checked', isAnnual);

      if (isAnnual) {
        monthlyLabel.classList.remove('active');
        annualLabel.classList.add('active');
      } else {
        monthlyLabel.classList.add('active');
        annualLabel.classList.remove('active');
      }

      priceValues.forEach(priceEl => {
        const targetVal = isAnnual 
          ? priceEl.getAttribute('data-annual') 
          : priceEl.getAttribute('data-monthly');
        
        if (targetVal !== null) {
          // Smooth count transition
          priceEl.style.opacity = '0';
          priceEl.style.transform = 'translateY(-6px)';
          setTimeout(() => {
            priceEl.textContent = targetVal;
            priceEl.style.opacity = '1';
            priceEl.style.transform = 'translateY(0)';
            priceEl.style.transition = 'all 0.2s ease';
          }, 150);
        }
      });
    });
  }

  // 6. Early Access CTA Form Submission Handling
  const earlyAccessForm = document.getElementById('earlyAccessForm');
  const userEmailInput = document.getElementById('userEmail');
  const formFeedback = document.getElementById('formFeedback');

  if (earlyAccessForm) {
    earlyAccessForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = userEmailInput.value.trim();

      if (!email || !email.includes('@') || !email.includes('.')) {
        formFeedback.textContent = 'Please enter a valid work email address.';
        formFeedback.className = 'form-feedback error';
        return;
      }

      // Simulate API registration
      const submitBtn = earlyAccessForm.querySelector('.cta-submit-btn');
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>Reserving spot...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = `<span>Spot Claimed! ✓</span>`;
        formFeedback.textContent = `🚀 Success! We've sent an invitation to ${email}. You're #312 on early access.`;
        formFeedback.className = 'form-feedback success';
        userEmailInput.value = '';
        
        setTimeout(() => {
          submitBtn.innerHTML = originalBtnHtml;
          submitBtn.disabled = false;
        }, 4000);
      }, 700);
    });
  }

  // 7. Dynamic Subtle Card Tilt / Mouse Glow Interaction
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Log readiness
  console.log('FlowMind AI Landing Page initialized successfully.');
});
