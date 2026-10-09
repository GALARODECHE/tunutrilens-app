import React from 'react';
import {
  X,
  Sparkles,
  Camera,
  Sun,
  Maximize2,
  Edit3,
  CheckCircle2,
  Zap,
  Barcode
} from 'lucide-react';

interface ScannerTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartScanning?: () => void;
}

export const ScannerTipsModal: React.FC<ScannerTipsModalProps> = ({
  isOpen,
  onClose,
  onStartScanning
}) => {
  if (!isOpen) return null;

  const tips = [
    {
      step: '01',
      icon: Camera,
      iconBg: 'bg-emerald-100 text-emerald-700',
      title: 'Ángulo Cenital o 45º (Vista Completa)',
      desc: 'Toma la fotografía desde arriba (plano cenital) o a 45 grados. Esto permite a la IA percibir la profundidad, el volumen de la porción y todos los ingredientes sin que unos tapen a otros.',
      proTip: 'Ideal para ensaladas, platos combinados, pastas y bowls.'
    },
    {
      step: '02',
      icon: Sun,
      iconBg: 'bg-amber-100 text-amber-700',
      title: 'Buena Iluminación y Sin Sombras Duras',
      desc: 'Usa luz natural o ambiente clara. Evita proyectar la sombra de tu propio cuerpo o móvil sobre la comida, ya que las sombras ocultan aliños, salsas y texturas.',
      proTip: 'En restaurantes oscuros, inclina levemente el teléfono hacia la luz.'
    },
    {
      step: '03',
      icon: Maximize2,
      iconBg: 'bg-blue-100 text-blue-700',
      title: 'Plato Completo Dentro del Encuadre',
      desc: 'Encuadra la totalidad del plato sin cortar los bordes. Si hay guarnición al lado, pan o bebida que quieras computar, asegúrate de que entre en la foto.',
      proTip: 'El contraste entre el plato y la mesa ayuda a calibrar los gramos exactos.'
    },
    {
      step: '04',
      icon: Edit3,
      iconBg: 'bg-purple-100 text-purple-700',
      title: 'Indica los "Ingredientes Invisibles"',
      desc: 'La IA identifica lo que ve, pero no sabe si cocinaste con 1 o 3 cucharadas de aceite, o si la leche es entera o de avena. Añade una nota corta en el buscador.',
      proTip: 'Ejemplo: "con 1 cdita de AOVE y queso light". ¡Eleva el acierto al 99.2%!'
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/80 via-white to-teal-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  4 Claves para un Escaneo con 99% de Acierto
                </h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Sencillos hábitos para que la Inteligencia Artificial mida tus nutrientes al gramo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 gap-3.5">
            {tips.map((tip) => {
              const IconComp = tip.icon;
              return (
                <div
                  key={tip.step}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors space-y-2"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl ${tip.iconBg} shrink-0`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {tip.title}
                        </h4>
                        <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {tip.step}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {tip.desc}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-100/60 rounded-xl px-2.5 py-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span><strong className="font-bold">Consejo:</strong> {tip.proTip}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Supermarket OCR Bonus Note */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shrink-0">
              <Barcode className="w-4 h-4" />
            </div>
            <div className="text-xs text-amber-950">
              <span className="font-bold block">¿Escaneando en Supermercado?</span>
              <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
                Enfoca directamente la <strong>tabla nutricional</strong> o la <strong>lista de ingredientes</strong> del envase para una lectura instantánea sin reflejos.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Precisión calibrada con datos nutricionales reales</span>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onStartScanning) onStartScanning();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <span>¡Entendido, vamos a escanear!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
