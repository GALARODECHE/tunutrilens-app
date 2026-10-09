import React from 'react';
import { APP_LOGO_BASE64 } from '../assets/logoBase64';

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export const BrandLogo: React.FC<Props> = ({ size = 'md', className = '', showText = false }) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-11 h-11 sm:w-12 sm:h-12',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${sizeMap[size]} relative shrink-0 flex items-center justify-center select-none`}>
        <img
          src="/icono_tunutrilens_512x512.png"
          alt="TuNutriLens Logo Oficial"
          className="w-full h-full object-contain drop-shadow-md transition-transform duration-300 hover:scale-105 rounded-2xl"
          loading="eager"
          decoding="sync"
          onError={(e) => {
            if (APP_LOGO_BASE64 && e.currentTarget.src !== APP_LOGO_BASE64) {
              e.currentTarget.src = APP_LOGO_BASE64;
            }
          }}
        />
      </div>

      {showText && (
        <div>
          <h1 className="text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5 leading-none">
            TuNutri<span className="text-emerald-700 font-extrabold">Lens</span>
          </h1>
          <p className="text-[10px] text-emerald-950 font-bold uppercase tracking-wider mt-0.5">
            Nutrición & Dieta Mediterránea
          </p>
        </div>
      )}
    </div>
  );
};
