import React from 'react';
import { MealAnalysis, UserProfile, DayPlan } from '../types';
import { RecommendedDish } from '../data/dishesCatalog';
import { ZeroWasteFridgeView } from '../components/ZeroWasteFridgeView';
import { Leaf, Sparkles, Utensils, CalendarDays, BookOpen, ShieldCheck } from 'lucide-react';

interface Props {
  userProfile: UserProfile;
  onAddMealToDiary: (meal: MealAnalysis) => void;
  currentWeeklyPlan?: DayPlan[];
  onAddToWeeklyPlan?: (
    dayIndex: number,
    mealType: 'desayuno' | 'almuerzo' | 'cena' | 'snack',
    dish: RecommendedDish
  ) => void;
  onNavigateToWeeklyPlan?: () => void;
  onSaveCustomRecipe?: (recipe: RecommendedDish) => void;
  onNavigateToRecipes?: () => void;
}

export const ZeroWasteScreen: React.FC<Props> = ({
  userProfile,
  onAddMealToDiary,
  currentWeeklyPlan,
  onAddToWeeklyPlan,
  onNavigateToWeeklyPlan,
  onSaveCustomRecipe,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-xl text-xs font-black uppercase tracking-wider border border-teal-500/30">
            <Leaf className="w-3.5 h-3.5 text-teal-300" />
            <span>Nevera Inteligente & Despensa Zero Waste</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Aprovechamiento de Sobras & Despensa
          </h1>
          <p className="text-sm text-teal-100/90 leading-relaxed">
            Fotografía el interior de tu frigorífico o despensa. Nuestra IA detecta los ingredientes disponibles y diseña recetas mediterráneas saludables de aprovechamiento al instante para no tirar nada.
          </p>
        </div>
      </div>

      {/* Main Zero Waste Fridge Component */}
      <ZeroWasteFridgeView
        userProfile={userProfile}
        onAddMealToDiary={onAddMealToDiary}
        currentWeeklyPlan={currentWeeklyPlan}
        onAddToWeeklyPlan={onAddToWeeklyPlan}
        onNavigateToWeeklyPlan={onNavigateToWeeklyPlan}
        onSaveCustomRecipe={onSaveCustomRecipe}
      />
    </div>
  );
};
