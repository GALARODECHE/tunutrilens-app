export interface CompetitorData {
  id: 'traditional' | 'barcode' | 'generic_ai' | 'commercial_brand';
  name: string;
  tagline: string;
  badge: string;
  color: string;
  pricingModel: string;
  mainWeakness: string;
  summaryVerdict: string;
}

export interface ComparisonDimension {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  realMarketProblem: string;
  tunutrilensAdvantage: string;
  tunutrilensDetails: string[];
  tunutrilensScore: number; // out of 10
  competitorScores: {
    traditional: { score: number; verdict: string; details: string };
    barcode: { score: number; verdict: string; details: string };
    generic_ai: { score: number; verdict: string; details: string };
    commercial_brand: { score: number; verdict: string; details: string };
  };
}

export const COMPETITORS: CompetitorData[] = [
  {
    id: 'traditional',
    name: 'Contadores Calóricos Convencionales (Búsqueda Manual)',
    tagline: 'Modelos clásicos de registro numérico y recuento calórico aislado',
    badge: 'Conteo tradicional',
    color: 'blue',
    pricingModel: 'Freemium con publicidad frecuente. Planes de suscripción de 9,99 € a 19,99 €/mes',
    mainWeakness: 'Enfoque centrado en sumar calorías sin ponderar la densidad biológica ni la matriz de los alimentos. Bases comunitarias con disparidad de datos.',
    summaryVerdict: 'Miden cantidad energética sin distinguir el impacto metabólico de la comida real frente a ultraprocesados bajos en calorías.'
  },
  {
    id: 'barcode',
    name: 'Lectores Estándar de Código de Barras',
    tagline: 'Escaneo exclusivo de productos envasados con código comercial EAN',
    badge: 'Lector de envases',
    color: 'amber',
    pricingModel: 'Gratuito básico o membresía anual para consulta ampliada',
    mainWeakness: 'Restringido a envases con código de barras. Cero reconocimiento de platos cocinados, restaurantes, comida fresca a granel o despensa doméstica.',
    summaryVerdict: 'Útil como filtro de compra en lineales de supermercado, pero desconectado del cocinado y el balance nutricional integral.'
  },
  {
    id: 'generic_ai',
    name: 'Apps Fotográficas de Dieta Extranjera',
    tagline: 'Modelos de visión artificial entrenados con patrones de dieta estándar foránea',
    badge: 'IA no mediterránea',
    color: 'purple',
    pricingModel: 'Suscripciones periódicas de 9,99 € a 29,99 €/mes tras breve periodo de prueba',
    mainWeakness: 'Modelos entrenados con porciones y platos importados. Desconocen el valor del AOVE, no analizan aditivos europeos ni rescatan alimentos de la nevera.',
    summaryVerdict: 'Atractivo visual pero desalineadas con la gastronomía tradicional española, el producto de proximidad y la sostenibilidad del hogar.'
  },
  {
    id: 'commercial_brand',
    name: 'Plataformas Comunitarias con Marcas Comerciales',
    tagline: 'Redes de recetas y contenidos con vinculación a tiendas o líneas de productos propios',
    badge: 'Redes comerciales',
    color: 'teal',
    pricingModel: 'Acceso básico gratuito con venta cruzada o suscripción mensual',
    mainWeakness: 'Carencia de visión multi-ingrediente en tiempo real ni rescate inteligente de nevera. Sin adaptación clínica de micronutrientes por etapa vital.',
    summaryVerdict: 'Enfoque cualitativo básico pero sin motor biométrico avanzado ni independencia respecto a líneas de productos propios.'
  }
];

