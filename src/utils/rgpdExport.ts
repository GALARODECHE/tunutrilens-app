import {
  loadProfile,
  loadLoggedMeals,
  loadWeightEntries,
  loadSavedScans,
  loadWeeklyPlan,
  loadSavedCustomRecipes
} from '../services/storage';
import { getSubscriptionPlan } from '../services/usageLimitService';

export interface RGPDExportResult {
  filename: string;
  dataSize: number;
}

/**
 * Genera y descarga un archivo JSON completo con todos los datos de salud,
 * biométricos, nutricionales y de suscripción del usuario, en estricto cumplimiento
 * del Reglamento General de Protección de Datos (RGPD UE 2016/679, Art. 20 - Derecho a la portabilidad).
 */
export function exportHealthDataRGPD(): RGPDExportResult {
  const profile = loadProfile();
  const meals = loadLoggedMeals();
  const weight = loadWeightEntries();
  const scans = loadSavedScans();
  const plan = loadWeeklyPlan();
  const customRecipes = loadSavedCustomRecipes();
  const subscriptionPlan = getSubscriptionPlan();

  const exportPayload = {
    metadata: {
      standard: 'Reglamento General de Protección de Datos (RGPD) UE 2016/679 - Artículo 20 (Derecho a la Portabilidad de Datos)',
      application: 'TuNutriLens™ Nutrición Visual Inteligente',
      version: '2.7.0',
      exportTimestamp: new Date().toISOString(),
      exportDateFormatted: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      complianceNotice: 'Este archivo contiene el registro estructurado, interoperable y legible por máquina de todos los datos personales, biométricos y dietéticos recopilados en la aplicación.'
    },
    userProfile: {
      gender: profile.gender,
      age: profile.age,
      heightCm: profile.heightCm,
      currentWeightKg: profile.currentWeightKg,
      targetWeightKg: profile.targetWeightKg,
      activityLevel: profile.activityLevel,
      goal: profile.goal,
      dietaryRestrictionsAndAllergens: profile.dietaryRestrictions || [],
      nutritionalTargets: {
        dailyCaloriesKcal: profile.dailyCalorieTarget,
        dailyProteinGrams: profile.dailyProteinTargetG,
        dailyCarbohydratesGrams: profile.dailyCarbsTargetG,
        dailyFatGrams: profile.dailyFatTargetG
      }
    },
    subscription: {
      planId: subscriptionPlan,
      planTitle: subscriptionPlan === 'b2c_unlimited'
        ? 'Tarifa Ilimitada TuNutriLens (7,49 €/mes)'
        : subscriptionPlan === 'b2c_pro'
          ? 'Plan Pro (4,99 €/mes)'
          : 'Plan Gratuito (Pase Tester Ilimitado)',
      status: 'Activo',
      satisfactionGuarantee: 'Garantía 14 Días 100% Reembolsable',
      cancellationPolicy: 'Sin permanencia ni penalización. Cancelación en 1 clic.'
    },
    healthAndDietaryRecords: {
      totalLoggedMeals: meals.length,
      loggedMeals: meals,
      totalWeightHistoryEntries: weight.length,
      weightHistory: weight,
      totalSavedSupermarketScans: scans.length,
      savedSupermarketScans: scans,
      weeklyMenuPlanning: plan,
      totalSavedCustomRecipes: customRecipes.length,
      savedCustomRecipes: customRecipes
    }
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `tunutrilens_datos_salud_rgpd_${dateStr}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return {
    filename,
    dataSize: jsonString.length
  };
}
