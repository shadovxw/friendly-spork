import React, { useEffect, useRef } from 'react';

const ConstellationCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Configuration
    const particleCount = window.innerWidth < 768 ? 30 : 60; // Fewer on mobile
    const connectionDistance = 100;
    const mouseDistance = 150;

    let mouse = { x: null, y: null };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight; // Footer is usually smaller, but we'll fit to parent
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      initParticles();
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5; // Velocity X
        this.vy = (Math.random() - 0.5) * 0.5; // Velocity Y
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.5)'; // Cyan
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, i) => {
        particle.update();
        particle.draw();

        // Check connection to mouse
        if (mouse.x != null) {
            const dx = particle.x - mouse.x;
            const dy = particle.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouseDistance) {
                ctx.strokeStyle = `rgba(6, 182, 212, ${1 - distance / mouseDistance})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }

        // Check connection to other particles
        for (let j = i; j < particles.length; j++) {
            const dx = particle.x - particles[j].x;
            const dy = particle.y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / connectionDistance)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    canvas.parentElement.addEventListener('mousemove', handleMouseMove);
    canvas.parentElement.addEventListener('mouseleave', handleMouseLeave);
    
    handleResize(); // Init
    animate(); // Start Loop

    return () => {
        window.removeEventListener('resize', handleResize);
        // Clean up other listeners is tricky with refs, but resize is the main global one
    };
  }, []);

  return (
    <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

export default ConstellationCanvas;