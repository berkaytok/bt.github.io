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

  // Audio context for sound generation
  let audioContext;
  let masterGain;
  let reverbGain;
  let reverb;
  let compressor;
  let soundEnabled = false;
  
  // Voice limiting removed for full musical expression

  // Configuration
  const NUM_POINTS = 20;
  const POINT_RADIUS = 3;
  const CONNECTION_DISTANCE = 250;
  const MOUSE_INFLUENCE_RADIUS = 200;
  const MOUSE_SMOOTHING = 0.4;
  const MAX_VELOCITY = 20;
  const MOUSE_FORCE = 0.5;

  // Pentatonic scale notes (C major pentatonic) - octave 3 for brighter, higher sound
  const pentatonicNotes = [130.81, 146.83, 164.81, 196.00, 220.00]; // C, D, E, G, A in octave 3
  
  // Rectangular grid configuration - 5x4 grid (5 pentatonic notes × 4 octaves)
  const GRID_ROWS = 4; // Y-axis (4 octaves)
  const GRID_COLS = 5; // X-axis (5 pentatonic notes)
  
  // No audio limiting - full strumming expression
  let activeNotes = [];
  
  // Create complete note grid
  const noteGrid = [];
  function initializeNoteGrid() {
    for (let row = 0; row < GRID_ROWS; row++) {
      noteGrid[row] = [];
      for (let col = 0; col < GRID_COLS; col++) {
        // Map columns to pentatonic pattern across multiple octaves
        const noteIndex = col % 5; // 5 notes in pentatonic
        const octaveOffset = Math.floor(col / 5) + row; // Octave increases across columns and rows
        const baseFreq = pentatonicNotes[noteIndex];
        const frequency = baseFreq * Math.pow(2, octaveOffset);
        noteGrid[row][col] = frequency;
      }
    }
  }
  
  
  function getGridCell(x, y) {
    // Offset grid so center is between cells (not on a border)
    const offsetX = x - (window.innerWidth / (GRID_COLS * 2));
    const offsetY = y - (window.innerHeight / (GRID_ROWS * 2));
    
    const col = Math.floor((offsetX / window.innerWidth) * GRID_COLS);
    const row = Math.floor((offsetY / window.innerHeight) * GRID_ROWS);
    
    // Allow negative values and values beyond grid for center silence zone
    return { row, col };
  }


  // Audio setup
  async function initAudio() {
    if (audioContext) return;
    
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume context if suspended
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      // Create compressor/limiter to prevent clipping
      compressor = audioContext.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-12, audioContext.currentTime); // Start compressing at -12dB
      compressor.knee.setValueAtTime(6, audioContext.currentTime); // Soft knee
      compressor.ratio.setValueAtTime(8, audioContext.currentTime); // 8:1 ratio (limiter-like)
      compressor.attack.setValueAtTime(0.001, audioContext.currentTime); // Fast attack
      compressor.release.setValueAtTime(0.1, audioContext.currentTime); // Medium release
      
      // Master gain control - reduced to prevent clipping
      masterGain = audioContext.createGain();
      masterGain.gain.setValueAtTime(0.3, audioContext.currentTime);
      
      // Create reverb effect
      reverb = audioContext.createConvolver();
      createReverbImpulse();
      
      reverbGain = audioContext.createGain();
      reverbGain.gain.setValueAtTime(0.6, audioContext.currentTime); // Increased reverb send
      
      // Connect audio chain: masterGain -> compressor -> destination
      masterGain.connect(compressor);
      compressor.connect(audioContext.destination);
      
      // Connect reverb: reverbGain -> reverb -> compressor
      reverbGain.connect(reverb);
      reverb.connect(compressor);
      
      soundEnabled = true;
      console.log('Audio context created, state:', audioContext.state);
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  function createReverbImpulse() {
    const length = audioContext.sampleRate * 4; // 4 second reverb for longer sustain
    const impulse = audioContext.createBuffer(2, length, audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const decay = Math.pow(1 - i / length, 1.5); // Slower decay
        channelData[i] = (Math.random() * 2 - 1) * decay * 0.15; // Slightly louder reverb
      }
    }
    
    reverb.buffer = impulse;
  }

  function playPluckyTone(frequency, duration = 0.8, volume = 0.1) {
    if (!audioContext || !soundEnabled) return;
    
    const now = audioContext.currentTime;
    
    try {
      
      // Simplified single oscillator for better performance
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      // Configure oscillator for plucky sound
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, now);
      
      // Configure filter for plucky character with extended release
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + duration * 0.3);
      filter.frequency.exponentialRampToValueAtTime(400, now + duration * 0.8);
      filter.Q.setValueAtTime(2, now);
      
      // Configure plucky envelope with shorter, more responsive release
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(volume * 0.7, now + 0.2); // Shorter sustain
      gainNode.gain.exponentialRampToValueAtTime(volume * 0.3, now + duration * 0.6); // Reduced sustain
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration * 1.2); // Shorter total release
      
      // Connect simplified audio graph
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(masterGain);
      gainNode.connect(reverbGain);
      
      // Start and stop with shorter duration
      const totalDuration = duration * 1.2; // Match the shorter envelope
      oscillator.start(now);
      oscillator.stop(now + totalDuration);
      
      // Track active notes
      activeNotes.push(oscillator);
      
      // Remove from active notes when done
      oscillator.onended = () => {
        const index = activeNotes.indexOf(oscillator);
        if (index > -1) activeNotes.splice(index, 1);
      };
      
    } catch (error) {
      console.error('Error playing plucky tone:', error);
    }
  }

  async function toggleSound() {
    try {
      if (!audioContext) {
        await initAudio();
        console.log('Audio initialized');
      } else {
        soundEnabled = !soundEnabled;
        if (soundEnabled && audioContext.state === 'suspended') {
          await audioContext.resume();
          console.log('Audio context resumed');
        }
      }
      
      // Play a test tone when enabling sound - reduced volume
      if (soundEnabled) {
        playPluckyTone(220, 0.8, 0.05);
        console.log('Test tone played');
      }
      
      console.log('Sound enabled:', soundEnabled, 'Audio context state:', audioContext?.state);
    } catch (error) {
      console.error('Audio error:', error);
    }
  }

  function createPoints() {
    points = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    for (let i = 0; i < NUM_POINTS; i++) {
      const initialRadius = 250;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * initialRadius;
      
      const spreadAngle = Math.random() * Math.PI * 2;
      const spreadSpeed = 2 + Math.random() * 3;
      
      const startX = centerX + Math.cos(angle) * radius;
      const startY = centerY + Math.sin(angle) * radius;
      const startCell = getGridCell(startX, startY);
      
      points.push({
        x: startX,
        y: startY,
        vx: Math.cos(spreadAngle) * spreadSpeed,
        vy: Math.sin(spreadAngle) * spreadSpeed,
        baseX: Math.random() * window.innerWidth,
        baseY: Math.random() * window.innerHeight,
        currentCell: startCell
      });
    }
  }

  function handleMouseMove(e) {
    const newMouseX = e.clientX;
    const newMouseY = e.clientY;
    
    mouseVelX = (newMouseX - mouseX) * MOUSE_SMOOTHING;
    mouseVelY = (newMouseY - mouseY) * MOUSE_SMOOTHING;
    
    mouseX = newMouseX;
    mouseY = newMouseY;
  }


  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Magma-inspired color progression based on time
    const time = Date.now() * 0.0003; // Slower color evolution
    const progress = (Math.sin(time) + 1) / 2; // 0 to 1 oscillation
    
    // RockON color palette interpolation
    const rockOnColors = {
      dark: [1, 2, 33],       // Deep blue-black (#010221)
      mid: [183, 191, 153],   // Sage green (#B7BF99)
      bright: [196, 51, 2],   // Burnt orange (#C43302)
      hot: [237, 170, 37]     // Golden yellow (#EDAA25)
    };
    
    const bgColor1 = `rgba(${rockOnColors.dark[0]}, ${rockOnColors.dark[1]}, ${rockOnColors.dark[2]}, 0.8)`;
    const bgColor2 = `rgba(${Math.floor(rockOnColors.mid[0] * progress)}, ${Math.floor(rockOnColors.mid[1] * progress)}, ${Math.floor(rockOnColors.mid[2] * progress)}, 0.3)`;
    
    // Draw gradient background with magma colors
    const gradient = ctx.createRadialGradient(
      canvas.width * 0.5, canvas.height * 0.5, 0,
      canvas.width * 0.5, canvas.height * 0.5, Math.max(canvas.width, canvas.height) * 0.8
    );
    gradient.addColorStop(0, bgColor1);
    gradient.addColorStop(1, bgColor2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
        
        point.vx += (Math.cos(angle + scatter) * mouseSpeed * force * MOUSE_FORCE);
        point.vy += (Math.sin(angle + scatter) * mouseSpeed * force * MOUSE_FORCE);
        
        point.vx += (dx / dist) * force * mouseSpeed * 0.1;
        point.vy += (dy / dist) * force * mouseSpeed * 0.1;
        
        // No mouse interaction sounds - only grid line crossings create sound
      }

      // Add gentle floating motion
      point.vx += (Math.random() - 0.5) * 0.02;
      point.vy += (Math.random() - 0.5) * 0.02;
      
      // Gentle gravitational pull towards center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const toCenterX = centerX - point.x;
      const toCenterY = centerY - point.y;
      const distanceToCenter = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY);
      
      if (distanceToCenter > 0) {
        const gravitationalForce = 0.008; // Much gentler pull
        const normalizedX = toCenterX / distanceToCenter;
        const normalizedY = toCenterY / distanceToCenter;
        
        point.vx += normalizedX * gravitationalForce;
        point.vy += normalizedY * gravitationalForce;
      }

      // Limit velocity
      const speed = Math.sqrt(point.vx * point.vx + point.vy * point.vy);
      if (speed > MAX_VELOCITY) {
        point.vx = (point.vx / speed) * MAX_VELOCITY;
        point.vy = (point.vy / speed) * MAX_VELOCITY;
      }

      // Update position
      point.x += point.vx;
      point.y += point.vy;
      
      // Boundary collision detection
      if (point.x <= POINT_RADIUS) {
        point.x = POINT_RADIUS;
        point.vx = Math.abs(point.vx) * 0.8;
      } else if (point.x >= canvas.width - POINT_RADIUS) {
        point.x = canvas.width - POINT_RADIUS;
        point.vx = -Math.abs(point.vx) * 0.8;
      }
      
      if (point.y <= POINT_RADIUS) {
        point.y = POINT_RADIUS;
        point.vy = Math.abs(point.vy) * 0.8;
      } else if (point.y >= canvas.height - POINT_RADIUS) {
        point.y = canvas.height - POINT_RADIUS;
        point.vy = -Math.abs(point.vy) * 0.8;
      }
      
      point.vx *= 0.965;
      point.vy *= 0.965;

      // Check for grid line crossing - strumming effect
      const newCell = getGridCell(point.x, point.y);
      
      if (newCell.row !== point.currentCell.row || newCell.col !== point.currentCell.col) {
        // Calculate particle velocity for strumming intensity
        const particleSpeed = Math.sqrt(point.vx * point.vx + point.vy * point.vy);
        
        // Only trigger if both row and col are valid (not in center silence zone)
        // AND particle has sufficient velocity (like strumming a string)
        if (newCell.row >= 0 && newCell.row < GRID_ROWS && 
            newCell.col >= 0 && newCell.col < GRID_COLS && 
            particleSpeed > 1.5) { // Minimum velocity threshold for strumming
          
          const cellNote = noteGrid[newCell.row][newCell.col];
          
          // Volume based purely on individual particle velocity (strumming force)
          // Scale particle speed to volume range: slow particles = quiet, fast particles = loud
          const minVolume = 0.02; // Minimum volume for slow crossings
          const maxVolume = 0.12; // Maximum volume for fast crossings
          const velocityRange = Math.min(1.0, (particleSpeed - 1.5) / 15); // Normalize speed to 0-1 range
          const strumVolume = minVolume + (velocityRange * (maxVolume - minVolume));
          const strumDuration = Math.min(1.2, 0.4 + particleSpeed * 0.1);
          
          playPluckyTone(cellNote, strumDuration, strumVolume);
        }
        point.currentCell = newCell;
      }

      // Draw point with magma colors
      ctx.beginPath();
      ctx.arc(point.x, point.y, POINT_RADIUS, 0, Math.PI * 2);
      
      // Interpolate through magma palette based on point index and movement
      const pointProgress = ((index / points.length) + progress * 0.5) % 1;
      const pointSpeed = Math.sqrt(point.vx * point.vx + point.vy * point.vy);
      const intensity = Math.min(1, pointSpeed / 10);
      
      let r, g, b;
      if (pointProgress < 0.33) {
        // Dark to green transition
        const t = pointProgress / 0.33;
        r = Math.floor(rockOnColors.dark[0] + (rockOnColors.mid[0] - rockOnColors.dark[0]) * t);
        g = Math.floor(rockOnColors.dark[1] + (rockOnColors.mid[1] - rockOnColors.dark[1]) * t);
        b = Math.floor(rockOnColors.dark[2] + (rockOnColors.mid[2] - rockOnColors.dark[2]) * t);
      } else if (pointProgress < 0.66) {
        // Green to orange transition
        const t = (pointProgress - 0.33) / 0.33;
        r = Math.floor(rockOnColors.mid[0] + (rockOnColors.bright[0] - rockOnColors.mid[0]) * t);
        g = Math.floor(rockOnColors.mid[1] + (rockOnColors.bright[1] - rockOnColors.mid[1]) * t);
        b = Math.floor(rockOnColors.mid[2] + (rockOnColors.bright[2] - rockOnColors.mid[2]) * t);
      } else {
        // Orange to yellow transition
        const t = (pointProgress - 0.66) / 0.34;
        r = Math.floor(rockOnColors.bright[0] + (rockOnColors.hot[0] - rockOnColors.bright[0]) * t);
        g = Math.floor(rockOnColors.bright[1] + (rockOnColors.hot[1] - rockOnColors.bright[1]) * t);
        b = Math.floor(rockOnColors.bright[2] + (rockOnColors.hot[2] - rockOnColors.bright[2]) * t);
      }
      
      // Brighten based on movement intensity - much brighter overall
      const alpha = 0.9 + intensity * 0.1; // Higher base opacity
      ctx.fillStyle = `rgba(${Math.min(255, r * 1.3)}, ${Math.min(255, g * 1.3)}, ${Math.min(255, b * 1.3)}, ${alpha})`;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const p1 = points[i];
        const p2 = points[j];
        const dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

        if (dist < CONNECTION_DISTANCE) {
          const opacity = 1 - dist / CONNECTION_DISTANCE;
          
          const midX = (p1.x + p2.x) * 0.5;
          const midY = (p1.y + p2.y) * 0.5;
          
          const gravitySag = dist * 0.08;
          const curvature = dist * 0.25;
          const perpX = -(p2.y - p1.y) / dist;
          const perpY = (p2.x - p1.x) / dist;
          
          const timeOffset = Date.now() * 0.0008 + i + j;
          const waveAmount = Math.sin(timeOffset) * 1.5;
          const controlX = midX + perpX * curvature * waveAmount;
          const controlY = midY + perpY * curvature * waveAmount + gravitySag;
          
          const baseThickness = 0.2;
          const thicknessFactor = 1 + Math.abs(waveAmount) * 0.5 + (1 - opacity) * 0.1;
          ctx.lineWidth = baseThickness * thicknessFactor;
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(controlX, controlY, p2.x, p2.y);
          
          // Use RockON colors for connections
          const connectionProgress = ((i + j) / (points.length * 2) + progress * 0.3) % 1;
          let lineR, lineG, lineB;
          
          if (connectionProgress < 0.5) {
            // Dark green to orange
            const t = connectionProgress / 0.5;
            lineR = Math.floor(rockOnColors.mid[0] + (rockOnColors.bright[0] - rockOnColors.mid[0]) * t);
            lineG = Math.floor(rockOnColors.mid[1] + (rockOnColors.bright[1] - rockOnColors.mid[1]) * t);
            lineB = Math.floor(rockOnColors.mid[2] + (rockOnColors.bright[2] - rockOnColors.mid[2]) * t);
          } else {
            // Orange to yellow
            const t = (connectionProgress - 0.5) / 0.5;
            lineR = Math.floor(rockOnColors.bright[0] + (rockOnColors.hot[0] - rockOnColors.bright[0]) * t);
            lineG = Math.floor(rockOnColors.bright[1] + (rockOnColors.hot[1] - rockOnColors.bright[1]) * t);
            lineB = Math.floor(rockOnColors.bright[2] + (rockOnColors.hot[2] - rockOnColors.bright[2]) * t);
          }
          
          // Brighten connection lines significantly
          const brightenedR = Math.min(255, lineR * 1.4);
          const brightenedG = Math.min(255, lineG * 1.4);
          const brightenedB = Math.min(255, lineB * 1.4);
          ctx.strokeStyle = `rgba(${brightenedR}, ${brightenedG}, ${brightenedB}, ${opacity * 0.8})`;
          ctx.stroke();
        }
      }
    }

    // Grid removed - zen zone should be clean

    ctx.globalCompositeOperation = 'source-over';
  }

  function animate() {
    draw();
    
    // No ambient tones - purely interactive strumming-based audio
    
    mouseVelX *= 0.965;
    mouseVelY *= 0.965;
    frameId = requestAnimationFrame(animate);
  }

  function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createPoints();
  }

  onMount(() => {
    initializeNoteGrid();
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

<div class="zen-container">
  <canvas
    bind:this={canvas}
    style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; background: #000;"
  />
  
  <!-- Simple back button -->
  <a href="#/home" class="back-button">← Back to Home</a>
  
  <!-- Sound toggle button -->
  <button class="sound-button" on:click={toggleSound}>
    {#if soundEnabled}
      🔊 Sound On
    {:else}
      🔇 Sound Off
    {/if}
  </button>
</div>

<style>
  .zen-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: #000;
  }

  .back-button {
    position: fixed;
    top: 20px;
    left: 20px;
    padding: 12px 20px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-size: 14px;
    transition: all 0.2s ease;
    z-index: 100;
  }

  .back-button:hover {
    background: rgba(0, 0, 0, 0.9);
    color: white;
    transform: translateY(-1px);
  }

  .sound-button {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 100;
  }

  .sound-button:hover {
    background: rgba(0, 0, 0, 0.9);
    color: white;
    transform: translateY(-1px);
  }
</style>