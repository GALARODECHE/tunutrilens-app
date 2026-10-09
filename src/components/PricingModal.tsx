import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Check,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Leaf
} from 'lucide-react';
import { activateSubscriptionPlan, getSubscriptionPlan } from '../services/usageLimitService';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const activePlanId = getSubscriptionPlan();

  if (!isOpen) return null;

  const handleActivatePlan = (planId: 'b2c_pro' | 'b2c_unlimited') => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      activateSubscriptionPlan(planId);
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        if (onSuccess) onSuccess();
        onClose();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition cursor-pointer"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase rounded-full">
              Suscripciones TuNutriLens
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Elige tu Plan Premium
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
            Desbloquea escaneos avanzados con IA y aprovecha al máximo tus alimentos sin permanencia.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {showSuccessToast && (
            <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-lg flex items-center gap-2.5 border border-emerald-400">
              <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
              <div>
                <h4 className="font-bold text-xs">¡Plan activado con éxito!</h4>
                <p className="text-[11px] text-emerald-100">Disfruta de todas las ventajas de tu nueva tarifa.</p>
              </div>
            </div>
          )}

          {/* 2 Options Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Plan Pro */}
            <div className="rounded-2xl p-5 border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Plan Pro</h3>
                    <p className="text-xs text-slate-500">Para tu día a día</p>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-md">
                    Pro
                  </span>
                </div>

                <div className="py-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">4,99 €</span>
                    <span className="text-xs text-slate-500 font-medium">/ mes</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-200">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>40 escaneos con IA al mes (Plato y Súper)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Diario calórico y registro nutricional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Informes nutricionales exportables en PDF</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleActivatePlan('b2c_pro')}
                disabled={isProcessing || activePlanId === 'b2c_pro'}
                className={`w-full py-3 px-3 rounded-xl font-bold text-xs transition cursor-pointer ${
                  activePlanId === 'b2c_pro'
                    ? 'bg-slate-200 text-slate-500 cursor-default'
                    : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-98'
                }`}
              >
                {activePlanId === 'b2c_pro' ? '✓ Plan Pro Activo' : 'Elegir Plan Pro (4,99 €)'}
              </button>
            </div>

            {/* Tarifa Ilimitada */}
            <div className="rounded-2xl p-5 border-2 border-amber-400 bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col justify-between space-y-4 relative shadow-md">
              <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                Recomendado
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-black text-white">Tarifa Ilimitada</h3>
                    <p className="text-xs text-amber-200">Acceso total sin límites</p>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-md">
                    Todo Incluido
                  </span>
                </div>

                <div className="py-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-white">7,49 €</span>
                    <span className="text-xs text-slate-400 font-medium">/ mes</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-200 pt-2 border-t border-slate-800">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Escaneos ILIMITADOS</strong> en los 3 escáneres</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Nevera Residuo Cero:</strong> Recetas anti-desperdicio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Planificador semanal de menús mediterráneos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Exportación clínica de datos para tu médico</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleActivatePlan('b2c_unlimited')}
                disabled={isProcessing || activePlanId === 'b2c_unlimited'}
                className={`w-full py-3 px-3 rounded-xl font-black text-xs transition cursor-pointer ${
                  activePlanId === 'b2c_unlimited'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30 cursor-default'
                    : 'bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-400 text-slate-950 active:scale-98'
                }`}
              >
                {activePlanId === 'b2c_unlimited' ? '✓ Tarifa Ilimitada Activa' : 'Elegir Ilimitada (7,49 €)'}
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sin permanencia: cancela en cualquier momento con 1 clic</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
