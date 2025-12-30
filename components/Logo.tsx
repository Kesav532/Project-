
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const dimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 80, height: 80 },
    xl: { width: 160, height: 160 },
  };

  const { width, height } = dimensions[size];

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Shield - Left Half (Blue) */}
        <path
          d="M50 85C50 85 15 75 15 45V25C15 25 35 15 50 15V85Z"
          fill="#0097D7"
        />
        {/* Shield - Right Half (Green) */}
        <path
          d="M50 85C50 85 85 75 85 45V25C85 25 65 15 50 15V85Z"
          fill="#76BC43"
        />
        
        {/* Shadow for depth */}
        <path
          d="M50 85C50 85 15 75 15 45L50 65V85Z"
          fill="black"
          fillOpacity="0.1"
        />

        {/* Central White Element (Circle + Arrow) */}
        <path
          d="M50 30L60 40H55V45C55 53.2843 48.2843 60 40 60C31.7157 60 25 53.2843 25 45C25 36.7157 31.7157 30 40 30V35H45L50 30Z"
          fill="white"
          className="hidden"
        />
        
        {/* Simplified Central Part matching the image better */}
        <circle cx="50" cy="45" r="18" fill="white" />
        <path d="M50 25L58 35H42L50 25Z" fill="white" />
        
        {/* Wrench Icon inside white circle */}
        <path
          d="M54.5 40.5L45.5 49.5C45 50 44 50 43.5 49.5L41.5 47.5C41 47 41 46 41.5 45.5L50.5 36.5C51.5 35.5 53 35.5 54 36.5C55 37.5 55 39 54.5 40.5ZM53 37.5C52.7 37.2 52.3 37.2 52 37.5L43 46.5L44.5 48L53.5 39C53.8 38.7 53.8 38.3 53.5 38C53.3 37.8 53.1 37.7 53 37.5Z"
          fill="#0097D7"
        />
        <circle cx="44" cy="47" r="1.5" fill="#0097D7" />
      </svg>
      
      {showText && (
        <div className="mt-2 text-center">
          <h2 className={`font-black tracking-tight text-[#001F3F] leading-none ${size === 'xl' ? 'text-4xl' : size === 'lg' ? 'text-2xl' : 'text-lg'}`}>
            CIVIC-CONNECT
          </h2>
          <p className={`font-semibold text-[#0097D7] ${size === 'xl' ? 'text-xl' : 'text-xs mt-1'}`}>
            Better Nation
          </p>
        </div>
      )}
    </div>
  );
};
