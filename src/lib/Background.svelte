<script>
  import { onMount, onDestroy } from 'svelte';

  let canvas;
  let ctx;
  let points = [];
  let mouseX = 0;
  let mouseY = 0;
  let mouseVelX = 0;
  let mouseVelY = 0;
  let frameId;

  // --- Configuration ---
  const NUM_POINTS = 200;
  const POINT_RADIUS = 3;
  const CONNECTION_DISTANCE = 500;
  const MOUSE_INFLUENCE_RADIUS = 250;
  const MOUSE_SMOOTHING = 0.4;
  const MAX_VELOCITY = 10;
  const MOUSE_FORCE = 0.1;
  // --- End Configuration ---

  // Creates the constellation points
  function createPoints() {
    points = [];
    for (let i = 0; i < NUM_POINTS; i++) {
      points.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
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

  // Draws everything onto the canvas
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw static gradient background
    const gradient = ctx.createRadialGradient(
      canvas.width * 0.5, canvas.height * 0.5, 0,
      canvas.width * 0.5, canvas.height * 0.5, Math.max(canvas.width, canvas.height) * 0.8
    );
    gradient.addColorStop(0, 'rgba(4, 120, 87, 0.08)');
    gradient.addColorStop(1, 'rgba(6, 78, 59, 0.25)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the constellation with lighter blend mode
    ctx.globalCompositeOperation = 'lighter';

    // Update and draw points
    points.forEach(point => {
      const dx = mouseX - point.x;
      const dy = mouseY - point.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Apply mouse influence with scatter effect
      if (dist < MOUSE_INFLUENCE_RADIUS) {
        const force = (1 - dist / MOUSE_INFLUENCE_RADIUS) ** 0.5;
        const angle = Math.atan2(dy, dx);
        const scatter = (Math.random() - 0.5) * Math.PI * 0.5;
        const mouseSpeed = Math.sqrt(mouseVelX * mouseVelX + mouseVelY * mouseVelY);
        
        // Add perpendicular force for scatter
        point.vx += (Math.cos(angle + scatter) * mouseSpeed * force * MOUSE_FORCE);
        point.vy += (Math.sin(angle + scatter) * mouseSpeed * force * MOUSE_FORCE);
        
        // Add repulsion from mouse
        point.vx += (dx / dist) * force * mouseSpeed * 0.1;
        point.vy += (dy / dist) * force * mouseSpeed * 0.1;
      }

      // Pull back to original position with variable strength
      const displacement = Math.sqrt(
        (point.x - point.baseX) ** 2 + 
        (point.y - point.baseY) ** 2
      );
      const springForce = 0.0020 + (displacement / 1000) * 0.001;
      point.vx += (point.baseX - point.x) * springForce;
      point.vy += (point.baseY - point.y) * springForce;

      // Limit velocity
      const speed = Math.sqrt(point.vx * point.vx + point.vy * point.vy);
      if (speed > MAX_VELOCITY) {
        point.vx = (point.vx / speed) * MAX_VELOCITY;
        point.vy = (point.vy / speed) * MAX_VELOCITY;
      }

      // Update position with damping
      point.x += point.vx;
      point.y += point.vy;
      point.vx *= 0.965;
      point.vy *= 0.965;

      // Draw the point
      ctx.beginPath();
      ctx.arc(point.x, point.y, POINT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200, 167, 13, 0.5)';
      ctx.fill();
    });

    // Draw connecting lines
    ctx.lineWidth = 0.3;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const p1 = points[i];
        const p2 = points[j];
        const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

        if (dist < CONNECTION_DISTANCE) {
          const opacity = 1 - dist / CONNECTION_DISTANCE;
          
          // Draw the line
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(184, 67, 13, ${opacity * 0.25})`;
          ctx.stroke();
        }
      }
    }

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
  }

  // The main animation loop
  function animate() {
    draw();
    
    // Slow down mouse velocity
    mouseVelX *= 1.0001;
    mouseVelY *= 1.0001;
    
    frameId = requestAnimationFrame(animate);
  }

  // Handles window resizing
  function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createPoints();
  }

  // Setup when the component is mounted
  onMount(() => {
    ctx = canvas.getContext('2d');
    handleResize();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    animate();
  });

  // Cleanup when the component is destroyed
  onDestroy(() => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('mousemove', handleMouseMove);
    cancelAnimationFrame(frameId);
  });
</script>

<canvas
  bind:this={canvas}
  style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;"
/>
