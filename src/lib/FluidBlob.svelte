<script>
  import { onMount, onDestroy } from 'svelte';

  let canvas;
  let ctx;
  let frameId;
  let time = 0;
  let mouseX = 0;
  let mouseY = 0;

  // Enhanced blob configuration
  const BLOB_COUNT = 4;
  const BLOB_SIZE = 280;
  const ANIMATION_SPEED = 0.006;
  const BLUR_AMOUNT = 120;
  const MOUSE_INFLUENCE = 0.0004;
  
  // Create multiple floating blobs
  let blobs = [];

  function initBlobs() {
    blobs = [];
    for (let i = 0; i < BLOB_COUNT; i++) {
      blobs.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        baseX: Math.random() * window.innerWidth,
        baseY: Math.random() * window.innerHeight,
        size: BLOB_SIZE + Math.random() * 120,
        speed: 0.3 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.2 + Math.random() * 0.15,
        direction: Math.random() * Math.PI * 2,
        floatRadius: 120 + Math.random() * 180
      });
    }
  }

  function drawBlob() {
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up extreme blur for ethereal effect
    ctx.filter = `blur(${BLUR_AMOUNT}px)`;
    
    // Draw each floating blob
    blobs.forEach((blob, index) => {
      // Calculate floating movement
      const floatX = blob.baseX + Math.sin(time * blob.speed + blob.phase) * blob.floatRadius;
      const floatY = blob.baseY + Math.cos(time * blob.speed * 0.7 + blob.phase) * blob.floatRadius * 0.6;
      
      // Subtle mouse influence
      const mouseDistX = mouseX - floatX;
      const mouseDistY = mouseY - floatY;
      const mouseDist = Math.sqrt(mouseDistX * mouseDistX + mouseDistY * mouseDistY);
      const mouseInfluence = Math.max(0, 300 - mouseDist) * MOUSE_INFLUENCE;
      
      blob.x = floatX + mouseDistX * mouseInfluence;
      blob.y = floatY + mouseDistY * mouseInfluence;
      
      // Wrap around screen edges
      if (blob.x < -blob.size) blob.baseX = window.innerWidth + blob.size;
      if (blob.x > window.innerWidth + blob.size) blob.baseX = -blob.size;
      if (blob.y < -blob.size) blob.baseY = window.innerHeight + blob.size;
      if (blob.y > window.innerHeight + blob.size) blob.baseY = -blob.size;
      
      // Create gradient for this blob
      const gradient = ctx.createRadialGradient(
        blob.x, blob.y, 0,
        blob.x, blob.y, blob.size
      );
      
      const opacity = blob.opacity;
      gradient.addColorStop(0, `rgba(4, 41, 64, ${opacity})`);
      gradient.addColorStop(0.3, `rgba(4, 41, 64, ${opacity * 0.8})`);
      gradient.addColorStop(0.6, `rgba(4, 41, 64, ${opacity * 0.4})`);
      gradient.addColorStop(1, 'rgba(4, 41, 64, 0)');
      
      ctx.fillStyle = gradient;
      
      // Draw organic blob shape
      ctx.beginPath();
      
      const points = 8;
      const angleStep = (Math.PI * 2) / points;
      
      for (let i = 0; i <= points; i++) {
        const angle = i * angleStep;
        
        // Create organic, flowing shape
        const radius = blob.size * 0.6 + 
          Math.sin(time * 1.5 + angle * 3 + blob.phase) * 40 +
          Math.sin(time * 2.1 + angle * 2 + blob.phase) * 25 +
          Math.sin(time * 0.8 + angle * 4 + blob.phase) * 15;
        
        const x = blob.x + Math.cos(angle) * radius;
        const y = blob.y + Math.sin(angle) * radius * 0.9;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          // Smooth curves for organic feel
          const prevAngle = (i - 1) * angleStep;
          const prevRadius = blob.size * 0.6 + 
            Math.sin(time * 1.5 + prevAngle * 3 + blob.phase) * 40 +
            Math.sin(time * 2.1 + prevAngle * 2 + blob.phase) * 25 +
            Math.sin(time * 0.8 + prevAngle * 4 + blob.phase) * 15;
          
          const prevX = blob.x + Math.cos(prevAngle) * prevRadius;
          const prevY = blob.y + Math.sin(prevAngle) * prevRadius * 0.9;
          
          const cpX = (prevX + x) / 2 + Math.sin(time + i + blob.phase) * 20;
          const cpY = (prevY + y) / 2 + Math.cos(time + i + blob.phase) * 20;
          
          ctx.quadraticCurveTo(cpX, cpY, x, y);
        }
      }
      
      ctx.closePath();
      ctx.fill();
    });
  }

  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function animate() {
    time += ANIMATION_SPEED;
    drawBlob();
    frameId = requestAnimationFrame(animate);
  }

  function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initBlobs();
  }

  onMount(() => {
    ctx = canvas.getContext('2d');
    handleResize();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();
  });

  onDestroy(() => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('mousemove', handleMouseMove);
    cancelAnimationFrame(frameId);
  });
</script>

<canvas
  bind:this={canvas}
  style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0;"
/>