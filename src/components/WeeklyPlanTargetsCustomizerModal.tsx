import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  X,
  Sliders,
  Sparkles,
  RotateCcw,
  Check,
  Flame,
  Dumbbell,
  Wheat,
  Droplets,
  HeartPulse,
  Award,
  Save,
  Info,
  ShieldCheck,
  Zap,
  Activity,
  Calculator,
  User,
  Scale,
  Target
} from 'lucide-react';

export interface WeeklyPlanTargets {
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  calciumMg: number;
  ironMg: number;
  vitaminDIU: number;
  vitaminB12Mcg: number;
  vitaminCMg: number;
  magnesiumMg: number;
  zincMg: number;
  potassiumMg: number;
  sodiumMgMax: number;
  waterLiters: number;
  customNotes?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  currentTargets: WeeklyPlanTargets;
  onApplyTargets: (targets: WeeklyPlanTargets, updateGlobalProfile?: boolean) => void;
  onRegeneratePlanWithTargets?: (targets: WeeklyPlanTargets) => void;
}

export const WeeklyPlanTargetsCustomizerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  userProfile,
  currentTargets,
  onApplyTargets,
  onRegeneratePlanWithTargets,
}) => {
  const [targets, setTargets] = useState<WeeklyPlanTargets>({ ...currentTargets });
  const [syncWithGlobalProfile, setSyncWithGlobalProfile] = useState<boolean>(false);
  const [appliedFeedback, setAppliedFeedback] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'macros' | 'micros' | 'presets' | 'calculator'>('macros');

  // Interactive Calculator State
  const initialGender: 'male' | 'female' = userProfile.gender === 'Hombre' ? 'male' : 'female';
  const [calcAge, setCalcAge] = useState<number>(userProfile.age || 45);
  const [calcGender, setCalcGender] = useState<'male' | 'female'>(initialGender);
  const [calcWeight, setCalcWeight] = useState<number>(userProfile.currentWeightKg || 68);
  const [calcHeight, setCalcHeight] = useState<number>(userProfile.heightCm || 165);
  const [calcActivity, setCalcActivity] = useState<'sedentary' | 'light' | 'moderate' | 'high' | 'very_high'>('moderate');
  const [calcGoal, setCalcGoal] = useState<'maintain' | 'loss_mild' | 'loss_moderate' | 'gain_muscle' | 'senior_vitality'>('maintain');
  const [calcLifeStage, setCalcLifeStage] = useState<'adult' | 'senior' | 'pregnancy' | 'lactation' | 'menopause'>('adult');

  if (!isOpen) return null;

  const weightKg = userProfile.currentWeightKg || 70;

  // Scientific Calculator function based on Mifflin-St Jeor / WHO / ESPEN
  const calculateMacrosAndMicros = () => {
    // 1. TMB Mifflin-St Jeor
    let bmr = 10 * calcWeight + 6.25 * calcHeight - 5 * calcAge;
    if (calcGender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    // 2. Factor de Actividad Física
    const palMap = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      high: 1.725,
      very_high: 1.9,
    };
    const tdee = Math.round(bmr * palMap[calcActivity]);

    // 3. Ajuste por Objetivo
    let targetCalories = tdee;
    if (calcGoal === 'loss_mild') targetCalories = Math.max(1300, tdee - 300);
    else if (calcGoal === 'loss_moderate') targetCalories = Math.max(1200, tdee - 500);
    else if (calcGoal === 'gain_muscle') targetCalories = tdee + 350;
    else if (calcGoal === 'senior_vitality') targetCalories = Math.max(1600, Math.round(calcWeight * 30));

    if (calcLifeStage === 'pregnancy') targetCalories += 300;
    if (calcLifeStage === 'lactation') targetCalories += 450;

    // 4. Proteínas según etapa y objetivo
    let proteinFactor = 1.2; // g/kg
    if (calcGoal === 'gain_muscle') proteinFactor = 1.8;
    else if (calcGoal === 'loss_moderate' || calcGoal === 'loss_mild') proteinFactor = 1.6;
    else if (calcLifeStage === 'senior' || calcGoal === 'senior_vitality') proteinFactor = 1.3;
    else if (calcLifeStage === 'pregnancy' || calcLifeStage === 'lactation') proteinFactor = 1.4;
    else if (calcLifeStage === 'menopause') proteinFactor = 1.3;

    const proteinGrams = Math.round(calcWeight * proteinFactor);
    const proteinCalories = proteinGrams * 4;

    // 5. Grasas Saludables (28% - 32% de las calorías totales)
    const fatRatio = calcLifeStage === 'senior' ? 0.30 : 0.28;
    const fatGrams = Math.round((targetCalories * fatRatio) / 9);
    const fatCalories = fatGrams * 9;

    // 6. Carbohidratos (el resto calórico)
    const carbsCalories = Math.max(200, targetCalories - (proteinCalories + fatCalories));
    const carbsGrams = Math.round(carbsCalories / 4);

    // 7. Micronutrientes y Fibra según parámetros clínicos
    let calciumMg = 1000;
    let ironMg = calcGender === 'female' && calcAge < 51 ? 18 : 12;
    let vitaminDIU = 800;
    let vitaminB12Mcg = 2.4;
    let vitaminCMg = 80;
    let magnesiumMg = calcGender === 'male' ? 400 : 330;
    let zincMg = calcGender === 'male' ? 12 : 9;
    let potassiumMg = 3200;
    let sodiumMgMax = 2000;
    let fiberGrams = 30;

    if (calcLifeStage === 'senior' || calcAge >= 65) {
      calciumMg = 1200;
      vitaminDIU = 1000;
      vitaminB12Mcg = 2.8;
      magnesiumMg = 380;
      zincMg = 12;
      potassiumMg = 3400;
      fiberGrams = 32;
    } else if (calcLifeStage === 'menopause') {
      calciumMg = 1250;
      vitaminDIU = 1000;
      magnesiumMg = 360;
    } else if (calcLifeStage === 'pregnancy') {
      calciumMg = 1200;
      ironMg = 27;
      vitaminDIU = 800;
      vitaminB12Mcg = 2.8;
      vitaminCMg = 100;
      zincMg = 14;
    } else if (calcLifeStage === 'lactation') {
      calciumMg = 1200;
      ironMg = 15;
      vitaminCMg = 120;
      zincMg = 13;
    }

    const waterLiters = Number(((calcWeight * 33) / 1000).toFixed(1));

    const calculated: WeeklyPlanTargets = {
      dailyCalories: targetCalories,
      proteinGrams,
      carbsGrams,
      fatGrams,
      fiberGrams,
      calciumMg,
      ironMg,
      vitaminDIU,
      vitaminB12Mcg,
      vitaminCMg,
      magnesiumMg,
      zincMg,
      potassiumMg,
      sodiumMgMax,
      waterLiters,
      customNotes: `Calculado para ${calcGender === 'male' ? 'Hombre' : 'Mujer'}, ${calcAge} años, ${calcWeight} kg, actividad ${calcActivity}, objetivo ${calcGoal}.`,
    };

    setTargets(calculated);
    setActiveTab('macros');
  };

  // Preset loaders
  const loadPreset = (presetType: 'espenSenior' | 'athlete' | 'deficit' | 'pregnancy' | 'boneHealth' | 'standard') => {
    let newTargets: WeeklyPlanTargets = { ...targets };

    if (presetType === 'espenSenior') {
      const prot = Math.round(weightKg * 1.3);
      const cals = Math.round(weightKg * 30);
      newTargets = {
        ...newTargets,
        dailyCalories: cals,
        proteinGrams: prot,
        carbsGrams: Math.round((cals * 0.45) / 4),
        fatGrams: Math.round((cals * 0.30) / 9),
        fiberGrams: 30,
        calciumMg: 1200,
        ironMg: 12,
        vitaminDIU: 1000,
        vitaminB12Mcg: 2.8,
        vitaminCMg: 90,
        magnesiumMg: 350,
        zincMg: 12,
        potassiumMg: 3200,
        sodiumMgMax: 1800,
        waterLiters: Number(((weightKg * 32) / 1000).toFixed(1)),
        customNotes: 'Consenso ESPEN Adultos Mayores (1.3 g/kg proteína, alta biodisponibilidad y soporte osteomuscular)',
      };
    } else if (presetType === 'athlete') {
      const prot = Math.round(weightKg * 1.8);
      const cals = Math.round(weightKg * 36);
      newTargets = {
        ...newTargets,
        dailyCalories: cals,
        proteinGrams: prot,
        carbsGrams: Math.round((cals * 0.50) / 4),
        fatGrams: Math.round((cals * 0.25) / 9),
        fiberGrams: 35,
        calciumMg: 1100,
        ironMg: 18,
        vitaminDIU: 1000,
        vitaminB12Mcg: 3.0,
        vitaminCMg: 120,
        magnesiumMg: 420,
        zincMg: 15,
        potassiumMg: 3800,
        sodiumMgMax: 2400,
        waterLiters: 3.2,
        customNotes: 'Alto Rendimiento / Fuerza (1.8 g/kg proteína, recarga de glucógeno y reposición de magnesio)',
      };
    } else if (presetType === 'deficit') {
      const prot = Math.round(weightKg * 1.6);
      const cals = Math.max(1400, Math.round(weightKg * 24));
      newTargets = {
        ...newTargets,
        dailyCalories: cals,
        proteinGrams: prot,
        carbsGrams: Math.round((cals * 0.40) / 4),
        fatGrams: Math.round((cals * 0.28) / 9),
        fiberGrams: 35,
        calciumMg: 1000,
        ironMg: 15,
        vitaminDIU: 800,
        vitaminB12Mcg: 2.5,
        vitaminCMg: 100,
        magnesiumMg: 350,
        zincMg: 12,
        potassiumMg: 3200,
        sodiumMgMax: 2000,
        waterLiters: 2.8,
        customNotes: 'Déficit Calórico Controlado (1.6 g/kg proteína para proteger masa magra y alta saciedad por fibra)',
      };
    } else if (presetType === 'pregnancy') {
      const prot = Math.round(weightKg * 1.4);
      const cals = Math.round(weightKg * 32) + 300;
      newTargets = {
        ...newTargets,
        dailyCalories: cals,
        proteinGrams: prot,
        carbsGrams: Math.round((cals * 0.48) / 4),
        fatGrams: Math.round((cals * 0.30) / 9),
        fiberGrams: 32,
        calciumMg: 1200,
        ironMg: 27,
        vitaminDIU: 800,
        vitaminB12Mcg: 2.8,
        vitaminCMg: 100,
        magnesiumMg: 380,
        zincMg: 14,
        potassiumMg: 3400,
        sodiumMgMax: 2000,
        waterLiters: 2.8,
        customNotes: 'Embarazo y Lactancia (+300 kcal, 27mg Hierro biodisponible, Calcio 1200mg)',
      };
    } else if (presetType === 'boneHealth') {
      const prot = Math.round(weightKg * 1.3);
      const cals = Math.round(weightKg * 28);
      newTargets = {
        ...newTargets,
        dailyCalories: cals,
        proteinGrams: prot,
        carbsGrams: Math.round((cals * 0.45) / 4),
        fatGrams: Math.round((cals * 0.30) / 9),
        fiberGrams: 32,
        calciumMg: 1300,
        ironMg: 12,
        vitaminDIU: 1200,
        vitaminB12Mcg: 2.8,
        vitaminCMg: 90,
        magnesiumMg: 380,
        zincMg: 12,
        potassiumMg: 3500,
        sodiumMgMax: 1800,
        waterLiters: 2.5,
        customNotes: 'Salud Ósea & Menopausia (1300mg Calcio, 1200 UI Vit D3, 380mg Magnesio)',
      };
    } else {
      // Standard Mediterranean
      newTargets = {
        dailyCalories: userProfile.dailyCalorieTarget || 2000,
        proteinGrams: userProfile.dailyProteinTargetG || 110,
        carbsGrams: userProfile.dailyCarbsTargetG || 220,
        fatGrams: userProfile.dailyFatTargetG || 65,
        fiberGrams: 30,
        calciumMg: 1000,
        ironMg: 14,
        vitaminDIU: 800,
        vitaminB12Mcg: 2.4,
        vitaminCMg: 80,
        magnesiumMg: 350,
        zincMg: 11,
        potassiumMg: 3000,
        sodiumMgMax: 2000,
        waterLiters: 2.5,
        customNotes: 'Dieta Mediterránea Tradicional Equilibrada',
      };
    }

    setTargets(newTargets);
  };

  const handleSave = () => {
    onApplyTargets(targets, syncWithGlobalProfile);
    setAppliedFeedback(true);
    setTimeout(() => {
      setAppliedFeedback(false);
      onClose();
    }, 800);
  };

  const handleRegenerate = () => {
    onApplyTargets(targets, syncWithGlobalProfile);
    if (onRegeneratePlanWithTargets) {
      onRegeneratePlanWithTargets(targets);
    }
    onClose();
  };

  const proteinGPerKg = weightKg > 0 ? (targets.proteinGrams / weightKg).toFixed(2) : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-5 shadow-2xl my-6 relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">
                  Personalizar Metas Nutricionales del Plan
                </h2>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-md uppercase">
                  Macros & Micros
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Adapta las calorías, macronutrientes y micronutrientes a tus necesidades específicas.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-2xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`py-2 px-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-teal-600" />
            <span>Calculadora IA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('macros')}
            className={`py-2 px-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'macros'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Macros</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('micros')}
            className={`py-2 px-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'micros'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
            <span>Micros</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`py-2 px-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>Plantillas</span>
          </button>
        </div>

        {/* Modal Body with Scroll */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          
          {/* TAB 0: CALCULADORA NUTRICIONAL CIENTÍFICA */}
          {activeTab === 'calculator' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl flex items-start gap-3">
                <div className="p-2 bg-teal-600 text-white rounded-xl shrink-0 mt-0.5">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-teal-950 uppercase tracking-wide">
                    Calculadora Científica de Necesidades Nutricionales
                  </h4>
                  <p className="text-[11px] text-teal-800 mt-0.5 leading-relaxed">
                    Basada en la fórmula <strong>Mifflin-St Jeor</strong>, los factores PAL de la <strong>OMS</strong> y las guías clínicas <strong>ESPEN</strong> para adaptar con exactitud calorías, macronutrientes y micronutrientes a tu situación concreta.
                  </p>
                </div>
              </div>

              {/* Formulario de Preguntas */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                
                {/* Fila 1: Sexo y Edad */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-black text-slate-700 block mb-1">
                      Sexo Biológico
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCalcGender('female')}
                        className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition ${
                          calcGender === 'female'
                            ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Mujer
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalcGender('male')}
                        className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition ${
                          calcGender === 'male'
                            ? 'bg-sky-50 border-sky-400 text-sky-800 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Hombre
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-black text-slate-700 block mb-1">
                      Edad (años)
                    </label>
                    <input
                      type="number"
                      min={15}
                      max={110}
                      value={calcAge}
                      onChange={(e) => setCalcAge(Math.max(1, Number(e.target.value) || 0))}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                {/* Fila 2: Peso y Altura */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-black text-slate-700 block mb-1">
                      Peso Corporal Actual (kg)
                    </label>
                    <input
                      type="number"
                      step={0.5}
                      min={30}
                      max={250}
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(Math.max(1, Number(e.target.value) || 0))}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-black text-slate-700 block mb-1">
                      Altura (cm)
                    </label>
                    <input
                      type="number"
                      min={100}
                      max={230}
                      value={calcHeight}
                      onChange={(e) => setCalcHeight(Math.max(1, Number(e.target.value) || 0))}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                {/* Fila 3: Nivel de Actividad */}
                <div>
                  <label className="text-[11px] font-black text-slate-700 block mb-1">
                    Nivel de Actividad Física y Ejercicio
                  </label>
                  <select
                    value={calcActivity}
                    onChange={(e) => setCalcActivity(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="sedentary">Sedentario (Trabajo de escritorio, poco o ningún ejercicio)</option>
                    <option value="light">Ligero (Paseos, tareas del hogar o ejercicio 1-2 días/sem)</option>
                    <option value="moderate">Moderado (Caminar activo + ejercicio 3-5 días/sem)</option>
                    <option value="high">Alto (Entrenamiento intenso 6-7 días/sem o trabajo físico)</option>
                    <option value="very_high">Muy Alto (Deportista de élite o doble sesión diaria)</option>
                  </select>
                </div>

                {/* Fila 4: Objetivo Nutricional */}
                <div>
                  <label className="text-[11px] font-black text-slate-700 block mb-1">
                    Objetivo Principal con este Plan
                  </label>
                  <select
                    value={calcGoal}
                    onChange={(e) => setCalcGoal(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="maintain">Mantenimiento y Salud Mediterránea Equilibrada</option>
                    <option value="loss_mild">Pérdida de Grasa Suave (-300 kcal, sin perder músculo)</option>
                    <option value="loss_moderate">Pérdida de Grasa Definida (-500 kcal, saciante y proteica)</option>
                    <option value="gain_muscle">Aumento de Masa Muscular / Rendimiento Deportivo (+350 kcal)</option>
                    <option value="senior_vitality">Vitalidad Senior & Prevención de Sarcopenia (Guías ESPEN)</option>
                  </select>
                </div>

                {/* Fila 5: Situación Concreta / Etapa de Vida */}
                <div>
                  <label className="text-[11px] font-black text-slate-700 block mb-1">
                    Situación Específica o Etapa de Vida
                  </label>
                  <select
                    value={calcLifeStage}
                    onChange={(e) => setCalcLifeStage(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="adult">Adulto Estándar (18 a 64 años)</option>
                    <option value="senior">Adulto Mayor (65+ años, mayor necesidad de proteína y calcio)</option>
                    <option value="menopause">Menopausia / Perimenopausia (Protección ósea y masa magra)</option>
                    <option value="pregnancy">Embarazo (Aumento calórico +2º/3er trimestre y hierro)</option>
                    <option value="lactation">Lactancia Materna (Mayor aporte de agua, energía y calcio)</option>
                  </select>
                </div>

                {/* Botón de Cálculo */}
                <button
                  type="button"
                  onClick={calculateMacrosAndMicros}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-black rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Calcular Mis Macros y Micros Personalizados</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: MACRONUTRIENTES */}
          {activeTab === 'macros' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs text-emerald-950 font-bold">
                <span>Tu peso actual: {weightKg} kg</span>
                <span className="bg-white px-2.5 py-1 rounded-lg border border-emerald-300 text-emerald-800 font-extrabold">
                  {proteinGPerKg} g de proteína / kg / día
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Calorías */}
                <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-amber-900 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      <span>Calorías Diarias (kcal)</span>
                    </label>
                  </div>
                  <input
                    type="number"
                    min={1000}
                    max={5000}
                    step={25}
                    value={targets.dailyCalories}
                    onChange={(e) => setTargets({ ...targets, dailyCalories: Number(e.target.value) || 0 })}
                    className="w-full text-base font-black text-slate-900 p-2.5 rounded-xl border border-amber-300 bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                  <span className="text-[10px] text-amber-800">Objetivo energético total de las 4 comidas</span>
                </div>

                {/* Proteína */}
                <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-emerald-900 flex items-center gap-1">
                      <Dumbbell className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Proteína Diaria (g)</span>
                    </label>
                  </div>
                  <input
                    type="number"
                    min={40}
                    max={350}
                    step={1}
                    value={targets.proteinGrams}
                    onChange={(e) => setTargets({ ...targets, proteinGrams: Number(e.target.value) || 0 })}
                    className="w-full text-base font-black text-slate-900 p-2.5 rounded-xl border border-emerald-300 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <span className="text-[10px] text-emerald-800">Equivale a {proteinGPerKg} g/kg/día</span>
                </div>

                {/* Carbohidratos */}
                <div className="p-3.5 bg-sky-50/60 border border-sky-200/80 rounded-2xl space-y-1">
                  <label className="text-xs font-black text-sky-900 flex items-center gap-1">
                    <Wheat className="w-3.5 h-3.5 text-sky-600" />
                    <span>Carbohidratos Complejos (g)</span>
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={600}
                    step={5}
                    value={targets.carbsGrams}
                    onChange={(e) => setTargets({ ...targets, carbsGrams: Number(e.target.value) || 0 })}
                    className="w-full text-base font-black text-slate-900 p-2.5 rounded-xl border border-sky-300 bg-white focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                  <span className="text-[10px] text-sky-800">Pan integral, arroz, legumbres y patatas</span>
                </div>

                {/* Grasas */}
                <div className="p-3.5 bg-rose-50/60 border border-rose-200/80 rounded-2xl space-y-1">
                  <label className="text-xs font-black text-rose-900 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-rose-600" />
                    <span>Grasas Saludables (g)</span>
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={200}
                    step={1}
                    value={targets.fatGrams}
                    onChange={(e) => setTargets({ ...targets, fatGrams: Number(e.target.value) || 0 })}
                    className="w-full text-base font-black text-slate-900 p-2.5 rounded-xl border border-rose-300 bg-white focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                  <span className="text-[10px] text-rose-800">AOVE, frutos secos y pescados grasos</span>
                </div>

                {/* Fibra */}
                <div className="p-3.5 bg-teal-50/60 border border-teal-200/80 rounded-2xl space-y-1 sm:col-span-2">
                  <label className="text-xs font-black text-teal-900 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-teal-600" />
                    <span>Fibra Dietética Mínima (g/día)</span>
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={60}
                    step={1}
                    value={targets.fiberGrams}
                    onChange={(e) => setTargets({ ...targets, fiberGrams: Number(e.target.value) || 0 })}
                    className="w-full text-base font-black text-slate-900 p-2.5 rounded-xl border border-teal-300 bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <span className="text-[10px] text-teal-800">Recomendación saludable: 25 - 35 g/día</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MICRONUTRIENTES */}
          {activeTab === 'micros' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 font-medium">
                Configura los umbrales mínimos recomendados para minerales y vitaminas según tus analíticas, edad o condición.
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Calcio */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-800 block">Calcio (mg/día)</label>
                  <input
                    type="number"
                    step={50}
                    value={targets.calciumMg}
                    onChange={(e) => setTargets({ ...targets, calciumMg: Number(e.target.value) || 0 })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-900"
                  />
                  <span className="text-[9px] text-slate-500">ESPEN: 1.000 - 1.200 mg</span>
                </div>

                {/* Hierro */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-800 block">Hierro (mg/día)</label>
                  <input
                    type="number"
                    step={1}
                    value={targets.ironMg}
                    onChange={(e) => setTargets({ ...targets, ironMg: Number(e.target.value) || 0 })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-900"
                  />
                  <span className="text-[9px] text-slate-500">Normal: 14 - 18 mg</span>
                </div>

                {/* Vitamina D3 */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-800 block">Vitamina D3 (UI/día)</label>
                  <input
                    type="number"
                    step={100}
                    value={targets.vitaminDIU}
                    onChange={(e) => setTargets({ ...targets, vitaminDIU: Number(e.target.value) || 0 })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-900"
                  />
                  <span className="text-[9px] text-slate-500">Guías: 800 - 1.200 UI</span>
                </div>

                {/* Vitamina B12 */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-800 block">Vitamina B12 (mcg/día)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={targets.vitaminB12Mcg}
                    onChange={(e) => setTargets({ ...targets, vitaminB12Mcg: Number(e.target.value) || 0 })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-900"
                  />
                  <span className="text-[9px] text-slate-500">Mínimo: 2.4 - 2.8 mcg</span>
                </div>

                {/* Magnesio */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-800 block">Magnesio (mg/día)</label>
                  <input
                    type="number"
                    step={10}
                    value={targets.magnesiumMg}
                    onChange={(e) => setTargets({ ...targets, magnesiumMg: Number(e.target.value) || 0 })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-900"
                  />
                  <span className="text-[9px] text-slate-500">Recomendado: 350 - 420 mg</span>
                </div>

                {/* Zinc */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-800 block">Zinc (mg/día)</label>
                  <input
                    type="number"
                    step={1}
                    value={targets.zincMg}
                    onChange={(e) => setTargets({ ...targets, zincMg: Number(e.target.value) || 0 })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-900"
                  />
                  <span className="text-[9px] text-slate-500">Mínimo: 11 - 15 mg</span>
                </div>

                {/* Potasio */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-800 block">Potasio (mg/día)</label>
                  <input
                    type="number"
                    step={100}
                    value={targets.potassiumMg}
                    onChange={(e) => setTargets({ ...targets, potassiumMg: Number(e.target.value) || 0 })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-900"
                  />
                  <span className="text-[9px] text-slate-500">Óptimo: 3.000 - 3.800 mg</span>
                </div>

                {/* Sodio Máximo */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-800 block">Límite Sodio (mg/día)</label>
                  <input
                    type="number"
                    step={100}
                    value={targets.sodiumMgMax}
                    onChange={(e) => setTargets({ ...targets, sodiumMgMax: Number(e.target.value) || 0 })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-900"
                  />
                  <span className="text-[9px] text-slate-500">Máx OMS: 2.000 mg</span>
                </div>

                {/* Agua / Hidratación */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <label className="text-[11px] font-extrabold text-slate-800 block">Agua / Líquidos (L/día)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={targets.waterLiters}
                    onChange={(e) => setTargets({ ...targets, waterLiters: Number(e.target.value) || 0 })}
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-black text-slate-900"
                  />
                  <span className="text-[9px] text-slate-500">ESPEN: 30 - 35 ml/kg</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PLANTILLAS RÁPIDAS */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">
                Selecciona una plantilla para aplicar automáticamente los valores de macros y micros:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => loadPreset('espenSenior')}
                  className="p-3 text-left bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200 rounded-2xl transition space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-950">👵 Consenso ESPEN Senior (65+)</span>
                    <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded font-bold">1.3 g/kg</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Prioriza prevención de sarcopenia, 1.200 mg Calcio y 1.000 UI Vit D3.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => loadPreset('athlete')}
                  className="p-3 text-left bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200 rounded-2xl transition space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-950">💪 Alto Rendimiento & Deporte</span>
                    <span className="text-[10px] bg-indigo-200/80 text-indigo-900 px-2 py-0.5 rounded font-bold">1.8 g/kg</span>
                  </div>
                  <p className="text-[11px] text-indigo-800">
                    Síntesis proteica muscular, alta recarga energética y 420 mg de Magnesio.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => loadPreset('deficit')}
                  className="p-3 text-left bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200 rounded-2xl transition space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-950">🥗 Pérdida de Grasa & Saciedad</span>
                    <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-bold">1.6 g/kg</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Déficit calórico con alta proteína y 35 g de fibra para proteger masa muscular.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => loadPreset('boneHealth')}
                  className="p-3 text-left bg-purple-50/70 hover:bg-purple-100/80 border border-purple-200 rounded-2xl transition space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-950">🦴 Salud Ósea & Menopausia</span>
                    <span className="text-[10px] bg-purple-200/80 text-purple-900 px-2 py-0.5 rounded font-bold">1.300 mg Ca</span>
                  </div>
                  <p className="text-[11px] text-purple-800">
                    Máximo aporte de Calcio, Vitamina D3 y Magnesio con proteína adecuada.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => loadPreset('pregnancy')}
                  className="p-3 text-left bg-rose-50/70 hover:bg-rose-100/80 border border-rose-200 rounded-2xl transition space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-950">🤰 Embarazo & Lactancia</span>
                    <span className="text-[10px] bg-rose-200/80 text-rose-900 px-2 py-0.5 rounded font-bold">27 mg Fe</span>
                  </div>
                  <p className="text-[11px] text-rose-800">
                    Soporte fetal y materno con hierro biodisponible, ácido fólico y calcio.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => loadPreset('standard')}
                  className="p-3 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">🔄 Restaurar Valores de Perfil</span>
                    <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">Estándar</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Vuelve a las metas calculadas originalmente para tu perfil mediterráneo.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Notas personalizadas */}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Motivo o Notas Clínicas de la Modificación:
            </label>
            <input
              type="text"
              value={targets.customNotes || ''}
              onChange={(e) => setTargets({ ...targets, customNotes: e.target.value })}
              placeholder="Ej: Plan adaptado por recomendación médica / aumento de gasto por maratón..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
            />
          </div>

          {/* Sincronizar con Perfil General */}
          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="syncProfileCheck"
                checked={syncWithGlobalProfile}
                onChange={(e) => setSyncWithGlobalProfile(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="syncProfileCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                Guardar también estas metas en mi Perfil General de Usuario
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-xl transition"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onRegeneratePlanWithTargets && (
              <button
                type="button"
                onClick={handleRegenerate}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                title="Genera un menú semanal de 7 días ajustado exactamente a estos macros y micros"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Re-Generar Plan con IA</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
            >
              {appliedFeedback ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>¡Metas Aplicadas!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Aplicar al Plan Semanal</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
