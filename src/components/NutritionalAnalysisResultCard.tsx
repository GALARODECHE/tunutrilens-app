import React, { useState, useRef, useEffect } from 'react';
import { MealAnalysis, FoodItem, DayPlan, mealAnalysisToRecommendedDish } from '../types';
import { RecommendedDish } from '../data/dishesCatalog';
import { AddToWeeklyPlanModal } from './AddToWeeklyPlanModal';
import { HarvardPlateCard } from './HarvardPlateCard';
import {
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  Sparkles,
  Activity,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Leaf,
  Info,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Calculator,
  Camera,
  Upload,
  CalendarDays,
  CheckCircle2,
  RotateCcw,
  Sliders,
  Check,
  PlusCircle,
  Minus,
  UtensilsCrossed,
  Bookmark
} from 'lucide-react';
import { processAndCompressImage } from '../utils/imageCompressor';

interface Props {
  meal: MealAnalysis;
  onSave?: (meal: MealAnalysis) => void;
  onUpdateMeal?: (updatedMeal: MealAnalysis) => void;
  isSaved?: boolean;
  currentWeeklyPlan?: DayPlan[];
  onAddToWeeklyPlan?: (
    dayIndex: number,
    mealType: 'desayuno' | 'almuerzo' | 'cena' | 'snack',
    dish: RecommendedDish
  ) => void;
  onNavigateToWeeklyPlan?: () => void;
  onSaveCustomRecipe?: (recipe: RecommendedDish) => void;
}

// Intelligent nutritional database for manual additions
const estimateNutritionForIngredient = (name: string, grams: number): FoodItem => {
  const n = name.toLowerCase().trim();
  let calPer100g = 110;
  let protPer100g = 5;
  let carbsPer100g = 12;
  let fatPer100g = 3;

  if (n.includes('aceite') || n.includes('aove') || n.includes('oliva')) {
    calPer100g = 884; protPer100g = 0; carbsPer100g = 0; fatPer100g = 100;
  } else if (n.includes('huevo')) {
    calPer100g = 143; protPer100g = 12.6; carbsPer100g = 0.7; fatPer100g = 9.5;
  } else if (n.includes('pan')) {
    calPer100g = 265; protPer100g = 9; carbsPer100g = 49; fatPer100g = 1.5;
  } else if (n.includes('queso')) {
    calPer100g = 300; protPer100g = 20; carbsPer100g = 2; fatPer100g = 24;
  } else if (n.includes('aguacate')) {
    calPer100g = 160; protPer100g = 2; carbsPer100g = 8.5; fatPer100g = 14.7;
  } else if (n.includes('nuez') || n.includes('nueces') || n.includes('almendra') || n.includes('fruto seco')) {
    calPer100g = 650; protPer100g = 15; carbsPer100g = 14; fatPer100g = 65;
  } else if (n.includes('tomate') || n.includes('lechuga') || n.includes('verdura') || n.includes('pepino') || n.includes('espinaca')) {
    calPer100g = 20; protPer100g = 1.2; carbsPer100g = 3.5; fatPer100g = 0.2;
  } else if (n.includes('pollo') || n.includes('pavo') || n.includes('carne')) {
    calPer100g = 165; protPer100g = 31; carbsPer100g = 0; fatPer100g = 3.6;
  } else if (n.includes('atun') || n.includes('atún') || n.includes('salmon') || n.includes('salmón') || n.includes('pescado')) {
    calPer100g = 140; protPer100g = 25; carbsPer100g = 0; fatPer100g = 4.5;
  } else if (n.includes('arroz') || n.includes('pasta') || n.includes('patata') || n.includes('papa')) {
    calPer100g = 130; protPer100g = 2.8; carbsPer100g = 28; fatPer100g = 0.3;
  } else if (n.includes('sal') || n.includes('especias') || n.includes('oregano') || n.includes('orégano') || n.includes('pimienta')) {
    calPer100g = 0; protPer100g = 0; carbsPer100g = 0; fatPer100g = 0;
  }

  const factor = Math.max(0, grams) / 100;
  return {
    name,
    estimatedWeightGrams: grams,
    calories: Math.round(calPer100g * factor),
    proteinGrams: Math.round(protPer100g * factor * 10) / 10,
    carbsGrams: Math.round(carbsPer100g * factor * 10) / 10,
    fatGrams: Math.round(fatPer100g * factor * 10) / 10,
  };
};

