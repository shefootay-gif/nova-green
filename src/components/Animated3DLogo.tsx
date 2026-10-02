import { useState, useRef } from 'react';
import type { FC, MouseEvent } from 'react';
import { Sparkles, ShieldCheck, Sprout } from 'lucide-react';

interface Animated3DLogoProps {
  className?: string;
  stat1Number?: string;
  stat1Label?: string;
  stat2Number?: string;
  stat2Label?: string;
}

export const Animated3DLogo: FC<Animated3DLogoProps> = ({ 
  className = '',
  stat1Number = '17+',
  stat1Label = 'مركب زراعي متخصص',
  stat2Number = '100%',
  stat2Label = 'جودة وفاعلية موثوقة',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [glossPos, setGlossPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates (-1 to 1)
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    // Tilt angle (max 18 degrees)
    setRotateX(-normY * 18);
    setRotateY(normX * 18);
    setGlossPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlossPos({ x: 50, y: 50 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full max-w-md mx-auto select-none perspective-1000 py-6 ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* Dynamic 3D Transform Container */}
      <div
        style={{
          transform: isHovered
            ? `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`
            : undefined,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.8s ease-in-out',
          transformStyle: 'preserve-3d',
        }}
        className={`relative z-20 transition-transform ${!isHovered ? 'animate-float-3d' : ''}`}
      >
        {/* Main 3D Glass Showcase Card */}
        <div className="relative rounded-[32px] bg-white/95 backdrop-blur-xl p-8 sm:p-10 border-2 border-white/80 shadow-[0_20px_50px_rgba(34,163,226,0.12),0_15px_30px_rgba(136,192,37,0.15)] overflow-hidden">
          {/* Ambient Glowing Discs Behind Logo */}
          <div className="absolute top-1/4 -right-10 w-44 h-44 bg-[#88C025]/25 rounded-full blur-2xl animate-pulse-glow pointer-events-none"></div>
          <div className="absolute bottom-1/4 -left-10 w-44 h-44 bg-[#22A3E2]/25 rounded-full blur-2xl animate-pulse-glow pointer-events-none" style={{ animationDelay: '2s' }}></div>

          {/* Gloss Specular Light Reflection Layer */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-300 rounded-[32px]"
            style={{
              background: `radial-gradient(circle 240px at ${glossPos.x}% ${glossPos.y}%, rgba(255,255,255,0.9), transparent 70%)`,
            }}
          ></div>

          {/* Diagonal Shimmer Sweep Animation */}
          <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none animate-shimmer-sweep"></div>

          {/* 3D Revolving Orbital Ring Graphic */}
          <div className="absolute inset-4 flex items-center justify-center pointer-events-none">
            <div className="w-72 h-72 border-2 border-dashed border-[#88C025]/30 rounded-full animate-orbit-spin"></div>
            <div className="w-80 h-80 border border-[#22A3E2]/20 rounded-full animate-orbit-spin" style={{ animationDirection: 'reverse', animationDuration: '24s' }}></div>
          </div>

          {/* Center Logo Graphic with 3D Pop */}
          <div 
            className="relative z-10 flex flex-col items-center justify-center py-4"
            style={{ transform: 'translateZ(40px)' }}
          >
            {/* The Logo Image */}
            <div className="w-64 max-w-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.1)] transition-transform duration-300">
              <img
                src="/logo.png"
                alt="لوجو نوفا جرين الأصلي"
                className="w-full h-auto object-contain transform hover:scale-105 transition-transform"
              />
            </div>

            {/* Glowing Brand Pedestal Line */}
            <div className="w-48 h-1 bg-gradient-to-r from-transparent via-[#88C025] to-transparent rounded-full mt-2 shadow-[0_0_12px_#88C025]"></div>
          </div>

          {/* Stats Badges under Logo */}
          <div 
            className="w-full grid grid-cols-2 gap-3 mt-6 text-center text-xs font-black relative z-10"
            style={{ transform: 'translateZ(25px)' }}
          >
            <div className="bg-gradient-to-br from-[#f2f9e8] to-[#e7f5d6] p-3 rounded-2xl border border-[#88C025]/30 shadow-2xs group hover:border-[#88C025] transition-all">
              <span className="block text-2xl font-black text-[#88C025] tracking-tight">{stat1Number}</span>
              <span className="text-[11px] text-gray-700 font-bold">{stat1Label}</span>
            </div>
            
            <div className="bg-gradient-to-br from-[#eaf6fc] to-[#d8eef9] p-3 rounded-2xl border border-[#22A3E2]/30 shadow-2xs group hover:border-[#22A3E2] transition-all">
              <span className="block text-2xl font-black text-[#22A3E2] tracking-tight">{stat2Number}</span>
              <span className="text-[11px] text-gray-700 font-bold">{stat2Label}</span>
            </div>
          </div>

          {/* Assurance Tag */}
          <div 
            className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-50/90 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-gray-200/80 w-full justify-center shadow-2xs relative z-10"
            style={{ transform: 'translateZ(20px)' }}
          >
            <ShieldCheck className="w-4 h-4 text-[#88C025]" />
            <span>منتجات أصلية معتمدة 100% • جودة مضمونة</span>
          </div>
        </div>

        {/* Floating 3D Satellite Chip 1 (Top-Left): Innovation badge */}
        <div
          className="absolute -top-3 -left-3 sm:-left-5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border-2 border-[#22A3E2]/40 shadow-xl shadow-[#22A3E2]/15 flex items-center gap-2 z-30 animate-float-badge-1"
          style={{ transform: 'translateZ(65px)' }}
        >
          <div className="w-6 h-6 rounded-lg bg-[#eaf6fc] text-[#22A3E2] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-black text-gray-800">ابتكار زراعي</span>
        </div>

        {/* Floating 3D Satellite Chip 2 (Bottom-Right): High Yield badge */}
        <div
          className="absolute -bottom-3 -right-3 sm:-right-5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border-2 border-[#88C025]/40 shadow-xl shadow-[#88C025]/15 flex items-center gap-2 z-30 animate-float-badge-2"
          style={{ transform: 'translateZ(55px)' }}
        >
          <div className="w-6 h-6 rounded-lg bg-[#f2f9e8] text-[#88C025] flex items-center justify-center">
            <Sprout className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-black text-[#13331c]">إنتاجية مضاعفة</span>
        </div>
      </div>

      {/* Dynamic 3D Floor Shadow */}
      <div className="w-72 h-8 mx-auto bg-black/15 rounded-full blur-lg animate-float-shadow mt-2 pointer-events-none"></div>
    </div>
  );
};
