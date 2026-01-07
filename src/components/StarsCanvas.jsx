import { useEffect, useRef, useMemo } from 'react';

/**
 * StarsCanvas Component
 * Optimized starfield animation using HTML5 Canvas
 * - Pauses when tab is hidden (saves CPU)
 * - Debounced resize handler
 * - Memoized star initialization
 */
function StarsCanvas({
  starCount = 200,
  layers = 3,
  starColor = '#ffffff'
}) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isVisibleRef = useRef(true);

  // Memoize layer configuration to prevent reinit
  const layerConfig = useMemo(() => ({
    speeds: [0.5, 0.3, 0.2],
    sizes: [1, 2, 3]
  }), []);

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

    let stars = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(); // Reinitialize stars on resize
    };

    // Debounced resize handler
    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    // Initialize stars for each layer
    const initStars = () => {
      stars = [];
      const { speeds, sizes } = layerConfig;

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
        stars.push(layerStars);
      }
    };

    // Handle visibility change - pause animation when tab is hidden
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      if (isVisibleRef.current && !animationFrameRef.current) {
        animate();
      }
    };

    // Animation loop
    const animate = () => {
      // Don't animate if tab is hidden
      if (!isVisibleRef.current) {
        animationFrameRef.current = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((layerStars) => {
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

    // Initial setup
    resizeCanvas();
    window.addEventListener('resize', debouncedResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    animate();

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', debouncedResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [starCount, layers, starColor, layerConfig]);

  return (
    <canvas
      ref={canvasRef}
      className="stars-canvas"
      aria-hidden="true"
    />
  );
}

export default StarsCanvas;