export const COMPARISON_DIMENSIONS: ComparisonDimension[] = [
  {
    id: 'vision_triple',
    category: 'Tecnología Visual & Escaneo',
    title: '1. Visión Triple Integrada (Plato + Supermercado + Nevera)',
    subtitle: 'La única app que combina 3 motores de visión por IA en una misma experiencia unificada.',
    realMarketProblem: 'El usuario suele requerir múltiples herramientas distintas: una para contar calorías, otra para escanear etiquetas y la memoria para saber qué cocinar con lo que sobra en casa.',
    tunutrilensAdvantage: 'TuNutriLens integra los 3 escáneres en un solo clic:',
    tunutrilensDetails: [
      'Escáner de Plato: Reconoce ingredientes visibles, cocciones y guarniciones estimando gramos y macros.',
      'Escáner de Supermercado: Lee códigos de barras y etiquetas analizando lista de ingredientes y grado de procesamiento.',
      'Cámara de Nevera en Vivo: Enfoca baldas y cajones para detectar alimentos frescos próximos a caducar.'
    ],
    tunutrilensScore: 10,
    competitorScores: {
      traditional: { score: 3, verdict: 'Inexistente en cocina y nevera', details: 'Solo busca textos en buscador o lee códigos de barras. No reconoce platos cocinados por foto con precisión ni tiene modo nevera.' },
      barcode: { score: 4, verdict: 'Solo código de barras', details: 'Estrictamente limitada a envases con código EAN. Cero reconocimiento de comida real en plato o en frigorífico.' },
      generic_ai: { score: 6, verdict: 'Solo foto de plato', details: 'Solo analiza una foto estática de plato con modelos genéricos importados. Sin escáner de supermercado ni detector de nevera.' },
      commercial_brand: { score: 4, verdict: 'Código de barras y fotos manuales', details: 'Sin visión computacional en vivo de estantes ni escaneo automático de nevera.' }
    }
  },
  {
    id: 'fridge_zero_waste',
    category: 'Sostenibilidad & Economía',
    title: '2. Detector de Nevera Anti-Desperdicio (Residuo Cero)',
    subtitle: 'Ahorro económico medible en euros y recetas creativas de aprovechamiento con lo que ya tienes.',
    realMarketProblem: 'En los hogares se tiran cientos de kilos de comida al año (entre 250 € y 300 € por hogar al año según datos oficiales del Ministerio de Agricultura MAPA).',
    tunutrilensAdvantage: 'TuNutriLens convierte tus alimentos disponibles en recetas de rescate saludables:',
    tunutrilensDetails: [
      'Visión por cámara para registrar vegetales, lácteos, carnes y verduras que tienes abiertos.',
      'Generador de recetas de rescate adaptadas a tus ingredientes disponibles en menos de 5 segundos.',
      'Contador en tiempo real de Dinero Ahorrado (€) y Kg de CO2 prevenidos.'
    ],
    tunutrilensScore: 10,
    competitorScores: {
      traditional: { score: 0, verdict: 'No existe', details: 'Ninguna función para gestionar sobras, caducidades ni recetas de despensa.' },
      barcode: { score: 0, verdict: 'No existe', details: 'No interactúa con lo que tienes guardado en casa ni propone recetas de rescate.' },
      generic_ai: { score: 0, verdict: 'No existe', details: 'Centrada exclusivamente en calorías estéticas individuales.' },
      commercial_brand: { score: 2, verdict: 'Recetario estático', details: 'Buscador manual de recetas por texto, pero sin reconocimiento visual de tu nevera ni cálculo de ahorro económico.' }
    }
  },
  {
    id: 'mediterranean_ism',
    category: 'Rigor Nutricional & Salud',
    title: '3. Índice de Salud Mediterránea (ISM 0-100) vs Calorías Vacías',
    subtitle: 'Calidad nutricional real: AOVE, polifenoles, fibra y comida real frente al conteo calórico ciego.',
    realMarketProblem: 'El conteo calórico aislado es biológicamente insuficiente: un producto ultraprocesado bajo en calorías puede tener el mismo número que un plato de lentejas estofadas con verduras y AOVE, pero un impacto metabólico y saciante opuesto.',
    tunutrilensAdvantage: 'Algoritmo clínico basado en evidencia científica mediterránea:',
    tunutrilensDetails: [
      'Puntuación ISM de 0 a 100 ponderando grasas monoinsaturadas (ácido oleico), antioxidantes, fibra fermentable y matriz alimentaria.',
      'Semáforo nutricional visual por colores (verde, ámbar, rojo) para tomar decisiones al instante.',
      'Diferenciación estricta entre carbohidratos complejos / fibra y azúcares libres añadidos.'
    ],
    tunutrilensScore: 10,
    competitorScores: {
      traditional: { score: 2, verdict: 'Ciego a la calidad biológica', details: 'Promueve el modelo numérico donde lo único que importa es no pasarse de calorías, incentivando ultraprocesados light.' },
      barcode: { score: 6, verdict: 'Algoritmos rígidos sin enfoque mediterráneo', details: 'Suele penalizar alimentos grasos cardiosaludables tradicionales (aceite de oliva virgen extra, frutos secos) por su alta densidad calórica natural.' },
      generic_ai: { score: 4, verdict: 'Calorías y macros estándar', details: 'No calcula índices de longevidad ni micronutrientes protectores mediterráneos.' },
      commercial_brand: { score: 7, verdict: 'Clasificación básica', details: 'Distingue comida real y ultraprocesados, pero carece de algoritmo clínico cuantitativo que pondere densidades nutricionales completas.' }
    }
  },
  {
    id: 'additives_safety',
    category: 'Seguridad Alimentaria & Aditivos',
    title: '4. Semáforo Toxicológico de Aditivos (EFSA) y Alérgenos',
    subtitle: 'Evaluación científica independiente de emulsionantes, edulcorantes y conservantes con criterios europeos.',
    realMarketProblem: 'Muchos productos procesados contienen edulcorantes artificiales, emulsionantes industriales o fosfatos que alteran la microbiota y la saciedad.',
    tunutrilensAdvantage: 'Análisis minucioso del listado de ingredientes con alertas claras:',
    tunutrilensDetails: [
      'Identificación de códigos E y nombres comunes con dictámenes de la Autoridad Europea de Seguridad Alimentaria (EFSA).',
      'Distinción entre aditivos inocuos (ácido ascórbico, lecitina) y aditivos controvertidos o potencialmente nocivos para la barrera intestinal.',
      'Detección personalizada de los 14 alérgenos de declaración obligatoria (gluten, lactosa, frutos de cáscara, etc.).'
    ],
    tunutrilensScore: 10,
    competitorScores: {
      traditional: { score: 1, verdict: 'Inexistente', details: 'No analiza aditivos químicos, edulcorantes artificiales ni su impacto en la salud metabólica.' },
      barcode: { score: 7, verdict: 'Lector de aditivos estándar', details: 'Muestra información sobre aditivos pero sin conectarla con el plato cocinado ni con la etapa vital del usuario.' },
      generic_ai: { score: 0, verdict: 'Inexistente', details: 'No tiene lector de aditivos ni de ingredientes químicos europeos.' },
      commercial_brand: { score: 5, verdict: 'Básico', details: 'Menciona ingredientes pero sin fichas toxicológicas detalladas de cada aditivo.' }
    }
  },
  {
    id: 'micronutrients_personalization',
    category: 'Personalización Clínica',
    title: '5. Nutrición Personalizada & Calibración de Micronutrientes',
    subtitle: 'Recomendaciones biológicas dinámicas con cálculo metabólico Mifflin-St Jeor y 10 micronutrientes clave.',
    realMarketProblem: 'La mayoría de aplicaciones aplican una fórmula fija que solo cuenta calorías y macronutrientes básicos, ignorando por completo micronutrientes críticos como hierro, calcio, magnesio o vitamina D.',
    tunutrilensAdvantage: 'Calibración biométrica integral con cálculo metabólico y seguimiento de micronutrientes:',
    tunutrilensDetails: [
      'Cálculo basal y TDEE mediante la fórmula médica de referencia Mifflin-St Jeor.',
      'Seguimiento automático de 10 micronutrientes clave (hierro, calcio, magnesio, B12, zinc, potasio, vitaminas A, C, D).',
      'Alertas de balance nutricional y recomendaciones de alimentos ricos en el nutriente deficitario.'
    ],
    tunutrilensScore: 10,
    competitorScores: {
      traditional: { score: 2, verdict: 'Fórmula fija estándar', details: 'Solo ajusta calorías y reparto de macros según peso y objetivo de peso corporal.' },
      barcode: { score: 0, verdict: 'Sin perfil biológico', details: 'Misma evaluación para cualquier persona sin importar edad o perfil de salud.' },
      generic_ai: { score: 2, verdict: 'Solo modo fitness', details: 'Ajuste de déficit calórico para perder peso o superávit para ganar músculo, sin control de micronutrientes ni vitaminas.' },
      commercial_brand: { score: 3, verdict: 'Planes genéricos', details: 'Sin motor de prescripción de micronutrientes ni cálculo metabólico validado.' }
    }
  },
  {
    id: 'meal_planner_shopping',
    category: 'Planificación & Organización',
    title: '6. Menú Semanal Inteligente + Lista de Compra por Pasillos',
    subtitle: 'Planifica de lunes a domingo y exporta la lista de la compra ordenada por secciones del mercado.',
    realMarketProblem: 'Tener que escribir a mano qué comprar o improvisar los menús diarios causa fatiga de decisión y abandono de los hábitos saludables.',
    tunutrilensAdvantage: 'Sincronización total entre menú, nevera y compra:',
    tunutrilensDetails: [
      'Generación automática con IA de 7 días completos (desayuno, comida, cena y snacks).',
      'Generación instantánea de lista de la compra clasificada por pasillos (Frutería, Carnicería, Pescadería, Despensa, etc.).',
      'Exportación e impresión en PDF limpio para llevar en el móvil o pegar en la nevera.'
    ],
    tunutrilensScore: 10,
    competitorScores: {
      traditional: { score: 3, verdict: 'Muy limitado', details: 'No genera listas de la compra organizadas por pasillos de mercados y supermercados europeos.' },
      barcode: { score: 0, verdict: 'No existe', details: 'No ofrece menús ni listas de compras.' },
      generic_ai: { score: 1, verdict: 'Solo registro reactivo', details: 'Solo sirve para registrar lo que ya comiste, no para planificar tu semana con antelación.' },
      commercial_brand: { score: 6, verdict: 'Menús predefinidos', details: 'Cuenta con menús semanales estáticos, pero menos flexibles y sin integración de sobras de nevera.' }
    }
  },
  {
    id: 'databases_rigor',
    category: 'Fiabilidad Científica',
    title: '7. Bases de Datos Científicas Verificadas (BEDCA / EFSA / USDA)',
    subtitle: 'Cero datos falsos de usuarios. Calibración biométrica y trazabilidad científica garantizada.',
    realMarketProblem: 'Permitir que cualquier usuario introduzca alimentos sin moderación provoca registros inconsistentes y errores garrafales que distorsionan el balance calórico diario.',
    tunutrilensAdvantage: 'Gobernanza de datos científica oficial:',
    tunutrilensDetails: [
      'Datos nutricionales basados en la Base de Datos Española de Composición de Alimentos (BEDCA), CIQUAL y USDA oficial.',
      'Algoritmos de visión computacional calibrados para porciones reales del sur de Europa.',
      'Valores de micronutrientes y oligoelementos validados sin datos basura introducidos por terceros.'
    ],
    tunutrilensScore: 10,
    competitorScores: {
      traditional: { score: 3, verdict: 'Bases comunitarias abiertas', details: 'Millones de registros no verificados con incongruencias que distorsionan el balance diario.' },
      barcode: { score: 6, verdict: 'Datos comunitarios de etiquetado', details: 'Depende de las fotos y datos que suben los usuarios, con errores ocasionales en etiquetado.' },
      generic_ai: { score: 5, verdict: 'Modelos sin fuentes transparentes', details: 'Estimaciones basadas en modelos cerrados sin enlace a fuentes clínicas contrastables.' },
      commercial_brand: { score: 6, verdict: 'Base cerrada propietaria', details: 'Buena base de productos pero con catálogo más acotado y dependiente de productos propios.' }
    }
  },
  {
    id: 'privacy_rgpd',
    category: 'Ética, Privacidad & RGPD',
    title: '8. Privacidad Sanitaria Europea (Art. 9 RGPD) & Cero Rastreadores',
    subtitle: 'Tus datos de salud y peso son privados. No vendemos datos a redes publicitarias ni aseguradoras.',
    realMarketProblem: 'Muchas aplicaciones monetizan los datos de salud compartiendo hábitos, fluctuaciones de peso y rutinas con redes publicitarias externas y data brokers.',
    tunutrilensAdvantage: 'Blindaje europeo estricto:',
    tunutrilensDetails: [
      'Alojamiento en infraestructura con cumplimiento del Art. 9 del Reglamento General de Protección de Datos (RGPD UE 2016/679).',
      'Sin anuncios invasivos ni pop-ups comerciales que entorpezcan la experiencia.',
      'Control total: el usuario puede borrar o exportar su historial clínico en cualquier momento.'
    ],
    tunutrilensScore: 10,
    competitorScores: {
      traditional: { score: 2, verdict: 'Monetización publicitaria', details: 'Monetiza intensamente con publicidad dirigida, cookies de rastreo masivo e historial de brechas de seguridad.' },
      barcode: { score: 8, verdict: 'Independiente sin publicidad', details: 'Buen compromiso en no vender datos y no mostrar anuncios publicitarios invasivos.' },
      generic_ai: { score: 4, verdict: 'Jurisdicciones foráneas', details: 'Sujeta a legislación extranjera sin las garantías del marco estricto europeo de datos de salud.' },
      commercial_brand: { score: 5, verdict: 'Uso comercial interno', details: 'Utiliza los datos de navegación y hábitos para promocionar y vender productos de su propia tienda online.' }
    }
  },
  {
    id: 'pricing_value',
    category: 'Relación Calidad / Precio',
    title: '9. Precio Justo, Transparente y Sin Letra Pequeña',
    subtitle: 'Máximo valor a una fracción del coste de las apps extranjeras.',
    realMarketProblem: 'Muchas apps imponen costes elevados de hasta 79,99 € - 119,99 € al año con tácticas de renovación automática difíciles de cancelar, o planes mensuales desproporcionados.',
    tunutrilensAdvantage: 'Precios competitivos adaptados al mercado español:',
    tunutrilensDetails: [
      'Plan Gratuito real para siempre (5 fotos al mes + acceso a Descubrir y recetas).',
      'Plan Pro desde 4,99 €/mes (59,99 €/año) con informes en PDF y 40 escaneos.',
      'Tarifa Ilimitada a 7,49 €/mes (89,99 €/año) con uso total de los 3 escáneres sin cortes (con Política de Uso Justo de hasta 600 fotos/mes para evitar el uso indiscriminado).',
      'Transparencia total: 7 días de prueba con cancelación garantizada y sin permanencia forzosa.'
    ],
    tunutrilensScore: 10,
    competitorScores: {
      traditional: { score: 4, verdict: 'Coste elevado para ver anuncios', details: 'La versión gratuita está saturada de banners y la versión Premium cuesta hasta 19,99 €/mes o 79,99 €/año.' },
      barcode: { score: 7, verdict: 'Económica pero limitada a envases', details: 'Bajo coste anual, pero circunscrita únicamente al código de barras sin diario ni recetas.' },
      generic_ai: { score: 3, verdict: 'Suscripciones elevadas', details: 'Precios de 9,99 € a 29,99 € al mes con pruebas gratuitas de renovación automática.' },
      commercial_brand: { score: 6, verdict: 'Precio medio', details: 'Alrededor de 4,99 € a 6,99 € al mes o 39,99 € al año por funciones de comunidad y menús estáticos.' }
    }
  }
];

export const EXECUTIVE_BENCHMARK_SUMMARY = {
  title: 'Informe Técnico & Metodológico: TuNutriLens vs Enfoques Tradicionales de Nutrición Digital',
  date: '2026',
  author: 'Equipo de Desarrollo & Nutrición TuNutriLens™',
  totalFeaturesCompared: 9,
  averageScores: {
    tunutrilens: 10.0,
    traditional: 2.3,
    barcode: 4.2,
    generic_ai: 3.1,
    commercial_brand: 4.8
  },
  uniqueDifferentiatorStatement: 'TuNutriLens es la única plataforma del mercado que fusiona Visión Artificial Triple (Plato + Supermercado + Nevera), Dieta Mediterránea basada en densidad nutricional real (ISM), lucha activa contra el Desperdicio Alimentario con ahorro demostrable en euros, y estricto cumplimiento RGPD europeo para datos de salud.'
};
