import React, { useState } from 'react';
import { NavTab } from '../types';
import {
  Camera,
  BookOpen,
  CalendarDays,
  Calendar,
  UtensilsCrossed,
  HeartPulse,
  TrendingUp,
  User,
  HelpCircle,
  X,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ListPlus,
  ShoppingBag,
  Sliders,
  Flame,
  Dumbbell,
  Refrigerator,
  Compass,
  Check,
  Search,
  Zap,
  Target,
  ShieldCheck,
  Award,
  Apple,
  Droplet,
  Layers,
  Scale,
  RefreshCw,
  Clock,
  Euro
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: NavTab) => void;
}

type GuideTab = 'features' | 'tips' | 'quickstart';

interface AppFeature {
  id: string;
  targetTab: NavTab;
  pillar: 'Escáner' | 'Mi Nutrición' | 'Descubrir' | 'Mi Perfil';
  title: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  shortDesc: string;
  whatIsItFor: string;
  howToUseSteps: string[];
  keyTips: string[];
  retentionHook: string;
}

interface EngagementTip {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconBg: string;
  badge: string;
  description: string;
  actionableHabit: string;
  metricBenefit: string;
  suggestedTab?: NavTab;
}

export const AppFunctionsIndexModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [activeGuideTab, setActiveGuideTab] = useState<GuideTab>('features');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPillarFilter, setSelectedPillarFilter] = useState<'Todos' | 'Escáner' | 'Mi Nutrición' | 'Descubrir' | 'Mi Perfil'>('Todos');
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('scanner_dish');

  if (!isOpen) return null;

  // Complete Catalog of Features aligned with recent app updates
  const features: AppFeature[] = [
    {
      id: 'scanner_dish',
      targetTab: 'scanner',
      pillar: 'Escáner',
      title: 'Escáner de Platos con Visión IA',
      badge: 'Escáner Visual',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: Camera,
      iconBg: 'bg-emerald-100 text-emerald-700',
      iconColor: 'text-emerald-700',
      shortDesc: 'Reconocimiento instantáneo de calorías, macros y micronutrientes a partir de una foto a tu comida.',
      whatIsItFor: 'Calcula en segundos el desglose calórico, gramos de proteínas, hidratos, grasas y calidad nutricional de cualquier plato casero o de restaurante sin tener que pesar nada en una báscula.',
      howToUseSteps: [
        'Abre la pestaña "Escáner" en la barra de navegación superior.',
        'Pulsa "📸 Abrir Cámara en Vivo" para enfocar tu plato o "Subir Foto" desde tu galería.',
        'Aplica las 4 Claves: ángulo de 45º, buena luz, plato completo centrado y notas sobre aceites o salsas ocultas.',
        'Revisa el desglose de ingredientes y pulsa "Guardar en el Diario de Hoy" o "📅 Añadir a mi Plan Semanal".'
      ],
      keyTips: [
        'Si el plato lleva un buen chorro de aceite de oliva, usa el gestor manual para sumarle +15g AOVE.',
        'Puedes añadir notas antes del análisis: ej. "Pollo al horno con patatas y media cucharada de alioli".'
      ],
      retentionHook: 'Regla de los 3 segundos: Saca la foto justo antes de dar el primer bocado. Te llevará 3 segundos y tendrás el día bajo control.'
    },
    {
      id: 'ingredients_manager',
      targetTab: 'scanner',
      pillar: 'Escáner',
      title: 'Gestor Manual de Ingredientes (Añadir / Quitar a Mano)',
      badge: 'Precisión 100%',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      icon: ListPlus,
      iconBg: 'bg-amber-100 text-amber-800',
      iconColor: 'text-amber-800',
      shortDesc: 'Suma condimentos no visibles (aceite, salsas, pan) o retira lo que no vayas a comer.',
      whatIsItFor: 'Garantiza precisión matemática del 100%. Cuando la cámara detecta el plato, puedes añadir ingredientes invisibles o ajustar cantidades con botones rápidos (+15g AOVE, +1 Huevo, +Pan).',
      howToUseSteps: [
        'En los resultados del plato escaneado, desplázate hasta "📝 Ingredientes del Plato (Añadir o Quitar a Mano)".',
        'Pulsa en los accesos rápidos (+15g AOVE, +Huevo, +Pan) o escribe cualquier ingrediente a mano con sus gramos.',
        'Para quitar un ingrediente que dejaste en el plato, pulsa el icono de papelera 🗑️ a su lado.',
        'Los totales de calorías y macronutrientes se recalculan matemáticamente al instante.'
      ],
      keyTips: [
        'El aceite de oliva no visible suele sumar entre 120 y 200 kcal; añadirlo a mano es el secreto para que los resultados de peso sean exactos.'
      ],
      retentionHook: 'El ajuste fino te da el control total sin tener que volver a hacer la foto.'
    },
    {
      id: 'scanner_supermarket',
      targetTab: 'scanner',
      pillar: 'Escáner',
      title: 'Supermercado Lens (Semáforo Nutricional Abierto & Grupo NOVA)',
      badge: 'Compra Inteligente',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: ShoppingBag,
      iconBg: 'bg-blue-100 text-blue-700',
      iconColor: 'text-blue-700',
      shortDesc: 'Radiografía de alimentos: Semáforo de salud abierto (5 niveles), semáforo de azúcares/grasas/sal, grupo NOVA y aditivos.',
      whatIsItFor: 'Te protege en el supermercado desenmascarando ultraprocesados trampa mediante el estándar libre de salud pública (FSA / OMS / Ministerio de Sanidad), sin marcas comerciales privadas ni royalties, y con la clasificación científica NOVA (1 a 4).',
      howToUseSteps: [
        'En la pestaña "Escáner", activa el selector de modo "Supermercado Lens".',
        'Fotografía el frontal del envase, la tabla nutricional o el código de barras.',
        'Consulta el Semáforo Global de Salud Abierto (Verde Oscuro a Rojo) y el Semáforo de Nutrientes Críticos (Azúcares, Grasas Sat. y Sal).',
        'Revisa el Grupo NOVA (1 Comida Real a 4 Ultraprocesado) y el listado toxicológico de aditivos EFSA con alternativas saludables recomendadas.'
      ],
      keyTips: [
        'Los productos con semáforo verde o ámbar y NOVA 1 o 2 aportan saciedad prolongada y respetan tu microbiota intestinal.'
      ],
      retentionHook: 'Antes de echar un producto al carrito, dale un escaneo de 2 segundos. Tu cesta será un 40% más sana.'
    },
    {
      id: 'product_duel',
      targetTab: 'scanner',
      pillar: 'Escáner',
      title: 'Duelo de Productos (Comparador Cara a Cara)',
      badge: 'Gamificación',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: Zap,
      iconBg: 'bg-purple-100 text-purple-700',
      iconColor: 'text-purple-700',
      shortDesc: 'Compara dos marcas de yogur, pan o cereales frente a frente para elegir el ganador nutricional.',
      whatIsItFor: 'Resuelve la duda típica del pasillo del súper: ¿cuál de estos dos productos es realmente mejor? Compara azúcares, aditivos, proteínas y calorías para declarar un ganador científico.',
      howToUseSteps: [
        'En el análisis de un producto de supermercado, pulsa "⚔️ Iniciar Duelo de Productos".',
        'Selecciona el segundo producto (de la lista de referencias o escaneando otro).',
        'Observa la comparativa cara a cara con semáforo verde para el ganador.',
        'Descubre cuál aporta más fibra y proteínas con menos aditivos y azúcares añadidos.'
      ],
      keyTips: [
        'Elegir la versión ganadora en productos cotidianos como el yogur o el pan de molde te ahorra kilos de azúcar al año.'
      ],
      retentionHook: 'Jugar al Duelo de Productos en el supermercado transforma una tarea aburrida en un reto adictivo.'
    },
    {
      id: 'zerowaste_fridge',
      targetTab: 'zerowaste',
      pillar: 'Descubrir',
      title: 'Aprovecha tu Nevera & Residuo Cero con IA',
      badge: 'Ahorro 40€/mes',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: Refrigerator,
      iconBg: 'bg-emerald-100 text-emerald-700',
      iconColor: 'text-emerald-700',
      shortDesc: 'Fotografía el interior de tu nevera o despensa y la IA diseñará 3 recetas mediterráneas con lo que tienes.',
      whatIsItFor: 'Evita tirar comida a la basura y ahorra entre 30 € y 50 € al mes. Detecta ingredientes a punto de caducar y te ofrece recetas de chef paso a paso adaptadas a tus metas.',
      howToUseSteps: [
        'Entra en el modo "Aprovecha tu Nevera" (o pulsa en el banner Residuo Cero).',
        'Fotografía los estantes de tu nevera, el cajón de verduras o sobras cocinadas.',
        'La Visión IA marca los alimentos detectados; puedes desmarcar o añadir ingredientes extra a mano.',
        'Pulsa "Proponer 3 Recetas de Aprovechamiento": la IA te dará opciones mediterráneas con trucos de chef.',
        'Añade la receta elegida a tu Diario o al Plan Semanal con un solo toque.'
      ],
      keyTips: [
        'Haz el ritual cada domingo por la tarde antes de hacer la compra semanal para limpiar la nevera y no duplicar compras.'
      ],
      retentionHook: 'El ahorro acumulado se registra en tu calculadora de impacto: ver crecer tu dinero ahorrado fideliza de forma natural.'
    },
    {
      id: 'diary',
      targetTab: 'nutrition',
      pillar: 'Mi Nutrición',
      title: 'Diario Nutricional, Balance de Macros & Agua',
      badge: 'Hábito Diario',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      icon: BookOpen,
      iconBg: 'bg-teal-100 text-teal-700',
      iconColor: 'text-teal-700',
      shortDesc: 'Balance calórico en tiempo real, desglose por tomas (Desayuno, Almuerzo, Cena, Snacks) e hidratación.',
      whatIsItFor: 'Te muestra con exactitud cuántas calorías y proteínas te quedan para completar tu objetivo del día sin pasar hambre, con advertencias inteligentes si te excedes de grasas o azúcares.',
      howToUseSteps: [
        'Entra en "Mi Nutrición" > subpestaña "Diario".',
        'Consulta el resumen acumulado de hoy: calorías consumidas vs objetivo metabólico.',
        'Registra tu consumo de agua mediante los vasos interactivos (meta recomendada: 2.000 ml).',
        'Edita o ajusta gramos de cualquier comida pulsando sobre su tarjeta.'
      ],
      keyTips: [
        'Navega con las flechas a días anteriores para ver patrones de constancia y balance semanal.'
      ],
      retentionHook: 'Comprobar tu balance de calorías y macros antes de cenar te quita la ansiedad y te permite saber si puedes darte un capricho saludable.'
    },
    {
      id: 'streak_gamification',
      targetTab: 'nutrition',
      pillar: 'Mi Nutrición',
      title: 'Racha Diaria (Streak) & Medallas de Constancia',
      badge: 'Fidelización 🔥',
      badgeColor: 'bg-orange-100 text-orange-900 border-orange-200',
      icon: Flame,
      iconBg: 'bg-orange-100 text-orange-700',
      iconColor: 'text-orange-700',
      shortDesc: 'Mantén encendida la llama de días consecutivos y sube de rango: Bronce, Plata, Oro y Diamante.',
      whatIsItFor: 'Premia tu disciplina diaria. La psicología del hábito demuestra que mantener una racha visible activa los circuitos de recompensa y multiplica por 3 la probabilidad de éxito a largo plazo.',
      howToUseSteps: [
        'Registra al menos 1 comida o escaneo al día para que el fuego 🔥 de tu racha se mantenga activo.',
        'Observa en la cabecera de "Diario" tu contador de días consecutivos y tu medalla actual.',
        'Alcanza hitos: 3 días (Iniciación), 7 días (Hábito Bronce), 14 días (Maestro Plata) y 30 días (Diamante).'
      ],
      keyTips: [
        'Si un día no puedes escanear un plato completo, anota un snack rápido o un café para no romper la racha.'
      ],
      retentionHook: '¡No dejes que se apague la llama! Romper una racha de 10 días duele; mantenerla te llena de orgullo.'
    },
    {
      id: 'weeklyPlan',
      targetTab: 'nutrition',
      pillar: 'Mi Nutrición',
      title: 'Plan Semanal (28 Comidas L-D) & Lista de Compra',
      badge: 'Planificación Total',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: CalendarDays,
      iconBg: 'bg-blue-100 text-blue-700',
      iconColor: 'text-blue-700',
      shortDesc: 'Menú estructurado de Lunes a Domingo, metas macros/micros personalizadas y lista de compra interactiva.',
      whatIsItFor: 'Elimina el estrés de "¿qué como hoy?". Planifica los 7 días con recetas mediterráneas equilibradas, re-genera el menú con IA según tus objetivos y genera la lista de la compra automáticamente.',
      howToUseSteps: [
        'Entra en "Mi Nutrición" > subpestaña "Plan Semanal".',
        'Pulsa "Modificar Macros & Micros" para fijar tus calorías, proteínas, calcio, hierro y vitamina D.',
        'Pulsa "Re-Generar con IA" para recalibrar los 7 días según tus nuevas metas.',
        'Pulsa "Cambiar" en cualquier comida para sustituirla o añade platos directamente desde el Escáner.',
        'Abre la "Lista de la Compra Semanal" y tacha los productos en el supermercado con las casillas de verificación.'
      ],
      keyTips: [
        'La lista de la compra agrupa los ingredientes por pasillo (Frutería, Carnicería, Pescadería, Despensa) para que hagas la compra en la mitad de tiempo.'
      ],
      retentionHook: 'Tener la semana organizada el domingo te ahorra horas de cocina y evita pedir comida basura por cansancio.'
    },
    {
      id: 'mediterranean_recipes',
      targetTab: 'explore',
      pillar: 'Descubrir',
      title: 'Catálogo de Platos Mediterráneos & Recetas Saludables',
      badge: 'Cocina Real',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: UtensilsCrossed,
      iconBg: 'bg-emerald-100 text-emerald-700',
      iconColor: 'text-emerald-700',
      shortDesc: 'Recetario mediterráneo equilibrado: tiempos, ingredientes, macros detallados y botón para añadir a tu día.',
      whatIsItFor: 'Te inspira a comer comida real deliciosa y variada sin recurrir a dietas aburridas. Cada plato incluye calorías, gramos de proteínas, hidratos, grasas saludables (AOVE) y fibra, con la posibilidad de incorporarlo al Diario o al Plan Semanal en un solo clic.',
      howToUseSteps: [
        'Accede a "Descubrir" en la barra de navegación.',
        'Explora las tarjetas de platos con foto real o filtra por categorías (Ensaladas, Legumbres, Pescados, Bowls, Cenas Ligeras).',
        'Toca en cualquier receta para ver ingredientes al gramo, modo de preparación y beneficios nutricionales.',
        'Pulsa "Añadir a mi Diario de Hoy" o "Añadir a mi Plan Semanal" para computarlo automáticamente.'
      ],
      keyTips: [
        'Los platos con alta densidad de legumbres y verduras aportan fibra prebiótica que equilibra la glucemia durante horas.'
      ],
      retentionHook: 'Cuando no sepas qué cocinar, abre Descubrir: en 10 segundos tienes una idea sana y apetecible.'
    },
    {
      id: 'seasonal_calendar',
      targetTab: 'explore',
      pillar: 'Descubrir',
      title: 'Guía de Temporada Mediterránea (Productos de Cercanía en España)',
      badge: 'Sabor & Ahorro',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      icon: Calendar,
      iconBg: 'bg-teal-100 text-teal-700',
      iconColor: 'text-teal-700',
      shortDesc: 'Guía mes a mes (Enero a Diciembre) de verduras, legumbres, frutas y pescados locales en su punto óptimo.',
      whatIsItFor: 'Comprar producto de temporada en España garantiza hasta un 30% más de vitaminas y antioxidantes, alimentos con el mejor sabor natural y un ahorro de hasta el 40% en tu cesta de la compra.',
      howToUseSteps: [
        'Accede a "Descubrir" y selecciona el botón "Guía de Temporada Mediterránea".',
        'Elige el mes del año (Enero a Diciembre) en la barra interactiva superior.',
        'Filtra entre Hojas Verdes & Verduras, Frutos Secos & Legumbres, Frutas o Pescados & Mariscos de cercanía.',
        'Consulta las propiedades de cada alimento y el consejo culinario del mes.'
      ],
      keyTips: [
        'Los cítricos en invierno y los tomates/frutas de hueso en verano aportan los antioxidantes exactos que tu cuerpo necesita en cada estación.'
      ],
      retentionHook: 'Descubre cada primero de mes qué alimentos entran en temporada y dale variedad a tu despensa al mejor precio.'
    },
    {
      id: 'scientific_references',
      targetTab: 'profile',
      pillar: 'Descubrir',
      title: 'Directorio de Fuentes Científicas Oficiales (100% Dominio Público)',
      badge: 'Evidencia Abierta',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: ShieldCheck,
      iconBg: 'bg-indigo-100 text-indigo-700',
      iconColor: 'text-indigo-700',
      shortDesc: 'Bases de datos bromatológicas públicas (BEDCA, USDA FoodData, EFSA, OMS, FAO, NOVA, PREDIMED).',
      whatIsItFor: 'Garantiza la máxima transparencia y rigor científico. TuNutriLens se nutre exclusivamente de organismos públicos y consensos médicos Open Access bajo licencias libres de reutilización del sector público, sin algoritmos opacos ni sesgos comerciales.',
      howToUseSteps: [
        'En "Mi Perfil" o desde el pie de página de la app, pulsa en "Fuentes y Referencias Científicas".',
        'Consulta las 11 entidades oficiales integradas con sus citas bibliográficas formales.',
        'Comprueba los enlaces oficiales a BEDCA (Ministerio de Sanidad de España), USDA FoodData Central y dictámenes EFSA.'
      ],
      keyTips: [
        'Toda la calibración energética y micronutrientes se basa en química analítica verificada por agencias sanitarias gubernamentales.'
      ],
      retentionHook: 'Come con la tranquilidad de saber que cada dato está respaldado por la ciencia pública oficial.'
    },
    {
      id: 'progress_evolution',
      targetTab: 'nutrition',
      pillar: 'Mi Nutrición',
      title: 'Progreso, Curva de Peso & Exportación Médica',
      badge: 'Evolución',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: TrendingUp,
      iconBg: 'bg-indigo-100 text-indigo-700',
      iconColor: 'text-indigo-700',
      shortDesc: 'Registro de peso matutino, gráfico de tendencia y exportación de informe para tu médico o nutricionista.',
      whatIsItFor: 'Monitoriza tu evolución corporal sin obsesión, comparando tu peso actual con tu meta y generando informes clínicos estructurados para compartir por WhatsApp o PDF con profesionales de la salud.',
      howToUseSteps: [
        'Entra en "Mi Nutrición" > subpestaña "Progreso".',
        'Introduce tu peso actual en kg y la fecha.',
        'Observa la curva de evolución y el porcentaje completado hacia tu objetivo.',
        'Pulsa "Exportar Informe Médico Semanal" para generar un resumen con macros, adherencia y observaciones.'
      ],
      keyTips: [
        'Pésate 1 o 2 veces por semana por la mañana en ayunas tras ir al baño; las fluctuaciones diarias de líquidos son completamente normales.'
      ],
      retentionHook: 'Ver la curva descendente (o de masa muscular) confirma que tu esfuerzo está dando resultados tangibles.'
    },
    {
      id: 'profile_metabolic',
      targetTab: 'profile',
      pillar: 'Mi Perfil',
      title: 'Mi Perfil, Cálculo Metabólico & Privacidad RGPD',
      badge: 'Calibración',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
      icon: User,
      iconBg: 'bg-slate-100 text-slate-700',
      iconColor: 'text-slate-700',
      shortDesc: 'Cálculo de TMB y Gasto Total TDEE (Mifflin-St Jeor), alergias, intolerancias y descarga de datos de salud RGPD.',
      whatIsItFor: 'Es el motor de cálculo de toda la app. Define tus necesidades calóricas exactas según tu edad, sexo, estatura, peso y nivel de actividad física, y protege tus datos bajo la normativa europea RGPD Art. 20.',
      howToUseSteps: [
        'Accede a "Mi Perfil" en la barra superior.',
        'Configura tu estatura, peso, edad, nivel de actividad física y meta principal.',
        'Pulsa "Calcular Macros Automáticamente" para aplicar la fórmula médica recomendada.',
        'Descarga tus datos de salud en formato JSON en el apartado RGPD cuando lo desees.'
      ],
      keyTips: [
        'Actualiza tu peso en el perfil cada mes para que las calorías objetivo se reajusten conforme disminuya tu masa grasa.'
      ],
      retentionHook: 'Tus objetivos no son inventados: se basan en fórmulas fisiológicas exactas con respaldo científico.'
    },
    {
      id: 'market_comparison',
      targetTab: 'scanner',
      pillar: 'Descubrir',
      title: 'Estudio Comparativo de Mercado & Diferenciación Real',
      badge: 'Auditoría 2026',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      icon: Scale,
      iconBg: 'bg-amber-100 text-amber-800',
      iconColor: 'text-amber-800',
      shortDesc: 'Informe técnico descargable: TuNutriLens vs enfoques tradicionales (contadores, lectores aislados y apps foráneas).',
      whatIsItFor: 'Compara con datos objetivos y rigor metodológico por qué TuNutriLens supera técnica y clínicamente a los contadores calóricos tradicionales (búsqueda manual y publicidad), a los lectores de código de barras aislados y a las apps de dietas foráneas, ofreciendo la única solución 3 en 1.',
      howToUseSteps: [
        'En la pestaña "Escáner", pulsa en el botón "🏆 Estudio Comparativo de Mercado".',
        'Filtra por categorías: vs Contadores Calóricos, vs Lectores de Envases, vs Apps IA Foráneas o vs Redes Comerciales.',
        'Despliega las 9 dimensiones críticas para leer el análisis técnico detallado.',
        'Pulsa "Descargar Informe (.md)" o "Imprimir / Guardar PDF" para consultarlo en tu dispositivo.'
      ],
      keyTips: [
        'Ninguna otra app integra a la vez plato cocinado, escáner de supermercado y rescate de nevera anti-desperdicio con ahorro medible en euros.'
      ],
      retentionHook: 'Conoce el valor real y la tecnología que tienes en tus manos frente a las herramientas antiguas.'
    }
  ];

  // 7 Engagement & Habit-building Tips
  const engagementTips: EngagementTip[] = [
    {
      id: 'tip_3seconds',
      title: '1. La Regla de los 3 Segundos ("Foto antes del primer bocado")',
      subtitle: 'Elimina la fricción: Olvídate de pesar comida en básculas',
      icon: Camera,
      iconBg: 'bg-emerald-100 text-emerald-700',
      badge: 'Hábito Clave',
      description: 'El mayor motivo de abandono en las apps de nutrición tradicionales es tener que pesar cada ingrediente o buscar en listas eternas. Con TuNutriLens, simplemente saca el móvil y haz la foto antes de empezar a comer. En 3 segundos el plato queda registrado y tú disfrutas de tu comida sin estrés.',
      actionableHabit: 'Deja el móvil en la mesa con la app en modo Escáner antes de sentarte a comer. Foto y listo.',
      metricBenefit: 'Aumenta la adherencia al registro en un +85% respecto al registro manual con báscula.',
      suggestedTab: 'scanner'
    },
    {
      id: 'tip_streak',
      title: '2. El Poder de la Racha Diaria (Mantén Viva la Llama 🔥)',
      subtitle: 'La psicología del compromiso diario',
      icon: Flame,
      iconBg: 'bg-orange-100 text-orange-700',
      badge: 'Fidelización 🔥',
      description: 'Una racha visible activa tu sentido del logro. Registrar al menos 1 comida al día durante 7 días consecutivos fija un hábito neuronal sólido. Tu cerebro no querrá ver apagada la llama que tanto te ha costado construir.',
      actionableHabit: 'Si un día comes fuera y olvidas hacer foto, entra al Diario y registra un vaso de agua o una manzana para salvar tu racha del día.',
      metricBenefit: 'Los usuarios con racha de 14+ días tienen 4 veces más probabilidades de alcanzar su peso objetivo.',
      suggestedTab: 'nutrition'
    },
    {
      id: 'tip_supermarket_duel',
      title: '3. El Duelo del Supermercado (Gamifica tu Compra)',
      subtitle: 'Convierte el pasillo del súper en un reto divertido',
      icon: Zap,
      iconBg: 'bg-purple-100 text-purple-700',
      badge: 'Compra Inteligente',
      description: '¿No sabes si comprar el yogur con proteínas de marca A o el kéfir de marca B? Inicia un Duelo de Productos con el escáner. Descubrirás al instante cuál esconde almidones modificados o azúcares añadidos.',
      actionableHabit: 'Haz al menos 1 duelo en cada visita al supermercado. Te sorprenderá cómo productos con envoltorio "healthy" pierden frente a opciones tradicionales.',
      metricBenefit: 'Evita una media de 12 a 18 kg de azúcar añadido al año en tu despensa familiar.',
      suggestedTab: 'scanner'
    },
    {
      id: 'tip_aove_secret',
      title: '4. El Secreto del Gestor de Ingredientes (+15g AOVE)',
      subtitle: 'La diferencia entre estancarte y ver resultados',
      icon: ListPlus,
      iconBg: 'bg-amber-100 text-amber-700',
      badge: 'Precisión Pro',
      description: 'El aceite de oliva virgen extra es el corazón de la dieta mediterránea, pero es invisible a la vista de una cámara y aporta 9 kcal por gramo. Un generoso chorro de aceite puede sumar 150-200 kcal que no ves.',
      actionableHabit: 'Tras escanear una ensalada o carne a la plancha, pulsa el botón rápido "+15g AOVE" en el gestor manual de ingredientes para un cómputo 100% fiel a la realidad.',
      metricBenefit: 'Elimina el margen de error calórico invisible, principal causa del temido efecto meseta.',
      suggestedTab: 'scanner'
    },
    {
      id: 'tip_sunday_zerowaste',
      title: '5. El Ritual del Domingo Residuo Cero (Ahorra 40 € al Mes)',
      subtitle: 'Cocina inteligente y economía doméstica',
      icon: Refrigerator,
      iconBg: 'bg-emerald-100 text-emerald-700',
      badge: 'Ahorro Real',
      description: 'Tirar verduras mustias, yogures caducados o sobras de pollo es dinero tirado a la basura. Cada domingo antes de planificar tu semana, abre "Aprovecha tu Nevera", fotografía lo que tengas y deja que el Chef IA te dé una cena deliciosa de aprovechamiento.',
      actionableHabit: 'Domingos a las 19:00: Foto a los estantes de la nevera. Cena lista y nevera despejada para la semana.',
      metricBenefit: 'Ahorro medio comprobado de 35 a 50 € al mes por hogar en desperdicio evitado.',
      suggestedTab: 'zerowaste'
    },
    {
      id: 'tip_water_metabolism',
      title: '6. El Hidratómetro Matutino (Activa tu Metabolismo)',
      subtitle: 'Energía limpia desde primera hora',
      icon: Droplet,
      iconBg: 'bg-blue-100 text-blue-700',
      badge: 'Vitalidad',
      description: 'Tras 8 horas de sueño, tu cuerpo se despierta deshidratado. Beber dos vasos de agua antes del café activa el tránsito intestinal, mejora la concentración y reduce el hambre impulsiva.',
      actionableHabit: 'Nada más levantarte, bebe un vaso de agua y márcalo en el contador de agua del Diario. Empezarás el día sumando puntos.',
      metricBenefit: 'Mejora la digestión y reduce la retención de líquidos desde la primera semana.',
      suggestedTab: 'nutrition'
    },
    {
      id: 'tip_smart_list',
      title: '7. Compra con la Lista Inteligente (Escudo Anti-Ultraprocesados)',
      subtitle: 'No vayas al súper con hambre ni sin lista',
      icon: ShoppingBag,
      iconBg: 'bg-teal-100 text-teal-700',
      badge: 'Disciplina',
      description: 'El Plan Semanal genera tu lista de la compra clasificada por secciones de mercado. Cuando vayas al súper, abre la lista en el móvil y tacha con casillas de verificación. Si un producto no está en la lista, no entra en el carro.',
      actionableHabit: 'Lleva la app abierta mientras recorres los pasillos y tacha en verde los alimentos conforme los coges.',
      metricBenefit: 'Reduce el tiempo de compra en un 50% y elimina los antojos ultraprocesados de caja.',
      suggestedTab: 'weeklyPlan'
    }
  ];

  // Filtering features
  const filteredFeatures = features.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.whatIsItFor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.pillar.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPillar =
      selectedPillarFilter === 'Todos' || f.pillar === selectedPillarFilter;

    return matchesSearch && matchesPillar;
  });

  const activeFeature = features.find((f) => f.id === selectedFeatureId) || features[0];

  const handleNavigate = (tab: NavTab) => {
    onClose();
    onNavigateToTab(tab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex items-start justify-between gap-4 border-b border-emerald-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-amber-300 shrink-0 shadow-inner">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  Guía Oficial de TuNutriLens
                </h2>
                <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-md uppercase tracking-wide shadow-2xs">
                  Versión Actual 2026
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5 font-medium leading-relaxed">
                Guía completa paso a paso con las funciones y herramientas reales de la app: Escáner visual, Supermercado con Semáforo Abierto, Nevera Anti-Desperdicio, Diario y Planificación.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Cerrar guía"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Main Tabs: Features Map, Engagement Tips, Quickstart */}
        <div className="bg-slate-100 p-2 sm:px-6 sm:py-2.5 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveGuideTab('features')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeGuideTab === 'features'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-white hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Mapa de Funciones</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono">
                {features.length}
              </span>
            </button>

            <button
              onClick={() => setActiveGuideTab('tips')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeGuideTab === 'tips'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-700 hover:bg-white hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-900" />
              <span>Tips para Engancharte</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/15 text-slate-950 font-bold">
                7 Claves
              </span>
            </button>

            <button
              onClick={() => setActiveGuideTab('quickstart')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeGuideTab === 'quickstart'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-white hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Ruta Rápida (3 min)</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-500 font-medium hidden md:inline">
            Guía oficial actualizada
          </span>
        </div>

        {/* TAB 1: FEATURES MAP */}
        {activeGuideTab === 'features' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search & Pillar Filters */}
            <div className="p-3 sm:px-6 sm:py-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar función, ej: AOVE, racha, nevera..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              {/* Segmented Pillars Filter */}
              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto no-scrollbar">
                {(['Todos', 'Escáner', 'Mi Nutrición', 'Descubrir', 'Mi Perfil'] as const).map((pillar) => (
                  <button
                    key={pillar}
                    onClick={() => setSelectedPillarFilter(pillar)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                      selectedPillarFilter === pillar
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pillar}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Screen: Feature List on Left, Deep Detail on Right */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[380px]">
              
              {/* Left Column: Feature Items */}
              <div className="md:col-span-5 border-r border-slate-200 overflow-y-auto p-3 space-y-2 bg-slate-50/60">
                {filteredFeatures.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    No se encontraron funciones para "{searchTerm}". Prueba con otro término.
                  </div>
                ) : (
                  filteredFeatures.map((feat) => {
                    const Icon = feat.icon;
                    const isSelected = selectedFeatureId === feat.id;

                    return (
                      <button
                        key={feat.id}
                        onClick={() => setSelectedFeatureId(feat.id)}
                        className={`w-full p-3 rounded-2xl text-left transition-all border flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-white text-slate-900 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                            : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl shrink-0 ${feat.iconBg}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-black truncate">{feat.title}</span>
                            <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              {feat.pillar}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-medium">
                            {feat.shortDesc}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Right Column: Detailed View */}
              <div className="md:col-span-7 p-4 sm:p-6 overflow-y-auto space-y-5 bg-white">
                {/* Feature Header */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3.5 rounded-2xl ${activeFeature.iconBg} shadow-2xs`}>
                      <activeFeature.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-md border ${activeFeature.badgeColor}`}>
                          {activeFeature.badge}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          Pilar: <strong>{activeFeature.pillar}</strong>
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                        {activeFeature.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => handleNavigate(activeFeature.targetTab)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
                  >
                    <span>Ir a esta función</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* ¿Para qué sirve? */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>¿Para qué sirve y qué beneficios te aporta?</span>
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 font-medium">
                    {activeFeature.whatIsItFor}
                  </p>
                </div>

                {/* ¿Cómo usarla paso a paso? */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Pasos sencillos para usarla hoy mismo:</span>
                  </h4>
                  <div className="space-y-1.5">
                    {activeFeature.howToUseSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs"
                      >
                        <span className="w-5 h-5 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-black text-[11px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="font-medium">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Secretos de Nutricionista */}
                {activeFeature.keyTips.length > 0 && (
                  <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-1 text-xs">
                    <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1">
                      <span>💡 Consejo Práctico de Nutricionista:</span>
                    </span>
                    <ul className="space-y-1 text-amber-950 font-medium pt-0.5">
                      {activeFeature.keyTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-700 font-bold">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Retention Hook Callout */}
                <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-950">
                  <Zap className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-emerald-900 block text-[11px] uppercase tracking-wide">
                      Tip para fidelizar tu hábito:
                    </span>
                    <span className="font-medium text-[11px] text-emerald-900/90">
                      {activeFeature.retentionHook}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ENGAGEMENT TIPS (Tips para Engancharte & Fidelizar) */}
        {activeGuideTab === 'tips' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50">
            {/* Intro Hero */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 p-5 rounded-3xl shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 text-slate-950 animate-bounce-short" />
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  7 Hábitos Clave para Engancharte y No Abandonar Jamás
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-950/90 leading-relaxed max-w-2xl">
                La constancia vence al talento. Con estos 7 micro-hábitos respaldados por la psicología del comportamiento, conseguirás que cuidarte sea tan automático como lavarte los dientes.
              </p>
            </div>

            {/* List of 7 Engagement Tips Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {engagementTips.map((tip) => {
                const Icon = tip.icon;
                return (
                  <div
                    key={tip.id}
                    className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-xl shrink-0 ${tip.iconBg}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-black text-[10px] rounded-md border border-amber-200 uppercase">
                            {tip.badge}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-sm font-black text-slate-900 leading-snug">
                        {tip.title}
                      </h4>
                      <p className="text-[11px] font-bold text-emerald-700">
                        {tip.subtitle}
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {tip.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-500 block">
                          Micro-Acción de hoy:
                        </span>
                        <p className="text-slate-800 font-bold text-xs leading-snug">
                          👉 {tip.actionableHabit}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-1">
                        <span className="text-emerald-700">✓ {tip.metricBenefit}</span>
                        {tip.suggestedTab && (
                          <button
                            onClick={() => handleNavigate(tip.suggestedTab!)}
                            className="text-xs font-black text-slate-900 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                          >
                            <span>Probar</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: QUICKSTART (Ruta Rápida de 3 Minutos) */}
        {activeGuideTab === 'quickstart' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-white">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-900 font-black text-xs rounded-full uppercase tracking-wider inline-block">
                Onboarding Exprés
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Tu Ruta del Éxito en 3 Pasos Sencillos
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Solo necesitas 3 minutos para calibrar tu cuenta y sentir el impacto de la inteligencia visual.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {/* Paso 1 */}
              <div className="p-5 bg-gradient-to-b from-emerald-50/80 to-white rounded-3xl border-2 border-emerald-200/80 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
                    1
                  </div>
                  <h4 className="text-sm font-black text-slate-900">Calibra tus Metas</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Entra en <strong>Mi Perfil</strong> y anota tu edad, peso, estatura y actividad. Nuestro algoritmo Mifflin-St Jeor calculará tu meta calórica exacta.
                  </p>
                </div>
                <button
                  onClick={() => handleNavigate('profile')}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Ir a Mi Perfil (1 min)</span>
                </button>
              </div>

              {/* Paso 2 */}
              <div className="p-5 bg-gradient-to-b from-amber-50/80 to-white rounded-3xl border-2 border-amber-200/80 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-sm">
                    2
                  </div>
                  <h4 className="text-sm font-black text-slate-900">Haz tu Primer Escaneo</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Haz una foto a lo que vas a comer hoy. Verás el desglose instantáneo de proteínas, hidratos y grasas con evaluación de calidad nutricional.
                  </p>
                </div>
                <button
                  onClick={() => handleNavigate('scanner')}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Escanear Ahora (30 seg)</span>
                </button>
              </div>

              {/* Paso 3 */}
              <div className="p-5 bg-gradient-to-b from-teal-50/80 to-white rounded-3xl border-2 border-teal-200/80 shadow-xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-black flex items-center justify-center text-sm shadow-sm">
                    3
                  </div>
                  <h4 className="text-sm font-black text-slate-900">Revisa tu Balance</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Abre el <strong>Diario</strong> y mira cómo se enciende tu racha 🔥. Comprueba cuánto margen te queda para la cena y registra tu agua.
                  </p>
                </div>
                <button
                  onClick={() => handleNavigate('nutrition')}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Ver Mi Diario (30 seg)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Guía siempre disponible pulsando el botón <strong>«Guía»</strong> en la barra superior.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-black rounded-xl transition cursor-pointer flex-1 sm:flex-none text-center"
            >
              Cerrar
            </button>
            <button
              onClick={() => handleNavigate(activeFeature.targetTab)}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer flex-1 sm:flex-none"
            >
              <span>Abrir "{activeFeature.title.split('(')[0].trim()}"</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
