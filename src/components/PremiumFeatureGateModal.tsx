import React from 'react';
import { Sparkles, Lock, ArrowRight, X, Check, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPricing: () => void;
  featureTitle: string;
  featureDescription: string;
}

export const PremiumFeatureGateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onNavigateToPricing,
  featureTitle,
  featureDescription,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 border border-emerald-100"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">
                Función Premium
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                {featureTitle}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Cerrar ventana"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">
            {featureDescription}
          </p>

          <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 border border-amber-200/90 dark:bg-slate-800/60 dark:border-amber-900/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-amber-950 dark:text-amber-300">
              <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Desbloquea todo el potencial con Premium</span>
            </div>
            <ul className="text-[11px] text-amber-900 dark:text-amber-200 space-y-1.5 font-medium">
              <li className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span><strong>Nevera Residuo Cero:</strong> Escaneo con visión artificial de estantes y recetas</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span><strong>Mi Nutrición Completo:</strong> Diario, menús semanales adaptados y evolución de peso</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span><strong>Tarifa Ilimitada (7,49 €/mes):</strong> Fotos infinitas, Nevera Residuo Cero y menús sin cortes</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/70 text-[11px] text-slate-500">
            En tu <strong>Plan Gratuito</strong> puedes seguir utilizando los escaneos de <strong>Plato y Supermercado</strong> (hasta 5 fotos al mes) y explorar el apartado <strong>Descubrir</strong>.
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => {
              onClose();
              onNavigateToPricing();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 py-3.5 px-4 text-xs sm:text-sm font-black text-slate-950 shadow-md active:scale-[0.99] transition-all cursor-pointer"
          >
            <Zap className="h-4 w-4 text-slate-950" />
            <span>Ver Tarifas y Desbloquear Acceso</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-center text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            Continuar en versión gratuita
          </button>
        </div>
      </div>
    </div>
  );
};
