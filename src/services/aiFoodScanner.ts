import { GoogleGenAI } from '@google/genai';
import { MealAnalysis, FoodItem } from '../types';
import { SupermarketProductAnalysis } from '../components/SupermarketProductAnalysisCard';

// Ultra-fast and reliable vision models in priority order of benchmark response time (<1.2s)
const VISION_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3-flash-preview',
  'gemini-flash-latest',
];

async function generateWithTimeout(
  ai: GoogleGenAI,
  params: any,
  timeoutMs = 6500
): Promise<any> {
  return Promise.race([
    ai.models.generateContent(params),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout de ${timeoutMs}ms en modelo ${params.model}`)), timeoutMs)
    ),
  ]);
}

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not configured');
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

function cleanBase64(raw: string): string {
  if (!raw) return '';
  return raw.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '').trim();
}

function extractJsonFromText(text: string): any {
  if (!text) return null;
  // Try markdown block first ```json ... ```
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1]);
    } catch {
      // ignore
    }
  }

  // Try raw bracket matching { ... }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      // ignore
    }
  }

  return null;
}

export interface DishScanOptions {
  rawBase64?: string;
  mimeType?: string;
  mealType?: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack';
  userNotes?: string;
}

/**
 * High-accuracy multi-modal food recognition using Gemini Vision
 */
export async function analyzeDishWithAI(
  dataUrl: string,
  options: DishScanOptions = {}
): Promise<MealAnalysis> {
  const ai = getGenAI();
  const mealType = options.mealType || 'Almuerzo';
  const base64Data = cleanBase64(options.rawBase64 || dataUrl);
  const mimeType = options.mimeType || 'image/jpeg';

  if (!ai || !base64Data) {
    throw new Error('No se pudo inicializar el reconocedor visual de alimentos.');
  }

  const promptText = `Eres el sommelier nutricional y experto en visión artificial de TuNutriLens, especializado en dieta mediterránea y comida real.
Analiza con máxima precisión la fotografía proporcionada.

METODOLOGÍA DE RECONOCIMIENTO VISUAL:
1. CENTRO DEL PLATO: Enfócate exclusivamente en la comida servida en el plato o recipiente principal. Ignora elementos de fondo como cubiertos, vasos de agua, servilletas, mantel o platos vacíos.
2. DISCRIMINACIÓN DE INGREDIENTES: Examina texturas, colores, cortes y métodos de cocción (plancha, horno, estofado, crudo, hervido).
   - Distingue con precisión entre diferentes tipos de carne (pollo, ternera, pavo, cerdo), pescados (blancos como merluza o azules como salmón/atún), y legumbres o cereales (arroz blanco, integral, quinoa, patata).
   - Detecta si lleva aceite de oliva virgen extra (AOVE), salsas caseras, verduras salteadas o guarniciones.
3. ESTIMACIÓN VOLUMÉTRICA:
   - Estima el peso realista en gramos (g) de cada ingrediente visible o deducible según el tamaño típico de vajilla española/mediterránea.
   - Suma el peso total del plato (generalmente entre 250g y 500g para un plato principal estándar).
4. CÁLCULO NUTRICIONAL PRECISO:
   - Calcula calorías, proteínas, carbohidratos, grasas totales, fibra, azúcares naturales y grasas saturadas de forma coherente con los gramos estimados.
   - Asigna un Índice de Salud (1 al 10) según si es comida real mínimamente procesada con grasas saludables.
   - Asigna el porcentaje de fiabilidad / confianza de detección visual (ej. 88% a 98%).
5. CONTEXTO DEL USUARIO:
${options.userNotes ? `IMPORTANTE - NOTAS ESPECÍFICAS INDICADAS POR EL USUARIO: "${options.userNotes}". Ajusta el análisis teniendo en cuenta esta información.` : 'No hay notas del usuario.'}

Responde ÚNICAMENTE en JSON válido con este esquema:
{
  "dishName": "Nombre gastronómico claro y específico (ej: Pechuga de pollo a la plancha con patatas asadas y ensalada mixta)",
  "description": "Descripción breve y apetecible del plato reconociendo los ingredientes y preparación.",
  "mealType": "${mealType}",
  "estimatedWeightGrams": 420,
  "healthIndex": 9,
  "reliabilityConfidence": 94,
  "calories": 480,
  "proteinGrams": 38.0,
  "carbsGrams": 42.0,
  "fatGrams": 14.0,
  "fiberGrams": 6.5,
  "sugarGrams": 3.0,
  "saturatedFatGrams": 2.2,
  "micronutrients": {
    "vitaminA_mcg": 280,
    "vitaminC_mg": 40,
    "vitaminD_iu": 60,
    "vitaminB12_mcg": 1.4,
    "calcium_mg": 140,
    "iron_mg": 3.8,
    "potassium_mg": 680,
    "sodium_mg": 380,
    "magnesium_mg": 85,
    "zinc_mg": 2.6
  },
  "foodItems": [
    { "name": "Ingrediente o parte (ej: Pechuga de pollo)", "estimatedWeightGrams": 160, "calories": 210, "proteinGrams": 34, "carbsGrams": 0, "fatGrams": 4.5 },
    { "name": "Guarnición (ej: Patatas al horno con AOVE)", "estimatedWeightGrams": 150, "calories": 160, "proteinGrams": 3, "carbsGrams": 30, "fatGrams": 4 }
  ],
  "warnings": ["Observación de equilibrio o alérgenos si procede"],
  "personalizedRecommendations": [
    "Consejo de optimización mediterránea para este plato."
  ]
}`;

  let lastError: any = null;

  for (const model of VISION_MODELS) {
    try {
      const response = await generateWithTimeout(
        ai,
        {
          model,
          contents: [
            {
              role: 'user',
              parts: [
                { inlineData: { mimeType, data: base64Data } },
                { text: promptText },
              ],
            },
          ],
          config: {
            responseMimeType: 'application/json',
          },
        },
        6000
      );

      const parsed = extractJsonFromText(response.text || '');
      if (parsed && parsed.dishName) {
        return {
          id: 'dish_ai_' + Date.now(),
          dishName: parsed.dishName || 'Plato Casero Escaneado',
          description: parsed.description || 'Plato analizado con precisión visual por TuNutriLens.',
          mealType: mealType,
          estimatedWeightGrams: Math.round(parsed.estimatedWeightGrams || 350),
          healthIndex: Math.min(10, Math.max(1, parsed.healthIndex || 8)),
          reliabilityConfidence: Math.min(99, Math.max(70, parsed.reliabilityConfidence || 92)),
          calories: Math.round(parsed.calories || 400),
          proteinGrams: Number((parsed.proteinGrams || 25).toFixed(1)),
          carbsGrams: Number((parsed.carbsGrams || 40).toFixed(1)),
          fatGrams: Number((parsed.fatGrams || 12).toFixed(1)),
          fiberGrams: Number((parsed.fiberGrams || 5).toFixed(1)),
          sugarGrams: Number((parsed.sugarGrams || 3).toFixed(1)),
          saturatedFatGrams: Number((parsed.saturatedFatGrams || 2).toFixed(1)),
          micronutrients: parsed.micronutrients || {
            vitaminA_mcg: 220,
            vitaminC_mg: 35,
            vitaminD_iu: 50,
            vitaminB12_mcg: 1.2,
            calcium_mg: 120,
            iron_mg: 3.2,
            potassium_mg: 550,
            sodium_mg: 360,
            magnesium_mg: 80,
            zinc_mg: 2.2,
          },
          foodItems: Array.isArray(parsed.foodItems) && parsed.foodItems.length > 0
            ? parsed.foodItems.map((item: any) => ({
                name: item.name || 'Alimento',
                estimatedWeightGrams: Math.round(item.estimatedWeightGrams || 100),
                calories: Math.round(item.calories || 120),
                proteinGrams: Number((item.proteinGrams || 5).toFixed(1)),
                carbsGrams: Number((item.carbsGrams || 10).toFixed(1)),
                fatGrams: Number((item.fatGrams || 3).toFixed(1)),
              }))
            : [
                {
                  name: parsed.dishName,
                  estimatedWeightGrams: parsed.estimatedWeightGrams || 350,
                  calories: parsed.calories || 400,
                  proteinGrams: parsed.proteinGrams || 25,
                  carbsGrams: parsed.carbsGrams || 40,
                  fatGrams: parsed.fatGrams || 12,
                },
              ],
          warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
          personalizedRecommendations: Array.isArray(parsed.personalizedRecommendations)
            ? parsed.personalizedRecommendations
            : ['Plato equilibrado rico en nutrientes de la dieta mediterránea.'],
          imageUri: dataUrl,
          timestamp: Date.now(),
        };
      }
    } catch (err: any) {
      console.warn(`Vision model ${model} failed:`, err?.status || err?.message);
      lastError = err;
      // continue to next model
    }
  }

  throw lastError || new Error('No se pudo procesar la imagen con los modelos de visión.');
}

/**
 * Refines or recalculates an already scanned dish based on user correction hints
 * (e.g., "Es merluza con patatas panaderas, no salmón" or "Añadí 2 cucharadas de AOVE")
 */
export async function refineDishWithAI(
  currentMeal: MealAnalysis,
  refinementHint: string
): Promise<MealAnalysis> {
  const ai = getGenAI();
  if (!ai || !refinementHint.trim()) {
    return currentMeal;
  }

  const promptText = `El usuario ha escaneado un plato en TuNutriLens pero quiere corregir o precisar los ingredientes.

DATOS ACTUALES DEL PLATO:
- Nombre: ${currentMeal.dishName}
- Calorías: ${currentMeal.calories} kcal
- Peso: ${currentMeal.estimatedWeightGrams} g
- Ingredientes actuales: ${JSON.stringify(currentMeal.foodItems)}

CORRECCIÓN O ACLARACIÓN DEL USUARIO:
"${refinementHint}"

TAREA:
Reajusta el nombre del plato, ingredientes exactos, gramos individuales, calorías totales y macronutrientes basándote fielmente en la aclaración del usuario.

Responde ÚNICAMENTE en JSON válido con el mismo esquema de MealAnalysis:
{
  "dishName": "Nombre ajustado",
  "description": "Descripción adaptada",
  "estimatedWeightGrams": 400,
  "calories": 460,
  "proteinGrams": 36.0,
  "carbsGrams": 38.0,
  "fatGrams": 14.0,
  "fiberGrams": 6.0,
  "sugarGrams": 3.0,
  "saturatedFatGrams": 2.0,
  "foodItems": [
    { "name": "...", "estimatedWeightGrams": 150, "calories": 200, "proteinGrams": 30, "carbsGrams": 0, "fatGrams": 3 }
  ],
  "warnings": ["Ajustado con tus notas personalizadas."],
  "personalizedRecommendations": ["Recomendación adaptada."]
}`;

  for (const model of VISION_MODELS) {
    try {
      const res = await generateWithTimeout(
        ai,
        {
          model,
          contents: [{ role: 'user', parts: [{ text: promptText }] }],
          config: { responseMimeType: 'application/json' },
        },
        5000
      );

      const parsed = extractJsonFromText(res.text || '');
      if (parsed && parsed.dishName) {
        return {
          ...currentMeal,
          dishName: parsed.dishName || currentMeal.dishName,
          description: parsed.description || currentMeal.description,
          estimatedWeightGrams: Math.round(parsed.estimatedWeightGrams || currentMeal.estimatedWeightGrams),
          calories: Math.round(parsed.calories || currentMeal.calories),
          proteinGrams: Number((parsed.proteinGrams || currentMeal.proteinGrams).toFixed(1)),
          carbsGrams: Number((parsed.carbsGrams || currentMeal.carbsGrams).toFixed(1)),
          fatGrams: Number((parsed.fatGrams || currentMeal.fatGrams).toFixed(1)),
          fiberGrams: Number((parsed.fiberGrams || currentMeal.fiberGrams).toFixed(1)),
          sugarGrams: Number((parsed.sugarGrams || currentMeal.sugarGrams).toFixed(1)),
          saturatedFatGrams: Number((parsed.saturatedFatGrams || currentMeal.saturatedFatGrams).toFixed(1)),
          foodItems: Array.isArray(parsed.foodItems) && parsed.foodItems.length > 0 ? parsed.foodItems : currentMeal.foodItems,
          warnings: Array.isArray(parsed.warnings) ? parsed.warnings : currentMeal.warnings,
          personalizedRecommendations: Array.isArray(parsed.personalizedRecommendations)
            ? parsed.personalizedRecommendations
            : currentMeal.personalizedRecommendations,
        };
      }
    } catch (e) {
      console.warn(`Refinement with ${model} failed:`, e);
    }
  }

  return currentMeal;
}

/**
 * Supermarket label / barcode product analyzer
 */
export async function analyzeProductWithAI(
  dataUrl: string,
  options: { rawBase64?: string; mimeType?: string; userNotes?: string } = {}
): Promise<SupermarketProductAnalysis> {
  const ai = getGenAI();
  const base64Data = cleanBase64(options.rawBase64 || dataUrl);
  const mimeType = options.mimeType || 'image/jpeg';

  if (!ai || !base64Data) {
    throw new Error('No se pudo inicializar el escáner de productos.');
  }

  const promptText = `Analiza detalladamente esta fotografía de producto de supermercado (etiqueta nutricional, envase, código de barras o lista de ingredientes) para TuNutriLens.

CRITERIOS NUTRICIONALES MEDITERRÁNEOS:
1. Identifica el nombre de producto y marca visible o estimada.
2. Dictamina el veredicto: "excelente" (comida real/buen procesado), "ocasional" (consumo esporádico) o "evitar" (ultraprocesado con aceites refinados, palma o azúcares añadidos).
3. Evalúa si contiene ingredientes estrella mediterráneos (AOVE, frutos secos, legumbres) o aditivos críticos / edulcorantes.
4. Semáforo nutricional de salud y nutrientes críticos (azúcares, grasas saturadas, grasas totales, sal) y Grupo NOVA (1, 2, 3, 4).
5. Extrae o calcula con precisión los valores nutricionales por 100g.
6. Lista de ingredientes y aditivos detectados.
7. Propón una alternativa saludable basada en comida real.
${options.userNotes ? `NOTAS DEL USUARIO: "${options.userNotes}"` : ''}

Responde estrictamente en JSON válido con este formato:
{
  "productName": "Nombre del producto",
  "brand": "Marca",
  "category": "Categoría de producto",
  "verdict": "excelente",
  "verdictTitle": "✅ COMPRA RECOMENDADA",
  "verdictReason": "Justificación nutricional clara y concisa.",
  "trafficLightScore": "verde_oscuro",
  "trafficLightLabel": "Excelente / Muy Saludable",
  "novaGroup": 1,
  "novaLabel": "NOVA 1: Sin procesar o mínimamente procesado",
  "healthScore": 9,
  "calories100g": 120,
  "protein100g": 5.0,
  "carbs100g": 10.0,
  "fat100g": 4.0,
  "sugar100g": 2.0,
  "saturatedFat100g": 0.8,
  "salt100g": 0.5,
  "ingredientsList": ["Ingrediente 1", "Ingrediente 2"],
  "additivesFound": [
    {"code": "E-322", "name": "Lecitina", "risk": "bajo"}
  ],
  "mediterraneanQualities": ["Elaborado con 100% AOVE"],
  "warnings": ["Nota de consumo"],
  "healthyAlternative": "Alternativa de comida real"
}`;

  let lastError: any = null;

  for (const model of VISION_MODELS) {
    try {
      const response = await generateWithTimeout(
        ai,
        {
          model,
          contents: [
            {
              role: 'user',
              parts: [
                { inlineData: { mimeType, data: base64Data } },
                { text: promptText },
              ],
            },
          ],
          config: { responseMimeType: 'application/json' },
        },
        6000
      );

      const parsed = extractJsonFromText(response.text || '');
      if (parsed && parsed.productName) {
        return {
          id: 'super_ai_' + Date.now(),
          productName: parsed.productName || 'Producto Escaneado',
          brand: parsed.brand || 'Supermercado',
          category: parsed.category || 'General',
          verdict: parsed.verdict || 'excelente',
          verdictTitle: parsed.verdictTitle || '✅ PRODUCTO EVALUADO',
          verdictReason: parsed.verdictReason || 'Producto inspeccionado por IA nutricional.',
          trafficLightScore: parsed.trafficLightScore || (parsed.verdict === 'evitar' ? 'rojo' : parsed.verdict === 'ocasional' ? 'ambar' : 'verde_oscuro'),
          trafficLightLabel: parsed.trafficLightLabel || (parsed.verdict === 'evitar' ? 'Evitar / Ultraprocesado' : parsed.verdict === 'ocasional' ? 'Consumo Ocasional' : 'Excelente'),
          novaGroup: parsed.novaGroup || 1,
          novaLabel: parsed.novaLabel || 'NOVA 1: Procesamiento Mínimo',
          healthScore: parsed.healthScore || 8,
          calories100g: parsed.calories100g || 150,
          protein100g: parsed.protein100g || 5,
          carbs100g: parsed.carbs100g || 15,
          fat100g: parsed.fat100g || 5,
          sugar100g: parsed.sugar100g || 2,
          saturatedFat100g: parsed.saturatedFat100g || 1,
          salt100g: parsed.salt100g || 0.5,
          ingredientsList: Array.isArray(parsed.ingredientsList) ? parsed.ingredientsList : [],
          additivesFound: Array.isArray(parsed.additivesFound) ? parsed.additivesFound : [],
          mediterraneanQualities: Array.isArray(parsed.mediterraneanQualities) ? parsed.mediterraneanQualities : ['Ingredientes de calidad'],
          warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
          healthyAlternative: parsed.healthyAlternative || 'Acompaña con ingredientes frescos de temporada.',
          imageUri: dataUrl,
          timestamp: Date.now(),
        };
      }
    } catch (err: any) {
      console.warn(`Product vision model ${model} failed:`, err?.status || err?.message);
      lastError = err;
    }
  }

  throw lastError || new Error('No se pudo analizar el producto con visión artificial.');
}
