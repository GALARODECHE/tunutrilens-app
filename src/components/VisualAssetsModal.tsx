import React from 'react';
import {
  Download,
  ExternalLink,
  Smartphone,
  Sparkles,
  CheckCircle2,
  X,
  Image as ImageIcon
} from 'lucide-react';

interface VisualAssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScreenshotItem {
  id: string;
  num: number;
  title: string;
  desc: string;
  filename: string;
  category: string;
}

const officialScreenshots: ScreenshotItem[] = [
  {
    id: 's1',
    num: 1,
    title: 'Escáner de Plato con Visión IA',
    desc: 'Detección en 2 segundos, peso estimado en gramos y desglose de macronutrientes.',
    filename: 'TuNutriLens_1_EscanerComida.png',
    category: 'Cámara IA'
  },
  {
    id: 's2',
    num: 2,
    title: 'Supermercado & Código de Barras',
    desc: 'Semáforo nutricional abierto de salud, Grado NOVA y semáforo de azúcares y grasas.',
    filename: 'TuNutriLens_2_Supermercado.png',
    category: 'Etiquetas'
  },
  {
    id: 's3',
    num: 3,
    title: 'Diario Nutricional & Resumen Diario',
    desc: 'Anillo calórico en tiempo real, registro de hidratación y racha de hábitos.',
    filename: 'TuNutriLens_3_DiarioNutricional.png',
    category: 'Diario'
  },
  {
    id: 's4',
    num: 4,
    title: 'Plan Nutricional Semanal Personalizable',
    desc: 'Metas calóricas diarias, macros por día y autogeneración inteligente con IA.',
    filename: 'TuNutriLens_4_PlanSemanal.png',
    category: 'Planes'
  },
  {
    id: 's5',
    num: 5,
    title: 'Nutrición Clínica por Etapas de la Vida',
    desc: 'Guías oficiales ESPEN/ASPEN: embarazo, menopausia, deportistas, tercera edad e infancia.',
    filename: 'TuNutriLens_5_EtapasVida.png',
    category: 'Guías Clínicas'
  },
  {
    id: 's6',
    num: 6,
    title: 'Nevera Residuo Cero & Recetas IA',
    desc: 'Fotografía tus ingredientes y genera recetas mediterráneas de aprovechamiento.',
    filename: 'TuNutriLens_6_NeveraResiduoCero.png',
    category: 'Sostenibilidad'
  },
  {
    id: 's7',
    num: 7,
    title: 'Evolución Corporal & Progreso de Peso',
    desc: 'Curva de descenso de grasa saludable preservando músculo sin efecto rebote.',
    filename: 'TuNutriLens_7_ProgresoPeso.png',
    category: 'Progreso'
  },
  {
    id: 's8',
    num: 8,
    title: 'Metabolismo Basal (BMR / TDEE) & Gala IA',
    desc: 'Fórmulas clínicas Mifflin-St Jeor, gasto calórico y coach nutricional 24/7.',
    filename: 'TuNutriLens_8_NutriCoachIA.png',
    category: 'Metabolismo'
  }
];

