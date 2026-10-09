import { UserProfile, MealAnalysis, WeightEntry, DayPlan, TextSizePreference } from '../types';
import { sampleDishes } from '../data/sampleDishes';
import { SupermarketProductAnalysis } from '../components/SupermarketProductAnalysisCard';
import { SAMPLE_SUPERMARKET_PRODUCTS } from '../data/sampleSupermarketProducts';
import { DESAYUNOS_CATALOG, COMIDAS_CATALOG, CENAS_CATALOG, SNACKS_CATALOG, RecommendedDish } from '../data/dishesCatalog';

const STORAGE_KEYS = {
  PROFILE: 'nutri_profile',
  MEALS: 'nutri_logged_meals',
  WEIGHT: 'nutri_weight_entries',
  SAVED_SCANS: 'nutri_saved_scans',
  SAVED_RECIPES: 'nutri_saved_custom_recipes',
  WEEKLY_PLAN: 'nutri_weekly_plan_v2',
  ONBOARDING_COMPLETED: 'nutri_onboarding_completed_v1',
  TEXT_SIZE: 'tunutrilens_text_size_preference',
};

export const defaultProfile: UserProfile = {
  age: 30,
  heightCm: 170,
  currentWeightKg: 75,
  targetWeightKg: 68,
  gender: 'Mujer',
  activityLevel: 'Moderado',
  goal: 'Pérdida de peso',
  dailyCalorieTarget: 1800,
  dailyProteinTargetG: 120,
  dailyCarbsTargetG: 180,
  dailyFatTargetG: 55,
  dietaryRestrictions: ['Sin gluten (opcional)', 'Sin azúcares añadidos'],
};

// Safe localStorage helpers for iOS Safari private browsing / in-app WebViews
const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage quota or security errors gracefully
  }
};

export const loadProfile = (): UserProfile => {
  const saved = safeGetItem(STORAGE_KEYS.PROFILE);
  if (!saved) return defaultProfile;
  try {
    return JSON.parse(saved);
  } catch {
    return defaultProfile;
  }
};

export const saveProfile = (profile: UserProfile): void => {
  safeSetItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
};

export const applyTextSizeToDocument = (size: TextSizePreference): void => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xlarge');
  root.classList.add(`text-size-${size}`);
};

export const loadTextSizePreference = (): TextSizePreference => {
  const saved = safeGetItem(STORAGE_KEYS.TEXT_SIZE);
  if (saved === 'large' || saved === 'xlarge' || saved === 'normal') {
    return saved;
  }
  return 'normal';
};

export const saveTextSizePreference = (size: TextSizePreference): void => {
  safeSetItem(STORAGE_KEYS.TEXT_SIZE, size);
  applyTextSizeToDocument(size);
};

export const loadLoggedMeals = (): MealAnalysis[] => {
  const saved = safeGetItem(STORAGE_KEYS.MEALS);
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((m: MealAnalysis) => !m.id?.startsWith('sample_'));
  } catch {
    return [];
  }
};

export const saveLoggedMeals = (meals: MealAnalysis[]): void => {
  safeSetItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
};

export const loadWeightEntries = (): WeightEntry[] => {
  const saved = safeGetItem(STORAGE_KEYS.WEIGHT);
  if (!saved) {
    return [
      { id: 'w1', weightKg: 75.0, dateString: 'Hoy', timestamp: Date.now() },
      { id: 'w2', weightKg: 75.8, dateString: 'Hace 3 días', timestamp: Date.now() - 86400000 * 3 },
      { id: 'w3', weightKg: 76.5, dateString: 'Hace 1 semana', timestamp: Date.now() - 86400000 * 7 },
      { id: 'w4', weightKg: 77.2, dateString: 'Hace 2 semanas', timestamp: Date.now() - 86400000 * 14 },
    ];
  }
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
};

export const saveWeightEntries = (entries: WeightEntry[]): void => {
  safeSetItem(STORAGE_KEYS.WEIGHT, JSON.stringify(entries));
};

export const loadSavedScans = (): SupermarketProductAnalysis[] => {
  const saved = safeGetItem(STORAGE_KEYS.SAVED_SCANS);
  if (!saved) return [SAMPLE_SUPERMARKET_PRODUCTS[0], SAMPLE_SUPERMARKET_PRODUCTS[1]];
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [SAMPLE_SUPERMARKET_PRODUCTS[0], SAMPLE_SUPERMARKET_PRODUCTS[1]];
  } catch {
    return [SAMPLE_SUPERMARKET_PRODUCTS[0], SAMPLE_SUPERMARKET_PRODUCTS[1]];
  }
};

export const saveSavedScans = (scans: SupermarketProductAnalysis[]): void => {
  safeSetItem(STORAGE_KEYS.SAVED_SCANS, JSON.stringify(scans));
};

export const loadSavedCustomRecipes = (): RecommendedDish[] => {
  const saved = safeGetItem(STORAGE_KEYS.SAVED_RECIPES);
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveSavedCustomRecipes = (recipes: RecommendedDish[]): void => {
  safeSetItem(STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(recipes));
};

export const getDefaultWeeklyPlan = (): DayPlan[] => {
  const days: ('Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo')[] = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  return days.map((day, idx) => ({
    dayName: day,
    desayuno: DESAYUNOS_CATALOG[idx % DESAYUNOS_CATALOG.length],
    almuerzo: COMIDAS_CATALOG[idx % COMIDAS_CATALOG.length],
    cena: CENAS_CATALOG[idx % CENAS_CATALOG.length],
    snack: SNACKS_CATALOG[idx % SNACKS_CATALOG.length]
  }));
};

export const loadWeeklyPlan = (): DayPlan[] => {
  const saved = safeGetItem(STORAGE_KEYS.WEEKLY_PLAN);
  if (!saved) return getDefaultWeeklyPlan();
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length === 7) {
      return parsed;
    }
    return getDefaultWeeklyPlan();
  } catch {
    return getDefaultWeeklyPlan();
  }
};

export const saveWeeklyPlan = (plan: DayPlan[]): void => {
  safeSetItem(STORAGE_KEYS.WEEKLY_PLAN, JSON.stringify(plan));
};

export const loadHasCompletedOnboarding = (): boolean => {
  const val = safeGetItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
  return val === 'true';
};

export const saveHasCompletedOnboarding = (completed: boolean): void => {
  safeSetItem(STORAGE_KEYS.ONBOARDING_COMPLETED, completed ? 'true' : 'false');
};

export function calculateBMR(p: UserProfile): number {
  if (p.gender === 'Mujer') {
    return Math.round(10 * p.currentWeightKg + 6.25 * p.heightCm - 5 * p.age - 161);
  } else {
    return Math.round(10 * p.currentWeightKg + 6.25 * p.heightCm - 5 * p.age + 5);
  }
}

export function calculateTDEE(p: UserProfile): number {
  const bmr = calculateBMR(p);
  const factorMap: Record<string, number> = {
    Sedentario: 1.2,
    Ligero: 1.375,
    Moderado: 1.55,
    Intenso: 1.725,
  };
  const factor = factorMap[p.activityLevel] || 1.375;
  return Math.round(bmr * factor);
}
