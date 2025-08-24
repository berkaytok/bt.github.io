<script>
  import { onMount, onDestroy } from 'svelte';
  import { getSectionColors } from './theme.js';

  export let currentRoute = 'home';

  let canvas;
  let ctx;
  let spherePoints = [];
  let mouseX = 0;
  let mouseY = 0;
  let mouseVelX = 0;
  let mouseVelY = 0;
  let isFirstMouseMove = true;
  let frameId;
  let time = 0;
  let mouseInfluenceStrength = 0;
  
  // Cached values for performance
  let cachedColors = null;
  let cachedMouseSpeed = 0;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let cachedGradient = null;
  let isVisible = true;

  // --- Sphere Configuration ---
  const SPHERE_POINTS = 120;
  const SPHERE_RADIUS = 200;
  const POINT_RADIUS = 1;
  const CONNECTION_DISTANCE = 80;
  const ROTATION_SPEED = 0.008;
  
  // --- Mouse Interaction ---
  const MOUSE_INFLUENCE_RADIUS = 200;
  const MOUSE_SMOOTHING = 0.85;
  const MOUSE_FORCE = 8;
  const DISMANTLING_FORCE = 10;
  const RESTORATION_FORCE = 0.0001;
  const MAX_DISPLACEMENT = 600;
  
  // --- Physics Constants ---
  const DAMPING_FACTOR = 0.92;
  const VELOCITY_DAMPING = 0.96;
  
  // --- Visual Constants ---
  const LINE_WIDTH = 1.2;
  const GRADIENT_RADIUS_MULTIPLIER = 1.2;

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

  // Creates spherical wireframe points using fibonacci spiral distribution
  function createSpherePoints() {
    spherePoints = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < SPHERE_POINTS; i++) {
      // Fibonacci sphere distribution for even point placement
      const theta = Math.acos(1 - 2 * i / SPHERE_POINTS);
      const phi = Math.PI * (1 + Math.sqrt(5)) * i;
      
      // Convert spherical to cartesian coordinates
      const x3d = Math.sin(theta) * Math.cos(phi);
      const y3d = Math.sin(theta) * Math.sin(phi);
      const z3d = Math.cos(theta);
      
      spherePoints.push({
        x3d: x3d,
        y3d: y3d,
        z3d: z3d,
        x: centerX + x3d * SPHERE_RADIUS,
        y: centerY + y3d * SPHERE_RADIUS,
        z: z3d * SPHERE_RADIUS,
        originalX: x3d,
        originalY: y3d,
        originalZ: z3d,
        targetX: centerX + x3d * SPHERE_RADIUS,
        targetY: centerY + y3d * SPHERE_RADIUS,
        vx: 0,
        vy: 0,
        displacement: 0,
        brightness: Math.random() * 0.5 + 0.5,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
  }

  // Updates mouse influence strength based on movement
  function updateMouseInfluence() {
    // Calculate mouse velocity and update influence strength
    const currentVelocity = Math.sqrt(mouseVelX * mouseVelX + mouseVelY * mouseVelY);
    mouseInfluenceStrength = Math.min(1, currentVelocity / 10);
    
    // Gradual decay of influence when mouse stops moving
    mouseInfluenceStrength *= 0.95;
  }

  // Tracks mouse movement and velocity
  function handleMouseMove(e) {
    const newMouseX = e.clientX;
    const newMouseY = e.clientY;
    
    // Skip velocity calculation on first mouse move to prevent initial jump
    if (isFirstMouseMove) {
      mouseX = newMouseX;
      mouseY = newMouseY;
      mouseVelX = 0;
      mouseVelY = 0;
      isFirstMouseMove = false;
      return;
    }
    
    // Calculate velocity with enhanced responsiveness
    const rawVelX = newMouseX - mouseX;
    const rawVelY = newMouseY - mouseY;
    
    mouseVelX = mouseVelX * MOUSE_SMOOTHING + rawVelX * (1 - MOUSE_SMOOTHING);
    mouseVelY = mouseVelY * MOUSE_SMOOTHING + rawVelY * (1 - MOUSE_SMOOTHING);
    
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

  // Main drawing function with wireframe dismantling effects
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 1;

    // Cache canvas dimensions and update mouse influence
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    updateMouseInfluence();

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    // Draw gradient background
    if (cachedGradient) {
      ctx.fillStyle = cachedGradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // Apply additive blend mode for glowing effects
    ctx.globalCompositeOperation = 'lighter';

    // Update sphere rotation and mouse interaction
    spherePoints.forEach((point) => {
      // Calculate base sphere rotation
      const rotY = time * ROTATION_SPEED;
      const rotX = time * ROTATION_SPEED * 0.7;
      
      // Apply 3D rotation matrices
      let x = point.originalX;
      let y = point.originalY;
      let z = point.originalZ;
      
      // Rotation around Y axis
      let newX = x * Math.cos(rotY) - z * Math.sin(rotY);
      let newZ = x * Math.sin(rotY) + z * Math.cos(rotY);
      
      // Rotation around X axis  
      let newY = y * Math.cos(rotX) - newZ * Math.sin(rotX);
      newZ = y * Math.sin(rotX) + newZ * Math.cos(rotX);
      
      // Store 3D coordinates
      point.x3d = newX;
      point.y3d = newY;
      point.z3d = newZ;
      
      // Calculate target position (ideal sphere position)
      const perspective = 300;
      const scale = perspective / (perspective + newZ * 100);
      point.targetX = centerX + newX * SPHERE_RADIUS * scale;
      point.targetY = centerY + newY * SPHERE_RADIUS * scale;
      point.z = newZ * SPHERE_RADIUS;
      
      // Calculate mouse influence
      const dx = mouseX - point.x;
      const dy = mouseY - point.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < MOUSE_INFLUENCE_RADIUS && mouseInfluenceStrength > 0.1) {
        // Dismantle effect - push points away from mouse
        const influence = (1 - dist / MOUSE_INFLUENCE_RADIUS) * mouseInfluenceStrength;
        const forceX = (dx / dist) * influence * DISMANTLING_FORCE * -1; // Negative to push away
        const forceY = (dy / dist) * influence * DISMANTLING_FORCE * -1;
        
        point.vx += forceX;
        point.vy += forceY;
        point.displacement = Math.min(point.displacement + influence * 2, 1);
      } else {
        // Restoration force - pull points back to sphere
        const restoreX = (point.targetX - point.x) * RESTORATION_FORCE;
        const restoreY = (point.targetY - point.y) * RESTORATION_FORCE;
        
        point.vx += restoreX;
        point.vy += restoreY;
        point.displacement *= 0.995; // Gradually reduce displacement
      }
      
      // Apply velocity with damping
      point.vx *= VELOCITY_DAMPING;
      point.vy *= VELOCITY_DAMPING;
      
      // Update position
      point.x += point.vx;
      point.y += point.vy;
      
      // Boundary collision detection - bounce off canvas edges
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
      
      // Limit maximum displacement from sphere
      const distFromTarget = Math.sqrt(
        (point.x - point.targetX) ** 2 + (point.y - point.targetY) ** 2
      );
      if (distFromTarget > MAX_DISPLACEMENT) {
        const angle = Math.atan2(point.y - point.targetY, point.x - point.targetX);
        point.x = point.targetX + Math.cos(angle) * MAX_DISPLACEMENT;
        point.y = point.targetY + Math.sin(angle) * MAX_DISPLACEMENT;
      }
    });

    // Draw wireframe connections with disruption effects
    ctx.lineWidth = LINE_WIDTH;
    for (let i = 0; i < spherePoints.length; i++) {
      const p1 = spherePoints[i];
      
      for (let j = i + 1; j < spherePoints.length; j++) {
        const p2 = spherePoints[j];
        
        // Calculate 3D distance for original sphere connections
        const dx3d = p1.x3d - p2.x3d;
        const dy3d = p1.y3d - p2.y3d;
        const dz3d = p1.z3d - p2.z3d;
        const dist3d = Math.sqrt(dx3d * dx3d + dy3d * dy3d + dz3d * dz3d);
        
        if (dist3d < 0.8) { // 3D connection threshold
          // Calculate current 2D distance
          const currentDist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          
          // Connection strength based on displacement and distance
          const avgDisplacement = (p1.displacement + p2.displacement) / 2;
          const avgZ = (p1.z + p2.z) / 2;
          const depthOpacity = Math.max(0.05, 1 - Math.abs(avgZ) / SPHERE_RADIUS);
          const distanceOpacity = Math.max(0.1, 1 - (currentDist / (CONNECTION_DISTANCE * 3)));
          const disruptionOpacity = 1 - avgDisplacement * 0.7; // Reduce opacity when disrupted
          
          const finalOpacity = depthOpacity * distanceOpacity * disruptionOpacity * 0.6;
          
          if (finalOpacity > 0.05) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = cachedColors.line.replace(')', `, ${finalOpacity})`).replace('rgb', 'rgba');
            ctx.stroke();
          }
        }
      }
    }

    // Draw sphere points with displacement effects
    spherePoints.forEach((point) => {
      const depthBrightness = Math.max(0.2, 1 - Math.abs(point.z) / SPHERE_RADIUS);
      const pulse = Math.sin(time * 0.05 + point.pulsePhase) * 0.3 + 0.7;
      const displacementGlow = 1 + point.displacement * 2; // Glow more when displaced
      const brightness = point.brightness * depthBrightness * pulse * displacementGlow;
      
      ctx.beginPath();
      ctx.arc(point.x, point.y, POINT_RADIUS * (0.5 + brightness * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = cachedColors.point.replace(')', `, ${Math.min(1, brightness)})`).replace('rgb', 'rgba');
      ctx.fill();
      
      // Enhanced glow effect for displaced points
      if (point.displacement > 0.3) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, POINT_RADIUS * (3 + point.displacement * 2), 0, Math.PI * 2);
        ctx.fillStyle = cachedColors.point.replace(')', `, ${point.displacement * 0.1})`).replace('rgb', 'rgba');
        ctx.fill();
      }
    });

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
    createSpherePoints();
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