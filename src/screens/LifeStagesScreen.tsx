import React, { useState, useEffect } from 'react';
import { MealAnalysis, UserProfile, DayPlan } from '../types';
import {
  LifeStageGuideline,
  OFFICIAL_ESPEN_ASPEN_GUIDELINES,
  loadCustomLifeStagesGuidelines,
  saveCustomLifeStagesGuidelines,
  resetGuidelinesToOfficial
} from '../data/lifeStagesGuidelines';
import { LifeStageCustomizerModal } from '../components/LifeStageCustomizerModal';
import { RecommendedDish } from '../data/dishesCatalog';
import { AddToWeeklyPlanModal } from '../components/AddToWeeklyPlanModal';
import {
  Baby,
  Sparkles,
  HeartPulse,
  Apple,
  Dumbbell,
  ShieldCheck,
  Check,
  Plus,
  ArrowRight,
  Flame,
  Droplets,
  AlertCircle,
  HelpCircle,
  GraduationCap,
  Sliders,
  RotateCcw,
  BookOpen,
  UserCheck,
  Zap,
  Utensils,
  CalendarDays
} from 'lucide-react';

interface Props {
  userProfile: UserProfile;
  onAddMealToDiary: (meal: MealAnalysis) => void;
  onUpdateProfile?: (profile: UserProfile) => void;
  currentWeeklyPlan?: DayPlan[];
  onAddToWeeklyPlan?: (
    dayIndex: number,
    mealType: 'desayuno' | 'almuerzo' | 'cena' | 'snack',
    dish: RecommendedDish
  ) => void;
  onNavigateToWeeklyPlan?: () => void;
}

