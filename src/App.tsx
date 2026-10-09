import React, { useState, useEffect } from 'react';
import { NavTab, UserProfile, MealAnalysis, WeightEntry, DayPlan } from './types';
import { RecommendedDish } from './data/dishesCatalog';
import { SupermarketProductAnalysis } from './components/SupermarketProductAnalysisCard';
import { sampleDishes } from './data/sampleDishes';
import { Navbar } from './components/Navbar';
import { ScannerScreen } from './screens/ScannerScreen';
import { DiaryScreen } from './screens/DiaryScreen';
import { RecommendationsScreen } from './screens/RecommendationsScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { LifeStagesScreen } from './screens/LifeStagesScreen';
import { WeeklyMenuPlanScreen } from './screens/WeeklyMenuPlanScreen';
import { SeasonalCalendarScreen } from './screens/SeasonalCalendarScreen';
import { NutritionHubScreen } from './screens/NutritionHubScreen';
import { ExploreHubScreen } from './screens/ExploreHubScreen';
import { PricingScreen } from './screens/PricingScreen';
import { LegalFooter } from './components/LegalFooter';
import { AppFunctionsIndexModal } from './components/AppFunctionsIndexModal';
import { SavingsImpactCalculatorModal } from './components/SavingsImpactCalculatorModal';
import { TesterFeedbackModal } from './components/TesterFeedbackModal';
import { TextSizeModal } from './components/TextSizeModal';
import { PremiumFeatureGateModal } from './components/PremiumFeatureGateModal';
import { isUserSubscribed } from './services/usageLimitService';
import { Sparkles, RefreshCw, X, MessageSquarePlus } from 'lucide-react';
import { TextSizePreference } from './types';
import {
  loadProfile,
  saveProfile,
  loadLoggedMeals,
  saveLoggedMeals,
  loadWeightEntries,
  saveWeightEntries,
  loadSavedScans,
  saveSavedScans,
  loadWeeklyPlan,
  saveWeeklyPlan,
  loadSavedCustomRecipes,
  saveSavedCustomRecipes,
  loadTextSizePreference,
  saveTextSizePreference,
  applyTextSizeToDocument,
} from './services/storage';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('scanner');
  const [userProfile, setUserProfile] = useState<UserProfile>(loadProfile());
  const [loggedMeals, setLoggedMeals] = useState<MealAnalysis[]>(loadLoggedMeals());
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(loadWeightEntries());
  const [savedScans, setSavedScans] = useState<SupermarketProductAnalysis[]>(loadSavedScans());
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>(loadWeeklyPlan());
  const [savedCustomRecipes, setSavedCustomRecipes] = useState<RecommendedDish[]>(loadSavedCustomRecipes());
  const [isIndexModalOpen, setIsIndexModalOpen] = useState(false);
  const [isSavingsCalculatorOpen, setIsSavingsCalculatorOpen] = useState(false);
  const [showUpdateNotice, setShowUpdateNotice] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [textSizePreference, setTextSizePreference] = useState<TextSizePreference>(loadTextSizePreference());
  const [isTextSizeModalOpen, setIsTextSizeModalOpen] = useState(false);
  const [gateModalInfo, setGateModalInfo] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
  });

  const handleTabSelect = (tab: NavTab) => {
    setCurrentTab(tab);
  };

  useEffect(() => {
    // Check app version to notify testers of new builds
    const CURRENT_VERSION = '2.7.0';
    const savedVer = localStorage.getItem('tunutilens_version');
    if (savedVer && savedVer !== CURRENT_VERSION) {
      setShowUpdateNotice(true);
    }
    localStorage.setItem('tunutilens_version', CURRENT_VERSION);
  }, []);

  useEffect(() => {
    applyTextSizeToDocument(textSizePreference);
  }, [textSizePreference]);

  const handleForceUpdate = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }
      } catch (e) {
        console.error(e);
      }
    }
    if ('caches' in window) {
      try {
        const names = await caches.keys();
        await Promise.all(names.map((name) => caches.delete(name)));
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.removeItem('tunutilens_version');
    // Force bypass cache with timestamp query
    window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
  };

  // Save to storage whenever state changes
  useEffect(() => {
    saveProfile(userProfile);
  }, [userProfile]);

  useEffect(() => {
    saveLoggedMeals(loggedMeals);
  }, [loggedMeals]);

  useEffect(() => {
    saveWeightEntries(weightEntries);
  }, [weightEntries]);

  useEffect(() => {
    saveSavedScans(savedScans);
  }, [savedScans]);

  useEffect(() => {
    saveWeeklyPlan(weeklyPlan);
  }, [weeklyPlan]);

  useEffect(() => {
    saveSavedCustomRecipes(savedCustomRecipes);
  }, [savedCustomRecipes]);

  const handleToggleSaveScan = (product: SupermarketProductAnalysis) => {
    setSavedScans((prev) => {
      const exists = prev.some((item) => item.id === product.id || item.productName === product.productName);
      if (exists) {
        return prev.filter((item) => item.id !== product.id && item.productName !== product.productName);
      } else {
        return [product, ...prev];
      }
    });
  };

  const handleRemoveSavedScan = (id: string) => {
    setSavedScans((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveMeal = (meal: MealAnalysis) => {
    setLoggedMeals((prev) => [meal, ...prev]);
  };

  const handleDeleteMeal = (id: string) => {
    setLoggedMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const handleUpdateMeal = (updatedMeal: MealAnalysis) => {
    setLoggedMeals((prev) => prev.map((m) => (m.id === updatedMeal.id ? updatedMeal : m)));
  };

  const handleSaveCustomRecipe = (dish: RecommendedDish) => {
    setSavedCustomRecipes((prev) => {
      if (prev.some((d) => d.id === dish.id || d.dishName === dish.dishName)) {
        return prev;
      }
      return [dish, ...prev];
    });
  };

  const handleDeleteCustomRecipe = (id: string) => {
    setSavedCustomRecipes((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAddToWeeklyPlan = (
    dayIndex: number,
    mealType: 'desayuno' | 'almuerzo' | 'cena' | 'snack',
    dish: RecommendedDish
  ) => {
    setWeeklyPlan((prev) => {
      const copy = [...prev];
      if (copy[dayIndex]) {
        copy[dayIndex] = {
          ...copy[dayIndex],
          [mealType]: dish,
        };
      }
      return copy;
    });
  };

  const handleAddWeightEntry = (weightKg: number, dateStr: string) => {
    const entry: WeightEntry = {
      id: 'w_' + Date.now(),
      weightKg,
      dateString: dateStr,
      timestamp: Date.now(),
    };
    setWeightEntries((prev) => [entry, ...prev]);
    setUserProfile((prev) => ({ ...prev, currentWeightKg: weightKg }));
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-slate-50 to-teal-50/30 flex flex-col text-slate-900 font-sans selection:bg-emerald-200">
      <Navbar
        currentTab={currentTab}
        onTabChange={handleTabSelect}
        onOpenIndexModal={() => setIsIndexModalOpen(true)}
        onOpenTextSizeModal={() => setIsTextSizeModalOpen(true)}
        textSizePreference={textSizePreference}
      />

      <main className="flex-1 pb-24 md:pb-10">
        {(currentTab === 'scanner' || currentTab === 'zerowaste') && (
          <ScannerScreen
            userProfile={userProfile}
            sampleDishes={sampleDishes}
            savedScans={savedScans}
            onSaveMeal={handleSaveMeal}
            onToggleSaveScan={handleToggleSaveScan}
            onRemoveSavedScan={handleRemoveSavedScan}
            onNavigateToPlans={() => setCurrentTab('plans')}
            onNavigateToPricing={() => setCurrentTab('pricing')}
            onNavigateToZeroWaste={() => setCurrentTab('zerowaste')}
            currentWeeklyPlan={weeklyPlan}
            onAddToWeeklyPlan={handleAddToWeeklyPlan}
            onNavigateToWeeklyPlan={() => setCurrentTab('weeklyPlan')}
            onSaveCustomRecipe={handleSaveCustomRecipe}
            initialScanMode={currentTab === 'zerowaste' ? 'fridge' : 'dish'}
          />
        )}

        {currentTab === 'nutrition' && (
          <NutritionHubScreen
            userProfile={userProfile}
            loggedMeals={loggedMeals}
            onDeleteMeal={handleDeleteMeal}
            onUpdateMeal={handleUpdateMeal}
            onNavigateToScan={() => setCurrentTab('scanner')}
            onUpdateProfile={handleUpdateProfile}
            weightEntries={weightEntries}
            onAddWeightEntry={handleAddWeightEntry}
            onAddMealToDiary={handleSaveMeal}
            weeklyPlan={weeklyPlan}
            onAddToWeeklyPlan={handleAddToWeeklyPlan}
            savedCustomRecipes={savedCustomRecipes}
            savedScans={savedScans}
            onNavigateToPricing={() => setCurrentTab('pricing')}
          />
        )}

        {currentTab === 'explore' && (
          <ExploreHubScreen
            userProfile={userProfile}
            onAddMealToDiary={handleSaveMeal}
            onNavigateToProfile={() => setCurrentTab('profile')}
            onUpdateProfile={handleUpdateProfile}
            currentWeeklyPlan={weeklyPlan}
            onAddToWeeklyPlan={handleAddToWeeklyPlan}
            onNavigateToWeeklyPlan={() => setCurrentTab('weeklyPlan')}
            savedCustomRecipes={savedCustomRecipes}
            onDeleteCustomRecipe={handleDeleteCustomRecipe}
          />
        )}

        {currentTab === 'plans' && (
          <RecommendationsScreen
            userProfile={userProfile}
            onAddMealToDiary={handleSaveMeal}
            onNavigateToProfile={() => setCurrentTab('profile')}
            onUpdateProfile={handleUpdateProfile}
            currentWeeklyPlan={weeklyPlan}
            onAddToWeeklyPlan={handleAddToWeeklyPlan}
            onNavigateToWeeklyPlan={() => setCurrentTab('weeklyPlan')}
            savedCustomRecipes={savedCustomRecipes}
            onDeleteCustomRecipe={handleDeleteCustomRecipe}
          />
        )}

        {currentTab === 'weeklyPlan' && (
          <WeeklyMenuPlanScreen
            userProfile={userProfile}
            onAddMealToDiary={handleSaveMeal}
            onUpdateProfile={handleUpdateProfile}
            weeklyPlan={weeklyPlan}
            onAddToWeeklyPlan={handleAddToWeeklyPlan}
            loggedMeals={loggedMeals}
            savedCustomRecipes={savedCustomRecipes}
            savedScans={savedScans}
            onNavigateToScan={() => setCurrentTab('scanner')}
          />
        )}

        {currentTab === 'lifeStages' && (
          <LifeStagesScreen
            userProfile={userProfile}
            onAddMealToDiary={handleSaveMeal}
            onUpdateProfile={handleUpdateProfile}
            currentWeeklyPlan={weeklyPlan}
            onAddToWeeklyPlan={handleAddToWeeklyPlan}
            onNavigateToWeeklyPlan={() => setCurrentTab('weeklyPlan')}
          />
        )}

        {currentTab === 'seasonal' && (
          <SeasonalCalendarScreen
            onNavigateToRecipes={() => setCurrentTab('plans')}
            onNavigateToWeeklyPlan={() => setCurrentTab('weeklyPlan')}
          />
        )}

        {currentTab === 'diary' && (
          <DiaryScreen
            userProfile={userProfile}
            loggedMeals={loggedMeals}
            onDeleteMeal={handleDeleteMeal}
            onUpdateMeal={handleUpdateMeal}
            onNavigateToScan={() => setCurrentTab('scanner')}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressScreen
            userProfile={userProfile}
            weightEntries={weightEntries}
            onAddWeightEntry={handleAddWeightEntry}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onNavigateToPricing={() => setCurrentTab('pricing')}
          />
        )}

        {currentTab === 'pricing' && (
          <PricingScreen />
        )}

        <LegalFooter />
      </main>

      {/* Modal interactivo con el Índice y Guía de todas las funciones */}
      <AppFunctionsIndexModal
        isOpen={isIndexModalOpen}
        onClose={() => setIsIndexModalOpen(false)}
        onNavigateToTab={(tab: NavTab) => {
          setIsIndexModalOpen(false);
          handleTabSelect(tab);
        }}
      />

      {/* Banner de actualización instantánea para Testers */}
      {showUpdateNotice && (
        <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md bg-emerald-950 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/50 z-50 flex items-center justify-between gap-3 animate-bounce-short">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-emerald-200">¡Nueva Versión de TuNutriLens (v2.7.0)!</p>
              <p className="text-[11px] text-slate-300">Pantalla inicial limpia, 4 claves de escaneo y mejoras en Mi Nutrición.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleForceUpdate}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Recargar
            </button>
            <button
              onClick={() => setShowUpdateNotice(false)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Calculadora de Ahorro y Cero Desperdicio */}
      <SavingsImpactCalculatorModal
        isOpen={isSavingsCalculatorOpen}
        onClose={() => setIsSavingsCalculatorOpen(false)}
        onNavigateToFridge={() => {
          setIsSavingsCalculatorOpen(false);
          handleTabSelect('zerowaste');
        }}
      />

      {/* Botón flotante Cuéntame tu opinión */}
      <button
        onClick={() => setIsFeedbackModalOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-4 z-40 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 px-3.5 py-2.5 rounded-2xl shadow-xl border border-amber-300 font-black text-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer hover:shadow-amber-500/20"
        title="Cuéntame tu opinión o sugerencia"
      >
        <MessageSquarePlus className="w-4 h-4 text-slate-950" />
        <span className="hidden sm:inline">Cuéntame tu opinión</span>
        <span className="sm:hidden">Tu opinión</span>
      </button>

      {/* Modal de Feedback para Testers */}
      <TesterFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        activeTabName={currentTab}
      />

      {/* Modal Accesibilidad: Ajuste de Tamaño de Texto */}
      <TextSizeModal
        isOpen={isTextSizeModalOpen}
        onClose={() => setIsTextSizeModalOpen(false)}
        currentSize={textSizePreference}
        onSizeChange={(newSize) => setTextSizePreference(newSize)}
      />

      {/* Modal Bloqueo de Función Premium para Usuarios Gratuitos */}
      <PremiumFeatureGateModal
        isOpen={gateModalInfo.isOpen}
        onClose={() => setGateModalInfo((prev) => ({ ...prev, isOpen: false }))}
        onNavigateToPricing={() => {
          setGateModalInfo((prev) => ({ ...prev, isOpen: false }));
          setCurrentTab('pricing');
        }}
        featureTitle={gateModalInfo.title}
        featureDescription={gateModalInfo.description}
      />
    </div>
  );
};

export default App;
