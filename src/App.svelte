<script>
  import Background from './lib/Background.svelte'
  import Home from './routes/Home.svelte'
  import Service from './routes/Service.svelte'
  import Contact from './routes/Contact.svelte'
  import Research from './routes/Research.svelte'
  import { route } from './lib/route.js'

  const routes = {
    'home': Home,
    'geospatial': Service,
    'cinematography': Service,
    'agriculture': Service,
    'inspections': Service,
    'research': Research,
    'contact': Contact
  }

  let current = 'home'
  route.subscribe(v => current = v || 'home')

  let mx = 0
  let my = 0
  let scrollY = 0

  $: bgX = mx * 40
  $: bgY = my * 40

  $: {
    document.documentElement.style.setProperty('--mx', `${(mx * 20).toFixed(2)}px`)
    document.documentElement.style.setProperty('--my', `${(my * 20).toFixed(2)}px`)
    document.documentElement.style.setProperty('--bg-x', `${bgX.toFixed(2)}px`)
    document.documentElement.style.setProperty('--bg-y', `${bgY.toFixed(2)}px`)
    document.documentElement.style.setProperty('--scroll-y', `${scrollY.toFixed(2)}px`)
  }

  function handleMove(e) {
    mx = (e.clientX / window.innerWidth - 0.5)
    my = (e.clientY / window.innerHeight - 0.5)
  }

  function go(to) {
    location.hash = `#/${to}`
  }
</script>

<svelte:window bind:scrollY />

<Background />

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

      <nav class="nav" aria-label="Main navigation">
        <a href="#/home" on:click|preventDefault={() => go('home')}>Home</a>
        <a href="#/geospatial" on:click|preventDefault={() => go('geospatial')}>Geospatial</a>
        <a href="#/cinematography" on:click|preventDefault={() => go('cinematography')}>Cinematography</a>
        <a href="#/agriculture" on:click|preventDefault={() => go('agriculture')}>Agriculture</a>
        <a href="#/inspections" on:click|preventDefault={() => go('inspections')}>Inspections</a>
        <a href="#/research" on:click|preventDefault={() => go('research')}>Research</a>
        <a href="#/contact" on:click|preventDefault={() => go('contact')}>Contact</a>
      </nav>
    </div>
  </header>

  <main class="container">
    {#if routes[current]}
      <svelte:component this={routes[current]} route={current} />
    {:else}
      <Home />
    {/if}

    <footer class="footer">
      © {new Date().getFullYear()} Berkay Tok — Part 107 FAA — <span class="small-meta">MFA Media Production • MS Geospatial Data Science</span>
    </footer>
  </main>
</div>

<style>
  .content-wrapper {
    position: relative;
    z-index: 2;
  }
</style>
