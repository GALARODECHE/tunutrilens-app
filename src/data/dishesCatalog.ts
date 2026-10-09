export interface RecommendedDish {
  id: string;
  dishName: string;
  description: string;
  mealType: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack';
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  prepTimeMinutes: number;
  ingredients: string[];
  safeForRestrictions: boolean;
  tag?: 'Alto en Proteína' | 'Bajo en Calorías' | 'Rápido' | 'Vegetariano' | 'Keto' | 'Mediterráneo' | 'Aprovechamiento' | 'Supermercado' | 'Personalizado' | 'Libre';
}

// -------------------------------------------------------------
// CATÁLOGO DE PLATOS SENCILLES Y 100% DIETA MEDITERRÁNEA
// Basado en ingredientes habituales de supermercado español
// -------------------------------------------------------------

export const DESAYUNOS_CATALOG: RecommendedDish[] = [
  {
    id: 'des_1',
    dishName: 'Tostada de Pan con Tomate Rallado y Aceite de Oliva Virgen Extra',
    description: 'El clásico desayuno español: pan de barra o pueblo tostado con tomate natural frotado y un buen chorro de AOVE.',
    mealType: 'Desayuno',
    calories: 280,
    proteinGrams: 7,
    carbsGrams: 35,
    fatGrams: 12,
    prepTimeMinutes: 5,
    ingredients: ['1 rebanada de pan de pueblo o barra (60g)', '1 tomate maduro rallado', '10ml aceite de oliva virgen extra', 'Pizca de sal'],
    safeForRestrictions: true,
    tag: 'Mediterráneo'
  },
  {
    id: 'des_2',
    dishName: 'Tostada con Tomate, AOVE y Jamón Serrano Magro',
    description: 'Tostada tradicional de la dieta mediterránea cargada de sabor y proteína de gran calidad.',
    mealType: 'Desayuno',
    calories: 350,
    proteinGrams: 18,
    carbsGrams: 34,
    fatGrams: 15,
    prepTimeMinutes: 5,
    ingredients: ['1 rebanada de pan artesanal (60g)', '1 tomate rallado', '35g jamón serrano magro', '8ml aceite de oliva virgen extra'],
    safeForRestrictions: true,
    tag: 'Alto en Proteína'
  },
  {
    id: 'des_3',
    dishName: 'Tortilla Francesa de 2 Huevos con Pavo y Tomate Picado',
    description: 'Tortilla jugosa recién hecha acompañada de rodajas de tomate aliñado con orégano y aceite de oliva.',
    mealType: 'Desayuno',
    calories: 290,
    proteinGrams: 22,
    carbsGrams: 5,
    fatGrams: 20,
    prepTimeMinutes: 8,
    ingredients: ['2 huevos frescos de corral', '40g pechuga de pavo en lonchas', '1 tomate mediano', '5ml aceite de oliva virgen extra'],
    safeForRestrictions: true,
    tag: 'Alto en Proteína'
  },
  {
    id: 'des_4',
    dishName: 'Yogur Natural con Nueces y Plátano en Rodajas',
    description: 'Yogur natural de toda la vida sin azúcar con trozos de fruta de temporada y nueces crudas.',
    mealType: 'Desayuno',
    calories: 270,
    proteinGrams: 11,
    carbsGrams: 32,
    fatGrams: 11,
    prepTimeMinutes: 3,
    ingredients: ['125g yogur natural o griego', '1 plátano pequeño', '15g nueces peladas'],
    safeForRestrictions: true,
    tag: 'Rápido'
  },
  {
    id: 'des_5',
    dishName: 'Tostada con Requesón Fresco, Nueces y un Hilo de Miel',
    description: 'Opción dulce equilibrada utilizando requesón o queso fresco suave de supermercado.',
    mealType: 'Desayuno',
    calories: 310,
    proteinGrams: 15,
    carbsGrams: 36,
    fatGrams: 11,
    prepTimeMinutes: 5,
    ingredients: ['1 rebanada de pan de molde integral o barra (50g)', '70g requesón fresco', '12g nueces', '8g miel pura'],
    safeForRestrictions: true,
    tag: 'Mediterráneo'
  },
  {
    id: 'des_6',
    dishName: 'Huevos Revueltos con Champiñones y Tostada de Pan',
    description: 'Revuelto caliente en sartén con champiñones cortados al ajillo y pan integral.',
    mealType: 'Desayuno',
    calories: 310,
    proteinGrams: 19,
    carbsGrams: 24,
    fatGrams: 15,
    prepTimeMinutes: 10,
    ingredients: ['2 huevos de corral', '80g champiñones laminados', '1 rebanada de pan integral (40g)', '1 diente de ajo', 'AOVE'],
    safeForRestrictions: true,
    tag: 'Vegetariano'
  },
  {
    id: 'des_7',
    dishName: 'Tostada de Atún con Rodajas de Tomate y Orégano',
    description: 'Tostada muy rápida y saciante con lata de atún al natural o en aceite de oliva escurrido.',
    mealType: 'Desayuno',
    calories: 320,
    proteinGrams: 23,
    carbsGrams: 28,
    fatGrams: 12,
    prepTimeMinutes: 4,
    ingredients: ['1 rebanada de pan de barra (50g)', '1 lata de atún claro (52g escurrido)', '1 tomate en rodajas', 'Orégano y AOVE'],
    safeForRestrictions: true,
    tag: 'Rápido'
  },
  {
    id: 'des_8',
    dishName: 'Tostada con Aguacate en Láminas y Huevo Duro',
    description: 'Medio aguacate maduro chafado sobre pan tostado con huevo cocido en rodajas y sal en escamas.',
    mealType: 'Desayuno',
    calories: 340,
    proteinGrams: 14,
    carbsGrams: 28,
    fatGrams: 19,
    prepTimeMinutes: 7,
    ingredients: ['1 rebanada de pan de masa madre o rústico (50g)', '1/2 aguacate maduro', '1 huevo duro', 'AOVE y sal'],
    safeForRestrictions: true,
    tag: 'Mediterráneo'
  },
  {
    id: 'des_9',
    dishName: 'Copos de Avena Tradicionales Cocidos en Leche con Canela y Manzana',
    description: 'Avena cocida en cazo con leche de toda la vida, canela en rama y trozos de manzana dulce.',
    mealType: 'Desayuno',
    calories: 320,
    proteinGrams: 12,
    carbsGrams: 52,
    fatGrams: 6,
    prepTimeMinutes: 8,
    ingredients: ['40g copos de avena integrales', '200ml leche entera o semidesnatada', '1 manzana picada', 'Canela en polvo'],
    safeForRestrictions: true,
    tag: 'Vegetariano'
  },
  {
    id: 'des_10',
    dishName: 'Tostada de Queso Manchego Semicurado y Tomate Rallado',
    description: 'Sabor tradicional español combinando queso manchego de calidad con tomate fresco sobre pan tostado.',
    mealType: 'Desayuno',
    calories: 330,
    proteinGrams: 16,
    carbsGrams: 26,
    fatGrams: 17,
    prepTimeMinutes: 4,
    ingredients: ['1 rebanada de pan de barra (50g)', '35g queso manchego semicurado', '1/2 tomate rallado', 'Unos hilos de AOVE'],
    safeForRestrictions: true,
    tag: 'Mediterráneo'
  },
  // Variaciones ricas mediterráneas de desayunos
  ...Array.from({ length: 90 }).map((_, i) => {
    const list = [
      { name: 'Tostada con Lomo Embuchado y Tomate Rallado', cal: 310, p: 20, c: 28, f: 12, t: 'Alto en Proteína', ing: ['1 tostada pan de barra', '35g lomo embuchado', '1/2 tomate rallado', 'AOVE'] },
      { name: 'Huevos Pasados por Agua con Bastones de Pan Tostado y Pavo', cal: 280, p: 18, c: 22, f: 13, t: 'Alto en Proteína', ing: ['2 huevos pasados por agua', '1 tostada en bastones', '30g pechuga pavo'] },
      { name: 'Yogur Natural con Manzana Picada y Almendras Tostadas', cal: 250, p: 10, c: 28, f: 11, t: 'Rápido', ing: ['125g yogur natural', '1 manzana', '15g almendras sin sal'] },
      { name: 'Tostada con Queso Fresco tipo Burgos, Aceite de Oliva y Orégano', cal: 260, p: 12, c: 26, f: 11, t: 'Bajo en Calorías', ing: ['1 rebanada pan integral', '60g queso fresco Burgos', '5ml AOVE', 'Orégano'] },
      { name: 'Tostada con Escalivada de Pimientos y Atún', cal: 290, p: 18, c: 28, f: 11, t: 'Mediterráneo', ing: ['1 rebanada pan rústico', '50g pimientos asados', '50g atún en lata'] },
      { name: 'Sandwich Sencillo de Pechuga de Pavo, Queso Havarti y Tomate', cal: 320, p: 21, c: 30, f: 12, t: 'Rápido', ing: ['2 rebanadas pan de molde integral', '50g pavo', '1 loncha queso Havarti', 'Rodajas tomate'] },
      { name: 'Tortilla Francesa de Atún con Tostada de Pan con Tomate', cal: 340, p: 25, c: 24, f: 16, t: 'Alto en Proteína', ing: ['2 huevos', '1 lata atún', '1 tostada con tomate y AOVE'] }
    ];
    const item = list[i % list.length];
    const n = Math.floor(i / list.length) + 1;
    const variantSuffix = n > 1 ? ` · Variante ${n}` : '';
    return {
      id: `des_ext_${i + 11}`,
      dishName: n > 1 ? `${item.name}${variantSuffix}` : item.name,
      description: `Opción de desayuno mediterráneo tradicional nº ${i + 1} fácil y rápida de preparar en casa.`,
      mealType: 'Desayuno' as const,
      calories: item.cal + (i % 4) * 5,
      proteinGrams: item.p + (i % 2),
      carbsGrams: item.c + (i % 3),
      fatGrams: item.f + (i % 2),
      prepTimeMinutes: 5 + (i % 5),
      ingredients: item.ing,
      safeForRestrictions: true,
      tag: item.t as any
    };
  })
];

