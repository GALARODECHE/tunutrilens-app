import React, { useState, useMemo, useEffect } from 'react';
import {
  UserProfile,
  MealAnalysis,
  DayPlan,
  RecommendedDish,
  SupermarketProductAnalysis,
  mealAnalysisToRecommendedDish,
  supermarketProductToRecommendedDish
} from '../types';
import { DESAYUNOS_CATALOG, COMIDAS_CATALOG, CENAS_CATALOG, SNACKS_CATALOG } from '../data/dishesCatalog';
import { getDishLifeStageAdaptations } from '../utils/lifeStageUtils';
import { WeeklyPlanTargetsCustomizerModal, WeeklyPlanTargets } from '../components/WeeklyPlanTargetsCustomizerModal';
import { loadWeeklyPlan, saveWeeklyPlan, getDefaultWeeklyPlan } from '../services/storage';
import {
  CalendarDays,
  Printer,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  Award,
  RefreshCw,
  Plus,
  ShieldCheck,
  ChevronRight,
  FileText,
  HeartPulse,
  Share2,
  X,
  Pencil,
  Save,
  Trash2,
  Edit3,
  Sliders,
  Check,
  Activity,
  Zap,
  Info,
  Calculator,
  Camera,
  Search,
  BookOpen,
  CheckSquare,
  Square,
  AlertCircle,
  PlusCircle
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Props {
  userProfile: UserProfile;
  onAddMealToDiary: (meal: MealAnalysis) => void;
  onUpdateProfile?: (profile: UserProfile) => void;
  weeklyPlan?: DayPlan[];
  onAddToWeeklyPlan?: (
    dayIndex: number,
    mealType: 'desayuno' | 'almuerzo' | 'cena' | 'snack',
    dish: RecommendedDish
  ) => void;
  loggedMeals?: MealAnalysis[];
  savedCustomRecipes?: RecommendedDish[];
  savedScans?: SupermarketProductAnalysis[];
  onNavigateToScan?: () => void;
}

const STORAGE_KEY = 'nutrilens_weekly_plan_targets';

const EMPTY_DISH = (mealType: string): RecommendedDish => ({
  id: `empty_${Date.now()}`,
  dishName: 'Sin plato asignado',
  description: 'Espacio libre o ayuno programado',
  mealType: (mealType.charAt(0).toUpperCase() + mealType.slice(1)) as any,
  calories: 0,
  proteinGrams: 0,
  carbsGrams: 0,
  fatGrams: 0,
  prepTimeMinutes: 0,
  ingredients: [],
  safeForRestrictions: true,
  tag: 'Libre'
});

export const WeeklyMenuPlanScreen: React.FC<Props> = ({
  userProfile,
  onAddMealToDiary,
  onUpdateProfile,
  weeklyPlan: propWeeklyPlan,
  onAddToWeeklyPlan,
  loggedMeals = [],
  savedCustomRecipes = [],
  savedScans = [],
  onNavigateToScan,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('Mediterráneo Equilibrado');
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [checkedGroceryItems, setCheckedGroceryItems] = useState<Record<string, boolean>>({});

  // Weekly plan state
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>(() => {
    if (propWeeklyPlan && propWeeklyPlan.length === 7) {
      return propWeeklyPlan;
    }
    return loadWeeklyPlan();
  });

  // Sync if propWeeklyPlan changes from outside
  useEffect(() => {
    if (propWeeklyPlan && propWeeklyPlan.length === 7) {
      setWeeklyPlan(propWeeklyPlan);
    }
  }, [propWeeklyPlan]);

  // Keep weeklyPlan synced with storage whenever it changes
  useEffect(() => {
    saveWeeklyPlan(weeklyPlan);
  }, [weeklyPlan]);

  // Modals state
  const [showSwapModal, setShowSwapModal] = useState<{
    dayIdx: number;
    mealType: 'desayuno' | 'almuerzo' | 'cena' | 'snack';
    initialTab?: 'scans' | 'supermarket' | 'recipes' | 'catalog' | 'custom';
  } | null>(null);

  const [swapModalTab, setSwapModalTab] = useState<'scans' | 'supermarket' | 'recipes' | 'catalog' | 'custom'>('scans');
  const [swapSearchQuery, setSwapSearchQuery] = useState<string>('');

  const [editingMealModal, setEditingMealModal] = useState<{
    dayIdx: number;
    mealType: 'desayuno' | 'almuerzo' | 'cena' | 'snack';
    dish: RecommendedDish;
  } | null>(null);

  const [showDiarySelectModal, setShowDiarySelectModal] = useState<boolean>(false);
  const [selectedMealsForDiary, setSelectedMealsForDiary] = useState<{
    desayuno: boolean;
    almuerzo: boolean;
    cena: boolean;
    snack: boolean;
  }>({
    desayuno: true,
    almuerzo: true,
    cena: true,
    snack: true
  });

  const [addedToastMessage, setAddedToastMessage] = useState<string | null>(null);
  const [isCustomTargetsModalOpen, setIsCustomTargetsModalOpen] = useState<boolean>(false);

  // Custom Targets State for Macros & Micros
  const [customTargets, setCustomTargets] = useState<WeeklyPlanTargets>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      dailyCalories: userProfile.dailyCalorieTarget || 2000,
      proteinGrams: userProfile.dailyProteinTargetG || 110,
      carbsGrams: userProfile.dailyCarbsTargetG || 220,
      fatGrams: userProfile.dailyFatTargetG || 65,
      fiberGrams: 30,
      calciumMg: 1000,
      ironMg: 14,
      vitaminDIU: 800,
      vitaminB12Mcg: 2.4,
      vitaminCMg: 80,
      magnesiumMg: 350,
      zincMg: 11,
      potassiumMg: 3000,
      sodiumMgMax: 2000,
      waterLiters: 2.5,
      customNotes: 'Metas iniciales calculadas para tu perfil mediterráneo',
    };
  });

  const handleApplyCustomTargets = (newTargets: WeeklyPlanTargets, updateGlobalProfile?: boolean) => {
    setCustomTargets(newTargets);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTargets));
    } catch {}

    if (updateGlobalProfile && onUpdateProfile) {
      onUpdateProfile({
        ...userProfile,
        dailyCalorieTarget: newTargets.dailyCalories,
        dailyProteinTargetG: newTargets.proteinGrams,
        dailyCarbsTargetG: newTargets.carbsGrams,
        dailyFatTargetG: newTargets.fatGrams,
      });
    }
  };

  // Edit form state
  const [editForm, setEditForm] = useState<{
    dishName: string;
    description: string;
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    prepTimeMinutes: number;
    ingredientsText: string;
  }>({
    dishName: '',
    description: '',
    calories: 0,
    proteinGrams: 0,
    carbsGrams: 0,
    fatGrams: 0,
    prepTimeMinutes: 10,
    ingredientsText: ''
  });

  // Manual dish form inside swap modal
  const [customNewDish, setCustomNewDish] = useState<{
    dishName: string;
    description: string;
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
    prepTimeMinutes: number;
    ingredientsText: string;
  }>({
    dishName: '',
    description: '',
    calories: 350,
    proteinGrams: 25,
    carbsGrams: 30,
    fatGrams: 10,
    prepTimeMinutes: 15,
    ingredientsText: ''
  });

  const handleOpenEditModal = (dayIdx: number, mealType: 'desayuno' | 'almuerzo' | 'cena' | 'snack', dish: RecommendedDish) => {
    setEditingMealModal({ dayIdx, mealType, dish });
    setEditForm({
      dishName: dish.dishName,
      description: dish.description,
      calories: dish.calories,
      proteinGrams: dish.proteinGrams,
      carbsGrams: dish.carbsGrams,
      fatGrams: dish.fatGrams,
      prepTimeMinutes: dish.prepTimeMinutes || 15,
      ingredientsText: dish.ingredients.join(', ')
    });
  };

  const handleSaveEditedDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMealModal) return;

    const parsedIngredients = editForm.ingredientsText
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    const updatedDish: RecommendedDish = {
      ...editingMealModal.dish,
      dishName: editForm.dishName.trim() || 'Plato Personalizado',
      description: editForm.description.trim() || 'Descripción del plato',
      calories: Math.max(0, Number(editForm.calories) || 0),
      proteinGrams: Math.max(0, Number(editForm.proteinGrams) || 0),
      carbsGrams: Math.max(0, Number(editForm.carbsGrams) || 0),
      fatGrams: Math.max(0, Number(editForm.fatGrams) || 0),
      prepTimeMinutes: Math.max(1, Number(editForm.prepTimeMinutes) || 10),
      ingredients: parsedIngredients.length > 0 ? parsedIngredients : editingMealModal.dish.ingredients
    };

    setWeeklyPlan(prev => {
      const updated = [...prev];
      updated[editingMealModal.dayIdx] = {
        ...updated[editingMealModal.dayIdx],
        [editingMealModal.mealType]: updatedDish
      };
      return updated;
    });

    if (onAddToWeeklyPlan) {
      onAddToWeeklyPlan(editingMealModal.dayIdx, editingMealModal.mealType, updatedDish);
    }

    setEditingMealModal(null);
  };

  // Swap dish in weekly plan
  const handleAssignDishToSlot = (dayIdx: number, mealType: 'desayuno' | 'almuerzo' | 'cena' | 'snack', newDish: RecommendedDish) => {
    setWeeklyPlan(prev => {
      const updated = [...prev];
      updated[dayIdx] = {
        ...updated[dayIdx],
        [mealType]: newDish
      };
      return updated;
    });

    if (onAddToWeeklyPlan) {
      onAddToWeeklyPlan(dayIdx, mealType, newDish);
    }

    setShowSwapModal(null);
    setSwapSearchQuery('');
  };

  const handleClearSlot = (dayIdx: number, mealType: 'desayuno' | 'almuerzo' | 'cena' | 'snack') => {
    const empty = EMPTY_DISH(mealType);
    handleAssignDishToSlot(dayIdx, mealType, empty);
  };

  const handleCreateAndAssignCustomDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showSwapModal) return;

    const parsedIngredients = customNewDish.ingredientsText
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    const newDish: RecommendedDish = {
      id: `manual_custom_${Date.now()}`,
      dishName: customNewDish.dishName.trim() || 'Plato Personalizado',
      description: customNewDish.description.trim() || 'Creado a medida por el usuario',
      mealType: (showSwapModal.mealType.charAt(0).toUpperCase() + showSwapModal.mealType.slice(1)) as any,
      calories: Math.max(0, Number(customNewDish.calories) || 0),
      proteinGrams: Math.max(0, Number(customNewDish.proteinGrams) || 0),
      carbsGrams: Math.max(0, Number(customNewDish.carbsGrams) || 0),
      fatGrams: Math.max(0, Number(customNewDish.fatGrams) || 0),
      prepTimeMinutes: Math.max(1, Number(customNewDish.prepTimeMinutes) || 10),
      ingredients: parsedIngredients.length > 0 ? parsedIngredients : ['Ingredientes variados mediterráneos'],
      safeForRestrictions: true,
      tag: 'Personalizado'
    };

    handleAssignDishToSlot(showSwapModal.dayIdx, showSwapModal.mealType, newDish);
    setCustomNewDish({
      dishName: '',
      description: '',
      calories: 350,
      proteinGrams: 25,
      carbsGrams: 30,
      fatGrams: 10,
      prepTimeMinutes: 15,
      ingredientsText: ''
    });
  };

  // Calculate daily totals for a day
  const calculateDayStats = (day: DayPlan) => {
    const d = day.desayuno || EMPTY_DISH('desayuno');
    const a = day.almuerzo || EMPTY_DISH('almuerzo');
    const c = day.cena || EMPTY_DISH('cena');
    const s = day.snack || EMPTY_DISH('snack');

    const totalCal = d.calories + a.calories + c.calories + s.calories;
    const totalProt = d.proteinGrams + a.proteinGrams + c.proteinGrams + s.proteinGrams;
    const totalCarbs = d.carbsGrams + a.carbsGrams + c.carbsGrams + s.carbsGrams;
    const totalFat = d.fatGrams + a.fatGrams + c.fatGrams + s.fatGrams;
    return { totalCal, totalProt, totalCarbs, totalFat };
  };

  // Weekly average
  const weeklyAverage = useMemo(() => {
    let totalCal = 0;
    let totalProt = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    weeklyPlan.forEach(day => {
      const stats = calculateDayStats(day);
      totalCal += stats.totalCal;
      totalProt += stats.totalProt;
      totalCarbs += stats.totalCarbs;
      totalFat += stats.totalFat;
    });

    return {
      avgCal: Math.round(totalCal / 7),
      avgProt: Math.round(totalProt / 7),
      avgCarbs: Math.round(totalCarbs / 7),
      avgFat: Math.round(totalFat / 7)
    };
  }, [weeklyPlan]);

  // Generate Weekly Grocery List by Category
  const groceryList = useMemo(() => {
    const categories: Record<string, string[]> = {
      'Verduras, Hortalizas y Frutas': [],
      'Proteínas, Carnes, Pescados y Huevos': [],
      'Cereales, Tubérculos y Legumbres': [],
      'Lácteos, Yogures y Quesos': [],
      'Aceites, Frutos Secos y Semillas': [],
      'Condimentos y Especias': []
    };

    const allIngredients = new Set<string>();
    weeklyPlan.forEach(day => {
      [day.desayuno, day.almuerzo, day.cena, day.snack].forEach(meal => {
        if (meal && meal.ingredients) {
          meal.ingredients.forEach(ing => allIngredients.add(ing));
        }
      });
    });

    allIngredients.forEach(ing => {
      const lower = ing.toLowerCase();
      if (lower.includes('espinaca') || lower.includes('tomate') || lower.includes('zanahoria') || lower.includes('pimiento') || lower.includes('cebolla') || lower.includes('ajo') || lower.includes('calabacín') || lower.includes('manzana') || lower.includes('plátano') || lower.includes('frutos rojos') || lower.includes('limón') || lower.includes('aguacate') || lower.includes('brócoli') || lower.includes('lechuga')) {
        categories['Verduras, Hortalizas y Frutas'].push(ing);
      } else if (lower.includes('pollo') || lower.includes('pavo') || lower.includes('ternera') || lower.includes('salmón') || lower.includes('merluza') || lower.includes('atún') || lower.includes('huevo') || lower.includes('claras') || lower.includes('gambas')) {
        categories['Proteínas, Carnes, Pescados y Huevos'].push(ing);
      } else if (lower.includes('pan') || lower.includes('avena') || lower.includes('arroz') || lower.includes('quinoa') || lower.includes('lentejas') || lower.includes('garbanzos') || lower.includes('patata') || lower.includes('boniato') || lower.includes('cuscús')) {
        categories['Cereales, Tubérculos y Legumbres'].push(ing);
      } else if (lower.includes('yogur') || lower.includes('queso') || lower.includes('leche') || lower.includes('kéfir')) {
        categories['Lácteos, Yogures y Quesos'].push(ing);
      } else if (lower.includes('aceite') || lower.includes('nueces') || lower.includes('almendra') || lower.includes('chía') || lower.includes('crema de cacahuete')) {
        categories['Aceites, Frutos Secos y Semillas'].push(ing);
      } else {
        categories['Condimentos y Especias'].push(ing);
      }
    });

    return categories;
  }, [weeklyPlan]);

  // Handle Preset Change
  const applyPreset = (presetName: string) => {
    setSelectedPreset(presetName);
    let offset = 0;
    if (presetName === 'Alta Proteína & Músculo') offset = 1;
    if (presetName === 'Déficit Calórico & Pérdida de Grasa') offset = 2;
    if (presetName === 'Embarazo & Lactancia') offset = 3;
    if (presetName === 'Adultos Mayores / Senior') offset = 4;

    const days: ('Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo')[] = [
      'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
    ];

    const newPlan: DayPlan[] = days.map((day, idx) => ({
      dayName: day,
      desayuno: DESAYUNOS_CATALOG[(idx + offset) % DESAYUNOS_CATALOG.length],
      almuerzo: COMIDAS_CATALOG[(idx + offset) % COMIDAS_CATALOG.length],
      cena: CENAS_CATALOG[(idx + offset) % CENAS_CATALOG.length],
      snack: SNACKS_CATALOG[(idx + offset) % SNACKS_CATALOG.length]
    }));

    setWeeklyPlan(newPlan);
  };

  // Generate Menu with AI using Custom Targets (Macros & Micros)
  const handleGenerateAIWeeklyPlan = async (targetsToUse?: WeeklyPlanTargets) => {
    const activeT = targetsToUse || customTargets;
    setIsGeneratingAI(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        applyPreset(selectedPreset);
        setIsGeneratingAI(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Genera un menú semanal estructurado de 7 días (Lunes a Domingo) basado EXCLUSIVAMENTE en la DIETA MEDITERRÁNEA Y GASTRONOMÍA TRADICIONAL ESPAÑOLA SENCILLA DE PREPARAR, con ingredientes comunes de supermercado español (aceite de oliva virgen extra, tomate, ajo, huevos, pan de rústico/barra, jamón serrano, pechuga de pollo/pavo, ternera magra, merluza, salmón, atún en lata, legumbres de bote como garbanzos o lentejas, patatas, verduras de la huerta, yogur natural, miel pura).

REGLA ESTRICTA DE EXCLUSIÓN: PROHIBIDO incluir alimentos ultraprocesados o exóticos como sirope de agave, espirulina, açaí, porridge, overnight oats, granola, chía, edamame, tempeh o poke bowls.
REGLA DE ADICIÓN MEDITERRÁNEA: Incorpora frecuentemente ensaladas y guarniciones con verduras de hoja verde (rúcula, canónigos, espinacas frescas, cogollos) y frutos secos tradicionales (nueces, avellanas, almendras).

METAS NUTRICIONALES PERSONALIZADAS DIARIAS A CUMPLIR (SUMA DE LAS 4 COMIDAS DEL DÍA):
- Objetivo energético diario: ${activeT.dailyCalories} kcal/día
- Proteínas diarias: ${activeT.proteinGrams} g
- Carbohidratos diarios: ${activeT.carbsGrams} g
- Grasas saludables diarias: ${activeT.fatGrams} g
- Fibra dietética mínima: ${activeT.fiberGrams} g
- Calcio meta: ${activeT.calciumMg} mg
- Hierro meta: ${activeT.ironMg} mg
- Vitamina D3 meta: ${activeT.vitaminDIU} UI
- Magnesio meta: ${activeT.magnesiumMg} mg
- Restricciones/Alérgenos a excluir absolutamente: ${(userProfile.dietaryRestrictions || []).join(', ') || 'Ninguna'}
- Notas clínicas del usuario: ${activeT.customNotes || 'Ninguna'}

Responde EXCLUSIVAMENTE en formato JSON plano con esta estructura:
{
  "days": [
    {
      "dayName": "Lunes",
      "desayuno": { "dishName": "...", "description": "...", "calories": 300, "proteinGrams": 20, "carbsGrams": 30, "fatGrams": 8, "prepTimeMinutes": 5, "ingredients": ["..."] },
      "almuerzo": { "dishName": "...", "description": "...", "calories": 500, "proteinGrams": 35, "carbsGrams": 45, "fatGrams": 12, "prepTimeMinutes": 20, "ingredients": ["..."] },
      "cena": { "dishName": "...", "description": "...", "calories": 400, "proteinGrams": 30, "carbsGrams": 30, "fatGrams": 10, "prepTimeMinutes": 15, "ingredients": ["..."] },
      "snack": { "dishName": "...", "description": "...", "calories": 180, "proteinGrams": 15, "carbsGrams": 15, "fatGrams": 5, "prepTimeMinutes": 3, "ingredients": ["..."] }
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt
      });

      const responseText = response.text || '';
      const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanedJson);

      if (parsed && Array.isArray(parsed.days) && parsed.days.length === 7) {
        const baseDays = getDefaultWeeklyPlan();
        const formattedPlan: DayPlan[] = parsed.days.map((d: any, idx: number) => ({
          dayName: d.dayName || baseDays[idx]?.dayName || 'Lunes',
          desayuno: { ...d.desayuno, id: `ai_des_${idx}_${Date.now()}`, mealType: 'Desayuno', safeForRestrictions: true },
          almuerzo: { ...d.almuerzo, id: `ai_alm_${idx}_${Date.now()}`, mealType: 'Almuerzo', safeForRestrictions: true },
          cena: { ...d.cena, id: `ai_cen_${idx}_${Date.now()}`, mealType: 'Cena', safeForRestrictions: true },
          snack: { ...d.snack, id: `ai_sna_${idx}_${Date.now()}`, mealType: 'Snack', safeForRestrictions: true }
        }));
        setWeeklyPlan(formattedPlan);
      } else {
        applyPreset(selectedPreset);
      }
    } catch (err) {
      console.error('Error generating AI weekly plan:', err);
      applyPreset(selectedPreset);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Helper to convert dish to MealAnalysis for logging into diary
  const dishToMealAnalysis = (dish: RecommendedDish): MealAnalysis => {
    return {
      id: `weekly_log_${dish.id}_${Date.now()}`,
      dishName: dish.dishName,
      description: dish.description,
      mealType: dish.mealType || 'Almuerzo',
      estimatedWeightGrams: 300,
      healthIndex: 9,
      reliabilityConfidence: 98,
      calories: dish.calories,
      proteinGrams: dish.proteinGrams,
      carbsGrams: dish.carbsGrams,
      fatGrams: dish.fatGrams,
      fiberGrams: 6,
      sugarGrams: 4,
      saturatedFatGrams: 2,
      micronutrients: {
        vitaminA_mcg: 250,
        vitaminC_mg: 30,
        vitaminD_iu: 70,
        vitaminB12_mcg: 1.5,
        calcium_mg: 200,
        iron_mg: 3.5,
        potassium_mg: 450,
        sodium_mg: 300,
        magnesium_mg: 75,
        zinc_mg: 2.2
      },
      foodItems: dish.ingredients && dish.ingredients.length > 0
        ? dish.ingredients.map(ing => ({
            name: ing,
            estimatedWeightGrams: 75,
            calories: Math.round(dish.calories / dish.ingredients.length),
            proteinGrams: Math.round(dish.proteinGrams / dish.ingredients.length),
            carbsGrams: Math.round(dish.carbsGrams / dish.ingredients.length),
            fatGrams: Math.round(dish.fatGrams / dish.ingredients.length)
          }))
        : [{
            name: dish.dishName,
            estimatedWeightGrams: 250,
            calories: dish.calories,
            proteinGrams: dish.proteinGrams,
            carbsGrams: dish.carbsGrams,
            fatGrams: dish.fatGrams
          }],
      warnings: [],
      personalizedRecommendations: ['Plato seleccionado del plan nutricional semanal'],
      timestamp: Date.now()
    };
  };

  // Add SINGLE meal to diary directly
  const handleAddSingleMealToDiary = (dish: RecommendedDish) => {
    if (dish.calories === 0 || dish.dishName === 'Sin plato asignado') return;
    const meal = dishToMealAnalysis(dish);
    onAddMealToDiary(meal);
    setAddedToastMessage(`"${dish.dishName}" (${dish.calories} kcal) añadido al Diario`);
    setTimeout(() => setAddedToastMessage(null), 3000);
  };

  // Confirm selected meals from the day to diary
  const handleConfirmSelectedMealsToDiary = () => {
    const todayPlan = weeklyPlan[activeDayIndex];
    const slots: Array<'desayuno' | 'almuerzo' | 'cena' | 'snack'> = ['desayuno', 'almuerzo', 'cena', 'snack'];
    let addedCount = 0;
    let addedKcal = 0;

    slots.forEach(slot => {
      if (selectedMealsForDiary[slot]) {
        const dish = todayPlan[slot];
        if (dish && dish.calories > 0 && dish.dishName !== 'Sin plato asignado') {
          const meal = dishToMealAnalysis(dish);
          onAddMealToDiary(meal);
          addedCount++;
          addedKcal += dish.calories;
        }
      }
    });

    setShowDiarySelectModal(false);
    if (addedCount > 0) {
      setAddedToastMessage(`¡${addedCount} platos (${addedKcal} kcal) registrados en tu Diario con éxito!`);
      setTimeout(() => setAddedToastMessage(null), 3500);
    }
  };

  // Print PDF View
  const handlePrint = () => {
    window.print();
  };

  const activeDay = weeklyPlan[activeDayIndex] || weeklyPlan[0];
  const activeDayStats = calculateDayStats(activeDay);

  // Percentages against customTargets
  const calPercent = Math.min(150, Math.round((activeDayStats.totalCal / (customTargets.dailyCalories || 2000)) * 100));
  const protPercent = Math.min(150, Math.round((activeDayStats.totalProt / (customTargets.proteinGrams || 110)) * 100));
  const carbsPercent = Math.min(150, Math.round((activeDayStats.totalCarbs / (customTargets.carbsGrams || 220)) * 100));
  const fatPercent = Math.min(150, Math.round((activeDayStats.totalFat / (customTargets.fatGrams || 65)) * 100));

  // Filter items for swap modal
  const filteredScans = useMemo(() => {
    if (!swapSearchQuery.trim()) return loggedMeals;
    const q = swapSearchQuery.toLowerCase();
    return loggedMeals.filter(m => m.dishName.toLowerCase().includes(q) || (m.description && m.description.toLowerCase().includes(q)));
  }, [loggedMeals, swapSearchQuery]);

  const filteredSupermarket = useMemo(() => {
    if (!swapSearchQuery.trim()) return savedScans;
    const q = swapSearchQuery.toLowerCase();
    return savedScans.filter(s => s.productName.toLowerCase().includes(q) || (s.brand && s.brand.toLowerCase().includes(q)));
  }, [savedScans, swapSearchQuery]);

  const filteredRecipes = useMemo(() => {
    if (!swapSearchQuery.trim()) return savedCustomRecipes;
    const q = swapSearchQuery.toLowerCase();
    return savedCustomRecipes.filter(r => r.dishName.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
  }, [savedCustomRecipes, swapSearchQuery]);

  const filteredCatalog = useMemo(() => {
    if (!showSwapModal) return [];
    const list = showSwapModal.mealType === 'desayuno' ? DESAYUNOS_CATALOG :
      showSwapModal.mealType === 'almuerzo' ? COMIDAS_CATALOG :
      showSwapModal.mealType === 'cena' ? CENAS_CATALOG : SNACKS_CATALOG;

    if (!swapSearchQuery.trim()) return list;
    const q = swapSearchQuery.toLowerCase();
    return list.filter(d => d.dishName.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) || (d.tag && d.tag.toLowerCase().includes(q)));
  }, [showSwapModal, swapSearchQuery]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-12">
      
      {/* TOAST NOTIFICATION */}
      {addedToastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-500 font-extrabold text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span>{addedToastMessage}</span>
        </div>
      )}

      {/* MODAL PARA PERSONALIZAR METAS DE MACROS Y MICROS */}
      <WeeklyPlanTargetsCustomizerModal
        isOpen={isCustomTargetsModalOpen}
        onClose={() => setIsCustomTargetsModalOpen(false)}
        userProfile={userProfile}
        currentTargets={customTargets}
        onApplyTargets={handleApplyCustomTargets}
        onRegeneratePlanWithTargets={(newT) => {
          handleApplyCustomTargets(newT);
          handleGenerateAIWeeklyPlan(newT);
        }}
      />

      {/* HEADER PRINCIPAL */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 text-white shadow-xl space-y-4 print:hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">Plan Nutricional Semanal</h1>
              <span className="px-2.5 py-0.5 bg-emerald-500/40 text-emerald-100 text-[11px] font-bold rounded-full border border-emerald-300/30">
                100% Personalizable
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
              Configura tus platos para cada día. Añade tus propios escaneos de fotos, productos de supermercado o recetas tradicionales mediterráneas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleGenerateAIWeeklyPlan()}
              disabled={isGeneratingAI}
              className="px-4 py-2.5 bg-white text-emerald-900 font-extrabold text-xs rounded-xl shadow-md hover:bg-emerald-50 transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 text-emerald-600 ${isGeneratingAI ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAI ? 'Generando Menú...' : 'Autogenerar con IA'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
              title="Imprimir o Descargar PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir PDF</span>
            </button>
          </div>
        </div>

        {/* TARGET PROFILES RESUMEN VS CUSTOM TARGETS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/20 text-xs">
          <div className="p-2.5 bg-white/10 rounded-xl border border-white/15 text-center">
            <span className="text-[10px] text-emerald-100 uppercase font-semibold block">Objetivo Calórico</span>
            <span className="text-sm font-black text-white">{weeklyAverage.avgCal} / {customTargets.dailyCalories} kcal</span>
          </div>
          <div className="p-2.5 bg-white/10 rounded-xl border border-white/15 text-center">
            <span className="text-[10px] text-emerald-100 uppercase font-semibold block">Proteína Meta</span>
            <span className="text-sm font-black text-white">{weeklyAverage.avgProt}g / {customTargets.proteinGrams}g</span>
          </div>
          <div className="p-2.5 bg-white/10 rounded-xl border border-white/15 text-center">
            <span className="text-[10px] text-emerald-100 uppercase font-semibold block">Carbohidratos Meta</span>
            <span className="text-sm font-black text-white">{weeklyAverage.avgCarbs}g / {customTargets.carbsGrams}g</span>
          </div>
          <div className="p-2.5 bg-white/10 rounded-xl border border-white/15 text-center">
            <span className="text-[10px] text-emerald-100 uppercase font-semibold block">Grasas Meta</span>
            <span className="text-sm font-black text-white">{weeklyAverage.avgFat}g / {customTargets.fatGrams}g</span>
          </div>
        </div>
      </div>

      {/* BANNER INFORMATIVO DE METAS PERSONALIZADAS DEL PLAN */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3 print:hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Sliders className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Tus Metas Nutricionales Activas
                </h3>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold rounded-md border border-emerald-200">
                  Calibrado a tu Medida
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {customTargets.customNotes || 'Metas diarias de macronutrientes y micronutrientes personalizadas.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsCustomTargetsModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculadora & Ajuste de Metas</span>
            </button>
          </div>
        </div>

        {/* Badges de Macros y Micros Clave */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1 text-xs">
          <div className="p-2 bg-amber-50/70 border border-amber-200 rounded-xl text-center">
            <span className="text-[10px] text-amber-800 font-bold block">Calorías</span>
            <span className="text-xs font-black text-amber-950">{customTargets.dailyCalories} kcal</span>
          </div>
          <div className="p-2 bg-emerald-50/70 border border-emerald-200 rounded-xl text-center">
            <span className="text-[10px] text-emerald-800 font-bold block">Proteína</span>
            <span className="text-xs font-black text-emerald-950">{customTargets.proteinGrams} g</span>
          </div>
          <div className="p-2 bg-sky-50/70 border border-sky-200 rounded-xl text-center">
            <span className="text-[10px] text-sky-800 font-bold block">Carbohidratos</span>
            <span className="text-xs font-black text-sky-950">{customTargets.carbsGrams} g</span>
          </div>
          <div className="p-2 bg-rose-50/70 border border-rose-200 rounded-xl text-center">
            <span className="text-[10px] text-rose-800 font-bold block">Grasas</span>
            <span className="text-xs font-black text-rose-950">{customTargets.fatGrams} g</span>
          </div>
          <div className="p-2 bg-teal-50/70 border border-teal-200 rounded-xl text-center">
            <span className="text-[10px] text-teal-800 font-bold block">Fibra</span>
            <span className="text-xs font-black text-teal-950">≥ {customTargets.fiberGrams} g</span>
          </div>
          <div className="p-2 bg-indigo-50/70 border border-indigo-200 rounded-xl text-center">
            <span className="text-[10px] text-indigo-800 font-bold block">Calcio / Vit D</span>
            <span className="text-xs font-black text-indigo-950">{customTargets.calciumMg}mg / {customTargets.vitaminDIU}UI</span>
          </div>
        </div>
      </div>

      {/* PRESETS DE PLANES ALIMENTARIOS */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-3 print:hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Plantillas de Plan Semanal Preconfiguradas</span>
          </span>
          <span className="text-[11px] text-slate-500">Selecciona el enfoque nutricional deseado</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {[
            'Mediterráneo Equilibrado',
            'Alta Proteína & Músculo',
            'Déficit Calórico & Pérdida de Grasa',
            'Embarazo & Lactancia',
            'Adultos Mayores / Senior'
          ].map(preset => (
            <button
              key={preset}
              onClick={() => applyPreset(preset)}
              className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all cursor-pointer ${
                selectedPreset === preset
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-[1.02]'
                  : 'bg-emerald-50/50 text-slate-700 border-emerald-100 hover:bg-emerald-100/60'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* SELECTOR DE DÍA DE LA SEMANA */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar print:hidden">
        {weeklyPlan.map((day, idx) => {
          const stats = calculateDayStats(day);
          const isActive = activeDayIndex === idx;

          return (
            <button
              key={day.dayName}
              onClick={() => setActiveDayIndex(idx)}
              className={`px-4 py-3 rounded-2xl border text-left transition-all shrink-0 min-w-[120px] cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                  : 'bg-white text-slate-700 border-emerald-100 hover:bg-emerald-50/50'
              }`}
            >
              <div className="text-xs font-black">{day.dayName}</div>
              <div className={`text-[10px] font-semibold mt-0.5 ${isActive ? 'text-emerald-300' : 'text-emerald-700'}`}>
                {stats.totalCal} kcal • {stats.totalProt}g P
              </div>
            </button>
          );
        })}
      </div>

      {/* CONTENIDO DEL DÍA SELECCIONADO (4 COMIDAS + SEGUIMIENTO DE METAS PERSONALIZADAS) */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-5 print:hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>Menú Completo para el {activeDay.dayName}</span>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-md">
                {activeDayStats.totalCal} kcal Totales
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Proteína: {activeDayStats.totalProt}g / {customTargets.proteinGrams}g | Carbs: {activeDayStats.totalCarbs}g / {customTargets.carbsGrams}g | Grasas: {activeDayStats.totalFat}g / {customTargets.fatGrams}g
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsCustomTargetsModalOpen(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Ajustar Metas</span>
            </button>

            {/* BOTÓN REGISTRAR EN DIARIO CON SELECCIÓN */}
            <button
              onClick={() => setShowDiarySelectModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Registrar Platos en Diario</span>
            </button>
          </div>
        </div>

        {/* BARRAS DE PROGRESO DE METAS PERSONALIZADAS PARA EL DÍA */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
          {/* Calorías */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-amber-800">Calorías</span>
              <span className="text-slate-700">{activeDayStats.totalCal} / {customTargets.dailyCalories} kcal</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${Math.min(100, calPercent)}%` }}></div>
            </div>
          </div>

          {/* Proteínas */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-emerald-800">Proteína</span>
              <span className="text-slate-700">{activeDayStats.totalProt} / {customTargets.proteinGrams} g</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${Math.min(100, protPercent)}%` }}></div>
            </div>
          </div>

          {/* Carbohidratos */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-sky-800">Carbohidratos</span>
              <span className="text-slate-700">{activeDayStats.totalCarbs} / {customTargets.carbsGrams} g</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full transition-all" style={{ width: `${Math.min(100, carbsPercent)}%` }}></div>
            </div>
          </div>

          {/* Grasas */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-rose-800">Grasas Saludables</span>
              <span className="text-slate-700">{activeDayStats.totalFat} / {customTargets.fatGrams} g</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: `${Math.min(100, fatPercent)}%` }}></div>
            </div>
          </div>
        </div>

        {/* 4 CARDS DE COMIDA DEL DÍA CON ACCIONES SELECTIVAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { type: 'desayuno' as const, label: 'Desayuno', dish: activeDay.desayuno },
            { type: 'almuerzo' as const, label: 'Almuerzo Principal', dish: activeDay.almuerzo },
            { type: 'cena' as const, label: 'Cena Ligera', dish: activeDay.cena },
            { type: 'snack' as const, label: 'Snack / Merienda', dish: activeDay.snack }
          ].map(({ type, label, dish }) => {
            const isAssigned = dish && dish.calories > 0 && dish.dishName !== 'Sin plato asignado';
            const lifeStages = isAssigned ? getDishLifeStageAdaptations(dish) : [];

            if (!isAssigned) {
              return (
                <div
                  key={type}
                  className="p-5 bg-slate-50/60 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col justify-between items-center text-center space-y-3 hover:border-emerald-400 hover:bg-emerald-50/20 transition-all"
                >
                  <div className="space-y-1">
                    <span className="px-2.5 py-1 bg-slate-200/80 text-slate-700 rounded-lg uppercase tracking-wider font-extrabold text-[10px]">
                      {label}
                    </span>
                    <p className="text-xs text-slate-500 font-medium">Sin plato asignado (0 kcal / Ayuno)</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowSwapModal({ dayIdx: activeDayIndex, mealType: type });
                      setSwapModalTab('scans');
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Añadir Escaneo o Plato</span>
                  </button>
                </div>
              );
            }

            return (
              <div key={type} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3 flex flex-col justify-between hover:border-emerald-300 transition">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span className="px-2.5 py-1 bg-emerald-100/80 text-emerald-900 rounded-lg uppercase tracking-wider font-extrabold text-[10px]">
                      {label}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(activeDayIndex, type, dish)}
                        className="text-[11px] text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 px-2 py-0.5 bg-amber-50 hover:bg-amber-100 rounded-md border border-amber-200/80 transition-colors cursor-pointer"
                        title="Editar los campos de este plato"
                      >
                        <Pencil className="w-3 h-3 text-amber-700" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowSwapModal({ dayIdx: activeDayIndex, mealType: type });
                          setSwapModalTab('scans');
                        }}
                        className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200/80 transition-colors cursor-pointer"
                        title="Elegir uno de mis escaneos o cambiar por otro plato"
                      >
                        <Camera className="w-3 h-3 text-emerald-700" />
                        <span>Elegir Escaneo</span>
                      </button>
                      <button
                        onClick={() => handleClearSlot(activeDayIndex, type)}
                        className="text-[11px] text-slate-400 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Vaciar este plato"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    {dish.dishName}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {dish.description}
                  </p>

                  {/* Adaptación etapas leyenda */}
                  {lifeStages.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {lifeStages.map(st => (
                        <span key={st.id} className={`text-[9px] font-bold px-2 py-0.5 rounded ${st.badgeBg} ${st.badgeText}`}>
                          ✓ {st.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Macros footer + botón individual de registro en diario */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-amber-700">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{dish.calories} kcal</span>
                    </span>
                    <span className="text-emerald-700">P: {dish.proteinGrams}g</span>
                    <span className="text-blue-700">C: {dish.carbsGrams}g</span>
                    <span className="text-rose-700">G: {dish.fatGrams}g</span>
                  </div>

                  {/* Botón individual directo al diario */}
                  <button
                    onClick={() => handleAddSingleMealToDiary(dish)}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200 text-[10px] font-black transition flex items-center gap-1 cursor-pointer"
                    title="Añadir solo este plato a mi Diario de hoy"
                  >
                    <Plus className="w-3 h-3 text-emerald-700" />
                    <span>Al Diario</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LISTA DE LA COMPRA SEMANAL ORGANIZADA */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-4 print:hidden">
        <div className="flex items-center justify-between border-b border-emerald-50 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Lista de la Compra Semanal Automática</h2>
              <p className="text-xs text-slate-500">Generada al combinar las 28 comidas del plan de la semana</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(groceryList).map(([category, items]) => {
            if (items.length === 0) return null;
            return (
              <div key={category} className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100 space-y-2">
                <h3 className="text-xs font-black text-emerald-900 uppercase tracking-wider border-b border-emerald-200/80 pb-1.5">
                  {category} ({items.length})
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {items.map((item, idx) => {
                    const key = `${category}_${item}_${idx}`;
                    const isChecked = !!checkedGroceryItems[key];
                    return (
                      <li key={key} className="flex items-start gap-2 cursor-pointer" onClick={() => setCheckedGroceryItems(p => ({ ...p, [key]: !isChecked }))}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className={isChecked ? 'line-through text-slate-400' : 'font-medium'}>
                          {item}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL PARA SELECCIONAR QUÉ PLATOS DEL DÍA REGISTRAR EN DIARIO */}
      {showDiarySelectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white border border-emerald-100 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <CheckSquare className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Registrar en Diario ({activeDay.dayName})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Elige qué platos has comido hoy para añadirlos a tu diario:
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDiarySelectModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Checkbox List */}
            <div className="space-y-2.5">
              {[
                { slot: 'desayuno' as const, label: 'Desayuno', dish: activeDay.desayuno },
                { slot: 'almuerzo' as const, label: 'Almuerzo (Comida)', dish: activeDay.almuerzo },
                { slot: 'cena' as const, label: 'Cena', dish: activeDay.cena },
                { slot: 'snack' as const, label: 'Snack / Merienda', dish: activeDay.snack }
              ].map(({ slot, label, dish }) => {
                const isSelected = selectedMealsForDiary[slot];
                const hasDish = dish && dish.calories > 0 && dish.dishName !== 'Sin plato asignado';

                return (
                  <div
                    key={slot}
                    onClick={() => {
                      if (!hasDish) return;
                      setSelectedMealsForDiary(p => ({ ...p, [slot]: !p[slot] }));
                    }}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      !hasDish
                        ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0 text-emerald-700">
                        {isSelected && hasDish ? (
                          <CheckSquare className="w-5 h-5" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                          {label}
                        </span>
                        <h4 className="text-xs font-black text-slate-900 truncate">
                          {dish?.dishName || 'Sin plato'}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-amber-800 block">
                        {dish?.calories || 0} kcal
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        P: {dish?.proteinGrams || 0}g
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Toggle All */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  const allSelected = Object.values(selectedMealsForDiary).every(Boolean);
                  setSelectedMealsForDiary({
                    desayuno: !allSelected,
                    almuerzo: !allSelected,
                    cena: !allSelected,
                    snack: !allSelected
                  });
                }}
                className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
              >
                {Object.values(selectedMealsForDiary).every(Boolean) ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </button>

              <div className="text-right text-xs font-black text-slate-800">
                Total a sumar:{' '}
                <span className="text-emerald-700 font-extrabold">
                  {['desayuno', 'almuerzo', 'cena', 'snack'].reduce((acc, slot) => {
                    if (selectedMealsForDiary[slot as keyof typeof selectedMealsForDiary]) {
                      const d = activeDay[slot as keyof DayPlan] as RecommendedDish;
                      return acc + (d?.calories || 0);
                    }
                    return acc;
                  }, 0)}{' '}
                  kcal
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDiarySelectModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSelectedMealsToDiary}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar Seleccionados en Diario</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SWAP / ADD DISH MODAL (4 TABS: MIS ESCANEOS, SUPERMERCADO, RECETAS, CATÁLOGO, MANUAL) */}
      {showSwapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white border border-emerald-100 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl my-8">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                  {weeklyPlan[showSwapModal.dayIdx]?.dayName} • {showSwapModal.mealType.toUpperCase()}
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Asignar Plato a este Momento del Día
                </h3>
              </div>
              <button onClick={() => setShowSwapModal(null)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Segmented Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto text-xs font-extrabold no-scrollbar">
              <button
                type="button"
                onClick={() => setSwapModalTab('scans')}
                className={`py-2 px-3 rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  swapModalTab === 'scans'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white/80'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Mis Escaneos ({loggedMeals.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSwapModalTab('supermarket')}
                className={`py-2 px-3 rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  swapModalTab === 'supermarket'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white/80'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Supermercado ({savedScans.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSwapModalTab('recipes')}
                className={`py-2 px-3 rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  swapModalTab === 'recipes'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white/80'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Recetas Guardadas ({savedCustomRecipes.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setSwapModalTab('catalog')}
                className={`py-2 px-3 rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  swapModalTab === 'catalog'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white/80'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Catálogo BEDCA</span>
              </button>

              <button
                type="button"
                onClick={() => setSwapModalTab('custom')}
                className={`py-2 px-3 rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  swapModalTab === 'custom'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white/80'
                }`}
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Crear Manual</span>
              </button>
            </div>

            {/* Search Input (except on custom form tab) */}
            {swapModalTab !== 'custom' && (
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={swapSearchQuery}
                  onChange={e => setSwapSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, ingrediente o plato..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            )}

            {/* Tab 1: MIS ESCANEOS DE FOTOS */}
            {swapModalTab === 'scans' && (
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {filteredScans.length === 0 ? (
                  <div className="py-8 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-4">
                    <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700">
                        {loggedMeals.length === 0 ? 'Aún no has registrado platos con el Escáner' : 'No se encontraron escaneos con esa búsqueda'}
                      </p>
                      <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                        Toma fotos a tus platos en la pestaña Escáner para guardarlos y poder programarlos aquí en cualquier momento.
                      </p>
                    </div>
                    {onNavigateToScan && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowSwapModal(null);
                          onNavigateToScan();
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Ir al Escáner con Cámara
                      </button>
                    )}
                  </div>
                ) : (
                  filteredScans.map(meal => {
                    const dish = mealAnalysisToRecommendedDish(meal);
                    return (
                      <div
                        key={meal.id}
                        onClick={() => handleAssignDishToSlot(showSwapModal.dayIdx, showSwapModal.mealType, dish)}
                        className="p-3 bg-slate-50 hover:bg-emerald-50/80 rounded-2xl border border-slate-200 hover:border-emerald-300 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {meal.imageUri ? (
                            <img
                              src={meal.imageUri}
                              alt={meal.dishName}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                              <Camera className="w-6 h-6 text-emerald-700" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-950 truncate">
                              {meal.dishName}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {meal.description || 'Plato escaneado con cámara'}
                            </p>
                            <span className="text-[10px] text-slate-400 font-medium">
                              Escaneado el {new Date(meal.timestamp).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-emerald-700 block">
                            {meal.calories} kcal
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold block">
                            P: {meal.proteinGrams}g | C: {meal.carbsGrams}g | G: {meal.fatGrams}g
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 group-hover:underline">
                            Seleccionar →
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Tab 2: SUPERMERCADO */}
            {swapModalTab === 'supermarket' && (
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {filteredSupermarket.length === 0 ? (
                  <div className="py-8 text-center space-y-2 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-4">
                    <ShoppingBag className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">No hay productos de supermercado guardados</p>
                    <p className="text-[11px] text-slate-500">
                      Escanea códigos de barras o productos en el supermercado para agregarlos a tu galería y plan.
                    </p>
                  </div>
                ) : (
                  filteredSupermarket.map(prod => {
                    const dish = supermarketProductToRecommendedDish(prod);
                    return (
                      <div
                        key={prod.id}
                        onClick={() => handleAssignDishToSlot(showSwapModal.dayIdx, showSwapModal.mealType, dish)}
                        className="p-3 bg-slate-50 hover:bg-emerald-50/80 rounded-2xl border border-slate-200 hover:border-emerald-300 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1.5 py-0.5 text-[9px] font-black rounded flex items-center gap-1 ${
                              prod.verdict === 'excelente'
                                ? 'bg-emerald-100 text-emerald-800'
                                : prod.verdict === 'ocasional'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                prod.verdict === 'excelente'
                                  ? 'bg-emerald-500'
                                  : prod.verdict === 'ocasional'
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`} />
                              <span>{prod.verdict === 'excelente' ? 'Semáforo Verde' : prod.verdict === 'ocasional' ? 'Semáforo Ámbar' : 'Semáforo Rojo'}</span>
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {prod.brand || 'Supermercado'}
                            </span>
                          </div>
                          <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-950 truncate mt-0.5">
                            {prod.productName}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {prod.verdictReason}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-amber-800 block">
                            {prod.calories100g} kcal / 100g
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 group-hover:underline">
                            Seleccionar →
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Tab 3: RECETAS GUARDADAS */}
            {swapModalTab === 'recipes' && (
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {filteredRecipes.length === 0 ? (
                  <div className="py-8 text-center space-y-2 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-4">
                    <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">No hay recetas personalizadas guardadas</p>
                    <p className="text-[11px] text-slate-500">
                      Guarda recetas generadas desde la pestaña Explorar o créalas aquí en la pestaña "Crear Manual".
                    </p>
                  </div>
                ) : (
                  filteredRecipes.map(recipe => (
                    <div
                      key={recipe.id}
                      onClick={() => handleAssignDishToSlot(showSwapModal.dayIdx, showSwapModal.mealType, recipe)}
                      className="p-3 bg-slate-50 hover:bg-emerald-50/80 rounded-2xl border border-slate-200 hover:border-emerald-300 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-950 truncate">
                          {recipe.dishName}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {recipe.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-emerald-700 block">
                          {recipe.calories} kcal
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold block">
                          P: {recipe.proteinGrams}g | C: {recipe.carbsGrams}g | G: {recipe.fatGrams}g
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 group-hover:underline">
                          Seleccionar →
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 4: CATÁLOGO MEDITERRÁNEO OFICIAL */}
            {swapModalTab === 'catalog' && (
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {filteredCatalog.map((d: RecommendedDish) => (
                  <div
                    key={d.id}
                    onClick={() => handleAssignDishToSlot(showSwapModal.dayIdx, showSwapModal.mealType, d)}
                    className="p-3 bg-slate-50 hover:bg-emerald-50/80 rounded-2xl border border-slate-200 hover:border-emerald-300 cursor-pointer transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 group-hover:text-emerald-950">{d.dishName}</span>
                      <span className="text-xs font-bold text-emerald-700">{d.calories} kcal</span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-1">{d.description}</p>
                    <div className="text-[10px] text-slate-500 font-semibold flex items-center justify-between">
                      <span>Proteína: {d.proteinGrams}g | Carbs: {d.carbsGrams}g | Grasas: {d.fatGrams}g</span>
                      <span className="text-emerald-800 font-bold group-hover:underline">Seleccionar →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 5: CREAR PLATO MANUAL */}
            {swapModalTab === 'custom' && (
              <form onSubmit={handleCreateAndAssignCustomDish} className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Nombre del Plato</label>
                  <input
                    type="text"
                    value={customNewDish.dishName}
                    onChange={e => setCustomNewDish(p => ({ ...p, dishName: e.target.value }))}
                    required
                    placeholder="ej. Tostada de Jamón Ibérico y Aceite de Oliva"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Descripción breve</label>
                  <input
                    type="text"
                    value={customNewDish.description}
                    onChange={e => setCustomNewDish(p => ({ ...p, description: e.target.value }))}
                    placeholder="ej. Con pan integral de masa madre y tomate natural rallado"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                    <span className="text-[10px] font-bold text-amber-800 block">Calorías</span>
                    <input
                      type="number"
                      min={0}
                      value={customNewDish.calories}
                      onChange={e => setCustomNewDish(p => ({ ...p, calories: Number(e.target.value) }))}
                      className="w-full px-2 py-1 bg-white border border-amber-300 rounded text-xs font-bold text-amber-900"
                    />
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 block">Proteína (g)</span>
                    <input
                      type="number"
                      min={0}
                      value={customNewDish.proteinGrams}
                      onChange={e => setCustomNewDish(p => ({ ...p, proteinGrams: Number(e.target.value) }))}
                      className="w-full px-2 py-1 bg-white border border-emerald-300 rounded text-xs font-bold text-emerald-900"
                    />
                  </div>
                  <div className="p-2 bg-sky-50 rounded-xl border border-sky-200 space-y-1">
                    <span className="text-[10px] font-bold text-sky-800 block">Carbs (g)</span>
                    <input
                      type="number"
                      min={0}
                      value={customNewDish.carbsGrams}
                      onChange={e => setCustomNewDish(p => ({ ...p, carbsGrams: Number(e.target.value) }))}
                      className="w-full px-2 py-1 bg-white border border-sky-300 rounded text-xs font-bold text-sky-900"
                    />
                  </div>
                  <div className="p-2 bg-rose-50 rounded-xl border border-rose-200 space-y-1">
                    <span className="text-[10px] font-bold text-rose-800 block">Grasas (g)</span>
                    <input
                      type="number"
                      min={0}
                      value={customNewDish.fatGrams}
                      onChange={e => setCustomNewDish(p => ({ ...p, fatGrams: Number(e.target.value) }))}
                      className="w-full px-2 py-1 bg-white border border-rose-300 rounded text-xs font-bold text-rose-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Ingredientes (separados por comas)</label>
                  <input
                    type="text"
                    value={customNewDish.ingredientsText}
                    onChange={e => setCustomNewDish(p => ({ ...p, ingredientsText: e.target.value }))}
                    placeholder="ej. Pan rústico, Tomate, Aceite de oliva virgen extra, Jamón serrano"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-md transition flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Crear y Asignar al Plan</span>
                  </button>
                </div>
              </form>
            )}

            {/* Footer option to clear slot */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleClearSlot(showSwapModal.dayIdx, showSwapModal.mealType)}
                className="text-xs text-rose-700 hover:text-rose-900 font-bold flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 rounded-xl transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Dejar este slot vacío / Sin plato (0 kcal)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSwapModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT DISH MODAL */}
      {editingMealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto print:hidden">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Editar {editingMealModal.mealType.toUpperCase()} ({weeklyPlan[editingMealModal.dayIdx]?.dayName})
                  </h3>
                  <p className="text-[11px] text-slate-500">Modifica los detalles nutricionales y campos del plato</p>
                </div>
              </div>
              <button onClick={() => setEditingMealModal(null)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedDish} className="space-y-4">
              {/* Nombre del plato */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Nombre del Plato</label>
                <input
                  type="text"
                  value={editForm.dishName}
                  onChange={e => setEditForm(p => ({ ...p, dishName: e.target.value }))}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  placeholder="ej. Ensalada de Quinoa y Salmón"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Descripción / Preparación</label>
                <textarea
                  value={editForm.description}
                  onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  placeholder="Breve detalle del plato o modo de servir..."
                />
              </div>

              {/* Grid de Calorías y Macronutrientes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Información Nutricional (por ración)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-amber-800 block">Calorías (kcal)</span>
                    <input
                      type="number"
                      min={0}
                      value={editForm.calories}
                      onChange={e => setEditForm(p => ({ ...p, calories: Number(e.target.value) }))}
                      className="w-full px-2 py-1 bg-white border border-amber-300 rounded-lg text-xs font-extrabold text-amber-900 focus:outline-none"
                    />
                  </div>

                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 block">Proteína (g)</span>
                    <input
                      type="number"
                      min={0}
                      value={editForm.proteinGrams}
                      onChange={e => setEditForm(p => ({ ...p, proteinGrams: Number(e.target.value) }))}
                      className="w-full px-2 py-1 bg-white border border-emerald-300 rounded-lg text-xs font-extrabold text-emerald-900 focus:outline-none"
                    />
                  </div>

                  <div className="p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-blue-800 block">Carbohidratos (g)</span>
                    <input
                      type="number"
                      min={0}
                      value={editForm.carbsGrams}
                      onChange={e => setEditForm(p => ({ ...p, carbsGrams: Number(e.target.value) }))}
                      className="w-full px-2 py-1 bg-white border border-blue-300 rounded-lg text-xs font-extrabold text-blue-900 focus:outline-none"
                    />
                  </div>

                  <div className="p-2.5 bg-rose-50/70 border border-rose-200/80 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-rose-800 block">Grasas (g)</span>
                    <input
                      type="number"
                      min={0}
                      value={editForm.fatGrams}
                      onChange={e => setEditForm(p => ({ ...p, fatGrams: Number(e.target.value) }))}
                      className="w-full px-2 py-1 bg-white border border-rose-300 rounded-lg text-xs font-extrabold text-rose-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Tiempo de preparación e Ingredientes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-700 block">Prep. (minutos)</label>
                  <input
                    type="number"
                    min={1}
                    value={editForm.prepTimeMinutes}
                    onChange={e => setEditForm(p => ({ ...p, prepTimeMinutes: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">Ingredientes (separados por comas)</label>
                  <input
                    type="text"
                    value={editForm.ingredientsText}
                    onChange={e => setEditForm(p => ({ ...p, ingredientsText: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="ej. Espinacas, Aceite de Oliva, Salmón, Chía"
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMealModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT-ONLY OFFICIAL CLINICAL FORMAT (Hidden on screen, shown when printing) */}
      <div className="hidden print:block p-8 space-y-6 text-slate-900 bg-white">
        {/* Print Header */}
        <div className="border-b-2 border-emerald-600 pb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">TuNutriLens AI — Plan Nutricional Semanal</h1>
            <p className="text-xs text-slate-600 font-medium">
              Prescripción Alimentaria Auditada con BEDCA (Agencia Española de Seguridad Alimentaria) y USDA
            </p>
          </div>
          <div className="text-right text-xs font-mono text-slate-500">
            <div>Fecha: {new Date().toLocaleDateString('es-ES')}</div>
            <div>Enfoque: {selectedPreset}</div>
          </div>
        </div>

        {/* Patient Profile Targets Box */}
        <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl grid grid-cols-4 gap-4 text-center text-xs">
          <div>
            <strong className="block text-slate-500 uppercase text-[9px]">Calorías Objetivo</strong>
            <span className="text-base font-black text-slate-900">{customTargets.dailyCalories} kcal/día</span>
          </div>
          <div>
            <strong className="block text-slate-500 uppercase text-[9px]">Proteínas</strong>
            <span className="text-base font-black text-slate-900">{customTargets.proteinGrams} g/día</span>
          </div>
          <div>
            <strong className="block text-slate-500 uppercase text-[9px]">Carbohidratos</strong>
            <span className="text-base font-black text-slate-900">{customTargets.carbsGrams} g/día</span>
          </div>
          <div>
            <strong className="block text-slate-500 uppercase text-[9px]">Grasas Saludables</strong>
            <span className="text-base font-black text-slate-900">{customTargets.fatGrams} g/día</span>
          </div>
        </div>

        {/* 7-DAY MATRIX TABLE */}
        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            Programación de Menús Diarios (Lunes a Domingo)
          </h2>

          <table className="w-full text-xs text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                <th className="p-2 border-r border-slate-300">Día</th>
                <th className="p-2 border-r border-slate-300">Desayuno</th>
                <th className="p-2 border-r border-slate-300">Almuerzo</th>
                <th className="p-2 border-r border-slate-300">Cena</th>
                <th className="p-2 border-r border-slate-300">Snack</th>
                <th className="p-2 text-center">Calorías Total</th>
              </tr>
            </thead>
            <tbody>
              {weeklyPlan.map(day => {
                const stats = calculateDayStats(day);
                return (
                  <tr key={day.dayName} className="border-b border-slate-200">
                    <td className="p-2 font-black bg-slate-50 border-r border-slate-300">{day.dayName}</td>
                    <td className="p-2 border-r border-slate-200">
                      <strong>{day.desayuno?.dishName || 'Sin plato'}</strong>
                      <div className="text-[10px] text-slate-600">{day.desayuno?.calories || 0} kcal • P:{day.desayuno?.proteinGrams || 0}g</div>
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <strong>{day.almuerzo?.dishName || 'Sin plato'}</strong>
                      <div className="text-[10px] text-slate-600">{day.almuerzo?.calories || 0} kcal • P:{day.almuerzo?.proteinGrams || 0}g</div>
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <strong>{day.cena?.dishName || 'Sin plato'}</strong>
                      <div className="text-[10px] text-slate-600">{day.cena?.calories || 0} kcal • P:{day.cena?.proteinGrams || 0}g</div>
                    </td>
                    <td className="p-2 border-r border-slate-200">
                      <strong>{day.snack?.dishName || 'Sin plato'}</strong>
                      <div className="text-[10px] text-slate-600">{day.snack?.calories || 0} kcal • P:{day.snack?.proteinGrams || 0}g</div>
                    </td>
                    <td className="p-2 text-center font-bold text-slate-900 bg-slate-50">
                      {stats.totalCal} kcal
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PRINTED GROCERY LIST */}
        <div className="space-y-2 pt-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            Lista de la Compra Semanal Resumida
          </h2>

          <div className="grid grid-cols-2 gap-4 text-xs">
            {Object.entries(groceryList).map(([cat, items]) => {
              if (items.length === 0) return null;
              return (
                <div key={cat} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <strong className="block text-[11px] font-bold text-slate-900 mb-1">{cat}:</strong>
                  <div className="text-[10px] text-slate-700 leading-relaxed">
                    {items.join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Official Footer */}
        <div className="pt-6 border-t border-slate-300 text-[10px] text-slate-500 flex justify-between">
          <span>TuNutriLens AI — Informe Clínico Apto para Consulta Nutricional</span>
          <span>Basado en BEDCA (AESAN) & USDA FoodData Central (Dominio Público)</span>
        </div>
      </div>

    </div>
  );
};