const recalculateMealFromItems = (items: FoodItem[], prevMeal: MealAnalysis): MealAnalysis => {
  const totalWeight = items.reduce((acc, i) => acc + (i.estimatedWeightGrams || 0), 0);
  const totalCal = items.reduce((acc, i) => acc + (i.calories || 0), 0);
  const totalProt = items.reduce((acc, i) => acc + (i.proteinGrams || 0), 0);
  const totalCarbs = items.reduce((acc, i) => acc + (i.carbsGrams || 0), 0);
  const totalFat = items.reduce((acc, i) => acc + (i.fatGrams || 0), 0);

  return {
    ...prevMeal,
    foodItems: items,
    estimatedWeightGrams: Math.max(10, Math.round(totalWeight)),
    calories: Math.max(10, Math.round(totalCal)),
    proteinGrams: Math.round(totalProt * 10) / 10,
    carbsGrams: Math.round(totalCarbs * 10) / 10,
    fatGrams: Math.round(totalFat * 10) / 10,
  };
};

export const NutritionalAnalysisResultCard: React.FC<Props> = ({
  meal,
  onSave,
  onUpdateMeal,
  isSaved = false,
  currentWeeklyPlan,
  onAddToWeeklyPlan,
  onNavigateToWeeklyPlan,
  onSaveCustomRecipe,
}) => {
  const [showMicros, setShowMicros] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedToRecipesSuccess, setSavedToRecipesSuccess] = useState(false);
  const [isEditingFullDish, setIsEditingFullDish] = useState(false);
  const [isWeeklyPlanModalOpen, setIsWeeklyPlanModalOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Editable local state
  const [editedMeal, setEditedMeal] = useState<MealAnalysis>(meal);

  // Quick Manual Ingredient Input State
  const [manualIngName, setManualIngName] = useState('');
  const [manualIngGrams, setManualIngGrams] = useState<number>(50);

  // Sync state if meal prop changes
  useEffect(() => {
    setEditedMeal(meal);
  }, [meal]);

  const currentMeal = editedMeal;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const processed = await processAndCompressImage(file, 1200, 0.85);
      const updated = {
        ...editedMeal,
        imageUri: processed.dataUrl,
      };
      setEditedMeal(updated);
      if (onUpdateMeal) onUpdateMeal(updated);
    } catch (err) {
      console.error('Error al procesar la imagen:', err);
    }
  };

  const calories = Math.max(currentMeal.calories, 1);
  const proteinPct = Math.round((currentMeal.proteinGrams * 4 / calories) * 100) || 0;
  const carbsPct = Math.round((currentMeal.carbsGrams * 4 / calories) * 100) || 0;
  const fatPct = Math.round((currentMeal.fatGrams * 9 / calories) * 100) || 0;

  const handleSave = () => {
    if (onSave) {
      onSave(currentMeal);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  // Manual Quick Ingredient Operations
  const handleQuickAddIngredient = (name: string, grams: number) => {
    if (!name.trim() || grams <= 0) return;
    const newItem = estimateNutritionForIngredient(name.trim(), grams);
    const updatedItems = [...(editedMeal.foodItems || []), newItem];
    const newMeal = recalculateMealFromItems(updatedItems, editedMeal);
    setEditedMeal(newMeal);
    if (onUpdateMeal) onUpdateMeal(newMeal);
    setManualIngName('');
    setManualIngGrams(50);
  };

  const handleDeleteIngredientAt = (index: number) => {
    const updatedItems = (editedMeal.foodItems || []).filter((_, i) => i !== index);
    const newMeal = recalculateMealFromItems(updatedItems, editedMeal);
    setEditedMeal(newMeal);
    if (onUpdateMeal) onUpdateMeal(newMeal);
  };

  const handleAdjustIngredientWeight = (index: number, delta: number) => {
    const items = [...(editedMeal.foodItems || [])];
    if (!items[index]) return;
    const currentWeight = items[index].estimatedWeightGrams || 50;
    const newWeight = Math.max(5, currentWeight + delta);
    const recalculatedItem = estimateNutritionForIngredient(items[index].name, newWeight);
    items[index] = recalculatedItem;
    const newMeal = recalculateMealFromItems(items, editedMeal);
    setEditedMeal(newMeal);
    if (onUpdateMeal) onUpdateMeal(newMeal);
  };

  const handleResetToInitialScan = () => {
    setEditedMeal(meal);
    if (onUpdateMeal) onUpdateMeal(meal);
  };

  const quickSuggestedIngredients = [
    { name: 'Aceite de Oliva Virgen Extra (AOVE)', grams: 15, label: '+15g AOVE (+133 kcal)' },
    { name: 'Huevo fresco', grams: 60, label: '+1 Huevo (+85 kcal)' },
    { name: 'Pan de pueblo / barra', grams: 50, label: '+50g Pan (+130 kcal)' },
    { name: 'Queso fresco / semicurado', grams: 30, label: '+30g Queso (+90 kcal)' },
    { name: 'Aguacate maduro', grams: 50, label: '+50g Aguacate (+80 kcal)' },
    { name: 'Nueces / Almendras', grams: 20, label: '+20g Frutos Secos (+130 kcal)' },
    { name: 'Tomate fresco', grams: 100, label: '+100g Tomate (+20 kcal)' },
    { name: 'Pizca de Sal y Especias', grams: 2, label: '+Pizca Sal/Especias' },
  ];

  const handleSaveToRecipes = () => {
    const dish = mealAnalysisToRecommendedDish(currentMeal);
    if (onSaveCustomRecipe) {
      onSaveCustomRecipe(dish);
      setSavedToRecipesSuccess(true);
      setTimeout(() => setSavedToRecipesSuccess(false), 3500);
    }
  };

  return (
    <div className="space-y-4 md:space-y-5 animate-in fade-in duration-300">
      
      {/* Barra de Acciones y Modo Edición */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Análisis Nutricional TuNutriLens</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToInitialScan}
            className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
            title="Restablecer a la detección inicial de la cámara"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restablecer</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditingFullDish(!isEditingFullDish)}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-emerald-200 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditingFullDish ? 'Cerrar Edición General' : 'Editar Nombre & Foto'}</span>
          </button>
        </div>
      </div>

      {/* Formulario Opcional para Editar Nombre y Foto */}
      {isEditingFullDish && (
        <div className="bg-emerald-50/90 rounded-2xl p-4 border border-emerald-300 space-y-4 animate-in fade-in duration-200">
          <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-emerald-700" />
            Editar Nombre, Foto y Tipo de Comida
          </h3>

          <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2">
            <label className="block text-stone-700 font-bold text-xs">Foto del Plato</label>
            <div className="flex items-center gap-3">
              {editedMeal.imageUri ? (
                <img
                  src={editedMeal.imageUri}
                  alt="Foto del plato"
                  className="w-16 h-16 rounded-xl object-cover border border-stone-300 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-stone-100 text-stone-400 flex items-center justify-center shrink-0 border border-dashed border-stone-300">
                  <Camera className="w-6 h-6" />
                </div>
              )}
              <div className="space-y-1">
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{editedMeal.imageUri ? 'Cambiar Foto' : 'Subir Foto'}</span>
                </button>
                {editedMeal.imageUri && (
                  <button
                    type="button"
                    onClick={() => {
                      const upd = { ...editedMeal, imageUri: undefined };
                      setEditedMeal(upd);
                      if (onUpdateMeal) onUpdateMeal(upd);
                    }}
                    className="text-[11px] text-rose-600 hover:underline block font-semibold cursor-pointer"
                  >
                    Quitar foto
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Nombre del Plato</label>
              <input
                type="text"
                value={editedMeal.dishName}
                onChange={(e) => {
                  const upd = { ...editedMeal, dishName: e.target.value };
                  setEditedMeal(upd);
                  if (onUpdateMeal) onUpdateMeal(upd);
                }}
                className="w-full p-2 rounded-lg border border-stone-300 bg-white font-semibold text-stone-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-bold mb-1">Tipo de Comida</label>
              <select
                value={editedMeal.mealType}
                onChange={(e) => {
                  const upd = { ...editedMeal, mealType: e.target.value as any };
                  setEditedMeal(upd);
                  if (onUpdateMeal) onUpdateMeal(upd);
                }}
                className="w-full p-2 rounded-lg border border-stone-300 bg-white font-semibold text-stone-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Desayuno">Desayuno</option>
                <option value="Almuerzo">Almuerzo</option>
                <option value="Cena">Cena</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tarjeta Principal del Plato - Ficha Gourmet */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
                {currentMeal.mealType}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Porción aprox: <strong className="text-stone-800">{currentMeal.estimatedWeightGrams}g</strong>
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight">
              {currentMeal.dishName}
            </h2>
          </div>

          {/* Health Index Badge */}
          <div className="flex items-center gap-2.5 self-start sm:self-center bg-stone-50 px-3.5 py-2 rounded-2xl border border-stone-200">
            <div className="text-right">
              <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Índice Salud</div>
              <div className="text-xs font-bold text-emerald-700">Fiabilidad {currentMeal.reliabilityConfidence}%</div>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-black text-white shadow-xs ${
              currentMeal.healthIndex >= 8 ? 'bg-emerald-600' : currentMeal.healthIndex >= 5 ? 'bg-amber-500' : 'bg-rose-500'
            }`}>
              {currentMeal.healthIndex}/10
            </div>
          </div>
        </div>

        {/* Gastronomic Health Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {proteinPct >= 18 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-50 border border-teal-200/90 text-teal-900 text-xs font-bold shadow-2xs">
              <span>🍗</span>
              <span>Rico en Proteína ({proteinPct}%)</span>
            </span>
          )}
          {currentMeal.saturatedFatGrams <= 3.5 && currentMeal.fatGrams >= 6 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs font-bold shadow-2xs">
              <span>🫒</span>
              <span>Grasas Saludables (AOVE)</span>
            </span>
          )}
          {currentMeal.fiberGrams >= 3.5 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200/90 text-emerald-900 text-xs font-bold shadow-2xs">
              <span>🌾</span>
              <span>Aporte Óptimo de Fibra ({currentMeal.fiberGrams}g)</span>
            </span>
          )}
          {currentMeal.sugarGrams <= 4 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 text-xs font-bold shadow-2xs">
              <span>🍃</span>
              <span>Bajo en Azúcares ({currentMeal.sugarGrams}g)</span>
            </span>
          )}
          {currentMeal.calories <= 480 && currentMeal.healthIndex >= 7 && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-50 border border-sky-200/90 text-sky-900 text-xs font-bold shadow-2xs">
              <span>✨</span>
              <span>Ligero & Digestivo</span>
            </span>
          )}
        </div>

        {currentMeal.description && (
          <p className="text-sm text-stone-600 leading-relaxed font-medium">
            {currentMeal.description}
          </p>
        )}

        {/* Visual Macro Distribution Strip */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-600 mb-1.5">
            <span>Reparto de energía del plato:</span>
            <span className="text-stone-400">Total 100% kcal</span>
          </div>
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-stone-100 p-0.5 border border-stone-200 shadow-inner">
            <div
              style={{ width: `${Math.max(proteinPct, 2)}%` }}
              className="h-full rounded-l-full bg-teal-500 transition-all duration-500"
              title={`Proteína: ${proteinPct}%`}
            />
            <div
              style={{ width: `${Math.max(carbsPct, 2)}%` }}
              className="h-full bg-sky-500 transition-all duration-500"
              title={`Carbohidratos: ${carbsPct}%`}
            />
            <div
              style={{ width: `${Math.max(fatPct, 2)}%` }}
              className="h-full rounded-r-full bg-amber-500 transition-all duration-500"
              title={`Grasas: ${fatPct}%`}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-extrabold text-stone-500 mt-1.5 px-1">
            <div className="flex items-center gap-1 text-teal-700">
              <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
              <span>Proteínas {proteinPct}%</span>
            </div>
            <div className="flex items-center gap-1 text-sky-700">
              <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
              <span>Carbos {carbsPct}%</span>
            </div>
            <div className="flex items-center gap-1 text-amber-700">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              <span>Grasas {fatPct}%</span>
            </div>
          </div>
        </div>

        {currentMeal.imageUri && (
          <div className="mt-4 rounded-2xl overflow-hidden max-h-60 w-full border border-stone-200 shadow-xs">
            <img src={currentMeal.imageUri} alt={currentMeal.dishName} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Grid 2x2 de Tarjetas de Macronutrientes Claras y Frescas */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Calorías */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-teal-100/50 rounded-2xl p-4 border border-emerald-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-950">Calorías Totales</span>
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-950">{currentMeal.calories}</span>
              <span className="text-xs font-extrabold text-emerald-700">kcal</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800/80">Energía aportada</span>
          </div>
        </div>

        {/* Proteínas */}
        <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50/50 rounded-2xl p-4 border border-teal-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-950">Proteínas</span>
            <div className="p-2 rounded-xl bg-teal-600 text-white shadow-xs">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{Math.round(currentMeal.proteinGrams)}</span>
              <span className="text-xs font-extrabold text-teal-700">g</span>
            </div>
            <span className="text-[11px] font-semibold text-teal-800/80">{proteinPct}% del total kcal</span>
          </div>
        </div>

        {/* Carbohidratos */}
        <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50/40 rounded-2xl p-4 border border-sky-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-950">Carbohidratos</span>
            <div className="p-2 rounded-xl bg-sky-500 text-white shadow-xs">
              <Wheat className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{Math.round(currentMeal.carbsGrams)}</span>
              <span className="text-xs font-extrabold text-sky-700">g</span>
            </div>
            <span className="text-[11px] font-semibold text-sky-800/80">{carbsPct}% del total kcal</span>
          </div>
        </div>

        {/* Grasas */}
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50/40 rounded-2xl p-4 border border-amber-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950">Grasas</span>
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{Math.round(currentMeal.fatGrams)}</span>
              <span className="text-xs font-extrabold text-amber-700">g</span>
            </div>
            <span className="text-[11px] font-semibold text-amber-800/80">{fatPct}% del total kcal</span>
          </div>
        </div>
      </div>

      {/* Tarjetas Secundarias: Fibra, Azúcar, Grasa Sat. */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white rounded-2xl p-2.5 border border-stone-200 shadow-2xs">
          <div className="text-[10px] text-stone-500 font-bold uppercase">Fibra</div>
          <div className="text-sm font-black text-stone-800">{currentMeal.fiberGrams}g</div>
        </div>
        <div className="bg-white rounded-2xl p-2.5 border border-stone-200 shadow-2xs">
          <div className="text-[10px] text-stone-500 font-bold uppercase">Azúcares</div>
          <div className="text-sm font-black text-stone-800">{currentMeal.sugarGrams}g</div>
        </div>
        <div className="bg-white rounded-2xl p-2.5 border border-stone-200 shadow-2xs">
          <div className="text-[10px] text-stone-500 font-bold uppercase">Grasa Sat.</div>
          <div className="text-sm font-black text-stone-800">{currentMeal.saturatedFatGrams}g</div>
        </div>
      </div>

      {/* METODO DEL PLATO DE HARVARD & RATIO DE POLIFENOLES / AOVE */}
      <HarvardPlateCard meal={currentMeal} />

      {/* ========================================================================= */}
      {/* SECCIÓN CLAVE SOLICITADA: GESTOR DE INGREDIENTES A MANO (AÑADIR / ELIMINAR) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 border-2 border-emerald-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Leaf className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-stone-900">
                  Ingredientes del Plato (Añadir o Quitar a Mano)
                </h3>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md">
                  {currentMeal.foodItems?.length || 0} Ingredientes
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                ¿La cámara no captó todo o quieres quitar algo? Modifica los ingredientes a mano y los macros se recalcularán al instante.
              </p>
            </div>
          </div>
        </div>

        {/* Sugerencias Rápidas de 1 Clic para Ingredientes Comunes */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-black text-stone-600 uppercase tracking-wider block">
            Añadir ingredientes habituales en 1 clic:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickSuggestedIngredients.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickAddIngredient(item.name, item.grams)}
                className="text-xs font-bold bg-stone-100 hover:bg-emerald-50 text-stone-800 hover:text-emerald-900 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-emerald-300 transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Formulario Rápido para Añadir Cualquier Ingrediente a Mano */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleQuickAddIngredient(manualIngName, manualIngGrams);
          }}
          className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="w-full sm:flex-1">
            <input
              type="text"
              placeholder="Nombre del ingrediente (ej: Aceite de Oliva, 1 Huevo, Queso...)"
              value={manualIngName}
              onChange={(e) => setManualIngName(e.target.value)}
              className="w-full text-xs bg-white border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center bg-white border border-stone-300 rounded-xl px-2 py-1 shadow-2xs">
              <span className="text-[11px] text-stone-500 font-bold mr-1.5">Gramos:</span>
              <input
                type="number"
                min="1"
                max="2000"
                value={manualIngGrams}
                onChange={(e) => setManualIngGrams(Number(e.target.value) || 0)}
                className="w-14 text-xs font-black text-stone-900 outline-none text-right"
              />
              <span className="text-xs text-stone-500 font-bold ml-1">g</span>
            </div>

            <button
              type="submit"
              disabled={!manualIngName.trim() || manualIngGrams <= 0}
              className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Añadir al Plato</span>
            </button>
          </div>
        </form>

        {/* Lista de Ingredientes Detectados / Registrados con Botón Eliminar y Ajustador de Gramos */}
        <div className="space-y-2">
          {currentMeal.foodItems && currentMeal.foodItems.length > 0 ? (
            currentMeal.foodItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-stone-50 hover:bg-white rounded-2xl border border-stone-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="font-extrabold text-stone-900 text-xs sm:text-sm block truncate">
                      {item.name}
                    </span>
                    <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-emerald-800">{item.calories} kcal</span>
                      <span>•</span>
                      <span>P: {Math.round(item.proteinGrams)}g</span>
                      <span>•</span>
                      <span>C: {Math.round(item.carbsGrams)}g</span>
                      <span>•</span>
                      <span>G: {Math.round(item.fatGrams)}g</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-1.5 shrink-0 border-t sm:border-t-0 pt-1.5 sm:pt-0 border-stone-200/60">
                  {/* Quick delta chips */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleAdjustIngredientWeight(idx, -25)}
                      className="px-1.5 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold rounded-md transition cursor-pointer"
                      title="Reducir 25g"
                    >
                      -25g
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAdjustIngredientWeight(idx, 25)}
                      className="px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md transition cursor-pointer border border-emerald-200/60"
                      title="Aumentar 25g"
                    >
                      +25g
                    </button>
                  </div>

                  {/* Selector rápido +/- gramos */}
                  <div className="flex items-center bg-white border border-stone-200 rounded-xl shadow-2xs p-0.5">
                    <button
                      type="button"
                      onClick={() => handleAdjustIngredientWeight(idx, -10)}
                      className="p-1 text-stone-600 hover:bg-stone-100 rounded-lg transition cursor-pointer"
                      title="Reducir 10 gramos"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-black text-stone-900 min-w-[42px] text-center">
                      {item.estimatedWeightGrams}g
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAdjustIngredientWeight(idx, 10)}
                      className="p-1 text-stone-600 hover:bg-stone-100 rounded-lg transition cursor-pointer"
                      title="Aumentar 10 gramos"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Botón de Eliminar Ingrediente Directo */}
                  <button
                    type="button"
                    onClick={() => handleDeleteIngredientAt(idx)}
                    className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 rounded-xl font-bold text-xs border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                    title="Eliminar este ingrediente del plato"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Quitar</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-xs text-stone-500">
              No hay ingredientes en este plato. Usa el formulario de arriba o los botones rápidos para añadir ingredientes a mano.
            </div>
          )}
        </div>
      </div>

      {/* Micronutrientes desplegables */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
        <button
          onClick={() => setShowMicros(!showMicros)}
          className="w-full p-4 flex items-center justify-between text-sm font-bold text-stone-800 hover:bg-stone-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-700" />
            <span>Ver Micronutrientes y Minerales</span>
          </div>
          {showMicros ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showMicros && currentMeal.micronutrients && (
          <div className="p-4 pt-0 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="text-stone-500">Vitamina A</span>
              <p className="font-bold text-stone-800">{currentMeal.micronutrients.vitaminA_mcg} mcg</p>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="text-stone-500">Vitamina C</span>
              <p className="font-bold text-stone-800">{currentMeal.micronutrients.vitaminC_mg} mg</p>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="text-stone-500">Vitamina D</span>
              <p className="font-bold text-stone-800">{currentMeal.micronutrients.vitaminD_iu} IU</p>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="text-stone-500">Vitamina B12</span>
              <p className="font-bold text-stone-800">{currentMeal.micronutrients.vitaminB12_mcg} mcg</p>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="text-stone-500">Calcio</span>
              <p className="font-bold text-stone-800">{currentMeal.micronutrients.calcium_mg} mg</p>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="text-stone-500">Hierro</span>
              <p className="font-bold text-stone-800">{currentMeal.micronutrients.iron_mg} mg</p>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="text-stone-500">Potasio</span>
              <p className="font-bold text-stone-800">{currentMeal.micronutrients.potassium_mg} mg</p>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="text-stone-500">Sodio</span>
              <p className="font-bold text-stone-800">{currentMeal.micronutrients.sodium_mg} mg</p>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
              <span className="text-stone-500">Magnesio</span>
              <p className="font-bold text-stone-800">{currentMeal.micronutrients.magnesium_mg} mg</p>
            </div>
          </div>
        )}
      </div>

      {/* Recomendaciones IA */}
      {currentMeal.personalizedRecommendations && currentMeal.personalizedRecommendations.length > 0 && (
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-3xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Consejos Nutricionales de la IA</span>
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-stone-700 font-medium">
            {currentMeal.personalizedRecommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-emerald-700 font-bold">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOTONES DE ACCIÓN PRINCIPALES: DIARIO + PLAN SEMANAL + MIS RECETAS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {/* Botón Guardar en Diario de Hoy */}
        {onSave && (
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaved || savedSuccess}
            className={`py-3 px-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
              isSaved || savedSuccess
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white active:scale-[0.99]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{isSaved || savedSuccess ? '¡En Diario!' : 'Guardar en Diario'}</span>
          </button>
        )}

        {/* Botón Añadir a Plan Nutricional Semanal */}
        <button
          type="button"
          onClick={() => setIsWeeklyPlanModalOpen(true)}
          className="py-3 px-3 rounded-2xl font-black text-xs bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-[0.99]"
        >
          <CalendarDays className="w-4 h-4 text-blue-200 shrink-0" />
          <span>📅 Al Plan Semanal</span>
        </button>

        {/* Botón Guardar en Mis Recetas */}
        {onSaveCustomRecipe && (
          <button
            type="button"
            onClick={handleSaveToRecipes}
            disabled={savedToRecipesSuccess}
            className={`py-3 px-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
              savedToRecipesSuccess
                ? 'bg-teal-700 text-white cursor-default'
                : 'bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white active:scale-[0.99]'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4 text-teal-200 shrink-0" />
            <span>{savedToRecipesSuccess ? '¡Guardada en Recetas!' : '📖 A Mis Recetas'}</span>
          </button>
        )}
      </div>

      {/* Modal para Añadir al Plan Semanal */}
      {isWeeklyPlanModalOpen && (
        <AddToWeeklyPlanModal
          isOpen={isWeeklyPlanModalOpen}
          onClose={() => setIsWeeklyPlanModalOpen(false)}
          meal={currentMeal}
          currentWeeklyPlan={currentWeeklyPlan || []}
          onConfirmAddToPlan={(dayIdx, mealType, dish) => {
            if (onAddToWeeklyPlan) {
              onAddToWeeklyPlan(dayIdx, mealType, dish);
            }
          }}
          onNavigateToWeeklyPlan={onNavigateToWeeklyPlan}
        />
      )}

      {/* Descargo de Responsabilidad Médica Visible */}
      <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-2xl text-[11px] text-amber-900/90 leading-relaxed flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Descargo de Responsabilidad Médica:</strong> Las estimaciones nutricionales y los cálculos de IA tienen carácter orientativo y formativo (basados en BEDCA y USDA). No constituyen diagnóstico médico ni sustituyen el consejo individualizado de un profesional sanitario o dietista-nutricionista colegiado.
        </p>
      </div>
    </div>
  );
};
