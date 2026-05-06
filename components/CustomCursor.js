'use client';

import { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHidden(false);
    };

    const onMouseEnter = () => setIsHidden(false);
    const onMouseLeave = () => setIsHidden(true);

    const onMouseDown = () => setIsPointer(true);
    const onMouseUp = () => setIsPointer(false);

    const checkPointer = () => {
      const target = document.elementFromPoint(position.x, position.y);
      if (target) {
        const style = window.getComputedStyle(target);
        setIsPointer(style.cursor === 'pointer');
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const interval = setInterval(checkPointer, 100);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      clearInterval(interval);
    };
  }, [position]);

  return (
    <>
      <div
        className={`fixed pointer-events-none z-[9999] transition-opacity duration-300 ${isHidden ? 'opacity-0' : 'opacity-100'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Main Dot */}
        <div 
          className={`w-2 h-2 rounded-full transition-transform duration-200 ${isPointer ? 'scale-[2.5] bg-[#00D4FF]' : 'bg-[#FF4D1A]'}`}
          style={{
            boxShadow: isPointer 
              ? '0 0 12px #00D4FF, 0 0 24px rgba(0, 212, 255, 0.4)' 
              : '0 0 8px #FF4D1A, 0 0 16px rgba(255, 77, 26, 0.4)'
          }}
        />
        
        {/* Crosshairs */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 transition-all duration-500 ease-out ${isPointer ? 'opacity-0 scale-50' : 'opacity-70 scale-100'}`}
        >
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#00D4FF]" />
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#00D4FF]" />
        </div>

        {/* Outer Ring on Hover */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-[#00D4FF] rounded-full transition-all duration-300 ${isPointer ? 'opacity-40 scale-100' : 'opacity-0 scale-50'}`}
        />
      </div>

      <style jsx global>{`
        body {
          cursor: none !important;
        }
        a, button, [role="button"], input[type="submit"], input[type="button"] {
          cursor: none !important;
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
