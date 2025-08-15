<script>
  import { onMount } from 'svelte';

  // demonstrate $state for form fields
  let name = '';
  let email = ''; 
  let message = '';
  
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

  // Contact page colors (amber, red, purple theme)
  const contactColors = {
    primary: '#f59e0b',
    primaryDark: '#d97706',
    accent: '#f59e0b'
  };

  function submit() {
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:hello@berkaytok.com?subject=Project inquiry from website&body=${body}`;
  }
</script>

<section class="service-hero" style="--section-primary: {contactColors.primary}; --section-primary-dark: {contactColors.primaryDark}; --section-accent: {contactColors.accent};">
  <div class="service-content">
    <!-- Contact Form Glass Pane -->
    <div class="card reveal fade-up" style="margin-bottom: 32px;">
      <h1 class="service-title" style="background: linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Contact / Request a Quote</h1>
      <p class="service-description">Tell me about your project — location, timeline, what you need (e.g. mapping / spraying / film day) and I'll follow up with availability and a project estimate.</p>

      <form on:submit|preventDefault={submit}>
        <div class="form-grid">
          <input class="form-input" placeholder="Your name" bind:value={name} required />
          <input class="form-input" placeholder="Email" type="email" bind:value={email} required />
        </div>
        <textarea class="form-textarea" placeholder="Project details — location, timeline, specific requirements" bind:value={message} rows="6" required></textarea>
        <div style="margin-top:12px; display:flex; gap:12px">
          <button class="btn primary" type="submit">Submit</button>
          <a class="btn" href="#/home">Back</a>
        </div>
      </form>

      <div style="margin-top:18px" class="small-meta">
        Prefer a direct email? hello@berkaytok.com. Insured operations. FAA Part 107.
      </div>
    </div>
  </div>
</section>

<style>
  /* Section-specific styling using CSS custom properties */
  .service-hero :global(.btn.primary) {
    background: linear-gradient(135deg, var(--section-primary), var(--section-primary-dark));
    border-color: var(--section-primary);
    box-shadow: 0 8px 32px color-mix(in srgb, var(--section-primary) 25%, transparent);
    transition: all 1.5s ease-in-out;
  }

  .service-hero :global(.btn.primary:hover) {
    box-shadow: 0 12px 40px color-mix(in srgb, var(--section-primary) 35%, transparent);
  }
</style>
