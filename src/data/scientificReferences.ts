export interface ScientificReference {
  id: string;
  category: 'Base de Datos Bromatológica' | 'Organismo Internacional' | 'Sociedad Científica / Consenso' | 'Reglamento / Marcado Legal';
  title: string;
  institution: string;
  countryOrScope: string;
  citation: string;
  url: string;
  licenseType: string;
  usageInApp: string;
  keyDataPoints: string[];
}

export const SCIENTIFIC_REFERENCES: ScientificReference[] = [
  {
    id: 'ref_espen',
    category: 'Sociedad Científica / Consenso',
    title: 'ESPEN Guidelines on Clinical Nutrition (Geriatrics, Adults & Disease)',
    institution: 'European Society for Clinical Nutrition and Metabolism (ESPEN)',
    countryOrScope: 'Europa / Internacional',
    citation: 'Volkert, D., et al. (2022-2024). ESPEN guideline on clinical nutrition and hydration in geriatrics, polymorbid patients and critical care. Clinical Nutrition Journal.',
    url: 'https://www.espen.org/guidelines-home/espen-guidelines',
    licenseType: 'Publicación Científica Oficial Open Access (Clinical Nutrition)',
    usageInApp: 'Establece los requerimientos de proteína clínica (1.0-1.5 g/kg/día en senectud y patologías), umbral de leucina (3g/toma), hidratación y micronutrientes esenciales.',
    keyDataPoints: [
      'Proteína mínima de 1.0 a 1.5 g/kg/día en adultos mayores para frenar sarcopenia',
      'Aporte de 30 kcal/kg/día como meta energética basal clínica',
      'Hidratación de 30 ml/kg/día o mínimo 1.6L mujeres / 2.0L hombres',
      'Suplementación preventiva de Vitamina D3 (800-1000 UI) y B12'
    ]
  },
  {
    id: 'ref_aspen',
    category: 'Sociedad Científica / Consenso',
    title: 'ASPEN Clinical Guidelines and Nutritional Standards',
    institution: 'American Society for Parenteral and Enteral Nutrition (ASPEN)',
    countryOrScope: 'Estados Unidos / Internacional',
    citation: 'Compher, C., et al. (2022-2024). ASPEN Clinical Guidelines for Nutrition Support Therapy in Adult and Pediatric Populations. JPEN: Journal of Parenteral and Enteral Nutrition.',
    url: 'https://www.nutritioncare.org/Guidelines_and_Clinical_Resources',
    licenseType: 'Consenso Médico Oficial ASPEN',
    usageInApp: 'Define las pautas de macronutrientes, micronutrientes pediátricos, perinatales y adultos, y modulación de respuesta metabólica al estrés.',
    keyDataPoints: [
      'Necesidades proteicas por etapas biológicas y estrés metabólico',
      'Rangos de micronutrientes (folatos, hierro, zinc, selenio, magnesio)',
      'Directrices para soporte nutricional materno-fetal y neonatal'
    ]
  },
  {
    id: 'ref_bedca',
    category: 'Base de Datos Bromatológica',
    title: 'BEDCA - Base de Datos Española de Composición de Alimentos',
    institution: 'AESAN (Agencia Española de Seguridad Alimentaria y Nutrición) / Ministerio de Sanidad',
    countryOrScope: 'España / Unión Europea',
    citation: 'Red BEDCA. (2024). Base de Datos Española de Composición de Alimentos v2.0. Ministerio de Sanidad, Consumo y Bienestar Social.',
    url: 'https://www.bedca.net',
    licenseType: 'Datos Abiertos Institucionales (Open Access / Reutilización del Sector Público)',
    usageInApp: 'Proporciona la composición oficial de macronutrientes, micronutrientes y factores de conversión de energía para alimentos consumidos en España.',
    keyDataPoints: [
      'Valores de energía (kcal/kJ) por 100g',
      'Perfil de ácidos grasos (saturados, monoinsaturados, poliinsaturados)',
      'Contenido de calcio, hierro, potasio, sodio, magnesio y zinc',
      'Vitaminas A, C, D, B12, folatos y tiamina'
    ]
  },
  {
    id: 'ref_usda',
    category: 'Base de Datos Bromatológica',
    title: 'USDA FoodData Central',
    institution: 'U.S. Department of Agriculture (USDA) - Agricultural Research Service',
    countryOrScope: 'Estados Unidos / Internacional',
    citation: 'U.S. Department of Agriculture, Agricultural Research Service. (2023). FoodData Central. Department of Agriculture, USA.',
    url: 'https://fdc.nal.usda.gov',
    licenseType: 'Dominio Público Oficial (U.S. Government Work / Public Domain)',
    usageInApp: 'Suministra valores quimico-analíticos estándar para materias primas, cortes de carne, legumbres y alimentos genéricos globales.',
    keyDataPoints: [
      'Perfiles completos de aminoácidos esenciales',
      'Densidad de fibra dietética total y soluble',
      'Desglose de azúcares añadidos vs. azúcares intrínsecos',
      'Micronutrientes traza'
    ]
  },
  {
    id: 'ref_efsa',
    category: 'Organismo Internacional',
    title: 'EFSA - Dietary Reference Values & Nutrient Tolerable Upper Intake Levels',
    institution: 'European Food Safety Authority (EFSA)',
    countryOrScope: 'Unión Europea',
    citation: 'EFSA Panel on Dietetic Products, Nutrition and Allergies (NDA). (2017-2023). Scientific Opinion on Dietary Reference Values for nutrients and energy. EFSA Journal.',
    url: 'https://www.efsa.europa.eu/en/topics/topic/dietary-reference-values',
    licenseType: 'Acceso Público Oficial EU',
    usageInApp: 'Establece los rangos de ingesta de referencia (DRV), límites superiores tolerables (UL) y clasificación de los 14 alérgenos de declaración obligatoria.',
    keyDataPoints: [
      'Alérgenos de Anexo II (Gluten, Lactosa, Frutos de cáscara, Huevo, Pescado, Marisco, Soja, etc.)',
      'Necesidades estimadas de proteína por kg de peso corporal (0.8g - 2.0g/kg)',
      'Límites recomendados de grasas saturadas (<10% del VCT)'
    ]
  },
  {
    id: 'ref_who',
    category: 'Organismo Internacional',
    title: 'OMS / WHO - Directrices de Ingesta Nutricional y Salud Global',
    institution: 'Organización Mundial de la Salud (OMS / WHO)',
    countryOrScope: 'Internacional / Global',
    citation: 'World Health Organization. (2015/2020). Guideline: Sugars intake for adults and children & Sodium intake guidelines. Geneva: WHO Guidelines Approved by the Guidelines Review Committee.',
    url: 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet',
    licenseType: 'Acceso Abierto OMS / WHO Public Information',
    usageInApp: 'Determina los umbrales de alerta para consumo excesivo de azúcar libre (<10% y objetivo <5%), sodio (<2000mg/día) y fibra mínima (>25g/día).',
    keyDataPoints: [
      'Límite de azúcar libre < 25g/día (objetivo idóneo)',
      'Máximo de sodio 2.000 mg/día (equivalente a 5g de sal)',
      'Recomendación de 5 raciones semanales de frutas y verduras'
    ]
  },
  {
    id: 'ref_fesnad',
    category: 'Sociedad Científica / Consenso',
    title: 'Consenso FESNAD-SEEDO & Guías por Etapas de la Vida',
    institution: 'Federación Española de Sociedades de Nutrición, Alimentación y Dietética (FESNAD)',
    countryOrScope: 'España / Iberoamérica',
    citation: 'Rubio, M. A., et al. (2011/2022). Consenso FESNAD-SEEDO para la prevención y el tratamiento del sobrepeso y la obesidad en adultos. Revista Española de Nutrición Humana y Dietética.',
    url: 'http://www.fesnad.org',
    licenseType: 'Publicación Científica Abierta / Consenso Médico',
    usageInApp: 'Bases metodológicas para las pautas de Nutrición por Etapas de la Vida (infancia, adolescencia, embarazo, menopausia, senectud y deportistas).',
    keyDataPoints: [
      'Ajustes fisiológicos de calcio y vitamina D en menopausia y senectud',
      'Aportes de folato y hierro en embarazo y lactancia',
      'Distribución de macronutrientes en crecimiento puberal'
    ]
  },
  {
    id: 'ref_fao',
    category: 'Organismo Internacional',
    title: 'FAO/WHO/UNU Human Energy Requirements',
    institution: 'Food and Agriculture Organization (FAO) / OMS / UNU',
    countryOrScope: 'Internacional',
    citation: 'FAO/WHO/UNU. (2004). Human energy requirements: Report of a Joint FAO/WHO/UNU Expert Consultation. FAO Food and Nutrition Technical Report Series No. 1, Rome.',
    url: 'https://www.fao.org/3/y5686e/y5686e00.htm',
    licenseType: 'Dominio Abierto FAO UN',
    usageInApp: 'Algoritmo de cálculo metabólico basal (TMB) por ecuaciones de Mifflin-St Jeor y Harris-Benedict con coeficientes de actividad física (PAL).',
    keyDataPoints: [
      'Gasto Energético Basal (GEB)',
      'Factores de Actividad Física (PAL: 1.2 Sedentario a 1.9 Muy Activo)',
      'Cálculo de balance calórico objetivo (Déficit / Mantenimiento / Superávit)'
    ]
  },
  {
    id: 'ref_nova',
    category: 'Organismo Internacional',
    title: 'Sistema NOVA de Clasificación por Grado de Procesamiento de Alimentos',
    institution: 'Centro de Investigaciones Epidemiológicas en Nutrición y Salud (NUPENS / Universidad de São Paulo) & FAO/OMS',
    countryOrScope: 'Internacional / ONU',
    citation: 'Monteiro, C. A., et al. (2019). Ultra-processed foods: what they are and how to identify them. Public Health Nutrition, 22(5), 936-941.',
    url: 'https://www.fao.org/fsnforum/resources/fsn-resources/ultra-processed-foods-what-they-are-and-how-identify-them',
    licenseType: 'Publicación Científica Open Access / Adopción Oficial FAO de las Naciones Unidas',
    usageInApp: 'Clasificación epidemiológica en 4 grupos (NOVA 1 sin procesar a NOVA 4 ultraprocesado) para advertir sobre aditivos cosméticos y matrices alimentarias desestructuradas.',
    keyDataPoints: [
      'NOVA 1: Alimentos naturales y mínimamente procesados',
      'NOVA 2: Ingredientes culinarios procesados (aceites, sal, vinagre)',
      'NOVA 3: Alimentos procesados tradicionales (conservas simples, quesos)',
      'NOVA 4: Productos ultraprocesados de formulación industrial'
    ]
  },
  {
    id: 'ref_traffic_light',
    category: 'Reglamento / Marcado Legal',
    title: 'Semáforo Nutricional Frontal Abierto (Front-of-Pack Traffic Light Rating System)',
    institution: 'Food Standards Agency (FSA UK) / Directrices de Salud Pública OMS y Ministerio de Sanidad',
    countryOrScope: 'Reino Unido / Unión Europea / OMS',
    citation: 'Food Standards Agency. (2016/2023). Guide to creating a front of pack nutrition label for pre-packed products sold through retail outlets. Department of Health, UK.',
    url: 'https://www.food.gov.uk/safety-hygiene/check-the-label',
    licenseType: 'Estándar Abierto de Salud Pública (Libre de patentes y marcas comerciales)',
    usageInApp: 'Regula los umbrales de semáforo por cada 100g para azúcares (verde ≤5g, ámbar 5-22.5g, rojo >22.5g), grasas saturadas (≤1.5g, 1.5-5g, >5g), grasas totales (≤3g, 3-17.5g, >17.5g) y sal (≤0.3g, 0.3-1.5g, >1.5g).',
    keyDataPoints: [
      'Indicadores objetivos basados en nutrientes críticos de salud pública',
      'Código de 3 colores universales (Verde, Ámbar, Rojo) no sujeto a royalties ni marcas registradas privadas',
      'Evaluación transparente por 100g / 100ml'
    ]
  },
  {
    id: 'ref_predimed',
    category: 'Sociedad Científica / Consenso',
    title: 'Ensayo Clínico PREDIMED: Prevención Primaria con Dieta Mediterránea',
    institution: 'CIBEROBN / Instituto de Salud Carlos III (Ministerio de Ciencia e Innovación)',
    countryOrScope: 'España',
    citation: 'Estruch, R., et al. (2018). Primary Prevention of Cardiovascular Disease with a Mediterranean Diet Supplemented with Extra-Virgin Olive Oil or Nuts. New England Journal of Medicine, 378(25), e34.',
    url: 'https://www.predimed.es',
    licenseType: 'Publicación Científica Open Access (NEJM / Biomedicina Pública Española)',
    usageInApp: 'Evidencia biomédica del beneficio del Aceite de Oliva Virgen Extra (AOVE), frutos secos del país, legumbres y hortalizas frescas en salud cardiovascular y longevidad.',
    keyDataPoints: [
      'Reducción del 30% en eventos cardiovasculares mayores',
      'Protección de matriz del AOVE y frutos secos frente a grasas procesadas',
      'Base empírica para no penalizar grasas cardiosaludables en el algoritmo TuNutriLens'
    ]
  }
];
