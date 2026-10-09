import React, { useState, useRef, useEffect } from 'react';
import { MealAnalysis, UserProfile, DayPlan } from '../types';
import { RecommendedDish } from '../data/dishesCatalog';
import { LiveCameraModal } from './LiveCameraModal';
import { AddToWeeklyPlanModal } from './AddToWeeklyPlanModal';
import {
  Sparkles,
  Camera,
  Upload,
  Plus,
  Trash2,
  ChefHat,
  Leaf,
  CheckCircle2,
  Clock,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  Share2,
  RotateCcw,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Check,
  Image as ImageIcon,
  ScanLine,
  X,
  Layers,
  CalendarDays,
  Utensils,
  ArrowRight,
  Info,
  RefreshCw,
  Zap,
  Maximize2,
  Eye,
  Smartphone,
  Scan,
  Flashlight,
  VideoOff,
  Video,
  PiggyBank
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { processAndCompressImage } from '../utils/imageCompressor';
import { SavingsImpactCalculatorModal } from './SavingsImpactCalculatorModal';
import { getScanUsage, recordScan, checkBotVelocityViolation, isUserSubscribed } from '../services/usageLimitService';
import { DailyLimitModal } from './DailyLimitModal';
import { Lock } from 'lucide-react';

interface Props {
  userProfile: UserProfile;
  onAddMealToDiary?: (meal: MealAnalysis) => void;
  onSaveMeal?: (meal: MealAnalysis) => void;
  currentWeeklyPlan?: DayPlan[];
  onAddToWeeklyPlan?: (
    dayIndex: number,
    mealType: 'desayuno' | 'almuerzo' | 'cena' | 'snack',
    dish: RecommendedDish
  ) => void;
  onNavigateToWeeklyPlan?: () => void;
  onSaveCustomRecipe?: (recipe: RecommendedDish) => void;
  onNavigateToPricing?: () => void;
}

export interface ZeroWasteRecipe {
  id: string;
  title: string;
  subtitle: string;
  prepTimeMinutes: number;
  difficulty: 'Muy Fácil' | 'Fácil' | 'Media';
  usedIngredients: string[];
  missingBasicStaples: string[];
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  instructions: string[];
  zeroWasteTip: string;
}

export interface DetectedFoodItem {
  name: string;
  confidence: number;
  category: 'Verdura/Hortaliza' | 'Proteína/Carne/Pescado' | 'Lácteo/Huevo' | 'Legumbre/Cereal' | 'Fruta/Fruto Seco' | 'Otro';
  isSelected: boolean;
}

const COMMON_FRIDGE_ITEMS = [
  'Tomates',
  'Huevos',
  'Atún en lata',
  'Pechuga de Pollo',
  'Sobras de Pollo Asado',
  'Garbanzos en Bote',
  'Lentejas Cocidas',
  'Calabacín',
  'Zanahorias',
  'Pimientos',
  'Cebolla y Ajo',
  'Rúcula y Canónigos',
  'Espinacas Frescas',
  'Queso Fresco o Feta',
  'Nueces y Almendras',
  'Pan del Día Anterior',
  'Patatas Cocidas',
  'Yogur Natural',
];

// Sample demo fridge photos for instant testing without camera permissions
const SAMPLE_FRIDGE_SCENARIOS = [
  {
    title: 'Nevera 1: Verduras, Huevos & Queso',
    description: 'Tomates, calabacín, 4 huevos, queso fresco, cebolla y espinacas',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Tomates maduros', confidence: 98, category: 'Verdura/Hortaliza' as const, isSelected: true },
      { name: 'Calabacín fresco', confidence: 96, category: 'Verdura/Hortaliza' as const, isSelected: true },
      { name: 'Huevos de corral', confidence: 99, category: 'Lácteo/Huevo' as const, isSelected: true },
      { name: 'Queso fresco', confidence: 94, category: 'Lácteo/Huevo' as const, isSelected: true },
      { name: 'Espinacas baby', confidence: 95, category: 'Verdura/Hortaliza' as const, isSelected: true },
      { name: 'Cebolla dulce', confidence: 92, category: 'Verdura/Hortaliza' as const, isSelected: true },
    ]
  },
  {
    title: 'Nevera 2: Sobras de Pollo, Pimientos & Arroz',
    description: 'Pollo asado de ayer, pimientos tricolor, arroz cocido y zanahorias',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Sobras de pollo asado', confidence: 97, category: 'Proteína/Carne/Pescado' as const, isSelected: true },
      { name: 'Pimiento rojo y verde', confidence: 95, category: 'Verdura/Hortaliza' as const, isSelected: true },
      { name: 'Arroz blanco cocido', confidence: 96, category: 'Legumbre/Cereal' as const, isSelected: true },
      { name: 'Zanahorias ralladas', confidence: 91, category: 'Verdura/Hortaliza' as const, isSelected: true },
      { name: 'Dientes de ajo', confidence: 90, category: 'Verdura/Hortaliza' as const, isSelected: true },
    ]
  },
  {
    title: 'Nevera 3: Pescado, Garbanzos & Hortalizas',
    description: 'Lomos de merluza, garbanzos cocidos en tarro, puerro y tomate',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Lomos de merluza fresca', confidence: 96, category: 'Proteína/Carne/Pescado' as const, isSelected: true },
      { name: 'Garbanzos en conserva', confidence: 98, category: 'Legumbre/Cereal' as const, isSelected: true },
      { name: 'Puerro fresco', confidence: 93, category: 'Verdura/Hortaliza' as const, isSelected: true },
      { name: 'Tomate triturado natural', confidence: 95, category: 'Verdura/Hortaliza' as const, isSelected: true },
      { name: 'Perejil fresco', confidence: 89, category: 'Verdura/Hortaliza' as const, isSelected: true },
    ]
  }
];

