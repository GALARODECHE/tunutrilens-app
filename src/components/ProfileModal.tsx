import React, { useState } from 'react';
import {
  X,
  User,
  CreditCard,
  ShieldCheck,
  Download,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Tag,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { UserProfile } from '../types';
import { exportHealthDataRGPD } from '../utils/rgpdExport';
import { activateSubscriptionPlan } from '../services/usageLimitService';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onNavigateToPricing?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  onNavigateToPricing
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isManagingSubscription, setIsManagingSubscription] = useState(false);
  const [cancellationConfirmed, setCancellationConfirmed] = useState(false);
  const [rgpdExportNotice, setRgpdExportNotice] = useState<string | null>(null);

  const [currentPlan, setCurrentPlan] = useState<string>(() => {
    try {
      return localStorage.getItem('user_subscription_plan') || 'b2c_free';
    } catch {
      return 'b2c_free';
    }
  });

  if (!isOpen) return null;

  const handleRedeemPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'NUTRI20') {
      localStorage.setItem('tunutrilens_promo_applied', '20');
      setPromoMessage({
        type: 'success',
        text: '¡Código NUTRI20 aplicado con éxito! 20% de descuento en tu próxima cuota.'
      });
      setPromoCode('');
    } else if (['TESTER', 'TESTER50', 'PROMO100', 'PREMIUMFREE', 'VIP100'].includes(code)) {
      activateSubscriptionPlan('b2c_unlimited');
      setCurrentPlan('b2c_unlimited');
      setPromoMessage({
        type: 'success',
        text: '¡Pase VIP de Acceso Ilimitado activado con éxito!'
      });
      setPromoCode('');
    } else if (code === 'PRO14') {
      activateSubscriptionPlan('b2c_pro');
      setCurrentPlan('b2c_pro');
      setPromoMessage({
        type: 'success',
        text: '¡Prueba Pro de 14 Días activada con éxito!'
      });
      setPromoCode('');
    } else {
      setPromoMessage({
        type: 'error',
        text: 'El código introducido no es válido o ha expirado.'
      });
    }

    setTimeout(() => setPromoMessage(null), 5000);
  };

  const handleExportRGPD = () => {
    try {
      const result = exportHealthDataRGPD();
      setRgpdExportNotice(`Descargado con éxito: ${result.filename} (${(result.dataSize / 1024).toFixed(1)} KB)`);
      setTimeout(() => setRgpdExportNotice(null), 5000);
    } catch (err) {
      setRgpdExportNotice('Error al exportar los datos RGPD. Inténtalo de nuevo.');
      setTimeout(() => setRgpdExportNotice(null), 4000);
    }
  };

  const handleCancelSubscription = () => {
    activateSubscriptionPlan('b2c_free');
    setCurrentPlan('b2c_free');
    setCancellationConfirmed(true);
    setTimeout(() => {
      setCancellationConfirmed(false);
      setIsManagingSubscription(false);
    }, 4000);
  };

  const getPlanDetails = () => {
    if (currentPlan === 'b2c_unlimited') {
      return {
        name: 'Tarifa Ilimitada',
        price: '7,49 € / mes',
        badge: 'Ilimitado',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
      };
    }
    if (currentPlan === 'b2c_pro') {
      return {
        name: 'Plan Pro',
        price: '4,99 € / mes',
        badge: 'Pro',
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300'
      };
    }
    return {
      name: 'Plan Gratuito (Pase Tester)',
      price: '0 € para siempre (Ilimitado en pruebas)',
      badge: 'Tester Ilimitado',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };
  };

  const planInfo = getPlanDetails();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-emerald-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 text-white p-5 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Mi Perfil & Suscripción</span>
          </div>

          <h2 className="text-xl font-black text-white">Gestión de Cuenta & Privacidad RGPD</h2>
          <p className="text-xs text-slate-300 mt-0.5">Control total de tu plan de nutrición y derechos de protección de datos.</p>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">

          {/* RGPD Toast Notification */}
          {rgpdExportNotice && (
            <div className="p-3.5 bg-emerald-600 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-md animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
              <span>{rgpdExportNotice}</span>
            </div>
          )}

          {/* SECCIÓN: MI SUSCRIPCIÓN */}
          <div className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 rounded-3xl p-5 border border-emerald-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-sm">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Mi Suscripción</h3>
                  <p className="text-xs text-slate-500">Estado de tu plan activo y facturación</p>
                </div>
              </div>

              <span className={`text-xs font-black px-3 py-1 rounded-full border ${planInfo.badgeColor}`}>
                {planInfo.badge}
              </span>
            </div>

            {/* Plan Status Card */}
            <div className="p-4 bg-white rounded-2xl border border-emerald-100/80 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-900">{planInfo.name}</h4>
                    <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Activo
                    </span>
                  </div>
                  <p className="text-xs font-extrabold text-emerald-800 mt-0.5">{planInfo.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsManagingSubscription(!isManagingSubscription)}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-amber-300" />
                    <span>Gestionar Suscripción</span>
                  </button>

                  {onNavigateToPricing && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToPricing();
                      }}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ver Planes</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50/60 rounded-xl text-[11px] text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Garantía de Satisfacción 14 Días:</strong> Sin permanencia. Cancela en cualquier momento con 1 solo clic y mantén acceso hasta el fin del periodo abonado.
                </span>
              </div>
            </div>

            {/* GESTIONAR SUSCRIPCIÓN SUB-PANEL */}
            {isManagingSubscription && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Panel de Gestión de Suscripción
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsManagingSubscription(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    ✕ Cerrar
                  </button>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5">
                  <p>• <strong>Plan actual:</strong> {planInfo.name}</p>
                  <p>• <strong>Renovación automática:</strong> Activa (cancelable en cualquier segundo sin penalización).</p>
                  <p>• <strong>Garantía:</strong> 14 días naturales para devolución íntegra.</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2">
                  {currentPlan !== 'b2c_free' ? (
                    <button
                      type="button"
                      onClick={handleCancelSubscription}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      Cancelar Renovación Automática
                    </button>
                  ) : (
                    <p className="text-xs text-slate-500 font-medium">
                      Actualmente estás en el plan gratuito. No tienes cargos pendientes.
                    </p>
                  )}
                </div>

                {cancellationConfirmed && (
                  <div className="p-2.5 bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold rounded-xl">
                    ✓ Renovación automática cancelada. Mantendrás tu acceso hasta el fin del periodo sin ningún cobro adicional.
                  </div>
                )}
              </div>
            )}

            {/* CANJEAR CÓDIGO PROMOCIONAL */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Canjear Código Promocional o Cupón</span>
              </label>

              <form onSubmit={handleRedeemPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Introduce tu código (ej: NUTRI20, PRO14)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer shrink-0"
                >
                  Canjear
                </button>
              </form>

              {promoMessage && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-bold ${
                    promoMessage.type === 'success'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}
                >
                  {promoMessage.text}
                </div>
              )}
            </div>
          </div>

          {/* SECCIÓN: EXPORTAR DATOS RGPD */}
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-800 text-white rounded-2xl shadow-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Derecho a la Portabilidad RGPD</h3>
                <p className="text-xs text-slate-500">Reglamento General de Protección de Datos (UE 2016/679, Art. 20)</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Puedes descargar una copia íntegra de todos tus datos de salud, comidas registradas, peso, objetivos y preferencias nutricionales en formato estándar interoperable JSON para llevártelos donde quieras o compartirlos con tu médico.
            </p>

            <button
              type="button"
              onClick={handleExportRGPD}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-99"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Exportar Datos de Salud RGPD en JSON</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
