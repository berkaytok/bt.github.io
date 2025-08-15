<script>
  import { fade } from 'svelte/transition';
</script>

<div class="container" in:fade>
  <h1 class="text-4xl font-bold mb-8 text-emerald-700">Research & Academic Collaboration</h1>

  <div class="space-y-8">
    <section class="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
      <h2 class="text-2xl font-semibold mb-4 text-emerald-600">Academic Background & Research</h2>
      <p class="text-gray-300 leading-relaxed mb-4">
        With a strong foundation in academic research and methodology, I offer specialized consulting services 
        for institutions committed to scientific excellence. My experience spans across implementing rigorous 
        research methodologies, data analysis, and academic project management.
      </p>
      <p class="text-gray-300 leading-relaxed">
        I work closely with academic institutions and research organizations to ensure their projects 
        adhere to the highest standards of scientific inquiry and academic integrity.
      </p>
    </section>

    <section class="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
      <h2 class="text-2xl font-semibold mb-4 text-emerald-600">Services for Academic Institutions</h2>
      <ul class="space-y-4">
        <li class="flex items-start">
          <span class="text-emerald-500 mr-2">•</span>
          <div>
            <h3 class="text-emerald-400 font-medium">Research Methodology Consulting</h3>
            <p class="text-gray-300">Expert guidance on research design, methodology selection, and implementation strategies.</p>
          </div>
        </li>
        <li class="flex items-start">
          <span class="text-emerald-500 mr-2">•</span>
          <div>
            <h3 class="text-emerald-400 font-medium">Data Analysis & Interpretation</h3>
            <p class="text-gray-300">Advanced statistical analysis and data interpretation services for research projects.</p>
          </div>
        </li>
        <li class="flex items-start">
          <span class="text-emerald-500 mr-2">•</span>
          <div>
            <h3 class="text-emerald-400 font-medium">Academic Project Management</h3>
            <p class="text-gray-300">Comprehensive project management services tailored for academic research initiatives.</p>
          </div>
        </li>
        <li class="flex items-start">
          <span class="text-emerald-500 mr-2">•</span>
          <div>
            <h3 class="text-emerald-400 font-medium">Research Technology Integration</h3>
            <p class="text-gray-300">Implementation of modern research tools and technologies to enhance research capabilities.</p>
          </div>
        </li>
      </ul>
    </section>

    <section class="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg">
      <h2 class="text-2xl font-semibold mb-4 text-emerald-600">Commitment to Scientific Excellence</h2>
      <p class="text-gray-300 leading-relaxed">
        My approach is grounded in the principles of scientific methodology, ensuring that all collaborations 
        maintain the highest standards of academic rigor. I work with institutions to develop and implement 
        research strategies that advance knowledge while maintaining strict adherence to scientific principles.
      </p>
    </section>
  </div>
</div>

<style>
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }
</style>
