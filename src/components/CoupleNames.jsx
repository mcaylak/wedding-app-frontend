import React, { useState, useEffect } from 'react';

const CoupleNames = () => {
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center mb-12">
      <div
        className={`transform transition-all duration-1000 ${
          animationStarted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <h1 className="font-playfair text-6xl lg:text-8xl font-bold text-rose-gold mb-4">
          Emma & James
        </h1>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-rose-gold to-transparent mx-auto mb-4"></div>
        <p className="font-dancing text-2xl lg:text-3xl text-champagne-gold">
          Our Wedding Memories
        </p>
      </div>
    </div>
  );
};

export default CoupleNames;