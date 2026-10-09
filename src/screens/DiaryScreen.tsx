import React, { useState, useEffect } from 'react';
import { MealAnalysis, UserProfile } from '../types';
import {
  Plus,
  Trash2,
  Calendar,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  Camera,
  ChevronRight,
  ChevronLeft,
  Edit3,
  X,
  Minus,
  Sparkles,
  CheckCircle2,
  Clock,
  Filter,
  History,
  Layers,
  Utensils,
  Leaf,
  FileText,
  LayoutGrid,
  List,
  Trophy,
  Zap,
  ArrowRight
} from 'lucide-react';
import { NutritionalAnalysisResultCard } from '../components/NutritionalAnalysisResultCard';
import { WeeklyReportExportModal } from '../components/WeeklyReportExportModal';
import { calculateStreakStats } from '../services/streakTracker';

interface Props {
  userProfile: UserProfile;
  loggedMeals: MealAnalysis[];
  onDeleteMeal: (id: string) => void;
  onUpdateMeal?: (updatedMeal: MealAnalysis) => void;
  onNavigateToScan: () => void;
}

// Helpers para fechas exactas en zona horaria local
const getLocalDateKey = (d: Date | number): string => {
  const date = typeof d === 'number' ? new Date(d) : d;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getTodayKey = (): string => getLocalDateKey(new Date());

const getYesterdayKey = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateKey(d);
};

const formatHumanDate = (dateKey: string): { title: string; subtitle: string; isToday: boolean } => {
  if (dateKey === 'ALL') {
    return {
      title: 'Histórico Completo',
      subtitle: 'Mostrando todas las recetas registradas',
      isToday: false,
    };
  }

  const today = getTodayKey();
  const yesterday = getYesterdayKey();

  const [year, month, day] = dateKey.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);

  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const fullDateText = `${dayNames[dateObj.getDay()]}, ${day} de ${monthNames[dateObj.getMonth()]} de ${year}`;

  if (dateKey === today) {
    return {
      title: 'Hoy',
      subtitle: fullDateText,
      isToday: true,
    };
  }
  if (dateKey === yesterday) {
    return {
      title: 'Ayer',
      subtitle: fullDateText,
      isToday: false,
    };
  }
  return {
    title: fullDateText,
    subtitle: `${day} / ${String(month).padStart(2, '0')} / ${year}`,
    isToday: false,
  };
};

