<script>
  import { onMount } from 'svelte';

  let statsVisible = false;

  function observe() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          // Add staggered delay for child elements
          const children = e.target.querySelectorAll('.stagger-child');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('visible');
            }, index * 100);
          });
          io.unobserve(e.target);
        }
      });
    }, { 
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  onMount(() => {
    observe();
    setTimeout(() => statsVisible = true, 500);
  });

  const services = [
    { 
      id: 'geospatial', 
      title: 'Geospatial Data Science', 
      desc: 'Sub-orbital multispectral remote sensing data acquisition and analysis',
      icon: '🛰️'
    },
    { 
      id: 'cinematography', 
      title: 'Aerial Cinematography', 
      desc: '8 years of experience building and flying FPV drones for media production',
      icon: '🎬'
    },
    { 
      id: 'agriculture', 
      title: 'Agricultural Solutions', 
      desc: 'Vegetation indices, crop health analysis, aerial spraying and seeding',
      icon: '🌾'
    },
    { 
      id: 'inspections', 
      title: 'Infrastructure Inspection', 
      desc: 'Thermal imaging, structural analysis, and comprehensive asset assessment.',
      icon: '🔍'
    }
  ];
</script>

<section class="hero">
  <div class="hero-left slide-in-left reveal">
    <div class="hero-badge">
      <span class="badge-icon">✈️</span>
      <span>Part 107 FAA Certified</span>
    </div>
    
    <h1 class="hero-title">
      <span class="title-highlight">FPV & Autonomous</span><br>
      <span class="title-main">sUAS & Geospatial Analytics/GIS</span><br>
      <span class="title-accent">Services</span>
    </h1>
    
    <p class="hero-description">
      Combining advanced aerial cinematography with cutting-edge geospatial analysis. 
      From agricultural monitoring to precision surveying delivering data-driven insights from above.
    </p>
    
    <div class="hero-stats fade-up {statsVisible ? 'visible' : ''}">
      <div class="stat-item">
        <div class="stat-number">500+</div>
        <div class="stat-label">Flights Completed</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">20+</div>
        <div class="stat-label">Happy Clients</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">10</div>
        <div class="stat-label">Years Experience</div>
      </div>
    </div>

    <div class="cta-row">
      <a class="btn primary" href="#/contact">
        <span class="btn-icon">📧</span>
        Get Free Quote
      </a>
      <a class="btn secondary" href="#/geospatial">
        <span class="btn-icon">🎯</span>
        View Portfolio
      </a>
    </div>

    <div class="hero-credentials">
      <span class="credential-item">MFA in Multimedia</span>
      <span class="credential-divider">•</span>
      <span class="credential-item">MS in Geospatial Data Science</span>
      <span class="credential-divider">•</span>
      <span class="credential-item">Fully Insured Operations</span>
    </div>
  </div>

  <aside class="services-preview scale-in reveal">
    <div class="preview-header">
      <h3>Core Services</h3>
      <div class="preview-subtitle">Professional-grade solutions</div>
    </div>
    <div class="service-grid">
      {#each services as service}
        <a class="service-card stagger-child" href={`#/${service.id}`}>
          <div class="service-icon">
            <span>{service.icon}</span>
          </div>
          <div class="service-content">
            <h4>{service.title}</h4>
            <p>{service.desc}</p>
          </div>
          <div class="service-arrow">→</div>
        </a>
      {/each}
    </div>
  </aside>
</section>

<section class="credentials-section">
  <div class="container">
    <div class="section-header reveal fade-up">
      <h2>Why Choose Professional Drone Services?</h2>
      <p class="section-subtitle">Advanced aerial solutions backed by FAA certification and graduate-level expertise</p>
    </div>
    
    <div class="card reveal fade-up credentials-glass-card">
      <div class="credentials-content">
        <div class="credentials-grid">
          <div class="credential-item stagger-child">
            <div class="credential-icon">
              <span>🛡️</span>
            </div>
            <div class="credential-text">
              <h3>Certified & Insured</h3>
              <p>Part 107 FAA certified with comprehensive liability coverage. Licensed for commercial operations nationwide</p>
              <div class="credential-badge">FAA Part 107</div>
            </div>
          </div>
          
          <div class="credential-item stagger-child">
            <div class="credential-icon">
              <span>🎓</span>
            </div>
            <div class="credential-text">
              <h3>Geospatial Analytics</h3>
              <p>Cutting-edge geospatial analysis, real-time data dashboards, geospatial machine and deep learning solutions</p>
              <div class="credential-badge">Geospatial Analytics</div>
            </div>
          </div>
          
          <div class="credential-item stagger-child">
            <div class="credential-icon">
              <span>🎨</span>
            </div>
            <div class="credential-text">
              <h3>Creative Approach</h3>
              <p>Acrobatic FPV cinelifters and cinewhoops for lifting your choice of camera safely or fly for events with class 1 drones</p>
              <div class="credential-badge">Hire us for your set</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="cta-section">
  <div class="container">
    <div class="card reveal fade-up cta-glass-card">
      <div class="cta-content">
        <h2>Ready to Elevate Your Project?</h2>
        <p>Get professional aerial services that deliver results. Fast quotes, flexible scheduling, guaranteed quality.</p>
        <div class="cta-buttons">
          <a class="btn primary large" href="#/contact">
            <span class="btn-icon">🚀</span>
            Start Your Project
          </a>
          <a class="btn secondary large" href="#/contact">
            <span class="btn-icon">📞</span>
            Schedule Consultation
          </a>
        </div>
        <div class="cta-guarantee">
          <span>✓ Free initial consultation</span>
          <span>✓ 24-hour quote response</span>
          <span>✓ Satisfaction guaranteed</span>
        </div>
      </div>
    </div>
  </div>
</section>