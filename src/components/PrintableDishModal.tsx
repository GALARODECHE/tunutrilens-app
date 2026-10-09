import React from 'react';
import { RecommendedDish } from '../data/dishesCatalog';
import { getDishLifeStageAdaptations } from '../utils/lifeStageUtils';
import { Printer, X, ShieldCheck, Flame, Dumbbell, Wheat, Droplets, Clock, Utensils, BookOpen, Award, CheckCircle2 } from 'lucide-react';

interface Props {
  dish: RecommendedDish | null;
  onClose: () => void;
}

export const PrintableDishModal: React.FC<Props> = ({ dish, onClose }) => {
  if (!dish) return null;

  const lifeStages = getDishLifeStageAdaptations(dish);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white border border-emerald-100 text-slate-800 rounded-3xl max-w-2xl w-full my-6 overflow-hidden shadow-2xl print:shadow-none print:border-none print:max-w-none print:rounded-none">
        
        {/* Modal Action Bar (Hidden when printing) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs">
              Ficha Nutricional Imprimible
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Formato de ficha nutricional personal para descargar o imprimir
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Exportar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE SHEET CONTENT AREA */}
        <div className="p-6 sm:p-8 space-y-6 print:p-6 print:text-slate-900">
          
          {/* Header Branding & Institution */}
          <div className="border-b-2 border-emerald-600 pb-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">TuNutriLens AI</h1>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded uppercase border border-emerald-300">
                  Ficha de Composición Nutricional
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Referenciado con la Base de Datos Española BEDCA (AESAN - Min. Sanidad) & USDA FoodData Central
              </p>
            </div>

            <div className="text-right text-[11px] text-slate-500 font-mono">
              <div>Fecha: {new Date().toLocaleDateString('es-ES')}</div>
              <div>Categoría: {dish.mealType}</div>
            </div>
          </div>

          {/* Dish Title & Main Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900">{dish.dishName}</h2>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{dish.prepTimeMinutes} minutos</span>
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
              "{dish.description}"
            </p>
          </div>

          {/* Life Stages Adaptation Banner (La Leyenda) */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Adaptación para Etapas de la Vida</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500">Valores Fisiológicos Optimizados</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {lifeStages.map((st) => (
                <div key={st.id} className={`px-2.5 py-1 rounded-lg border text-xs font-bold ${st.badgeBg} ${st.badgeText}`}>
                  ✓ {st.name}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-600 pt-1">
              Plato especialmente indicado para cubrir los requerimientos metabólicos de las etapas indicadas arriba.
            </p>
          </div>

          {/* Macronutrients Grid */}
          <div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
              Desglose de Macronutrientes por Ración (100% Real)
            </h3>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                <div className="text-[10px] font-bold text-amber-800 uppercase">Calorías Totales</div>
                <div className="text-lg font-black text-amber-950 flex items-center justify-center gap-1 mt-0.5">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>{dish.calories} kcal</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="text-[10px] font-bold text-emerald-800 uppercase">Proteínas</div>
                <div className="text-lg font-black text-emerald-950 flex items-center justify-center gap-1 mt-0.5">
                  <Dumbbell className="w-4 h-4 text-emerald-600" />
                  <span>{dish.proteinGrams} g</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
                <div className="text-[10px] font-bold text-blue-800 uppercase">Carbohidratos</div>
                <div className="text-lg font-black text-blue-950 flex items-center justify-center gap-1 mt-0.5">
                  <Wheat className="w-4 h-4 text-blue-600" />
                  <span>{dish.carbsGrams} g</span>
                </div>
              </div>

              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200">
                <div className="text-[10px] font-bold text-rose-800 uppercase">Grasas Saludables</div>
                <div className="text-lg font-black text-rose-950 flex items-center justify-center gap-1 mt-0.5">
                  <Droplets className="w-4 h-4 text-rose-600" />
                  <span>{dish.fatGrams} g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients Breakdown */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-emerald-600" />
              <span>Ingredientes y Composición</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {dish.ingredients.map((ing, i) => (
                <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{ing}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Scientific Footer */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-700">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Auditoría de Fuentes: BEDCA (Ministerio de Sanidad) / USDA FoodData Central</span>
              </span>
              <span>Licencia de Dominio Público Abierto</span>
            </div>
            <p>
              Documento emitido por el motor de análisis nutricional TuNutriLens. Apto para uso personal y familiar.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