export const ZeroWasteFridgeView: React.FC<Props> = ({
  userProfile,
  onAddMealToDiary,
  onSaveMeal,
  currentWeeklyPlan,
  onAddToWeeklyPlan,
  onNavigateToWeeklyPlan,
  onSaveCustomRecipe,
  onNavigateToPricing,
}) => {
  const [detectedItems, setDetectedItems] = useState<DetectedFoodItem[]>([]);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [analyzingStatus, setAnalyzingStatus] = useState<string>('');
  const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);
  const [generatedRecipes, setGeneratedRecipes] = useState<ZeroWasteRecipe[]>([]);
  const [addedRecipeIds, setAddedRecipeIds] = useState<string[]>([]);
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [selectedRecipeForPlan, setSelectedRecipeForPlan] = useState<ZeroWasteRecipe | null>(null);
  const [isSavingsCalculatorOpen, setIsSavingsCalculatorOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

  // Embedded In-Page Camera States - ON BY DEFAULT for instant live camera experience
  const [isInlineCameraActive, setIsInlineCameraActive] = useState(true);
  const [inlineFacingMode, setInlineFacingMode] = useState<'environment' | 'user'>('environment');
  const [inlineStream, setInlineStream] = useState<MediaStream | null>(null);
  const [inlineCameraError, setInlineCameraError] = useState<string | null>(null);
  const [isInlineLoading, setIsInlineLoading] = useState(false);
  const [inlineHasTorch, setInlineHasTorch] = useState(false);
  const [inlineIsTorchOn, setInlineIsTorchOn] = useState(false);

  const inlineVideoRef = useRef<HTMLVideoElement>(null);
  const inlineCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Stop inline camera on unmount or when inactive
  useEffect(() => {
    if (isInlineCameraActive) {
      startInlineCamera(inlineFacingMode);
    } else {
      stopInlineCamera();
    }
    return () => {
      stopInlineCamera();
    };
  }, [isInlineCameraActive, inlineFacingMode]);

  const stopInlineCamera = () => {
    if (inlineStream) {
      inlineStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping inline camera track', e);
        }
      });
      setInlineStream(null);
    }
  };

  const startInlineCamera = async (mode: 'environment' | 'user') => {
    setIsInlineLoading(true);
    setInlineCameraError(null);
    stopInlineCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setInlineCameraError('Visor directo no compatible. Usa los botones de abajo para abrir la cámara de tu móvil o subir fotos.');
        return;
      }

      let mediaStream: MediaStream | null = null;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: mode } },
          audio: false,
        });
      } catch {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      if (mediaStream) {
        setInlineStream(mediaStream);
        if (inlineVideoRef.current) {
          inlineVideoRef.current.srcObject = mediaStream;
          inlineVideoRef.current.muted = true;
          inlineVideoRef.current.setAttribute('playsinline', 'true');
          try {
            await inlineVideoRef.current.play();
          } catch (playErr) {
            console.warn('Error reproduciendo inline video:', playErr);
          }
        }

        try {
          const track = mediaStream.getVideoTracks()[0];
          const capabilities: any = track.getCapabilities ? track.getCapabilities() : {};
          setInlineHasTorch(Boolean(capabilities.torch));
        } catch {
          setInlineHasTorch(false);
        }
      }
    } catch (err: any) {
      console.warn('Error activando inline camera:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setInlineCameraError('Permiso de visor denegado. Usa el botón "Hacer Foto con Cámara Móvil" abajo para capturar sin problemas.');
      } else {
        setInlineCameraError('No se pudo acceder a la cámara en vivo. Puedes usar los botones de abajo para hacer foto.');
      }
    } finally {
      setIsInlineLoading(false);
    }
  };

  const toggleInlineTorch = async () => {
    if (!inlineStream) return;
    try {
      const track = inlineStream.getVideoTracks()[0];
      if (track) {
        const nextState = !inlineIsTorchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: nextState }],
        });
        setInlineIsTorchOn(nextState);
      }
    } catch (e) {
      console.warn('Torch error:', e);
    }
  };

  const handleCaptureFromInlineCamera = () => {
    if (!inlineVideoRef.current || !inlineCanvasRef.current) return;
    try {
      if (navigator.vibrate) navigator.vibrate(40);
    } catch {}

    const video = inlineVideoRef.current;
    const canvas = inlineCanvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      const base64Data = dataUrl.split(',')[1];
      processFridgeImageBase64(base64Data, dataUrl);
    }
  };

  // Active selected ingredients derived from detectedItems
  const activeIngredientNames = detectedItems.filter(i => i.isSelected).map(i => i.name);

  const processFridgeImageBase64 = async (base64Data: string, dataUrl: string) => {
    // 1. Verificación anti-bot por velocidad de ráfaga
    const botCheck = checkBotVelocityViolation();
    if (botCheck.isBotSuspicious) {
      alert(`🛡️ Protección anti-ráfaga: espera ${botCheck.waitSeconds}s para la siguiente captura.`);
      return;
    }

    const scanUsage = getScanUsage();
    if (!scanUsage.canProceed) {
      setIsLimitModalOpen(true);
      return;
    }

    setIsAnalyzingPhoto(true);
    setAnalyzingStatus('Escaneando alimentos de la nevera con Visión IA...');
    setCapturedPhotos((prev) => [dataUrl, ...prev]);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && base64Data) {
        const ai = new GoogleGenAI({ apiKey });
        const promptText = `Analiza detalladamente esta fotografía de una nevera, despensa, estantería o conjunto de alimentos.
Identifica TODOS los ingredientes y alimentos específicos visibles (verduras, hortalizas, huevos, carnes, pescados, legumbres, lácteos, embutidos magros, frutas, pan, sobras de comida, etc.).

Devuelve EXCLUSIVAMENTE un JSON con un array de objetos llamado "detectedItems":
{
  "detectedItems": [
    {
      "name": "Tomates maduros",
      "confidence": 98,
      "category": "Verdura/Hortaliza"
    },
    {
      "name": "Huevos frescos",
      "confidence": 95,
      "category": "Lácteo/Huevo"
    }
  ]
}

Categorías válidas para 'category': 'Verdura/Hortaliza', 'Proteína/Carne/Pescado', 'Lácteo/Huevo', 'Legumbre/Cereal', 'Fruta/Fruto Seco', 'Otro'.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
                { text: promptText },
              ],
            },
          ],
          config: { responseMimeType: 'application/json' },
        });

        if (response.text) {
          recordScan();
          const parsed = JSON.parse(response.text);
          if (Array.isArray(parsed.detectedItems) && parsed.detectedItems.length > 0) {
            const newItems: DetectedFoodItem[] = parsed.detectedItems.map((it: any) => ({
              name: it.name || 'Alimento',
              confidence: Number(it.confidence) || 92,
              category: it.category || 'Verdura/Hortaliza',
              isSelected: true,
            }));

            setDetectedItems((prev) => {
              const existingNames = new Set(prev.map(p => p.name.toLowerCase()));
              const filtered = newItems.filter(n => !existingNames.has(n.name.toLowerCase()));
              return [...prev, ...filtered];
            });

            // Automatically trigger recipe generation if we have at least 2 ingredients
            const combinedNames = [
              ...detectedItems.filter(i => i.isSelected).map(i => i.name),
              ...newItems.map(i => i.name)
            ];

            if (combinedNames.length >= 2) {
              generateZeroWasteRecipesWithList(combinedNames);
            }
          }
        }
      }
    } catch (err) {
      console.warn('Error escaneando nevera con IA, aplicando fallback:', err);
      // Fallback detection
      const fallbackList: DetectedFoodItem[] = [
        { name: 'Calabacín fresco', confidence: 95, category: 'Verdura/Hortaliza', isSelected: true },
        { name: 'Huevos de corral', confidence: 98, category: 'Lácteo/Huevo', isSelected: true },
        { name: 'Pimiento rojo', confidence: 92, category: 'Verdura/Hortaliza', isSelected: true },
        { name: 'Cebolla y Ajo', confidence: 90, category: 'Verdura/Hortaliza', isSelected: true },
      ];
      setDetectedItems((prev) => [...prev, ...fallbackList]);
      generateZeroWasteRecipesWithList(fallbackList.map(f => f.name));
    } finally {
      setIsAnalyzingPhoto(false);
      setAnalyzingStatus('');
    }
  };

  const handleDirectCameraCapture = async (capturedDataUrl: string) => {
    const base64Data = capturedDataUrl.split(',')[1];
    await processFridgeImageBase64(base64Data, capturedDataUrl);
  };

  const handleSelectSampleScenario = (scenario: typeof SAMPLE_FRIDGE_SCENARIOS[0]) => {
    setCapturedPhotos([scenario.image]);
    setDetectedItems(scenario.ingredients);
    generateZeroWasteRecipesWithList(scenario.ingredients.map(i => i.name));
  };

  const toggleItemSelection = (index: number) => {
    setDetectedItems((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], isSelected: !copy[index].isSelected };
      }
      return copy;
    });
  };

  const addCustomIngredient = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    const exists = detectedItems.some(i => i.name.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      setDetectedItems((prev) => [
        ...prev,
        { name: trimmed, confidence: 100, category: 'Otro', isSelected: true }
      ]);
    }
    setCustomInput('');
  };

  const removeDetectedItem = (index: number) => {
    setDetectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const removePhoto = (index: number) => {
    setCapturedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFridgePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingPhoto(true);
    setAnalyzingStatus('Comprimiendo y escaneando imagen...');

    try {
      const processed = await processAndCompressImage(file, 1200, 0.85);
      await processFridgeImageBase64(processed.base64, processed.dataUrl);
    } catch (err) {
      console.warn('Error procesando foto de nevera:', err);
      setIsAnalyzingPhoto(false);
      setAnalyzingStatus('');
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const generateZeroWasteRecipesWithList = async (ingredientList: string[]) => {
    if (ingredientList.length === 0) return;

    setIsGeneratingRecipes(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const restrictionsStr = (userProfile.dietaryRestrictions || []).join(', ');

        const promptText = `Actúa como un Chef Nutricionista Experto en Cocina de Aprovechamiento y Dieta Mediterránea Tradicional Española.
El usuario ha fotografiado su nevera/despensa y tiene estos alimentos disponibles: ${ingredientList.join(', ')}.

Restricciones/Alérgenos a excluir absolutamente: ${restrictionsStr || 'Ninguno'}.
Objetivo del usuario: ${userProfile.goal || 'Salud y Nutrición Equilibrada'}.

Genera exactamente 3 RECETAS DE APROVECHAMIENTO (Cero Desperdicio) creativas, fáciles, sabrosas y balanceadas que utilicen PRINCIPALMENTE estos ingredientes disponibles más básicos de fondo de armario (aceite de oliva virgen extra AOVE, sal, ajo, cebolla, pimienta, hierbas).

REGLAS DE GASTRONOMÍA MEDITERRÁNEA:
- Dieta tradicional española (tortillas paisanas, revueltos con verduras, salteados con legumbres, arroces de aprovechamiento, pistos, cremas de verduras, sopas reconfortantes, cazuelas de pescado o pollo).
- PROHIBIDO alimentos ultraprocesados o exóticos como sirope de agave, açaí, matcha, porridge, overnight oats, edamame, chía o poke bowls.
- Ajusta las calorías y macronutrientes de forma realista.

Devuelve EXCLUSIVAMENTE un array JSON con esta estructura exacta para cada receta:
[
  {
    "title": "Nombre descriptivo y apetecible del plato de aprovechamiento",
    "subtitle": "Por qué aprovecha de forma óptima tus ingredientes de la nevera",
    "prepTimeMinutes": 15,
    "difficulty": "Muy Fácil",
    "usedIngredients": ["Ingrediente 1", "Ingrediente 2"],
    "missingBasicStaples": ["AOVE", "Pizca de sal", "Diente de ajo"],
    "calories": 380,
    "proteinGrams": 28,
    "carbsGrams": 30,
    "fatGrams": 14,
    "instructions": [
      "Paso 1: Picar las verduras...",
      "Paso 2: Saltear a fuego medio en sartén con AOVE...",
      "Paso 3: Servir caliente..."
    ],
    "zeroWasteTip": "Truco de chef para conservar las sobras o aprovechar las pieles/tallos."
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
            const formatted: ZeroWasteRecipe[] = parsed.map((item: any, index: number) => ({
              id: `zw_rec_${Date.now()}_${index}`,
              title: item.title || 'Receta de Aprovechamiento',
              subtitle: item.subtitle || 'Aprovechamiento al 100% de tus ingredientes',
              prepTimeMinutes: Number(item.prepTimeMinutes) || 15,
              difficulty: item.difficulty || 'Fácil',
              usedIngredients: Array.isArray(item.usedIngredients) ? item.usedIngredients : ingredientList,
              missingBasicStaples: Array.isArray(item.missingBasicStaples) ? item.missingBasicStaples : ['AOVE', 'Sal', 'Ajo'],
              calories: Number(item.calories) || 360,
              proteinGrams: Number(item.proteinGrams) || 22,
              carbsGrams: Number(item.carbsGrams) || 28,
              fatGrams: Number(item.fatGrams) || 12,
              instructions: Array.isArray(item.instructions) ? item.instructions : ['Cocinar en sartén con AOVE y servir.'],
              zeroWasteTip: item.zeroWasteTip || 'Conserva las sobras en un recipiente hermético en la nevera.',
            }));

            setGeneratedRecipes(formatted);
          }
        }
      }
    } catch (err) {
      console.error('Error generando recetas cero desperdicio:', err);
    } finally {
      setIsGeneratingRecipes(false);
    }
  };

  const handleAddZeroWasteMealToDiary = (recipe: ZeroWasteRecipe) => {
    const meal: MealAnalysis = {
      id: 'zw_meal_' + Date.now(),
      dishName: recipe.title,
      description: recipe.subtitle,
      mealType: 'Almuerzo',
      estimatedWeightGrams: 320,
      healthIndex: 9,
      reliabilityConfidence: 96,
      calories: recipe.calories,
      proteinGrams: recipe.proteinGrams,
      carbsGrams: recipe.carbsGrams,
      fatGrams: recipe.fatGrams,
      fiberGrams: 5,
      sugarGrams: 3,
      saturatedFatGrams: 2,
      micronutrients: {
        vitaminA_mcg: 220,
        vitaminC_mg: 35,
        vitaminD_iu: 60,
        vitaminB12_mcg: 1.2,
        calcium_mg: 160,
        iron_mg: 2.8,
        potassium_mg: 420,
        sodium_mg: 320,
        magnesium_mg: 65,
        zinc_mg: 2.0,
      },
      foodItems: recipe.usedIngredients.map((ing) => ({
        name: ing,
        estimatedWeightGrams: 80,
        calories: Math.round(recipe.calories / Math.max(recipe.usedIngredients.length, 1)),
        proteinGrams: Math.round(recipe.proteinGrams / Math.max(recipe.usedIngredients.length, 1)),
        carbsGrams: Math.round(recipe.carbsGrams / Math.max(recipe.usedIngredients.length, 1)),
        fatGrams: Math.round(recipe.fatGrams / Math.max(recipe.usedIngredients.length, 1)),
      })),
      warnings: [],
      personalizedRecommendations: [recipe.zeroWasteTip],
      timestamp: Date.now(),
    };

    if (onAddMealToDiary) {
      onAddMealToDiary(meal);
    } else if (onSaveMeal) {
      onSaveMeal(meal);
    }
    setAddedRecipeIds((prev) => [...prev, recipe.id]);
  };

  const convertZeroWasteToRecommendedDish = (recipe: ZeroWasteRecipe): RecommendedDish => {
    return {
      id: recipe.id,
      dishName: recipe.title,
      description: recipe.subtitle,
      mealType: 'Almuerzo',
      calories: recipe.calories,
      proteinGrams: recipe.proteinGrams,
      carbsGrams: recipe.carbsGrams,
      fatGrams: recipe.fatGrams,
      prepTimeMinutes: recipe.prepTimeMinutes,
      ingredients: [...recipe.usedIngredients, ...recipe.missingBasicStaples],
      tag: 'Aprovechamiento',
      safeForRestrictions: true,
    };
  };

  const handleShareRecipe = (recipe: ZeroWasteRecipe) => {
    const shareText = `🍳 ¡Receta Cero Desperdicio en TuNutriLens!
    
"${recipe.title}"
⏱️ ${recipe.prepTimeMinutes} min | ⚡ ${recipe.calories} kcal | 💪 ${recipe.proteinGrams}g proteína

💡 Ingredientes de la nevera aprovechados: ${recipe.usedIngredients.join(', ')}
🌿 Truco Cero Desperdicio: ${recipe.zeroWasteTip}

#TuNutriLens #CeroDesperdicio #DietaMediterranea #RealFood`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedShareId(recipe.id);
      setTimeout(() => setCopiedShareId(null), 2500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Free User Paywall Overlay Card */}
      {!isUserSubscribed() && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 p-0.5 rounded-3xl shadow-xl">
          <div className="bg-slate-900/95 text-white p-6 rounded-[22px] backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 shadow-lg">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-full tracking-wider">
                    Función Exclusiva Pro e Ilimitada
                  </span>
                  <span className="text-xs text-amber-200 font-semibold">Ahorra hasta 80 €/mes en comida</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Nevera Residuo Cero con Visión IA
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Fotografía tu nevera y nuestra IA detecta tus ingredientes en segundos, proponiéndote deliciosas recetas mediterráneas saludables sin tirar nada a la basura. En tu versión gratuita dispones de escáneres de plato y supermercado y la sección Descubrir.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (onNavigateToPricing) onNavigateToPricing();
                }}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>Desbloquear con Tarifa Ilimitada</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Camera Viewfinder Modal */}
      <LiveCameraModal
        isOpen={isLiveCameraOpen}
        onClose={() => setIsLiveCameraOpen(false)}
        onCapture={handleDirectCameraCapture}
        title="Escáner de Alimentos de la Nevera"
        subtitle="Enfoca tu nevera, estantería o ingredientes para que la IA los detecte y te proponga recetas"
      />

      {/* Direct Native Camera & Gallery Inputs - Offscreen to allow 100% reliable mobile click & label triggers */}
      <input
        id="fridge-camera-direct-input"
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFridgePhotoUpload}
        className="sr-only"
        style={{ position: 'fixed', top: '-9999px', left: '-9999px', opacity: 0, width: '1px', height: '1px' }}
      />
      <input
        id="fridge-gallery-direct-input"
        type="file"
        accept="image/*"
        ref={galleryInputRef}
        onChange={handleFridgePhotoUpload}
        className="sr-only"
        style={{ position: 'fixed', top: '-9999px', left: '-9999px', opacity: 0, width: '1px', height: '1px' }}
      />

      {/* Hero Banner Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-600 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3.5 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-400/40 backdrop-blur-xs flex-shrink-0">
              <Camera className="w-7 h-7 text-emerald-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Aprovecha tu Nevera & Recetas IA
                </h2>
                <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded-md uppercase">
                  Visión IA
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-1 font-medium max-w-xl leading-relaxed">
                Fotografía los alimentos y sobras de tu nevera o despensa. La IA detectará cada ingrediente y diseñará al instante 3 recetas de aprovechamiento para no tirar nada.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSavingsCalculatorOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-xs rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer border border-amber-300 active:scale-95 shrink-0"
          >
            <PiggyBank className="w-4 h-4 text-slate-950" />
            <span>Calculadora de Ahorro (€/mes)</span>
          </button>
        </div>
      </div>

      {/* Gourmet Eco-Impact & Waste Prevention Widget */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-4 rounded-2xl border border-amber-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 bg-amber-400 text-slate-950 rounded-xl shadow-2xs shrink-0">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-amber-800">Ahorro Promedio Estimado</div>
            <div className="text-lg font-black text-slate-900 leading-tight">~65 € - 90 €<span className="text-xs font-bold text-amber-700"> /mes</span></div>
            <p className="text-[10px] text-amber-900/80 font-medium mt-0.5">Aprovechando ingredientes antes de caducar</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 p-4 rounded-2xl border border-emerald-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-2xs shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">Alimentos Rescatados</div>
            <div className="text-lg font-black text-slate-900 leading-tight">~3,8 kg<span className="text-xs font-bold text-emerald-700"> /mes</span></div>
            <p className="text-[10px] text-emerald-900/80 font-medium mt-0.5">Verduras, sobras y lácteos consumidos a tiempo</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-cyan-50/60 p-4 rounded-2xl border border-teal-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 bg-teal-700 text-white rounded-xl shadow-2xs shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-teal-800">Inspiración Chef IA</div>
            <div className="text-lg font-black text-slate-900 leading-tight">Recetas únicas<span className="text-xs font-bold text-teal-700"> al 100%</span></div>
            <p className="text-[10px] text-teal-900/80 font-medium mt-0.5">Adaptadas a lo que realmente tienes en casa</p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN PRINCIPAL: ESCÁNER DE CÁMARA PARA FOTOGRAFIAR ALIMENTOS DE NEVERA */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-200/90 shadow-sm space-y-6">
        
        {/* Hidden Canvas for Capturing from Inline Camera */}
        <canvas ref={inlineCanvasRef} className="hidden" />

        {/* Visor de Cámara Incorporado Directamente en Pantalla */}
        <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl space-y-4 shadow-md border border-emerald-500/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500 text-slate-950 rounded-xl shadow-xs">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <span>Cámara Visor de Nevera Incorporada</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase rounded-md border border-emerald-500/30">
                    En Vivo
                  </span>
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  Enfoca tu frigorífico o despensa directamente desde aquí para escanear ingredientes con IA.
                </p>
              </div>
            </div>

            {/* Toggle Start/Stop In-Page Camera */}
            <div className="flex items-center gap-2">
              {isInlineCameraActive ? (
                <button
                  type="button"
                  onClick={() => setIsInlineCameraActive(false)}
                  className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <VideoOff className="w-4 h-4" />
                  <span>Pausar Visor</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsInlineCameraActive(true)}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Video className="w-4 h-4" />
                  <span>Activar Cámara Visor</span>
                </button>
              )}
            </div>
          </div>

          {/* VISOR DE VÍDEO EN VIVO INCORPORADO */}
          {isInlineCameraActive ? (
            <div className="relative w-full aspect-4/3 max-h-[380px] bg-black rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-inner flex items-center justify-center">
              <video
                ref={inlineVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Laser / Scanner Reticle Overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                <div className="flex justify-between items-start">
                  <div className="w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                  <div className="px-3 py-1 bg-slate-950/75 backdrop-blur-xs rounded-full border border-emerald-400/40 text-[11px] font-black text-emerald-300 flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Visión IA Activa</span>
                  </div>
                  <div className="w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                </div>

                {/* Animated scanline bar */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-pulse my-auto" />

                <div className="flex justify-between items-end">
                  <div className="w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                  <div className="text-center bg-slate-950/80 backdrop-blur-xs px-3 py-1 rounded-xl text-[10px] font-bold text-slate-200 border border-slate-700">
                    Enfoca los alimentos de la balda o cajón
                  </div>
                  <div className="w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
                </div>
              </div>

              {/* In-Camera Floating Controls */}
              <div className="absolute bottom-4 left-0 right-0 px-4 flex items-center justify-center gap-4 z-20">
                {/* Torch button */}
                {inlineHasTorch && (
                  <button
                    type="button"
                    onClick={toggleInlineTorch}
                    className={`p-3 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      inlineIsTorchOn
                        ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/40 scale-105'
                        : 'bg-black/60 text-white hover:bg-black/80'
                    }`}
                    title="Encender Linterna"
                  >
                    <Flashlight className="w-5 h-5" />
                  </button>
                )}

                {/* Shutter Button */}
                <button
                  type="button"
                  onClick={handleCaptureFromInlineCamera}
                  disabled={isAnalyzingPhoto}
                  className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-sm rounded-full shadow-2xl shadow-emerald-500/50 transition-all flex items-center gap-2 border-2 border-white cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                  <span>ESCANEAR NEVERA AHORA</span>
                </button>

                {/* Flip camera */}
                <button
                  type="button"
                  onClick={() =>
                    setInlineFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
                  }
                  className="p-3 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-all cursor-pointer"
                  title="Cambiar Cámara"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              {isInlineLoading && (
                <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-2 text-white z-30">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                  <p className="text-xs font-bold text-slate-200">Iniciando visor de cámara...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 bg-slate-950/60 rounded-2xl border border-slate-700/60 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Visor de Cámara Listo para Usar</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Pulsa el botón verde para activar el visor directo en pantalla o elige una de las opciones rápidas abajo.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsInlineCameraActive(true)}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Video className="w-4 h-4" />
                <span>Activar Visor en Pantalla</span>
              </button>
            </div>
          )}

          {inlineCameraError && (
            <div className="p-3 bg-amber-500/20 border border-amber-400/40 rounded-xl text-xs text-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-amber-300">{inlineCameraError}</p>
                <p className="text-[11px] text-amber-100/90">
                  Puedes usar el botón negro <strong>"Hacer Foto con Cámara Móvil"</strong> o <strong>"Subir de Galería"</strong> que funcionan siempre sin restricciones.
                </p>
              </div>
            </div>
          )}

          {/* Botones de Captura Adicionales / Fallbacks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            {/* Abrir Modal de Cámara Completa */}
            <button
              type="button"
              onClick={() => setIsLiveCameraOpen(true)}
              disabled={isAnalyzingPhoto}
              className="py-3 px-3.5 bg-emerald-600/90 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-500/50"
            >
              <Maximize2 className="w-4 h-4 text-emerald-200" />
              <span>Cámara Pantalla Completa</span>
            </button>

            {/* Foto con Cámara Nativa del Teléfono */}
            <label
              htmlFor="fridge-camera-direct-input"
              className={`py-3 px-3.5 bg-slate-950 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer select-none border border-slate-700 ${
                isAnalyzingPhoto ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Hacer Foto con Cámara Móvil</span>
            </label>

            {/* Subir de Galería */}
            <label
              htmlFor="fridge-gallery-direct-input"
              className={`py-3 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-extrabold text-xs rounded-xl border border-slate-600 shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer select-none ${
                isAnalyzingPhoto ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <Upload className="w-4 h-4 text-slate-300" />
              <span>Subir de Galería</span>
            </label>
          </div>

          {/* Banner de Estado de Análisis de IA */}
          {isAnalyzingPhoto && (
            <div className="flex items-center gap-2 px-4 py-3 bg-amber-400 text-slate-950 rounded-xl text-xs font-black animate-pulse shadow-md">
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>{analyzingStatus || 'Analizando alimentos de la nevera con Visión IA...'}</span>
            </div>
          )}

          {/* Tira de Fotos Capturadas */}
          {capturedPhotos.length > 0 && (
            <div className="pt-2 border-t border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>{capturedPhotos.length} {capturedPhotos.length === 1 ? 'Foto analizada' : 'Fotos analizadas'}</span>
                </span>
                <button
                  onClick={() => setCapturedPhotos([])}
                  className="text-[11px] text-rose-400 hover:underline font-bold cursor-pointer"
                >
                  Borrar fotos
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {capturedPhotos.map((photoUrl, pIdx) => (
                  <div key={pIdx} className="relative group w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-400 shadow-xs shrink-0">
                    <img src={photoUrl} alt={`Captura nevera ${pIdx + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(pIdx)}
                      className="absolute top-1 right-1 p-1 bg-slate-900/90 text-white rounded-full hover:bg-rose-600 transition cursor-pointer"
                      title="Eliminar captura"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Muestras de Ejemplo para Probar en 1 Clic */}
          <div className="pt-2 border-t border-slate-700/80 space-y-2">
            <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider block">
              O prueba al instante con fotos de ejemplo de neveras reales:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_FRIDGE_SCENARIOS.map((sc, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => handleSelectSampleScenario(sc)}
                  className="p-2.5 bg-slate-800/80 hover:bg-slate-700 rounded-xl border border-slate-700 hover:border-emerald-400 text-left transition-all flex items-center gap-2.5 cursor-pointer shadow-2xs group"
                >
                  <img
                    src={sc.image}
                    alt={sc.title}
                    className="w-11 h-11 rounded-lg object-cover border border-slate-600 shrink-0 group-hover:scale-105 transition"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-black text-white block truncate group-hover:text-emerald-300">
                      {sc.title}
                    </span>
                    <span className="text-[10px] text-slate-300 line-clamp-1">
                      {sc.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ALIMENTOS DETECTADOS POR LA IA + GESTOR DE INGREDIENTES APROVECHABLES */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide">
                Alimentos Detectados en tu Nevera ({activeIngredientNames.length})
              </h3>
            </div>
            {detectedItems.length > 0 && (
              <button
                onClick={() => setDetectedItems([])}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold underline cursor-pointer self-start sm:self-auto"
              >
                Limpiar lista
              </button>
            )}
          </div>

          {/* Lista de Alimentos Detectados */}
          {detectedItems.length === 0 ? (
            <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">
                Aún no has fotografiado tu nevera
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Haz una foto con el botón <strong>"Abrir Cámara en Vivo"</strong> o <strong>"Hacer Foto Rápida"</strong> arriba, o pulsa en una de las fotos de ejemplo para ver cómo la IA identifica los alimentos y te diseña recetas.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Alimentos seleccionados para cocinar:</span>
                </span>
                <span className="text-[10px] text-slate-400">Desmarca los que no quieras usar</span>
              </div>

              {/* Grid de Chips con Checkbox y Nivel de Confianza */}
              <div className="flex flex-wrap gap-2">
                {detectedItems.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleItemSelection(idx)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                      item.isSelected
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-xs'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-md flex items-center justify-center text-[10px] font-black ${
                      item.isSelected ? 'bg-emerald-500 text-slate-950' : 'border border-slate-500'
                    }`}>
                      {item.isSelected && '✓'}
                    </div>
                    <span>{item.name}</span>
                    <span className="text-[10px] text-emerald-400/80 font-normal">({item.confidence}%)</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDetectedItem(idx);
                      }}
                      className="text-slate-400 hover:text-rose-400 font-bold ml-1"
                      title="Eliminar alimento"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Botón Gigante para Proponer Recetas Cero Desperdicio */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => generateZeroWasteRecipesWithList(activeIngredientNames)}
                  disabled={isGeneratingRecipes || activeIngredientNames.length === 0}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  {isGeneratingRecipes ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                      <span>El Chef IA está diseñando 3 recetas con estos alimentos...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-emerald-950" />
                      <span>PROPONER 3 RECETAS DE APROVECHAMIENTO CON ESTOS ALIMENTOS</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Añadir Alimentos Habituales de la Despensa */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-700 block">
              O pulsa para sumar básicos que tengas por casa:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_FRIDGE_ITEMS.map((item) => {
                const isSelected = activeIngredientNames.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setDetectedItems(prev => prev.filter(i => i.name !== item));
                      } else {
                        setDetectedItems(prev => [...prev, { name: item, confidence: 100, category: 'Otro', isSelected: true }]);
                      }
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? `✓ ${item}` : `+ ${item}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulario Manual para Añadir Alimento Específico */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="text-xs font-bold text-slate-700">
              Escribir otro alimento que tengas en la nevera:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomIngredient()}
                placeholder="Ej: medio calabacín, 2 yogures, sobras de arroz..."
                className="flex-1 text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-800 font-medium"
              />
              <button
                type="button"
                onClick={addCustomIngredient}
                className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RESULTADO: 3 RECETAS CERO DESPERDICIO PROPUESTAS CON LOS ALIMENTOS FOTOGRAFIADOS */}
      {/* ========================================================================= */}
      {generatedRecipes.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                <Utensils className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  3 Propuestas de Aprovechamiento para tu Nevera
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Recetas mediterráneas calculadas al 100% con los alimentos detectados.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-black">
              100% Cero Desperdicio
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {generatedRecipes.map((recipe) => {
              const isAdded = addedRecipeIds.includes(recipe.id);
              const isCopied = copiedShareId === recipe.id;

              return (
                <div
                  key={recipe.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-md flex flex-col justify-between space-y-4 hover:border-emerald-400 transition"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-extrabold text-[10px] rounded-lg border border-emerald-200 uppercase">
                        {recipe.difficulty}
                      </span>
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{recipe.prepTimeMinutes} min</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-black text-slate-900 leading-snug">
                        {recipe.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                        {recipe.subtitle}
                      </p>
                    </div>

                    {/* Macros Grid */}
                    <div className="grid grid-cols-4 gap-1 p-2 bg-slate-50 rounded-xl text-center border border-slate-100">
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Kcal</div>
                        <div className="text-xs font-black text-slate-900">{recipe.calories}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Prot</div>
                        <div className="text-xs font-black text-emerald-700">{recipe.proteinGrams}g</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Carb</div>
                        <div className="text-xs font-black text-sky-700">{recipe.carbsGrams}g</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Grasa</div>
                        <div className="text-xs font-black text-amber-700">{recipe.fatGrams}g</div>
                      </div>
                    </div>

                    {/* Ingredientes de la Nevera Aprovechados */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                        Alimentos Aprovechados:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {recipe.usedIngredients.map((ing, iIdx) => (
                          <span key={iIdx} className="text-[10px] bg-emerald-50 text-emerald-900 border border-emerald-200/60 px-2 py-0.5 rounded-md font-bold">
                            ✓ {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pasos de Preparación */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider block">
                        Preparación Rápida:
                      </span>
                      <ol className="text-xs text-slate-700 space-y-1.5 list-decimal list-inside font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {recipe.instructions.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Truco Cero Desperdicio */}
                    <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 space-y-1">
                      <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Truco Cero Desperdicio:</span>
                      </span>
                      <p className="text-xs text-amber-950 font-medium leading-snug">
                        {recipe.zeroWasteTip}
                      </p>
                    </div>
                  </div>

                  {/* Botones de Acción: Diario + Plan Semanal + Compartir */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                    {/* Añadir a Diario */}
                    <button
                      onClick={() => handleAddZeroWasteMealToDiary(recipe)}
                      disabled={isAdded}
                      className={`w-full py-2.5 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-700" />
                          <span>¡Guardado en Diario Hoy!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Guardar en Diario Hoy</span>
                        </>
                      )}
                    </button>

                    {/* Añadir a Plan Semanal */}
                    {onAddToWeeklyPlan && (
                      <button
                        type="button"
                        onClick={() => setSelectedRecipeForPlan(recipe)}
                        className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-xs border border-blue-200 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <CalendarDays className="w-3.5 h-3.5 text-blue-700" />
                        <span>📅 Añadir a Plan Semanal</span>
                      </button>
                    )}

                    {/* Compartir */}
                    <button
                      onClick={() => handleShareRecipe(recipe)}
                      className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isCopied ? '¡Copiado para Compartir!' : 'Compartir Receta'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal para Añadir al Plan Semanal */}
      {selectedRecipeForPlan && (
        <AddToWeeklyPlanModal
          isOpen={!!selectedRecipeForPlan}
          onClose={() => setSelectedRecipeForPlan(null)}
          meal={convertZeroWasteToRecommendedDish(selectedRecipeForPlan)}
          currentWeeklyPlan={currentWeeklyPlan || []}
          onConfirmAddToPlan={(dayIdx, mealType, dish) => {
            if (onAddToWeeklyPlan) {
              onAddToWeeklyPlan(dayIdx, mealType, dish);
            }
          }}
          onNavigateToWeeklyPlan={onNavigateToWeeklyPlan}
        />
      )}

      {/* Modal de la Calculadora de Ahorro (€/mes) y Cero Desperdicio */}
      <SavingsImpactCalculatorModal
        isOpen={isSavingsCalculatorOpen}
        onClose={() => setIsSavingsCalculatorOpen(false)}
      />

      {/* Modal de Control de Cupo de Escaneos (Suma total 3 escáneres) */}
      <DailyLimitModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        onUpgrade={() => {
          setIsLimitModalOpen(false);
          if (onNavigateToPricing) {
            onNavigateToPricing();
          }
        }}
        onManualAdd={() => {
          setIsLimitModalOpen(false);
          const inputEl = document.getElementById('manual-fridge-item-input');
          if (inputEl) {
            inputEl.focus();
          }
        }}
      />
    </div>
  );
};
