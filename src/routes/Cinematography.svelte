<script>
  import { onMount } from 'svelte';

  const cinematographyData = {
    title: 'Aerial Cinematography',
    intro: 'High-end aerial movie work: stabilized cinematic platforms, FPV acro for dynamic scenes, and end-to-end production delivery.',
    capabilities: [
      'Cinematic gimballed platforms & 10-bit 4:2:2 log footage capture',
      'FPV acrobatic sequences for dynamic shots',
      'Cinelifters and cinewhoops for specialized filming',
      'Color grading and deliverables for broadcast'
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

  // Cinematography page colors (golden yellow theme)
  const cinematographyColors = {
    primary: '#2B4025',
    primaryDark: '#1F2E1B',
    accent: '#2B4025'
  };

  function go(to) { location.hash = `#/${to}`; }
</script>

<section class="service-hero" style="--section-primary: {cinematographyColors.primary}; --section-primary-dark: {cinematographyColors.primaryDark}; --section-accent: {cinematographyColors.accent};">
  <div class="service-content">
    <!-- Main Cinematography Info Glass Pane -->
    <div class="card reveal fade-up" style="margin-bottom: 32px;">
      <div class="service-badge">
        Professional Services
      </div>
      
      <h1 class="service-title" style="color: var(--section-primary);">{cinematographyData.title}</h1>
      
      <p class="service-description">{cinematographyData.intro}</p>
    </div>

    <!-- Capabilities Glass Pane -->
    <div class="card reveal fade-up" style="margin-bottom: 32px;">
      <h2 style="margin: 0 0 24px; font-size: 24px; color: var(--text-primary);">Key Capabilities</h2>
      <div class="capabilities-grid">
        {#each cinematographyData.capabilities as capability, i}
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
          Start Your Project
        </button>
        <button class="btn secondary" onclick={() => go('home')}>
          <span class="btn-icon">←</span>
          Back to Overview
        </button>
      </div>
    </div>

    <!-- Credentials Glass Pane -->
    <div class="card reveal fade-up">
      <h2 style="margin: 0 0 24px; font-size: 24px; color: var(--text-primary);">Credentials & Qualifications</h2>
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
          <span class="credential-icon">✈️</span>
          <span>Part 107 FAA Certified</span>
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
</style>