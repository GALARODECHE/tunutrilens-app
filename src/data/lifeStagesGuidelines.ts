import { Baby, GraduationCap, HeartPulse, Sparkles, Droplets, Dumbbell, UserCheck, ShieldCheck } from 'lucide-react';
import { RecommendedDish } from './dishesCatalog';

export interface StageNutrientTarget {
  name: string;
  amount: string;
  numericValue: number;
  unit: string;
  reason: string;
  clinicalSource: string;
}

export interface LifeStageGuideline {
  id: 'infancy' | 'adolescence' | 'adult' | 'pregnancy' | 'menopause' | 'senior' | 'athlete';
  title: string;
  subtitle: string;
  ageRange: string;
  badgeColor: string;
  clinicalSociety: 'ESPEN' | 'ASPEN' | 'ESPEN / ASPEN' | 'ESPEN / ESPGHAN' | 'ESPEN / ISSN';
  officialGuidelineRef: string;
  caloriesFormula: string;
  macroRatio: {
    proteinGPerKg: string;
    proteinPercent: string;
    carbsPercent: string;
    fatPercent: string;
    fiberGrams: string;
  };
  // Numeric targets for customization and calculation
  targetValues: {
    proteinGPerKgMin: number;
    proteinGPerKgMax: number;
    caloriesKcalPerKg: number;
    carbsPercent: number;
    fatPercent: number;
    fiberGrams: number;
    waterMlPerKg: number;
    calcium_mg: number;
    iron_mg: number;
    vitaminD_iu: number;
    vitaminB12_mcg: number;
    folate_mcg: number;
    magnesium_mg: number;
    zinc_mg: number;
    potassium_mg: number;
    sodium_mg_max: number;
    iodine_mcg: number;
    omega3_dha_mg: number;
  };
  keyNutrients: StageNutrientTarget[];
  clinicalTips: string[];
  forbiddenOrAvoid: string[];
  recommendedDishes: RecommendedDish[];
  realFoodSources: { food: string; portion: string; benefit: string }[];
  menuTip: string;
}

