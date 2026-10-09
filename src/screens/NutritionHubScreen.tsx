import React, { useState } from 'react';
import { UserProfile, MealAnalysis, DayPlan, RecommendedDish, WeightEntry, SupermarketProductAnalysis } from '../types';
import { DiaryScreen } from './DiaryScreen';
import { WeeklyMenuPlanScreen } from './WeeklyMenuPlanScreen';
import { ProgressScreen } from './ProgressScreen';
import { BookOpen, CalendarDays, TrendingUp, Sparkles } from 'lucide-react';

interface Props {
  userProfile: UserProfile;
  loggedMeals: MealAnalysis[];
  onDeleteMeal: (id: string) => void;
  onUpdateMeal?: (updatedMeal: MealAnalysis) => void;
  onNavigateToScan: () => void;
  onUpdateProfile?: (profile: UserProfile) => void;
  weightEntries: WeightEntry[];
  onAddWeightEntry: (weightKg: number, dateStr: string) => void;
  initialSubTab?: 'diary' | 'weeklyPlan' | 'progress';
  onAddMealToDiary?: (meal: MealAnalysis) => void;
  weeklyPlan?: DayPlan[];
  onAddToWeeklyPlan?: (
    dayIndex: number,
    mealType: 'desayuno' | 'almuerzo' | 'cena' | 'snack',
    dish: RecommendedDish
  ) => void;
  savedCustomRecipes?: RecommendedDish[];
  savedScans?: SupermarketProductAnalysis[];
  onNavigateToPricing?: () => void;
}

export const NutritionHubScreen: React.FC<Props> = ({
  userProfile,
  loggedMeals,
  onDeleteMeal,
  onUpdateMeal,
  onNavigateToScan,
  onUpdateProfile,
  weightEntries,
  onAddWeightEntry,
  initialSubTab = 'diary',
  onAddMealToDiary,
  weeklyPlan,
  onAddToWeeklyPlan,
  savedCustomRecipes,
  savedScans,
  onNavigateToPricing,
}) => {
  const [subTab, setSubTab] = useState<'diary' | 'weeklyPlan' | 'progress'>(initialSubTab);

  return (
    <div className="space-y-4">
      {/* Top Segmented Sub-Navbar for Nutrition Hub */}
      <div className="max-w-4xl mx-auto px-4 pt-3">
        <div className="bg-slate-100/90 backdrop-blur-xs p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSubTab('diary')}
            className={`flex-1 py-2.5 px-2 sm:px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
              subTab === 'diary'
                ? 'bg-emerald-600 text-white shadow-sm scale-[1.01]'
                : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Diario</span>
            <span className="hidden sm:inline">& Calorías</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('weeklyPlan')}
            className={`flex-1 py-2.5 px-2 sm:px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
              subTab === 'weeklyPlan'
                ? 'bg-emerald-600 text-white shadow-sm scale-[1.01]'
                : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            <CalendarDays className="w-4 h-4 shrink-0" />
            <span className="truncate">Plan Semanal</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('progress')}
            className={`flex-1 py-2.5 px-2 sm:px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
              subTab === 'progress'
                ? 'bg-emerald-600 text-white shadow-sm scale-[1.01]'
                : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span>Progreso</span>
            <span className="hidden sm:inline">& Peso</span>
          </button>
        </div>
      </div>

      {/* Sub-view Content */}
      {subTab === 'diary' && (
        <DiaryScreen
          userProfile={userProfile}
          loggedMeals={loggedMeals}
          onDeleteMeal={onDeleteMeal}
          onUpdateMeal={onUpdateMeal}
          onNavigateToScan={onNavigateToScan}
        />
      )}

      {subTab === 'weeklyPlan' && (
        <WeeklyMenuPlanScreen
          userProfile={userProfile}
          onAddMealToDiary={(meal) => {
            if (onAddMealToDiary) {
              onAddMealToDiary(meal);
            }
          }}
          onUpdateProfile={onUpdateProfile}
          weeklyPlan={weeklyPlan}
          onAddToWeeklyPlan={onAddToWeeklyPlan}
          loggedMeals={loggedMeals}
          savedCustomRecipes={savedCustomRecipes}
          savedScans={savedScans}
          onNavigateToScan={onNavigateToScan}
        />
      )}

      {subTab === 'progress' && (
        <ProgressScreen
          userProfile={userProfile}
          weightEntries={weightEntries}
          onAddWeightEntry={onAddWeightEntry}
        />
      )}
    </div>
  );
};
