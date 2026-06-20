import { useEffect, useRef } from 'react';

const InteractiveGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: -1000, y: -1000, active: false };
    
    // Grid animation settings
    const gridSize = 48;
    let offsetX = 0;
    let offsetY = 0;
    
    // Traveling light pulses list
    let pulses = [];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const drawGrid = () => {
      ctx.clearRect(0, 0, width, height);

      // Increment offsets for very slow, smooth drifting animation
      offsetX = (offsetX + 0.05) % gridSize;
      offsetY = (offsetY + 0.05) % gridSize;

      ctx.lineWidth = 1;

      // Draw vertical grid lines - Subtle base opacity for background feel
      for (let x = offsetX; x < width; x += gridSize) {
        let alpha = 0.05; // Toned down from 0.12 to 0.05
        if (mouse.active) {
          const dist = Math.abs(x - mouse.x);
          if (dist < 150) { // Toned down from 200
            alpha += (1 - dist / 150) * 0.12; // Toned down from 0.25
          }
        }
        ctx.strokeStyle = `rgba(11, 21, 40, ${alpha})`; // Theme navy blue #0B1528
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw horizontal grid lines - Subtle base opacity for background feel
      for (let y = offsetY; y < height; y += gridSize) {
        let alpha = 0.05; // Toned down from 0.12 to 0.05
        if (mouse.active) {
          const dist = Math.abs(y - mouse.y);
          if (dist < 150) { // Toned down from 200
            alpha += (1 - dist / 150) * 0.12; // Toned down from 0.25
          }
        }
        ctx.strokeStyle = `rgba(11, 21, 40, ${alpha})`; // Theme navy blue #0B1528
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Randomly spawn traveling light pulses along grid lines - Subtle spawn rate
      if (Math.random() < 0.02 && pulses.length < 8) { // Toned down from 0.035 and 15
        const isVertical = Math.random() > 0.5;
        if (isVertical) {
          // Align with a vertical line index
          const lineX = Math.round((Math.random() * width - offsetX) / gridSize) * gridSize + offsetX;
          pulses.push({
            x: lineX,
            y: 0,
            direction: 'down',
            speed: 1.5 + Math.random() * 2.5, // Standard speed
            length: 80 + Math.random() * 120, // Standard length
            opacity: 0.3 + Math.random() * 0.3, // Standard opacity
            isVertical: true
          });
        } else {
          // Align with a horizontal line index
          const lineY = Math.round((Math.random() * height - offsetY) / gridSize) * gridSize + offsetY;
          pulses.push({
            x: 0,
            y: lineY,
            direction: 'right',
            speed: 1.5 + Math.random() * 2.5, // Standard speed
            length: 80 + Math.random() * 120, // Standard length
            opacity: 0.3 + Math.random() * 0.3, // Standard opacity
            isVertical: false
          });
        }
      }

      // Update and draw traveling pulses - Subtle width
      pulses = pulses.filter(pulse => {
        ctx.lineWidth = 2.2; // Toned down line width from 3.2
        const pulseGradient = ctx.createLinearGradient(
          pulse.x, 
          pulse.y, 
          pulse.isVertical ? pulse.x : pulse.x - pulse.length,
          pulse.isVertical ? pulse.y - pulse.length : pulse.y
        );

        pulseGradient.addColorStop(0, `rgba(245, 146, 27, ${pulse.opacity})`); // glowing orange head
        pulseGradient.addColorStop(0.35, `rgba(59, 130, 246, ${pulse.opacity * 0.75})`); // blue transition
        pulseGradient.addColorStop(1, 'rgba(59, 130, 246, 0)'); // fade out tail

        ctx.strokeStyle = pulseGradient;
        ctx.beginPath();

        if (pulse.isVertical) {
          ctx.moveTo(pulse.x, pulse.y);
          ctx.lineTo(pulse.x, Math.max(0, pulse.y - pulse.length));
          pulse.y += pulse.speed;
        } else {
          ctx.moveTo(pulse.x, pulse.y);
          ctx.lineTo(Math.max(0, pulse.x - pulse.length), pulse.y);
          pulse.x += pulse.speed;
        }
        ctx.stroke();

        if (pulse.isVertical) {
          return pulse.y - pulse.length < height;
        } else {
          return pulse.x - pulse.length < width;
        }
      });

      // Draw active cell indicator or hover glow
      if (mouse.active) {
        const cellX = Math.floor((mouse.x - offsetX) / gridSize) * gridSize + offsetX;
        const cellY = Math.floor((mouse.y - offsetY) / gridSize) * gridSize + offsetY;

        // Draw radial highlight behind mouse
        const radialGradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 150 // Toned down from 200
        );
        radialGradient.addColorStop(0, 'rgba(245, 146, 27, 0.08)'); // Toned down from 0.16
        radialGradient.addColorStop(1, 'rgba(245, 146, 27, 0)');
        ctx.fillStyle = radialGradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 150, 0, Math.PI * 2);
        ctx.fill();

        // Draw hover cell highlight - Subtle cell selection opacity
        ctx.strokeStyle = 'rgba(245, 146, 27, 0.35)'; // Toned down from 0.6
        ctx.lineWidth = 1.5; // Toned down from 2.0
        ctx.strokeRect(cellX, cellY, gridSize, gridSize);
      }

      requestAnimationFrame(drawGrid);
    };

    drawGrid();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.65 }} // Toned down from 1.0 to 0.65
    />
  );
};

export default InteractiveGrid;
