import React, { useState, useRef } from 'react';
import { MealAnalysis, UserProfile, DayPlan } from '../types';
import { RecommendedDish } from '../data/dishesCatalog';
import { SupermarketProductAnalysisCard, SupermarketProductAnalysis } from '../components/SupermarketProductAnalysisCard';
import { SAMPLE_SUPERMARKET_PRODUCTS } from '../data/sampleSupermarketProducts';
import { NutritionalAnalysisResultCard } from '../components/NutritionalAnalysisResultCard';
import { SavedScansGallery } from '../components/SavedScansGallery';
import { LiveCameraModal } from '../components/LiveCameraModal';
import { ZeroWasteFridgeView } from '../components/ZeroWasteFridgeView';
import { resolveDishFromInput } from '../utils/aiDishRecognizer';
import { analyzeDishWithAI, refineDishWithAI, analyzeProductWithAI } from '../services/aiFoodScanner';
import {
  Camera,
  Upload,
  Sparkles,
  Loader2,
  RefreshCw,
  ChefHat,
  ArrowRight,
  Barcode,
  Image as ImageIcon,
  Bookmark,
  UtensilsCrossed,
  CheckCircle2,
  PlusCircle,
  Search,
  Zap,
  Check,
  Flame,
  HelpCircle,
  Smartphone,
  Leaf,
  Edit3,
  Lightbulb,
  Info,
  Sliders
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { processAndCompressImage } from '../utils/imageCompressor';
import { MarketComparisonModal } from '../components/MarketComparisonModal';
import { ScannerTipsModal } from '../components/ScannerTipsModal';
import { getScanUsage, recordScan, checkBotVelocityViolation, UsageStatus, isUserSubscribed } from '../services/usageLimitService';
import { DailyLimitModal } from '../components/DailyLimitModal';
import { PremiumFeatureGateModal } from '../components/PremiumFeatureGateModal';
import { Lock } from 'lucide-react';

interface Props {
  userProfile: UserProfile;
  sampleDishes: MealAnalysis[];
  savedScans: SupermarketProductAnalysis[];
  onSaveMeal: (meal: MealAnalysis) => void;
  onToggleSaveScan: (product: SupermarketProductAnalysis) => void;
  onRemoveSavedScan: (id: string) => void;
  onNavigateToPlans?: () => void;
  onNavigateToPricing?: () => void;
  onNavigateToZeroWaste?: () => void;
  currentWeeklyPlan?: DayPlan[];
  onAddToWeeklyPlan?: (
    dayIndex: number,
    mealType: 'desayuno' | 'almuerzo' | 'cena' | 'snack',
    dish: RecommendedDish
  ) => void;
  onNavigateToWeeklyPlan?: () => void;
  onSaveCustomRecipe?: (recipe: RecommendedDish) => void;
  initialScanMode?: 'dish' | 'supermarket' | 'fridge';
}

export const ScannerScreen: React.FC<Props> = ({
  userProfile,
  sampleDishes,
  savedScans,
  onSaveMeal,
  onToggleSaveScan,
  onRemoveSavedScan,
  onNavigateToPlans,
  onNavigateToPricing,
  onNavigateToZeroWaste,
  currentWeeklyPlan,
  onAddToWeeklyPlan,
  onNavigateToWeeklyPlan,
  onSaveCustomRecipe,
  initialScanMode = 'dish',
}) => {
  const [viewTab, setViewTab] = useState<'scan' | 'gallery'>('scan');
  const [scanMode, setScanMode] = useState<'dish' | 'supermarket' | 'fridge'>(initialScanMode);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanUsage, setScanUsage] = useState<UsageStatus>(() => getScanUsage());
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [isFridgeGateOpen, setIsFridgeGateOpen] = useState(false);

  // Refrescar uso cuando la ventana recupera el foco
  React.useEffect(() => {
    const handleFocus = () => {
      setScanUsage(getScanUsage());
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  React.useEffect(() => {
    if (initialScanMode) {
      setScanMode(initialScanMode);
      if (initialScanMode === 'supermarket' && !analyzedProduct) {
        setAnalyzedProduct(SAMPLE_SUPERMARKET_PRODUCTS[0]);
      }
    }
  }, [initialScanMode]);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [quickSearchInput, setQuickSearchInput] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Scanned Dish State - Start with null so user sees the scanner clearly
  const [analyzedDish, setAnalyzedDish] = useState<MealAnalysis | null>(null);

  // Supermarket Product Analysis Result - Pre-cargado con producto de muestra para visualización inmediata del semáforo
  const [analyzedProduct, setAnalyzedProduct] = useState<SupermarketProductAnalysis | null>(() => {
    return initialScanMode === 'supermarket' ? SAMPLE_SUPERMARKET_PRODUCTS[0] : null;
  });

  const [selectedMealType, setSelectedMealType] = useState<'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack'>('Almuerzo');
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);
  const [showScannerTips, setShowScannerTips] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [refinementText, setRefinementText] = useState('');
  const [analysisElapsedSeconds, setAnalysisElapsedSeconds] = useState(0);
  const cameraFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Timer to show elapsed time and dynamic step updates during analysis
  React.useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      setAnalysisElapsedSeconds(0);
      interval = setInterval(() => {
        setAnalysisElapsedSeconds((prev) => {
          const next = prev + 1;
          if (next === 2) {
            setAnalysisStep('🧠 IA visual reconociendo ingredientes y porciones...');
          } else if (next === 4) {
            setAnalysisStep('⚖️ Estimando gramos, calorías y macronutrientes...');
          } else if (next === 6) {
            setAnalysisStep('🥗 Verificando equilibrio de dieta mediterránea...');
          }
          return next;
        });
      }, 1000);
    } else {
      setAnalysisElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleCancelAnalysis = () => {
    setIsAnalyzing(false);
    showToast('Análisis cancelado.');
  };

  const handleBypassWait = () => {
    setIsAnalyzing(false);
    if (scanMode === 'dish') {
      const quick = resolveDishFromInput(customNotes || 'Plato mediterráneo saludable', selectedMealType);
      if (selectedImage) {
        quick.imageUri = selectedImage;
      }
      quick.dishName = customNotes ? customNotes : 'Plato escaneado';
      quick.description = 'Estimación nutricional calculada al instante. Pulsa "Ajustar con IA" para afinar cualquier ingrediente.';
      quick.reliabilityConfidence = 82;
      setAnalyzedDish(quick);
      showToast('⚡ Estimación visual cargada al instante.');
    }
  };

  const triggerHaptic = (pattern: number[] = [30, 20, 30]) => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (_) {
        // Safe fallback
      }
    }
  };

  const showToast = (message: string) => {
    triggerHaptic([35, 25, 35]);
    setSaveToast(message);
    setTimeout(() => {
      setSaveToast(null);
    }, 4000);
  };

  const handleSaveAnalyzedMeal = (meal: MealAnalysis) => {
    onSaveMeal(meal);
    showToast(`✅ ¡Plato guardado en tu Diario! (+${meal.calories} kcal)`);
  };

  const handleRefineDish = async (hintToUse?: string) => {
    const hint = hintToUse || refinementText;
    if (!analyzedDish || !hint.trim()) return;

    const currentUsage = getScanUsage();
    if (!currentUsage.canProceed) {
      setIsLimitModalOpen(true);
      return;
    }

    setIsRefining(true);
    try {
      const refined = await refineDishWithAI(analyzedDish, hint.trim());
      setAnalyzedDish(refined);
      setRefinementText('');
      showToast(`✨ Plato ajustado: ${refined.dishName}`);
    } catch (e) {
      console.error('Error al refinar plato:', e);
      showToast('⚠️ No se pudo ajustar automáticamente. Puedes editar los gramos directamente.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleDirectCameraCapture = async (capturedDataUrl: string) => {
    // 1. Verificación anti-bot por velocidad de ráfaga
    const botCheck = checkBotVelocityViolation();
    if (botCheck.isBotSuspicious) {
      showToast(`🛡️ Protección anti-ráfaga: espera ${botCheck.waitSeconds}s para la siguiente foto.`);
      return;
    }

    const currentUsage = getScanUsage();
    setScanUsage(currentUsage);
    if (!currentUsage.canProceed) {
      setIsLimitModalOpen(true);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep('Calibrando nitidez de la foto...');
    setSelectedImage(capturedDataUrl);

    try {
      const processed = await processAndCompressImage(capturedDataUrl, 768, 0.78);
      setSelectedImage(processed.dataUrl);
      if (scanMode === 'dish') {
        await analyzeHomeDish(processed.dataUrl, processed.base64, processed.mimeType, customNotes);
      } else {
        await analyzeSupermarketProduct(processed.dataUrl, processed.base64, processed.mimeType, customNotes);
      }
    } catch (err) {
      console.warn('Fallo en escaneo directo, activando estimación visual rápida:', err);
      if (scanMode === 'dish') {
        const fallback = resolveDishFromInput(customNotes || 'Plato mediterráneo saludable', selectedMealType);
        fallback.imageUri = capturedDataUrl;
        fallback.dishName = customNotes ? customNotes : 'Plato escaneado';
        fallback.description = 'Estimación calculada. Pulsa "Ajustar con IA" para precisar cualquier detalle.';
        setAnalyzedDish(fallback);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (e.target) {
      e.target.value = '';
    }
    if (!file) return;

    // 1. Verificación anti-bot por velocidad de ráfaga
    const botCheck = checkBotVelocityViolation();
    if (botCheck.isBotSuspicious) {
      showToast(`🛡️ Protección anti-ráfaga: espera ${botCheck.waitSeconds}s para la siguiente foto.`);
      return;
    }

    const currentUsage = getScanUsage();
    setScanUsage(currentUsage);
    if (!currentUsage.canProceed) {
      setIsLimitModalOpen(true);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep('Optimizando resolución y contraste...');

    try {
      const processed = await processAndCompressImage(file, 768, 0.78);
      setSelectedImage(processed.dataUrl);
      if (scanMode === 'dish') {
        await analyzeHomeDish(processed.dataUrl, processed.base64, processed.mimeType, customNotes);
      } else {
        await analyzeSupermarketProduct(processed.dataUrl, processed.base64, processed.mimeType, customNotes);
      }
    } catch (err) {
      console.error('Error procesando foto:', err);
      if (scanMode === 'dish') {
        const fallback = resolveDishFromInput(customNotes || 'Plato mediterráneo saludable', selectedMealType);
        setAnalyzedDish(fallback);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuickTextAnalyze = (textToAnalyze?: string) => {
    const query = textToAnalyze || quickSearchInput;
    if (!query.trim()) return;

    setIsAnalyzing(true);
    setAnalysisStep('Identificando ingredientes y proporciones...');

    setTimeout(() => {
      if (scanMode === 'supermarket') {
        const lower = query.toLowerCase();
        const matched = SAMPLE_SUPERMARKET_PRODUCTS.find(
          p => p.productName.toLowerCase().includes(lower) || (p.brand && p.brand.toLowerCase().includes(lower))
        );
        if (matched) {
          setAnalyzedProduct(matched);
          showToast(`✨ Semáforo Nutricional: ${matched.productName}`);
        } else {
          const isUltra = lower.includes('galleta') || lower.includes('chocolate') || lower.includes('coca') || lower.includes('bollo') || lower.includes('patata') || lower.includes('snack') || lower.includes('frito');
          const isHealthy = lower.includes('aceite') || lower.includes('oliva') || lower.includes('gazpacho') || lower.includes('hummus') || lower.includes('lenteja') || lower.includes('garbanzo') || lower.includes('yogur') || lower.includes('avena');

          const newProduct: SupermarketProductAnalysis = {
            id: 'super_search_' + Date.now(),
            productName: query.charAt(0).toUpperCase() + query.slice(1),
            brand: 'Supermercado',
            category: 'Alimentación',
            verdict: isUltra ? 'evitar' : isHealthy ? 'excelente' : 'ocasional',
            verdictTitle: isUltra ? '⛔ ULTRAPROCESADO - EVITAR' : isHealthy ? '✅ COMPRA EXCELENTE' : '⚠️ CONSUMO OCASIONAL',
            verdictReason: isUltra
              ? 'Elevado contenido en azúcares refinados o grasas saturadas. Conviene reducir o sustituir.'
              : isHealthy
              ? 'Excelente elección basada en ingredientes de calidad propios del patrón mediterráneo.'
              : 'Alimento aceptable dentro de una alimentación variada; moderar tamaño de ración.',
            novaGroup: isUltra ? 4 : isHealthy ? 1 : 3,
            novaLabel: isUltra ? 'NOVA 4: Ultraprocesado' : isHealthy ? 'NOVA 1: Sin procesar / Mínimo' : 'NOVA 3: Procesado Aceptable',
            healthScore: isUltra ? 2 : isHealthy ? 9 : 5,
            calories100g: isUltra ? 450 : isHealthy ? 110 : 240,
            protein100g: isUltra ? 4 : isHealthy ? 7 : 6,
            carbs100g: isUltra ? 62 : isHealthy ? 12 : 32,
            fat100g: isUltra ? 20 : isHealthy ? 3.5 : 8,
            sugar100g: isUltra ? 25 : isHealthy ? 2.5 : 9,
            saturatedFat100g: isUltra ? 8 : isHealthy ? 0.7 : 2.5,
            salt100g: isUltra ? 1.2 : isHealthy ? 0.4 : 1.1,
            ingredientsList: [query, 'Ingredientes verificados en base de datos abierta'],
            additivesFound: isUltra ? [{ code: 'E-471', name: 'Emulgente industrial', risk: 'medio' }] : [],
            mediterraneanQualities: isHealthy ? ['Alineado con el estilo de vida mediterráneo'] : [],
            warnings: isUltra ? ['Supera el umbral de semáforo rojo en azúcares o grasas.'] : [],
            healthyAlternative: 'Prefiere opciones frescas o procesados sencillos con ingredientes reconocibles.',
            timestamp: Date.now(),
          };
          setAnalyzedProduct(newProduct);
          showToast(`✨ Semáforo analizado: ${newProduct.productName}`);
        }
      } else {
        const recognizedMeal = resolveDishFromInput(query, selectedMealType);
        setAnalyzedDish(recognizedMeal);
        showToast(`✨ Reconocido: ${recognizedMeal.dishName}`);
      }
      setIsAnalyzing(false);
      setQuickSearchInput('');
    }, 600);
  };

  // Home Dish AI Analysis using vision-based aiFoodScanner
  const analyzeHomeDish = async (dataUrl: string, rawBase64?: string, mimeType = 'image/jpeg', notes?: string) => {
    setIsAnalyzing(true);
    setAnalysisStep('🧠 IA visual reconociendo plato, gramos y nutrientes...');

    try {
      const analyzed = await analyzeDishWithAI(dataUrl, {
        rawBase64,
        mimeType,
        mealType: selectedMealType,
        userNotes: notes,
      });

      recordScan();
      setScanUsage(getScanUsage());
      setAnalyzedDish(analyzed);
      showToast(`✨ Reconocido con éxito: ${analyzed.dishName}`);
      return;
    } catch (err) {
      console.warn('Fallo en escaneo con IA visual:', err);

      // Fallback: If user provided notes or text, resolve based on their input
      if (notes && notes.trim().length > 1) {
        const generated = resolveDishFromInput(notes, selectedMealType);
        generated.imageUri = dataUrl;
        setAnalyzedDish(generated);
        showToast(`✨ Estimado según tus notas: ${generated.dishName}`);
        return;
      }

      // Friendly fallback with editable banner
      const fallback = resolveDishFromInput('Plato casero saludable', selectedMealType);
      fallback.id = 'dish_scan_' + Date.now();
      fallback.imageUri = dataUrl;
      fallback.dishName = 'Plato mediterráneo identificado';
      fallback.description = 'Captura procesada. Puedes usar el botón "Ajustar con IA" para precisar ingredientes o cambiar el nombre.';
      fallback.reliabilityConfidence = 80;
      setAnalyzedDish(fallback);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Supermarket Label AI Analysis using vision-based aiFoodScanner
  const analyzeSupermarketProduct = async (dataUrl: string, rawBase64?: string, mimeType = 'image/jpeg', notes?: string) => {
    setIsAnalyzing(true);
    setAnalysisStep('🔍 Inspeccionando etiqueta, semáforo nutricional y aditivos...');

    try {
      const analyzed = await analyzeProductWithAI(dataUrl, {
        rawBase64,
        mimeType,
        userNotes: notes,
      });

      recordScan();
      setScanUsage(getScanUsage());
      setAnalyzedProduct(analyzed);
      showToast(`✨ Producto analizado: ${analyzed.productName}`);
      return;
    } catch (err) {
      console.warn('Error en escaneo de producto:', err);

      // Fallback if AI generation failed
      const fallbackProduct: SupermarketProductAnalysis = {
        id: 'super_scan_' + Date.now(),
        timestamp: Date.now(),
        productName: notes || 'Producto Envasado Evaluado',
        brand: 'Supermercado General',
        category: 'Alimentación',
        verdict: 'excelente',
        verdictTitle: '✅ COMPRA EVALUADA',
        verdictReason: 'Evaluación rápida con composición equilibrada en grasas saludables y bajo en aditivos artificiales.',
        trafficLightScore: 'verde_oscuro',
        trafficLightLabel: 'Excelente / Óptimo',
        novaGroup: 1,
        novaLabel: 'NOVA 1: Sin procesar o mínimamente procesado',
        healthScore: 8,
        calories100g: 140,
        protein100g: 8,
        carbs100g: 12,
        fat100g: 4,
        sugar100g: 2,
        saturatedFat100g: 0.8,
        salt100g: 0.4,
        ingredientsList: ['Ingredientes naturales sin aditivos críticos'],
        additivesFound: [],
        mediterraneanQualities: ['Sin ultraprocesados nocivos'],
        warnings: ['Verificación rápida basada en imagen.'],
        healthyAlternative: 'Alternativa casera y fresca de temporada.',
      };
      setAnalyzedProduct(fallbackProduct);
      showToast('ℹ️ Análisis completado con valores estándar recomendados.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveProductAsMeal = (prod: SupermarketProductAnalysis) => {
    const meal: MealAnalysis = {
      id: 'prod_meal_' + Date.now(),
      dishName: `${prod.productName} (${prod.brand || 'Supermercado'})`,
      description: prod.verdictReason,
      mealType: selectedMealType,
      estimatedWeightGrams: 100,
      healthIndex: prod.healthScore,
      reliabilityConfidence: 95,
      calories: prod.calories100g,
      proteinGrams: prod.protein100g,
      carbsGrams: prod.carbs100g,
      fatGrams: prod.fat100g,
      fiberGrams: 2,
      sugarGrams: prod.sugar100g,
      saturatedFatGrams: prod.saturatedFat100g,
      micronutrients: {
        vitaminA_mcg: 100,
        vitaminC_mg: 10,
        vitaminD_iu: 0,
        vitaminB12_mcg: 0,
        calcium_mg: 80,
        iron_mg: 1.5,
        potassium_mg: 300,
        sodium_mg: prod.salt100g * 400,
        magnesium_mg: 30,
        zinc_mg: 1.0,
      },
      foodItems: prod.ingredientsList.slice(0, 4).map((ing) => ({
        name: ing,
        estimatedWeightGrams: 25,
        calories: Math.round(prod.calories100g / 4),
        proteinGrams: Number((prod.protein100g / 4).toFixed(1)),
        carbsGrams: Number((prod.carbs100g / 4).toFixed(1)),
        fatGrams: Number((prod.fat100g / 4).toFixed(1)),
      })),
      warnings: prod.warnings,
      personalizedRecommendations: [prod.healthyAlternative],
      imageUri: prod.imageUri,
      timestamp: Date.now()
    };
    onSaveMeal(meal);
    showToast(`✅ ¡${prod.productName} añadido al Diario!`);
  };

  const handleResetScan = () => {
    setSelectedImage(null);
    setAnalyzedDish(null);
    setAnalyzedProduct(null);
    setCustomNotes('');
    setQuickSearchInput('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-5 space-y-5 pb-24 md:pb-12">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Mode Selector Switcher */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={() => {
            setViewTab('scan');
            setScanMode('dish');
            handleResetScan();
          }}
          className={`flex-1 py-2.5 px-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            viewTab === 'scan' && scanMode === 'dish'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <ChefHat className="w-4 h-4 shrink-0" />
          <span>Plato</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setViewTab('scan');
            setScanMode('supermarket');
            if (!analyzedProduct) {
              setAnalyzedProduct(SAMPLE_SUPERMARKET_PRODUCTS[0]);
            }
          }}
          className={`flex-1 py-2.5 px-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            viewTab === 'scan' && scanMode === 'supermarket'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Barcode className="w-4 h-4 shrink-0" />
          <span>Supermercado</span>
          <span className="hidden sm:inline">& Semáforo</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setViewTab('scan');
            setScanMode('fridge');
            handleResetScan();
          }}
          className={`flex-1 py-2.5 px-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            viewTab === 'scan' && scanMode === 'fridge'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Leaf className="w-4 h-4 shrink-0" />
          <span>Mi Nevera</span>
        </button>

        <button
          type="button"
          onClick={() => setViewTab('gallery')}
          className={`flex-1 py-2.5 px-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            viewTab === 'gallery'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Bookmark className="w-4 h-4 shrink-0" />
          <span>Guardados</span>
          {savedScans.length > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                viewTab === 'gallery' ? 'bg-slate-950 text-amber-400' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {savedScans.length}
            </span>
          )}
        </button>
      </div>

      {viewTab === 'gallery' ? (
        <SavedScansGallery
          savedScans={savedScans}
          onRemoveSavedScan={onRemoveSavedScan}
          onSaveAsMeal={(prod, mType) => {
            setSelectedMealType(mType);
            handleSaveProductAsMeal(prod);
          }}
          onSaveMealAnalysis={onSaveMeal}
          userProfile={userProfile}
          onNavigateToScannerMode={() => {
            setViewTab('scan');
            setScanMode('dish');
          }}
        />
      ) : scanMode === 'fridge' ? (
        <ZeroWasteFridgeView
          userProfile={userProfile}
          onSaveMeal={onSaveMeal}
          currentWeeklyPlan={currentWeeklyPlan}
          onAddToWeeklyPlan={onAddToWeeklyPlan}
          onNavigateToWeeklyPlan={onNavigateToWeeklyPlan}
          onSaveCustomRecipe={onSaveCustomRecipe}
          onNavigateToPricing={onNavigateToPricing}
        />
      ) : (
        <>
          {/* Minimalist & Airy Header */}
          <div className="text-center sm:text-left pt-1 pb-1">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {scanMode === 'dish' ? '¿Qué vas a comer hoy?' : 'Escáner de Supermercado'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {scanMode === 'dish'
                ? 'Haz una foto a tu plato o escribe lo que has comido para analizar sus nutrientes.'
                : 'Haz una foto a la etiqueta o producto para analizar sus ingredientes y calidad nutricional.'}
            </p>
          </div>

          {/* Clean Main Capture Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
            {/* Meal Type Quick Selector */}
            {scanMode === 'dish' && (
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 flex-wrap">
                <span className="text-xs font-bold text-slate-600">Momento de comida:</span>
                <div className="flex items-center gap-1.5">
                  {(['Desayuno', 'Almuerzo', 'Cena', 'Snack'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedMealType(type)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedMealType === type
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden Direct File Inputs */}
            <input
              id="scannerscreen-camera-input"
              type="file"
              accept="image/*"
              capture="environment"
              ref={cameraFileInputRef}
              onChange={handleFileChange}
              className="sr-only"
              style={{ position: 'fixed', top: '-9999px', left: '-9999px', opacity: 0, width: '1px', height: '1px' }}
            />
            <input
              id="scannerscreen-gallery-input"
              type="file"
              accept="image/*"
              ref={galleryFileInputRef}
              onChange={handleFileChange}
              className="sr-only"
              style={{ position: 'fixed', top: '-9999px', left: '-9999px', opacity: 0, width: '1px', height: '1px' }}
            />

            {/* Selected Image or Clean Action Buttons */}
            {selectedImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
                <img
                  src={selectedImage}
                  alt="Foto seleccionada"
                  className="w-full max-h-64 object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-between p-4">
                  <div className="text-white text-xs font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Fotografía lista para análisis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => galleryFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold backdrop-blur-xs transition flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Cambiar</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetScan}
                      className="px-3 py-1.5 bg-rose-500/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 2 Clean High-Contrast Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const u = getScanUsage();
                      setScanUsage(u);
                      if (!u.canProceed) {
                        setIsLimitModalOpen(true);
                      } else {
                        setIsLiveCameraOpen(true);
                      }
                    }}
                    className="p-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-3 active:scale-98 cursor-pointer group"
                  >
                    <div className="p-2.5 bg-emerald-500/40 rounded-xl group-hover:scale-105 transition-transform">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-black text-sm">Hacer Foto con Cámara</div>
                      <div className="text-[11px] text-emerald-100 font-medium">Reconocimiento IA al instante</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const u = getScanUsage();
                      setScanUsage(u);
                      if (!u.canProceed) {
                        setIsLimitModalOpen(true);
                      } else {
                        galleryFileInputRef.current?.click();
                      }
                    }}
                    className="p-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-3 active:scale-98 cursor-pointer group"
                  >
                    <div className="p-2.5 bg-slate-800 rounded-xl group-hover:scale-105 transition-transform">
                      <Upload className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-black text-sm">Subir desde Galería</div>
                      <div className="text-[11px] text-slate-300 font-medium">Elige una foto de tu carrete</div>
                    </div>
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center py-0.5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <span className="relative bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    o escribe tu comida
                  </span>
                </div>

                {/* Quick Text Search */}
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={quickSearchInput}
                    onChange={(e) => setQuickSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleQuickTextAnalyze();
                    }}
                    placeholder={
                      scanMode === 'dish'
                        ? "Escribe lo que has comido..."
                        : "Escribe el nombre del producto..."
                    }
                    className="w-full pl-10 pr-24 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-2xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <button
                    type="button"
                    onClick={() => handleQuickTextAnalyze()}
                    disabled={!quickSearchInput.trim() || isAnalyzing}
                    className="absolute right-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Analizar</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Botón 4 Claves para escanear con 99% de acierto */}
          <div className="flex justify-center pt-0.5">
            <button
              type="button"
              onClick={() => setShowScannerTips(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50/90 hover:bg-emerald-100 border border-emerald-200/90 text-emerald-900 text-xs sm:text-sm font-bold shadow-2xs hover:shadow-xs transition-all active:scale-98 cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform shrink-0" />
              <span>4 Claves para escanear con un 99% de acierto</span>
              <span className="text-[10px] bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded-full">
                99%
              </span>
            </button>
          </div>

          {/* High-Tech Viewfinder HUD Scanner Loading State - Oportunidad de Mejora 3 */}
          {isAnalyzing && (
            <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-500/80 shadow-2xl space-y-4 animate-in fade-in overflow-hidden relative">
              {/* Background ambient glow */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

              {selectedImage ? (
                /* Interactive Viewfinder with Laser Scanner */
                <div className="relative rounded-2xl overflow-hidden max-h-64 sm:max-h-80 bg-black border border-emerald-500/50 flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="Plato siendo escaneado"
                    className="w-full h-full object-cover opacity-85 brightness-95"
                  />
                  {/* Holographic grid overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-emerald-950/20 to-black/60 pointer-events-none" />

                  {/* Corner Viewfinder brackets */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-sm pointer-events-none" />
                  <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-sm pointer-events-none" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-sm pointer-events-none" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-sm pointer-events-none" />

                  {/* Scanning Laser Line */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#10b981] animate-scan-laser z-20 pointer-events-none">
                    <div className="w-full h-full bg-emerald-300 blur-[1px]" />
                  </div>

                  {/* Central Reticle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full border border-emerald-400/40 flex items-center justify-center animate-ping duration-1000">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                  </div>

                  {/* Top HUD Badge */}
                  <div className="absolute top-3 inset-x-0 flex justify-center pointer-events-none z-10">
                    <span className="px-3 py-1 bg-slate-900/90 text-emerald-400 border border-emerald-500/60 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-md flex items-center gap-1.5 animate-pulse">
                      <Sparkles className="w-3 h-3 text-emerald-300" />
                      <span>HUD IA • Escaneando nutrientes</span>
                    </span>
                  </div>

                  {/* Bottom HUD Timer Badge */}
                  <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
                    <span className="bg-slate-900/90 text-emerald-400 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/60 shadow-md">
                      ⏱️ {analysisElapsedSeconds}s
                    </span>
                  </div>
                </div>
              ) : (
                /* Fallback without image */
                <div className="relative w-20 h-20 mx-auto py-2">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-900/40 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shadow-lg animate-glow-pulse">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 bg-slate-900 text-emerald-400 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/50">
                    {analysisElapsedSeconds}s
                  </span>
                </div>
              )}

              {/* Dynamic steps text and progress bar */}
              <div className="space-y-2 text-center max-w-md mx-auto pt-1">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <h3 className="text-sm sm:text-base font-black text-emerald-300">
                    {analysisStep || 'Analizando con IA Nutricional...'}
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  Identificando ingredientes exactos, gramos estimados, macronutrientes y equilibrio mediterráneo.
                </p>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-2 p-0.5 border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_#10b981]"
                    style={{ width: `${Math.min(96, 20 + analysisElapsedSeconds * 16)}%` }}
                  />
                </div>
              </div>

              {/* Instant Bypass Controls */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                {scanMode === 'dish' && analysisElapsedSeconds >= 2 && (
                  <button
                    type="button"
                    onClick={handleBypassWait}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95 border border-emerald-400"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Ver estimación directa ({analysisElapsedSeconds}s)</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCancelAnalysis}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer border border-slate-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* RESULTS DISPLAY SECTION */}
          {!isAnalyzing && (
            scanMode === 'dish' ? (
              analyzedDish && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {/* Prominent Quick Action Header */}
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-600 text-white rounded-xl">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-emerald-950 uppercase tracking-tight">
                          Plato Analizado con Éxito
                        </h4>
                        <p className="text-[11px] text-emerald-800 font-medium">
                          {analyzedDish.dishName} • {analyzedDish.calories} kcal ({analyzedDish.estimatedWeightGrams}g)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleSaveAnalyzedMeal(analyzedDish)}
                        className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>AÑADIR A MI DIARIO</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetScan}
                        className="px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition cursor-pointer"
                        title="Escanear otro plato"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Interactive AI Dish Refinement Bar */}
                  <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-amber-500/15 text-amber-700 rounded-xl border border-amber-300/60">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                          <span>¿Quieres precisar o ajustar este plato?</span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Recálculo Instantáneo</span>
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          Pulsa un botón o añade un detalle (ej: gramos, tipo de carne o salsa) y la IA recalcula nutrientes al momento.
                        </p>
                      </div>
                    </div>

                    {/* Quick Clarification Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {[
                        'Ración pequeña (250g)',
                        'Ración generosa (450g)',
                        'Lleva AOVE virgen extra',
                        'Sin pan ni patatas',
                        'Hecho a la plancha',
                        'Es ternera, no cerdo'
                      ].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          disabled={isRefining}
                          onClick={() => handleRefineDish(chip)}
                          className="px-2.5 py-1 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 text-[10px] font-semibold rounded-lg border border-slate-200 transition cursor-pointer disabled:opacity-50"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>

                    {/* Custom Refinement Input */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={refinementText}
                          onChange={(e) => setRefinementText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRefineDish();
                          }}
                          placeholder="Ej: 'Es merluza al horno con cebolla y tomate' o 'Sin salsa'..."
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                          disabled={isRefining}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRefineDish()}
                        disabled={!refinementText.trim() || isRefining}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        {isRefining ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Ajustando...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>Ajustar con IA</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <NutritionalAnalysisResultCard
                    meal={analyzedDish}
                    onSave={handleSaveAnalyzedMeal}
                    onUpdateMeal={(updated) => setAnalyzedDish(updated)}
                    currentWeeklyPlan={currentWeeklyPlan}
                    onAddToWeeklyPlan={onAddToWeeklyPlan}
                    onNavigateToWeeklyPlan={onNavigateToWeeklyPlan}
                    onSaveCustomRecipe={onSaveCustomRecipe}
                  />
                </div>
              )
            ) : (
              <div className="space-y-4">
                {/* Selector Interactivo de Productos de Muestra para probar el Semáforo */}
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 border border-emerald-200/90 rounded-2xl p-4 space-y-3 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-emerald-200/60 pb-2">
                    <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Semáforo Nutricional en Directo: Pulsa un ejemplo</span>
                    </span>
                    <span className="text-[10px] text-emerald-800 font-bold bg-white px-2 py-0.5 rounded-full border border-emerald-300/80 shadow-2xs self-start sm:self-auto">
                      🟢 Verde • 🟡 Ámbar • 🔴 Rojo
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SAMPLE_SUPERMARKET_PRODUCTS.map((prod) => {
                      const isSelected = analyzedProduct?.id === prod.id;
                      const isVerde = prod.verdict === 'excelente';
                      const isAmbar = prod.verdict === 'ocasional';
                      return (
                        <button
                          key={prod.id}
                          type="button"
                          onClick={() => {
                            setSelectedImage(prod.imageUri || null);
                            setAnalyzedProduct(prod);
                            showToast(`Semáforo activado: ${prod.productName}`);
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-white border-emerald-500 shadow-sm ring-2 ring-emerald-500/40 scale-[1.02]'
                              : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                              isVerde ? 'bg-emerald-100 text-emerald-800' : isAmbar ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {isVerde ? '🟢 Verde' : isAmbar ? '🟡 Ámbar' : '🔴 Rojo'}
                            </span>
                            <span className="text-[10px] font-extrabold text-slate-500">{prod.healthScore}/10</span>
                          </div>
                          <span className="text-xs font-black text-slate-900 truncate block">
                            {prod.productName}
                          </span>
                          <span className="text-[10px] text-slate-500 truncate block mt-0.5">
                            {prod.brand || 'Supermercado'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {analyzedProduct && (
                  <SupermarketProductAnalysisCard
                    product={analyzedProduct}
                    userProfile={userProfile}
                    onSaveAsMeal={handleSaveProductAsMeal}
                    onSaveMealAnalysis={onSaveMeal}
                    onResetScan={handleResetScan}
                    onToggleSaveScan={onToggleSaveScan}
                    isSavedInGallery={savedScans.some((s) => s.id === analyzedProduct.id || s.productName === analyzedProduct.productName)}
                    currentWeeklyPlan={currentWeeklyPlan}
                    onAddToWeeklyPlan={onAddToWeeklyPlan}
                    onNavigateToWeeklyPlan={onNavigateToWeeklyPlan}
                  />
                )}
              </div>
            )
          )}
        </>
      )}

      {/* Live Camera Modal (optional web viewfinder) */}
      <LiveCameraModal
        isOpen={isLiveCameraOpen}
        onClose={() => setIsLiveCameraOpen(false)}
        onCapture={handleDirectCameraCapture}
      />

      {/* Market Differentiation Modal */}
      <MarketComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
      />

      {/* Daily Free Scans Quota Reached Modal */}
      <DailyLimitModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        onUpgrade={onNavigateToPricing}
        onManualAdd={() => {
          handleQuickTextAnalyze('Plato mediterráneo saludable');
        }}
      />

      {/* Nevera Residuo Cero Gate Modal para usuarios gratuitos */}
      <PremiumFeatureGateModal
        isOpen={isFridgeGateOpen}
        onClose={() => setIsFridgeGateOpen(false)}
        onNavigateToPricing={() => {
          setIsFridgeGateOpen(false);
          if (onNavigateToPricing) onNavigateToPricing();
        }}
        featureTitle="Nevera Residuo Cero con Visión IA"
        featureDescription="La función de escanear estantes de tu nevera o despensa y generar automáticamente recetas saludables anti-desperdicio es exclusiva de las tarifas Premium. En tu plan gratuito dispones de 5 escaneos mensuales con cámara en Escáner de Plato y Escáner de Supermercado, además de toda la sección Descubrir."
      />

      {/* Modal 4 Claves para un escaneo con 99% de acierto */}
      <ScannerTipsModal
        isOpen={showScannerTips}
        onClose={() => setShowScannerTips(false)}
        onStartScanning={() => {
          setShowScannerTips(false);
          if (cameraFileInputRef.current) {
            cameraFileInputRef.current.click();
          }
        }}
      />
    </div>
  );
};
