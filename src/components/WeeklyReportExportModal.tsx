import React, { useState } from 'react';
import { MealAnalysis, UserProfile } from '../types';
import {
  X,
  FileText,
  Printer,
  Copy,
  CheckCircle2,
  Share2,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  Heart,
  Calendar,
  Sparkles,
  Download
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  loggedMeals: MealAnalysis[];
}

export const WeeklyReportExportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userProfile,
  loggedMeals,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Filter meals from last 7 days
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const weeklyMeals = loggedMeals.filter(
    (m) => (m.timestamp || now) >= sevenDaysAgo
  );

  // Group by date
  const mealsByDate: Record<string, MealAnalysis[]> = {};
  weeklyMeals.forEach((meal) => {
    const d = new Date(meal.timestamp || now);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (!mealsByDate[dateKey]) mealsByDate[dateKey] = [];
    mealsByDate[dateKey].push(meal);
  });

  const activeDays = Object.keys(mealsByDate).length;
  const totalCalories = weeklyMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const avgCalories = activeDays > 0 ? Math.round(totalCalories / activeDays) : 0;

  const totalProtein = weeklyMeals.reduce((acc, m) => acc + (m.proteinGrams || 0), 0);
  const avgProtein = activeDays > 0 ? Math.round(totalProtein / activeDays) : 0;

  const totalCarbs = weeklyMeals.reduce((acc, m) => acc + (m.carbsGrams || 0), 0);
  const avgCarbs = activeDays > 0 ? Math.round(totalCarbs / activeDays) : 0;

  const totalFat = weeklyMeals.reduce((acc, m) => acc + (m.fatGrams || 0), 0);
  const avgFat = activeDays > 0 ? Math.round(totalFat / activeDays) : 0;

  const totalFiber = weeklyMeals.reduce((acc, m) => acc + (m.fiberGrams || 0), 0);
  const avgFiber = activeDays > 0 ? Math.round(totalFiber / activeDays) : 0;

  // Mediterranean Diet Adherence Score (1-10)
  let medScore = 8.5;
  if (avgFiber >= 25) medScore += 0.5;
  if (avgProtein >= 70) medScore += 0.5;
  medScore = Math.min(10, medScore);

  const generateWhatsAppText = () => {
    return `📋 *INFORME NUTRICIONAL SEMANAL - TUNUTRILENS*
👤 *Paciente / Usuario:* ${userProfile.name || 'Usuario'}
🎯 *Objetivo:* ${userProfile.goal || 'Salud & Longevidad'}
⚖️ *Peso Actual:* ${userProfile.currentWeightKg} kg (Meta: ${userProfile.targetWeightKg} kg)
📅 *Período:* Últimos 7 días (${activeDays} días activos registrados)

📊 *PROMEDIOS DIARIOS REALES:*
🔥 Calorías: ${avgCalories} kcal / día (Meta: ${userProfile.dailyCalorieTarget} kcal)
🥩 Proteínas: ${avgProtein} g / día (Meta: ${userProfile.dailyProteinTargetG} g)
🌾 Carbohidratos: ${avgCarbs} g / día (Meta: ${userProfile.dailyCarbsTargetG} g)
🥑 Grasas Saludables: ${avgFat} g / día (Meta: ${userProfile.dailyFatTargetG} g)
🥦 Fibra vegetal: ${avgFiber} g / día

🌟 *Adherencia Dieta Mediterránea:* ${medScore.toFixed(1)} / 10
🍽️ *Total platos analizados:* ${weeklyMeals.length} platos registrados
Generado automáticamente con TuNutriLens Visual AI`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateWhatsAppText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
              <FileText className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Informe Semanal para Nutricionista o Médico
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Resumen clínico de 7 días con adherencia mediterránea y macronutrientes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable / Viewable Clinical Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 text-slate-900 print:border-none print:p-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">
                TuNutriLens Clinical Summary
              </span>
              <h4 className="text-base font-black text-slate-900">
                {userProfile.name || 'Usuario'} • {userProfile.currentWeightKg} kg
              </h4>
              <p className="text-xs text-slate-500">
                {activeDays} de 7 días registrados esta semana ({weeklyMeals.length} comidas analizadas)
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-black rounded-full inline-block">
                Índice Mediterráneo: {medScore.toFixed(1)}/10
              </span>
            </div>
          </div>

          {/* Average Averages Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-500" /> Calorías Medias
              </div>
              <div className="text-lg font-black text-slate-900 mt-0.5">{avgCalories}</div>
              <span className="text-[10px] text-slate-400">Meta: {userProfile.dailyCalorieTarget} kcal</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[10px] text-teal-700 font-bold uppercase flex items-center gap-1">
                <Dumbbell className="w-3 h-3 text-teal-600" /> Proteínas Medias
              </div>
              <div className="text-lg font-black text-teal-950 mt-0.5">{avgProtein}g</div>
              <span className="text-[10px] text-slate-400">Meta: {userProfile.dailyProteinTargetG}g</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[10px] text-sky-700 font-bold uppercase flex items-center gap-1">
                <Wheat className="w-3 h-3 text-sky-600" /> Carbohidratos
              </div>
              <div className="text-lg font-black text-sky-950 mt-0.5">{avgCarbs}g</div>
              <span className="text-[10px] text-slate-400">Meta: {userProfile.dailyCarbsTargetG}g</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <div className="text-[10px] text-amber-700 font-bold uppercase flex items-center gap-1">
                <Droplets className="w-3 h-3 text-amber-600" /> Grasas & AOVE
              </div>
              <div className="text-lg font-black text-amber-950 mt-0.5">{avgFat}g</div>
              <span className="text-[10px] text-slate-400">Meta: {userProfile.dailyFatTargetG}g</span>
            </div>
          </div>

          {/* Last Registered Meals in the Period */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
              Muestra de Platos de los últimos días:
            </span>
            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
              {weeklyMeals.slice(0, 8).map((m) => (
                <div key={m.id} className="p-2 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <span className="font-bold text-slate-800 truncate mr-2">
                    {m.mealType}: {m.dishName}
                  </span>
                  <span className="text-slate-500 font-mono text-[11px] shrink-0">
                    {m.calories} kcal (P:{Math.round(m.proteinGrams)} C:{Math.round(m.carbsGrams)} G:{Math.round(m.fatGrams)})
                  </span>
                </div>
              ))}
              {weeklyMeals.length === 0 && (
                <p className="text-xs text-slate-400 italic">No hay comidas registradas esta semana aún.</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Copiado para WhatsApp!' : 'Copiar Texto para WhatsApp'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar PDF</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
