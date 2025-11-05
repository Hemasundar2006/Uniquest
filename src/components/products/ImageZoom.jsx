import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

export default function ImageZoom({ image, alt, className = '' }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(2);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current || !imageRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(5, prev + 0.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(1, prev - 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(2);
    setZoomPosition({ x: 50, y: 50 });
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`relative overflow-hidden cursor-zoom-in ${className}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        <img
          ref={imageRef}
          src={image}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300"
          style={{
            transform: isZoomed ? `scale(${zoomLevel})` : 'scale(1)',
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
        />
        
        {isZoomed && (
          <div className="absolute top-4 right-4 flex gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleResetZoom();
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors text-xs px-2"
              title="Reset"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </>
  );
}

