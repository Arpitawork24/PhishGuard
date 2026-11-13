import { useRef, useState, useEffect } from 'react';

interface MagneticOptions {
  threshold?: number;
  strength?: number;
}

export function useMagnetic(options: MagneticOptions = {}) {
  const { threshold = 60, strength = 0.25 } = options;
  const ref = useRef<HTMLElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance < threshold) {
        // Subtle magnetic pull
        setPosition({
          x: deltaX * strength,
          y: deltaY * strength,
        });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [threshold, strength]);

  return { ref, position };
}
