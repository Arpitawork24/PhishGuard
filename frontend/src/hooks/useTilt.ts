import { useState, useRef, MouseEvent } from 'react';

interface TiltState {
  rotateX: number;
  rotateY: number;
  spotlightX: number;
  spotlightY: number;
  isHovered: boolean;
}

export function useTilt(maxTilt = 4) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    spotlightX: 50,
    spotlightY: 50,
    isHovered: false,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    const spotlightX = (x / rect.width) * 100;
    const spotlightY = (y / rect.height) * 100;

    setTilt({
      rotateX,
      rotateY,
      spotlightX,
      spotlightY,
      isHovered: true,
    });
  };

  const handleMouseEnter = () => {
    setTilt((prev) => ({ ...prev, isHovered: true }));
  };

  const handleMouseLeave = () => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      spotlightX: 50,
      spotlightY: 50,
      isHovered: false,
    });
  };

  return {
    cardRef,
    tilt,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
}
