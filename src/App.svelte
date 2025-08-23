<script>
  import Background from './lib/Background.svelte'
  import Home from './routes/Home.svelte'
  import { route } from './lib/route.js'

  const routes = {
    'home': Home,
    'geospatial': () => import('./routes/Geospatial.svelte'),
    'cinematography': () => import('./routes/Cinematography.svelte'),
    'agriculture': () => import('./routes/Agriculture.svelte'),
    'inspections': () => import('./routes/Inspections.svelte'),
    'research': () => import('./routes/Research.svelte'),
    'contact': () => import('./routes/Contact.svelte'),
    'zen-zone': () => import('./routes/ZenZone.svelte')
  }

  let currentComponent = Home
  let loadingRoute = false

  let current = 'home'
  let mobileNavOpen = false
  
  route.subscribe(async (v) => {
    const newRoute = v || 'home'
    if (newRoute !== current) {
      current = newRoute
      const routeHandler = routes[current]
      
      if (typeof routeHandler === 'function') {
        loadingRoute = true
        try {
          const module = await routeHandler()
          currentComponent = module.default
        } catch (err) {
          console.error('Failed to load route:', err)
          currentComponent = Home
        }
        loadingRoute = false
      } else {
        currentComponent = routeHandler
      }
    }
  })

  let mx = 0
  let my = 0
  let scrollY = 0

  $: bgX = mx * 40
  $: bgY = my * 40

  let rafId
  $: {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--mx', `${(mx * 20).toFixed(2)}px`)
      document.documentElement.style.setProperty('--my', `${(my * 20).toFixed(2)}px`)
      document.documentElement.style.setProperty('--bg-x', `${bgX.toFixed(2)}px`)
      document.documentElement.style.setProperty('--bg-y', `${bgY.toFixed(2)}px`)
      document.documentElement.style.setProperty('--scroll-y', `${scrollY.toFixed(2)}px`)
    })
  }

  let throttleId
  function handleMove(e) {
    if (throttleId) return
    throttleId = requestAnimationFrame(() => {
      mx = (e.clientX / window.innerWidth - 0.5)
      my = (e.clientY / window.innerHeight - 0.5)
      throttleId = null
    })
  }

  function go(to) {
    location.hash = `#/${to}`
    mobileNavOpen = false // Close mobile nav when navigating
  }
  
  function toggleMobileNav() {
    mobileNavOpen = !mobileNavOpen
  }
</script>

<svelte:window bind:scrollY />

{#if current !== 'zen-zone'}
<Background currentRoute={current} />
{/if}

{#if current === 'zen-zone'}
  <svelte:component this={currentComponent} />
{:else}
<div class="content-wrapper">
  <header class="header" on:mousemove={handleMove} role="application" aria-label="Site header with interactive background effects">
    <div class="container site-row">
      <div class="brand">
        <div class="logo">BT</div>
        <div>
          <div style="font-size:15px">Berkay Tok</div>
          <div style="font-size:12px;color:var(--muted)">MFA • MS • Part 107 FAA</div>
        </div>
      </div>

      <!-- Mobile hamburger button -->
      <button class="mobile-nav-toggle" on:click={toggleMobileNav} aria-label="Toggle navigation">
        <span class="hamburger-line" class:open={mobileNavOpen}></span>
        <span class="hamburger-line" class:open={mobileNavOpen}></span>
        <span class="hamburger-line" class:open={mobileNavOpen}></span>
      </button>
      
      <!-- Desktop navigation -->
      <nav class="nav desktop-nav" aria-label="Main navigation">
        <a href="#/home" on:click|preventDefault={() => go('home')}>Home</a>
        <a href="#/geospatial" on:click|preventDefault={() => go('geospatial')}>Geospatial</a>
        <a href="#/cinematography" on:click|preventDefault={() => go('cinematography')}>Cinematography</a>
        <a href="#/agriculture" on:click|preventDefault={() => go('agriculture')}>Agriculture</a>
        <a href="#/inspections" on:click|preventDefault={() => go('inspections')}>Inspections</a>
        <a href="#/research" on:click|preventDefault={() => go('research')}>Research</a>
        <a href="#/contact" on:click|preventDefault={() => go('contact')}>Contact</a>
        <a href="#/zen-zone" on:click|preventDefault={() => go('zen-zone')} class="zen-zone-link">Zen Zone</a>
      </nav>
    </div>
  </header>
  
  <!-- Mobile navigation overlay -->
  {#if mobileNavOpen}
    <div 
      class="mobile-nav-overlay" 
      on:click={toggleMobileNav}
      on:keydown={(e) => e.key === 'Escape' && toggleMobileNav()}
      role="button"
      tabindex="0"
      aria-label="Close mobile navigation"
    ></div>
    <nav class="mobile-nav" aria-label="Mobile navigation">
      <a href="#/home" on:click|preventDefault={() => go('home')}>Home</a>
      <a href="#/geospatial" on:click|preventDefault={() => go('geospatial')}>Geospatial</a>
      <a href="#/cinematography" on:click|preventDefault={() => go('cinematography')}>Cinematography</a>
      <a href="#/agriculture" on:click|preventDefault={() => go('agriculture')}>Agriculture</a>
      <a href="#/inspections" on:click|preventDefault={() => go('inspections')}>Inspections</a>
      <a href="#/research" on:click|preventDefault={() => go('research')}>Research</a>
      <a href="#/contact" on:click|preventDefault={() => go('contact')}>Contact</a>
      <a href="#/zen-zone" on:click|preventDefault={() => go('zen-zone')} class="zen-zone-link">Zen Zone</a>
    </nav>
  {/if}

  <main class="container">
    {#if loadingRoute}
      <div class="loading">Loading...</div>
    {:else}
      <svelte:component this={currentComponent} />
    {/if}

    <footer class="footer">
      © {new Date().getFullYear()} Berkay Tok — Part 107 FAA — <span class="small-meta">MFA Media Production • MS Geospatial Data Science</span>
    </footer>
  </main>
</div>
{/if}

<style>
  .content-wrapper {
    position: relative;
    z-index: 2;
  }
  
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    color: var(--muted);
    font-size: 14px;
  }
</style>
