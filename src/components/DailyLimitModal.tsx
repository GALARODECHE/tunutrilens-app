import React from 'react';
import { Sparkles, Clock, ArrowRight, X, Zap, ShieldCheck, Camera, Infinity } from 'lucide-react';
import { getScanUsage, MONTHLY_FREE_SCANS_LIMIT, MONTHLY_PREMIUM_SCANS_LIMIT } from '../services/usageLimitService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
  onManualAdd?: () => void;
}

export const DailyLimitModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onUpgrade,
  onManualAdd,
}) => {
  if (!isOpen) return null;

  const usage = getScanUsage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5 dark:bg-slate-900"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Zap className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {usage.isFairUseExceeded 
                  ? 'Tope de Uso Justo mensual alcanzado (600 fotos)' 
                  : usage.isPro 
                    ? 'Cupo mensual Pro alcanzado (150 fotos)' 
                    : 'Has alcanzado tus 5 escaneos gratuitos'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {usage.isFairUseExceeded 
                  ? 'Protección anti-abuso y uso personal individual' 
                  : 'Suma total de los 3 escáneres (Plato, Supermercado y Nevera)'}
              </p>
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

        <div className="py-4 space-y-3">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed dark:text-slate-300">
            {usage.isFairUseExceeded ? (
              'Has alcanzado el límite de 600 fotos al mes de la Política de Uso Justo (Fair Use) para tu cuenta personal. Esta medida protege la plataforma frente a usos masivos o automatizados. Tu cupo se reiniciará automáticamente el día 1 del próximo mes.'
            ) : usage.isPro ? (
              `Has consumido los ${MONTHLY_PREMIUM_SCANS_LIMIT} escaneos fotográficos de tu plan Pro en la suma combinada de tus 3 escáneres. Para disfrutar de análisis de fotos sin preocuparte por límites, puedes pasarte a la tarifa Premium Ilimitada.`
            ) : (
              `Has completado tus ${MONTHLY_FREE_SCANS_LIMIT} escaneos fotográficos con IA de este mes entre los 3 escáneres con cámara. ¡Al suscribirte a cualquier plan Premium tu contador comenzará a cero inmediatamente!`
            )}
          </p>

          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80 dark:bg-slate-800/50 dark:border-slate-700/60">
            <div className="flex items-start gap-2.5">
              <Camera className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-white">Los 3 escáneres comparten tu cupo mensual:</span>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  1. Escáner de Plato/Comida &bull; 2. Escáner de Supermercado &bull; 3. Nevera Residuo Cero.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50/80 p-3 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-800/30">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Funciones 100% gratuitas e ilimitadas siempre abiertas:</span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400 leading-normal">
              Escribir comidas a mano, menús semanales, catálogo de recetas mediterráneas, calculadora de IMC y despensa manual están abiertas y nunca se bloquean.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          {onUpgrade && (
            <button
              onClick={() => {
                onClose();
                onUpgrade();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 px-4 text-xs sm:text-sm font-black text-white shadow-sm hover:bg-emerald-700 active:scale-[0.99] transition-all cursor-pointer"
            >
              <Zap className="h-4 w-4 text-amber-300" />
              <span>Ver Tarifas Premium (Pro o Ilimitado)</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          )}

          {onManualAdd && (
            <button
              onClick={() => {
                onClose();
                onManualAdd();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
            >
              Registrar comida a mano (Gratis e ilimitado)
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-1.5 text-center text-xs font-semibold text-slate-400 hover:text-slate-600 dark:text-slate-400 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