export const COMIDAS_CATALOG: RecommendedDish[] = [
  {
    id: 'alm_1',
    dishName: 'Lentejas Castellanas Estofadas con Verduras y Arroz',
    description: 'Plato tradicional de cuchara con lentejas, zanahoria, patata, pimiento, cebolla y un puñado de arroz integral.',
    mealType: 'Almuerzo',
    calories: 450,
    proteinGrams: 24,
    carbsGrams: 68,
    fatGrams: 7,
    prepTimeMinutes: 25,
    ingredients: ['180g lentejas cocidas', '60g arroz cocido', '80g patata en dados', 'Zanahoria, pimiento verde, cebolla y ajo', 'Pimentón dulce y AOVE'],
    safeForRestrictions: true,
    tag: 'Vegetariano'
  },
  {
    id: 'alm_2',
    dishName: 'Pechuga de Pollo a la Plancha con Patatas Asadas y Ensalada Mixta',
    description: 'Pechuga de pollo jugosa al ajillo con patatas asadas al horno con orégano y ensalada de lechuga, tomate y cebolla.',
    mealType: 'Almuerzo',
    calories: 460,
    proteinGrams: 42,
    carbsGrams: 38,
    fatGrams: 12,
    prepTimeMinutes: 20,
    ingredients: ['160g pechuga de pollo', '150g patatas al horno', '100g lechuga, tomate y cebolla', '10ml aceite de oliva virgen extra'],
    safeForRestrictions: true,
    tag: 'Alto en Proteína'
  },
  {
    id: 'alm_3',
    dishName: 'Salmón a la Plancha con Patatas Cocidas y Espárragos Trigueros',
    description: 'Pescado azul rico en Omega-3 a la plancha con patatas cocidas con piel y espárragos verdes salteados.',
    mealType: 'Almuerzo',
    calories: 510,
    proteinGrams: 38,
    carbsGrams: 34,
    fatGrams: 22,
    prepTimeMinutes: 18,
    ingredients: ['160g lomo de salmón fresco', '140g patata cocida', '80g espárragos trigueros', 'Limón y AOVE'],
    safeForRestrictions: true,
    tag: 'Mediterráneo'
  },
  {
    id: 'alm_4',
    dishName: 'Garbanzos Guisados con Espinacas, Bacalao y Huevo Duro',
    description: 'Receta tradicional de potaje de vigilia mediterráneo reconfortante y repleto de hierro y proteínas.',
    mealType: 'Almuerzo',
    calories: 470,
    proteinGrams: 36,
    carbsGrams: 48,
    fatGrams: 12,
    prepTimeMinutes: 20,
    ingredients: ['160g garbanzos cocidos', '100g bacalao desalado desmigado', '80g espinacas frescas', '1 huevo duro', 'Ajo y pimentón de la Vera'],
    safeForRestrictions: true,
    tag: 'Mediterráneo'
  },
  {
    id: 'alm_5',
    dishName: 'Solomillo de Cerdo Magro al Ajillo con Pimientos Asados y Arroz',
    description: 'Carne magra tierna a la sartén con ajos dorados, pimientos del piquillo o asados y guarnición de arroz.',
    mealType: 'Almuerzo',
    calories: 480,
    proteinGrams: 40,
    carbsGrams: 42,
    fatGrams: 14,
    prepTimeMinutes: 18,
    ingredients: ['150g solomillo de cerdo magro', '100g arroz cocido', '80g pimientos asados', '4 dientes de ajo y AOVE'],
    safeForRestrictions: true,
    tag: 'Alto en Proteína'
  },
  {
    id: 'alm_6',
    dishName: 'Albóndigas Caseras de Ternera en Salsa de Tomate con Patatas Cocidas',
    description: 'Albóndigas magras guisadas en salsa casera de tomate natural, cebolla y ajo con patatas troceadas.',
    mealType: 'Almuerzo',
    calories: 490,
    proteinGrams: 38,
    carbsGrams: 45,
    fatGrams: 15,
    prepTimeMinutes: 25,
    ingredients: ['140g carne picada de ternera magra', '150g tomate triturado natural', '130g patata cocida', 'Cebolla, ajo y perejil'],
    safeForRestrictions: true,
    tag: 'Alto en Proteína'
  },
  {
    id: 'alm_7',
    dishName: 'Merluza a la Plancha con Ensalada Campera de Patata y Atún',
    description: 'Lomo de merluza fresca con patata cocida, atún en lata, huevo duro, tomate y pimiento picado.',
    mealType: 'Almuerzo',
    calories: 420,
    proteinGrams: 39,
    carbsGrams: 32,
    fatGrams: 12,
    prepTimeMinutes: 15,
    ingredients: ['170g lomo de merluza', '120g patata cocida', '1/2 lata atún al natural', '1/2 huevo duro', 'Tomate, pimiento y AOVE'],
    safeForRestrictions: true,
    tag: 'Bajo en Calorías'
  },
  {
    id: 'alm_zw_1',
    dishName: 'Pisto Manchego de Aprovechamiento con Huevo Escalfado',
    description: 'La gran receta tradicional española para rescatar restos de verduras (calabacín, pimiento, cebolla, tomate) coronada con huevo a la plancha.',
    mealType: 'Almuerzo',
    calories: 390,
    proteinGrams: 18,
    carbsGrams: 28,
    fatGrams: 20,
    prepTimeMinutes: 20,
    ingredients: ['150g restos de calabacín y berenjena', '1 pimiento variado', '1 cebolla', '150g tomate triturado', '2 huevos camperos', 'AOVE y sal'],
    safeForRestrictions: true,
    tag: 'Aprovechamiento'
  },
  {
    id: 'alm_zw_2',
    dishName: 'Arroz Salteado Mediterráneo con Sobras de Pollo Asado y Verduras',
    description: 'Aprovecha el arroz cocido y las sobras de pollo desmigado salteadas a fuego vivo con ajo, perejil y hortalizas de temporada.',
    mealType: 'Almuerzo',
    calories: 450,
    proteinGrams: 36,
    carbsGrams: 46,
    fatGrams: 11,
    prepTimeMinutes: 12,
    ingredients: ['120g sobras de pollo asado desmigado', '130g arroz cocido del día anterior', '1/2 pimiento y cebolleta', '1 diente de ajo y perejil', 'AOVE'],
    safeForRestrictions: true,
    tag: 'Aprovechamiento'
  },
  {
    id: 'alm_zw_3',
    dishName: 'Salteado de Garbanzos Cocidos con Espinacas, Ajo y Pan Frito',
    description: 'Clásico plato andaluz de aprovechamiento con garbanzos de bote, espinacas y un majado de pan del día anterior con pimentón dulce.',
    mealType: 'Almuerzo',
    calories: 420,
    proteinGrams: 22,
    carbsGrams: 52,
    fatGrams: 13,
    prepTimeMinutes: 15,
    ingredients: ['180g garbanzos cocidos de bote', '100g espinacas frescas o congeladas', '20g pan del día anterior tostado', 'Ajos, comino, pimentón de la Vera y AOVE'],
    safeForRestrictions: true,
    tag: 'Aprovechamiento'
  },
  {
    id: 'alm_8',
    dishName: 'Tortilla de Patatas Tradicional con Ensalada de Tomate Aliñado',
    description: 'La emblemática tortilla española con patatas pochadas con poco aceite y cebolla, servida con tomate aliñado.',
    mealType: 'Almuerzo',
    calories: 440,
    proteinGrams: 18,
    carbsGrams: 38,
    fatGrams: 22,
    prepTimeMinutes: 25,
    ingredients: ['2 huevos enteros', '150g patata pochada', '1/2 cebolla', '1 tomate grande aliñado con oregano y AOVE'],
    safeForRestrictions: true,
    tag: 'Vegetariano'
  },
  {
    id: 'alm_9',
    dishName: 'Macarrones Integrales con Tomate Casero, Carne Picada de Pavo y Orégano',
    description: 'Plato sabroso familiar de pasta integral con sofrito de tomate, cebolla y carne magra de pavo.',
    mealType: 'Almuerzo',
    calories: 480,
    proteinGrams: 36,
    carbsGrams: 58,
    fatGrams: 10,
    prepTimeMinutes: 18,
    ingredients: ['70g macarrones integrales (en seco)', '120g carne picada de pavo magra', '120g tomate frito casero', 'Orégano y ajo'],
    safeForRestrictions: true,
    tag: 'Alto en Proteína'
  },
  {
    id: 'alm_10',
    dishName: 'Dorada al Horno con Patatas Panaderas y Cebolla',
    description: 'Pescado blanco al horno sobre cama de rodajas finas de patata, cebolla y un chorrito de vino blanco.',
    mealType: 'Almuerzo',
    calories: 430,
    proteinGrams: 37,
    carbsGrams: 32,
    fatGrams: 14,
    prepTimeMinutes: 25,
    ingredients: ['200g dorada limpia', '130g patatas panaderas', '1/2 cebolla en juliana', 'Chorrito vino blanco y AOVE'],
    safeForRestrictions: true,
    tag: 'Mediterráneo'
  },
  // Generador extendido para comidas de mediodía
  ...Array.from({ length: 90 }).map((_, i) => {
    const coms = [
      { name: 'Potaje de Alubias Blancas con Zanahoria, Calabaza y Arroz', cal: 440, p: 22, c: 66, f: 6, t: 'Vegetariano', ing: ['180g alubias cocidas', '50g arroz', 'Calabaza, zanahoria y laurel'] },
      { name: 'Pechuga de Pavo al Limón con Patatas Cocidas y Judías Verdes', cal: 420, p: 40, c: 35, f: 9, t: 'Bajo en Calorías', ing: ['160g pechuga pavo', '130g patata', '100g judías verdes', 'Limón y AOVE'] },
      { name: 'Filete de Ternera a la Plancha con Salteado de Verduras y Patatas', cal: 470, p: 42, c: 36, f: 14, t: 'Alto en Proteína', ing: ['150g filete ternera magro', '130g patata', 'Calabacín, cebolla y pimiento'] },
      { name: 'Arroz con Sepia, Gambas y Verduras de la Huerta', cal: 460, p: 32, c: 56, f: 10, t: 'Mediterráneo', ing: ['80g arroz bomba', '100g sepia', '60g gambas peladas', 'Caldo de pescado y azafrán'] },
      { name: 'Puchero Tradicional de Pollo, Garbanzos y Verduras', cal: 450, p: 38, c: 42, f: 12, t: 'Mediterráneo', ing: ['140g garbanzos', '120g pechuga pollo cocida', 'Zanahoria, puerro y patata'] }
    ];
    const base = coms[i % coms.length];
    const n = Math.floor(i / coms.length) + 1;
    const variantSuffix = n > 1 ? ` · Variante ${n}` : '';
    return {
      id: `alm_ext_${i + 11}`,
      dishName: n > 1 ? `${base.name}${variantSuffix}` : base.name,
      description: `Menú de mediodía tradicional español nº ${i + 1} completo y fácil de cocinar.`,
      mealType: 'Almuerzo' as const,
      calories: base.cal + (i % 5) * 6,
      proteinGrams: base.p + (i % 2),
      carbsGrams: base.c + (i % 3),
      fatGrams: base.f + (i % 2),
      prepTimeMinutes: 15 + (i % 10),
      ingredients: base.ing,
      safeForRestrictions: true,
      tag: base.t as any
    };
  })
];

