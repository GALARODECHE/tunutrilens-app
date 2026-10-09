import { RecommendedDish } from '../data/dishesCatalog';

export interface LifeStageTag {
  id: string;
  name: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export const LIFE_STAGE_TAGS: Record<string, LifeStageTag> = {
  infancy: {
    id: 'infancy',
    name: 'Infancia y Niñez',
    badgeBg: 'bg-amber-100 border-amber-300',
    badgeText: 'text-amber-900',
    description: 'Promueve crecimiento óseo, cognitivo y digestión suave.'
  },
  adolescence: {
    id: 'adolescence',
    name: 'Adolescencia',
    badgeBg: 'bg-sky-100 border-sky-300',
    badgeText: 'text-sky-900',
    description: 'Aporte de glucógeno y hierro para desarrollo puberal.'
  },
  pregnancy: {
    id: 'pregnancy',
    name: 'Embarazo y Lactancia',
    badgeBg: 'bg-pink-100 border-pink-300',
    badgeText: 'text-pink-900',
    description: 'Rico en folatos, hierro biodisponible, calcio y proteína limpia.'
  },
  menopause: {
    id: 'menopause',
    name: 'Menopausia',
    badgeBg: 'bg-purple-100 border-purple-300',
    badgeText: 'text-purple-900',
    description: 'Protección cardiovascular, masa ósea y fitoestrógenos.'
  },
  senior: {
    id: 'senior',
    name: 'Adultos Mayores / Senior',
    badgeBg: 'bg-teal-100 border-teal-300',
    badgeText: 'text-teal-900',
    description: 'Alta densidad nutricional, fácil masticación y sarcopenia.'
  },
  athlete: {
    id: 'athlete',
    name: 'Deportistas y Rendimiento',
    badgeBg: 'bg-emerald-100 border-emerald-300',
    badgeText: 'text-emerald-900',
    description: 'Recuperación muscular, síntesis proteica y reposición energética.'
  }
};

/**
 * Computes which life stages a given dish is adapted for based on macros and ingredients.
 */
export function getDishLifeStageAdaptations(dish: RecommendedDish): LifeStageTag[] {
  const text = (dish.dishName + ' ' + dish.description + ' ' + dish.ingredients.join(' ')).toLowerCase();
  const stages: LifeStageTag[] = [];

  // 1. Athlete: Protein > 20g OR High protein tag OR quinoa/chicken/salmon/eggs
  if (dish.proteinGrams >= 22 || dish.tag === 'Alto en Proteína' || text.includes('pollo') || text.includes('pavo') || text.includes('proteína') || text.includes('atún') || text.includes('huevos') || text.includes('claras')) {
    stages.push(LIFE_STAGE_TAGS.athlete);
  }

  // 2. Pregnancy: Iron & Calcium rich foods (spinach, legumes, salmon, oats, Greek yogurt, eggs, avocado)
  if (text.includes('espinaca') || text.includes('lentejas') || text.includes('garbanzos') || text.includes('salmón') || text.includes('aguacate') || text.includes('huevo') || text.includes('yogur') || text.includes('brócoli')) {
    stages.push(LIFE_STAGE_TAGS.pregnancy);
  }

  // 3. Menopause: Calcium & Fiber (yogurt, nuts, almonds, vegetables, oats, legumes, olive oil, fresh cheese)
  if (text.includes('yogur') || text.includes('nueces') || text.includes('almendra') || text.includes('requesón') || text.includes('queso') || text.includes('avena') || text.includes('aceite de oliva') || text.includes('fruta') || text.includes('verdura')) {
    stages.push(LIFE_STAGE_TAGS.menopause);
  }

  // 4. Senior: High protein, easy digestion, healthy fats
  if (dish.proteinGrams >= 15 && (text.includes('crema') || text.includes('puré') || text.includes('pescado') || text.includes('merluza') || text.includes('huevos') || text.includes('yogur') || text.includes('sopa') || text.includes('verdura'))) {
    stages.push(LIFE_STAGE_TAGS.senior);
  }

  // 5. Infancy & Childhood: Easy to eat, quick, kid friendly (fruit, pancakes, porridge, chicken, sweet potato, turkey)
  if (dish.prepTimeMinutes <= 15 && (text.includes('plátano') || text.includes('frutos rojos') || text.includes('avena') || text.includes('tortitas') || text.includes('pavo') || text.includes('pollo') || text.includes('manzana') || text.includes('cuscús'))) {
    stages.push(LIFE_STAGE_TAGS.infancy);
  }

  // 6. Adolescence: High energy, quality carbs & proteins
  if (dish.calories >= 300 && (dish.carbsGrams >= 30 || dish.proteinGrams >= 20)) {
    stages.push(LIFE_STAGE_TAGS.adolescence);
  }

  // Fallback: If none matched specifically, assign Athlete and Menopause as default healthy adult baselines
  if (stages.length === 0) {
    stages.push(LIFE_STAGE_TAGS.athlete, LIFE_STAGE_TAGS.menopause);
  }

  return stages;
}