export const LifeStagesScreen: React.FC<Props> = ({
  userProfile,
  onAddMealToDiary,
  onUpdateProfile,
  currentWeeklyPlan,
  onAddToWeeklyPlan,
  onNavigateToWeeklyPlan
}) => {
  const [guidelines, setGuidelines] = useState<Record<string, LifeStageGuideline>>(loadCustomLifeStagesGuidelines());
  const [selectedStageId, setSelectedStageId] = useState<string>('senior');
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);
  const [isWeeklyPlanModalOpen, setIsWeeklyPlanModalOpen] = useState(false);
  const [dishForPlanModal, setDishForPlanModal] = useState<RecommendedDish | null>(null);

  useEffect(() => {
    setGuidelines(loadCustomLifeStagesGuidelines());
  }, []);

  const activeStage = guidelines[selectedStageId] || guidelines.senior;
  const officialRef = OFFICIAL_ESPEN_ASPEN_GUIDELINES[selectedStageId] || OFFICIAL_ESPEN_ASPEN_GUIDELINES.senior;

  const handleAddDish = (dish: RecommendedDish) => {
    const meal: MealAnalysis = {
      id: 'ls_add_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      dishName: dish.dishName,
      description: dish.description,
      mealType: dish.mealType,
      estimatedWeightGrams: 300,
      healthIndex: 9.8,
      reliabilityConfidence: 99,
      calories: dish.calories,
      proteinGrams: dish.proteinGrams,
      carbsGrams: dish.carbsGrams,
      fatGrams: dish.fatGrams,
      fiberGrams: 7,
      sugarGrams: 3,
      saturatedFatGrams: 2,
      micronutrients: {
        vitaminA_mcg: 150,
        vitaminC_mg: 45,
        vitaminD_iu: activeStage.targetValues.vitaminD_iu,
        vitaminB12_mcg: activeStage.targetValues.vitaminB12_mcg,
        calcium_mg: activeStage.targetValues.calcium_mg,
        iron_mg: activeStage.targetValues.iron_mg,
        potassium_mg: activeStage.targetValues.potassium_mg,
        sodium_mg: 280,
        magnesium_mg: activeStage.targetValues.magnesium_mg,
        zinc_mg: activeStage.targetValues.zinc_mg,
      },
      foodItems: dish.ingredients.map((ing) => ({
        name: ing,
        estimatedWeightGrams: 80,
        calories: Math.round(dish.calories / Math.max(dish.ingredients.length, 1)),
        proteinGrams: Math.round(dish.proteinGrams / Math.max(dish.ingredients.length, 1)),
        carbsGrams: Math.round(dish.carbsGrams / Math.max(dish.ingredients.length, 1)),
        fatGrams: Math.round(dish.fatGrams / Math.max(dish.ingredients.length, 1)),
      })),
      warnings: [],
      personalizedRecommendations: [
        `Plato específico adaptado para la etapa: ${activeStage.title} (${activeStage.clinicalSociety}).`,
      ],
      timestamp: Date.now(),
    };

    onAddMealToDiary(meal);
    setAddedIds((prev) => [...prev, dish.id]);
  };

  const handleApplyToProfile = () => {
    if (!onUpdateProfile) return;
    const weight = userProfile.currentWeightKg || 70;
    const proteinG = Math.round(weight * activeStage.targetValues.proteinGPerKgMin);
    const kcalPerKg = activeStage.targetValues.caloriesKcalPerKg || 30;
    const targetCalories = Math.round(weight * kcalPerKg);
    const fatPercent = activeStage.targetValues.fatPercent || 30;
    const fatG = Math.round((targetCalories * (fatPercent / 100)) / 9);
    const carbsG = Math.round((targetCalories - proteinG * 4 - fatG * 9) / 4);

    const updatedProfile: UserProfile = {
      ...userProfile,
      dailyCalorieTarget: targetCalories,
      dailyProteinTargetG: proteinG,
      dailyCarbsTargetG: carbsG,
      dailyFatTargetG: fatG,
      goal: `Etapa: ${activeStage.title.split('/')[0].trim()}` as any
    };

    onUpdateProfile(updatedProfile);
    setAppliedNotification(`¡Objetivos actualizados a ${activeStage.title} (${targetCalories} kcal, ${proteinG}g proteína)!`);
    setTimeout(() => setAppliedNotification(null), 4000);
  };

  const getStageIcon = (id: string) => {
    switch (id) {
      case 'infancy': return Baby;
      case 'adolescence': return GraduationCap;
      case 'menopause': return HeartPulse;
      case 'pregnancy': return Droplets;
      case 'athlete': return Dumbbell;
      case 'senior': return Sparkles;
      default: return HeartPulse;
    }
  };

  const StageIcon = getStageIcon(activeStage.id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-800 font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Guías Clínicas ESPEN / ASPEN</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Nutrición por Etapas de la Vida
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Recomendaciones actualizadas de macronutrientes, micronutrientes y opciones de personalización individual.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsCustomizerOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Sliders className="w-4 h-4 text-emerald-200" />
            <span>Modificar Recomendaciones</span>
          </button>
        </div>
      </div>

      {appliedNotification && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-xs rounded-2xl flex items-center gap-2 shadow-xs animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-700 stroke-[3]" />
          <span>{appliedNotification}</span>
        </div>
      )}

      {/* Selector de Etapas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {Object.values(guidelines).map((stage) => {
          const Icon = getStageIcon(stage.id);
          const isActive = stage.id === selectedStageId;

          return (
            <button
              key={stage.id}
              onClick={() => setSelectedStageId(stage.id)}
              className={`p-3.5 rounded-2xl transition-all border text-left flex flex-col justify-between space-y-3 ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50/50 hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-100 text-slate-800'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border ${
                  isActive ? 'bg-emerald-400 text-slate-950 border-emerald-400' : stage.badgeColor
                }`}>
                  {stage.ageRange}
                </span>
              </div>

              <div>
                <div className="text-xs font-black leading-snug">{stage.title.split('/')[0]}</div>
                <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{stage.clinicalSociety}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detalle de la Etapa Seleccionada */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
        {/* Banner principal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3.5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl shadow-xs">
              <StageIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">{activeStage.title}</h2>
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg border ${activeStage.badgeColor}`}>
                  {activeStage.ageRange}
                </span>
                <span className="text-xs font-black px-2 py-0.5 bg-teal-100 text-teal-900 border border-teal-200 rounded-lg">
                  {activeStage.clinicalSociety}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">{activeStage.subtitle}</p>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                📚 <strong>Guía Clínica Oficial:</strong> {activeStage.officialGuidelineRef}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCustomizerOpen(true)}
              className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Modificar Valores</span>
            </button>

            {onUpdateProfile && (
              <button
                type="button"
                onClick={handleApplyToProfile}
                className="text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                title="Aplica los objetivos de macros de esta etapa a tu perfil actual"
              >
                <UserCheck className="w-4 h-4" />
                <span>Aplicar a Mi Perfil</span>
              </button>
            )}
          </div>
        </div>

        {/* Resumen de Macronutrientes y Fórmulas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-emerald-600" />
              <span>Macronutrientes Clínicos Recomendados (ESPEN / ASPEN)</span>
            </h3>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              🔥 Gasto: {activeStage.caloriesFormula}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-1">
              <span className="text-[10px] font-black text-emerald-900 uppercase tracking-wider block">
                Proteínas Recomendadas
              </span>
              <strong className="text-slate-900 font-black text-base block">{activeStage.macroRatio.proteinGPerKg}</strong>
              <p className="text-[11px] text-emerald-950/80 font-medium">
                {activeStage.macroRatio.proteinPercent} del VCT ({activeStage.targetValues.proteinGPerKgMin} - {activeStage.targetValues.proteinGPerKgMax} g/kg)
              </p>
            </div>

            <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 space-y-1">
              <span className="text-[10px] font-black text-sky-900 uppercase tracking-wider block">
                Carbohidratos Complejos
              </span>
              <strong className="text-slate-900 font-black text-base block">{activeStage.macroRatio.carbsPercent}</strong>
              <p className="text-[11px] text-sky-950/80 font-medium">
                Meta de Fibra: {activeStage.targetValues.fiberGrams}g/día ({activeStage.macroRatio.fiberGrams})
              </p>
            </div>

            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1">
              <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider block">
                Grasas Saludables & AOVE
              </span>
              <strong className="text-slate-900 font-black text-base block">{activeStage.macroRatio.fatPercent}</strong>
              <p className="text-[11px] text-amber-950/80 font-medium">
                Omega-3 DHA/EPA: {activeStage.targetValues.omega3_dha_mg} mg/día
              </p>
            </div>
          </div>
        </div>

        {/* Nutrientes Clave y Micronutrientes */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Micronutrientes y Objetivos Clínicos Prioritarios</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeStage.keyNutrients.map((nut, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">{nut.name}</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-black text-[10px] rounded-md">
                    {nut.amount}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{nut.reason}</p>
                <span className="text-[9px] font-black text-teal-700 block uppercase pt-0.5">
                  Ref: {nut.clinicalSource}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Consejos Clínicos */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Pautas Clínicas y Hábitos de Consenso</span>
          </h3>

          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-white rounded-2xl p-4.5 border border-emerald-200 space-y-2.5">
            {activeStage.clinicalTips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-emerald-950 font-medium">
                <span className="text-emerald-700 font-extrabold text-sm leading-none">•</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Real Food Sources */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Apple className="w-4 h-4 text-emerald-600" />
            <span>Fuentes de Comida Real de Mercado Recomendadas</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeStage.realFoodSources.map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-black text-xs text-slate-900">{item.food}</span>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                    {item.portion}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  ✨ <strong>Beneficio:</strong> {item.benefit}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Alimentos a Limitar */}
        <div className="space-y-2">
          <h3 className="text-xs font-black text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Alimentos a Limitar o Restringir</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {activeStage.forbiddenOrAvoid.map((avoid, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-rose-50 text-rose-900 border border-rose-200 font-bold text-xs rounded-xl flex items-center gap-1"
              >
                <span>✕</span>
                <span>{avoid}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Platos Específicos Recomendados */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-teal-600" />
              <span>Platos Adaptados y Seguros para {activeStage.title}</span>
            </h3>
            <span className="text-xs text-slate-500 font-bold">
              {activeStage.recommendedDishes.length} recetas clínicas listas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {activeStage.recommendedDishes.map((dish) => {
              const isAdded = addedIds.includes(dish.id);

              return (
                <div
                  key={dish.id}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black px-2 py-0.5 bg-white text-emerald-900 border border-emerald-200 rounded-md uppercase">
                        {dish.mealType}
                      </span>
                      <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>{dish.calories} kcal</span>
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-slate-900 leading-snug">{dish.dishName}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{dish.description}</p>

                    <div className="flex items-center gap-3 text-[10px] font-extrabold text-slate-700 pt-1">
                      <span>Prot: {dish.proteinGrams}g</span>
                      <span>•</span>
                      <span>Carb: {dish.carbsGrams}g</span>
                      <span>•</span>
                      <span>Grasa: {dish.fatGrams}g</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleAddDish(dish)}
                      disabled={isAdded}
                      className={`py-2 px-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        isAdded
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
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
                          <span>+ A Diario</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setDishForPlanModal(dish);
                        setIsWeeklyPlanModalOpen(true);
                      }}
                      className="py-2 px-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white flex items-center justify-center gap-1 shadow-xs transition cursor-pointer"
                    >
                      <CalendarDays className="w-3.5 h-3.5 text-blue-200" />
                      <span>📅 Al Plan</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Customizer Modal */}
      <LifeStageCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        initialStageId={selectedStageId}
        userProfile={userProfile}
        onApplyToProfile={(up) => {
          if (onUpdateProfile) onUpdateProfile(up);
        }}
        onGuidelinesUpdated={(updated) => setGuidelines(updated)}
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
