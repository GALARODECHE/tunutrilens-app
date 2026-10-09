import React from 'react';
import { MealAnalysis } from '../types';
import { Leaf, ShieldCheck, Heart, Sparkles, Droplets } from 'lucide-react';

interface Props {
  meal: MealAnalysis;
}

export const HarvardPlateCard: React.FC<Props> = ({ meal }) => {
  // Estimate Harvard plate distribution from meal items or macros
  let vegPct = 40;
  let protPct = 30;
  let carbPct = 30;

  const dishLower = (meal.dishName + ' ' + (meal.description || '')).toLowerCase();
  const hasAove = dishLower.includes('aove') || dishLower.includes('oliva') || dishLower.includes('aceite');
  const hasVeg = dishLower.includes('ensalada') || dishLower.includes('verdura') || dishLower.includes('tomate') || dishLower.includes('espinac') || dishLower.includes('calabac');
  const hasFish = dishLower.includes('salmon') || dishLower.includes('pescado') || dishLower.includes('merluza') || dishLower.includes('atun');

  if (hasVeg) {
    vegPct = 50;
    protPct = 25;
    carbPct = 25;
  } else if (meal.proteinGrams > 35) {
    protPct = 45;
    vegPct = 25;
    carbPct = 30;
  }

  // Calculate polyphenol / antioxidant score
  let antioxidantScore = 7;
  if (hasAove) antioxidantScore += 1.5;
  if (hasVeg) antioxidantScore += 1.5;
  if (hasFish) antioxidantScore += 1.0;
  antioxidantScore = Math.min(10, Math.max(5, antioxidantScore));

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-4 sm:p-5 border border-emerald-500/40 shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/40">
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight">
                Método del Plato de Harvard & Dieta Mediterránea
              </h4>
              <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[9px] font-black rounded-md uppercase">
                Oro Nutricional
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Equilibrio celular: 50% vegetales, 25% proteínas nobles, 25% hidratos lentos + AOVE.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-base sm:text-lg font-black text-emerald-400">
            {antioxidantScore.toFixed(1)}/10
          </div>
          <span className="text-[9px] text-emerald-200/80 font-bold uppercase block">
            Polifenoles & AOVE
          </span>
        </div>
      </div>

      {/* Visual Tri-Segment Harvard Plate Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 px-1">
          <span className="text-emerald-400 flex items-center gap-1">
            🌱 50% Vegetales & Hortalizas
          </span>
          <span className="text-teal-300 flex items-center gap-1">
            🐟 25% Proteínas
          </span>
          <span className="text-sky-300 flex items-center gap-1">
            🌾 25% Cereales / Tubérculos
          </span>
        </div>

        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex border border-slate-700 shadow-inner">
          <div
            className="bg-emerald-500 h-full transition-all duration-500 flex items-center justify-center text-[9px] font-black text-slate-950"
            style={{ width: `${vegPct}%` }}
            title="50% Vegetales y frutas"
          >
            {vegPct}%
          </div>
          <div
            className="bg-teal-400 h-full transition-all duration-500 flex items-center justify-center text-[9px] font-black text-slate-950"
            style={{ width: `${protPct}%` }}
            title="25% Proteína saludable"
          >
            {protPct}%
          </div>
          <div
            className="bg-sky-400 h-full transition-all duration-500 flex items-center justify-center text-[9px] font-black text-slate-950"
            style={{ width: `${carbPct}%` }}
            title="25% Carbohidratos complejos"
          >
            {carbPct}%
          </div>
        </div>
      </div>

      {/* Badges of Mediterranean quality */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <div className="text-[10px] text-emerald-300 font-extrabold uppercase">Grasa Principal</div>
          <div className="text-xs font-black text-white flex items-center justify-center gap-1 mt-0.5">
            <Droplets className="w-3.5 h-3.5 text-amber-400" />
            <span>{hasAove ? 'AOVE Virgen Extra' : 'Aceite Culinario'}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <div className="text-[10px] text-teal-300 font-extrabold uppercase">Saturación Celular</div>
          <div className="text-xs font-black text-white flex items-center justify-center gap-1 mt-0.5">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Cardioprotector</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <div className="text-[10px] text-amber-300 font-extrabold uppercase">Microbiota & Fibra</div>
          <div className="text-xs font-black text-white flex items-center justify-center gap-1 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{meal.fiberGrams >= 5 ? 'Alta Fermentación' : 'Moderada'}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <div className="text-[10px] text-sky-300 font-extrabold uppercase">Índice Glucémico</div>
          <div className="text-xs font-black text-white flex items-center justify-center gap-1 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>{meal.sugarGrams <= 5 ? 'Estable / Sin Picos' : 'Moderado'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
