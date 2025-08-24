<script>
  import { onMount } from 'svelte';

  const researchData = {
    title: 'Research & Academic Collaboration',
    intro: 'Supporting academic institutions with rigorous research methodologies, advanced data analysis, and scientific excellence.',
    capabilities: [
      'Research methodology consulting & design',
      'Advanced statistical analysis & interpretation',
      'Academic project management & coordination',
      'Research technology integration & implementation'
    ]
  };

  onMount(() => {
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      }); 
    }, observerOptions);

    // Observe all elements with reveal classes
    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });

    // Staggered animation for capability items
    document.querySelectorAll('.capability-item').forEach((el, index) => {
      el.style.transitionDelay = `${index * 100}ms`;
    });

    return () => observer.disconnect();
  });

  // Research page colors (dark forest green theme)
  const researchColors = {
    primary: '#F2B705',
    primaryDark: '#D49F04',
    accent: '#F2B705'
  };

  function go(to) { location.hash = `#/${to}`; }
</script>

<section class="service-hero" style="--section-primary: {researchColors.primary}; --section-primary-dark: {researchColors.primaryDark}; --section-accent: {researchColors.accent};">
  <div class="service-content">
    <!-- Main Research Info Glass Pane -->
    <div class="card reveal fade-up" style="margin-bottom: 32px;">
      <div class="service-badge">
        Academic Services
      </div>
      
      <h1 class="service-title" style="color: var(--section-primary);">{researchData.title}</h1>
      
      <p class="service-description">{researchData.intro}</p>
    </div>

    <!-- Capabilities Glass Pane -->
    <div class="card reveal fade-up" style="margin-bottom: 32px;">
      <h2 style="margin: 0 0 24px; font-size: 24px; color: var(--text-primary);">Core Capabilities</h2>
      <div class="capabilities-grid">
        {#each researchData.capabilities as capability, i}
          <div class="capability-item reveal fade-up" style="animation-delay: {(i + 1) * 100}ms">
            <div class="capability-icon">✓</div>
            <span>{capability}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- Actions Glass Pane -->
    <div class="card reveal fade-up" style="margin-bottom: 32px;">
      <div class="service-actions">
        <button class="btn primary large" onclick={() => go('contact')}>
          <span class="btn-icon">💬</span>
          Start Collaboration
        </button>
        <button class="btn secondary" onclick={() => go('home')}>
          <span class="btn-icon">←</span>
          Back to Overview
        </button>
      </div>
    </div>

    <!-- Credentials Glass Pane -->
    <div class="card reveal fade-up">
      <h2 style="margin: 0 0 24px; font-size: 24px; color: var(--text-primary);">Academic Credentials</h2>
      <div class="credentials-bar">
        <div class="credential-item">
          <span class="credential-icon">🎓</span>
          <span>MFA Media Production</span>
        </div>
        <div class="credential-item">
          <span class="credential-icon">🌍</span>
          <span>MS Geospatial Data Science</span>
        </div>
        <div class="credential-item">
          <span class="credential-icon">🔬</span>
          <span>Research Excellence</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="research-details">
  <div class="service-content">
    <!-- Research Details Glass Pane -->
    <div class="card reveal fade-up" style="margin-bottom: 32px;">
      <div class="section-header">
        <h2>Academic Background & Expertise</h2>
        <p class="section-subtitle">
          Bridging the gap between advanced research methodologies and practical implementation
        </p>
      </div>

      <div class="research-grid">
        <div class="research-card reveal fade-up">
          <div class="research-icon">
            <span>📊</span>
          </div>
          <h3>Research Methodology</h3>
          <p>Expert guidance on research design, methodology selection, and implementation strategies for academic institutions.</p>
          <ul class="research-features">
            <li>Experimental design & statistical planning</li>
            <li>Qualitative & quantitative research methods</li>
            <li>Data collection protocol development</li>
          </ul>
        </div>

        <div class="research-card reveal fade-up">
          <div class="research-icon">
            <span>🧮</span>
          </div>
          <h3>Data Analysis & Interpretation</h3>
          <p>Advanced statistical analysis and data interpretation services using cutting-edge computational methods.</p>
          <ul class="research-features">
            <li>Statistical modeling & hypothesis testing</li>
            <li>Machine learning & predictive analytics</li>
            <li>Visualization & reporting frameworks</li>
          </ul>
        </div>

        <div class="research-card reveal fade-up">
          <div class="research-icon">
            <span>⚙️</span>
          </div>
          <h3>Technology Integration</h3>
          <p>Implementation of modern research tools and technologies to enhance institutional research capabilities.</p>
          <ul class="research-features">
            <li>Research software & platform integration</li>
            <li>Automated data collection systems</li>
            <li>Cloud-based research infrastructure</li>
          </ul>
        </div>

        <div class="research-card reveal fade-up">
          <div class="research-icon">
            <span>🎯</span>
          </div>
          <h3>Project Management</h3>
          <p>Comprehensive project management services tailored specifically for academic research initiatives.</p>
          <ul class="research-features">
            <li>Grant application & funding strategy</li>
            <li>Timeline management & milestone tracking</li>
            <li>Team coordination & collaboration tools</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="commitment-section">
  <div class="service-content">
    <!-- Commitment Glass Pane -->
    <div class="card reveal fade-up">
      <div class="commitment-content">
        <h2>Commitment to Scientific Excellence</h2>
        <p>
          My approach is grounded in the principles of scientific methodology, ensuring that all collaborations 
          maintain the highest standards of academic rigor. I work with institutions to develop and implement 
          research strategies that advance knowledge while maintaining strict adherence to scientific principles 
          and academic integrity.
        </p>
        <div class="commitment-features">
          <div class="commitment-item">
            <span class="commitment-icon">✅</span>
            <span>Rigorous peer review standards</span>
          </div>
          <div class="commitment-item">
            <span class="commitment-icon">✅</span>
            <span>Ethical research practices</span>
          </div>
          <div class="commitment-item">
            <span class="commitment-icon">✅</span>
            <span>Reproducible methodologies</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  /* Section-specific styling using CSS custom properties */
  .service-hero :global(.btn.primary) {
    background: var(--section-primary);
    border-color: var(--section-primary);
    box-shadow: 0 8px 32px color-mix(in srgb, var(--section-primary) 25%, transparent);
    transition: all 1.5s ease-in-out;
  }

  .service-hero :global(.btn.primary:hover) {
    box-shadow: 0 12px 40px color-mix(in srgb, var(--section-primary) 35%, transparent);
  }

  .service-hero :global(.capability-icon) {
    background: var(--section-accent);
    transition: background-color 1.5s ease-in-out;
  }

  /* Ensure card hover effect matches core services */
  .service-hero :global(.card) {
    transition: all 0.3s ease;
  }

  .service-hero :global(.card:hover) {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.6);
    border-color: rgba(255,255,255,0.2);
    backdrop-filter: blur(20px);
    background: rgba(255,255,255,0.05);
  }

  /* Ensure other sections also have consistent hover effects */
  .research-details :global(.card:hover),
  .commitment-section :global(.card:hover) {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.6);
    border-color: rgba(255,255,255,0.2);
    backdrop-filter: blur(20px);
    background: rgba(255,255,255,0.05);
  }

  .research-details {
    padding: 80px 0;
  }

  .research-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 32px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .research-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 32px;
    transition: all 1.5s ease-in-out;
  }

  .research-card:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .research-icon {
    width: 64px;
    height: 64px;
    background: var(--primary);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 24px;
  }

  .research-card h3 {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 12px;
    color: var(--text);
  }

  .research-card p {
    color: var(--muted);
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .research-features {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .research-features li {
    color: var(--muted-light);
    font-size: 14px;
    padding: 6px 0;
    padding-left: 20px;
    position: relative;
  }

  .research-features li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: var(--accent);
    font-weight: bold;
  }

  .commitment-section {
    padding: 80px 0;
    background: rgba(45, 80, 22, 0.05);
  }

  .commitment-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;
  }

  .commitment-content h2 {
    font-size: 32px;
    font-weight: 700;
    margin: 0 0 24px;
    color: var(--text);
  }

  .commitment-content p {
    font-size: 18px;
    line-height: 1.7;
    color: var(--muted);
    margin-bottom: 40px;
  }

  .commitment-features {
    display: flex;
    gap: 32px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .commitment-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--muted-light);
    font-weight: 500;
  }

  .commitment-icon {
    color: var(--accent);
    font-size: 16px;
  }

  @media (max-width: 768px) {
    .research-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .research-card {
      padding: 24px;
    }

    .commitment-features {
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .commitment-content h2 {
      font-size: 28px;
    }

    .commitment-content p {
      font-size: 16px;
    }
  }
</style>