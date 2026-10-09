import React from 'react';
import { NavTab, TextSizePreference } from '../types';
import {
  Camera,
  Apple,
  Compass,
  User,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface Props {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenIndexModal?: () => void;
  onOpenTextSizeModal?: () => void;
  textSizePreference?: TextSizePreference;
}

export const Navbar: React.FC<Props> = ({
  currentTab,
  onTabChange,
  onOpenIndexModal,
  onOpenTextSizeModal,
  textSizePreference = 'normal',
}) => {
  // 4 Master Pillars
  const masterTabs: Array<{
    id: NavTab;
    label: string;
    mobileLabel: string;
    icon: React.ElementType;
    activeCheck: (tab: NavTab) => boolean;
  }> = [
    {
      id: 'scanner',
      label: 'Escáner',
      mobileLabel: 'Escáner',
      icon: Camera,
      activeCheck: (t) => ['scanner', 'zerowaste'].includes(t),
    },
    {
      id: 'nutrition',
      label: 'Mi Nutrición',
      mobileLabel: 'Nutrición',
      icon: Apple,
      activeCheck: (t) => ['nutrition', 'diary', 'weeklyPlan', 'progress'].includes(t),
    },
    {
      id: 'explore',
      label: 'Descubrir',
      mobileLabel: 'Descubrir',
      icon: Compass,
      activeCheck: (t) => ['explore', 'plans', 'seasonal', 'lifeStages'].includes(t),
    },
    {
      id: 'profile',
      label: 'Mi Perfil',
      mobileLabel: 'Perfil',
      icon: User,
      activeCheck: (t) => ['profile', 'pricing'].includes(t),
    },
  ];

  return (
    <>
      {/* TOP HEADER: Clean and responsive */}
      <header className="bg-white/95 backdrop-blur-md text-slate-800 border-b border-emerald-100 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
          
          {/* Logo & Brand on Left */}
          <button
            type="button"
            onClick={() => onTabChange('scanner')}
            className="flex items-center gap-2 text-left cursor-pointer active:scale-98 transition shrink-0"
            title="Ir a inicio (Escáner)"
          >
            <BrandLogo size="xs" />
            <div className="flex flex-col">
              <span className="font-black text-slate-900 tracking-tight text-sm sm:text-base leading-none">
                TuNutri<span className="text-emerald-700">Lens</span>
              </span>
              <span className="text-[9px] font-bold text-emerald-800 hidden sm:inline leading-tight">
                Nutrición Inteligente
              </span>
            </div>
          </button>

          {/* Center 4 Master Hubs (DESKTOP ONLY: >= md) */}
          <nav className="hidden md:flex items-center gap-1 bg-emerald-50/80 p-1 rounded-2xl border border-emerald-100/80">
            {masterTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.activeCheck(currentTab);
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm scale-[1.02]'
                      : 'text-slate-700 hover:text-emerald-800 hover:bg-white/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons (ALL SCREEN SIZES: visible without horizontal scroll) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Botón Ver Planes / Precios */}
            <button
              type="button"
              onClick={() => onTabChange('pricing')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-black rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap active:scale-95 ${
                currentTab === 'pricing'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
              }`}
              title="Ver planes de suscripción y precios"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="hidden sm:inline">Ver Planes</span>
              <span className="sm:hidden text-[11px]">Planes</span>
            </button>

            {/* Botón Guía Oficial */}
            {onOpenIndexModal && (
              <button
                onClick={onOpenIndexModal}
                className="px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-slate-900 to-emerald-950 hover:from-slate-800 text-white text-xs font-black rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer border border-emerald-800 active:scale-95 whitespace-nowrap"
                title="Abre la guía de funciones"
              >
                <Compass className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="text-[11px] sm:text-xs">Guía</span>
              </button>
            )}

            {/* Selector de Tamaño de Letra (Accesibilidad) */}
            {onOpenTextSizeModal && (
              <button
                type="button"
                onClick={onOpenTextSizeModal}
                className={`px-2 sm:px-2.5 py-1.5 text-xs font-black rounded-xl border shadow-2xs transition flex items-center gap-1 cursor-pointer active:scale-95 whitespace-nowrap ${
                  textSizePreference !== 'normal'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
                title="Aumentar o cambiar tamaño de letra (Accesibilidad)"
                aria-label="Aumentar tamaño de letra"
              >
                <span className="font-serif font-black text-xs sm:text-sm text-emerald-700 leading-none">aA</span>
                {textSizePreference !== 'normal' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                )}
              </button>
            )}

            {/* Versión de la app (oculta en pantallas muy pequeñas para evitar saturar) */}
            <span
              className="hidden xs:inline-block text-[10px] font-bold px-1.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs select-none"
              title="Versión de TuNutriLens"
            >
              v2.7.0
            </span>
          </div>

        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR (FIXED at the bottom for thumb ergonomics on phones) */}
      <nav 
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-2xl pb-[env(safe-area-inset-bottom,0px)]"
        aria-label="Navegación principal en móvil"
      >
        <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto px-1">
          {masterTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.activeCheck(currentTab);
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`h-full flex flex-col items-center justify-center gap-1 transition-all cursor-pointer select-none active:scale-95 relative ${
                  isActive
                    ? 'text-emerald-700 font-black'
                    : 'text-slate-500 hover:text-slate-800 font-bold'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute top-0 inset-x-4 h-0.5 bg-emerald-600 rounded-full" />
                )}
                
                <div className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-emerald-100 text-emerald-800 scale-105' : 'text-slate-500'
                }`}>
                  <Icon className="w-5 h-5 shrink-0" />
                </div>

                <span className={`text-[10px] leading-tight tracking-tight ${
                  isActive ? 'font-black text-emerald-900' : 'font-semibold text-slate-600'
                }`}>
                  {tab.mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
