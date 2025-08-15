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
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  });

  function go(to) { location.hash = `#/${to}`; }
</script>

<section class="section reveal">
  <div class="card">
    <h2>{page.title}</h2>
    <p class="lead">{page.intro}</p>

    <ul style="margin-top:14px">
      {#each page.bullets as b}
        <li class="small-meta" style="margin:10px 0;">• {b}</li>
      {/each}
    </ul>

    <div style="margin-top:18px; display:flex; gap:12px">
      <button class="btn primary" onclick={() => go('contact')}>Get a quote</button>
      <button class="btn" onclick={() => go('home')}>Back</button>
    </div>

    <div style="margin-top:12px" class="small-meta">Certifications: Part 107 FAA • MFA Media Production • MS Geospatial Data Science</div>
  </div>
</section>
