export type TextSizePreference = 'normal' | 'large' | 'xlarge';

export interface UserProfile {
  name?: string;
  age: number;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  gender: 'Mujer' | 'Hombre';
  activityLevel: 'Sedentario' | 'Ligero' | 'Moderado' | 'Intenso';
  goal: 'Pérdida de peso' | 'Mantenimiento' | 'Ganar músculo';
  dailyCalorieTarget: number;
  dailyProteinTargetG: number;
  dailyCarbsTargetG: number;
  dailyFatTargetG: number;
  dietaryRestrictions: string[];
  textSizePreference?: TextSizePreference;
}

export interface Micronutrients {
  vitaminA_mcg: number;
  vitaminC_mg: number;
  vitaminD_iu: number;
  vitaminB12_mcg: number;
  calcium_mg: number;
  iron_mg: number;
  potassium_mg: number;
  sodium_mg: number;
  magnesium_mg: number;
  zinc_mg: number;
}

export interface FoodItem {
  name: string;
  estimatedWeightGrams: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface MealAnalysis {
  id: string;
  dishName: string;
  description: string;
  mealType: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack';
  estimatedWeightGrams: number;
  healthIndex: number; // 1 to 10
  reliabilityConfidence: number; // %
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  sugarGrams: number;
  saturatedFatGrams: number;
  micronutrients: Micronutrients;
  foodItems: FoodItem[];
  warnings: string[];
  personalizedRecommendations: string[];
  imageUri?: string;
  timestamp: number;
}

export interface WeightEntry {
  id: string;
  weightKg: number;
  dateString: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

import { RecommendedDish } from './data/dishesCatalog';
export type { RecommendedDish };

export interface DayPlan {
  dayName: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  desayuno: RecommendedDish;
  almuerzo: RecommendedDish;
  cena: RecommendedDish;
  snack: RecommendedDish;
}

export type NavTab = 'scanner' | 'nutrition' | 'explore' | 'zerowaste' | 'plans' | 'weeklyPlan' | 'lifeStages' | 'seasonal' | 'diary' | 'progress' | 'pricing' | 'profile';

export interface SupermarketProductAnalysis {
  id: string;
  productName: string;
  brand?: string;
  category: string;
  verdict: 'excelente' | 'ocasional' | 'evitar';
  verdictTitle: string;
  verdictReason: string;
  nutriScore?: 'A' | 'B' | 'C' | 'D' | 'E';
  trafficLightScore?: 'verde_oscuro' | 'verde' | 'ambar' | 'naranja' | 'rojo';
  trafficLightLabel?: string;
  novaGroup: 1 | 2 | 3 | 4;
  novaLabel: string;
  healthScore: number; // 1 to 10
  calories100g: number;
  protein100g: number;
  carbs100g: number;
  fat100g: number;
  sugar100g: number;
  saturatedFat100g: number;
  salt100g: number;
  ingredientsList: string[];
  additivesFound: { code: string; name: string; risk: 'bajo' | 'medio' | 'alto' }[];
  mediterraneanQualities: string[];
  warnings: string[];
  healthyAlternative: string;
  imageUri?: string;
  timestamp: number;
}

export const mealAnalysisToRecommendedDish = (meal: MealAnalysis): RecommendedDish => {
  return {
    id: `custom_meal_${meal.id || Date.now()}`,
    dishName: meal.dishName,
    description: meal.description || 'Plato escaneado y preparado en casa',
    mealType: meal.mealType,
    calories: Math.max(0, Math.round(meal.calories)),
    proteinGrams: Math.max(0, Math.round(meal.proteinGrams)),
    carbsGrams: Math.max(0, Math.round(meal.carbsGrams)),
    fatGrams: Math.max(0, Math.round(meal.fatGrams)),
    prepTimeMinutes: 15,
    ingredients: meal.foodItems && meal.foodItems.length > 0
      ? meal.foodItems.map(i => `${i.name} (${i.estimatedWeightGrams}g)`)
      : [meal.dishName],
    safeForRestrictions: true,
    tag: 'Mediterráneo'
  };
};

export const supermarketProductToRecommendedDish = (prod: SupermarketProductAnalysis): RecommendedDish => {
  return {
    id: `custom_prod_${prod.id || Date.now()}`,
    dishName: `${prod.productName} (${prod.brand || 'Supermercado'})`,
    description: prod.verdictReason || 'Producto inspeccionado en supermercado',
    mealType: 'Snack',
    calories: Math.max(0, Math.round(prod.calories100g)),
    proteinGrams: Math.max(0, Math.round(prod.protein100g)),
    carbsGrams: Math.max(0, Math.round(prod.carbs100g)),
    fatGrams: Math.max(0, Math.round(prod.fat100g)),
    prepTimeMinutes: 5,
    ingredients: prod.ingredientsList && prod.ingredientsList.length > 0
      ? prod.ingredientsList
      : [prod.productName],
    safeForRestrictions: true,
    tag: 'Supermercado'
  };
};
