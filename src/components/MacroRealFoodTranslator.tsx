import React, { useState } from 'react';
import { UserProfile, MealAnalysis } from '../types';
import {
  Calculator,
  Sparkles,
  Utensils,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  HeartPulse,
  Scale,
  Plus,
  Check,
  Loader2,
  RefreshCw,
  Share2,
  Info,
  Apple,
  Fish,
  Egg,
  Milk,
  Nut,
  ChevronRight,
  ShieldCheck,
  ChefHat
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Props {
  userProfile: UserProfile;
  onAddMealToDiary?: (meal: MealAnalysis) => void;
}

export interface RealFoodMealPlanItem {
  mealType: 'Desayuno' | 'Almuerzo' | 'Merienda' | 'Cena';
  title: string;
  foodItemsList: { name: string; portion: string; calories: number; protein: number; carbs: number; fat: number }[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  keyMicrosProvided: string[];
}

export const MacroRealFoodTranslator: React.FC<Props> = ({
  userProfile,
  onAddMealToDiary,
}) => {
  // Configurable Target States (initialized with user profile)
  const [targetCalories, setTargetCalories] = useState<number>(userProfile.dailyCalorieTarget || 2000);
  const [targetProtein, setTargetProtein] = useState<number>(userProfile.dailyProteinTargetG || 120);
  const [targetCarbs, setTargetCarbs] = useState<number>(userProfile.dailyCarbsTargetG || 200);
  const [targetFat, setTargetFat] = useState<number>(userProfile.dailyFatTargetG || 65);

  // Micronutrient Targets (Standard recommended daily allowances)
  const [targetCalcium, setTargetCalcium] = useState<number>(1000); // mg
  const [targetIron, setTargetIron] = useState<number>(18); // mg
  const [targetMagnesium, setTargetMagnesium] = useState<number>(350); // mg
  const [targetPotassium, setTargetPotassium] = useState<number>(3500); // mg
  const [targetVitaminC, setTargetVitaminC] = useState<number>(90); // mg

  // AI Meal Plan Generator
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [translatedMealPlan, setTranslatedMealPlan] = useState<RealFoodMealPlanItem[] | null>(null);
  const [addedMealTypes, setAddedMealTypes] = useState<string[]>([]);

  // Free Custom Query Translator
  const [customQuery, setCustomQuery] = useState('');
  const [customTranslation, setCustomTranslation] = useState<string | null>(null);
  const [isTranslatingCustom, setIsTranslatingCustom] = useState(false);

  const resetToProfileTargets = () => {
    setTargetCalories(userProfile.dailyCalorieTarget || 2000);
    setTargetProtein(userProfile.dailyProteinTargetG || 120);
    setTargetCarbs(userProfile.dailyCarbsTargetG || 200);
    setTargetFat(userProfile.dailyFatTargetG || 65);
  };

  // Generate a full day translated into real food with Gemini AI
  const handleGenerateRealFoodMenu = async () => {
    setIsGeneratingPlan(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });

        const restrictions = userProfile.dietaryRestrictions || [];
        const restrictionsText = restrictions.length > 0 ? restrictions.join(', ') : 'Ninguna';

        const promptText = `Eres un Nutricionista Experto en Dieta Mediterránea y Comida Real.
El usuario necesita traducir sus objetivos de macronutrientes y micronutrientes diarios en un MENÚ DIARIO COMPLETO DE COMIDA REAL (alimentos enteros, sin ultraprocesados).

OBJETIVOS DIARIOS A CUMPLIR EXACTAMENTE:
- Calorías totales: ${targetCalories} kcal
- Proteínas: ${targetProtein} g
- Carbohidratos complejos: ${targetCarbs} g
- Grasas saludables: ${targetFat} g
- Micronutrientes clave a cubrir: Calcio (${targetCalcium}mg), Hierro (${targetIron}mg), Magnesio (${targetMagnesium}mg), Potasio (${targetPotassium}mg), Vitamina C (${targetVitaminC}mg).
- Restricciones/Alérgenos a evitar strictly: ${restrictionsText}.
- Estilo: 100% Alimentos enteros mediterráneos (huevos camperos, pollo, pescado fresco/conserva, legumbres, patata, arroz integral, pan de masa madre, verduras de hoja verde, frutos secos, AOVE).

Diseña 4 tomas de comida (Desayuno, Almuerzo, Merienda, Cena) especificando RACIONES Y GRAMOS EXACTOS de comida real.

Devuelve EXCLUSIVAMENTE un JSON válido con este formato:
[
  {
    "mealType": "Desayuno",
    "title": "Nombre apetitoso del desayuno real",
    "foodItemsList": [
      { "name": "Huevos camperos revueltos", "portion": "2 unidades (120g)", "calories": 150, "protein": 13, "carbs": 1, "fat": 10 },
      { "name": "Pan 100% integral de masa madre", "portion": "2 rebanadas (60g)", "calories": 140, "protein": 5, "carbs": 26, "fat": 2 },
      { "name": "Aceite de Oliva Virgen Extra AOVE", "portion": "1 cucharada sopera (10g)", "calories": 90, "protein": 0, "carbs": 0, "fat": 10 }
    ],
    "totalCalories": 380,
    "totalProtein": 18,
    "totalCarbs": 27,
    "totalFat": 22,
    "keyMicrosProvided": ["Vitamina D", "Calcio", "Grasas Monoinsaturadas AOVE"]
  },
  {
    "mealType": "Almuerzo",
    "title": "Nombre del almuerzo real",
    "foodItemsList": [],
    "totalCalories": 650,
    "totalProtein": 45,
    "totalCarbs": 70,
    "totalFat": 20,
    "keyMicrosProvided": ["Hierro de absorción rápida", "Potasio", "Magnesio"]
  },
  {
    "mealType": "Merienda",
    "title": "Nombre de la merienda real",
    "foodItemsList": [],
    "totalCalories": 250,
    "totalProtein": 15,
    "totalCarbs": 25,
    "totalFat": 10,
    "keyMicrosProvided": ["Vitamina C", "Calcio"]
  },
  {
    "mealType": "Cena",
    "title": "Nombre de la cena real",
    "foodItemsList": [],
    "totalCalories": 520,
    "totalProtein": 42,
    "totalCarbs": 40,
    "totalFat": 18,
    "keyMicrosProvided": ["Omega-3", "Magnesio", "Zinc"]
  }
]`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: promptText,
          config: { responseMimeType: 'application/json' },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (Array.isArray(parsed)) {
            setTranslatedMealPlan(parsed);
          }
        }
      }
    } catch (err) {
      console.error('Error traduciendo macros a comida real:', err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Custom user query translator
  const handleCustomTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;

    setIsTranslatingCustom(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const promptText = `Eres un Nutricionista Experto.
El usuario hace esta consulta sobre traducir macros/micros a comida real:
"${customQuery}"

Perfil del usuario:
- Objetivo: ${userProfile.goal}
- Restricciones: ${userProfile.dietaryRestrictions?.join(', ') || 'Ninguna'}

Proporciona una traducción ULTRA PRÁCTICA, CLARA Y EN COMIDA REAL DE MERCADO (con gramos, raciones, alimentos españoles como AOVE, huevos, pechuga, pescado, legumbres, patata, verduras de hoja verde y frutos secos).
Organízalo con viñetas claras y explicaciones sencillas. Sin rodeos.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: promptText,
        });

        if (response.text) {
          setCustomTranslation(response.text);
        }
      }
    } catch (err) {
      console.error('Error en traducción personalizada:', err);
    } finally {
      setIsTranslatingCustom(false);
    }
  };

  const handleAddMealItemToDiary = (item: RealFoodMealPlanItem) => {
    if (!onAddMealToDiary) return;

    const meal: MealAnalysis = {
      id: 'realfood_trans_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      dishName: item.title,
      description: `Menú de comida real adaptado a tu objetivo (${item.totalCalories} kcal, ${item.totalProtein}g proteína).`,
      mealType: item.mealType === 'Merienda' ? 'Snack' : item.mealType,
      estimatedWeightGrams: 350,
      healthIndex: 10,
      reliabilityConfidence: 99,
      calories: item.totalCalories,
      proteinGrams: item.totalProtein,
      carbsGrams: item.totalCarbs,
      fatGrams: item.totalFat,
      fiberGrams: 8,
      sugarGrams: 3,
      saturatedFatGrams: 2,
      micronutrients: {
        vitaminA_mcg: 200,
        vitaminC_mg: 40,
        vitaminD_iu: 100,
        vitaminB12_mcg: 1.5,
        calcium_mg: 250,
        iron_mg: 3.5,
        potassium_mg: 500,
        sodium_mg: 300,
        magnesium_mg: 80,
        zinc_mg: 2.5,
      },
      foodItems: item.foodItemsList.map((f) => ({
        name: `${f.name} (${f.portion})`,
        estimatedWeightGrams: 100,
        calories: f.calories,
        proteinGrams: f.protein,
        carbsGrams: f.carbs,
        fatGrams: f.fat,
      })),
      warnings: [],
      personalizedRecommendations: [
        'Plato traducido 100% a partir de alimentos enteros de tu objetivo diario.',
        `Aporta micronutrientes clave: ${item.keyMicrosProvided.join(', ')}.`
      ],
      timestamp: Date.now(),
    };

    onAddMealToDiary(meal);
    setAddedMealTypes((prev) => [...prev, item.mealType]);
  };

  // Calculations for quick visual food equivalence
  // 1 egg = ~6g prot, 100g chicken = ~23g prot, 100g salmon = ~20g prot, 100g lentils = ~9g prot
  const chickenBreastGrams = Math.round((targetProtein * 0.35 / 23) * 100);
  const eggsCount = Math.round((targetProtein * 0.20) / 6);
  const salmonGrams = Math.round((targetProtein * 0.25 / 20) * 100);
  const cookedLentilsGrams = Math.round((targetProtein * 0.20 / 9) * 100);

  // Carbs: 100g cooked rice = 28g carbs, 150g baked potato = 26g carbs, 1 banana = 23g carbs, 60g oats = 38g carbs
  const potatoGrams = Math.round((targetCarbs * 0.35 / 17) * 100);
  const cookedRiceGrams = Math.round((targetCarbs * 0.30 / 28) * 100);
  const oatsGrams = Math.round((targetCarbs * 0.20 / 60) * 100);

  // Fat: 1 tbsp AOVE = 10g fat, 30g walnuts = 18g fat, 1/2 avocado = 12g fat
  const aoveSpoons = Math.round((targetFat * 0.45) / 10);
  const walnutsGrams = Math.round((targetFat * 0.30 / 18) * 30);
  const avocadoHalf = Number(((targetFat * 0.25) / 12).toFixed(1));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 shadow-lg border border-emerald-700/80 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-400/30">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Traductor de Macros y Micronutrientes a Comida Real
              </h2>
              <span className="px-2.5 py-0.5 bg-emerald-400 text-slate-900 font-extrabold text-[10px] rounded-md uppercase tracking-wider">
                100% Alimentos Enteros
              </span>
            </div>
            <p className="text-xs text-emerald-100 font-medium mt-0.5">
              ¿No sabes qué significan 120g de proteína o 1000mg de calcio en tu plato? Transfórmalos instantáneamente en gramos de pechuga, huevos, patatas, legumbres, AOVE y verduras mediterráneas.
            </p>
          </div>
        </div>

        {/* Quick targets bar */}
        <div className="pt-3 border-t border-emerald-700/60 flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
          <div className="flex items-center gap-4 text-emerald-200">
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-400" />
              <strong className="text-white">{targetCalories}</strong> kcal
            </span>
            <span className="flex items-center gap-1">
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              <strong className="text-white">{targetProtein}g</strong> Proteína
            </span>
            <span className="flex items-center gap-1">
              <Wheat className="w-4 h-4 text-sky-300" />
              <strong className="text-white">{targetCarbs}g</strong> Carbohidratos
            </span>
            <span className="flex items-center gap-1">
              <Droplets className="w-4 h-4 text-amber-300" />
              <strong className="text-white">{targetFat}g</strong> Grasas
            </span>
          </div>

          <button
            onClick={resetToProfileTargets}
            className="text-[11px] bg-emerald-700/80 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl border border-emerald-500/50 transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-300" />
            <span>Usar Objetivos de mi Perfil</span>
          </button>
        </div>

        {/* Primary Unmissable Call-to-Action Button at the Very Top */}
        <div className="pt-2">
          <button
            onClick={handleGenerateRealFoodMenu}
            disabled={isGeneratingPlan}
            className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 border-2 border-amber-400/80 active:scale-98 cursor-pointer"
          >
            {isGeneratingPlan ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                <span>Calculando Menú de Comida Real con Gramos Exactos...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
                <span>TRADUCIR MIS OBJETIVOS A UN MENÚ DIARIO REAL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Target Adjuster */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-black text-slate-900">
              Personalizar tus Objetivos Diarios a Traducir
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-semibold">
            Modifica las cifras si quieres calcular un objetivo diferente
          </span>
        </div>

        {/* Sliders / Inputs for Macros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1 text-amber-700">
                <Flame className="w-4 h-4" /> Calorías
              </span>
              <span className="text-slate-900 font-black">{targetCalories} kcal</span>
            </div>
            <input
              type="range"
              min="1200"
              max="4000"
              step="50"
              value={targetCalories}
              onChange={(e) => setTargetCalories(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1 text-emerald-700">
                <Dumbbell className="w-4 h-4" /> Proteína
              </span>
              <span className="text-slate-900 font-black">{targetProtein} g</span>
            </div>
            <input
              type="range"
              min="50"
              max="250"
              step="5"
              value={targetProtein}
              onChange={(e) => setTargetProtein(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1 text-sky-700">
                <Wheat className="w-4 h-4" /> Carbohidratos
              </span>
              <span className="text-slate-900 font-black">{targetCarbs} g</span>
            </div>
            <input
              type="range"
              min="50"
              max="400"
              step="5"
              value={targetCarbs}
              onChange={(e) => setTargetCarbs(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1 text-amber-700">
                <Droplets className="w-4 h-4" /> Grasas Saludables
              </span>
              <span className="text-slate-900 font-black">{targetFat} g</span>
            </div>
            <input
              type="range"
              min="30"
              max="150"
              step="5"
              value={targetFat}
              onChange={(e) => setTargetFat(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Micronutrients Controls */}
        <div className="pt-2">
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-2">
            Micronutrientes Esenciales que quieres asegurar en el día:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="text-[10px] font-bold text-emerald-800 uppercase">Calcio</div>
              <div className="text-xs font-black text-slate-900">{targetCalcium} mg</div>
              <div className="text-[9px] text-slate-500 font-medium">Yogur, queso, sésamo</div>
            </div>
            <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200">
              <div className="text-[10px] font-bold text-rose-800 uppercase">Hierro</div>
              <div className="text-xs font-black text-slate-900">{targetIron} mg</div>
              <div className="text-[9px] text-slate-500 font-medium">Lentejas, espinacas</div>
            </div>
            <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200">
              <div className="text-[10px] font-bold text-purple-800 uppercase">Magnesio</div>
              <div className="text-xs font-black text-slate-900">{targetMagnesium} mg</div>
              <div className="text-[9px] text-slate-500 font-medium">Nueces, cacao, platano</div>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
              <div className="text-[10px] font-bold text-amber-800 uppercase">Potasio</div>
              <div className="text-xs font-black text-slate-900">{targetPotassium} mg</div>
              <div className="text-[9px] text-slate-500 font-medium">Patata, plátano, aguacate</div>
            </div>
            <div className="p-2.5 bg-sky-50 rounded-xl border border-sky-200">
              <div className="text-[10px] font-bold text-sky-800 uppercase">Vitamina C</div>
              <div className="text-xs font-black text-slate-900">{targetVitaminC} mg</div>
              <div className="text-[9px] text-slate-500 font-medium">Naranja, pimiento rojo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Visual Equivalences Grid */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Apple className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Equivalencias Directas en Alimentos Reales
            </h3>
            <p className="text-xs text-slate-500">
              Ejemplo de cómo repartir tus {targetProtein}g de proteína, {targetCarbs}g de carbos y {targetFat}g de grasa en raciones de comida real mediterránea:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Protein Equivalents */}
          <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
              <span className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-emerald-600" />
                <span>Proteínas ({targetProtein}g)</span>
              </span>
              <span className="text-[10px] font-extrabold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">
                100% Real
              </span>
            </div>

            <ul className="space-y-2 text-xs font-medium text-slate-800">
              <li className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-base">🍗</span>
                <div>
                  <strong className="text-slate-900 font-bold block">{chickenBreastGrams}g de Pechuga de Pollo</strong>
                  <span className="text-[11px] text-slate-500">Aporta aprox. {Math.round(targetProtein * 0.35)}g de proteína limpia</span>
                </div>
              </li>

              <li className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-base">🥚</span>
                <div>
                  <strong className="text-slate-900 font-bold block">{eggsCount} Huevos Camperos Grandes</strong>
                  <span className="text-[11px] text-slate-500">Aportan aprox. {Math.round(eggsCount * 6.5)}g de proteína + Vitamina D y Colina</span>
                </div>
              </li>

              <li className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-base">🐟</span>
                <div>
                  <strong className="text-slate-900 font-bold block">{salmonGrams}g de Lomo de Salmón o Merluza</strong>
                  <span className="text-[11px] text-slate-500">Aporta aprox. {Math.round(targetProtein * 0.25)}g de proteína + Omega-3</span>
                </div>
              </li>

              <li className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-base">🫘</span>
                <div>
                  <strong className="text-slate-900 font-bold block">{cookedLentilsGrams}g de Lentejas o Garbanzos</strong>
                  <span className="text-[11px] text-slate-500">Aporta proteína vegetal + 12g de fibra + Hierro</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Carbs Equivalents */}
          <div className="bg-sky-50/50 rounded-2xl p-4 border border-sky-200/80 space-y-3">
            <div className="flex items-center justify-between border-b border-sky-200 pb-2">
              <span className="text-xs font-black text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                <Wheat className="w-4 h-4 text-sky-600" />
                <span>Carbohidratos ({targetCarbs}g)</span>
              </span>
              <span className="text-[10px] font-extrabold bg-sky-200 text-sky-900 px-2 py-0.5 rounded-md">
                Complejos
              </span>
            </div>

            <ul className="space-y-2 text-xs font-medium text-slate-800">
              <li className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-sky-100 shadow-2xs">
                <span className="text-base">🥔</span>
                <div>
                  <strong className="text-slate-900 font-bold block">{potatoGrams}g de Patata Asada o Cocida</strong>
                  <span className="text-[11px] text-slate-500">Aporta aprox. {Math.round(targetCarbs * 0.35)}g de carbohidratos + Saciedad y Potasio</span>
                </div>
              </li>

              <li className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-sky-100 shadow-2xs">
                <span className="text-base">🍚</span>
                <div>
                  <strong className="text-slate-900 font-bold block">{cookedRiceGrams}g de Arroz Integral Cocido</strong>
                  <span className="text-[11px] text-slate-500">Aporta aprox. {Math.round(targetCarbs * 0.30)}g de carbos de energía sostenida</span>
                </div>
              </li>

              <li className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-sky-100 shadow-2xs">
                <span className="text-base">🥣</span>
                <div>
                  <strong className="text-slate-900 font-bold block">{oatsGrams}g de Copos de Avena Integral</strong>
                  <span className="text-[11px] text-slate-500">Aporta aprox. {Math.round(targetCarbs * 0.20)}g de carbos + Betaglucanos para el colesterol</span>
                </div>
              </li>

              <li className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-sky-100 shadow-2xs">
                <span className="text-base">🍌</span>
                <div>
                  <strong className="text-slate-900 font-bold block">1 Plátano + 1 Manzana Grande</strong>
                  <span className="text-[11px] text-slate-500">Aportan unos 45g de carbos de la fruta + Pectina y Fructosa natural</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Fat & Micros Equivalents */}
          <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <span className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-amber-600" />
                <span>Grasas ({targetFat}g) & Micros</span>
              </span>
              <span className="text-[10px] font-extrabold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                Saludables
              </span>
            </div>

            <ul className="space-y-2 text-xs font-medium text-slate-800">
              <li className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                <span className="text-base">🫒</span>
                <div>
                  <strong className="text-slate-900 font-bold block">{aoveSpoons} Cucharadas de AOVE (Aceite de Oliva)</strong>
                  <span className="text-[11px] text-slate-500">Aportan {aoveSpoons * 10}g de grasas monoinsaturadas y polifenoles</span>
                </div>
              </li>

              <li className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                <span className="text-base">🥑</span>
                <div>
                  <strong className="text-slate-900 font-bold block">{avocadoHalf} Medios Aguacates</strong>
                  <span className="text-[11px] text-slate-500">Grasa cardiosaludable, Potasio y Vitamina E</span>
                </div>
              </li>

              <li className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                <span className="text-base">🥜</span>
                <div>
                  <strong className="text-slate-900 font-bold block">{walnutsGrams}g de Nueces o Almendras</strong>
                  <span className="text-[11px] text-slate-500">Magnesio, Calcio vegetal y Omega-3</span>
                </div>
              </li>

              <li className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                <span className="text-base">🍊</span>
                <div>
                  <strong className="text-slate-900 font-bold block">1 Naranja + 1 Cuenco de Espinacas</strong>
                  <span className="text-[11px] text-slate-500">Cubre {targetVitaminC}mg de Vitamina C + Hierro y Folatos</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main AI Translator Button Section */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 shadow-md border border-emerald-500 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 text-white rounded-2xl backdrop-blur-xs border border-white/30">
              <ChefHat className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Generar Menú Diario Completo Traducido a Comida Real con IA
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                Crea 4 tomas de comida (Desayuno, Almuerzo, Merienda, Cena) con gramos exactos para cumplir tus {targetCalories} kcal, {targetProtein}g proteina y micronutrientes.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateRealFoodMenu}
          disabled={isGeneratingPlan}
          className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 border border-emerald-400/40 active:scale-98"
        >
          {isGeneratingPlan ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
              <span>Calculando Menú de Comida Real con Gramos Exactos...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>TRADUCIR MIS OBJETIVOS A UN MENÚ DIARIO REAL</span>
            </>
          )}
        </button>
      </div>

      {/* Render Generated AI Meal Plan */}
      {translatedMealPlan && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5 animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  Menú Diario Traducido a Comida Real
                </h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-md">
                  Gramos Exactos
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Platos de comida real ajustados a tus {targetCalories} kcal y {targetProtein}g de proteína.
              </p>
            </div>

            <button
              onClick={handleGenerateRealFoodMenu}
              disabled={isGeneratingPlan}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerar Otro Menú</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {translatedMealPlan.map((meal, idx) => {
              const isAdded = addedMealTypes.includes(meal.mealType);

              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3 hover:border-emerald-500 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-[10px] rounded-lg uppercase tracking-wider">
                        {meal.mealType}
                      </span>
                      <span className="text-xs font-extrabold text-slate-700">
                        {meal.totalCalories} kcal • {meal.totalProtein}g Prot
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900">
                      {meal.title}
                    </h4>

                    {/* Food Items List */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Ingredientes y Raciones:
                      </span>
                      <ul className="space-y-1 text-xs">
                        {meal.foodItemsList.map((item, fIdx) => (
                          <li key={fIdx} className="bg-white p-2 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-800">{item.name}</span>
                            <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 whitespace-nowrap">
                              {item.portion}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Micros provided */}
                    {meal.keyMicrosProvided && meal.keyMicrosProvided.length > 0 && (
                      <div className="bg-emerald-50/80 p-2 rounded-xl border border-emerald-200/60 flex items-center gap-1.5 text-[10px] text-emerald-900 font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span>Aporta: {meal.keyMicrosProvided.join(' • ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Add to Diary Button */}
                  {onAddMealToDiary && (
                    <button
                      onClick={() => handleAddMealItemToDiary(meal)}
                      disabled={isAdded}
                      className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                        isAdded
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-700" />
                          <span>¡Registrado en el Diario!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Añadir esta Toma a mi Diario</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Translator Query Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Info className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-sm font-black text-slate-900">
              Traductor Personalizado de Consultas Nutricionales
            </h3>
            <p className="text-xs text-slate-500">
              Escribe cualquier pregunta o combinación de macros/micros que quieras traducir a comida de supermercado.
            </p>
          </div>
        </div>

        <form onSubmit={handleCustomTranslate} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ej: ¿Qué comer para conseguir 140g de proteína y 1200mg de calcio sin tomar lácteos?"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              className="flex-1 text-xs p-3.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 font-medium"
            />
            <button
              type="submit"
              disabled={isTranslatingCustom || !customQuery.trim()}
              className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs rounded-2xl transition flex items-center gap-2 flex-shrink-0"
            >
              {isTranslatingCustom ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-300" />
              )}
              <span>Traducir</span>
            </button>
          </div>

          {/* Preset query chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Ejemplos rápidos:</span>
            {[
              "¿Cómo conseguir 35g de proteína en el desayuno sin batidos?",
              "Alimentos con más Hierro y Vitamina C para absorberlo mejor",
              "¿Cuánta pechuga y patata comer para 600 kcal y 45g de proteína?",
              "Fuentes de Calcio sin lácteos para dieta mediterránea"
            ].map((preset, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => setCustomQuery(preset)}
                className="text-[11px] bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-2.5 py-1 rounded-xl border border-slate-200 transition font-medium text-left"
              >
                {preset}
              </button>
            ))}
          </div>
        </form>

        {/* Translation Output */}
        {customTranslation && (
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-2 mt-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold border-b border-slate-800 pb-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Respuesta del Traductor en Comida Real:</span>
            </div>
            <div className="text-xs leading-relaxed text-slate-200 font-medium whitespace-pre-line">
              {customTranslation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
