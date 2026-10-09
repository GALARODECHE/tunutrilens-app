import React, { useState, useEffect } from 'react';
import {
  LifeStageGuideline,
  OFFICIAL_ESPEN_ASPEN_GUIDELINES,
  loadCustomLifeStagesGuidelines,
  saveCustomLifeStagesGuidelines,
  resetGuidelinesToOfficial
} from '../data/lifeStagesGuidelines';
import { LifeStageCustomizerModal } from './LifeStageCustomizerModal';
import { UserProfile } from '../types';
import {
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Apple,
  Dumbbell,
  HeartPulse,
  Flame,
  Wheat,
  Droplets,
  Check,
  Info,
  Utensils,
  ShieldCheck,
  Zap,
  Sliders,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface Props {
  onSelectStageFilter?: (stageName: string) => void;
  selectedStageName?: string;
  userProfile?: UserProfile;
  onUpdateProfile?: (profile: UserProfile) => void;
}

export const LifeStagesNutritionGuide: React.FC<Props> = ({
  onSelectStageFilter,
  selectedStageName,
  userProfile,
  onUpdateProfile
}) => {
  const [guidelines, setGuidelines] = useState<Record<string, LifeStageGuideline>>(loadCustomLifeStagesGuidelines());
  const [activeStageId, setActiveStageId] = useState<string>('senior');
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);

  // Sync state if user changes outside
  useEffect(() => {
    setGuidelines(loadCustomLifeStagesGuidelines());
  }, []);

  const currentStage = guidelines[activeStageId] || guidelines.senior;

  const handleApplyToProfile = (updated: UserProfile) => {
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl shadow-xs">
            <Award className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Guía de Recomendaciones Clínicas (ESPEN / ASPEN)
              </h3>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-md uppercase border border-emerald-200">
                Guías 2024 Actualizadas
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Macronutrientes, micronutrientes esenciales y alimentos reales según consensos de nutrición clínica.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCustomizerOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Sliders className="w-4 h-4 text-emerald-200" />
            <span>Modificar Recomendaciones</span>
          </button>
        </div>
      </div>

      {/* Stage Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {Object.values(guidelines).map((stage) => {
          const isSelected = stage.id === activeStageId;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStageId(stage.id)}
              className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                  isSelected ? 'bg-emerald-400 text-slate-950 font-black' : stage.badgeColor
                }`}>
                  {stage.ageRange}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <div className="text-xs font-black leading-tight">
                {stage.title.split('/')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Stage Detail Card */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-5 animate-in fade-in duration-200">
        {/* Title & Target */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-black text-slate-900">
                {currentStage.title}
              </h4>
              <span className="px-2 py-0.5 bg-teal-100 text-teal-900 font-extrabold text-[10px] rounded-md border border-teal-200">
                {currentStage.clinicalSociety}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              🎯 <strong>Enfoque Clínico:</strong> {currentStage.subtitle}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              📖 <strong>Sociedad & Guía Oficial:</strong> {currentStage.officialGuidelineRef}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCustomizerOpen(true)}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-2xs"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span>Editar Valores</span>
            </button>

            {onSelectStageFilter && (
              <button
                onClick={() => onSelectStageFilter(currentStage.title.split(' ')[0])}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs flex-shrink-0"
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Ver Platos para esta Etapa</span>
              </button>
            )}
          </div>
        </div>

        {/* Recommended Macros Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-emerald-600" />
              <span>Distribución de Macronutrientes (ESPEN / ASPEN)</span>
            </span>
            <span className="text-[11px] font-bold text-slate-500">
              🔥 {currentStage.caloriesFormula}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-2xs">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Proteína Clínica Recomendada</span>
              <strong className="text-slate-900 font-black block text-sm mt-0.5">{currentStage.macroRatio.proteinGPerKg}</strong>
              <span className="text-[10px] text-slate-500 mt-1 block">Rango: {currentStage.targetValues.proteinGPerKgMin} - {currentStage.targetValues.proteinGPerKgMax} g/kg/día</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-sky-200 shadow-2xs">
              <span className="text-[10px] font-bold text-sky-800 uppercase block">Carbohidratos Complejos</span>
              <strong className="text-slate-900 font-black block text-sm mt-0.5">{currentStage.macroRatio.carbsPercent}</strong>
              <span className="text-[10px] text-slate-500 mt-1 block">Fibra objetivo: {currentStage.targetValues.fiberGrams}g/día</span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-amber-200 shadow-2xs">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Grasas Saludables & AOVE</span>
              <strong className="text-slate-900 font-black block text-sm mt-0.5">{currentStage.macroRatio.fatPercent}</strong>
              <span className="text-[10px] text-slate-500 mt-1 block">DHA/EPA: {currentStage.targetValues.omega3_dha_mg} mg/día</span>
            </div>
          </div>
        </div>

        {/* Key Micronutrients */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Micronutrientes Esenciales e Imprescindibles</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentStage.keyNutrients.map((micro, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-bold text-slate-900">{micro.name}</strong>
                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 font-black text-[10px] rounded-md">
                    {micro.amount}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-snug">
                  {micro.reason}
                </p>
                <span className="text-[9px] font-extrabold text-teal-700 block uppercase">
                  Fuente: {micro.clinicalSource}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Real Food Sources: How to Get Them */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Apple className="w-4 h-4 text-emerald-600" />
            <span>Fuentes en Comida Real de Mercado</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentStage.realFoodSources.map((item, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-xl border border-emerald-200/80 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="font-bold text-xs text-slate-900">{item.food}</span>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
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

        {/* Pro Nutrition Tip */}
        <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white p-4 rounded-xl border border-emerald-800 flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <strong className="text-amber-300 font-bold block uppercase tracking-wider">
              Pauta Nutricional ESPEN / ASPEN:
            </strong>
            <p className="text-emerald-100 font-medium">
              {currentStage.menuTip}
            </p>
          </div>
        </div>
      </div>

      {/* Customizer Modal */}
      <LifeStageCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        initialStageId={activeStageId}
        userProfile={userProfile}
        onApplyToProfile={handleApplyToProfile}
        onGuidelinesUpdated={(updated) => setGuidelines(updated)}
      />
    </div>
  );
};
