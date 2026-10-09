import React, { useState } from 'react';
import { UserProfile, MealAnalysis, DayPlan, RecommendedDish } from '../types';
import { RecommendationsScreen } from './RecommendationsScreen';
import { SeasonalCalendarScreen } from './SeasonalCalendarScreen';
import { UtensilsCrossed, Calendar, Award, ArrowRight, Download, Sparkles } from 'lucide-react';
import { MarketComparisonModal } from '../components/MarketComparisonModal';
import { downloadMarketComparisonMarkdown } from '../utils/marketComparisonExport';

interface Props {
  userProfile: UserProfile;
  onAddMealToDiary: (meal: MealAnalysis) => void;
  onNavigateToProfile: () => void;
  onUpdateProfile?: (profile: UserProfile) => void;
  currentWeeklyPlan: DayPlan[];
  onAddToWeeklyPlan: (dayIndex: number, mealType: 'desayuno' | 'almuerzo' | 'cena' | 'snack', dish: RecommendedDish) => void;
  onNavigateToWeeklyPlan: () => void;
  savedCustomRecipes?: RecommendedDish[];
  onDeleteCustomRecipe?: (id: string) => void;
  initialSubTab?: 'recipes' | 'seasonal';
}

export const ExploreHubScreen: React.FC<Props> = ({
  userProfile,
  onAddMealToDiary,
  onNavigateToProfile,
  onUpdateProfile,
  currentWeeklyPlan,
  onAddToWeeklyPlan,
  onNavigateToWeeklyPlan,
  savedCustomRecipes,
  onDeleteCustomRecipe,
  initialSubTab = 'recipes',
}) => {
  const [subTab, setSubTab] = useState<'recipes' | 'seasonal'>(initialSubTab);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Top Segmented Sub-Navbar for Discover View */}
      <div className="max-w-5xl mx-auto px-4 pt-3 space-y-3">
        {/* Dual Selector: Recetas y Platos vs Guía de Temporada Mediterránea */}
        <div className="bg-slate-100/90 backdrop-blur-xs p-1.5 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSubTab('recipes')}
            className={`py-3 px-2 sm:px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
              subTab === 'recipes'
                ? 'bg-emerald-600 text-white shadow-md scale-[1.01]'
                : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Recetas</span>
            <span className="hidden sm:inline">y Platos</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('seasonal')}
            className={`py-3 px-2 sm:px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
              subTab === 'seasonal'
                ? 'bg-emerald-600 text-white shadow-md scale-[1.01]'
                : 'text-slate-700 hover:bg-white/80'
            }`}
          >
            <Calendar className="w-4 h-4 text-teal-300 shrink-0" />
            <span>Temporada</span>
            <span className="hidden sm:inline">Mediterránea</span>
          </button>
        </div>
      </div>

      {/* Sub-view Content: Solo Recetas o Temporada */}
      {subTab === 'recipes' && (
        <RecommendationsScreen
          userProfile={userProfile}
          onAddMealToDiary={onAddMealToDiary}
          onNavigateToProfile={onNavigateToProfile}
          onUpdateProfile={onUpdateProfile}
          currentWeeklyPlan={currentWeeklyPlan}
          onAddToWeeklyPlan={onAddToWeeklyPlan}
          onNavigateToWeeklyPlan={onNavigateToWeeklyPlan}
          savedCustomRecipes={savedCustomRecipes}
          onDeleteCustomRecipe={onDeleteCustomRecipe}
        />
      )}

      {subTab === 'seasonal' && (
        <SeasonalCalendarScreen
          onNavigateToRecipes={() => setSubTab('recipes')}
          onNavigateToWeeklyPlan={onNavigateToWeeklyPlan}
        />
      )}

      {/* Market Differentiation & Comparison Modal */}
      <MarketComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
      />
    </div>
  );
};
