import React, { useState } from 'react';
import { MealAnalysis, DayPlan, mealAnalysisToRecommendedDish, SupermarketProductAnalysis, supermarketProductToRecommendedDish } from '../types';
import { RecommendedDish } from '../data/dishesCatalog';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  X,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  meal: MealAnalysis | RecommendedDish | SupermarketProductAnalysis;
  currentWeeklyPlan: DayPlan[];
  onConfirmAddToPlan: (
    dayIndex: number,
    mealType: 'desayuno' | 'almuerzo' | 'cena' | 'snack',
    dish: RecommendedDish
  ) => void;
  onNavigateToWeeklyPlan?: () => void;
}

export const AddToWeeklyPlanModal: React.FC<Props> = ({
  isOpen,
  onClose,
  meal,
  currentWeeklyPlan,
  onConfirmAddToPlan,
  onNavigateToWeeklyPlan,
}) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
  const [selectedMealType, setSelectedMealType] = useState<'desayuno' | 'almuerzo' | 'cena' | 'snack'>('almuerzo');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const daysList: Array<{ name: DayPlan['dayName']; short: string; idx: number }> = [
    { name: 'Lunes', short: 'Lun', idx: 0 },
    { name: 'Martes', short: 'Mar', idx: 1 },
    { name: 'Miércoles', short: 'Mié', idx: 2 },
    { name: 'Jueves', short: 'Jue', idx: 3 },
    { name: 'Viernes', short: 'Vie', idx: 4 },
    { name: 'Sábado', short: 'Sáb', idx: 5 },
    { name: 'Domingo', short: 'Dom', idx: 6 },
  ];

  const mealSlots: Array<{
    id: 'desayuno' | 'almuerzo' | 'cena' | 'snack';
    label: string;
    description: string;
  }> = [
    { id: 'desayuno', label: 'Desayuno', description: 'Comida de la mañana' },
    { id: 'almuerzo', label: 'Almuerzo (Comida)', description: 'Plato principal del mediodía' },
    { id: 'cena', label: 'Cena', description: 'Plato de la noche' },
    { id: 'snack', label: 'Snack / Merienda', description: 'Tentempié saludable' },
  ];

  // Convert meal to RecommendedDish
  let dishToAdd: RecommendedDish;
  if ('foodItems' in meal) {
    dishToAdd = mealAnalysisToRecommendedDish(meal as MealAnalysis);
  } else if ('trafficLightScore' in meal || 'novaGroup' in meal || 'ingredientsList' in meal) {
    dishToAdd = supermarketProductToRecommendedDish(meal as SupermarketProductAnalysis);
  } else {
    dishToAdd = meal as RecommendedDish;
  }

  // Current dish at selected slot
  const currentDayPlan = currentWeeklyPlan[selectedDayIdx];
  const currentlyScheduledDish: RecommendedDish = currentDayPlan ? currentDayPlan[selectedMealType] : dishToAdd;

  const handleConfirm = () => {
    onConfirmAddToPlan(selectedDayIdx, selectedMealType, dishToAdd);
    setIsSuccess(true);
  };

  const handleCloseModal = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-emerald-100 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
              <CalendarDays className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Añadir al Plan Nutricional Semanal
              </h3>
              <p className="text-xs text-slate-500">
                Integra tu plato preparado en tu menú oficial de 7 días
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-900">
                ¡Plato Añadido con Éxito a tu Plan!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                <strong>"{dishToAdd.dishName}"</strong> ha sido programado para el{' '}
                <span className="text-emerald-700 font-bold">
                  {daysList[selectedDayIdx].name} ({mealSlots.find(s => s.id === selectedMealType)?.label})
                </span>.
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={handleCloseModal}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-xl transition cursor-pointer"
              >
                Seguir en Escáner
              </button>
              {onNavigateToWeeklyPlan && (
                <button
                  onClick={() => {
                    handleCloseModal();
                    onNavigateToWeeklyPlan();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Ver Plan Semanal</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Form Screen */
          <div className="space-y-4">
            {/* Plato Seleccionado Resumen */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">
                  Plato que vas a programar
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 truncate">
                  {dishToAdd.dishName}
                </h4>
                <div className="text-[11px] text-slate-600 flex items-center gap-2 mt-0.5 font-medium">
                  <span className="text-amber-700 font-bold">{dishToAdd.calories} kcal</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">P: {dishToAdd.proteinGrams}g</span>
                  <span>•</span>
                  <span className="text-sky-700 font-bold">C: {dishToAdd.carbsGrams}g</span>
                  <span>•</span>
                  <span className="text-rose-700 font-bold">G: {dishToAdd.fatGrams}g</span>
                </div>
              </div>
              <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            {/* Selector de Día de la Semana */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>1. Elige el Día de la Semana:</span>
              </label>
              <div className="grid grid-cols-7 gap-1">
                {daysList.map((d) => {
                  const isSelected = selectedDayIdx === d.idx;
                  return (
                    <button
                      key={d.idx}
                      type="button"
                      onClick={() => setSelectedDayIdx(d.idx)}
                      className={`py-2 rounded-xl text-center transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-105 font-black'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 font-bold'
                      }`}
                    >
                      <span className="text-[10px] block uppercase">{d.short}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500 text-center font-medium pt-0.5">
                Día seleccionado: <strong className="text-slate-900">{daysList[selectedDayIdx].name}</strong>
              </p>
            </div>

            {/* Selector de Momento del Día (Slot) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-700" />
                <span>2. Elige el Momento de la Comida:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {mealSlots.map((slot) => {
                  const isSelected = selectedMealType === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedMealType(slot.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50/60'
                      }`}
                    >
                      <div className="text-xs font-black">{slot.label}</div>
                      <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                        {slot.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comparación / Sustitución de Plato */}
            {currentlyScheduledDish && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Plato actual en ese espacio ({daysList[selectedDayIdx].name} - {mealSlots.find(s => s.id === selectedMealType)?.label}):
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-800 line-through text-[11px] truncate">
                    {currentlyScheduledDish.dishName}
                  </span>
                  <span className="text-slate-500 text-[10px] shrink-0 font-medium">
                    {currentlyScheduledDish.calories} kcal
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-extrabold pt-0.5 border-t border-slate-200/60">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Se sustituirá por tu plato ({dishToAdd.calories} kcal)</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-5 py-2.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar y Añadir al Plan</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
