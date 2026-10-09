import React, { useState } from 'react';
import { MealAnalysis, UserProfile } from '../types';
import {
  ChefHat,
  Sparkles,
  Clock,
  Flame,
  Plus,
  Check,
  Share2,
  Loader2,
  Utensils,
  Leaf,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export interface ScannedRecipe {
  id: string;
  title: string;
  subtitle: string;
  prepTimeMinutes: number;
  difficulty: 'Muy Fácil' | 'Fácil' | 'Media';
  ingredientsUsed: string[];
  staplesNeeded: string[];
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  instructions: string[];
  tip: string;
}

interface Props {
  productName: string;
  brand?: string;
  ingredients: string[];
  userProfile?: UserProfile;
  onAddMealToDiary?: (meal: MealAnalysis) => void;
}

export const ScannedProductRecipeSection: React.FC<Props> = ({
  productName,
  brand,
  ingredients,
  userProfile,
  onAddMealToDiary,
}) => {
  const [recipes, setRecipes] = useState<ScannedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const generateRecipesForScannedProduct = async () => {
    setIsLoading(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const restrictionsStr = (userProfile?.dietaryRestrictions || []).join(', ');
        const goal = userProfile?.goal || 'mantenimiento saludable';

        const ingredientsListStr = ingredients && ingredients.length > 0 
          ? ingredients.join(', ')
          : productName;

        const promptText = `Eres un Chef Nutricionista Experto en Cocina Mediterránea Saludable y Rápida.
El usuario acaba de escanear o subir este alimento/producto de supermercado: "${productName}" ${brand ? `(Marca: ${brand})` : ''}.
Ingredientes o características principales: ${ingredientsListStr}.

Restricciones/Alérgenos a respetar estrictamente: ${restrictionsStr || 'Ninguno'}.
Objetivo nutricional: ${goal}.

Recomienda 3 RECETAS FÁCILES, RÁPIDAS (menos de 20 minutos) y DELICIOSAS que utilicen este ingrediente escaneado como elemento principal o complementario. 
Las recetas deben ser 100% dieta mediterránea real, utilizando básicos de cocina española (Aceite de Oliva Virgen Extra AOVE, sal, ajo, verduras frescas, huevo, etc.).

REGLAS DE RECETAS:
- Deben ser MUY FÁCILES de preparar en casa.
- PROHIBIDO utilizar ingredientes ultraprocesados, porridge de avena, chía, açaí o toppings exóticos.
- Mantener un perfil equilibrado con buenas proteínas y grasas saludables.

Devuelve EXCLUSIVAMENTE un array JSON con esta estructura exacta:
[
  {
    "title": "Nombre de la receta rápida",
    "subtitle": "Breve descripción de por qué es perfecta para este ingrediente escaneado",
    "prepTimeMinutes": 15,
    "difficulty": "Muy Fácil",
    "ingredientsUsed": ["${productName}", "Huevo", "Tomate fresco"],
    "staplesNeeded": ["AOVE", "Pizca de sal", "Diente de ajo"],
    "calories": 380,
    "proteinGrams": 24,
    "carbsGrams": 28,
    "fatGrams": 15,
    "instructions": [
      "Paso 1: Preparación inicial...",
      "Paso 2: Salteado o mezcla...",
      "Paso 3: Emplatado y servir..."
    ],
    "tip": "Truco o variante mediterránea para sacar el máximo partido a este producto"
  }
]`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: promptText,
          config: { responseMimeType: 'application/json' },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (Array.isArray(parsed)) {
            const formatted: ScannedRecipe[] = parsed.map((item: any, idx: number) => ({
              id: `scanned_rec_${Date.now()}_${idx}`,
              title: item.title || `Receta Fácil con ${productName}`,
              subtitle: item.subtitle || 'Plato rápido y saludable mediterráneo',
              prepTimeMinutes: Number(item.prepTimeMinutes) || 15,
              difficulty: item.difficulty || 'Muy Fácil',
              ingredientsUsed: Array.isArray(item.ingredientsUsed) ? item.ingredientsUsed : [productName],
              staplesNeeded: Array.isArray(item.staplesNeeded) ? item.staplesNeeded : ['AOVE', 'Sal'],
              calories: Number(item.calories) || 350,
              proteinGrams: Number(item.proteinGrams) || 20,
              carbsGrams: Number(item.carbsGrams) || 25,
              fatGrams: Number(item.fatGrams) || 12,
              instructions: Array.isArray(item.instructions) ? item.instructions : ['Preparar y disfrutar.'],
              tip: item.tip || 'Acompaña con una ensalada de hoja verde fresca.',
            }));
            setRecipes(formatted);
            setIsExpanded(true);
          }
        }
      }
    } catch (err) {
      console.error('Error generando recetas para producto escaneado:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMeal = (rec: ScannedRecipe) => {
    if (!onAddMealToDiary) return;

    const meal: MealAnalysis = {
      id: 'scanned_meal_' + Date.now(),
      dishName: rec.title,
      description: rec.subtitle,
      mealType: 'Almuerzo',
      estimatedWeightGrams: 300,
      healthIndex: 9,
      reliabilityConfidence: 95,
      calories: rec.calories,
      proteinGrams: rec.proteinGrams,
      carbsGrams: rec.carbsGrams,
      fatGrams: rec.fatGrams,
      fiberGrams: 4,
      sugarGrams: 2,
      saturatedFatGrams: 2,
      micronutrients: {
        vitaminA_mcg: 150,
        vitaminC_mg: 20,
        vitaminD_iu: 0,
        vitaminB12_mcg: 0.8,
        calcium_mg: 120,
        iron_mg: 2.0,
        potassium_mg: 350,
        sodium_mg: 250,
        magnesium_mg: 50,
        zinc_mg: 1.5,
      },
      foodItems: rec.ingredientsUsed.map((ing) => ({
        name: ing,
        estimatedWeightGrams: 75,
        calories: Math.round(rec.calories / Math.max(rec.ingredientsUsed.length, 1)),
        proteinGrams: Math.round(rec.proteinGrams / Math.max(rec.ingredientsUsed.length, 1)),
        carbsGrams: Math.round(rec.carbsGrams / Math.max(rec.ingredientsUsed.length, 1)),
        fatGrams: Math.round(rec.fatGrams / Math.max(rec.ingredientsUsed.length, 1)),
      })),
      warnings: [],
      personalizedRecommendations: [rec.tip],
      timestamp: Date.now(),
    };

    onAddMealToDiary(meal);
    setAddedIds((prev) => [...prev, rec.id]);
  };

  const handleShare = (rec: ScannedRecipe) => {
    const shareText = `🍳 Receta fácil creada con mi producto escaneado (${productName}):
" ${rec.title} "
⏱️ ${rec.prepTimeMinutes} min | ⚡ ${rec.calories} kcal | 💪 ${rec.proteinGrams}g proteína

💡 Ingredientes: ${rec.ingredientsUsed.join(', ')}
🌿 Consejo: ${rec.tip}

Vía #TuNutriLens #ComidaReal #DietaMediterranea`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedId(rec.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-emerald-700/60 shadow-xl space-y-4">
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-400/30">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
                Recetas Fáciles con Alimento Escaneado
              </h3>
              <span className="px-2 py-0.5 bg-amber-400 text-slate-900 font-extrabold text-[10px] rounded-md uppercase">
                IA Chef
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5 font-medium">
              Obtén ideas de platos rápidos y saludables aprovechando <strong>{productName}</strong>
            </p>
          </div>
        </div>

        {recipes.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-emerald-800/60 hover:bg-emerald-800 text-emerald-200 rounded-xl transition"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Main Trigger Button */}
      {recipes.length === 0 && (
        <button
          onClick={generateRecipesForScannedProduct}
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-98 border border-emerald-400/40"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-emerald-100" />
              <span>Creando Recetas Rápidas con IA para {productName}...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>Recomendar Recetas Fáciles con este Producto</span>
            </>
          )}
        </button>
      )}

      {/* Generated Recipes List */}
      {recipes.length > 0 && isExpanded && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-emerald-400" />
              <span>3 Propuestas Rápidas Creadas:</span>
            </span>
            <button
              onClick={generateRecipesForScannedProduct}
              disabled={isLoading}
              className="text-[11px] text-emerald-300 hover:text-white font-bold underline flex items-center gap-1"
            >
              {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-amber-300" />}
              <span>Generar otras 3</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {recipes.map((rec) => {
              const isAdded = addedIds.includes(rec.id);
              const isCopied = copiedId === rec.id;

              return (
                <div
                  key={rec.id}
                  className="bg-slate-900/95 border border-emerald-700/50 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-emerald-400/80 transition shadow-md"
                >
                  <div className="space-y-2.5">
                    {/* Badge header */}
                    <div className="flex items-center justify-between gap-1 border-b border-slate-800 pb-1.5">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] rounded-md border border-emerald-500/30 uppercase">
                        {rec.difficulty}
                      </span>
                      <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{rec.prepTimeMinutes} min</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-white leading-snug">
                        {rec.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed font-medium">
                        {rec.subtitle}
                      </p>
                    </div>

                    {/* Macros */}
                    <div className="grid grid-cols-4 gap-1 p-1.5 bg-slate-800/80 rounded-xl text-center border border-slate-700/60">
                      <div>
                        <div className="text-[8px] font-bold text-slate-400 uppercase">Kcal</div>
                        <div className="text-xs font-black text-white">{rec.calories}</div>
                      </div>
                      <div>
                        <div className="text-[8px] font-bold text-slate-400 uppercase">Prot</div>
                        <div className="text-xs font-black text-emerald-400">{rec.proteinGrams}g</div>
                      </div>
                      <div>
                        <div className="text-[8px] font-bold text-slate-400 uppercase">Carb</div>
                        <div className="text-xs font-black text-sky-300">{rec.carbsGrams}g</div>
                      </div>
                      <div>
                        <div className="text-[8px] font-bold text-slate-400 uppercase">Grasa</div>
                        <div className="text-xs font-black text-amber-400">{rec.fatGrams}g</div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                        Preparación paso a paso:
                      </span>
                      <ol className="text-[11px] text-slate-200 space-y-1 list-decimal list-inside font-medium leading-snug bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        {rec.instructions.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Tip */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 space-y-0.5">
                      <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Consejo Mediterráneo:</span>
                      </span>
                      <p className="text-[11px] text-amber-100 font-medium leading-snug">
                        {rec.tip}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5">
                    {onAddMealToDiary && (
                      <button
                        onClick={() => handleAddMeal(rec)}
                        disabled={isAdded}
                        className={`w-full py-2 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-1.5 ${
                          isAdded
                            ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-600'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>¡Añadido al Diario!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Añadir al Diario</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => handleShare(rec)}
                      className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] transition flex items-center justify-center gap-1"
                    >
                      <Share2 className="w-3 h-3 text-slate-400" />
                      <span>{isCopied ? '¡Copiado!' : 'Compartir Receta'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
