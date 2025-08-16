<script>
  import { onMount, onDestroy } from 'svelte';

  export let currentRoute = 'home';

  let canvas;
  let ctx;
  let points = [];
  let mouseX = 0;
  let mouseY = 0;
  let mouseVelX = 0;
  let mouseVelY = 0;
  let frameId;

  // --- Configuration ---
  const NUM_POINTS = 100;
  const POINT_RADIUS = 3;
  const CONNECTION_DISTANCE = 250;
  const MOUSE_INFLUENCE_RADIUS = 250;
  const MOUSE_SMOOTHING = 0.4;
  const MAX_VELOCITY = 25;
  const MOUSE_FORCE = 0.5;

  // Color schemes for different sections
  const colorSchemes = {
    home: {
      point: 'rgba(255, 255, 255, 0.1)',
      line: 'rgba(255, 255, 255, 0.25)',
      gradient: {
        inner: 'rgba(4, 120, 87, 0.04)',
        outer: 'rgba(6, 78, 59, 0.15)'
      }
    },
    geospatial: {
      point: 'rgba(184, 67, 13, 0.1)',
      line: 'rgba(184, 67, 13, 0.5)',
      gradient: {
        inner: 'rgba(184, 67, 13, 0.04)',
        outer: 'rgba(146, 34, 6, 0.15)'
      }
    },
    cinematography: {
      point: 'rgba(45, 212, 191, 0.1)',
      line: 'rgba(20, 184, 166, 0.5)',
      gradient: {
        inner: 'rgba(45, 212, 191, 0.04)',
        outer: 'rgba(20, 184, 166, 0.15)'
      }
    },
    agriculture: {
      point: 'rgba(34, 197, 94, 0.1)',
      line: 'rgba(34, 197, 94, 0.5)',
      gradient: {
        inner: 'rgba(34, 197, 94, 0.04)',
        outer: 'rgba(22, 163, 74, 0.15)'
      }
    },
    inspections: {
      point: 'rgba(99, 102, 241, 0.1)',
      line: 'rgba(99, 102, 241, 0.5)',
      gradient: {
        inner: 'rgba(99, 102, 241, 0.04)',
        outer: 'rgba(79, 70, 229, 0.15)'
      }
    },
    research: {
      point: 'rgba(168, 85, 247, 0.1)',
      line: 'rgba(168, 85, 247, 0.5)',
      gradient: {
        inner: 'rgba(168, 85, 247, 0.04)',
        outer: 'rgba(147, 51, 234, 0.15)'
      }
    },
    contact: {
      point: 'rgba(245, 158, 11, 0.1)',
      line: 'rgba(245, 158, 11, 0.5)',
      gradient: {
        inner: 'rgba(245, 158, 11, 0.04)',
        outer: 'rgba(217, 119, 6, 0.15)'
      }
    }
  };
  // --- End Configuration ---

  // Current color values (will be updated smoothly)
  let currentPointColor = { r: 255, g: 255, b: 255, a: 0.6 };
  let currentLineColor = { r: 255, g: 255, b: 255, a: 0.25 };
  let targetPointColor = { r: 255, g: 255, b: 255, a: 0.6 };
  let targetLineColor = { r: 255, g: 255, b: 255, a: 0.25 };
  
  // Gradient color values (will be updated smoothly)
  let currentGradientInner = { r: 4, g: 120, b: 87, a: 0.04 };
  let currentGradientOuter = { r: 6, g: 78, b: 59, a: 0.15 };
  let targetGradientInner = { r: 4, g: 120, b: 87, a: 0.04 };
  let targetGradientOuter = { r: 6, g: 78, b: 59, a: 0.15 };

  // Extract RGBA values from color string
  function parseRGBA(colorStr) {
    const matches = colorStr.match(/rgba?\(([^)]+)\)/);
    if (!matches) return { r: 255, g: 255, b: 255, a: 1 };
    const values = matches[1].split(',').map(n => parseFloat(n.trim()));
    return { r: values[0], g: values[1], b: values[2], a: values[3] || 1 };
  }

  // Update target colors when route changes
  $: {
    const scheme = colorSchemes[currentRoute] || colorSchemes.home;
    const colors = Array.isArray(scheme) ? scheme[0] : scheme;
    targetPointColor = parseRGBA(colors.point);
    targetLineColor = parseRGBA(colors.line);
    targetGradientInner = parseRGBA(colors.gradient.inner);
    targetGradientOuter = parseRGBA(colors.gradient.outer);
  }

  // Smooth color interpolation (like CSS transitions)
  function lerpColor(current, target, speed = 0.1) {
    return {
      r: current.r + (target.r - current.r) * speed,
      g: current.g + (target.g - current.g) * speed,
      b: current.b + (target.b - current.b) * speed,
      a: current.a + (target.a - current.a) * speed
    };
  }

  // Get colors for current section
  function getColors(pointIndex = 0) {
    const scheme = colorSchemes[currentRoute] || colorSchemes.home;
    
    if (Array.isArray(scheme)) {
      // For research/contact sections with multiple colors
      const colorIndex = pointIndex % scheme.length;
      return scheme[colorIndex];
    }
    
    // Use smoothly interpolated colors for single-color schemes
    return {
      point: `rgba(${Math.round(currentPointColor.r)}, ${Math.round(currentPointColor.g)}, ${Math.round(currentPointColor.b)}, ${currentPointColor.a})`,
      line: `rgba(${Math.round(currentLineColor.r)}, ${Math.round(currentLineColor.g)}, ${Math.round(currentLineColor.b)}, ${currentLineColor.a})`
    };
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
      const spreadSpeed = 2 + Math.random() * 3; // Random speed between 2-5
      
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

  // Draws everything onto the canvas
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dynamic gradient background with smooth transitions
    const gradient = ctx.createRadialGradient(
      canvas.width * 0.5, canvas.height * 0.5, 0,
      canvas.width * 0.5, canvas.height * 0.5, Math.max(canvas.width, canvas.height) * 0.8
    );
    const innerColor = `rgba(${Math.round(currentGradientInner.r)}, ${Math.round(currentGradientInner.g)}, ${Math.round(currentGradientInner.b)}, ${currentGradientInner.a})`;
    const outerColor = `rgba(${Math.round(currentGradientOuter.r)}, ${Math.round(currentGradientOuter.g)}, ${Math.round(currentGradientOuter.b)}, ${currentGradientOuter.a})`;
    gradient.addColorStop(0, innerColor);
    gradient.addColorStop(1, outerColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the constellation with lighter blend mode
    ctx.globalCompositeOperation = 'lighter';

    // Update and draw points
    points.forEach((point, index) => {
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

      // Add gentle floating motion for free movement
      point.vx += (Math.random() - 0.5) * 0.02;
      point.vy += (Math.random() - 0.5) * 0.02;

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

      // Draw the point with dynamic color
      const colors = getColors(index);
      ctx.beginPath();
      ctx.arc(point.x, point.y, POINT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = colors.point;
      ctx.fill();
    });

    // Draw connecting lines with enhanced fluid effects
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const p1 = points[i];
        const p2 = points[j];
        const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

        if (dist < CONNECTION_DISTANCE) {
          const opacity = 1 - dist / CONNECTION_DISTANCE;
          
          // Use colors from first point for line
          const colors1 = getColors(i);
          
          // Extract RGBA values and blend if colors are different
          let lineColor = colors1.line;
          if (Array.isArray(colorSchemes[currentRoute])) {
            // For multi-color sections, use a blended approach
            const baseOpacity = opacity * 0.25;
            lineColor = colors1.line.replace(/[\d\.]+\)$/, `${baseOpacity})`);
          }
          
          // Create fluid curve with gravity sag
          const midX = (p1.x + p2.x) * 0.5;
          const midY = (p1.y + p2.y) * 0.5;
          
          // Add gravity sag - lines droop downward
          const gravitySag = dist * 0.08; // Gravity effect based on distance
          const curvature = dist * 0.25; // Base curve amount
          const perpX = -(p2.y - p1.y) / dist; // Perpendicular direction
          const perpY = (p2.x - p1.x) / dist;
          
          // Control point with wave motion and gravity (slower movement)
          const timeOffset = Date.now() * 0.0008 + i + j; // Slowed down from 0.002
          const waveAmount = Math.sin(timeOffset) * 1.5;
          const controlX = midX + perpX * curvature * waveAmount;
          const controlY = midY + perpY * curvature * waveAmount + gravitySag; // Add gravity
          
          // Variable thickness based on curve intensity and distance
          const baseThickness = 0.2;
          const thicknessFactor = 1 + Math.abs(waveAmount) * 0.5 + (1 - opacity) * 0.1;
          ctx.lineWidth = baseThickness * thicknessFactor;
          
          // Draw curved line
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(controlX, controlY, p2.x, p2.y);
          ctx.strokeStyle = lineColor;
          ctx.stroke();
        }
      }
    }

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
  }

  // The main animation loop
  function animate() {
    // Smooth color transitions (similar to CSS ease-in-out)
    currentPointColor = lerpColor(currentPointColor, targetPointColor, 0.05);
    currentLineColor = lerpColor(currentLineColor, targetLineColor, 0.05);
    
    // Very slow gradient transitions
    currentGradientInner = lerpColor(currentGradientInner, targetGradientInner, 0.01);
    currentGradientOuter = lerpColor(currentGradientOuter, targetGradientOuter, 0.01);
    
    draw();
    
    // Slow down mouse velocity
    mouseVelX *= 0.965;
    mouseVelY *= 0.965;
    
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
