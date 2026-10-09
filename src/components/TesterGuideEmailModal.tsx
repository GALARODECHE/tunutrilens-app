import React, { useRef, useState } from 'react';
import { 
  Mail, 
  Copy, 
  Check, 
  Printer, 
  Sparkles, 
  ExternalLink,
  Smartphone,
  Droplets,
  ShoppingCart,
  Calendar,
  Baby,
  Bot,
  Send,
  TrendingUp,
  Target,
  Flame,
  Award,
  Clock,
  HeartPulse,
  Share2,
  Gift,
  Trophy
} from 'lucide-react';
import iconImg from '../assets/images/tunutrilens_icon_512_1787167869215.jpg';
import bannerImg from '../assets/images/tunutrilens_banner_hd_1787168056293.jpg';
import screenScanner from '../assets/images/screen_scanner_1787168496739.jpg';
import screenDiary from '../assets/images/screen_diary_1787168512434.jpg';
import screenRecipes from '../assets/images/screen_recipes_1787168524076.jpg';

interface TesterGuideEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TesterGuideEmailModal: React.FC<TesterGuideEmailModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'emailEnd' | 'email1' | 'email2'>('emailEnd');
  const emailEndRef = useRef<HTMLDivElement>(null);
  const email1Ref = useRef<HTMLDivElement>(null);
  const email2Ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.tunutrilens.app";

  const handleCopy = async (targetRef: React.RefObject<HTMLDivElement | null>) => {
    if (!targetRef.current) return;
    
    try {
      const range = document.createRange();
      range.selectNode(targetRef.current);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentRef = activeTab === 'emailEnd' ? emailEndRef : activeTab === 'email1' ? email1Ref : email2Ref;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 p-4 sm:p-7 space-y-6 print:border-none print:shadow-none print:max-h-full">
        
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">Plantillas de Email para Testers</h2>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Play Store Ready</span>
              </div>
              <p className="text-xs text-slate-500">Listas con tu enlace oficial de Google Play y diseño real de TuNutriLens</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleCopy(currentRef)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all ${
                copied 
                  ? 'bg-emerald-700 text-white ring-2 ring-emerald-400' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>¡Copiado! Pega en Gmail (Ctrl+V)</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar {activeTab === 'emailEnd' ? 'Email Fin de Pruebas' : activeTab === 'email1' ? 'Email 1' : 'Email 2'} (1 Clic)</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              title="Guardar como PDF o Imprimir"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>PDF</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors ml-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-3 bg-slate-100 p-1.5 rounded-2xl gap-1.5 text-xs font-bold print:hidden">
          <button
            onClick={() => setActiveTab('emailEnd')}
            className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 text-center ${
              activeTab === 'emailEnd' 
                ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span>🏆 Email: Fin de Pruebas y Descuento</span>
          </button>
          <button
            onClick={() => setActiveTab('email1')}
            className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 text-center ${
              activeTab === 'email1' 
                ? 'bg-white text-emerald-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span>🚀 Email 1: Descarga e Instalación</span>
          </button>
          <button
            onClick={() => setActiveTab('email2')}
            className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 text-center ${
              activeTab === 'email2' 
                ? 'bg-emerald-800 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span>🥗 Email 2: Guía Visual & Retos</span>
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 print:hidden text-xs text-emerald-950">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-emerald-950">
              {activeTab === 'emailEnd' 
                ? '💌 Estrategia de Cierre de Fase de Pruebas (Fin de Test):'
                : activeTab === 'email1' 
                ? '📩 Estrategia Email 1 (Para enviar primero):' 
                : '📖 Estrategia Email 2 (Guía interactiva):'}
            </p>
            <p className="text-emerald-900">
              {activeTab === 'emailEnd'
                ? 'Comunica a tus testers que el periodo de pruebas ha concluido con éxito, agradece su dedicación personal asegurando que sin ellos no habría sido posible, confirma que podrán seguir disfrutando de la app 100% gratis y avísales de que tendrán un descuento exclusivo cuando se abra la fase de compras.'
                : activeTab === 'email1' 
                ? 'Un correo corto y directo para que tus testers pulsen el enlace de Google Play y se descarguen la app hoy mismo.' 
                : 'Una guía visual completa con capturas reales de TuNutriLens y 3 retos prácticos para que prueben la IA, el escáner y el diario.'}
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* EMAIL END: FIN DE PRUEBAS, AGRADECIMIENTO Y REGALO       */}
        {/* ======================================================== */}
        {activeTab === 'emailEnd' && (
          <div 
            ref={emailEndRef}
            className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white text-slate-800 font-sans space-y-6 shadow-xs leading-relaxed"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            {/* Header Banner */}
            <div className="text-center pb-5 border-b border-amber-100 space-y-3">
              <div 
                className="rounded-2xl p-6 text-white text-center shadow-lg max-w-lg mx-auto"
                style={{
                  background: 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)',
                  border: '1px solid #92400e'
                }}
              >
                <div style={{ fontSize: '38px', marginBottom: '8px' }}>🏆</div>
                <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.5px', color: '#ffffff' }}>
                  ¡Fase de Pruebas Superada con Éxito!
                </div>
                <div style={{ fontSize: '13px', color: '#fef3c7', fontWeight: 'bold', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  TuNutriLens AI • Agradecimiento al Equipo de Testers
                </div>
              </div>

              {/* Asunto Sugerido */}
              <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 text-left max-w-lg mx-auto space-y-1">
                <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider block">Asunto recomendado para tu email:</span>
                <p className="text-sm font-bold text-amber-950">
                  🏆 ¡Fin de la prueba de TuNutriLens! Muchísimas gracias (+ sigues con la app gratis y descuento exclusivo)
                </p>
              </div>
            </div>

            {/* Email Body */}
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed max-w-2xl mx-auto">
              <p className="text-base font-bold text-slate-900">
                ¡Hola, [Nombre del Tester]!
              </p>

              <p>
                Te escribo este correo para darte una magnífica noticia: <strong>hemos completado oficialmente la fase de pruebas cerrada de TuNutriLens</strong> para Google Play.
              </p>

              <p>
                Quiero darte las <strong>gracias de todo corazón por tu tiempo, tu paciencia y tu dedicación</strong> a lo largo de estos días. Cada plato que has analizado con la cámara, cada código de barras escaneado, cada error que nos has reportado y cada opinión sincera han sido vitales para afinar la inteligencia artificial, corregir detalles y hacer que la app sea rápida, precisa y verdaderamente útil.
              </p>

              <div className="p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded-r-2xl font-semibold text-emerald-950 text-sm">
                ❤️ <em>"Sinceramente: sin tu colaboración y tu esfuerzo, este lanzamiento no habría sido posible."</em>
              </div>

              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-3 text-amber-950 shadow-xs">
                <div className="flex items-center gap-2 font-black text-amber-900 text-base">
                  <span>📱</span>
                  <span>1. ¿Tienes que hacer algo ahora? ¡Nada! Sigues usándola igual</span>
                </div>
                <p className="text-xs leading-relaxed text-amber-950/90">
                  No necesitas desinstalar nada ni configurar ninguna opción. La aplicación <strong>seguirá funcionando con total normalidad en tu teléfono móvil</strong>, tal y como lo ha hecho hasta hoy.
                </p>
              </div>

              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 space-y-3 text-emerald-950 shadow-xs">
                <div className="flex items-center gap-2 font-black text-emerald-900 text-base">
                  <span>🎁</span>
                  <span>2. Uso 100% GRATUITO hasta el lanzamiento definitivo</span>
                </div>
                <p className="text-xs leading-relaxed text-emerald-950/90">
                  Durante todo este periodo de transición hasta que se publique la versión final comercial en Google Play, <strong>el uso de TuNutriLens seguirá siendo completamente gratuito</strong>. Podrás continuar escaneando tus platos con la cámara, analizando productos de supermercado, planificando menús y registrando tu progreso sin coste alguno.
                </p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 space-y-3 text-blue-950 shadow-xs">
                <div className="flex items-center gap-2 font-black text-blue-900 text-base">
                  <span>✨</span>
                  <span>3. Un detalle exclusivo para ti en el lanzamiento oficial</span>
                </div>
                <p className="text-xs leading-relaxed text-blue-950/90">
                  Cuando llegue el día del estreno definitivo y comience la fase con opciones de suscripción, <strong>tendremos un detalle especial y exclusivo con vosotros</strong> en agradecimiento por vuestro apoyo como pioneros (acceso preferente y ventajas únicas). Te avisaremos por este mismo medio antes de cualquier cambio.
                </p>
              </div>

              <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 space-y-3 text-slate-900 shadow-xs">
                <div className="flex items-center gap-2 font-black text-slate-900 text-base">
                  <span>🌐</span>
                  <span>4. Visita nuestra web oficial para novedades</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-700">
                  Puedes visitar nuestra web oficial en <a href="https://tunutrilens.es" target="_blank" rel="noopener noreferrer" style={{ color: '#047857', fontWeight: 'bold', textDecoration: 'underline' }}>tunutrilens.es</a> para conocer más detalles sobre el proyecto, nuestra filosofía nutricional basada en comida real y las próximas novedades que estamos preparando.
                </p>
              </div>

              <p>
                Puedes seguir abriendo la aplicación cada día como de costumbre. Si descubres algún detalle o tienes cualquier sugerencia, me encantará leerte respondiendo a este mismo correo.
              </p>

              <p className="font-semibold text-slate-800">
                ¡Un abrazo enorme y una vez más, un millón de gracias por tu ayuda!
              </p>

              <div className="pt-2">
                <p className="font-extrabold text-slate-900">Equipo TuNutriLens AI</p>
                <p className="text-xs text-slate-500">contacto@tunutrilens.es • Nutrición inteligente con comida real</p>
              </div>
            </div>

            <hr className="border-slate-200" />

            <div className="bg-slate-50 p-4 rounded-2xl text-center space-y-1 text-xs text-slate-600">
              <p className="font-bold text-slate-800">📋 ¿Cómo enviar este email?</p>
              <p>Pulsa el botón superior verde <strong>"Copiar Email Fin de Pruebas"</strong> y pégalo directamente en Gmail o en tu cliente de correo (Ctrl+V). Mantendrá el formato, los colores y la estructura.</p>
            </div>
          </div>
        )}
        {/* ======================================================== */}
        {activeTab === 'email1' && (
          <div 
            ref={email1Ref}
            className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white text-slate-800 font-sans space-y-6 shadow-xs leading-relaxed"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            {/* Header Banner */}
            <div className="text-center pb-5 border-b border-emerald-100 space-y-3">
              {/* Fallback & Visual Email Banner */}
              <div 
                className="rounded-2xl p-6 text-white text-center shadow-lg max-w-lg mx-auto"
                style={{
                  background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)',
                  border: '1px solid #065f46'
                }}
              >
                <div style={{ fontSize: '38px', marginBottom: '8px' }}>🥗</div>
                <div style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '-0.5px', color: '#ffffff' }}>TuNutriLens</div>
                <div style={{ fontSize: '13px', color: '#a7f3d0', fontWeight: 'bold', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Nutrición Inteligente con IA
                </div>
              </div>

              <div className="pt-2">
                <h1 className="text-2xl font-black text-emerald-900">TuNutriLens ya está en Google Play</h1>
                <p className="text-sm font-semibold text-slate-600">¡Tu acceso exclusivo como tester oficial está listo!</p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 text-sm text-slate-700">
              <p>¡Hola!</p>
              <p>
                ¡Por fin ha llegado el momento! Ya tenemos la primera versión oficial de <strong>TuNutriLens</strong> subida a <strong>Google Play Store</strong> para que puedas instalarla y probarla antes que nadie.
              </p>

              {/* Call to action card */}
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 text-center space-y-3 my-4 shadow-sm">
                <span className="text-xs uppercase tracking-widest font-black text-emerald-800 block">📲 Enlace Oficial de Google Play</span>
                <a 
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm sm:text-base px-6 py-3 rounded-xl shadow-md transition-transform hover:scale-105"
                  style={{ textDecoration: 'none' }}
                >
                  <span>👉 Descargar TuNutriLens en Google Play</span>
                </a>
                <p className="text-xs text-emerald-800 break-all font-mono">
                  {PLAY_STORE_URL}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                <strong className="text-slate-900 block text-sm">📌 Instrucciones para probarla en 2 minutos:</strong>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                  <li>Haz clic en el enlace desde tu teléfono Android con la <strong>misma cuenta de Gmail</strong> que me diste.</li>
                  <li>Pulsa en <strong>Instalar</strong>.</li>
                  <li>Abre la app y haz una foto a cualquier plato de comida para ver cómo la Inteligencia Artificial reconoce los ingredientes y las calorías.</li>
                </ol>
              </div>

              {/* CLÁUSULA ESPECIAL PARA TESTERS: USO GRATIS Y DESCUENTO FUTURO */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 space-y-2 text-xs text-amber-950 shadow-xs">
                <div className="flex items-center gap-2 font-black text-amber-900 text-sm">
                  <span>🎁</span>
                  <span>Ventaja Exclusiva para Testers Oficiales</span>
                </div>
                <p className="leading-relaxed">
                  Podrás <strong>seguir usando la aplicación de manera 100% gratuita</strong> durante todo el periodo de pruebas para disfrutar de todas sus funciones.
                </p>
                <p className="leading-relaxed">
                  Más adelante, cuando la app pase a la <strong>fase oficial de compras y suscripciones</strong>, te avisaremos con antelación y <strong>recibirás un descuento exclusivo muy especial</strong> como agradecimiento por tu apoyo y ayuda en esta etapa.
                </p>
              </div>

              <p>
                Mañana te mandaré una pequeña guía con 3 retos sencillos para probar el resto de funciones (Supermercado Lens con Semáforo Nutricional, Diario nutricional y Recetas).
              </p>

              <p className="font-semibold text-emerald-900 pt-2">
                ¡Mil gracias de corazón por tu ayuda para hacer realidad este proyecto! 💚
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* EMAIL 2: GUÍA VISUAL COMPLETA CON TARJETAS REALES Y RETOS */}
        {/* ======================================================== */}
        {activeTab === 'email2' && (
          <div 
            ref={email2Ref}
            className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-white text-slate-800 font-sans space-y-6 shadow-xs leading-relaxed"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            {/* Header Banner */}
            <div className="text-center pb-6 border-b border-emerald-100 space-y-3">
              {/* Fallback & Visual Email Banner */}
              <div 
                className="rounded-2xl p-6 text-white text-center shadow-lg max-w-lg mx-auto"
                style={{
                  background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%)',
                  border: '1px solid #065f46'
                }}
              >
                <div style={{ fontSize: '38px', marginBottom: '8px' }}>🥗</div>
                <div style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '-0.5px', color: '#ffffff' }}>TuNutriLens</div>
                <div style={{ fontSize: '13px', color: '#a7f3d0', fontWeight: 'bold', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Nutrición Inteligente con IA
                </div>
              </div>

              <div className="pt-2">
                <h2 className="text-xl font-bold text-slate-900">Guía Visual de Bienvenida para Testers</h2>
                <p className="text-sm text-slate-600 max-w-xl mx-auto">
                  Conoce todas las funciones de tu nueva app de nutrición e IA y completa los 3 retos para testers.
                </p>
              </div>

              {/* Play Store pill in email */}
              <div className="pt-2">
                <a 
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs"
                  style={{ textDecoration: 'none' }}
                >
                  <span>📲 Disponible en Google Play: {PLAY_STORE_URL}</span>
                </a>
              </div>
            </div>

            {/* Intro */}
            <div className="text-sm text-slate-700 space-y-3">
              <p>¡Hola!</p>
              <p>
                ¡Muchísimas gracias por formar parte del equipo de testers de <strong>TuNutriLens</strong>! He preparado esta guía visual con las pantallas reales de la aplicación para que conozcas todas las herramientas disponibles y le saques el máximo partido desde el primer día.
              </p>
            </div>

            {/* 3 RETOS DESTACADOS */}
            <div className="bg-emerald-900 text-white rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center gap-2 border-b border-emerald-800 pb-2.5">
                <Target className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-base text-white">🎯 3 Retos Rápidos para Probar Hoy</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-emerald-800/90 p-3 rounded-xl border border-emerald-700 space-y-1">
                  <div className="font-black text-emerald-300 flex items-center gap-1.5">
                    <span>1️⃣</span> Reto Escáner IA
                  </div>
                  <p className="text-emerald-100">Haz una foto a tu almuerzo o cena y pulsa <em>"Registrar en Diario"</em>.</p>
                </div>
                <div className="bg-emerald-800/90 p-3 rounded-xl border border-emerald-700 space-y-1">
                  <div className="font-black text-amber-300 flex items-center gap-1.5">
                    <span>2️⃣</span> Reto Semáforo de Supermercado
                  </div>
                  <p className="text-emerald-100">Escanea un producto envasado de tu despensa para ver su semáforo de salud abierto.</p>
                </div>
                <div className="bg-emerald-800/90 p-3 rounded-xl border border-emerald-700 space-y-1">
                  <div className="font-black text-blue-300 flex items-center gap-1.5">
                    <span>3️⃣</span> Reto Nevera Anti-Desperdicio
                  </div>
                  <p className="text-emerald-100">Haz una foto a tus estantes para ver 3 recetas mediterráneas con lo que tienes.</p>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* SECCIÓN 1: ESCÁNER INTELIGENTE */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-base">
                <span>📸</span>
                <h3>1. Escáner Inteligente con IA (Platos y Comidas)</h3>
              </div>
              <p className="text-sm text-slate-600">
                Haz una foto a cualquier plato de comida o súbela desde tu galería. La Inteligencia Artificial reconoce los ingredientes, estima las raciones, calcula las calorías totales y desglosa las proteínas, carbohidratos y grasas.
              </p>

              {/* REAL APP CARD: Scanner */}
              <div className="max-w-md mx-auto bg-slate-900 text-white rounded-2xl p-4 shadow-md border border-slate-800 space-y-3 my-3">
                <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
                  <span className="font-extrabold text-emerald-400">🥗 TuNutriLens • Escáner IA</span>
                  <span className="bg-emerald-600/80 px-2 py-0.5 rounded text-[11px] font-bold">Detección Automática</span>
                </div>
                <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-black text-white">Bowl Salmón & Quinoa</div>
                      <div className="text-xs text-slate-400">Salmón fresco, aguacate, edamame, quinoa</div>
                    </div>
                    <span className="text-sm font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">520 kcal</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center pt-1 text-xs">
                    <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Proteína</span>
                      <strong className="text-emerald-400">36g</strong>
                    </div>
                    <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Carbohidratos</span>
                      <strong className="text-amber-400">48g</strong>
                    </div>
                    <div className="bg-slate-900/80 p-1.5 rounded-lg border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Grasas</span>
                      <strong className="text-blue-400">18g</strong>
                    </div>
                  </div>
                </div>
                <div className="bg-emerald-600 text-white font-bold py-2 rounded-xl text-center text-xs">
                  ✓ Registrar en Diario con 1 Clic
                </div>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-100 rounded-lg p-3 text-xs text-emerald-900 font-medium">
                👉 <strong>Cómo probarlo:</strong> Pulsa en <em>Escáner</em> ➔ Haz foto a tu comida ➔ Pulsa <em>"Registrar en Diario"</em>.
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* SECCIÓN 2: SUPERMERCADO LENS */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-base">
                <span>🛒</span>
                <h3>2. Supermercado Lens (Semáforo Nutricional y Etiquetas)</h3>
              </div>
              <p className="text-sm text-slate-600">
                Analiza productos envasados del supermercado para saber si son saludables de verdad. Descubre su <strong>Semáforo de Salud (Verde, Ámbar o Rojo)</strong>, su nivel de procesamiento <strong>NOVA (1 a 4)</strong> y una explicación clara sobre azúcares y aditivos.
              </p>

              {/* REAL APP CARD: Supermarket */}
              <div className="max-w-md mx-auto bg-white rounded-2xl p-4 shadow-md border border-slate-200 space-y-3 my-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs text-center p-1 leading-tight">
                      🟢 Óptimo
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Yogur Griego 0% Natural</h4>
                      <p className="text-xs text-slate-500">Supermercado • Lácteos</p>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                    NOVA 1 (Natural)
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between p-2 rounded-lg bg-emerald-50 text-emerald-900">
                    <span>Azúcares añadidos: 0g</span>
                    <strong className="text-emerald-700">✓ Excelente</strong>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-emerald-50 text-emerald-900">
                    <span>Grasas saturadas: 0.1g</span>
                    <strong className="text-emerald-700">✓ Muy Bajo</strong>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-blue-50 text-blue-900">
                    <span>Proteínas: 10.3g / 100g</span>
                    <strong className="text-blue-700">★ Alto en Proteína</strong>
                  </div>
                </div>
                <div className="bg-emerald-800 text-white p-2.5 rounded-xl text-xs">
                  <strong>Veredicto:</strong> Alimento no ultraprocesado, excelente fuente de probióticos y proteínas limpias.
                </div>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-100 rounded-lg p-3 text-xs text-emerald-900 font-medium">
                👉 <strong>Cómo probarlo:</strong> Escanea el paquete de un producto de tu nevera para ver su semáforo nutricional.
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* SECCIÓN 3: DIARIO NUTRICIONAL Y AGUA */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-base">
                <span>📖</span>
                <h3>3. Diario Nutricional y Registro de Agua</h3>
              </div>
              <p className="text-sm text-slate-600">
                Lleva el control de tus comidas diarias divididas en Desayuno, Almuerzo, Cena y Snacks. Verás tus anillos de calorías y nutrientes completándose en tiempo real, además de un contador de vasos de agua para mantenerte hidratado/a.
              </p>

              {/* REAL APP CARD: Diary */}
              <div className="max-w-md mx-auto bg-white rounded-2xl p-4 shadow-md border border-slate-200 space-y-3 my-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900 text-sm">Balance de Hoy</span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    1.450 / 2.100 kcal
                  </span>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Restante para tu meta</span>
                    <span className="text-emerald-600 font-bold">650 kcal</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '69%' }} />
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 flex justify-between items-center">
                    <span>🍳 <strong>Desayuno:</strong> Tortilla francesa & Tostada de centeno</span>
                    <span className="font-bold text-slate-700">420 kcal</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 flex justify-between items-center">
                    <span>🥗 <strong>Almuerzo:</strong> Bowl Salmón & Quinoa</span>
                    <span className="font-bold text-slate-700">520 kcal</span>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-xl flex items-center justify-between text-xs text-blue-950 font-bold">
                  <span className="flex items-center gap-1.5">💧 Hidratación: 1.75 L / 2.5 L</span>
                  <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-[11px]">+ Añadir Vaso</span>
                </div>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-100 rounded-lg p-3 text-xs text-emerald-900 font-medium">
                👉 <strong>Cómo probarlo:</strong> Entra en la pestaña <em>Diario</em> para revisar tu balance calórico del día.
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* SECCIÓN 4: PLANES Y RECETAS */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-base">
                <span>🥗</span>
                <h3>4. Planes y Recetas Saludables</h3>
              </div>
              <p className="text-sm text-slate-600">
                Descubre recetas deliciosas y fáciles clasificadas por objetivos (Mediterránea, Antiinflamatoria, Salud Digestiva, Alta en Proteínas). Cada receta incluye tiempo de preparación, ingredientes paso a paso y la opción de añadirla al diario con 1 clic.
              </p>

              {/* REAL APP CARD: Recipe */}
              <div className="max-w-md mx-auto bg-white rounded-2xl p-4 shadow-md border border-slate-200 space-y-2.5 my-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Dieta Mediterránea</span>
                  <span className="text-xs font-bold text-emerald-700">380 kcal</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Ensalada Templada de Pollo, Aguacate y Nueces</h4>
                  <p className="text-xs text-slate-500">⏱️ 15 min • 💪 34g Proteína • 🌿 Sin Gluten</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg text-xs text-slate-600 space-y-0.5">
                  <p><strong>Ingredientes:</strong> Pechuga a la plancha, espinacas baby, 1/2 aguacate, nueces, aceite de oliva virgen extra.</p>
                </div>
                <div className="bg-emerald-600 text-white font-bold py-1.5 rounded-lg text-center text-xs">
                  + Añadir a mi Diario de Hoy
                </div>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-100 rounded-lg p-3 text-xs text-emerald-900 font-medium">
                👉 <strong>Cómo probarlo:</strong> En la pestaña <em>Planes</em>, pulsa sobre cualquier receta que te guste para ver sus instrucciones.
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* SECCIÓN 5: MENÚ SEMANAL Y LISTA DE LA COMPRA */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-base">
                <span>📅</span>
                <h3>5. Menú Semanal y Lista de la Compra Interactiva</h3>
              </div>
              <p className="text-sm text-slate-600">
                Un planificador completo de Lunes a Domingo para organizar tus comidas sin estrés. Además, genera automáticamente la <strong>Lista de la Compra</strong> organizada por secciones del supermercado con casillas interactivas para ir tachando mientras compras.
              </p>

              {/* REAL APP CARD: Shopping List & Weekly */}
              <div className="max-w-md mx-auto bg-white rounded-2xl p-4 shadow-md border border-slate-200 space-y-3 my-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900 text-sm">Plan 7 Días & Lista del Súper</span>
                  <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">Lunes a Domingo</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-emerald-800 block">🥬 Frutas y Verduras</span>
                    <div className="text-slate-600 space-y-0.5 text-[11px]">
                      <div>☑ Aguacates (2 uds)</div>
                      <div>☑ Espinacas frescas (1 bolsa)</div>
                      <div>☑ Limones (1 kg)</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 space-y-1">
                    <span className="font-bold text-emerald-800 block">🥩 Carnes y Pescados</span>
                    <div className="text-slate-600 space-y-0.5 text-[11px]">
                      <div>☑ Lomos de Salmón (400g)</div>
                      <div>☑ Pechuga de pollo (500g)</div>
                      <div>☑ Huevos camperos (1 docena)</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-100 rounded-lg p-3 text-xs text-emerald-900 font-medium">
                👉 <strong>Cómo probarlo:</strong> Entra en <em>Menú Semanal</em> y revisa la lista de la compra generada.
              </div>
            </div>

            {/* CLÁUSULA ESPECIAL PARA TESTERS: USO GRATIS Y DESCUENTO FUTURO */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-2 text-xs text-amber-950 shadow-xs">
              <div className="flex items-center gap-2 font-black text-amber-900 text-sm">
                <span>🎁</span>
                <span>Tu Acceso Gratuito & Descuento Especial Futuro</span>
              </div>
              <p className="leading-relaxed">
                Como miembro de nuestro equipo oficial de testers, puedes <strong>seguir utilizando TuNutriLens de manera 100% gratuita</strong> sin ningún tipo de cobro durante todo el periodo de pruebas.
              </p>
              <p className="leading-relaxed">
                Cuando la aplicación se publique definitivamente y pase a la <strong>fase de compras y suscripciones</strong>, recibirás un aviso previo con un <strong>código de descuento exclusivo para testers</strong>, para que puedas suscribirte con una tarifa reducida de por vida por haber sido pionero.
              </p>
            </div>

            <hr className="border-slate-200" />

            {/* Footer of the Email */}
            <div className="bg-slate-50 p-4 rounded-2xl text-center space-y-2 text-xs text-slate-600">
              <p className="font-bold text-slate-800 text-sm">💌 Tu opinión es fundamental</p>
              <p>
                Si ves cualquier cosa que no funcione bien, textos que se puedan mejorar o ideas nuevas, ¡avísame sin dudarlo!
              </p>
              <p className="font-semibold text-emerald-800 pt-1">
                ¡Muchas gracias de nuevo por tu ayuda y que disfrutes de TuNutriLens! 💚
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
