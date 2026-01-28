import React from 'react';

const ActionButton = ({ icon, title, subtitle, onClick, className = '', delay = 0 }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000 + delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <button
      onClick={onClick}
      className={`
        group relative overflow-hidden
        backdrop-blur-md bg-white/10 border border-white/20
        rounded-2xl p-8 w-full max-w-sm
        transform transition-all duration-700 ease-out
        hover:bg-white/20 hover:border-rose-gold/50
        hover:scale-105 hover:shadow-2xl
        active:scale-95
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
        ${className}
      `}
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
      }}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-gold/20 to-champagne-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center">
        <div className="text-5xl mb-4 group-hover:animate-bounce-gentle transition-all duration-300">
          {icon}
        </div>
        <h3 className="font-playfair text-xl font-semibold text-white mb-2 group-hover:text-rose-gold transition-colors duration-300">
          {title}
        </h3>
        <p className="font-inter text-sm text-white/80 group-hover:text-white transition-colors duration-300">
          {subtitle}
        </p>
      </div>
    </button>
  );
};

export default ActionButton;