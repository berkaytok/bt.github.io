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

  // Update page when route changes
  $: page = data[route] || data.geospatial;

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

<section class="service-hero">
  <div class="service-content">
    <div class="service-badge reveal fade-up">
      Professional Services
    </div>
    
    <h1 class="service-title reveal fade-up">{page.title}</h1>
    
    <p class="service-description reveal fade-up">{page.intro}</p>

    <div class="capabilities-grid reveal fade-up">
      {#each page.bullets as capability, i}
        <div class="capability-item reveal fade-up" style="animation-delay: {(i + 1) * 100}ms">
          <div class="capability-icon">✓</div>
          <span>{capability}</span>
        </div>
      {/each}
    </div>

    <div class="service-actions reveal fade-up">
      <button class="btn primary large" onclick={() => go('contact')}>
        <span class="btn-icon">💬</span>
        Start Your Project
      </button>
      <button class="btn secondary" onclick={() => go('home')}>
        <span class="btn-icon">←</span>
        Back to Overview
      </button>
    </div>

    <div class="credentials-bar reveal fade-up">
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
</section>