const formatTimeFromTimestamp = (timestamp?: number): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes} h`;
};

export const DiaryScreen: React.FC<Props> = ({
  userProfile,
  loggedMeals,
  onDeleteMeal,
  onUpdateMeal,
  onNavigateToScan,
}) => {
  // Filtro de fecha activo (por defecto Hoy en formato YYYY-MM-DD o 'ALL')
  const [selectedDate, setSelectedDate] = useState<string>(getTodayKey());
  const [editingMeal, setEditingMeal] = useState<MealAnalysis | null>(null);
  const [mealCategoryFilter, setMealCategoryFilter] = useState<'ALL' | 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack'>('ALL');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [viewLayoutMode, setViewLayoutMode] = useState<'list' | 'mosaic'>('list');

  // Hidratación reactiva según la fecha seleccionada
  const [waterGlasses, setWaterGlasses] = useState<number>(() => {
    try {
      const todayKey = `tunutrilens_water_${getTodayKey()}`;
      const saved = localStorage.getItem(todayKey);
      return saved ? parseInt(saved, 10) : 4; // default 4 vasos = 1.0L
    } catch {
      return 4;
    }
  });

  // Al cambiar de fecha, cargamos los vasos de agua correspondientes a esa fecha
  useEffect(() => {
    if (selectedDate === 'ALL') return;
    try {
      const key = `tunutrilens_water_${selectedDate}`;
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        setWaterGlasses(parseInt(saved, 10) || 0);
      } else {
        setWaterGlasses(selectedDate === getTodayKey() ? 4 : 0);
      }
    } catch {
      setWaterGlasses(0);
    }
  }, [selectedDate]);

  const GLASS_ML = 250;
  const DAILY_WATER_GOAL_ML = 2500; // 2.5 Litros
  const currentWaterMl = waterGlasses * GLASS_ML;
  const waterLiters = (currentWaterMl / 1000).toFixed(2);
  const waterGoalLiters = (DAILY_WATER_GOAL_ML / 1000).toFixed(1);
  const waterPct = Math.min(Math.round((currentWaterMl / DAILY_WATER_GOAL_ML) * 100), 100);

  const saveWaterState = (newGlasses: number) => {
    const keyDate = selectedDate === 'ALL' ? getTodayKey() : selectedDate;
    try {
      localStorage.setItem(`tunutrilens_water_${keyDate}`, newGlasses.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddGlass = () => {
    setWaterGlasses((prev) => {
      const next = Math.min(prev + 1, 16);
      saveWaterState(next);
      return next;
    });
  };

  const handleRemoveGlass = () => {
    setWaterGlasses((prev) => {
      const next = Math.max(prev - 1, 0);
      saveWaterState(next);
      return next;
    });
  };

  // Navegación de fechas
  const handlePrevDay = () => {
    if (selectedDate === 'ALL') {
      setSelectedDate(getYesterdayKey());
      return;
    }
    const [year, month, day] = selectedDate.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() - 1);
    setSelectedDate(getLocalDateKey(d));
  };

  const handleNextDay = () => {
    if (selectedDate === 'ALL') {
      setSelectedDate(getTodayKey());
      return;
    }
    const [year, month, day] = selectedDate.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    d.setDate(d.getDate() + 1);
    setSelectedDate(getLocalDateKey(d));
  };

  // Filtrado estricto por fecha seleccionada
  const dateFilteredMeals = selectedDate === 'ALL'
    ? loggedMeals
    : loggedMeals.filter((m) => {
        const mealKey = getLocalDateKey(m.timestamp || Date.now());
        return mealKey === selectedDate;
      });

  // Filtrado adicional por tipo de comida (si el usuario pulsa en Desayuno, Almuerzo, etc.)
  const displayedMeals = mealCategoryFilter === 'ALL'
    ? dateFilteredMeals
    : dateFilteredMeals.filter((m) => m.mealType === mealCategoryFilter);

  // Cálculos del resumen diario basados ÚNICAMENTE en las recetas de la fecha seleccionada
  const totalCalories = dateFilteredMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const totalProtein = dateFilteredMeals.reduce((acc, m) => acc + (m.proteinGrams || 0), 0);
  const totalCarbs = dateFilteredMeals.reduce((acc, m) => acc + (m.carbsGrams || 0), 0);
  const totalFat = dateFilteredMeals.reduce((acc, m) => acc + (m.fatGrams || 0), 0);
  const totalFiber = dateFilteredMeals.reduce((acc, m) => acc + (m.fiberGrams || 0), 0);

  const calPct = Math.min(Math.round((totalCalories / userProfile.dailyCalorieTarget) * 100), 100);
  const protPct = Math.min(Math.round((totalProtein / userProfile.dailyProteinTargetG) * 100), 100);
  const carbPct = Math.min(Math.round((totalCarbs / userProfile.dailyCarbsTargetG) * 100), 100);
  const fatPct = Math.min(Math.round((totalFat / userProfile.dailyFatTargetG) * 100), 100);

  // Fechas disponibles que contienen al menos 1 receta registrada
  const datesWithMeals = Array.from(
    new Set(loggedMeals.map((m) => getLocalDateKey(m.timestamp || Date.now())))
  ).sort().reverse();

  const humanDate = formatHumanDate(selectedDate);
  const isToday = selectedDate === getTodayKey();

  const streakStats = calculateStreakStats(loggedMeals);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-12">
      {/* Header & Date Navigation Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Diario Nutricional • Control Diario</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
              Resumen Diario
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-black px-3.5 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
              title="Exportar informe médico o para WhatsApp"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Exportar Informe</span>
              <span className="sm:hidden">Informe</span>
            </button>

            <button
              onClick={onNavigateToScan}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-xs transition-all active:scale-95 shrink-0"
            >
              <Camera className="w-4 h-4" />
              <span>Añadir Comida</span>
            </button>
          </div>
        </div>

        {/* Barra de Control y Selección de Fecha */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {/* Navegador Día Anterior / Siguiente */}
          <div className="flex items-center justify-between sm:justify-start gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/70">
            <button
              onClick={handlePrevDay}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-2xs"
              title="Día anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="px-3 text-center min-w-[170px]">
              <div className="text-sm font-black text-slate-900 flex items-center justify-center gap-1.5">
                <span>{humanDate.title}</span>
                {isToday && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Día actual"></span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">{humanDate.subtitle}</p>
            </div>

            <button
              onClick={handleNextDay}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-2xs"
              title="Día siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Selector Rápido: Hoy, Ayer, Selector de Fecha o Todo */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedDate(getTodayKey())}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDate === getTodayKey()
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Hoy
            </button>

            <button
              onClick={() => setSelectedDate(getYesterdayKey())}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDate === getYesterdayKey()
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Ayer
            </button>

            {/* Input nativo de calendario */}
            <div className="relative inline-flex items-center">
              <input
                type="date"
                value={selectedDate === 'ALL' ? getTodayKey() : selectedDate}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(e.target.value);
                  }
                }}
                className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                title="Elegir una fecha específica del calendario"
              />
            </div>

            <button
              onClick={() => setSelectedDate('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                selectedDate === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Ver todas las comidas guardadas en cualquier fecha"
            >
              <History className="w-3 h-3" />
              <span>Todo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Racha de Días Saludables & Retención Google Play */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 rounded-3xl p-4 sm:p-5 shadow-sm border border-amber-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-black text-xl shrink-0 shadow-md">
            🔥 {streakStats.currentStreak}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-950">
                Racha de Compromiso Saludable
              </span>
              <span className="px-2 py-0.5 bg-slate-950/20 text-slate-950 text-[10px] font-black rounded-md">
                {streakStats.badgeTitle}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-slate-950">
              {streakStats.currentStreak === 0
                ? '¡Comienza hoy tu racha registrando tu primer plato!'
                : `${streakStats.currentStreak} ${streakStats.currentStreak === 1 ? 'día consecutivo activo' : 'días consecutivos activos'} (${streakStats.loggedDaysCount} días en total)`}
            </h4>
            <p className="text-xs text-slate-900/80 font-medium">
              {streakStats.currentStreak >= 14
                ? '🏆 ¡Hito de 14 días completado con éxito para Closed Testing!'
                : `Objetivo: Te faltan ${Math.max(1, 14 - streakStats.currentStreak)} días para el hito de 14 días`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <div className="bg-slate-950/10 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-900 uppercase block">Mejor Racha</span>
            <span className="text-sm font-black text-slate-950">⚡ {streakStats.longestStreak} días</span>
          </div>
        </div>
      </div>

      {/* Tarjeta Resumen Metas del Día Seleccionado */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-slate-100 p-5 rounded-2xl shadow-inner border border-teal-900/40">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 text-[11px] font-bold uppercase tracking-wider">
              <Flame className="w-3 h-3 text-teal-400" />
              <span>Calorías del {selectedDate === 'ALL' ? 'Histórico' : humanDate.title}</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">
              {totalCalories} <span className="text-sm text-teal-200/70 font-medium">/ {userProfile.dailyCalorieTarget} kcal</span>
            </div>
            <p className="text-xs text-teal-100/90 font-medium">
              {selectedDate === 'ALL' ? (
                `Suma total de ${loggedMeals.length} platos registrados en la aplicación`
              ) : userProfile.dailyCalorieTarget - totalCalories > 0 ? (
                `Te quedan ${userProfile.dailyCalorieTarget - totalCalories} kcal para el objetivo de este día`
              ) : (
                '¡Has alcanzado o superado el objetivo calórico fijado para este día!'
              )}
            </p>
          </div>

          {/* Indicador Radial */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r="38" stroke="#1e293b" strokeWidth="8" fill="transparent" />
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="#10b981"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={238}
                strokeDashoffset={238 - (238 * calPct) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-sm sm:text-base font-extrabold text-emerald-400">{calPct}%</span>
              <span className="block text-[9px] text-teal-200 font-bold uppercase">Meta</span>
            </div>
          </div>
        </div>

        {/* Barras de Progreso de Macronutrientes para la fecha */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Proteínas */}
          <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-100/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-teal-950 flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-teal-600" /> Proteínas
              </span>
              <span className="font-black text-slate-900">{Math.round(totalProtein)} / {userProfile.dailyProteinTargetG}g</span>
            </div>
            <div className="w-full h-2.5 bg-teal-200/60 rounded-full overflow-hidden">
              <div className="h-full bg-teal-600 rounded-full transition-all duration-300" style={{ width: `${protPct}%` }} />
            </div>
            <div className="text-[10px] text-teal-800 font-bold text-right">{protPct}% completado</div>
          </div>

          {/* Carbohidratos */}
          <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-100/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-sky-950 flex items-center gap-1.5">
                <Wheat className="w-4 h-4 text-sky-600" /> Carbos
              </span>
              <span className="font-black text-slate-900">{Math.round(totalCarbs)} / {userProfile.dailyCarbsTargetG}g</span>
            </div>
            <div className="w-full h-2.5 bg-sky-200/60 rounded-full overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full transition-all duration-300" style={{ width: `${carbPct}%` }} />
            </div>
            <div className="text-[10px] text-sky-800 font-bold text-right">{carbPct}% completado</div>
          </div>

          {/* Grasas */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-100/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-amber-600" /> Grasas
              </span>
              <span className="font-black text-slate-900">{Math.round(totalFat)} / {userProfile.dailyFatTargetG}g</span>
            </div>
            <div className="w-full h-2.5 bg-amber-200/60 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${fatPct}%` }} />
            </div>
            <div className="text-[10px] text-amber-800 font-bold text-right">{fatPct}% completado</div>
          </div>
        </div>

        {/* Tarjeta de Hidratación & Registro de Agua para la fecha */}
        {selectedDate !== 'ALL' && (
          <div className="bg-gradient-to-r from-sky-50 to-blue-50/80 p-4 rounded-2xl border border-sky-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-blue-950">
                    Hidratación ({humanDate.title})
                  </h4>
                  <p className="text-[11px] text-blue-800">
                    Objetivo: {waterGoalLiters} L ({DAILY_WATER_GOAL_ML / GLASS_ML} vasos de 250ml)
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm sm:text-base font-black text-blue-950">{waterLiters}</span>
                <span className="text-xs font-bold text-blue-700 ml-1">/ {waterGoalLiters} L</span>
                <span className="ml-2 text-[10px] font-extrabold bg-blue-200/80 text-blue-900 px-2 py-0.5 rounded-md">
                  {waterPct}%
                </span>
              </div>
            </div>

            {/* Barra de progreso de agua */}
            <div className="w-full h-2.5 bg-blue-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${waterPct}%` }}
              />
            </div>

            {/* Vasos interactivos y controles */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-[65%] sm:max-w-none">
                {Array.from({ length: 10 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const newGlasses = index + 1;
                      setWaterGlasses(newGlasses);
                      saveWaterState(newGlasses);
                    }}
                    className={`w-6 h-7 rounded-md flex items-center justify-center text-xs font-bold transition-all ${
                      index < waterGlasses
                        ? 'bg-blue-600 text-white shadow-xs scale-105'
                        : 'bg-white text-slate-300 border border-blue-200/60 hover:border-blue-400'
                    }`}
                    title={`Vaso ${index + 1} (${(index + 1) * 250}ml)`}
                  >
                    💧
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleRemoveGlass}
                  disabled={waterGlasses <= 0}
                  className="w-8 h-8 rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-100/50 disabled:opacity-40 flex items-center justify-center transition-all shadow-2xs"
                  title="Quitar un vaso (-250ml)"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleAddGlass}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
                  title="Añadir un vaso (+250ml)"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+250 ml</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sección de Platos Registrados */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-emerald-600" />
              <span>Platos Registrados {selectedDate === 'ALL' ? '(Histórico)' : `el ${humanDate.title}`}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {displayedMeals.length} {displayedMeals.length === 1 ? 'plato' : 'platos'}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              {selectedDate === 'ALL'
                ? 'Mostrando todas las comidas de tu historial'
                : `Mostrando únicamente las comidas correspondientes al ${humanDate.subtitle}`}
            </p>
          </div>

          {/* Filtro por tipo de comida y Selector de Vista Lista/Mosaico */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold overflow-x-auto max-w-full">
              {(['ALL', 'Desayuno', 'Almuerzo', 'Cena', 'Snack'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMealCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                    mealCategoryFilter === cat
                      ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'ALL' ? 'Todos' : cat}
                </button>
              ))}
            </div>

            {/* Switcher Lista vs Mosaico */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setViewLayoutMode('list')}
                className={`p-1.5 rounded-lg transition ${
                  viewLayoutMode === 'list' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Vista Lista detallada"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewLayoutMode('mosaic')}
                className={`p-1.5 rounded-lg transition ${
                  viewLayoutMode === 'mosaic' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Mosaico Visual de Fotos de Platos"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Platos o Estado Vacío */}
        {displayedMeals.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Camera className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <p className="text-base font-extrabold text-slate-800">
                {selectedDate === 'ALL'
                  ? 'Aún no has registrado ningún plato en la aplicación'
                  : `No hay platos registrados para el ${humanDate.title}`}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {selectedDate === getTodayKey()
                  ? 'Usa el escáner para fotografiar tu plato, elegir una receta o registrar lo que has comido hoy.'
                  : `Puedes usar el escáner para registrar comidas o volver a la fecha de hoy para ver tu ingesta actual.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={onNavigateToScan}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs inline-flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Registrar Comida Ahora</span>
              </button>

              {selectedDate !== getTodayKey() && (
                <button
                  onClick={() => setSelectedDate(getTodayKey())}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                >
                  Volver a Hoy
                </button>
              )}
            </div>
          </div>
        ) : viewLayoutMode === 'mosaic' ? (
          /* Mosaico Visual de Fotos */
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {displayedMeals.map((meal) => (
              <div
                key={meal.id}
                onClick={() => setEditingMeal(meal)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-400 hover:shadow-md transition cursor-pointer group flex flex-col"
              >
                <div className="h-32 sm:h-40 w-full relative bg-slate-100 overflow-hidden">
                  {meal.imageUri ? (
                    <img
                      src={meal.imageUri}
                      alt={meal.dishName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50 text-emerald-700">
                      <Utensils className="w-8 h-8 opacity-60" />
                      <span className="text-[10px] font-black uppercase mt-1">{meal.mealType}</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
                    {meal.mealType}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-emerald-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                    {meal.calories} kcal
                  </span>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition">
                      {meal.dishName}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 mt-1">
                      <span>P: {Math.round(meal.proteinGrams)}g</span>
                      <span>•</span>
                      <span>C: {Math.round(meal.carbsGrams)}g</span>
                      <span>•</span>
                      <span>G: {Math.round(meal.fatGrams)}g</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-700 mt-2">
                    <span>Ver / Editar</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {displayedMeals.map((meal) => {
              const mealDateKey = getLocalDateKey(meal.timestamp || Date.now());
              const timeStr = formatTimeFromTimestamp(meal.timestamp);

              return (
                <div
                  key={meal.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-300 transition-all group"
                >
                  <div className="flex items-start sm:items-center gap-3.5 w-full sm:w-auto">
                    {meal.imageUri ? (
                      <img
                        src={meal.imageUri}
                        alt={meal.dishName}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex flex-col items-center justify-center font-black text-xl shrink-0 shadow-2xs">
                        <Utensils className="w-6 h-6 text-emerald-600 mb-0.5" />
                        <span className="text-[10px] font-extrabold uppercase text-emerald-700">{meal.mealType}</span>
                      </div>
                    )}

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60">
                          {meal.mealType}
                        </span>

                        {timeStr && (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{timeStr}</span>
                          </span>
                        )}

                        {selectedDate === 'ALL' && (
                          <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                            📅 {mealDateKey}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-emerald-900 transition-colors">
                        {meal.dishName}
                      </h4>

                      <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span>{meal.estimatedWeightGrams || 300}g</span>
                        <span>•</span>
                        <span className="text-teal-700 font-bold">P: {Math.round(meal.proteinGrams)}g</span>
                        <span>|</span>
                        <span className="text-sky-700 font-bold">C: {Math.round(meal.carbsGrams)}g</span>
                        <span>|</span>
                        <span className="text-amber-700 font-bold">G: {Math.round(meal.fatGrams)}g</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3.5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div className="text-lg sm:text-xl font-black text-slate-950">
                        {meal.calories}
                        <span className="text-xs text-emerald-600 font-bold ml-1">kcal</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium block">Calorías aportadas</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingMeal(meal)}
                        className="p-2.5 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all flex items-center gap-1.5 text-xs font-bold border border-emerald-200/50 shadow-2xs"
                        title="Ver ficha nutricional detallada o editar plato"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Ver / Editar</span>
                      </button>

                      <button
                        onClick={() => onDeleteMeal(meal.id)}
                        className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                        title="Eliminar este plato del diario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal para editar plato guardado e imagen */}
      {editingMeal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fadeIn relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-600" />
                  <span>Detalle y Edición de Plato</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Fecha de registro: {formatHumanDate(getLocalDateKey(editingMeal.timestamp || Date.now())).title} ({formatTimeFromTimestamp(editingMeal.timestamp)})
                </p>
              </div>
              <button
                onClick={() => setEditingMeal(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <NutritionalAnalysisResultCard
              meal={editingMeal}
              isSaved={true}
              onUpdateMeal={(updated) => {
                if (onUpdateMeal) {
                  onUpdateMeal(updated);
                }
                setEditingMeal(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Modal de Exportación de Informe Semanal para Nutricionista / Médico */}
      <WeeklyReportExportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        userProfile={userProfile}
        loggedMeals={loggedMeals}
      />
    </div>
  );
};