export const OFFICIAL_ESPEN_ASPEN_GUIDELINES: Record<string, LifeStageGuideline> = {
  senior: {
    id: 'senior',
    title: 'Adultos Mayores / Geriatría (65+ Años)',
    subtitle: 'Preservación de masa magra, prevención de sarcopenia y soporte neuro-osteomuscular',
    ageRange: '65+ Años',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
    clinicalSociety: 'ESPEN / ASPEN',
    officialGuidelineRef: 'ESPEN Guideline on Clinical Nutrition and Hydration in Geriatrics (Volkert et al.) & ASPEN Geriatric Consensus',
    caloriesFormula: '30 kcal/kg/día (ajustable según estado nutricional)',
    macroRatio: {
      proteinGPerKg: '1.0 - 1.5 g/kg/día (ESPEN)',
      proteinPercent: '20 - 25% del VCT',
      carbsPercent: '45 - 50% (Baja carga glucémica)',
      fatPercent: '30 - 35% (Rica en MUFA y AOVE)',
      fiberGrams: '25 - 30 g/día',
    },
    targetValues: {
      proteinGPerKgMin: 1.2,
      proteinGPerKgMax: 1.5,
      caloriesKcalPerKg: 30,
      carbsPercent: 48,
      fatPercent: 32,
      fiberGrams: 28,
      waterMlPerKg: 30, // Mínimo 1.6L mujeres / 2.0L hombres
      calcium_mg: 1200,
      iron_mg: 10,
      vitaminD_iu: 1000,
      vitaminB12_mcg: 4.0,
      folate_mcg: 400,
      magnesium_mg: 380,
      zinc_mg: 12,
      potassium_mg: 3500,
      sodium_mg_max: 2000,
      iodine_mcg: 150,
      omega3_dha_mg: 350,
    },
    keyNutrients: [
      {
        name: 'Proteína de Alta Calidad + Leucina (≥3g/toma)',
        amount: '1.2 - 1.5 g/kg/día',
        numericValue: 1.3,
        unit: 'g/kg/día',
        reason: 'Superar la resistencia anabólica muscular y frenar la sarcopenia y fragilidad.',
        clinicalSource: 'ESPEN Geriatrics 2023'
      },
      {
        name: 'Vitamina D3',
        amount: '800 - 1000 UI/día',
        numericValue: 1000,
        unit: 'UI/día',
        reason: 'Optimiza la fuerza contráctil muscular, reduce caídas y preserva densidad ósea.',
        clinicalSource: 'ESPEN / IOF Consensus'
      },
      {
        name: 'Vitamina B12 (Cobalamina)',
        amount: '4.0 mcg/día',
        numericValue: 4.0,
        unit: 'mcg/día',
        reason: 'Compensa la aclorhidria gástrica fisiológica para prevenir anemia perniciosa y deterioro cognitivo.',
        clinicalSource: 'ESPEN Clinical Review'
      },
      {
        name: 'Calcio Bioasimilable',
        amount: '1200 mg/día',
        numericValue: 1200,
        unit: 'mg/día',
        reason: 'Consolidación de la matriz ósea y balance electrolítico neuromuscular.',
        clinicalSource: 'ASPEN / EFSA DRV'
      },
      {
        name: 'Hidratación Obligatoria',
        amount: '1.6L (mujeres) - 2.0L (hombres)',
        numericValue: 2000,
        unit: 'ml/día',
        reason: 'La disminución de osmorreceptores atenúa la sed; vital para función renal.',
        clinicalSource: 'ESPEN Hydration in Older Adults'
      }
    ],
    clinicalTips: [
      'ESPEN recomienda fraccionar la proteína en bolos de 25-30g por comida principal con alto aporte de leucina (huevos, lácteos pasteurizados, pescados blancos y azules).',
      'Monitorear la ingesta hídrica regular ofreciendo infusiones tibias, caldos desgrasados y agua aromatizada.',
      'Adaptar texturas (cremas nutritivas, pescados desmigados, revueltos suaves) sin disminuir la densidad calórico-proteica.',
      'Añadir aceite de oliva virgen extra en crudo para enriquecer sin aumentar el volumen digestivo.'
    ],
    forbiddenOrAvoid: [
      'Dietas hipocalóricas o hipoproteicas restrictivas no supervisadas',
      'Exceso de sal (>5g sal / >2000mg sodio) que sobrecarga la función renal y arterial',
      'Platos hipergrasos fritos de digestión gástrica lenta y pesada'
    ],
    realFoodSources: [
      { food: 'Huevos Camperos Pasados por Agua o Revueltos Tiernos', portion: '2 huevos (120g)', benefit: 'Proteína de valor biológico 100, fácil masticación y 1.6g de Leucina pura.' },
      { food: 'Lomo de Merluza / Bacalao al Vapor con Patata y AOVE', portion: '160g pescado + 120g patata', benefit: 'Aporte de 32g de proteína limpia, fósforo, selenio y vitamina B12.' },
      { food: 'Crema de Calabaza Enriquecida con Requesón y AOVE', portion: '250ml crema + 60g requesón', benefit: 'Densidad nutricional blanda, hidratación y 19g de proteína suave.' },
      { food: 'Yogur Griego Natural o Kéfir con Almendra Molida', portion: '150g yogur + 15g almendra', benefit: 'Calcio biodisponible, probióticos para microbiota y magnesio.' }
    ],
    menuTip: 'Distribuye un mínimo de 25g de proteína en desayuno y comida para estimular la síntesis proteica muscular.',
    recommendedDishes: [
      {
        id: 'ls_sen_1',
        dishName: 'Merluza en Salsa Verde Ligera con Patata Cocida y Guisantes Tiernos',
        description: 'Plato reconfortante, suave y de excelente digestibilidad rico en proteína magra y B12.',
        mealType: 'Almuerzo',
        calories: 360,
        proteinGrams: 32,
        carbsGrams: 32,
        fatGrams: 8,
        prepTimeMinutes: 20,
        ingredients: ['180g merluza fresca', '120g patata cocida', '50g guisantes tiernos', 'Caldo casero de pescado, ajo y perejil'],
        safeForRestrictions: true,
        tag: 'Bajo en Calorías'
      },
      {
        id: 'ls_sen_2',
        dishName: 'Crema Suave de Calabaza y Zanahoria con Pavo Desmigado y Requesón',
        description: 'Textura cremosa enriquecida con proteínas de alto valor biológico para la masa magra.',
        mealType: 'Cena',
        calories: 310,
        proteinGrams: 26,
        carbsGrams: 24,
        fatGrams: 9,
        prepTimeMinutes: 15,
        ingredients: ['250ml crema de calabaza y zanahoria', '80g pechuga de pavo desmenuzada', '40g requesón artesanal', '5ml AOVE'],
        safeForRestrictions: true,
        tag: 'Rápido'
      },
      {
        id: 'ls_sen_3',
        dishName: 'Tortilla Francesa TIERNA de 2 Huevos con Espinacas y Ricotta Suave',
        description: 'Textura extra suave fácil de tragar, repleta de leucina, vitamina D y proteínas completas.',
        mealType: 'Cena',
        calories: 320,
        proteinGrams: 22,
        carbsGrams: 8,
        fatGrams: 21,
        prepTimeMinutes: 10,
        ingredients: ['2 huevos camperos', '100g espinacas cocidas', '50g queso ricotta o requesón', '8ml AOVE'],
        safeForRestrictions: true,
        tag: 'Vegetariano'
      },
      {
        id: 'ls_sen_4',
        dishName: 'Compota de Manzana Asada con Copos de Avena Suaves y Almendra Molida',
        description: 'Desayuno o merienda tibia de fácil digestión para estómagos sensibles sin azúcares libres.',
        mealType: 'Desayuno',
        calories: 270,
        proteinGrams: 9,
        carbsGrams: 38,
        fatGrams: 9,
        prepTimeMinutes: 10,
        ingredients: ['1 manzana cocida al vapor', '35g copos avena fina', '15g almendra molida', 'Canela en rama molida'],
        safeForRestrictions: true,
        tag: 'Rápido'
      },
      {
        id: 'ls_sen_5',
        dishName: 'Arroz Meloso con Bacalao Desmigado, Alcachofas y Caldo de Pescado',
        description: 'Comida de sabor tradicional mediterráneo, suave y rica en B12, sodio equilibrado y fósforo.',
        mealType: 'Almuerzo',
        calories: 420,
        proteinGrams: 31,
        carbsGrams: 52,
        fatGrams: 9,
        prepTimeMinutes: 22,
        ingredients: ['130g bacalao desalado', '60g arroz', '80g corazones alcachofa tiernos', 'Caldo casero de pescado'],
        safeForRestrictions: true,
        tag: 'Mediterráneo'
      }
    ]
  },
  pregnancy: {
    id: 'pregnancy',
    title: 'Embarazo y Lactancia Materna',
    subtitle: 'Formación de tejidos fetales, neurodesarrollo, placenta y síntesis láctea',
    ageRange: 'Gestación & Postparto',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    clinicalSociety: 'ESPEN / ASPEN',
    officialGuidelineRef: 'ESPEN / ASPEN Perinatal & Maternal Clinical Nutrition Guidelines & EFSA Pregnancy Standards',
    caloriesFormula: '+340 kcal/día (2º trimestre), +450 kcal/día (3º trimestre), +500 kcal/día (lactancia)',
    macroRatio: {
      proteinGPerKg: '1.2 - 1.5 g/kg/día (+25g/día neto)',
      proteinPercent: '18 - 22% del VCT',
      carbsPercent: '45 - 50% (Carga glucémica baja)',
      fatPercent: '30 - 35% (Rica en DHA y ácido oleico)',
      fiberGrams: '28 - 32 g/día',
    },
    targetValues: {
      proteinGPerKgMin: 1.2,
      proteinGPerKgMax: 1.5,
      caloriesKcalPerKg: 35,
      carbsPercent: 48,
      fatPercent: 32,
      fiberGrams: 30,
      waterMlPerKg: 35, // 2.3L - 2.8L/día
      calcium_mg: 1200,
      iron_mg: 28,
      vitaminD_iu: 800,
      vitaminB12_mcg: 4.5,
      folate_mcg: 600,
      magnesium_mg: 360,
      zinc_mg: 13,
      potassium_mg: 3500,
      sodium_mg_max: 2000,
      iodine_mcg: 220,
      omega3_dha_mg: 300,
    },
    keyNutrients: [
      {
        name: 'Folato Activo / Ácido Fólico (B9)',
        amount: '600 mcg/día (500 mcg en lactancia)',
        numericValue: 600,
        unit: 'mcg/día',
        reason: 'Cierre del tubo neural embrionario, división celular y eritropoyesis materna.',
        clinicalSource: 'ESPEN / EFSA Consensus'
      },
      {
        name: 'Hierro Biodisponible',
        amount: '27 - 30 mg/día',
        numericValue: 28,
        unit: 'mg/día',
        reason: 'Expansión del 40% del volumen plasmático materno y formación de hematíes fetales.',
        clinicalSource: 'ESPEN / WHO Guidelines'
      },
      {
        name: 'Omega-3 DHA (Ácido Docosahexaenoico)',
        amount: '200 - 300 mg/día DHA puro',
        numericValue: 300,
        unit: 'mg/día',
        reason: 'Mielinización neuronal, desarrollo visual de la retina y maduración cognitiva del feto.',
        clinicalSource: 'ASPEN / ESPEN Guidelines'
      },
      {
        name: 'Yodo',
        amount: '220 - 250 mcg/día',
        numericValue: 220,
        unit: 'mcg/día',
        reason: 'Síntesis de hormonas tiroideas materno-fetales esenciales para el neurodesarrollo.',
        clinicalSource: 'WHO / ESPEN Iodine Standard'
      },
      {
        name: 'Calcio y Colina',
        amount: 'Calcio 1200 mg / Colina 450 mg',
        numericValue: 1200,
        unit: 'mg/día',
        reason: 'Mineralización del esqueleto fetal y síntesis de neurotransmisores cerebrales.',
        clinicalSource: 'EFSA / ASPEN DRVs'
      }
    ],
    clinicalTips: [
      'Seguridad microbiológica estricta: lavar verduras y frutas crudas con agua y desinfectante alimentario.',
      'Cocinar carnes, huevos y pescados por encima de 70ºC en el centro del alimento (evitar carnes crudas/poco hechas y huevos crudos).',
      'Consumir pescados grasos pequeños de bajo contenido en mercurio (sardinas, caballa, salmón, boquerones) y evitar grandes depredadores (pez espada, atún rojo gigante, cazón).',
      'Consumir lácteos exclusivamente pasteurizados para prevenir Listeria monocytogenes.'
    ],
    forbiddenOrAvoid: [
      'Pescados crudos (sushi/sashimi), mariscos crudos o pescados ahumados sin cocinar',
      'Carnes crudas o embutidos no cocidos (salvo congelación industrial previa verificada)',
      'Lácteos y quesos no pasteurizados (frescos de leche cruda, brie, roquefort no pasteurizado)',
      'Alcohol absoluto (cero tolerancia) y cafeína excesiva (>200 mg/día)'
    ],
    realFoodSources: [
      { food: 'Lentejas Estofadas con Pimiento Rojo y Arroz', portion: '200g lentejas + 1/2 pimiento', benefit: 'Hierro vegetal triplicado en absorción por la Vitamina C del pimiento y 320mcg de folatos.' },
      { food: 'Salmón Bien Cocinado a la Plancha o al Horno', portion: '150g', benefit: 'Aporta 450mg de DHA/EPA omega-3, 34g de proteína y vitamina D3 activa.' },
      { food: 'Huevos Camperos Muy Hechos (Tortilla/Revuelto)', portion: '2 huevos bien cuajados', benefit: 'Aporte masivo de Colina (250mg) para el cerebro fetal, proteína limpia y B12.' },
      { food: 'Espinacas y Canónigos al Vapor con AOVE y Nueces', portion: '150g espinacas + 20g nueces', benefit: 'Folatos naturales, magnesio, calcio vegetal y grasas cardioprotectoras.' }
    ],
    menuTip: 'Combina siempre legumbres y vegetales con alimentos ricos en Vitamina C (limón, pimiento, tomate) para maximizar la absorción de hierro vegetal.',
    recommendedDishes: [
      {
        id: 'ls_preg_1',
        dishName: 'Salmón al Horno Muy Hecho con Puré de Boniato y Espinacas Cocidas',
        description: 'Combinación segura llena de DHA, hierro y carotenos para el bebé.',
        mealType: 'Almuerzo',
        calories: 480,
        proteinGrams: 36,
        carbsGrams: 38,
        fatGrams: 18,
        prepTimeMinutes: 20,
        ingredients: ['150g salmón bien cocinado (>75ºC)', '150g boniato cocido', '100g espinacas salteadas al vapor', 'AOVE'],
        safeForRestrictions: true,
        tag: 'Mediterráneo'
      },
      {
        id: 'ls_preg_2',
        dishName: 'Lentejas Pardinas Estofadas con Pimiento Rojo, Calabaza y Arroz Integral',
        description: 'Receta cargada de hierro vegetal optimizado por la vitamina C del pimiento.',
        mealType: 'Almuerzo',
        calories: 450,
        proteinGrams: 22,
        carbsGrams: 65,
        fatGrams: 6,
        prepTimeMinutes: 25,
        ingredients: ['180g lentejas cocidas', '60g arroz integral', '100g pimiento rojo y calabaza', 'Laurel y AOVE'],
        safeForRestrictions: true,
        tag: 'Vegetariano'
      },
      {
        id: 'ls_preg_3',
        dishName: 'Tortilla de 2 Huevos Muy Hechos con Aguacate y Tomate Rallado en Pan Integral',
        description: 'Aporte fundamental de colina materna (esencial para el cerebro del bebé) y grasas insaturadas.',
        mealType: 'Desayuno',
        calories: 390,
        proteinGrams: 20,
        carbsGrams: 30,
        fatGrams: 21,
        prepTimeMinutes: 8,
        ingredients: ['2 huevos camperos cuajados a >70ºC', '50g aguacate', '1 tomate rallado', '1 rebanada pan integral artesanal'],
        safeForRestrictions: true,
        tag: 'Alto en Proteína'
      },
      {
        id: 'ls_preg_4',
        dishName: 'Solomillo de Pavo a la Plancha con Quinoa Cocida, Remolacha y Nueces',
        description: 'Plato denso en folatos naturales, hierro magro libre de riesgo microbiológico y zinc.',
        mealType: 'Cena',
        calories: 430,
        proteinGrams: 38,
        carbsGrams: 35,
        fatGrams: 14,
        prepTimeMinutes: 15,
        ingredients: ['140g solomillo pavo muy hecho', '100g quinoa cocida', '60g remolacha cocida', '15g nueces picadas'],
        safeForRestrictions: true,
        tag: 'Alto en Proteína'
      },
      {
        id: 'ls_preg_5',
        dishName: 'Yogur Griego Pasteurizado con Semillas de Sésamo, Arándanos y Almendra',
        description: 'Snack fresco rico en calcio, probióticos seguros y antioxidantes de arándanos y frambuesas.',
        mealType: 'Snack',
        calories: 260,
        proteinGrams: 14,
        carbsGrams: 24,
        fatGrams: 11,
        prepTimeMinutes: 4,
        ingredients: ['150g yogur griego pasteurizado', '50g arándanos frescos lavados', '10g semillas sésamo', '10g almendra laminada'],
        safeForRestrictions: true,
        tag: 'Rápido'
      }
    ]
  },
  menopause: {
    id: 'menopause',
    title: 'Perimenopausia y Menopausia',
    subtitle: 'Preservación de masa muscular, densidad mineral ósea y perfil cardiometabólico',
    ageRange: '45 - 65+ Años',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    clinicalSociety: 'ESPEN / ASPEN',
    officialGuidelineRef: 'ESPEN Metabolic & Body Composition Guidelines & Menopause Society Nutritional Consensus',
    caloriesFormula: 'Ajuste según gasto energético (evitar bajada metabólica con proteína alta)',
    macroRatio: {
      proteinGPerKg: '1.2 - 1.6 g/kg/día',
      proteinPercent: '22 - 26% del VCT',
      carbsPercent: '40 - 45% (Rico en fibra >30g/día)',
      fatPercent: '30 - 35% (AOVE, Omega-3 y Fitoestrógenos)',
      fiberGrams: '30 - 35 g/día',
    },
    targetValues: {
      proteinGPerKgMin: 1.2,
      proteinGPerKgMax: 1.6,
      caloriesKcalPerKg: 28,
      carbsPercent: 42,
      fatPercent: 33,
      fiberGrams: 32,
      waterMlPerKg: 30, // 2.0L/día
      calcium_mg: 1200,
      iron_mg: 8, // Baja necesidad tras menopausia (evitar sobrecarga férrica)
      vitaminD_iu: 1000,
      vitaminB12_mcg: 3.0,
      folate_mcg: 400,
      magnesium_mg: 400,
      zinc_mg: 11,
      potassium_mg: 3500,
      sodium_mg_max: 2000,
      iodine_mcg: 150,
      omega3_dha_mg: 350,
    },
    keyNutrients: [
      {
        name: 'Proteína Alta para Frenar Sarcopenia',
        amount: '1.2 - 1.6 g/kg/día',
        numericValue: 1.4,
        unit: 'g/kg/día',
        reason: 'El descenso estrogénico acelera la pérdida muscular; la proteína preserva el gasto metabólico.',
        clinicalSource: 'ESPEN Muscle Health'
      },
      {
        name: 'Calcio y Vitamina D3 + K2',
        amount: '1200 mg Calcio / 1000 UI Vit D3',
        numericValue: 1200,
        unit: 'mg/día',
        reason: 'Prevención de la osteopenia y osteoporosis postmenopáusica acelerada.',
        clinicalSource: 'IOF / ESPEN Guidelines'
      },
      {
        name: 'Magnesio y Potasio',
        amount: '400 mg Magnesio / 3500 mg Potasio',
        numericValue: 400,
        unit: 'mg/día',
        reason: 'Modula el tono vascular, reduce la presión arterial y mejora la calidad del sueño profundo.',
        clinicalSource: 'EFSA / ASPEN'
      },
      {
        name: 'Fitoestrógenos y Lignanos',
        amount: 'Diario (legumbres, lino, sésamo)',
        numericValue: 1,
        unit: 'ración/día',
        reason: 'Atenúa síntomas vasomotores (sofocos) y modula el perfil lipídico sérico.',
        clinicalSource: 'NAMS / FESNAD'
      },
      {
        name: 'Omega-3 EPA/DHA',
        amount: '350 - 500 mg/día',
        numericValue: 350,
        unit: 'mg/día',
        reason: 'Cardioprotección y reducción del estado inflamatorio crónico de bajo grado.',
        clinicalSource: 'AHA / ESPEN'
      }
    ],
    clinicalTips: [
      'Acompañar la ingesta proteica con entrenamiento de fuerza semanal para generar estímulo osteogénico.',
      'Controlar picos de insulina priorizando hidratos de carbono enteros y legumbres con abundante fibra soluble.',
      'Aportar grasas monoinsaturadas (AOVE) y frutos secos (almendras, nueces) para la salud cardiovascular.',
      'Limitar el café nocturno y el alcohol para reducir la frecuencia e intensidad de los sofocos.'
    ],
    forbiddenOrAvoid: [
      'Harinas refinadas y azúcares simples que incrementan la grasa visceral',
      'Exceso de sodio que favorece retención hídrica y pérdida urinaria de calcio',
      'Bebidas alcohólicas regulares que agravan los sofocos y la desmineralización ósea'
    ],
    realFoodSources: [
      { food: 'Ensalada de Garbanzos con Queso Fresco y Almendras', portion: '150g garbanzos + 50g queso fresco + 20g almendras', benefit: 'Aporte de 300mg de calcio asimilable, proteína vegetal, magnesio y fitoestrógenos.' },
      { food: 'Lomo de Salmón con Brócoli al Vapor y AOVE', portion: '150g salmón + 180g brócoli', benefit: 'Trío sinérgico: Calcio de brócoli, Vitamina D3 y Omega-3 antiinflamatorio.' },
      { food: 'Sardinillas en AOVE con Tomate y Pan de Centeno', portion: '1 lata sardinillas (60g) + 50g pan centeno', benefit: 'Calcio en raspas blandas comestibles (250mg), beta-glucanos y grasas saludables.' },
      { food: 'Revuelto de Huevos Camperos con Espinacas y Requesón', portion: '2 huevos + 120g espinacas + 50g requesón', benefit: 'Proteína completa, leucina, magnesio y potasio digestivo.' }
    ],
    menuTip: 'Incorpora 25g de almendras o nueces al día para sumar magnesio y grasas insaturadas que protegen tus arterias.',
    recommendedDishes: [
      {
        id: 'ls_men_1',
        dishName: 'Ensalada de Garbanzos con Queso Fresco, Almendras Picadas, Tomate y AOVE',
        description: 'Aporte de calcio biodisponible de queso fresco artesanal, proteína vegetal de garbanzos y grasas cardioprotectoras.',
        mealType: 'Almuerzo',
        calories: 420,
        proteinGrams: 26,
        carbsGrams: 38,
        fatGrams: 16,
        prepTimeMinutes: 10,
        ingredients: ['150g garbanzos cocidos', '50g queso fresco artesanal', '20g almendras picadas', 'Tomate y pimiento de huerta', 'AOVE'],
        safeForRestrictions: true,
        tag: 'Vegetariano'
      },
      {
        id: 'ls_men_2',
        dishName: 'Lomo de Salmón al Horno con Brócoli y Ajos Tiernos al Aceite de Oliva',
        description: 'Supercombo de calcio vegetal de brócoli, vitamina D y omega-3 marino.',
        mealType: 'Cena',
        calories: 440,
        proteinGrams: 35,
        carbsGrams: 12,
        fatGrams: 24,
        prepTimeMinutes: 20,
        ingredients: ['160g lomo salmón', '180g brócoli al vapor', '20g ajos tiernos', '10ml AOVE'],
        safeForRestrictions: true,
        tag: 'Keto'
      },
      {
        id: 'ls_men_3',
        dishName: 'Tostada de Pan de Centeno con Tomate, Sardinillas en AOVE y Nueces',
        description: 'Bomba protectora de calcio y omega-3 con las espinas blandas de las sardinillas, pan integral y nueces.',
        mealType: 'Desayuno',
        calories: 360,
        proteinGrams: 24,
        carbsGrams: 28,
        fatGrams: 16,
        prepTimeMinutes: 6,
        ingredients: ['1 rebanada centeno (50g)', '1 tomate restregado', '1 lata sardinillas en AOVE (60g)', '15g nueces'],
        safeForRestrictions: true,
        tag: 'Alto en Proteína'
      },
      {
        id: 'ls_men_4',
        dishName: 'Crema de Espárragos Verdes y Canónigos con Huevo Poché y Almendras',
        description: 'Cena digestiva rica en magnesio, zinc y potasio para reducir retención de líquidos.',
        mealType: 'Cena',
        calories: 310,
        proteinGrams: 19,
        carbsGrams: 18,
        fatGrams: 17,
        prepTimeMinutes: 15,
        ingredients: ['150g espárragos verdes', '80g canónigos', '1 huevo poché', '15g almendras tostadas', 'AOVE'],
        safeForRestrictions: true,
        tag: 'Bajo en Calorías'
      },
      {
        id: 'ls_men_5',
        dishName: 'Revuelto de Huevos Camperos con Espinacas Frescas, Requesón y Nueces',
        description: 'Plato tradicional de fácil preparación, rico en proteína completa, calcio y magnesio para la salud ósea.',
        mealType: 'Almuerzo',
        calories: 390,
        proteinGrams: 26,
        carbsGrams: 12,
        fatGrams: 22,
        prepTimeMinutes: 12,
        ingredients: ['2 huevos camperos', '120g espinacas frescas', '50g requesón artesanal', '20g nueces', '10ml AOVE'],
        safeForRestrictions: true,
        tag: 'Vegetariano'
      }
    ]
  },
  athlete: {
    id: 'athlete',
    title: 'Deportistas y Alto Rendimiento',
    subtitle: 'Síntesis proteica muscular (MPS), resíntesis de glucógeno, reposición electrolítica y adaptación',
    ageRange: 'Rendimiento & Fitness',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    clinicalSociety: 'ESPEN / ISSN',
    officialGuidelineRef: 'ESPEN Nutrition in Active Populations & ISSN (International Society of Sports Nutrition) Position Stand',
    caloriesFormula: '35 - 45 kcal/kg/día según volumen y fase de entrenamiento',
    macroRatio: {
      proteinGPerKg: '1.6 - 2.2 g/kg/día (hasta 2.4g en déficit)',
      proteinPercent: '22 - 28% del VCT',
      carbsPercent: '45 - 60% (3 - 7 g/kg según volumen)',
      fatPercent: '20 - 25% (Ácidos grasos antiinflamatorios)',
      fiberGrams: '30 - 38 g/día',
    },
    targetValues: {
      proteinGPerKgMin: 1.6,
      proteinGPerKgMax: 2.2,
      caloriesKcalPerKg: 38,
      carbsPercent: 52,
      fatPercent: 23,
      fiberGrams: 35,
      waterMlPerKg: 40, // 3.0L - 4.0L/día según sudoración
      calcium_mg: 1200,
      iron_mg: 18,
      vitaminD_iu: 1500,
      vitaminB12_mcg: 4.0,
      folate_mcg: 400,
      magnesium_mg: 450,
      zinc_mg: 15,
      potassium_mg: 4500,
      sodium_mg_max: 3000, // Ajustado a pérdidas en sudor
      iodine_mcg: 150,
      omega3_dha_mg: 500,
    },
    keyNutrients: [
      {
        name: 'Proteína Perientrenamiento (Leucina ≥3g)',
        amount: '1.6 - 2.2 g/kg/día (20-40g/toma)',
        numericValue: 1.8,
        unit: 'g/kg/día',
        reason: 'Máxima estimulación de la vía mTOR para hipertrofia y reparación de microdaño muscular.',
        clinicalSource: 'ISSN / ESPEN Consensus'
      },
      {
        name: 'Carbohidratos de Reposición',
        amount: '3 - 7 g/kg/día',
        numericValue: 5.0,
        unit: 'g/kg/día',
        reason: 'Satura depósitos de glucógeno hepático y muscular para sostener intensidad.',
        clinicalSource: 'ACSM / ISSN Guidelines'
      },
      {
        name: 'Electrolitos (Sodio, Potasio, Magnesio)',
        amount: 'Sodio 500-1000mg/L sudor / Magnesio 450mg',
        numericValue: 450,
        unit: 'mg/día',
        reason: 'Previene hiponatremia, calambres y deshidratación intracelular.',
        clinicalSource: 'ESPEN Fluid Balance'
      },
      {
        name: 'Vitamina D3 e Hierro',
        amount: 'Vit D3 1500 UI / Hierro 18 mg',
        numericValue: 1500,
        unit: 'UI/día',
        reason: 'Fuerza neuromuscular, prevención de fracturas por estrés y transporte de O2.',
        clinicalSource: 'ISSN Review'
      }
    ],
    clinicalTips: [
      'Fraccionar la proteína en 4 tomas de 0.4g/kg espaciadas cada 3-4 horas para maximizar la síntesis proteica.',
      'Tomar hidratos de carbono de asimilación rápida (fruta, arroz, miel) en la ventana inmediata post-entreno.',
      'Pesar antes y después de sesiones intensas: beber 1.5L de líquido con electrolitos por cada kg perdido.',
      'Garantizar 8 horas de sueño profundo como principal modulador hormonal y regenerador.'
    ],
    forbiddenOrAvoid: [
      'Déficits calóricos extremos (>700 kcal) en fases de competición o alta carga',
      'Alcohol en el periodo perientrenamiento (bloquea la síntesis proteica en un 37%)',
      'Dietas bajas en carbohidratos no adaptadas que comprometen la intensidad glicolítica'
    ],
    realFoodSources: [
      { food: 'Pechuga de Pollo o Pavo Marinado con Arroz y Aguacate', portion: '180g pollo + 150g arroz cocido + 40g aguacate', benefit: '44g de proteína pura, glucógeno limpio y ácidos grasos monoinsaturados.' },
      { food: 'Lomo de Atún Fresco con Pasta Integral y Piñones', portion: '160g atún + 80g pasta integral', benefit: '48g de proteína de altísimo valor biológico, leucina, zinc y magnesio.' },
      { food: 'Porridge de Avena con Proteína, Plátano y Miel', portion: '60g avena + 25g proteína + 1 plátano', benefit: 'Carbohidratos de absorción escalonada y recuperación glucogénica ultra digestiva.' },
      { food: 'Batido Recuperador de Plátano, Kéfir/Bebida Soja y Cacao', portion: '300ml kéfir + 1 plátano + 15g cacao 100%', benefit: 'Electrolitos (potasio, magnesio), polifenoles antiinflamatorios y proteína.' }
    ],
    menuTip: 'Consume una comida rica en carbohidratos y proteína limpia 2-3 horas antes de entrenar para iniciar con depósitos llenos.',
    recommendedDishes: [
      {
        id: 'ls_ath_1',
        dishName: 'Arroz con Pechuga de Pollo Marinado al Limón, Boniato y Aguacate',
        description: 'Plato clásico de atletas para recuperar glucógeno y reparar fibras musculares.',
        mealType: 'Almuerzo',
        calories: 560,
        proteinGrams: 46,
        carbsGrams: 60,
        fatGrams: 12,
        prepTimeMinutes: 15,
        ingredients: ['160g pechuga de pollo', '150g arroz cocido', '100g boniato al horno', '30g aguacate', 'AOVE'],
        safeForRestrictions: true,
        tag: 'Alto en Proteína'
      },
      {
        id: 'ls_ath_2',
        dishName: 'Tostadas de Masa Madre con Huevos Revueltos, Pavo Magro y Plátano',
        description: 'Desayuno pre/post entreno completo con perfil aminoacídico óptimo y potasio.',
        mealType: 'Desayuno',
        calories: 490,
        proteinGrams: 32,
        carbsGrams: 52,
        fatGrams: 15,
        prepTimeMinutes: 10,
        ingredients: ['2 rebanadas pan masa madre (80g)', '2 huevos camperos', '40g pechuga de pavo', '1 plátano', '15g crema de almendra'],
        safeForRestrictions: true,
        tag: 'Alto en Proteína'
      },
      {
        id: 'ls_ath_3',
        dishName: 'Bowl de Porridge de Avena con Arándanos, Proteína y Miel Pura',
        description: 'Comida perientrenamiento para recargar depósitos de glucógeno sin pesadez digestiva.',
        mealType: 'Desayuno',
        calories: 430,
        proteinGrams: 28,
        carbsGrams: 60,
        fatGrams: 8,
        prepTimeMinutes: 8,
        ingredients: ['60g copos de avena', '25g proteína limpia', '50g arándanos', '10g miel pura'],
        safeForRestrictions: true,
        tag: 'Rápido'
      },
      {
        id: 'ls_ath_4',
        dishName: 'Lomo de Atún a la Plancha con Pasta Integral, Tomates Cherry y Piñones',
        description: 'Sabor mediterráneo con altísima concentración de leucina y carbohidratos complejos.',
        mealType: 'Almuerzo',
        calories: 590,
        proteinGrams: 48,
        carbsGrams: 64,
        fatGrams: 15,
        prepTimeMinutes: 15,
        ingredients: ['160g lomo atún fresco', '80g pasta integral seca', '10g piñones', 'Tomates cherry y hojas de albahaca'],
        safeForRestrictions: true,
        tag: 'Alto en Proteína'
      },
      {
        id: 'ls_ath_5',
        dishName: 'Batido Recuperador Post-Entreno de Plátano, Espinacas, Bebida Vegetal y Miel',
        description: 'Reposición hídrica, salina y proteica en formato líquido para asimilación ultrarrápida.',
        mealType: 'Snack',
        calories: 340,
        proteinGrams: 25,
        carbsGrams: 46,
        fatGrams: 5,
        prepTimeMinutes: 3,
        ingredients: ['300ml bebida soja enriquecida', '1 plátano grande', '30g espinacas frescas', '20g aislado proteína', '10g miel'],
        safeForRestrictions: true,
        tag: 'Rápido'
      }
    ]
  },
  infancy: {
    id: 'infancy',
    title: 'Infancia y Crecimiento (2 - 12 Años)',
    subtitle: 'Desarrollo cerebral, consolidación del esqueleto, inmunidad y educación gustativa',
    ageRange: '2 - 12 Años',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    clinicalSociety: 'ESPEN / ESPGHAN',
    officialGuidelineRef: 'ESPGHAN / ESPEN Pediatric Nutrition Guidelines & EFSA Child Reference Values',
    caloriesFormula: '1200 - 1800 kcal/día según edad, sexo y nivel de juego activo',
    macroRatio: {
      proteinGPerKg: '0.9 - 1.1 g/kg/día',
      proteinPercent: '12 - 15% del VCT',
      carbsPercent: '50 - 55% (Almidones complejos y frutas)',
      fatPercent: '30 - 35% (Grasas estructurales del neurodesarrollo)',
      fiberGrams: '15 - 20 g/día (Edad + 5g)',
    },
    targetValues: {
      proteinGPerKgMin: 0.9,
      proteinGPerKgMax: 1.1,
      caloriesKcalPerKg: 70, // Varía de 80 a 60 kcal/kg según edad
      carbsPercent: 53,
      fatPercent: 32,
      fiberGrams: 18,
      waterMlPerKg: 50, // 1.3L - 1.7L/día
      calcium_mg: 1000,
      iron_mg: 10,
      vitaminD_iu: 600,
      vitaminB12_mcg: 2.0,
      folate_mcg: 300,
      magnesium_mg: 200,
      zinc_mg: 8,
      potassium_mg: 2500,
      sodium_mg_max: 1500,
      iodine_mcg: 120,
      omega3_dha_mg: 250,
    },
    keyNutrients: [
      {
        name: 'Calcio y Vitamina D',
        amount: '800 - 1000 mg Calcio / 600 UI Vit D',
        numericValue: 1000,
        unit: 'mg/día',
        reason: 'Consolidación de la matriz ósea y dentición en fase de crecimiento longitudinal.',
        clinicalSource: 'ESPGHAN Pediatric Guidelines'
      },
      {
        name: 'Hierro y Zinc',
        amount: 'Hierro 10 mg / Zinc 8 mg',
        numericValue: 10,
        unit: 'mg/día',
        reason: 'Desarrollo neuronal cognitivo, atención escolar y defensas inmunológicas.',
        clinicalSource: 'ESPEN / ESPGHAN'
      },
      {
        name: 'Grasas Esenciales y DHA',
        amount: '200 - 250 mg/día',
        numericValue: 250,
        unit: 'mg/día',
        reason: 'Mielinización de fibras nerviosas y desarrollo de la retina.',
        clinicalSource: 'EFSA Pediatric Opinion'
      },
      {
        name: 'Fibra Suave y Agua',
        amount: '18g fibra / 1.5L agua',
        numericValue: 18,
        unit: 'g/día',
        reason: 'Regulación del tránsito intestinal infantil sin quelar minerales esenciales.',
        clinicalSource: 'ESPEN Guidelines'
      }
    ],
    clinicalTips: [
      'Ofrecer alimentos reales variados en textura y color para fomentar la autorregulación natural del apetito.',
      'Sustituir zumos industriales y refrescos por agua fresca y fruta entera con piel bien lavada.',
      'No emplear la comida como premio o castigo; favorecer un ambiente familiar tranquilo en la mesa.',
      'Asegurar desayunos equilibrados con hidratos complejos y proteína magra para sostener la concentración matinal.'
    ],
    forbiddenOrAvoid: [
      'Ultraprocesados industriales ricos en azúcares refinados y jarabes de maíz',
      'Bebidas azucaradas, batidos industriales y refrescos azucarados',
      'Embutidos grasos procesados ricos en nitritos y sodio elevado'
    ],
    realFoodSources: [
      { food: 'Tortitas Caseras de Avena, Plátano y Huevo', portion: '2 tortitas (80g)', benefit: 'Energía sostenida, Colina para el cerebro, Cinc y cero azúcar añadido.' },
      { food: 'Albóndigas de Pavo Caseras con Puré de Calabaza', portion: '120g albóndigas + 100g puré', benefit: 'Hierro hemo magro, fácil masticación y betacarotenos.' },
      { food: 'Palitos de Merluza al Horno con Bastones de Boniato', portion: '130g merluza + 100g boniato', benefit: 'Pescado blanco al horno sin fritos tóxicos, fósforo y vitamina A.' },
      { food: 'Fruta Fresca de Temporada con Yogur Natural Entero', portion: '1 plátano o manzana + 125g yogur', benefit: 'Calcio bioasimilable, probióticos y fibra soluble prebiótica.' }
    ],
    menuTip: 'Integra verduras picadas en purés, salsas caseras de tomate o masas de albóndigas para facilitar su aceptación.',
    recommendedDishes: [
      {
        id: 'ls_inf_1',
        dishName: 'Mini Tortitas de Avena, Plátano y Arándanos con Crema de Almendra',
        description: 'Desayuno o merienda rica en energía sostenible, fácil de comer con las manos.',
        mealType: 'Desayuno',
        calories: 280,
        proteinGrams: 12,
        carbsGrams: 42,
        fatGrams: 7,
        prepTimeMinutes: 10,
        ingredients: ['40g avena molida', '1 plátano maduro', '1 huevo campero', '30g arándanos frescos', '10g crema almendra 100%'],
        safeForRestrictions: true,
        tag: 'Rápido'
      },
      {
        id: 'ls_inf_2',
        dishName: 'Albóndigas Caseras de Pavo y Calabacín en Salsa de Tomate con Cuscús',
        description: 'Plato jugoso y suave rico en hierro magro con vegetales integrados en la masa.',
        mealType: 'Almuerzo',
        calories: 390,
        proteinGrams: 30,
        carbsGrams: 45,
        fatGrams: 9,
        prepTimeMinutes: 20,
        ingredients: ['120g picada pavo', '50g calabacín rallado', '100g salsa tomate casera', '50g cuscús cocido'],
        safeForRestrictions: true,
        tag: 'Alto en Proteína'
      },
      {
        id: 'ls_inf_3',
        dishName: 'Varitas de Merluza al Horno con Empanado de Avena y Bastones de Zanahoria',
        description: 'Alternativa saludable horneada sin fritos, rica en fósforo y omega-3.',
        mealType: 'Cena',
        calories: 310,
        proteinGrams: 28,
        carbsGrams: 30,
        fatGrams: 8,
        prepTimeMinutes: 15,
        ingredients: ['150g lomo merluza fresca', '20g copos avena molidos', '1 huevo batido', '100g zanahoria al horno'],
        safeForRestrictions: true,
        tag: 'Bajo en Calorías'
      },
      {
        id: 'ls_inf_4',
        dishName: 'Puré Cremoso de Lentejas Rojas con Calabaza, Manzana Rallada y AOVE',
        description: 'Textura suave muy apetecible para niños, cargada de hierro vegetal, zinc y fibra suave.',
        mealType: 'Almuerzo',
        calories: 320,
        proteinGrams: 16,
        carbsGrams: 48,
        fatGrams: 7,
        prepTimeMinutes: 15,
        ingredients: ['100g lentejas rojas cocidas', '80g calabaza asada', '40g manzana rallada', '8ml aceite de oliva virgen extra'],
        safeForRestrictions: true,
        tag: 'Vegetariano'
      },
      {
        id: 'ls_inf_5',
        dishName: 'Nuggets Caseros de Pollo y Espinacas al Horno con Boniato en Bastones',
        description: 'Versión casera 100% comida real de nuggets fritos, horneados con espinacas picadas.',
        mealType: 'Cena',
        calories: 350,
        proteinGrams: 32,
        carbsGrams: 36,
        fatGrams: 9,
        prepTimeMinutes: 18,
        ingredients: ['130g pechuga pollo picada', '30g espinacas frescas picadas', '100g boniato al horno', 'Copos de avena molidos'],
        safeForRestrictions: true,
        tag: 'Alto en Proteína'
      }
    ]
  },
  adolescence: {
    id: 'adolescence',
    title: 'Adolescencia (13 - 18 Años)',
    subtitle: 'Pico de mineralización ósea de por vida, estirón puberal y elevado gasto cognitivo/físico',
    ageRange: '13 - 18 Años',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    clinicalSociety: 'ESPEN / ESPGHAN',
    officialGuidelineRef: 'ESPEN / ESPGHAN Adolescent Clinical Nutrition & EFSA Pubertal Growth Values',
    caloriesFormula: '2200 - 3000 kcal/día según estirón, sexo y volumen de actividad física',
    macroRatio: {
      proteinGPerKg: '1.2 - 1.6 g/kg/día',
      proteinPercent: '18 - 22% del VCT',
      carbsPercent: '50 - 55% (Glucógeno para estudio y deporte)',
      fatPercent: '28 - 32% (Sostén de síntesis hormonal gonadal)',
      fiberGrams: '28 - 35 g/día',
    },
    targetValues: {
      proteinGPerKgMin: 1.2,
      proteinGPerKgMax: 1.6,
      caloriesKcalPerKg: 42,
      carbsPercent: 52,
      fatPercent: 30,
      fiberGrams: 30,
      waterMlPerKg: 35, // 2.2L - 2.8L/día
      calcium_mg: 1300, // Máximo requerimiento de la vida
      iron_mg: 15, // Especial atención a chicas por pérdidas menstruales
      vitaminD_iu: 800,
      vitaminB12_mcg: 3.5,
      folate_mcg: 400,
      magnesium_mg: 400,
      zinc_mg: 14,
      potassium_mg: 3500,
      sodium_mg_max: 2000,
      iodine_mcg: 150,
      omega3_dha_mg: 300,
    },
    keyNutrients: [
      {
        name: 'Calcio para Pico Óseo (PBM)',
        amount: '1300 mg/día',
        numericValue: 1300,
        unit: 'mg/día',
        reason: 'En esta ventana se consolida casi el 50% de la densidad mineral ósea del adulto.',
        clinicalSource: 'ESPGHAN / ESPEN'
      },
      {
        name: 'Hierro Hemínico y No Hemínico',
        amount: '15 mg/día (chicas) / 11 mg/día (chicos)',
        numericValue: 15,
        unit: 'mg/día',
        reason: 'Compensar menarquia, pérdidas menstruales y aumento del volumen eritrocitario.',
        clinicalSource: 'EFSA DRV Adolescent'
      },
      {
        name: 'Zinc y Magnesio',
        amount: 'Zinc 14 mg / Magnesio 400 mg',
        numericValue: 14,
        unit: 'mg/día',
        reason: 'Desarrollo de caracteres sexuales secundarios, control del acné y función mitocondrial.',
        clinicalSource: 'ESPEN Adolescent Review'
      },
      {
        name: 'Proteínas de Alto Valor Biológico',
        amount: '1.2 - 1.6 g/kg/día',
        numericValue: 1.4,
        unit: 'g/kg/día',
        reason: 'Síntesis de masa magra, colágeno y enzimas durante el estirón puberal acelerado.',
        clinicalSource: 'ASPEN / ESPEN'
      }
    ],
    clinicalTips: [
      'Prohibir el consumo de bebidas energéticas comerciales ricas en megadosis de cafeína sintética y azúcares.',
      'Sostener meriendas reales (bocadillos con pan de masa madre, atún, queso curado, frutos secos) frente a snacks de quiosco.',
      'Fomentar una relación positiva con la imagen corporal sin dietas milagro restrictivas.',
      'Cenas con proteína magra y triptófano (huevo, pavo, pescado blanco) para un descanso reparador de 8-9 horas.'
    ],
    forbiddenOrAvoid: [
      'Bebidas energéticas estimulantes (Monster, Red Bull, etc.)',
      'Dietas de choque hipocalóricas extremas sin criterio profesional',
      'Snacks fritos industriales y bollería cargada de grasas saturadas trans'
    ],
    realFoodSources: [
      { food: 'Wrap Integral de Pollo, Guacamole y Pimientos', portion: '1 wrap (60g) + 140g pollo + 40g guacamole', benefit: '36g de proteína limpia, zinc, hierro y grasas saludables para saciedad.' },
      { food: 'Bowl de Quinoa con Atún, Huevo Duro, Aguacate y Sésamo', portion: '120g quinoa + 1 lata atún + 1 huevo + 40g aguacate', benefit: 'Hierro, omega-3, magnesio y carbohidratos complejos para el estudio.' },
      { food: 'Batido Energético de Avena, Leche/Soja, Plátano y Cacao Puro', portion: '250ml leche + 40g avena + 1 plátano + 15g nueces', benefit: 'Magnesio, potasio y carbohidratos lentos para mañanas de instituto o entreno.' },
      { food: 'Hamburguesa Casera de Ternera 100% con Boniato al Horno', portion: '150g ternera magra + 150g boniato', benefit: 'Hierro hemo de máxima biodisponibilidad y zinc para el crecimiento.' }
    ],
    menuTip: 'Añade semillas de sésamo y queso curado a las ensaladas para alcanzar fácilmente los 1300mg diarios de calcio.',
    recommendedDishes: [
      {
        id: 'ls_ado_1',
        dishName: 'Wrap Integral de Pechuga de Pollo, Guacamole y Pimientos Salteados',
        description: 'Merienda o almuerzo saciante con excelente balance entre proteína limpia y grasas de aguacate.',
        mealType: 'Almuerzo',
        calories: 460,
        proteinGrams: 36,
        carbsGrams: 44,
        fatGrams: 14,
        prepTimeMinutes: 12,
        ingredients: ['1 tortilla integral (60g)', '130g pechuga pollo', '40g guacamole', 'Pimientos asados'],
        safeForRestrictions: true,
        tag: 'Alto en Proteína'
      },
      {
        id: 'ls_ado_2',
        dishName: 'Bowl Proteico de Quinoa, Atún, Aguacate, Huevo Duro y Semillas de Sésamo',
        description: 'Comida completa repleta de hierro, proteína y carbohidratos de absorción lenta.',
        mealType: 'Almuerzo',
        calories: 490,
        proteinGrams: 38,
        carbsGrams: 42,
        fatGrams: 18,
        prepTimeMinutes: 10,
        ingredients: ['120g quinoa cocida', '1 lata atún claro en AOVE', '1 huevo duro', '40g aguacate', 'Semillas sésamo'],
        safeForRestrictions: true,
        tag: 'Mediterráneo'
      },
      {
        id: 'ls_ado_3',
        dishName: 'Batido Energético de Avena, Bebida de Soja, Plátano, Cacao Puro y Nueces',
        description: 'Snack o desayuno ultra rápido cargado de magnesio, energía limpia e isoflavonas para estudio y entreno.',
        mealType: 'Desayuno',
        calories: 380,
        proteinGrams: 18,
        carbsGrams: 52,
        fatGrams: 12,
        prepTimeMinutes: 5,
        ingredients: ['250ml bebida soja enriquecida calcio', '40g avena', '1 plátano', '10g cacao 100%', '15g nueces'],
        safeForRestrictions: true,
        tag: 'Rápido'
      },
      {
        id: 'ls_ado_4',
        dishName: 'Hamburguesa Casera de Ternera Magra y Espinacas con Boniato Asado',
        description: 'Aporte masivo de hierro hemínico y zinc para sostener el rápido crecimiento corporal.',
        mealType: 'Cena',
        calories: 510,
        proteinGrams: 40,
        carbsGrams: 45,
        fatGrams: 16,
        prepTimeMinutes: 15,
        ingredients: ['150g picada ternera 100% magra', '30g espinacas', '150g boniato asado', 'Ensalada verde con tomate'],
        safeForRestrictions: true,
        tag: 'Alto en Proteína'
      },
      {
        id: 'ls_ado_5',
        dishName: 'Parrillada de Salmón con Pasta Integral, Tomates Cherry y Parmesano',
        description: 'Glucógeno muscular de larga duración con ácidos grasos omega-3 esenciales para la memoria.',
        mealType: 'Almuerzo',
        calories: 540,
        proteinGrams: 37,
        carbsGrams: 55,
        fatGrams: 18,
        prepTimeMinutes: 15,
        ingredients: ['140g salmón fresco', '70g pasta integral seca', '100g tomates cherry', '15g queso parmesano'],
        safeForRestrictions: true,
        tag: 'Mediterráneo'
      }
    ]
  },
  adult: {
    id: 'adult',
    title: 'Adulto Sano / Mantenimiento (19 - 64 Años)',
    subtitle: 'Salud metabólica, prevención cardiovascular y mantenimiento de homeostasis celular',
    ageRange: '19 - 64 Años',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    clinicalSociety: 'ESPEN / ASPEN',
    officialGuidelineRef: 'ESPEN Clinical Nutrition Guidelines & ASPEN Adult Maintenance Standards',
    caloriesFormula: '25 - 30 kcal/kg/día según nivel de actividad física diaria',
    macroRatio: {
      proteinGPerKg: '1.0 - 1.2 g/kg/día (hasta 1.5g en recomposición)',
      proteinPercent: '18 - 22% del VCT',
      carbsPercent: '45 - 55% (Fibra >30g/día)',
      fatPercent: '25 - 35% (Grasa saturada <10%)',
      fiberGrams: '30 - 35 g/día',
    },
    targetValues: {
      proteinGPerKgMin: 1.0,
      proteinGPerKgMax: 1.2,
      caloriesKcalPerKg: 28,
      carbsPercent: 50,
      fatPercent: 30,
      fiberGrams: 32,
      waterMlPerKg: 35, // 2.0L - 2.5L/día
      calcium_mg: 1000,
      iron_mg: 14,
      vitaminD_iu: 800,
      vitaminB12_mcg: 2.8,
      folate_mcg: 400,
      magnesium_mg: 375,
      zinc_mg: 11,
      potassium_mg: 3500,
      sodium_mg_max: 2000,
      iodine_mcg: 150,
      omega3_dha_mg: 250,
    },
    keyNutrients: [
      {
        name: 'Proteína Equilibrada',
        amount: '1.0 - 1.2 g/kg/día',
        numericValue: 1.1,
        unit: 'g/kg/día',
        reason: 'Recambio proteico diario, balance de nitrógeno neutro y función enzimática.',
        clinicalSource: 'ESPEN General Guidelines'
      },
      {
        name: 'Fibra Dietética Total',
        amount: '30 - 35 g/día',
        numericValue: 32,
        unit: 'g/día',
        reason: 'Microbiota sana, producción de ácidos grasos de cadena corta (AGCC) y control del colesterol.',
        clinicalSource: 'EFSA / ESPEN DRV'
      },
      {
        name: 'Grasas Monoinsaturadas (AOVE)',
        amount: '20 - 30 ml/día de AOVE en crudo',
        numericValue: 25,
        unit: 'ml/día',
        reason: 'Polifenoles antioxidantes y ácido oleico cardioprotector.',
        clinicalSource: 'Predimed / FESNAD'
      },
      {
        name: 'Vitamina D y Magnesio',
        amount: '800 UI Vit D3 / 375 mg Magnesio',
        numericValue: 800,
        unit: 'UI/día',
        reason: 'Regulación del eje inmune, sensibilidad a la insulina y tono muscular.',
        clinicalSource: 'ESPEN / EFSA'
      }
    ],
    clinicalTips: [
      'Seguir el patrón de la Dieta Mediterránea con legumbres (3-4 veces/semana), pescado azul y abundantes verduras.',
      'Mantener una ingesta mínima de agua de 2.0 a 2.5 litros diarios según clima y actividad.',
      'Controlar el consumo de azúcares libres manteniéndolos por debajo del 5% de las calorías totales.',
      'Practicar actividad física regular combinando fuerza e intervalos aeróbicos.'
    ],
    forbiddenOrAvoid: [
      'Alimentos ultraprocesados con grasas hidrogenadas y azúcares añadidos',
      'Exceso de alcohol (>1 UBE/día)',
      'Sodio en exceso (>2000 mg de sodio = 5g de sal)'
    ],
    realFoodSources: [
      { food: 'Lentejas Pardinas con Verduras Variadas y AOVE', portion: '200g lentejas + 100g verduras', benefit: 'Proteína vegetal, fibra prebiótica, hierro y potasio.' },
      { food: 'Lomo de Salmón o Caballa a la Plancha con Ensalada', portion: '150g pescado + 120g ensalada', benefit: 'Omega-3 EPA/DHA, vitamina D y proteínas completas.' },
      { food: 'Tostada de Pan Integral con Tomate y Huevo Escalfado', portion: '60g pan + 1 tomate + 1 huevo', benefit: 'Desayuno saciante con bajo índice glucémico y colina.' },
      { food: 'Puñado de Nueces y Almendras con Fruta de Temporada', portion: '30g frutos secos + 1 manzana', benefit: 'Magnesio, vitamina E antioxidante y saciedad limpia.' }
    ],
    menuTip: 'Distribuye las comidas principales con la regla del plato: 50% verduras, 25% proteína y 25% carbohidratos complejos.',
    recommendedDishes: [
      {
        id: 'ls_adu_1',
        dishName: 'Salteado Mediterráneo de Pollo con Quinoa, Brócoli y Aceite de Oliva',
        description: 'Plato equilibrado de alta biodisponibilidad y digestión ligera para el ritmo diario.',
        mealType: 'Almuerzo',
        calories: 450,
        proteinGrams: 38,
        carbsGrams: 42,
        fatGrams: 14,
        prepTimeMinutes: 15,
        ingredients: ['150g pechuga pollo', '100g quinoa cocida', '120g brócoli al vapor', '10ml AOVE'],
        safeForRestrictions: true,
        tag: 'Alto en Proteína'
      },
      {
        id: 'ls_adu_2',
        dishName: 'Dorada al Horno sobre Cama de Patatas Panaderas y Tomate de Huerta',
        description: 'Pescado blanco tradicional rico en proteínas limpias, fósforo y grasas saludables.',
        mealType: 'Cena',
        calories: 380,
        proteinGrams: 34,
        carbsGrams: 28,
        fatGrams: 11,
        prepTimeMinutes: 20,
        ingredients: ['180g lomo dorada', '120g patata cocida al horno', '80g tomate asado', 'Ajo y perejil'],
        safeForRestrictions: true,
        tag: 'Mediterráneo'
      }
    ]
  }
};

const CUSTOM_GUIDELINES_STORAGE_KEY = 'nutri_custom_life_stage_recommendations';

export function loadCustomLifeStagesGuidelines(): Record<string, LifeStageGuideline> {
  try {
    const saved = localStorage.getItem(CUSTOM_GUIDELINES_STORAGE_KEY);
    if (!saved) return OFFICIAL_ESPEN_ASPEN_GUIDELINES;
    const parsed = JSON.parse(saved);
    // Merge with defaults in case of missing keys
    return { ...OFFICIAL_ESPEN_ASPEN_GUIDELINES, ...parsed };
  } catch {
    return OFFICIAL_ESPEN_ASPEN_GUIDELINES;
  }
}

export function saveCustomLifeStagesGuidelines(data: Record<string, LifeStageGuideline>): void {
  try {
    localStorage.setItem(CUSTOM_GUIDELINES_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving custom guidelines:', err);
  }
}

export function resetGuidelinesToOfficial(): Record<string, LifeStageGuideline> {
  try {
    localStorage.removeItem(CUSTOM_GUIDELINES_STORAGE_KEY);
  } catch {}
  return OFFICIAL_ESPEN_ASPEN_GUIDELINES;
}