export const VisualAssetsModal: React.FC<VisualAssetsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const downloadImage = (filename: string) => {
    const link = document.createElement('a');
    link.href = `/screenshots/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadFullZip = () => {
    const link = document.createElement('a');
    link.href = '/screenshots/TuNutriLens_8_Capturas_PlayStore.zip';
    link.download = 'TuNutriLens_8_Capturas_PlayStore.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-emerald-100">
        
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300 border border-white/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                  Recursos Oficiales para Google Play Console
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 hidden sm:inline-block">
                  100% Verificados
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-200/90 font-medium">
                8 Capturas (1080 × 1920 px, 9:16) y Elemento Gráfico Destacado (1024 × 500 px)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadFullZip}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
              title="Descargar paquete ZIP con todos los archivos"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Descargar Todo en ZIP</span>
              <span className="sm:hidden">ZIP</span>
            </button>
            
            <a
              href="/screenshots.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors flex items-center gap-1 text-xs font-bold border border-white/10"
              title="Abrir galería en una pestaña nueva"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden md:inline">Galería Web</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-900 bg-slate-50/50">

          {/* GOOGLE PLAY INSTRUCTIONS PILL */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs sm:text-sm text-emerald-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Listos para subir en Google Play Console:
              </span>
              <p className="text-slate-600 text-xs">
                En tu consola, ve a <strong>Crecimiento &gt; Presencia en Google Play Store &gt; Ficha de Play Store principal</strong>. Sube el gráfico destacado en su sección y las 8 capturas en <strong>Capturas de pantalla de teléfonos</strong>.
              </p>
            </div>
            <button
              onClick={downloadFullZip}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Descargar ZIP Completo
            </button>
          </div>

          {/* SECTION 1: ELEMENTO GRÁFICO DESTACADO (1024 x 500 px) - 2 OPCIONES */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    ✓ Requisito Google Play Store
                  </span>
                  <span className="text-xs font-mono text-slate-500">1024 × 500 px • Máximo 15 MB (Nuestros archivos: ~180 KB)</span>
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mt-1">
                  Elemento Gráfico Destacado (Feature Graphic)
                </h3>
                <p className="text-xs text-slate-600">
                  Dos opciones oficiales listas en 1024 × 500 px. Elige la que mejor encaje con tu estilo o súbelas a tu Play Console.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Opción A: Fotográfica HD TuNutriLens */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/60 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      Opción A: Fotografía HD TuNutriLens
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">1024 × 500 px</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Banner Fotográfico Oficial de Marca</h4>
                  <p className="text-xs text-slate-500">
                    Comida real mediterránea, smartphone escaneando plato y estética limpia.
                  </p>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 group relative">
                  <img
                    src="/screenshots/TuNutriLens_Elemento_Grafico_Foto_1024x500.png"
                    alt="Elemento Gráfico Fotográfico TuNutriLens 1024x500"
                    className="w-full aspect-[1024/500] object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a
                      href="/screenshots/TuNutriLens_Elemento_Grafico_Foto_1024x500.png"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-white/95 text-slate-900 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Ver en Grande
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => downloadImage('TuNutriLens_Elemento_Grafico_Foto_1024x500.png')}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar PNG
                  </button>
                  <button
                    onClick={() => downloadImage('TuNutriLens_Elemento_Grafico_Foto_1024x500.jpg')}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar JPG
                  </button>
                </div>
              </div>

              {/* Opción B: Gráfico Comercial con UI & Badges */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/60 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
                      Opción B: Escáner & Propuesta de Valor
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">1024 × 500 px</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Banner con Mockup de App y Badges</h4>
                  <p className="text-xs text-slate-500">
                    Incluye titular comercial, sello 100% Comida Real y pantalla de análisis nutricional.
                  </p>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 group relative">
                  <img
                    src="/screenshots/TuNutriLens_Elemento_Grafico_Destacado_1024x500.png"
                    alt="Elemento Gráfico con Interfaz TuNutriLens 1024x500"
                    className="w-full aspect-[1024/500] object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a
                      href="/screenshots/TuNutriLens_Elemento_Grafico_Destacado_1024x500.png"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-white/95 text-slate-900 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Ver en Grande
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => downloadImage('TuNutriLens_Elemento_Grafico_Destacado_1024x500.png')}
                    className="flex-1 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar PNG
                  </button>
                  <button
                    onClick={() => downloadImage('TuNutriLens_Elemento_Grafico_Destacado_1024x500.jpg')}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar JPG
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: THE 8 OFFICIAL SCREENSHOTS (1080 x 1920 px, 9:16) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                    8 de 8 Capturas Oficiales
                  </span>
                  <span className="text-xs font-mono text-slate-500">1080 × 1920 px • Relación 9:16 • Sin Bordes</span>
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mt-1">
                  Capturas de Pantalla de Teléfono para la Ficha
                </h3>
              </div>
              <button
                onClick={downloadFullZip}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs"
              >
                <Download className="w-3.5 h-3.5" /> Descargar las 8 en ZIP
              </button>
            </div>

            {/* Grid of 8 screenshots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {officialScreenshots.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 p-3.5 flex flex-col justify-between space-y-3 hover:border-emerald-500/60 transition-all shadow-xs hover:shadow-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
                        #{item.num} • {item.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">1080×1920</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-1" title={item.title}>
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-tight line-clamp-2" title={item.desc}>
                      {item.desc}
                    </p>
                  </div>

                  {/* Screenshot Image Preview */}
                  <a
                    href={`/screenshots/${item.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl overflow-hidden border border-slate-200 hover:border-emerald-500 transition-colors group relative bg-slate-900"
                  >
                    <img
                      src={`/screenshots/${item.filename}`}
                      alt={item.title}
                      className="w-full aspect-[9/16] object-cover group-hover:scale-102 transition-transform duration-200"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-bold text-[11px] rounded-lg shadow-md flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> Ampliar
                      </span>
                    </div>
                  </a>

                  {/* Download single button */}
                  <button
                    onClick={() => downloadImage(item.filename)}
                    className="w-full py-1.5 bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3 h-3" /> Descargar PNG
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: LOGO ASSETS */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/icono_tunutrilens_512x512.png"
                alt="Logo TuNutriLens 512x512"
                className="w-12 h-12 rounded-xl object-contain border border-slate-200 shadow-xs"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Icono de la Aplicación (512 × 512 px)</h4>
                <p className="text-xs text-slate-500">Requisito de Google Play para el icono oficial de lanzamiento</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/icono_tunutrilens_512x512.png"
                download="icono_tunutrilens_512x512.png"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Descargar Icono PNG
              </a>
              <a
                href="/logo.svg"
                download="logo_tunutrilens.svg"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Descargar SVG
              </a>
            </div>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>TuNutriLens • Ficha de Play Store lista para publicación</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
