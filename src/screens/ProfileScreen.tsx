import React, { useState } from 'react';
import { UserProfile, TextSizePreference } from '../types';
import { calculateBMR, calculateTDEE, loadTextSizePreference, saveTextSizePreference } from '../services/storage';
import { ScientificReferencesModal } from '../components/ScientificReferencesModal';
import { LifeStageCustomizerModal } from '../components/LifeStageCustomizerModal';
import { SCIENTIFIC_REFERENCES } from '../data/scientificReferences';
import { User, Activity, Target, ShieldCheck, Flame, Scale, Check, AlertTriangle, Plus, X, ShieldAlert, BookOpen, ExternalLink, Globe, Building2, Award, CreditCard, Sparkles, Sliders, Type, RefreshCw, Download, Tag, CheckCircle2 } from 'lucide-react';
import { exportHealthDataRGPD } from '../utils/rgpdExport';
import { activateSubscriptionPlan } from '../services/usageLimitService';

interface Props {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onNavigateToPricing?: () => void;
}

export const ProfileScreen: React.FC<Props> = ({ userProfile, onUpdateProfile, onNavigateToPricing }) => {
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [customAllergenInput, setCustomAllergenInput] = useState('');
  const [showRefModal, setShowRefModal] = useState(false);
  const [showCustomizerModal, setShowCustomizerModal] = useState(false);
  const [currentTextSize, setCurrentTextSize] = useState<TextSizePreference>(loadTextSizePreference());

  // SUSCRIPCIÓN & RGPD STATE
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

  const handleRedeemPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'NUTRI20') {
      localStorage.setItem('tunutrilens_promo_applied', '20');
      setPromoMessage({
        type: 'success',
        text: '¡Código NUTRI20 canjeado con éxito! 20% de descuento en tu próxima cuota.'
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
    } catch {
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

  const handleTextSizeChange = (newSize: TextSizePreference) => {
    setCurrentTextSize(newSize);
    saveTextSizePreference(newSize);
    setProfile((prev) => ({ ...prev, textSizePreference: newSize }));
    onUpdateProfile({ ...profile, textSizePreference: newSize });
  };

  const handleForceClearCache = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      } catch (e) {
        console.error(e);
      }
    }
    if ('caches' in window) {
      try {
        const keys = await caches.keys();
        for (const key of keys) {
          await caches.delete(key);
        }
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.removeItem('tunutilens_version');
    window.location.reload();
  };

  const commonAllergens = [
    'Gluten',
    'Lactosa / Lácteos',
    'Frutos Secos',
    'Huevos',
    'Marisco',
    'Pescado',
    'Soja',
    'Cacahuetes',
    'Sésamo',
    'Legumbres',
    'Fructosa',
  ];

  const toggleAllergen = (allergen: string) => {
    setProfile((prev) => {
      const current = prev.dietaryRestrictions || [];
      const exists = current.some((a) => a.toLowerCase() === allergen.toLowerCase());
      const updated = exists
        ? current.filter((a) => a.toLowerCase() !== allergen.toLowerCase())
        : [...current, allergen];
      return { ...prev, dietaryRestrictions: updated };
    });
  };

  const handleAddCustomAllergen = () => {
    const trimmed = customAllergenInput.trim();
    if (!trimmed) return;
    const current = profile.dietaryRestrictions || [];
    if (!current.some((a) => a.toLowerCase() === trimmed.toLowerCase())) {
      setProfile((prev) => ({
        ...prev,
        dietaryRestrictions: [...(prev.dietaryRestrictions || []), trimmed],
      }));
    }
    setCustomAllergenInput('');
  };

  const removeAllergen = (allergen: string) => {
    setProfile((prev) => ({
      ...prev,
      dietaryRestrictions: (prev.dietaryRestrictions || []).filter((a) => a !== allergen),
    }));
  };

  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(profile);

  const handleChange = (field: keyof UserProfile, val: any) => {
    setProfile((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const autoCalculateMacros = () => {
    let tdeeVal = calculateTDEE(profile);
    let targetCal = tdeeVal;
    if (profile.goal === 'Pérdida de peso') targetCal = Math.round(tdeeVal - 500);
    else if (profile.goal === 'Ganar músculo') targetCal = Math.round(tdeeVal + 300);

    const proteinG = Math.round(profile.currentWeightKg * 2.0); // 2g/kg
    const fatG = Math.round((targetCal * 0.25) / 9); // 25% calories
    const carbsG = Math.round((targetCal - proteinG * 4 - fatG * 9) / 4);

    setProfile((prev) => ({
      ...prev,
      dailyCalorieTarget: targetCal,
      dailyProteinTargetG: proteinG,
      dailyCarbsTargetG: carbsG,
      dailyFatTargetG: fatG,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-12">
      {/* Title & Plan Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold uppercase tracking-wider">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ajustes & Objetivos</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Perfil Nutricional</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Suscripción Activa</span>
            <span className="text-xs font-black text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-md uppercase border border-emerald-200">
              {currentPlan === 'b2c_unlimited' 
                ? 'Premium Ilimitado' 
                : currentPlan === 'b2c_pro' 
                  ? 'Premium Pro' 
                  : 'Gratuito (Tester Ilimitado)'}
            </span>
          </div>
        </div>
      </div>

      {/* NOTIFICACIÓN TOAST EXPORTACIÓN RGPD */}
      {rgpdExportNotice && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl text-xs font-bold flex items-center justify-between gap-2 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
            <span>{rgpdExportNotice}</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md uppercase font-black">RGPD Art. 20</span>
        </div>
      )}

      {/* SECCIÓN MI SUSCRIPCIÓN & DERECHOS RGPD */}
      <div className="bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/50 rounded-3xl p-6 border-2 border-emerald-200/80 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-sm">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Mi Suscripción & Privacidad</h2>
              <p className="text-xs text-slate-500">Gestión de plan, cupones y exportación de datos de salud RGPD</p>
            </div>
          </div>

          <span className={`text-xs font-black px-3.5 py-1 rounded-full border shadow-2xs ${planInfo.badgeColor}`}>
            {planInfo.badge}
          </span>
        </div>

        {/* Tarjeta de Estado del Plan */}
        <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">{planInfo.name}</h3>
                <span className="flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Activo
                </span>
              </div>
              <p className="text-xs font-extrabold text-emerald-700 mt-0.5">{planInfo.price}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsManagingSubscription(!isManagingSubscription)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-300" />
                <span>Gestionar Suscripción</span>
              </button>

              {onNavigateToPricing && (
                <button
                  type="button"
                  onClick={onNavigateToPricing}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Ver Planes</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-3 bg-emerald-50/70 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5 border border-emerald-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Garantía de 14 Días y Sin Permanencia:</strong> Puedes cancelar en cualquier momento con 1 solo clic. Mantendrás todas las funciones activas hasta el fin de tu periodo ya pagado.
            </div>
          </div>
        </div>

        {/* SUB-PANEL: GESTIONAR SUSCRIPCIÓN */}
        {isManagingSubscription && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Panel de Gestión de tu Suscripción
              </h4>
              <button
                type="button"
                onClick={() => setIsManagingSubscription(false)}
                className="text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕ Cerrar panel
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5">
              <p>• <strong>Plan actual:</strong> {planInfo.name}</p>
              <p>• <strong>Estado:</strong> Al corriente de pago sin incidencias.</p>
              <p>• <strong>Política de cancelación:</strong> Cancela sin llamadas ni penalizaciones. Si cancelas hoy, no se cobrará el siguiente ciclo.</p>
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
                  Actualmente estás en el plan gratuito. Para disfrutar de escaneos infinitos y Nevera Residuo Cero, sube a Plan Anual o Pro.
                </p>
              )}
            </div>

            {cancellationConfirmed && (
              <div className="p-2.5 bg-rose-100 border border-rose-300 text-rose-900 text-xs font-bold rounded-xl animate-in fade-in">
                ✓ Renovación automática cancelada correctamente. Tu acceso continuará activo hasta agotar el periodo contratado.
              </div>
            )}
          </div>
        )}

        {/* CANJEAR CÓDIGO PROMOCIONAL */}
        <div className="space-y-2 pt-1 border-t border-emerald-100">
          <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-emerald-600" />
            <span>Canjear Código Promocional o Cupón</span>
          </label>

          <form onSubmit={handleRedeemPromo} className="flex gap-2">
            <input
              type="text"
              placeholder="Introduce cupón (ej: NUTRI20, PRO14)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase placeholder:normal-case placeholder:font-normal"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer shrink-0"
            >
              Canjear Código
            </button>
          </form>

          {promoMessage && (
            <div
              className={`p-2.5 rounded-xl text-xs font-bold animate-in fade-in ${
                promoMessage.type === 'success'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              {promoMessage.text}
            </div>
          )}
        </div>

        {/* EXPORTAR DATOS DE SALUD RGPD EN JSON */}
        <div className="pt-2 border-t border-emerald-100 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Exportar Datos de Salud RGPD (UE 2016/679)</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Descarga un archivo JSON estructurado con todo tu historial de comidas, peso, macros y diagnóstico médico.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportRGPD}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Salud en JSON</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Metric Cards BMR / TDEE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-slate-100 rounded-2xl p-5 shadow-sm space-y-1 border border-teal-900/40">
            <div className="flex items-center justify-between text-xs text-teal-300 font-bold">
              <span>Metabolismo Basal (BMR)</span>
              <Flame className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">{bmr} <span className="text-sm font-medium text-teal-200/70">kcal/día</span></div>
            <p className="text-[11px] text-teal-200/60">Calorías quemadas en reposo absoluto (Mifflin-St Jeor)</p>
          </div>

          <div className="bg-gradient-to-br from-teal-900 via-emerald-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-1 border border-teal-800/50">
            <div className="flex items-center justify-between text-xs text-teal-200 font-bold">
              <span>Gasto Total Diario (TDEE)</span>
              <Activity className="w-4 h-4 text-teal-300" />
            </div>
            <div className="text-3xl font-black text-white">{tdee} <span className="text-sm font-medium text-teal-200">kcal/día</span></div>
            <p className="text-[11px] text-teal-200/80">Incluye tu nivel de actividad física ({profile.activityLevel})</p>
          </div>
        </div>

        {/* Datos Personales */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Datos Físicos y Estilo de Vida</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Edad (años)</label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value) || 25)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Altura (cm)</label>
              <input
                type="number"
                value={profile.heightCm}
                onChange={(e) => handleChange('heightCm', parseFloat(e.target.value) || 170)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Género Biológico</label>
              <select
                value={profile.gender}
                onChange={(e) => handleChange('gender', e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 focus:outline-none"
              >
                <option value="Mujer">Mujer</option>
                <option value="Hombre">Hombre</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Peso Actual (kg)</label>
              <input
                type="number"
                step="0.1"
                value={profile.currentWeightKg}
                onChange={(e) => handleChange('currentWeightKg', parseFloat(e.target.value) || 70)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Peso Objetivo (kg)</label>
              <input
                type="number"
                step="0.1"
                value={profile.targetWeightKg}
                onChange={(e) => handleChange('targetWeightKg', parseFloat(e.target.value) || 65)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Nivel de Actividad</label>
              <select
                value={profile.activityLevel}
                onChange={(e) => handleChange('activityLevel', e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 focus:outline-none"
              >
                <option value="Sedentario">Sedentario (poco o ningún ejercicio)</option>
                <option value="Ligero">Ligero (1-3 días/semana)</option>
                <option value="Moderado">Moderado (3-5 días/semana)</option>
                <option value="Intenso">Intenso (6-7 días/semana)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Objetivo Nutricional</label>
              <select
                value={profile.goal}
                onChange={(e) => handleChange('goal', e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 focus:outline-none"
              >
                <option value="Pérdida de peso">Pérdida de peso (Déficit)</option>
                <option value="Mantenimiento">Mantenimiento de peso</option>
                <option value="Ganar músculo">Ganar músculo (Superávit)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Accesibilidad y Tamaño de Letra */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Type className="w-5 h-5 text-emerald-600" />
              <span>Tamaño de Letra y Accesibilidad</span>
            </h3>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {currentTextSize === 'normal' ? 'Normal (100%)' : currentTextSize === 'large' ? 'Grande (115%)' : 'Extra Grande (130%)'}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Ajusta el tamaño del texto para leer cómodamente los ingredientes, calorías y advertencias en cualquier pantalla o dispositivo móvil:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'normal' as TextSizePreference,
                name: 'Normal',
                desc: '100% estándar',
                symbol: 'Aa',
                symbolClass: 'text-sm font-bold',
              },
              {
                id: 'large' as TextSizePreference,
                name: 'Grande',
                desc: '115% recomendado para móviles',
                symbol: 'Aa+',
                symbolClass: 'text-base font-black',
              },
              {
                id: 'xlarge' as TextSizePreference,
                name: 'Extra Grande',
                desc: '130% máxima legibilidad',
                symbol: 'Aa++',
                symbolClass: 'text-lg font-black',
              },
            ].map((s) => {
              const isSelected = currentTextSize === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleTextSizeChange(s.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className={s.symbolClass}>{s.symbol}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900">{s.name}</span>
                      {s.id === 'large' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                          Recomendado
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{s.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Alérgenos, Intolerancias y Restricciones */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>Alérgenos e Intolerancias Alimentarias</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">
              {(profile.dietaryRestrictions || []).length} activas
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Selecciona tus alérgenos o intolerancias. TuNutriLens los tendrá en cuenta al recomendarte platos en tu plan de comidas y al analizar fotos.
          </p>

          {/* Chips de Selección Rápida */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Alérgenos e Intolerancias Frecuentes:</label>
            <div className="flex flex-wrap gap-2">
              {commonAllergens.map((allergen) => {
                const isSelected = (profile.dietaryRestrictions || []).some(
                  (a) => a.toLowerCase() === allergen.toLowerCase()
                );
                return (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => toggleAllergen(allergen)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs scale-[1.02]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span>{allergen}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input para Alérgeno Personalizado */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Añadir otra restricción o ingrediente no deseado:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customAllergenInput}
                onChange={(e) => setCustomAllergenInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomAllergen();
                  }
                }}
                placeholder="Ej. Fructosa, Marisco, Sésamo, Cerdo..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:border-emerald-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomAllergen}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Añadir</span>
              </button>
            </div>
          </div>

          {/* Badges Activos */}
          {(profile.dietaryRestrictions || []).length > 0 && (
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 space-y-1.5">
              <div className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Restricciones registradas en tu plan:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.dietaryRestrictions.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-amber-300 text-amber-950 font-bold text-xs rounded-lg shadow-2xs"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeAllergen(item)}
                      className="text-amber-700 hover:text-rose-600 ml-0.5"
                      title="Eliminar"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Metas Macronutricionales */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <h3 className="text-base font-bold text-slate-900">Metas Diarias de Macronutrientes</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCustomizerModal(true)}
                className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                <span>Personalizar Guías ESPEN / ASPEN</span>
              </button>
              <button
                type="button"
                onClick={autoCalculateMacros}
                className="text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition-colors"
              >
                Autocalcular con IA
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Calorías (kcal)</label>
              <input
                type="number"
                value={profile.dailyCalorieTarget}
                onChange={(e) => handleChange('dailyCalorieTarget', parseInt(e.target.value) || 1800)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Proteínas (g)</label>
              <input
                type="number"
                value={profile.dailyProteinTargetG}
                onChange={(e) => handleChange('dailyProteinTargetG', parseInt(e.target.value) || 120)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Carbos (g)</label>
              <input
                type="number"
                value={profile.dailyCarbsTargetG}
                onChange={(e) => handleChange('dailyCarbsTargetG', parseInt(e.target.value) || 180)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Grasas (g)</label>
              <input
                type="number"
                value={profile.dailyFatTargetG}
                onChange={(e) => handleChange('dailyFatTargetG', parseInt(e.target.value) || 55)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Base de Datos Oficial Abierta BEDCA + USDA + EFSA + OMS + FAO */}
        <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white text-slate-900 rounded-3xl p-6 border border-emerald-200/80 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Directorio de Fuentes y Referencias Oficiales</h3>
                <p className="text-xs text-slate-600">Bases de Datos Abiertas y Consensos Nutricionales de Dominio Público</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowRefModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Ver Auditoría Científica Completa</span>
            </button>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            TuNutriLens combina datos bromatológicos oficializados por la <strong>Agencia Española de Seguridad Alimentaria y Nutrición (AESAN / BEDCA)</strong>, el <strong>U.S. Department of Agriculture (USDA)</strong>, y guías clínicas aprobadas por la <strong>EFSA</strong>, la <strong>OMS</strong>, la <strong>FAO</strong> y <strong>FESNAD</strong>.
          </p>

          {/* Direct Links Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {SCIENTIFIC_REFERENCES.slice(0, 4).map((ref) => (
              <div key={ref.id} className="p-3.5 bg-white rounded-2xl border border-emerald-100 shadow-2xs flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      {ref.category}
                    </span>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-900 font-bold text-[11px] flex items-center gap-1"
                    >
                      <span>Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 mt-1.5">{ref.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{ref.usageInApp}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setShowRefModal(true)}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold underline underline-offset-4"
            >
              + Ver las {SCIENTIFIC_REFERENCES.length} fuentes y citas bibliográficas completas en formato APA
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-5 h-5" />
          <span>Guardar Cambios en Perfil</span>
        </button>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>¡Perfil guardado correctamente!</span>
          </div>
        )}
      </form>

      {/* Scientific References Modal */}
      <ScientificReferencesModal
        isOpen={showRefModal}
        onClose={() => setShowRefModal(false)}
      />

      {/* Life Stage Guidelines & Customizer Modal */}
      <LifeStageCustomizerModal
        isOpen={showCustomizerModal}
        onClose={() => setShowCustomizerModal(false)}
        userProfile={profile}
        onApplyToProfile={(updatedProfile) => {
          setProfile(updatedProfile);
          onUpdateProfile(updatedProfile);
        }}
      />
    </div>
  );
};
