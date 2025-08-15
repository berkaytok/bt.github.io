<script>
  import { onMount } from 'svelte';

  // demonstrate $state for form fields
  let name = '';
  let email = ''; 
  let message = '';
  
  onMount(() => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  });

  function submit() {
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:hello@berkaytok.com?subject=Project inquiry from website&body=${body}`;
  }
</script>

<section class="section reveal">
  <div class="card" style="max-width:760px">
    <h2>Contact / Request a Quote</h2>
    <p class="lead">Tell me about your project — location, timeline, what you need (e.g. mapping / spraying / film day) and I’ll follow up with availability and a project estimate.</p>

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
</section>
