<script>
  import { onMount } from 'svelte';
  export let route = 'geospatial';

  const data = {
    geospatial: {
      title: 'Geospatial Data Science & GIS',
      intro: 'Drone-based remote sensing, orthomosaic generation, NDVI & multispectral processing, mapping, and ML analysis.',
      bullets: [
        'Multispectral sensors & NDVI/NDRE processing',
        'Orthomosaic and DSM/DTM generation',
        'Crop prescription maps, variability analysis',
        'Custom ML workflows for classification & detection'
      ]
    },
    cinematography: {
      title: 'Aerial Cinematography',
      intro: 'High-end aerial movie work: stabilized cinematic platforms, FPV acro for dynamic scenes, and end-to-end production delivery.',
      bullets: [
        'Cinematic gimballed platforms & HDR captures',
        'FPV acrobatic sequences for dynamic shots',
        'Color grading and deliverables for broadcast'
      ]
    },
    agriculture: {
      title: 'Agricultural Drone Services',
      intro: 'Spraying, seeding, prescription mapping, and frequent crop scouting workflows to accelerate farm decisions.',
      bullets: [
        'Autonomous spraying & targeted application',
        'Prescription maps for variable rate operations',
        'Frequent flights for time-series monitoring'
      ]
    },
    inspections: {
      title: 'Inspections',
      intro: 'Detailed inspections (roof, tower, solar, powerline) using high-res and thermal imaging, with annotated reports.',
      bullets: [
        'High-resolution imagery & thermal overlay',
        'Annotated deliverable reports with geotags',
        'Safety-first flight procedures and checklists'
      ]
    }
  };

  // Color schemes matching background colors with beautiful gradients
  const sectionColors = {
    geospatial: {
      gradientStart: '#f59e0b',
      gradientMid: '#c8a70d', 
      gradientEnd: '#ea580c',
      primary: '#c8a70d',
      primaryDark: '#b8970b',
      accent: '#c8a70d'
    },
    cinematography: {
      gradientStart: '#06b6d4',
      gradientMid: '#2dd4bf',
      gradientEnd: '#0891b2',
      primary: '#2dd4bf',
      primaryDark: '#14b8a6',
      accent: '#2dd4bf'
    },
    agriculture: {
      gradientStart: '#10b981',
      gradientMid: '#22c55e',
      gradientEnd: '#059669',
      primary: '#22c55e',
      primaryDark: '#16a34a',
      accent: '#22c55e'
    },
    inspections: {
      gradientStart: '#8b5cf6',
      gradientMid: '#6366f1',
      gradientEnd: '#7c3aed',
      primary: '#6366f1',
      primaryDark: '#4f46e5',
      accent: '#6366f1'
    }
  };

  // Update page when route changes
  $: page = data[route] || data.geospatial;
  $: colors = sectionColors[route] || sectionColors.geospatial;

  // Trigger animations when route changes
  $: if (route) {
    triggerAnimations();
  }

  function triggerAnimations() {
    // Wait for DOM to update
    setTimeout(() => {
      // Remove visible class temporarily
      document.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('visible');
      });
      
      // Re-add with stagger
      setTimeout(() => {
        document.querySelectorAll('.reveal').forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('visible');
          }, index * 100);
        });
      }, 50);
    }, 10);
  }

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

  function go(to) { location.hash = `#/${to}`; }
</script>

<section class="service-hero" style="--section-primary: {colors.primary}; --section-primary-dark: {colors.primaryDark}; --section-accent: {colors.accent}; --gradient-start: {colors.gradientStart}; --gradient-mid: {colors.gradientMid}; --gradient-end: {colors.gradientEnd};">
  <div class="service-content">
    <!-- Main Service Info Glass Pane -->
    <div class="card reveal fade-up" style="margin-bottom: 32px;">
      <div class="service-badge">
        Professional Services
      </div>
      
      <h1 class="service-title gradient-title">{page.title}</h1>
      
      <p class="service-description">{page.intro}</p>
    </div>

    <!-- Capabilities Glass Pane -->
    <div class="card reveal fade-up" style="margin-bottom: 32px;">
      <h2 style="margin: 0 0 24px; font-size: 24px; color: var(--text-primary);">Key Capabilities</h2>
      <div class="capabilities-grid">
        {#each page.bullets as capability, i}
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
  .gradient-title {
    background: linear-gradient(135deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transition: all 1.5s ease-in-out;
  }

  /* Ensure gradient color stops can transition */
  .service-hero {
    --gradient-start: #f59e0b;
    --gradient-mid: #c8a70d;
    --gradient-end: #ea580c;
    transition: --gradient-start 1.5s ease-in-out, --gradient-mid 1.5s ease-in-out, --gradient-end 1.5s ease-in-out;
  }

  @supports (transition: --gradient-start 1.5s) {
    .service-hero {
      transition: --gradient-start 1.5s ease-in-out, --gradient-mid 1.5s ease-in-out, --gradient-end 1.5s ease-in-out;
    }
  }

  .service-hero :global(.btn.primary) {
    background: linear-gradient(135deg, var(--section-primary), var(--section-primary-dark));
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
</style>
