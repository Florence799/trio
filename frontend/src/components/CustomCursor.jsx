import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateHoverState = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', updateHoverState);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateHoverState);
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? 60 : 30,
          height: isHovering ? 60 : 30,
          borderRadius: '50%',
          backgroundColor: isHovering ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.3)',
          border: '2px solid rgba(99, 102, 241, 0.5)',
          backdropFilter: 'blur(4px)',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: `translate(${position.x - (isHovering ? 30 : 15)}px, ${position.y - (isHovering ? 30 : 15)}px)`,
          transition: 'width 0.3s ease, height 0.3s ease, transform 0.08s linear, background-color 0.3s ease',
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#6366f1',
          pointerEvents: 'none',
          zIndex: 10000,
          transform: `translate(${position.x - 4}px, ${position.y - 4}px)`,
          transition: 'transform 0.02s linear',
          boxShadow: '0 0 15px #6366f1',
        }}
      />
    </>
  );
};

export default CustomCursor;
