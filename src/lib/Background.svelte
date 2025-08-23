<script>
  import { onMount, onDestroy } from 'svelte';
  import { getSectionColors } from './theme.js';

  export let currentRoute = 'home';

  let canvas;
  let ctx;
  let points = [];
  let mouseX = 0;
  let mouseY = 0;
  let mouseVelX = 0;
  let mouseVelY = 0;
  let frameId;
  
  // Cached values for performance
  let cachedColors = null;
  let cachedMouseSpeed = 0;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let cachedGradient = null;
  let isVisible = true;

  // --- Configuration ---
  const NUM_POINTS = 100;
  const POINT_RADIUS = 3;
  const CONNECTION_DISTANCE = 200;
  const MAX_CONNECTIONS_PER_PARTICLE = 3; // Limit connections for performance
  const MOUSE_INFLUENCE_RADIUS = 100;
  const MOUSE_SMOOTHING = 0.9;
  const MOUSE_FORCE = 0.5;
  
  // Physics constants
  const DAMPING_FACTOR = 0.98; // Stronger damping for stability
  
  // Visual constants
  const LINE_WIDTH = 0.9;
  const GRADIENT_RADIUS_MULTIPLIER = 0.8;

  // Cache colors when route changes
  $: cachedColors = getSectionColors(currentRoute);
  
  // Rebuild gradient when colors or canvas size changes
  $: if (cachedColors && ctx && canvasWidth && canvasHeight) {
    updateGradient();
  }
  
  function updateGradient() {
    if (!ctx || !cachedColors) return;
    
    cachedGradient = ctx.createRadialGradient(
      canvasWidth * 0.5, canvasHeight * 0.5, 0,
      canvasWidth * 0.5, canvasHeight * 0.5, Math.max(canvasWidth, canvasHeight) * GRADIENT_RADIUS_MULTIPLIER
    );
    cachedGradient.addColorStop(0, cachedColors.gradient.inner);
    cachedGradient.addColorStop(1, cachedColors.gradient.outer);
  }

  // Creates the constellation points
  function createPoints() {
    points = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < NUM_POINTS; i++) {
      // Start all points at the center
      const initialRadius = 250; // Small cluster around center
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * initialRadius;
      
      // Calculate spread velocity - points move outward from center
      const spreadAngle = Math.random() * Math.PI * 2;
      const spreadSpeed = 0.5 + Math.random() * 1; // Much gentler speed between 0.5-1.5
      
      points.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: Math.cos(spreadAngle) * spreadSpeed,
        vy: Math.sin(spreadAngle) * spreadSpeed,
        baseX: Math.random() * window.innerWidth,
        baseY: Math.random() * window.innerHeight
      });
    }
  }

  // Tracks mouse movement and velocity
  function handleMouseMove(e) {
    const newMouseX = e.clientX;
    const newMouseY = e.clientY;
    
    // Calculate velocity
    mouseVelX = (newMouseX - mouseX) * MOUSE_SMOOTHING;
    mouseVelY = (newMouseY - mouseY) * MOUSE_SMOOTHING;
    
    // Update position
    mouseX = newMouseX;
    mouseY = newMouseY;
  }

  // Handle page visibility changes for performance
  function handleVisibilityChange() {
    isVisible = !document.hidden;
    if (isVisible && !frameId) {
      animate(); // Restart animation when tab becomes visible
    }
  }

  // Draws everything onto the canvas
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Cache canvas dimensions and mouse speed for this frame
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    cachedMouseSpeed = Math.sqrt(mouseVelX * mouseVelX + mouseVelY * mouseVelY);

    // Draw gradient background using cached gradient
    if (cachedGradient) {
      ctx.fillStyle = cachedGradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // Draw the constellation with lighter blend mode
    ctx.globalCompositeOperation = 'lighter';

    // Update and draw points
    points.forEach((point) => {
      const dx = mouseX - point.x;
      const dy = mouseY - point.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Apply simple linear mouse influence
      if (dist < MOUSE_INFLUENCE_RADIUS) {
        const force = (1 - dist / MOUSE_INFLUENCE_RADIUS); // Linear force curve
        point.vx += (dx / dist) * force * cachedMouseSpeed * MOUSE_FORCE;
        point.vy += (dy / dist) * force * cachedMouseSpeed * MOUSE_FORCE;
      }

      // Update position with damping
      point.x += point.vx;
      point.y += point.vy;
      
      // Boundary collision detection - bounce off walls
      if (point.x <= POINT_RADIUS) {
        point.x = POINT_RADIUS;
        point.vx = Math.abs(point.vx);
      } else if (point.x >= canvasWidth - POINT_RADIUS) {
        point.x = canvasWidth - POINT_RADIUS;
        point.vx = -Math.abs(point.vx);
      }
      
      if (point.y <= POINT_RADIUS) {
        point.y = POINT_RADIUS;
        point.vy = Math.abs(point.vy);
      } else if (point.y >= canvasHeight - POINT_RADIUS) {
        point.y = canvasHeight - POINT_RADIUS;
        point.vy = -Math.abs(point.vy);
      }
      
      point.vx *= DAMPING_FACTOR;
      point.vy *= DAMPING_FACTOR;

      // Draw the point with current section color
      ctx.beginPath();
      ctx.arc(point.x, point.y, POINT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = cachedColors.point;
      ctx.fill();
    });

    // Draw connecting lines with limited connections per particle
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      let connectionCount = 0;
      
      for (let j = i + 1; j < points.length && connectionCount < MAX_CONNECTIONS_PER_PARTICLE; j++) {
        const p2 = points[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy); // Simplified distance calc

        if (dist < CONNECTION_DISTANCE) {
          // Simplified straight line drawing for performance
          ctx.lineWidth = LINE_WIDTH;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y); // Direct line instead of curve
          ctx.strokeStyle = cachedColors.line;
          ctx.stroke();
          connectionCount++;
        }
      }
    }

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
  }

  // The main animation loop with visibility optimization
  function animate() {
    if (!isVisible) {
      frameId = null;
      return; // Stop animation when tab is hidden
    }
    
    draw();
    
    // Slow down mouse velocity
    mouseVelX *= DAMPING_FACTOR;
    mouseVelY *= DAMPING_FACTOR;
    
    frameId = requestAnimationFrame(animate);
  }

  // Handles window resizing
  function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    createPoints();
    updateGradient(); // Rebuild gradient for new dimensions
  }

  // Setup when the component is mounted
  onMount(() => {
    ctx = canvas.getContext('2d');
    handleResize();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    animate();
  });

  // Cleanup when the component is destroyed
  onDestroy(() => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    cancelAnimationFrame(frameId);
  });
</script>

<canvas
  bind:this={canvas}
  style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;"
/>