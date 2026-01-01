import { useEffect, useRef } from 'react';

/**
 * StarsCanvas Component
 * Optimized starfield animation using HTML5 Canvas
 */
function StarsCanvas({
  starCount = 200,
  layers = 3,
  starColor = '#ffffff'
}) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const starsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      canvas.style.display = 'none';
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize stars for each layer
    const initStars = () => {
      starsRef.current = [];
      const speeds = [0.5, 0.3, 0.2];
      const sizes = [1, 2, 3];

      for (let layer = 0; layer < layers; layer++) {
        const layerStars = [];
        for (let i = 0; i < starCount; i++) {
          layerStars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: speeds[layer] || 0.5,
            size: sizes[layer] || 1,
            opacity: Math.random() * 0.5 + 0.5,
          });
        }
        starsRef.current.push(layerStars);
      }
    };

    initStars();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((layerStars) => {
        layerStars.forEach((star) => {
          star.y += star.speed;

          if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
          }

          ctx.fillStyle = starColor;
          ctx.globalAlpha = star.opacity;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      ctx.globalAlpha = 1.0;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [starCount, layers, starColor]);

  return (
    <canvas
      ref={canvasRef}
      className="stars-canvas"
      aria-hidden="true"
    />
  );
}

export default StarsCanvas;
