import React, { useState } from 'react';
import { UserProfile, MealAnalysis, DayPlan } from '../types';
import { RecommendedDish } from '../data/dishesCatalog';
import { ScannedProductRecipeSection } from './ScannedProductRecipeSection';
import { AddToWeeklyPlanModal } from './AddToWeeklyPlanModal';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Info,
  Flame,
  Leaf,
  Nut,
  ArrowRight,
  Printer,
  ChevronRight,
  Share2,
  Bookmark,
  BookmarkCheck,
  CalendarDays
} from 'lucide-react';

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

interface Props {
  product: SupermarketProductAnalysis;
  userProfile?: UserProfile;
  onSaveAsMeal?: (product: SupermarketProductAnalysis) => void;
  onSaveMealAnalysis?: (meal: MealAnalysis) => void;
  onResetScan?: () => void;
  onToggleSaveScan?: (product: SupermarketProductAnalysis) => void;
  isSavedInGallery?: boolean;
  currentWeeklyPlan?: DayPlan[];
  onAddToWeeklyPlan?: (
    dayIndex: number,
    mealType: 'desayuno' | 'almuerzo' | 'cena' | 'snack',
    dish: RecommendedDish
  ) => void;
  onNavigateToWeeklyPlan?: () => void;
}

export const SupermarketProductAnalysisCard: React.FC<Props> = ({
  product,
  userProfile,
  onSaveAsMeal,
  onSaveMealAnalysis,
  onResetScan,
  onToggleSaveScan,
  isSavedInGallery = false,
  currentWeeklyPlan,
  onAddToWeeklyPlan,
  onNavigateToWeeklyPlan,
}) => {
  const [isWeeklyPlanModalOpen, setIsWeeklyPlanModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'trafficLight' | 'ingredients' | 'recipes'>('trafficLight');
  const [viewAll, setViewAll] = useState<boolean>(false);

  const getVerdictBadge = () => {
    switch (product.verdict) {
      case 'excelente':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          badgeBg: 'bg-emerald-600 text-white',
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
          label: '✅ COMPRA EXCELENTE',
          sub: 'Alimento Real / Procesado Saludable Mediterráneo',
        };
      case 'ocasional':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-900',
          badgeBg: 'bg-amber-500 text-white',
          icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
          label: '⚠️ CONSUMO OCASIONAL',
          sub: 'Contiene algún ingrediente o azúcar a moderar',
        };
      case 'evitar':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-900',
          badgeBg: 'bg-rose-600 text-white',
          icon: <XCircle className="w-6 h-6 text-rose-600" />,
          label: '⛔ ULTRAPROCESADO - EVITAR',
          sub: 'Aceites refinados, aditivos o azúcares ocultos',
        };
    }
  };

  // Semáforo de Salud Abierto (5 niveles libres, sin marcas comerciales registradas)
  const getOpenTrafficLight = () => {
    if (product.verdict === 'evitar' || product.healthScore <= 3) {
      return {
        level: 5,
        label: '🔴 Evitar / Ultraprocesado',
        badgeBg: 'bg-rose-600 text-white',
        description: 'Alta presencia de azúcares añadidos, grasas refinadas o aditivos perjudiciales.',
      };
    }
    if (product.healthScore <= 4.9) {
      return {
        level: 4,
        label: '🟠 Consumo Ocasional',
        badgeBg: 'bg-orange-500 text-white',
        description: 'Contiene nutrientes críticos elevados. Conviene moderar su frecuencia de compra.',
      };
    }
    if (product.verdict === 'ocasional' || product.healthScore <= 6.9) {
      return {
        level: 3,
        label: '🟡 Consumo Equilibrado',
        badgeBg: 'bg-amber-400 text-slate-900',
        description: 'Aceptable dentro de una dieta variada; vigilar tamaño de ración.',
      };
    }
    if (product.healthScore <= 8.5) {
      return {
        level: 2,
        label: '🟢 Saludable',
        badgeBg: 'bg-lime-600 text-white',
        description: 'Buen perfil nutricional, ingredientes recomendables y procesamiento mínimo.',
      };
    }
    return {
      level: 1,
      label: '🟢 Excelente / Óptimo',
      badgeBg: 'bg-emerald-600 text-white',
      description: 'Comida real o procesado saludable de máxima densidad nutricional.',
    };
  };

  const openTrafficLight = getOpenTrafficLight();

  const trafficLevels = [
    { level: 1, name: 'Excelente', short: 'Óptimo', color: 'bg-emerald-600', ring: 'ring-emerald-500' },
    { level: 2, name: 'Saludable', short: 'Sano', color: 'bg-lime-500', ring: 'ring-lime-500' },
    { level: 3, name: 'Equilibrado', short: 'Medio', color: 'bg-amber-400 text-slate-900', ring: 'ring-amber-400' },
    { level: 4, name: 'Moderar', short: 'Moderar', color: 'bg-orange-500', ring: 'ring-orange-500' },
    { level: 5, name: 'Evitar', short: 'Evitar', color: 'bg-rose-600', ring: 'ring-rose-600' },
  ];

  // Semáforo de Nutrientes Críticos (Estándar abierto OMS / UK FSA / Sanidad Pública)
  const getNutrientLights = () => {
    const sugar = product.sugar100g || 0;
    const satFat = product.saturatedFat100g || 0;
    const fat = product.fat100g || 0;
    const salt = product.salt100g || 0;

    const sugarState = sugar <= 5.0 ? 'low' : sugar <= 22.5 ? 'med' : 'high';
    const satFatState = satFat <= 1.5 ? 'low' : satFat <= 5.0 ? 'med' : 'high';
    const fatState = fat <= 3.0 ? 'low' : fat <= 17.5 ? 'med' : 'high';
    const saltState = salt <= 0.3 ? 'low' : salt <= 1.5 ? 'med' : 'high';

    const getMeta = (state: 'low' | 'med' | 'high', lowText: string, medText: string, highText: string) => {
      switch (state) {
        case 'low':
          return {
            label: '🟢 Bajo',
            badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
            dotClass: 'bg-emerald-500',
            bgCard: 'bg-emerald-50/70 border-emerald-200',
            guideText: lowText,
          };
        case 'med':
          return {
            label: '🟡 Medio',
            badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
            dotClass: 'bg-amber-500',
            bgCard: 'bg-amber-50/70 border-amber-200',
            guideText: medText,
          };
        case 'high':
          return {
            label: '🔴 Alto',
            badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
            dotClass: 'bg-rose-500',
            bgCard: 'bg-rose-50/70 border-rose-200',
            guideText: highText,
          };
      }
    };

    return [
      {
        name: 'Azúcares',
        value: sugar,
        unit: 'g',
        ...getMeta(sugarState, '≤ 5g (Bajo en azúcar)', '5 a 22.5g (Consumo medio)', '> 22.5g (Alto contenido)'),
      },
      {
        name: 'Grasas Sat.',
        value: satFat,
        unit: 'g',
        ...getMeta(satFatState, '≤ 1.5g (Bajo en sat.)', '1.5 a 5g (Consumo moderado)', '> 5g (Alto contenido)'),
      },
      {
        name: 'Grasas Total',
        value: fat,
        unit: 'g',
        ...getMeta(fatState, '≤ 3g (Bajo en grasas)', '3 a 17.5g (Consumo moderado)', '> 17.5g (Alto contenido)'),
      },
      {
        name: 'Sal',
        value: salt,
        unit: 'g',
        ...getMeta(saltState, '≤ 0.3g (Bajo en sal)', '0.3 a 1.5g (Consumo medio)', '> 1.5g (Alto contenido)'),
      },
    ];
  };

  const nutrientLights = getNutrientLights();

  const getNovaBadge = (nova: number) => {
    switch (nova) {
      case 1:
        return { label: 'NOVA 1: Sin Procesar', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 2:
        return { label: 'NOVA 2: Ingrediente Culinario', color: 'bg-teal-100 text-teal-800 border-teal-300' };
      case 3:
        return { label: 'NOVA 3: Procesado Aceptable', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 4:
      default:
        return { label: 'NOVA 4: Ultraprocesado', color: 'bg-rose-100 text-rose-800 border-rose-300' };
    }
  };

  const verdictConfig = getVerdictBadge();
  const novaConfig = getNovaBadge(product.novaGroup);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden space-y-6">
      {/* Header Banner */}
      <div className={`p-6 border-b ${verdictConfig.bg} relative overflow-hidden`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200/60 mt-0.5">
              {verdictConfig.icon}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${verdictConfig.badgeBg}`}>
                  {verdictConfig.label}
                </span>
                {product.brand && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-xs font-bold">
                    {product.brand}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {product.productName}
              </h2>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                {product.verdictReason}
              </p>
            </div>
          </div>

          {/* Health Score Circle */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs self-start sm:self-auto">
            <div className="text-center px-2">
              <div className="text-2xl font-black text-slate-900">{product.healthScore}<span className="text-xs text-slate-400">/10</span></div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Puntaje Salud</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Selector de Pestañas Compacto - Semáforo / Ingredientes / Recetas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200">
          <div className="grid grid-cols-3 gap-1 flex-1">
            <button
              type="button"
              onClick={() => { setActiveTab('trafficLight'); setViewAll(false); }}
              className={`py-2 px-1.5 sm:px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer select-none active:scale-95 ${
                activeTab === 'trafficLight' && !viewAll
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <span className="truncate">🚦 Semáforo</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('ingredients'); setViewAll(false); }}
              className={`py-2 px-1.5 sm:px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer select-none active:scale-95 ${
                activeTab === 'ingredients' && !viewAll
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <span className="truncate">🧪 Ingredientes</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('recipes'); setViewAll(false); }}
              className={`py-2 px-1.5 sm:px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer select-none active:scale-95 ${
                activeTab === 'recipes' && !viewAll
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <span className="truncate">🥗 Recetas</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setViewAll(!viewAll)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 border select-none active:scale-95 ${
              viewAll
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <span>{viewAll ? '📑 Modo Pestañas' : '👁️ Ver Todo'}</span>
          </button>
        </div>

        {/* 1. SECCIÓN: SEMÁFORO & NUTRIENTES */}
        {(viewAll || activeTab === 'trafficLight') && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Badges Row: Semáforo Saludable Abierto + Clasificación NOVA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Semáforo de Salud Abierto */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    openTrafficLight.level <= 2 ? 'bg-emerald-400' : openTrafficLight.level === 3 ? 'bg-amber-400' : 'bg-rose-400'
                  }`} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    openTrafficLight.level <= 2 ? 'bg-emerald-500' : openTrafficLight.level === 3 ? 'bg-amber-500' : 'bg-rose-500'
                  }`} />
                </span>
                <span>Semáforo de Salud Abierto</span>
              </span>
              <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${openTrafficLight.badgeBg}`}>
                {openTrafficLight.label}
              </span>
            </div>

            {/* 5-step open traffic light bar */}
            <div className="flex items-center gap-1.5 pt-1">
              {trafficLevels.map((t) => {
                const isActive = openTrafficLight.level === t.level;
                return (
                  <div
                    key={t.level}
                    className={`flex-1 py-1.5 px-0.5 rounded-xl text-center text-[10px] font-black transition-all ${
                      isActive
                        ? `${t.color} text-white shadow-md ring-2 ring-offset-1 ring-slate-400 scale-105`
                        : 'bg-slate-200/70 text-slate-400 hover:bg-slate-300/80'
                    }`}
                  >
                    <span className="block leading-tight truncate">{t.short}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              {openTrafficLight.description}
            </p>
          </div>

          {/* NOVA Classification */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Info className="w-4 h-4 text-sky-600" />
                <span>Clasificación NOVA</span>
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${novaConfig.color}`}>
                {novaConfig.label}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-snug pt-1">
              {product.novaLabel || 'Clasificación oficial de procesamiento de la Univ. de São Paulo / FAO.'}
            </p>
          </div>
        </div>

        {/* Semáforo de Nutrientes Críticos (Estándar Abierto OMS / FSA) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2.5">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-xs" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-xs" />
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-xs" />
              <span className="ml-1">Semáforo de Nutrientes Críticos (por 100g / 100ml)</span>
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">
              Estándar libre OMS / Agencia de Salud Pública
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {nutrientLights.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${item.bgCard}`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[11px] font-bold text-slate-700">{item.name}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${item.dotClass} shrink-0 ring-1 ring-white shadow-xs`} />
                </div>
                <div className="flex items-baseline justify-between mt-0.5">
                  <span className="text-base font-black text-slate-900">
                    {item.value}<span className="text-xs font-medium text-slate-500"> {item.unit}</span>
                  </span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md border ${item.badgeClass}`}>
                    {item.label}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium mt-1">{item.guideText}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Macros per 100g Grid */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Valores Nutricionales por cada 100g / 100ml</span>
            </span>
            <span className="text-xs font-black text-white">{product.calories100g} kcal</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
            <div className="bg-slate-800/80 p-2 rounded-xl">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Proteínas</div>
              <div className="text-sm font-black text-emerald-400">{product.protein100g}g</div>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-xl">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Hidratos</div>
              <div className="text-sm font-black text-sky-300">{product.carbs100g}g</div>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-xl">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Azúcares</div>
              <div className={`text-sm font-black ${product.sugar100g > 5 ? 'text-rose-400' : 'text-emerald-300'}`}>
                {product.sugar100g}g
              </div>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-xl">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Grasas Total</div>
              <div className="text-sm font-black text-amber-300">{product.fat100g}g</div>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-xl">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Grasas Sat.</div>
              <div className={`text-sm font-black ${product.saturatedFat100g > 3 ? 'text-amber-400' : 'text-emerald-300'}`}>
                {product.saturatedFat100g}g
              </div>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-xl">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Sal</div>
              <div className={`text-sm font-black ${product.salt100g > 1.2 ? 'text-rose-400' : 'text-emerald-300'}`}>
                {product.salt100g}g
              </div>
            </div>
          </div>
        </div>
          </div>
        )}

        {/* 2. SECCIÓN: INGREDIENTES & ADITIVOS */}
        {(viewAll || activeTab === 'ingredients') && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Qualities & Additives Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mediterranean Qualities */}
          {product.mediterraneanQualities && product.mediterraneanQualities.length > 0 && (
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>Puntos Fuertes Mediterráneos</span>
              </h4>
              <ul className="space-y-1.5 pt-1">
                {product.mediterraneanQualities.map((item, i) => (
                  <li key={i} className="text-xs text-emerald-900 flex items-start gap-2 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Additives & E-Numbers */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-600" />
              <span>Aditivos e Ingredientes Ocultos</span>
            </h4>
            {product.additivesFound && product.additivesFound.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.additivesFound.map((add, i) => {
                  const isHigh = add.risk === 'alto';
                  const isMed = add.risk === 'medio';
                  return (
                    <span
                      key={i}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                        isHigh
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : isMed
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                      title={add.name}
                    >
                      {add.code} ({add.name})
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-emerald-700 font-semibold pt-1 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Libre de aditivos sospechosos o conservantes artificiales.</span>
              </p>
            )}
          </div>
        </div>

        {/* Ingredients Breakdown */}
        {product.ingredientsList && product.ingredientsList.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Lista de Ingredientes Detectada:
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-mono bg-white p-3 rounded-xl border border-slate-200">
              {product.ingredientsList.join(', ')}
            </p>
          </div>
        )}
          </div>
        )}

        {/* 3. SECCIÓN: RECETAS SALUDABLES & ALTERNATIVAS */}
        {(viewAll || activeTab === 'recipes') && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Healthy Mediterranean Alternative Recommendation */}
            {product.healthyAlternative && (
              <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-emerald-300 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Alternativa Mediterránea Recomendada en Supermercado:</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {product.healthyAlternative}
                </p>
              </div>
            )}

            {/* Dedicated Recipes Generator with Scanned Product & Ingredients */}
            <ScannedProductRecipeSection
              productName={product.productName}
              brand={product.brand}
              ingredients={product.ingredientsList}
              userProfile={userProfile}
              onAddMealToDiary={onSaveMealAnalysis}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 pb-6 border-t border-slate-100">
          {onResetScan && (
            <button
              onClick={onResetScan}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Escanear Otro Producto</span>
            </button>
          )}

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {onToggleSaveScan && (
              <button
                onClick={() => onToggleSaveScan(product)}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 border cursor-pointer ${
                  isSavedInGallery
                    ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                    : 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-400 shadow-sm'
                }`}
              >
                {isSavedInGallery ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-amber-700" />
                    <span>✓ En Galería</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-slate-950" />
                    <span>Guardar Escaneo</span>
                  </>
                )}
              </button>
            )}

            {onAddToWeeklyPlan && (
              <button
                type="button"
                onClick={() => setIsWeeklyPlanModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <CalendarDays className="w-4 h-4 text-emerald-400" />
                <span>Añadir a Plan Semanal</span>
              </button>
            )}

            {onSaveAsMeal && (
              <button
                onClick={() => onSaveAsMeal(product)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Añadir a mi Diario</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal para Añadir al Plan Semanal */}
        {isWeeklyPlanModalOpen && (
          <AddToWeeklyPlanModal
            isOpen={isWeeklyPlanModalOpen}
            onClose={() => setIsWeeklyPlanModalOpen(false)}
            meal={product}
            currentWeeklyPlan={currentWeeklyPlan || []}
            onConfirmAddToPlan={(dayIdx, mealType, dish) => {
              if (onAddToWeeklyPlan) {
                onAddToWeeklyPlan(dayIdx, mealType, dish);
              }
            }}
            onNavigateToWeeklyPlan={onNavigateToWeeklyPlan}
          />
        )}

        {/* Descargo Médico Visible para Productos */}
        <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-2xl text-[11px] text-amber-900/90 leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>Descargo de Responsabilidad Nutricional:</strong> El semáforo nutricional de salud, la clasificación NOVA y la detección de aditivos son orientativos basados en el etiquetado del fabricante y estándares de salud pública. Compruebe siempre el envase físico en caso de alergias o intolerancias graves.
          </p>
        </div>
      </div>
    </div>
  );
};
