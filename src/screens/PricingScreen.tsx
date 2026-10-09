import React, { useState } from 'react';
import {
  Check,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  CreditCard,
  Zap,
  Lock,
  ChevronDown,
  HelpCircle,
  Clock
} from 'lucide-react';
import { activateSubscriptionPlan, getSubscriptionPlan } from '../services/usageLimitService';

export const PricingScreen: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [activePlanId, setActivePlanId] = useState<string>(() => {
    try {
      return getSubscriptionPlan() || 'b2c_free';
    } catch {
      return 'b2c_free';
    }
  });

  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<{
    id: string;
    name: string;
    displayPrice: string;
    billingPeriod: string;
  } | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bizum' | 'googlepay'>('card');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleSelectPlan = (planId: string, planName: string, priceStr: string) => {
    if (planId === activePlanId) return;
    setSelectedCheckoutPlan({
      id: planId,
      name: planName,
      displayPrice: priceStr,
      billingPeriod: billingCycle === 'annual' ? 'año' : 'mes'
    });
    setPromoCode('');
    setPromoApplied(false);
    setPromoError('');
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (!code) return;
    if (['TESTER', 'PROMO100', 'VIP', 'PREMIUMFREE'].includes(code)) {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Código no válido o caducado.');
    }
  };

  const handleConfirmSubscription = () => {
    if (!selectedCheckoutPlan) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      activateSubscriptionPlan(selectedCheckoutPlan.id as any);
      setActivePlanId(selectedCheckoutPlan.id);
      setSelectedCheckoutPlan(null);
      setShowSuccessToast(true);

      setTimeout(() => setShowSuccessToast(false), 4500);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 pb-24 md:pb-16 animate-in fade-in">
      {/* Toast de confirmación */}
      {showSuccessToast && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between border border-emerald-400">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
            <div>
              <h4 className="font-black text-sm">¡Plan activado correctamente!</h4>
              <p className="text-xs text-emerald-100">Disfruta de todas las ventajas de tu suscripción.</p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-white/20 rounded-lg">Activo</span>
        </div>
      )}

      {/* Selector de Ciclo de Facturación (Pago Mensual / Pago Anual) */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <span className={`text-sm sm:text-base font-extrabold cursor-pointer ${
          billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'
        }`} onClick={() => setBillingCycle('monthly')}>
          Pago Mensual
        </span>

        <button
          type="button"
          onClick={() => setBillingCycle(b => b === 'monthly' ? 'annual' : 'monthly')}
          className="w-14 h-8 bg-emerald-600 p-1 rounded-full relative transition-all duration-300 focus:outline-none shadow-xs cursor-pointer"
          aria-label="Alternar entre pago mensual y anual"
        >
          <div
            className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
              billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>

        <span className={`text-sm sm:text-base font-extrabold cursor-pointer ${
          billingCycle === 'annual' ? 'text-slate-900' : 'text-slate-500'
        }`} onClick={() => setBillingCycle('annual')}>
          Pago Anual (Anualidad)
        </span>

        <span className="px-3 py-1 bg-amber-100/90 text-amber-900 border border-amber-300/80 rounded-full text-xs font-black tracking-wide shadow-xs">
          Ahorras 2 Meses (+20% Descuento)
        </span>
      </div>

      {/* Grid de las 3 Tarifas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2">

        {/* 1. NUTRIPERSONAL GRATUITO */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6 relative hover:border-slate-300 transition-all">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-slate-900">NutriPersonal Gratuito</h3>
                <p className="text-xs text-slate-500 mt-0.5">Escaneo de platos y súper + Descubrir</p>
              </div>
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
                Gratis
              </span>
            </div>

            <div className="py-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-slate-900">0 €</span>
                <span className="text-xs text-slate-500 font-medium">para siempre</span>
              </div>
            </div>

            {/* Cuadro destacado */}
            <div className="p-3.5 bg-slate-50/90 border border-slate-200/80 rounded-2xl space-y-1">
              <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Descubre y prueba la IA en tu día a día</span>
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Incluye 5 escaneos fotográficos mensuales en Plato y Supermercado, además de acceso completo al apartado Descubrir.
              </p>
            </div>

            {/* Lista de características */}
            <ul className="space-y-2.5 text-xs text-slate-700 pt-1">
              <li className="flex items-start gap-2 leading-relaxed">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>5 escaneos fotográficos con IA al mes</strong> en Escáner de Plato y Supermercado</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Apartado Descubrir completo:</strong> Planes recomendados, recetas y calendario de temporada</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Análisis de calorías, macronutrientes y semáforo nutricional</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <span className="w-4 h-4 text-slate-300 shrink-0 text-center font-bold">✕</span>
                <span className="line-through">Nevera Residuo Cero (Exclusivo Premium)</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <span className="w-4 h-4 text-slate-300 shrink-0 text-center font-bold">✕</span>
                <span className="line-through">Mi Nutrición: Diario, menús y peso (Exclusivo Premium)</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPlan('b2c_free', 'NutriPersonal Gratuito', '0 €')}
            disabled={activePlanId === 'b2c_free'}
            className={`w-full py-3.5 px-4 rounded-xl font-black text-xs transition-all shadow-xs cursor-pointer ${
              activePlanId === 'b2c_free'
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-default'
                : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-98'
            }`}
          >
            {activePlanId === 'b2c_free' ? '✓ Tu Plan Actual' : 'Seleccionar Plan Gratuito'}
          </button>
        </div>

        {/* 2. NUTRIPERSONAL PRO */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6 relative hover:shadow-md transition-all">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-1.5">
                  <span>NutriPersonal Pro</span>
                  <Sparkles className="w-4 h-4 text-slate-400" />
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Cupo de hasta 40 fotos al mes (~1 al día)</p>
              </div>
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
                Básico
              </span>
            </div>

            <div className="py-2">
              {billingCycle === 'monthly' ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-slate-900">9.99 €</span>
                  <span className="text-xs text-slate-500 font-medium">/ mes</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-slate-900">5.00 €</span>
                    <span className="text-xs text-slate-500 font-medium">/ mes (facturado 1 pago anual)</span>
                  </div>
                  <p className="text-xs font-bold text-emerald-700">
                    Facturación anual de 59,99 € (Ahorras 60 € al año — solo 4,99 €/mes)
                  </p>
                </div>
              )}
            </div>

            {/* Cuadro destacado Pro */}
            <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl">
              <p className="text-xs font-bold text-amber-900 leading-relaxed">
                Ideal para seguimiento diario regular con hasta 40 escaneos fotográficos mensuales en plato, súper y nevera.
              </p>
            </div>

            {/* Lista de características Pro */}
            <ul className="space-y-2.5 text-xs text-slate-700 pt-1">
              <li className="flex items-start gap-2 leading-relaxed">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Hasta 40 fotos con IA al mes en total:</strong> En plato, súper y nevera</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Acceso completo a Nevera Residuo Cero:</strong> Visión IA y recetas anti-desperdicio</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Acceso completo a Mi Nutrición:</strong> Diario calórico, planes semanales y evolución</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Informes Clínicos y PDF:</strong> Resúmenes descargables e imprimibles</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Desglose de 10 micronutrientes y semáforo nutricional</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPlan(
              'b2c_pro',
              'NutriPersonal Pro',
              billingCycle === 'annual' ? '59,99 € / año' : '9.99 € / mes'
            )}
            disabled={activePlanId === 'b2c_pro'}
            className={`w-full py-3.5 px-4 rounded-xl font-black text-xs transition-all shadow-xs cursor-pointer ${
              activePlanId === 'b2c_pro'
                ? 'bg-slate-100 text-slate-800 border border-slate-300 cursor-default'
                : 'bg-slate-800 hover:bg-slate-900 text-white active:scale-98'
            }`}
          >
            {activePlanId === 'b2c_pro' ? '✓ Plan Activo' : `Elegir Plan Pro (${billingCycle === 'annual' ? '5.00 €/mes' : '9.99 €/mes'})`}
          </button>
        </div>

        {/* 3. TARIFA ILIMITADA (DESTACADO / MÁS POPULAR) */}
        <div className="bg-[#0b1320] text-white rounded-3xl p-6 sm:p-7 border-2 border-amber-400 shadow-2xl flex flex-col justify-between space-y-6 relative hover:shadow-2xl transition-all">
          <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-md flex items-center gap-1 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
            <span>MÁS POPULAR</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-white">Tarifa Ilimitada</h3>
                <p className="text-xs text-slate-300 mt-0.5">Fotos infinitas sin preocuparte por el contador</p>
              </div>
            </div>

            <div className="py-2">
              {billingCycle === 'monthly' ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-white">14.99 €</span>
                  <span className="text-xs text-slate-300 font-medium">/ mes</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-white">7.50 €</span>
                    <span className="text-xs text-slate-300 font-medium">/ mes (facturado 1 pago anual)</span>
                  </div>
                  <p className="text-xs font-bold text-amber-300">
                    Facturación anual de 89,99 € (Ahorras ~90 € al año — solo 7,49 €/mes)
                  </p>
                </div>
              )}
            </div>

            {/* Cuadro destacado Ilimitada */}
            <div className="p-3.5 bg-amber-500/10 border border-amber-400/40 rounded-2xl space-y-1.5">
              <p className="text-xs font-bold text-amber-200 leading-snug flex items-start gap-1.5">
                <span className="text-amber-400">⚡</span>
                <span>La opción preferida: por solo 5 € más al mes disfruta de fotos ilimitadas en plato, súper y nevera sin cortes.</span>
              </p>
              <p className="text-[10px] text-amber-300/80 leading-relaxed flex items-center gap-1">
                <span>🛡️</span>
                <span>Protección anti-abuso: hasta 600 fotos/mes bajo Política de Uso Justo (Fair Use). 7 días de prueba con cancelación garantizada.</span>
              </p>
            </div>

            {/* Lista de características Ilimitada */}
            <ul className="space-y-2.5 text-xs text-slate-200 pt-1">
              <li className="flex items-start gap-2 leading-relaxed">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>¡Fotos ILIMITADAS en el día a día!</strong> En plato, supermercado y nevera</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Blindaje de Uso Justo:</strong> Hasta 600 escaneos/mes (~20 fotos/día) para evitar el uso indiscriminado y bots</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Garantía de 7 días de prueba:</strong> Si no te convence, cancelas sin coste en la primera semana</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Nevera Residuo Cero completo:</strong> Fotografía estantes con IA y crea recetas</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Mi Nutrición completo:</strong> Diario calórico, menús semanales y evolución</span>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Procesamiento IA Prioritario:</strong> Respuestas ultra-rápidas con blindaje anti-bot</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPlan(
              'b2c_unlimited',
              'Tarifa Ilimitada',
              billingCycle === 'annual' ? '89,99 € / año' : '14.99 € / mes'
            )}
            disabled={activePlanId === 'b2c_unlimited'}
            className={`w-full py-3.5 px-4 rounded-xl font-black text-xs transition-all shadow-lg cursor-pointer ${
              activePlanId === 'b2c_unlimited'
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 cursor-default'
                : 'bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-400 text-slate-950 active:scale-98'
            }`}
          >
            {activePlanId === 'b2c_unlimited' ? '✓ Plan Activo' : `Elegir Tarifa Ilimitada (${billingCycle === 'annual' ? '7.50 €/mes' : '14.99 €/mes'})`}
          </button>
        </div>

      </div>

      {/* Preguntas Frecuentes breves */}
      <div className="max-w-2xl mx-auto pt-4 space-y-3">
        <div className="text-center space-y-1">
          <h3 className="text-base font-black text-slate-900 flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Preguntas Frecuentes sobre las Tarifas</span>
          </h3>
          <p className="text-xs text-slate-500">Transparencia total sin costes ocultos</p>
        </div>

        <div className="space-y-2">
          {[
            {
              q: '¿Cómo funciona la cancelación de la suscripción?',
              a: 'Sin permanencia de ningún tipo. Puedes cancelar la renovación automática en cualquier momento desde tu apartado "Mi Perfil > Gestionar Suscripción". Mantendrás el acceso a tu plan hasta el final del periodo ya abonado.'
            },
            {
              q: '¿Qué es el Blindaje de Uso Justo de 600 fotos/mes en la Tarifa Ilimitada?',
              a: 'Para uso personal o familiar diario, 600 fotos equivalen a unos 20 análisis fotográficos diarios. Esta política evita ataques automatizados de bots o reventa a empresas sin restringir tu experiencia diaria.'
            },
            {
              q: '¿Qué ocurre si supero los 5 escaneos gratuitos?',
              a: 'Podrás seguir consultando tus datos, explorando recetas y buscando alimentos en el buscador de la base de datos oficial. Para seguir haciendo fotos con la cámara, puedes actualizar a NutriPersonal Pro o Tarifa Ilimitada.'
            }
          ].map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 hover:bg-slate-50 transition cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-3.5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2.5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de checkout / activación */}
      {selectedCheckoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Activar Suscripción</h3>
                <p className="text-xs text-slate-500">Plan seleccionado: {selectedCheckoutPlan.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCheckoutPlan(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Resumen del importe */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-600 font-bold block">{selectedCheckoutPlan.name}</span>
                <span className="text-[11px] text-slate-400">Facturación por {selectedCheckoutPlan.billingPeriod}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">
                  {promoApplied ? '0 €' : selectedCheckoutPlan.displayPrice}
                </span>
                {promoApplied && (
                  <span className="text-[10px] text-emerald-600 font-bold block">100% Bonificado (Pase Tester)</span>
                )}
              </div>
            </div>

            {/* Código promocional / Tester */}
            <form onSubmit={handleApplyPromo} className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 block">¿Tienes un código de Tester?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Ej: TESTER"
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                >
                  Aplicar
                </button>
              </div>
              {promoError && <p className="text-[10px] text-rose-500 font-semibold">{promoError}</p>}
              {promoApplied && <p className="text-[10px] text-emerald-600 font-bold">✓ Código aplicado correctamente</p>}
            </form>

            {/* Método de pago */}
            {!promoApplied && selectedCheckoutPlan.displayPrice !== '0 €' && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-600 block">Método de pago:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Tarjeta', icon: CreditCard },
                    { id: 'bizum', label: 'Bizum', icon: Zap },
                    { id: 'googlepay', label: 'Google Pay', icon: Lock }
                  ].map((method) => {
                    const IconComp = method.icon;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition cursor-pointer ${
                          paymentMethod === method.id
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-black'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                        <span>{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Botón de confirmación */}
            <button
              type="button"
              onClick={handleConfirmSubscription}
              disabled={isProcessingPayment}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-black text-xs transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessingPayment ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Procesando activación...</span>
                </>
              ) : (
                <span>Confirmar y Activar Plan</span>
              )}
            </button>

            <p className="text-[10px] text-center text-slate-400">
              Pago 100% seguro con cifrado bancario. Cancela en cualquier momento sin penalizaciones.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
