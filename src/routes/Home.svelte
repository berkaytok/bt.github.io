<script>
  import { onMount } from 'svelte';

  let heroVisible = false;
  let servicesVisible = false;
  let statsVisible = false;
  let testimonialsVisible = false;

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
    setTimeout(() => heroVisible = true, 100);
    setTimeout(() => servicesVisible = true, 300);
    setTimeout(() => statsVisible = true, 500);
    setTimeout(() => testimonialsVisible = true, 700);
  });

  const services = [
    { 
      id: 'geospatial', 
      title: 'Geospatial Data Science', 
      desc: 'Advanced remote sensing, multispectral analysis, and precision mapping solutions.',
      icon: '🛰️'
    },
    { 
      id: 'cinematography', 
      title: 'Aerial Cinematography', 
      desc: 'Cinematic 4K footage and high-resolution photography for media production.',
      icon: '🎬'
    },
    { 
      id: 'agriculture', 
      title: 'Agricultural Solutions', 
      desc: 'NDVI mapping, crop health analysis, and precision agriculture insights.',
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
      <span class="title-highlight">Professional</span><br>
      <span class="title-main">Drone & GIS</span><br>
      <span class="title-accent">Services</span>
    </h1>
    
    <p class="hero-description">
      Combining advanced aerial cinematography with cutting-edge geospatial analysis. 
      From agricultural monitoring to precision surveying — delivering data-driven insights from above.
    </p>
    
    <div class="hero-stats fade-up {statsVisible ? 'visible' : ''}">
      <div class="stat-item">
        <div class="stat-number">500+</div>
        <div class="stat-label">Flights Completed</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">50+</div>
        <div class="stat-label">Happy Clients</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">3</div>
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
      <span class="credential-item">MFA Media Production</span>
      <span class="credential-divider">•</span>
      <span class="credential-item">MS Geospatial Data Science</span>
      <span class="credential-divider">•</span>
      <span class="credential-item">Fully Insured</span>
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

<section class="credentials-section {servicesVisible ? 'reveal visible' : 'reveal'}">
  <div class="section-header">
    <h2>Why Choose Professional Drone Services?</h2>
    <p class="section-subtitle">Advanced aerial solutions backed by FAA certification and graduate-level expertise</p>
  </div>
  <div class="credentials-grid">
    <div class="credential-card stagger-child">
      <div class="credential-icon">
        <span>🛡️</span>
      </div>
      <h3>Certified & Insured</h3>
      <p>Part 107 FAA certified with comprehensive liability coverage. Licensed for commercial operations nationwide.</p>
      <div class="credential-badge">FAA Part 107</div>
    </div>
    <div class="credential-card stagger-child">
      <div class="credential-icon">
        <span>🎓</span>
      </div>
      <h3>Advanced Analytics</h3>
      <p>MS in Geospatial Data Science provides cutting-edge analysis capabilities and professional-grade insights.</p>
      <div class="credential-badge">MS Geospatial</div>
    </div>
    <div class="credential-card stagger-child">
      <div class="credential-icon">
        <span>🎨</span>
      </div>
      <h3>Creative Excellence</h3>
      <p>MFA in Media Production ensures cinematic quality. Artistic vision meets technical precision.</p>
      <div class="credential-badge">MFA Media</div>
    </div>
    <div class="credential-card stagger-child">
      <div class="credential-icon">
        <span>⚡</span>
      </div>
      <h3>Rapid Delivery</h3>
      <p>Quick turnaround times without compromising quality. Efficient workflows and project management.</p>
      <div class="credential-badge">24-48hr</div>
    </div>
  </div>
</section>

<section class="testimonials-section {testimonialsVisible ? 'reveal visible' : 'reveal'}">
  <div class="section-header">
    <h2>Client Success Stories</h2>
    <p class="section-subtitle">Trusted by leading organizations across multiple industries</p>
  </div>
  <div class="testimonials-grid">
    <div class="testimonial-card stagger-child">
      <div class="testimonial-content">
        <div class="quote-mark">"</div>
        <p>Berkay's precision mapping helped us optimize our irrigation systems and increase crop yield by 15%. The data quality was exceptional.</p>
      </div>
      <div class="testimonial-author">
        <div class="author-info">
          <strong>Sarah Chen</strong>
          <span>Agricultural Operations Manager</span>
        </div>
      </div>
    </div>
    <div class="testimonial-card stagger-child">
      <div class="testimonial-content">
        <div class="quote-mark">"</div>
        <p>The aerial cinematography for our commercial was absolutely stunning. Professional quality that exceeded our expectations.</p>
      </div>
      <div class="testimonial-author">
        <div class="author-info">
          <strong>Mike Rodriguez</strong>
          <span>Creative Director</span>
        </div>
      </div>
    </div>
    <div class="testimonial-card stagger-child">
      <div class="testimonial-content">
        <div class="quote-mark">"</div>
        <p>Fast, reliable, and incredibly detailed surveying work. The GIS data integration saved us weeks of field work.</p>
      </div>
      <div class="testimonial-author">
        <div class="author-info">
          <strong>Jennifer Walsh</strong>
          <span>Project Engineer</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="cta-section reveal">
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
</section>