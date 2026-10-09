import React, { useState, useEffect } from 'react';
import {
  LifeStageGuideline,
  OFFICIAL_ESPEN_ASPEN_GUIDELINES,
  loadCustomLifeStagesGuidelines,
  saveCustomLifeStagesGuidelines,
  resetGuidelinesToOfficial
} from '../data/lifeStagesGuidelines';
import { UserProfile } from '../types';
import {
  X,
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Flame,
  Dumbbell,
  Droplets,
  AlertCircle,
  HelpCircle,
  Save,
  UserCheck,
  Plus,
  Trash2,
  BookOpen
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialStageId?: string;
  userProfile?: UserProfile;
  onApplyToProfile?: (updatedProfile: UserProfile) => void;
  onGuidelinesUpdated?: (updatedGuidelines: Record<string, LifeStageGuideline>) => void;
}

export const LifeStageCustomizerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialStageId = 'senior',
  userProfile,
  onApplyToProfile,
  onGuidelinesUpdated
}) => {
  const [guidelines, setGuidelines] = useState<Record<string, LifeStageGuideline>>(loadCustomLifeStagesGuidelines());
  const [selectedStageId, setSelectedStageId] = useState<string>(initialStageId);
  const [isSavedAlert, setIsSavedAlert] = useState<boolean>(false);
  const [isAppliedAlert, setIsAppliedAlert] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'macros' | 'micros' | 'clinical' | 'foods'>('macros');

  useEffect(() => {
    if (initialStageId && guidelines[initialStageId]) {
      setSelectedStageId(initialStageId);
    }
  }, [initialStageId]);

  if (!isOpen) return null;

  const currentStage = guidelines[selectedStageId] || guidelines.senior;
  const officialRef = OFFICIAL_ESPEN_ASPEN_GUIDELINES[selectedStageId] || OFFICIAL_ESPEN_ASPEN_GUIDELINES.senior;

  const handleUpdateTargetValue = (field: keyof LifeStageGuideline['targetValues'], value: number) => {
    setGuidelines((prev) => {
      const stage = { ...prev[selectedStageId] };
      stage.targetValues = {
        ...stage.targetValues,
        [field]: value
      };
      return { ...prev, [selectedStageId]: stage };
    });
  };

  const handleUpdateMacroRatio = (field: keyof LifeStageGuideline['macroRatio'], value: string) => {
    setGuidelines((prev) => {
      const stage = { ...prev[selectedStageId] };
      stage.macroRatio = {
        ...stage.macroRatio,
        [field]: value
      };
      return { ...prev, [selectedStageId]: stage };
    });
  };

  const handleUpdateField = (field: keyof LifeStageGuideline, value: any) => {
    setGuidelines((prev) => ({
      ...prev,
      [selectedStageId]: {
        ...prev[selectedStageId],
        [field]: value
      }
    }));
  };

  const handleSaveCustom = () => {
    saveCustomLifeStagesGuidelines(guidelines);
    if (onGuidelinesUpdated) {
      onGuidelinesUpdated(guidelines);
    }
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  const handleResetToOfficial = () => {
    const defaultData = resetGuidelinesToOfficial();
    setGuidelines(defaultData);
    if (onGuidelinesUpdated) {
      onGuidelinesUpdated(defaultData);
    }
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  const handleApplyToUserProfile = () => {
    if (!userProfile || !onApplyToProfile) return;

    // Calculate customized targets based on user weight and stage parameters
    const weight = userProfile.currentWeightKg || 70;
    const proteinTargetG = Math.round(weight * currentStage.targetValues.proteinGPerKgMin);
    const kcalPerKg = currentStage.targetValues.caloriesKcalPerKg || 30;
    const calorieTarget = Math.round(weight * kcalPerKg);
    const fatPercent = currentStage.targetValues.fatPercent || 30;
    const fatG = Math.round((calorieTarget * (fatPercent / 100)) / 9);
    const carbsG = Math.round((calorieTarget - proteinTargetG * 4 - fatG * 9) / 4);

    const updatedProfile: UserProfile = {
      ...userProfile,
      dailyCalorieTarget: calorieTarget,
      dailyProteinTargetG: proteinTargetG,
      dailyCarbsTargetG: carbsG,
      dailyFatTargetG: fatG,
      goal: `Etapa: ${currentStage.title}` as any
    };

    onApplyToProfile(updatedProfile);
    setIsAppliedAlert(true);
    setTimeout(() => setIsAppliedAlert(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between border-b border-teal-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 rounded-2xl">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">Personalizador de Guías Nutricionales</h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] rounded-md border border-emerald-400/30 uppercase">
                  ESPEN / ASPEN + Editor
                </span>
              </div>
              <p className="text-xs text-teal-200/70 mt-0.5">
                Ajusta y edita libremente los requerimientos de macros, micros y pautas clínicas por etapa biológica.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stage Selector Pills */}
        <div className="p-3 bg-slate-100/80 border-b border-slate-200 overflow-x-auto flex gap-2">
          {Object.values(guidelines).map((stage) => {
            const isSelected = stage.id === selectedStageId;
            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStageId(stage.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{stage.title.split('/')[0]}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-emerald-500 text-slate-900 font-black' : 'bg-slate-100 text-slate-600'}`}>
                  {stage.ageRange}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Stage Overview Banner */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                  Editando Guía para:
                </span>
                <strong className="text-sm font-black text-slate-900">{currentStage.title}</strong>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                📚 <strong>Referencia Clínica de Base:</strong> {currentStage.officialGuidelineRef} ({currentStage.clinicalSociety})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetToOfficial}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition flex items-center gap-1.5"
                title="Restablecer valores de consenso ESPEN / ASPEN"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Restablecer ESPEN</span>
              </button>

              {userProfile && onApplyToProfile && (
                <button
                  type="button"
                  onClick={handleApplyToUserProfile}
                  className="px-3.5 py-1.5 text-xs font-extrabold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition flex items-center gap-1.5"
                  title="Calcular y aplicar estas metas a mis calorías y macros del perfil"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Aplicar a Mi Perfil</span>
                </button>
              )}
            </div>
          </div>

          {/* Subtabs for Editing */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('macros')}
              className={`px-4 py-2.5 text-xs font-black border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'macros'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>Macronutrientes & Energía</span>
            </button>

            <button
              onClick={() => setActiveTab('micros')}
              className={`px-4 py-2.5 text-xs font-black border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'micros'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Micronutrientes & Minerales</span>
            </button>

            <button
              onClick={() => setActiveTab('clinical')}
              className={`px-4 py-2.5 text-xs font-black border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'clinical'
                  ? 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Pautas Clínicas y Alertas</span>
            </button>
          </div>

          {/* Tab 1: Macronutrientes */}
          {activeTab === 'macros' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Proteína g/kg */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-900">Proteína Mínima (g/kg/día)</label>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      ESPEN: {officialRef.targetValues.proteinGPerKgMin} g/kg
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="3.5"
                    value={currentStage.targetValues.proteinGPerKgMin}
                    onChange={(e) => handleUpdateTargetValue('proteinGPerKgMin', parseFloat(e.target.value) || 1.2)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500">Requerimiento base para preservar masa magra.</p>
                </div>

                {/* Proteína Max g/kg */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-900">Proteína Óptima (g/kg/día)</label>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      ESPEN: {officialRef.targetValues.proteinGPerKgMax} g/kg
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="3.5"
                    value={currentStage.targetValues.proteinGPerKgMax}
                    onChange={(e) => handleUpdateTargetValue('proteinGPerKgMax', parseFloat(e.target.value) || 1.5)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500">Rango superior recomendado en situaciones de alta demanda.</p>
                </div>

                {/* Calorías kcal/kg */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-900">Energía (kcal/kg/día)</label>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                      Base: {officialRef.targetValues.caloriesKcalPerKg} kcal/kg
                    </span>
                  </div>
                  <input
                    type="number"
                    step="1"
                    min="15"
                    max="80"
                    value={currentStage.targetValues.caloriesKcalPerKg}
                    onChange={(e) => handleUpdateTargetValue('caloriesKcalPerKg', parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500">Gasto calórico estimado por peso corporal.</p>
                </div>

                {/* Carbohidratos % */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-900">Carbohidratos (% VCT)</label>
                    <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
                      Ref: {officialRef.targetValues.carbsPercent}%
                    </span>
                  </div>
                  <input
                    type="number"
                    step="1"
                    min="10"
                    max="75"
                    value={currentStage.targetValues.carbsPercent}
                    onChange={(e) => handleUpdateTargetValue('carbsPercent', parseInt(e.target.value) || 45)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500">Porcentaje del valor calórico total.</p>
                </div>

                {/* Grasas % */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-900">Grasas Saludables (% VCT)</label>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                      Ref: {officialRef.targetValues.fatPercent}%
                    </span>
                  </div>
                  <input
                    type="number"
                    step="1"
                    min="10"
                    max="70"
                    value={currentStage.targetValues.fatPercent}
                    onChange={(e) => handleUpdateTargetValue('fatPercent', parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500">Prioridad en monoinsaturadas (AOVE) y Omega-3.</p>
                </div>

                {/* Fibra g/día */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-900">Fibra Dietética (g/día)</label>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Ref: {officialRef.targetValues.fiberGrams}g
                    </span>
                  </div>
                  <input
                    type="number"
                    step="1"
                    min="5"
                    max="60"
                    value={currentStage.targetValues.fiberGrams}
                    onChange={(e) => handleUpdateTargetValue('fiberGrams', parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:border-emerald-600 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500">Mínimo para salud intestinal y microbiota.</p>
                </div>
              </div>

              {/* Fórmulas y textos descriptivos */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Texto Descriptivo de Macronutrientes</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Rango de Proteína (Texto visual)</label>
                    <input
                      type="text"
                      value={currentStage.macroRatio.proteinGPerKg}
                      onChange={(e) => handleUpdateMacroRatio('proteinGPerKg', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-300 text-xs font-medium focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Cálculo de Calorías (Fórmula clínica)</label>
                    <input
                      type="text"
                      value={currentStage.caloriesFormula}
                      onChange={(e) => handleUpdateField('caloriesFormula', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-300 text-xs font-medium focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Micronutrientes */}
          {activeTab === 'micros' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                {/* Calcio */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Calcio (mg/día)</span>
                    <span className="text-[10px] text-slate-500">ESPEN: {officialRef.targetValues.calcium_mg}</span>
                  </div>
                  <input
                    type="number"
                    value={currentStage.targetValues.calcium_mg}
                    onChange={(e) => handleUpdateTargetValue('calcium_mg', parseInt(e.target.value) || 1000)}
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">Densidad ósea</span>
                </div>

                {/* Hierro */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Hierro (mg/día)</span>
                    <span className="text-[10px] text-slate-500">ESPEN: {officialRef.targetValues.iron_mg}</span>
                  </div>
                  <input
                    type="number"
                    value={currentStage.targetValues.iron_mg}
                    onChange={(e) => handleUpdateTargetValue('iron_mg', parseInt(e.target.value) || 14)}
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">Oxigenación tisular</span>
                </div>

                {/* Vitamina D3 */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Vitamina D3 (UI/día)</span>
                    <span className="text-[10px] text-slate-500">ESPEN: {officialRef.targetValues.vitaminD_iu}</span>
                  </div>
                  <input
                    type="number"
                    value={currentStage.targetValues.vitaminD_iu}
                    onChange={(e) => handleUpdateTargetValue('vitaminD_iu', parseInt(e.target.value) || 800)}
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">Inmunidad y absorción Ca</span>
                </div>

                {/* Vitamina B12 */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Vitamina B12 (mcg/día)</span>
                    <span className="text-[10px] text-slate-500">ESPEN: {officialRef.targetValues.vitaminB12_mcg}</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={currentStage.targetValues.vitaminB12_mcg}
                    onChange={(e) => handleUpdateTargetValue('vitaminB12_mcg', parseFloat(e.target.value) || 2.8)}
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">Función neurológica</span>
                </div>

                {/* Ácido Fólico / Folato */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Ácido Fólico (mcg/día)</span>
                    <span className="text-[10px] text-slate-500">Ref: {officialRef.targetValues.folate_mcg}</span>
                  </div>
                  <input
                    type="number"
                    value={currentStage.targetValues.folate_mcg}
                    onChange={(e) => handleUpdateTargetValue('folate_mcg', parseInt(e.target.value) || 400)}
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">División celular</span>
                </div>

                {/* Magnesio */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Magnesio (mg/día)</span>
                    <span className="text-[10px] text-slate-500">Ref: {officialRef.targetValues.magnesium_mg}</span>
                  </div>
                  <input
                    type="number"
                    value={currentStage.targetValues.magnesium_mg}
                    onChange={(e) => handleUpdateTargetValue('magnesium_mg', parseInt(e.target.value) || 375)}
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">Tono muscular y sueño</span>
                </div>

                {/* Zinc */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Zinc (mg/día)</span>
                    <span className="text-[10px] text-slate-500">Ref: {officialRef.targetValues.zinc_mg}</span>
                  </div>
                  <input
                    type="number"
                    value={currentStage.targetValues.zinc_mg}
                    onChange={(e) => handleUpdateTargetValue('zinc_mg', parseInt(e.target.value) || 11)}
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">Sistema inmune</span>
                </div>

                {/* Omega-3 DHA */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Omega-3 DHA (mg/día)</span>
                    <span className="text-[10px] text-slate-500">Ref: {officialRef.targetValues.omega3_dha_mg}</span>
                  </div>
                  <input
                    type="number"
                    value={currentStage.targetValues.omega3_dha_mg}
                    onChange={(e) => handleUpdateTargetValue('omega3_dha_mg', parseInt(e.target.value) || 250)}
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">Salud cerebral y retina</span>
                </div>

                {/* Hidratación ml/kg */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Agua / Líquidos (ml/kg)</span>
                    <span className="text-[10px] text-slate-500">ESPEN: {officialRef.targetValues.waterMlPerKg}</span>
                  </div>
                  <input
                    type="number"
                    value={currentStage.targetValues.waterMlPerKg}
                    onChange={(e) => handleUpdateTargetValue('waterMlPerKg', parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">Balance hídrico diario</span>
                </div>

                {/* Límite Sodio */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Sodio Máx (mg/día)</span>
                    <span className="text-[10px] text-slate-500">OMS: {officialRef.targetValues.sodium_mg_max}</span>
                  </div>
                  <input
                    type="number"
                    value={currentStage.targetValues.sodium_mg_max}
                    onChange={(e) => handleUpdateTargetValue('sodium_mg_max', parseInt(e.target.value) || 2000)}
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block">Equivalente a 5g sal</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Pautas Clínicas */}
          {activeTab === 'clinical' && (
            <div className="space-y-4">
              {/* Clinical Tips List */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  Pautas Nutricionales y Hábitos Clínicos (ESPEN / ASPEN)
                </label>
                <div className="space-y-2">
                  {currentStage.clinicalTips.map((tip, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={tip}
                        onChange={(e) => {
                          const updated = [...currentStage.clinicalTips];
                          updated[idx] = e.target.value;
                          handleUpdateField('clinicalTips', updated);
                        }}
                        className="flex-1 px-3 py-2 bg-slate-50 rounded-xl border border-slate-300 text-xs font-medium focus:border-emerald-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = currentStage.clinicalTips.filter((_, i) => i !== idx);
                          handleUpdateField('clinicalTips', updated);
                        }}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Eliminar pauta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateField('clinicalTips', [...currentStage.clinicalTips, 'Nueva pauta personalizada']);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir Pauta Clínica</span>
                  </button>
                </div>
              </div>

              {/* Forbidden or Avoid */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="text-xs font-black text-rose-900 uppercase tracking-wider block">
                  Alimentos a Limitar o Restringir
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentStage.forbiddenOrAvoid.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-rose-50 border border-rose-200 text-rose-900 px-2.5 py-1 rounded-lg text-xs font-bold">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = currentStage.forbiddenOrAvoid.filter((_, i) => i !== idx);
                          handleUpdateField('forbiddenOrAvoid', updated);
                        }}
                        className="text-rose-600 hover:text-rose-900 ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isSavedAlert && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg flex items-center gap-1">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>¡Recomendaciones guardadas localmente!</span>
              </span>
            )}
            {isAppliedAlert && (
              <span className="text-xs font-bold text-teal-800 bg-teal-100 px-3 py-1 rounded-lg flex items-center gap-1">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>¡Metas aplicadas a tu Perfil!</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl transition"
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={handleSaveCustom}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Recomendaciones Personalizadas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