export const CENAS_CATALOG: RecommendedDish[] = [
  {
    id: 'cen_1',
    dishName: 'Merluza a la Plancha con Salteado de Calabacín y Champiñones',
    description: 'Cena ligera y fácil de digerir con pescado blanco a la plancha y hortalizas al ajillo.',
    mealType: 'Cena',
    calories: 310,
    proteinGrams: 35,
    carbsGrams: 12,
    fatGrams: 10,
    prepTimeMinutes: 12,
    ingredients: ['180g lomo de merluza', '120g calabacín en dados', '80g champiñones laminados', '2 dientes de ajo y AOVE'],
    safeForRestrictions: true,
    tag: 'Bajo en Calorías'
  },
  {
    id: 'cen_2',
    dishName: 'Ensalada Campera de Garbanzos, Atún y Huevo Duro',
    description: 'Plato frío saciante de legumbres cocidas de bote con atún, huevo duro y tomate picado con AOVE.',
    mealType: 'Cena',
    calories: 380,
    proteinGrams: 28,
    carbsGrams: 32,
    fatGrams: 14,
    prepTimeMinutes: 8,
    ingredients: ['130g garbanzos cocidos', '1 lata atún claro al natural', '1 huevo duro', 'Tomate, pimiento, cebolla y AOVE'],
    safeForRestrictions: true,
    tag: 'Rápido'
  },
  {
    id: 'cen_3',
    dishName: 'Crema Casera de Calabacín con Tiras de Pechuga de Pollo',
    description: 'Crema tibia casera de calabacín, patata y cebolla servida con tiras de pollo a la plancha por encima.',
    mealType: 'Cena',
    calories: 320,
    proteinGrams: 32,
    carbsGrams: 22,
    fatGrams: 9,
    prepTimeMinutes: 18,
    ingredients: ['250ml crema de calabacín y patata', '120g pechuga de pollo a la plancha', 'Chorrito de AOVE y pimienta'],
    safeForRestrictions: true,
    tag: 'Bajo en Calorías'
  },
  {
    id: 'cen_4',
    dishName: 'Revuelto de Huevos con Gambas Peladas y Ajetes Tiernos',
    description: 'Revuelto en sartén alto en proteínas marinas sin apenas carbohidratos, muy fácil y rápido.',
    mealType: 'Cena',
    calories: 300,
    proteinGrams: 30,
    carbsGrams: 6,
    fatGrams: 16,
    prepTimeMinutes: 10,
    ingredients: ['2 huevos enteros', '100g gambas peladas', '50g ajetes tiernos o ajos frescos', 'Ajo y perejil picado'],
    safeForRestrictions: true,
    tag: 'Alto en Proteína'
  },
  {
    id: 'cen_5',
    dishName: 'Lubina a la Plancha con Ensalada de Cogollos y Tomate',
    description: 'Filete de lubina fresca crujiente a la plancha servido con ensalada de cogollos, tomate picado y aceitunas.',
    mealType: 'Cena',
    calories: 290,
    proteinGrams: 34,
    carbsGrams: 8,
    fatGrams: 12,
    prepTimeMinutes: 12,
    ingredients: ['180g filete de lubina', '2 cogollos de lechuga', '1 tomate mediano', 'Aceitunas verdes y AOVE'],
    safeForRestrictions: true,
    tag: 'Mediterráneo'
  },
  {
    id: 'cen_6',
    dishName: 'Sepia a la Plancha con Ajo, Perejil y Ensalada Mixta',
    description: 'Sepia tierna marcada en la sartén con majado de ajo y perejil acompañado de ensalada fresca.',
    mealType: 'Cena',
    calories: 280,
    proteinGrams: 33,
    carbsGrams: 8,
    fatGrams: 11,
    prepTimeMinutes: 10,
    ingredients: ['180g sepia limpia', '100g ensalada de lechuga, tomate y pepino', 'Ajo, perejil, limón y AOVE'],
    safeForRestrictions: true,
    tag: 'Rápido'
  },
  {
    id: 'cen_7',
    dishName: 'Tortilla de Calabacín y Cebolla con Tomate Aliñado',
    description: 'Tortilla esponjosa con calabacín y cebolla pochaditos en sartén con ensalada de tomate.',
    mealType: 'Cena',
    calories: 320,
    proteinGrams: 16,
    carbsGrams: 18,
    fatGrams: 19,
    prepTimeMinutes: 15,
    ingredients: ['2 huevos enteros', '120g calabacín', '1/2 cebolla', '1 tomate aliñado con orégano y sal'],
    safeForRestrictions: true,
    tag: 'Vegetariano'
  },
  {
    id: 'cen_zw_1',
    dishName: 'Tortilla Paisana de Sobras de la Huerta y Jamón',
    description: 'Tortilla esponjosa con restos de verduras cocidas o salteadas de la nevera (zanahoria, calabacín, pimiento) y taquitos de jamón.',
    mealType: 'Cena',
    calories: 330,
    proteinGrams: 24,
    carbsGrams: 12,
    fatGrams: 20,
    prepTimeMinutes: 12,
    ingredients: ['2 huevos de corral', '120g restos de verduras variadas', '30g taquitos de jamón serrano magro', 'AOVE y sal'],
    safeForRestrictions: true,
    tag: 'Aprovechamiento'
  },
  {
    id: 'cen_zw_2',
    dishName: 'Sopa Castellana de Ajo y Pan del Día Anterior con Huevo',
    description: 'La gran sopa reconfortante de aprovechamiento: caldo ligero con ajo dorado, pimentón de la Vera, rebanadas de pan duro y huevo escalfado.',
    mealType: 'Cena',
    calories: 310,
    proteinGrams: 16,
    carbsGrams: 30,
    fatGrams: 14,
    prepTimeMinutes: 15,
    ingredients: ['40g pan del día anterior', '1 huevo', '3 dientes de ajo laminados', '1 cucharadita de pimentón dulce', 'Caldo de verduras o agua', 'AOVE'],
    safeForRestrictions: true,
    tag: 'Aprovechamiento'
  },
  {
    id: 'cen_zw_3',
    dishName: 'Revuelto de la Huerta con Champiñones y Restos de Pavo Asado',
    description: 'Revuelto rápido en sartén con restos de carne blanca, champiñones laminados y un toque de perejil fresco.',
    mealType: 'Cena',
    calories: 320,
    proteinGrams: 32,
    carbsGrams: 6,
    fatGrams: 18,
    prepTimeMinutes: 10,
    ingredients: ['2 huevos', '80g restos de pechuga de pavo o pollo', '80g champiñones', 'Ajo, perejil y AOVE'],
    safeForRestrictions: true,
    tag: 'Aprovechamiento'
  },
  {
    id: 'cen_8',
    dishName: 'Pechuga de Pavo a la Plancha con Verduras Asadas',
    description: 'Pavo magro marcado con romero acompañado de berenjena, calabacín y pimientos asados al horno o plancha.',
    mealType: 'Cena',
    calories: 310,
    proteinGrams: 36,
    carbsGrams: 14,
    fatGrams: 11,
    prepTimeMinutes: 15,
    ingredients: ['150g pechuga de pavo', '150g verduras variadas asadas (berenjena, calabacín, pimiento)', 'AOVE y hierbas'],
    safeForRestrictions: true,
    tag: 'Alto en Proteína'
  },
  {
    id: 'cen_9',
    dishName: 'Sopa de Picadillo Tradicional con Caldo de Ave, Huevo Duro y Jamón',
    description: 'Sopa reconstituyente de caldo casero de pollo con huevo duro picado y taquitos de jamón serrano.',
    mealType: 'Cena',
    calories: 270,
    proteinGrams: 26,
    carbsGrams: 12,
    fatGrams: 12,
    prepTimeMinutes: 10,
    ingredients: ['250ml caldo de pollo casero', '1 huevo duro picado', '30g taquitos de jamón serrano', 'Unos fideos finos (20g)'],
    safeForRestrictions: true,
    tag: 'Bajo en Calorías'
  },
  {
    id: 'cen_10',
    dishName: 'Hamburguesa Casera de Ternera al Plato con Ensalada y Aguacate',
    description: 'Hamburguesa de ternera magra a la plancha servida sin pan, con ensalada de lechuga, tomate y rodajas de aguacate.',
    mealType: 'Cena',
    calories: 360,
    proteinGrams: 32,
    carbsGrams: 8,
    fatGrams: 22,
    prepTimeMinutes: 10,
    ingredients: ['140g hamburguesa ternera 100% magra', '1/3 aguacate maduro', 'Lechuga, tomate y pepino', 'AOVE y vinagre'],
    safeForRestrictions: true,
    tag: 'Keto'
  },
  // Generador extendido para cenas
  ...Array.from({ length: 90 }).map((_, i) => {
    const cenas = [
      { name: 'Calamares a la Plancha con Ajo, Limón y Ensalada de Canónigos', cal: 270, p: 31, c: 7, f: 10, t: 'Bajo en Calorías', ing: ['170g calamares', 'Canónigos y tomate', 'Ajo, limón y AOVE'] },
      { name: 'Crema Casera de Calabaza con Huevo Duro Picado y Jamón', cal: 290, p: 20, c: 22, f: 11, t: 'Bajo en Calorías', ing: ['250ml crema calabaza', '1 huevo duro', '20g jamón serrano'] },
      { name: 'Bacalao a la Plancha con Pimientos del Piquillo y Ajos Dorados', cal: 320, p: 35, c: 10, f: 12, t: 'Mediterráneo', ing: ['170g lomo bacalao', '80g pimientos piquillo', 'Ajos y AOVE'] },
      { name: 'Cogollos de Tudela con Atún Claro, Anchoas y Pimientos Asados', cal: 280, p: 27, c: 8, f: 14, t: 'Rápido', ing: ['3 cogollos', '1 lata atún', '3 filetes anchoas', 'Pimientos asados'] },
      { name: 'Tortilla Francesa de Espinacas con Queso Fresco y Tomate', cal: 310, p: 22, c: 6, f: 20, t: 'Vegetariano', ing: ['2 huevos', '50g espinacas', '40g queso fresco Burgos', 'Tomate'] }
    ];
    const base = cenas[i % cenas.length];
    const n = Math.floor(i / cenas.length) + 1;
    const variantSuffix = n > 1 ? ` · Variante ${n}` : '';
    return {
      id: `cen_ext_${i + 11}`,
      dishName: n > 1 ? `${base.name}${variantSuffix}` : base.name,
      description: `Propuesta de cena tradicional de dieta mediterránea nº ${i + 1} ligera y muy fácil.`,
      mealType: 'Cena' as const,
      calories: base.cal + (i % 4) * 5,
      proteinGrams: base.p + (i % 2),
      carbsGrams: base.c + (i % 2),
      fatGrams: base.f + (i % 2),
      prepTimeMinutes: 8 + (i % 8),
      ingredients: base.ing,
      safeForRestrictions: true,
      tag: base.t as any
    };
  })
];

