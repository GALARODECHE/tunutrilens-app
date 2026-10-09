import React, { useState, useEffect } from 'react';
import { X, Type, Check, Sparkles, Eye, Utensils, Award } from 'lucide-react';
import { TextSizePreference } from '../types';
import { saveTextSizePreference, applyTextSizeToDocument } from '../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentSize: TextSizePreference;
  onSizeChange: (size: TextSizePreference) => void;
}

export const TextSizeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentSize,
  onSizeChange,
}) => {
  const [selectedSize, setSelectedSize] = useState<TextSizePreference>(currentSize);

  useEffect(() => {
    if (isOpen) {
      setSelectedSize(currentSize);
    }
  }, [isOpen, currentSize]);

  if (!isOpen) return null;

  const handleSelectSize = (size: TextSizePreference) => {
    setSelectedSize(size);
    // Real-time live preview
    applyTextSizeToDocument(size);
  };

  const handleSave = () => {
    saveTextSizePreference(selectedSize);
    onSizeChange(selectedSize);
    onClose();
  };

  const handleCancel = () => {
    // Revert to initial size if cancelled
    applyTextSizeToDocument(currentSize);
    onClose();
  };

  const sizeOptions: Array<{
    id: TextSizePreference;
    name: string;
    badge: string;
    sampleSymbol: string;
    sampleScaleClass: string;
    description: string;
    recommended?: boolean;
  }> = [
    {
      id: 'normal',
      name: 'Normal',
      badge: '100% Estándar',
      sampleSymbol: 'Aa',
      sampleScaleClass: 'text-base',
      description: 'Tamaño estándar original. Equilibrado para monitores y teléfonos grandes.',
    },
    {
      id: 'large',
      name: 'Grande',
      badge: '115% Recomendado',
      sampleSymbol: 'Aa+',
      sampleScaleClass: 'text-lg font-bold',
      description: 'Letra más legible para móviles. Ideal si notas la letra algo pequeña.',
      recommended: true,
    },
    {
      id: 'xlarge',
      name: 'Extra Grande',
      badge: '130% Accesibilidad',
      sampleSymbol: 'Aa++',
      sampleScaleClass: 'text-xl font-extrabold',
      description: 'Máxima comodidad de lectura. Excelente para no forzar la vista en ningún momento.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-5 shadow-2xl border border-slate-200 animate-fadeIn relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="text-size-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs border border-emerald-200 shrink-0">
              <Type className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  Accesibilidad Visual
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  <Eye className="w-3 h-3" />
                  <span>Lectura Fácil</span>
                </span>
              </div>
              <h2 id="text-size-title" className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                Tamaño de Letra
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCancel}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            aria-label="Cerrar modal de tamaño de letra"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Selecciona el tamaño que te resulte más cómodo para leer ingredientes, calorías, advertencias y menús. Los cambios se aplicarán a toda la aplicación.
        </p>

        {/* 3 Size Options */}
        <div className="grid grid-cols-1 gap-2.5">
          {sizeOptions.map((opt) => {
            const isSelected = selectedSize === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectSize(opt.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition shrink-0 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className={opt.sampleScaleClass}>{opt.sampleSymbol}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900">{opt.name}</span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          opt.recommended
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{opt.description}</p>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Preview Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Vista previa en directo</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
              Modo {selectedSize === 'normal' ? 'Normal' : selectedSize === 'large' ? 'Grande (+15%)' : 'Extra Grande (+30%)'}
            </span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-black text-slate-900">Salmón a la plancha con verduras</h4>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                460 kcal
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Excelente fuente de ácidos grasos Omega-3 y proteína de alto valor biológico. Acompañado de espárragos trigueros y AOVE.
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 pt-1 border-t border-slate-100">
              <span>Proteínas: 38g</span>
              <span>•</span>
              <span>Carbos: 8g</span>
              <span>•</span>
              <span>Grasas: 24g</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Guardar Preferencia</span>
          </button>
        </div>
      </div>
    </div>
  );
};
