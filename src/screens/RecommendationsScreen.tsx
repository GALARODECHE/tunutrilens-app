import React, { useState, useMemo } from 'react';
import { MealAnalysis, UserProfile, DayPlan } from '../types';
import {
  ALL_DISHES_CATALOG,
  RecommendedDish
} from '../data/dishesCatalog';
import { PrintableDishModal } from '../components/PrintableDishModal';
import { MacroRealFoodTranslator } from '../components/MacroRealFoodTranslator';
import { AddToWeeklyPlanModal } from '../components/AddToWeeklyPlanModal';
import { getDishLifeStageAdaptations } from '../utils/lifeStageUtils';
import {
  UtensilsCrossed,
  Sparkles,
  Plus,
  Check,
  ShieldCheck,
  Clock,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  AlertTriangle,
  Sun,
  Moon,
  Apple,
  ChefHat,
  Search,
  Filter,
  ChevronDown,
  Printer,
  Award,
  HeartPulse,
  Leaf,
  Calculator,
  Camera,
  CalendarDays,
  Bookmark,
  Trash2
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Props {
  userProfile: UserProfile;
  onAddMealToDiary: (meal: MealAnalysis) => void;
  onNavigateToProfile: () => void;
  onUpdateProfile?: (profile: UserProfile) => void;
  currentWeeklyPlan?: DayPlan[];
  onAddToWeeklyPlan?: (
    dayIndex: number,
    mealType: 'desayuno' | 'almuerzo' | 'cena' | 'snack',
    dish: RecommendedDish
  ) => void;
  onNavigateToWeeklyPlan?: () => void;
  savedCustomRecipes?: RecommendedDish[];
  onDeleteCustomRecipe?: (id: string) => void;
}

export const RecommendationsScreen: React.FC<Props> = ({
  userProfile,
  onAddMealToDiary,
  onNavigateToProfile,
  onUpdateProfile,
  currentWeeklyPlan,
  onAddToWeeklyPlan,
  onNavigateToWeeklyPlan,
  savedCustomRecipes = [],
  onDeleteCustomRecipe,
}) => {
  const [activeViewMode, setActiveViewMode] = useState<'recipes' | 'macroTranslator'>('recipes');
  const [selectedCategory, setSelectedCategory] = useState<'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack' | 'Guardados'>('Desayuno');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('Todos');
  const [onlySafeFilter, setOnlySafeFilter] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const [addedMealIds, setAddedMealIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiCustomDishes, setAiCustomDishes] = useState<RecommendedDish[]>([]);
  const [selectedPrintDish, setSelectedPrintDish] = useState<RecommendedDish | null>(null);
  const [isWeeklyPlanModalOpen, setIsWeeklyPlanModalOpen] = useState(false);
  const [dishForPlanModal, setDishForPlanModal] = useState<RecommendedDish | null>(null);

  const restrictions = userProfile.dietaryRestrictions || [];

  // Helper to check if a dish violates user restrictions
  const isDishSafe = (dish: RecommendedDish): boolean => {
    if (restrictions.length === 0) return true;
    const textToSearch = (dish.dishName + ' ' + dish.description + ' ' + dish.ingredients.join(' ')).toLowerCase();
    
    for (const r of restrictions) {
      const lowerR = r.toLowerCase().trim();
      if (!lowerR) continue;

      if (lowerR.includes('gluten') && (textToSearch.includes('espelta') || textToSearch.includes('trigo') || textToSearch.includes('pan integral') || textToSearch.includes('avena') || textToSearch.includes('pasta'))) {
        return false;
      }
      if ((lowerR.includes('lactosa') || lowerR.includes('lácteos')) && (textToSearch.includes('yogur') || textToSearch.includes('queso') || textToSearch.includes('feta') || textToSearch.includes('leche') || textToSearch.includes('ricotta') || textToSearch.includes('mantequilla'))) {
        return false;
      }
      if ((lowerR.includes('fruto') || lowerR.includes('nueces') || lowerR.includes('cacahuet') || lowerR.includes('almendra')) && (textToSearch.includes('nueces') || textToSearch.includes('cacahuete') || textToSearch.includes('almendra') || textToSearch.includes('avellanas') || textToSearch.includes('anacardos'))) {
        return false;
      }
      if (lowerR.includes('huevo') && (textToSearch.includes('huevo') || textToSearch.includes('claras') || textToSearch.includes('omelette'))) {
        return false;
      }
      if (lowerR.includes('pescado') && (textToSearch.includes('salmón') || textToSearch.includes('merluza') || textToSearch.includes('atún') || textToSearch.includes('bacalao') || textToSearch.includes('dorada') || textToSearch.includes('lubina') || textToSearch.includes('pescadilla'))) {
        return false;
      }
      if (lowerR.includes('marisco') && (textToSearch.includes('gambas') || textToSearch.includes('almejas') || textToSearch.includes('calamares') || textToSearch.includes('berberechos') || textToSearch.includes('mejillones'))) {
        return false;
      }
      if (lowerR.includes('soja') && (textToSearch.includes('tofu') || textToSearch.includes('tempeh') || textToSearch.includes('edamame') || textToSearch.includes('soja'))) {
        return false;
      }
      if (textToSearch.includes(lowerR)) {
        return false;
      }
    }
    return true;
  };

  // Combine static catalog + AI dishes + user saved scans
  const allDishes = useMemo(() => {
    return [...savedCustomRecipes, ...aiCustomDishes, ...ALL_DISHES_CATALOG];
  }, [savedCustomRecipes, aiCustomDishes]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    return {
      Desayuno: allDishes.filter((d) => d.mealType === 'Desayuno').length,
      Almuerzo: allDishes.filter((d) => d.mealType === 'Almuerzo').length,
      Cena: allDishes.filter((d) => d.mealType === 'Cena').length,
      Snack: allDishes.filter((d) => d.mealType === 'Snack').length,
      Guardados: savedCustomRecipes.length + aiCustomDishes.length,
    };
  }, [allDishes, savedCustomRecipes, aiCustomDishes]);

  // Filtered list for active category
  const filteredDishes = useMemo(() => {
    return allDishes.filter((dish) => {
      if (selectedCategory === 'Guardados') {
        const isSaved = savedCustomRecipes.some(s => s.id === dish.id) || aiCustomDishes.some(a => a.id === dish.id);
        if (!isSaved) return false;
      } else if (dish.mealType !== selectedCategory) {
        return false;
      }

      const safe = isDishSafe(dish);
      if (onlySafeFilter && !safe) return false;

      // Tag filter
      if (selectedTagFilter !== 'Todos') {
        if (selectedTagFilter === 'Alto en Proteína' && dish.proteinGrams < 25) return false;
        if (selectedTagFilter === 'Bajo en Calorías' && dish.calories > 350) return false;
        if (selectedTagFilter === 'Rápido' && dish.prepTimeMinutes > 10) return false;
        if (selectedTagFilter === 'Aptos Sin Alérgenos' && !safe) return false;
        if (dish.tag && dish.tag !== selectedTagFilter && selectedTagFilter !== 'Aptos Sin Alérgenos' && selectedTagFilter !== 'Alto en Proteína' && selectedTagFilter !== 'Bajo en Calorías' && selectedTagFilter !== 'Rápido') {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const text = (dish.dishName + ' ' + dish.description + ' ' + dish.ingredients.join(' ')).toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [allDishes, selectedCategory, searchQuery, selectedTagFilter, onlySafeFilter, restrictions]);

  const displayedDishes = filteredDishes.slice(0, visibleCount);

  const handleAddDish = (dish: RecommendedDish) => {
    const meal: MealAnalysis = {
      id: 'rec_add_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      dishName: dish.dishName,
      description: dish.description,
      mealType: dish.mealType,
      estimatedWeightGrams: 300,
      healthIndex: 9.5,
      reliabilityConfidence: 98,
      calories: dish.calories,
      proteinGrams: dish.proteinGrams,
      carbsGrams: dish.carbsGrams,
      fatGrams: dish.fatGrams,
      fiberGrams: 6,
      sugarGrams: 4,
      saturatedFatGrams: 2,
      micronutrients: {
        vitaminA_mcg: 120,
        vitaminC_mg: 35,
        vitaminD_iu: 80,
        vitaminB12_mcg: 1.2,
        calcium_mg: 180,
        iron_mg: 2.8,
        potassium_mg: 450,
        sodium_mg: 320,
        magnesium_mg: 65,
        zinc_mg: 2.1,
      },
      foodItems: dish.ingredients.map((ing) => ({
        name: ing,
        estimatedWeightGrams: 75,
        calories: Math.round(dish.calories / Math.max(dish.ingredients.length, 1)),
        proteinGrams: Math.round(dish.proteinGrams / Math.max(dish.ingredients.length, 1)),
        carbsGrams: Math.round(dish.carbsGrams / Math.max(dish.ingredients.length, 1)),
        fatGrams: Math.round(dish.fatGrams / Math.max(dish.ingredients.length, 1)),
      })),
      warnings: [],
      personalizedRecommendations: [
        'Plato seleccionado de tu plan nutricional optimizado.',
        `Se adapta a tu objetivo de ${userProfile.goal.toLowerCase()}.`,
      ],
      timestamp: Date.now(),
    };

    onAddMealToDiary(meal);
    setAddedMealIds((prev) => [...prev, dish.id]);
  };

  const generateMoreWithAI = async () => {
    setIsGenerating(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const promptText = `Genera 4 propuestas de platos tradicionales de la DIETA MEDITERRÁNEA ESPAÑOLA, sencillos de preparar e ingredientes comunes y accesibles en cualquier supermercado o mercado de abastos español para la categoría "${selectedCategory}".
REGLA ESTRICTA DE EXCLUSIÓN: PROHIBIDO alimentos exóticos como sirope de agave, espirulina, açaí, porridge, overnight oats, granola, chía, edamame, tempeh o poke bowls.
REGLA DE ADICIÓN MEDITERRÁNEA: Prioriza recetas sencillas con abundantes verduras de hoja verde (rúcula, canónigos, germinados de alfalfa/brócoli, espinacas frescas, cogollos) y frutos secos mediterráneos (nueces, avellanas, almendras, cacahuetes, piñones). Para un toque dulce opcional usa miel natural.

Perfil del usuario:
- Objetivo: ${userProfile.goal}
- Meta diaria: ${userProfile.dailyCalorieTarget} kcal, ${userProfile.dailyProteinTargetG}g proteínas.
- Alérgenos/Restricciones prohibidos: ${restrictions.length > 0 ? restrictions.join(', ') : 'Ninguno'}.

DEVUELVE EXCLUSIVAMENTE UN ARRAY JSON DE OBJETOS con esta estructura:
[
  {
    "dishName": "Nombre del plato atractivo y tradicional",
    "description": "Descripción en español mediterráneo (1-2 frases)",
    "calories": 400,
    "proteinGrams": 30,
    "carbsGrams": 40,
    "fatGrams": 12,
    "prepTimeMinutes": 15,
    "ingredients": ["ingrediente 1 con cantidad", "ingrediente 2", "ingrediente 3"]
  }
]`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: promptText,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (Array.isArray(parsed)) {
            const defaultMealType = (selectedCategory === 'Guardados' ? 'Almuerzo' : selectedCategory) as 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack';
            const formatted: RecommendedDish[] = parsed.map((item: any, index: number) => ({
              id: `ai_dish_${Date.now()}_${index}`,
              dishName: item.dishName || 'Plato IA Recomendado',
              description: item.description || 'Opción saludable y equilibrada.',
              mealType: defaultMealType,
              calories: Math.max(Number(item.calories) || 350, 50),
              proteinGrams: Math.max(Number(item.proteinGrams) || 20, 2),
              carbsGrams: Math.max(Number(item.carbsGrams) || 30, 2),
              fatGrams: Math.max(Number(item.fatGrams) || 10, 1),
              prepTimeMinutes: Number(item.prepTimeMinutes) || 15,
              ingredients: Array.isArray(item.ingredients) ? item.ingredients : ['Ingredientes seleccionados'],
              safeForRestrictions: true,
              tag: 'Alto en Proteína'
            }));

            setAiCustomDishes((prev) => [...formatted, ...prev]);
          }
        }
      }
    } catch (err) {
      console.error('Error al generar platos con IA:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const categories = [
    { id: 'Desayuno' as const, label: 'Desayunos', count: categoryCounts.Desayuno, icon: Sun, color: 'text-amber-500 bg-amber-50' },
    { id: 'Almuerzo' as const, label: 'Comidas', count: categoryCounts.Almuerzo, icon: UtensilsCrossed, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'Cena' as const, label: 'Cenas', count: categoryCounts.Cena, icon: Moon, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'Snack' as const, label: 'Snacks', count: categoryCounts.Snack, icon: Apple, color: 'text-rose-500 bg-rose-50' },
    { id: 'Guardados' as const, label: '⭐ Mis Platos Escaneados', count: categoryCounts.Guardados, icon: Bookmark, color: 'text-teal-600 bg-teal-50' },
  ];

  const tagFilters = ['Todos', 'Aptos Sin Alérgenos', 'Aprovechamiento', 'Alto en Proteína', 'Bajo en Calorías', 'Rápido', 'Vegetariano', 'Keto', 'Mediterráneo'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-teal-700 font-bold uppercase tracking-wider">
            <ChefHat className="w-4 h-4 text-teal-600" />
            <span>Recetario & Platos Mediterráneos</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Recetas Saludables & Mis Platos</h1>
        </div>

        <button
          onClick={generateMoreWithAI}
          disabled={isGenerating}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all active:scale-95 flex-shrink-0 cursor-pointer"
        >
          <Sparkles className={`w-4 h-4 text-emerald-100 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Generando...' : 'Crear Receta con IA'}</span>
        </button>
      </div>

      {/* Switcher de Vistas: Catálogo de Recetas vs Traductor Comida Real (IA) */}
      <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => setActiveViewMode('recipes')}
          className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeViewMode === 'recipes'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Catálogo de Recetas</span>
        </button>

        <button
          onClick={() => setActiveViewMode('macroTranslator')}
          className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeViewMode === 'macroTranslator'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 font-black border border-emerald-200'
          }`}
        >
          <Calculator className="w-4 h-4 text-amber-500" />
          <span>Traductor Comida Real (IA)</span>
        </button>
      </div>

      {activeViewMode === 'macroTranslator' ? (
        <MacroRealFoodTranslator
          userProfile={userProfile}
          onAddMealToDiary={onAddMealToDiary}
        />
      ) : (
        <>

      {/* Banner de Ajuste al Perfil del Cliente */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-5 shadow-sm border border-emerald-500 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-white/20 text-white font-extrabold text-xs rounded-lg border border-white/30 uppercase tracking-wider">
              {userProfile.goal}
            </span>
            <span className="px-2.5 py-1 bg-white/20 text-white font-extrabold text-[10px] rounded-lg border border-white/30 uppercase tracking-wider">
              BEDCA & USDA Open Data
            </span>
            <span className="text-xs font-semibold text-emerald-100">
              Objetivo: <strong className="text-white">{userProfile.dailyCalorieTarget} kcal/día</strong>
            </span>
          </div>

          <div className="text-xs text-white font-bold flex items-center gap-3">
            <span>{userProfile.dailyProteinTargetG}g Prot</span>
            <span>•</span>
            <span>{userProfile.dailyCarbsTargetG}g Carb</span>
            <span>•</span>
            <span>{userProfile.dailyFatTargetG}g Grasas</span>
          </div>
        </div>

        {/* Informador de Alérgenos Activos */}
        <div className="flex items-start justify-between gap-3 text-xs pt-1">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-white">Filtro de Alérgenos: </span>
              {restrictions.length > 0 ? (
                <span className="text-amber-300 font-semibold">
                  Excluyendo {restrictions.join(', ')}
                </span>
              ) : (
                <span className="text-teal-200/70">
                  Sin restricciones registradas.
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onNavigateToProfile}
            className="text-[11px] font-bold text-teal-300 hover:text-white underline underline-offset-2 flex-shrink-0"
          >
            Editar Alérgenos
          </button>
        </div>
      </div>

      {/* Tabs de Categorías de Comida */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setVisibleCount(12);
              }}
              className={`p-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-between border ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-sm scale-[1.02]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-xl ${isActive ? 'bg-white/20 text-white' : cat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span>{cat.label}</span>
              </div>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Input de Búsqueda */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Buscar entre más de 100 ${selectedCategory.toLowerCase()}s (ej: salmón, avena, huevo)...`}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            )}
          </div>

          {/* Toggle Solo Aptos */}
          <button
            onClick={() => setOnlySafeFilter(!onlySafeFilter)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
              onlySafeFilter
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Solo Aptos (Sin alérgenos)</span>
          </button>
        </div>

        {/* Chips de Categorías o Etiquetas y Filtro de Etapas de la Vida */}
        <div className="space-y-2">
          {/* Tag filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Perfil:</span>
            </span>
            {tagFilters.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTagFilter(tag);
                  setVisibleCount(12);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedTagFilter === tag
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de Platos Recomendados */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span>Opciones de {selectedCategory}s</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-extrabold">
              {filteredDishes.length} encontradas
            </span>
          </h2>
          {displayedDishes.length < filteredDishes.length && (
            <span className="text-xs text-slate-500 font-semibold">
              Mostrando {displayedDishes.length} de {filteredDishes.length}
            </span>
          )}
        </div>

        {filteredDishes.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-3">
            <UtensilsCrossed className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No se encontraron opciones con los filtros actuales.</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTagFilter('Todos');
                  setOnlySafeFilter(false);
                }}
                className="px-3.5 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
              >
                Limpiar Filtros
              </button>
              <button
                onClick={generateMoreWithAI}
                className="px-3.5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
              >
                Generar con IA
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedDishes.map((dish) => {
              const safe = isDishSafe(dish);
              const isAdded = addedMealIds.includes(dish.id);

              return (
                <div
                  key={dish.id}
                  className={`bg-white rounded-2xl p-5 border shadow-sm transition-all flex flex-col justify-between space-y-4 ${
                    !safe
                      ? 'border-amber-200 bg-amber-50/20 opacity-85'
                      : 'border-slate-200/80 hover:border-emerald-300'
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Safe / Restriction Tag & Print Trigger */}
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{dish.prepTimeMinutes} min de prep</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPrintDish(dish)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 border border-slate-200 rounded-md flex items-center gap-1 transition-all"
                          title="Imprimir Ficha Nutricional"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="hidden sm:inline">Imprimir Ficha</span>
                        </button>

                        {safe ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Apto</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-md flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Alérgeno</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                        {dish.dishName}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1">
                        {dish.description}
                      </p>
                    </div>

                    {/* Life Stages Badges / Leyenda en la Ficha */}
                    <div className="pt-0.5">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Award className="w-3 h-3 text-emerald-600" />
                        <span>Adaptado para Etapas:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {getDishLifeStageAdaptations(dish).map((st) => (
                          <span
                            key={st.id}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${st.badgeBg} ${st.badgeText}`}
                          >
                            ✓ {st.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Macro Badges */}
                    <div className="grid grid-cols-4 gap-1.5 p-2.5 bg-slate-50 rounded-xl text-center border border-slate-100">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Calorías</div>
                        <div className="text-xs font-black text-amber-950 flex items-center justify-center gap-0.5">
                          <Flame className="w-3 h-3 text-amber-600" />
                          <span>{dish.calories}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Proteína</div>
                        <div className="text-xs font-black text-emerald-950 flex items-center justify-center gap-0.5">
                          <Dumbbell className="w-3 h-3 text-emerald-600" />
                          <span>{dish.proteinGrams}g</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Carbos</div>
                        <div className="text-xs font-black text-blue-950 flex items-center justify-center gap-0.5">
                          <Wheat className="w-3 h-3 text-blue-600" />
                          <span>{dish.carbsGrams}g</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Grasas</div>
                        <div className="text-xs font-black text-rose-950 flex items-center justify-center gap-0.5">
                          <Droplets className="w-3 h-3 text-rose-600" />
                          <span>{dish.fatGrams}g</span>
                        </div>
                      </div>
                    </div>

                    {/* Ingredientes principal */}
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-slate-700">Ingredientes clave:</div>
                      <div className="flex flex-wrap gap-1">
                        {dish.ingredients.map((ing, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            • {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Diario + Plan Semanal + Delete if custom */}
                  <div className="pt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddDish(dish)}
                        disabled={isAdded}
                        className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-98'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                            <span>¡En Diario!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ A Diario Hoy</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDishForPlanModal(dish);
                          setIsWeeklyPlanModalOpen(true);
                        }}
                        className="py-2.5 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer active:scale-98"
                      >
                        <CalendarDays className="w-3.5 h-3.5 text-blue-200" />
                        <span>📅 Al Plan Semanal</span>
                      </button>
                    </div>

                    {/* Botón Eliminar si es receta propia guardada */}
                    {savedCustomRecipes.some(s => s.id === dish.id) && onDeleteCustomRecipe && (
                      <button
                        type="button"
                        onClick={() => onDeleteCustomRecipe(dish.id)}
                        className="w-full py-1.5 px-2 text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition flex items-center justify-center gap-1 border border-rose-200 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3 text-rose-500" />
                        <span>Eliminar de mis platos guardados</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < filteredDishes.length && (
          <div className="text-center pt-4">
            <button
              onClick={() => setVisibleCount((prev) => prev + 16)}
              className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-800 shadow-xs inline-flex items-center gap-2 transition-all"
            >
              <ChevronDown className="w-4 h-4 text-emerald-600" />
              <span>Mostrar más opciones ({filteredDishes.length - visibleCount} restantes)</span>
            </button>
          </div>
        )}
      </div>
      </>
      )}

      {/* Modal Ficha Nutricional Imprimible */}
      <PrintableDishModal
        dish={selectedPrintDish}
        onClose={() => setSelectedPrintDish(null)}
      />

      {/* Modal para Añadir al Plan Semanal */}
      {isWeeklyPlanModalOpen && dishForPlanModal && (
        <AddToWeeklyPlanModal
          isOpen={isWeeklyPlanModalOpen}
          onClose={() => {
            setIsWeeklyPlanModalOpen(false);
            setDishForPlanModal(null);
          }}
          meal={dishForPlanModal}
          currentWeeklyPlan={currentWeeklyPlan || []}
          onConfirmAddToPlan={(dayIdx, mealType, dish) => {
            if (onAddToWeeklyPlan) {
              onAddToWeeklyPlan(dayIdx, mealType, dish);
            }
          }}
          onNavigateToWeeklyPlan={onNavigateToWeeklyPlan}
        />
      )}
    </div>
  );
};