export const SNACKS_CATALOG: RecommendedDish[] = [
  {
    id: 'snk_1',
    dishName: 'Yogur Natural con un Puñado de Nueces',
    description: 'Merienda o tentempié clásico mediterráneo listo en 1 minuto.',
    mealType: 'Snack',
    calories: 190,
    proteinGrams: 8,
    carbsGrams: 10,
    fatGrams: 13,
    prepTimeMinutes: 1,
    ingredients: ['125g yogur natural sin azúcar', '18g nueces peladas'],
    safeForRestrictions: true,
    tag: 'Rápido'
  },
  {
    id: 'snk_2',
    dishName: 'Manzana Verde con Queso Fresco tipo Burgos',
    description: 'Combinación crujiente y fresca con proteínas lácteas y fibra de la fruta.',
    mealType: 'Snack',
    calories: 160,
    proteinGrams: 9,
    carbsGrams: 20,
    fatGrams: 4,
    prepTimeMinutes: 2,
    ingredients: ['1 manzana verde mediana', '70g queso fresco desnatado o Burgos'],
    safeForRestrictions: true,
    tag: 'Bajo en Calorías'
  },
  {
    id: 'snk_3',
    dishName: 'Lata de Berberechos o Mejillones al Natural con Limón',
    description: 'Aperitivo marino súper proteico, rico en hierro e ideal para cualquier hora.',
    mealType: 'Snack',
    calories: 90,
    proteinGrams: 18,
    carbsGrams: 2,
    fatGrams: 1,
    prepTimeMinutes: 1,
    ingredients: ['1 lata de berberechos o mejillones al natural (80g)', 'Zumo de 1/2 limón', 'Pimienta negra'],
    safeForRestrictions: true,
    tag: 'Alto en Proteína'
  },
  {
    id: 'snk_4',
    dishName: 'Tostadita de Pan con Tomate Rallado y Jamón Serrano',
    description: 'Tentempié tradicional salado con carbohidratos complejos y proteína de calidad.',
    mealType: 'Snack',
    calories: 170,
    proteinGrams: 10,
    carbsGrams: 16,
    fatGrams: 7,
    prepTimeMinutes: 3,
    ingredients: ['1 rebanada pequeña de pan (30g)', '1/2 tomate rallado', '20g jamón serrano magro', 'Un chorrito de AOVE'],
    safeForRestrictions: true,
    tag: 'Mediterráneo'
  },
  {
    id: 'snk_5',
    dishName: 'Puñado de Almendras Crudas o Tostadas Sin Sal',
    description: 'Grasas saludables monoinsaturadas y vitamina E en formato portátil.',
    mealType: 'Snack',
    calories: 170,
    proteinGrams: 6,
    carbsGrams: 5,
    fatGrams: 14,
    prepTimeMinutes: 1,
    ingredients: ['25g almendras crudas o tostadas sin sal'],
    safeForRestrictions: true,
    tag: 'Keto'
  },
  {
    id: 'snk_6',
    dishName: 'Queso Fresco con un Hilo de Miel y Nueces',
    description: 'Bocado dulce saludable con textura cremosa y grasa beneficiosa.',
    mealType: 'Snack',
    calories: 180,
    proteinGrams: 10,
    carbsGrams: 14,
    fatGrams: 9,
    prepTimeMinutes: 2,
    ingredients: ['80g queso fresco Burgos o villalón', '10g miel', '10g nueces'],
    safeForRestrictions: true,
    tag: 'Mediterráneo'
  },
  {
    id: 'snk_7',
    dishName: 'Lonchas de Pechuga de Pavo Enrolladas con Queso Havarti',
    description: 'Snack bajo en carbohidratos proteico facilísimo de preparar.',
    mealType: 'Snack',
    calories: 150,
    proteinGrams: 14,
    carbsGrams: 2,
    fatGrams: 9,
    prepTimeMinutes: 1,
    ingredients: ['50g pechuga de pavo en lonchas', '1 loncha de queso (20g)'],
    safeForRestrictions: true,
    tag: 'Alto en Proteína'
  },
  {
    id: 'snk_8',
    dishName: 'Plátano con una Onza de Chocolate Negro (85%)',
    description: 'Snack reconfortante para antes de entrenar o saciar el antojo de dulce.',
    mealType: 'Snack',
    calories: 160,
    proteinGrams: 3,
    carbsGrams: 28,
    fatGrams: 5,
    prepTimeMinutes: 1,
    ingredients: ['1 plátano maduro mediano', '15g chocolate negro 85% cacao'],
    safeForRestrictions: true,
    tag: 'Rápido'
  },
  {
    id: 'snk_9',
    dishName: 'Bastones de Zanahoria y Pepino Aliñados con AOVE y Sal',
    description: 'Crujiente, hidratante y muy bajo en calorías para picar entre horas.',
    mealType: 'Snack',
    calories: 80,
    proteinGrams: 2,
    carbsGrams: 9,
    fatGrams: 4,
    prepTimeMinutes: 3,
    ingredients: ['1 zanahoria', '1/2 pepino', '5ml aceite de oliva virgen extra', 'Pizca de sal y vinagre'],
    safeForRestrictions: true,
    tag: 'Vegetariano'
  },
  {
    id: 'snk_10',
    dishName: 'Tostada Integral con Atún al Natural y Rodajas de Tomate',
    description: 'Mini bocadillo salado repleto de proteínas magras.',
    mealType: 'Snack',
    calories: 170,
    proteinGrams: 16,
    carbsGrams: 16,
    fatGrams: 4,
    prepTimeMinutes: 3,
    ingredients: ['1 tostada integral pequeña (30g)', '1/2 lata atún al natural', 'Rodajas de tomate y sal'],
    safeForRestrictions: true,
    tag: 'Alto en Proteína'
  },
  // Generador extendido para snacks
  ...Array.from({ length: 90 }).map((_, i) => {
    const snacks = [
      { name: 'Kéfir Natural con Plátano en Rodajas', cal: 150, p: 7, c: 22, f: 3, t: 'Bajo en Calorías', ing: ['150ml kéfir natural', '1 plátano'] },
      { name: 'Manzana con un Puñado de Almendras Tostadas y Nueces', cal: 180, p: 6, c: 20, f: 10, t: 'Mediterráneo', ing: ['1 manzana', '10g almendras', '10g nueces'] },
      { name: 'Tostadita con Queso Manchego y Membrillo con Rúcula', cal: 160, p: 6, c: 18, f: 7, t: 'Mediterráneo', ing: ['1 tostada', '20g queso manchego', '15g dulce de membrillo', 'Rúcula fresca'] },
      { name: 'Puñado de Cacahuetes Tostados Sin Sal y Avellanas', cal: 170, p: 7, c: 6, f: 14, t: 'Rápido', ing: ['15g cacahuetes tostados', '15g avellanas del país'] },
      { name: 'Yogur Griego Natural con Miel, Avellanas y Nueces', cal: 200, p: 8, c: 16, f: 12, t: 'Rápido', ing: ['125g yogur griego', '8g miel', '10g avellanas', '10g nueces'] }
    ];
    const base = snacks[i % snacks.length];
    const n = Math.floor(i / snacks.length) + 1;
    const variantSuffix = n > 1 ? ` · Variante ${n}` : '';
    return {
      id: `snk_ext_${i + 11}`,
      dishName: n > 1 ? `${base.name}${variantSuffix}` : base.name,
      description: `Tentempié mediterráneo tradicional nº ${i + 1} sano, saciante y facilísimo.`,
      mealType: 'Snack' as const,
      calories: base.cal + (i % 3) * 5,
      proteinGrams: base.p + (i % 2),
      carbsGrams: base.c + (i % 2),
      fatGrams: base.f + (i % 2),
      prepTimeMinutes: 1 + (i % 3),
      ingredients: base.ing,
      safeForRestrictions: true,
      tag: base.t as any
    };
  })
];

export const ALL_DISHES_CATALOG: RecommendedDish[] = [
  ...DESAYUNOS_CATALOG,
  ...COMIDAS_CATALOG,
  ...CENAS_CATALOG,
  ...SNACKS_CATALOG
];
