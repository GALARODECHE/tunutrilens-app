export interface SeasonalProduct {
  name: string;
  category: 'Frutas' | 'Hojas Verdes y Verduras' | 'Pescados y Mariscos' | 'Frutos Secos y Legumbres';
  description?: string;
  icon?: string;
}

export interface MonthSeasonalData {
  monthIndex: number; // 0 to 11
  monthName: string;
  season: 'Invierno' | 'Primavera' | 'Verano' | 'Otoño';
  tagline: string;
  fruits: string[];
  greensAndVegetables: string[];
  fishAndSeafood: string[];
  nutsAndLegumes: string[];
  monthlyTip: string;
}

export const SEASONAL_CALENDAR: MonthSeasonalData[] = [
  {
    monthIndex: 0,
    monthName: 'Enero',
    season: 'Invierno',
    tagline: 'Cítricos jugosos, hojas verdes de invierno y pescados blancos reconstituyentes.',
    fruits: ['Naranja de Valencia', 'Mandarina', 'Limón', 'Kiwi', 'Manzana Reineta', 'Pera Conferencia', 'Plátano de Canarias'],
    greensAndVegetables: ['Canónigos', 'Rúcula', 'Espinacas frescas', 'Germinados de alfalfa', 'Alcachofa', 'Cardo', 'Puerro', 'Ajo tierno', 'Col de Bruselas', 'Champiñón'],
    fishAndSeafood: ['Bacalao fresco', 'Merluza del Cantábrico', 'Dorada', 'Lubina', 'Besugo', 'Berberechos al natural'],
    nutsAndLegumes: ['Nueces con cáscara', 'Almendras marcona', 'Avellanas', 'Garbanzos castellanos', 'Lentejas pardinas'],
    monthlyTip: 'Aprovecha las ensaladas templadas de canónigos y rúcula con nueces y una vinagreta ligera de aceite de oliva y naranja recién exprimida.'
  },
  {
    monthIndex: 1,
    monthName: 'Febrero',
    season: 'Invierno',
    tagline: 'Punto óptimo de las coles, cítricos dulces y frutos secos ricos en grasas cardio-saludables.',
    fruits: ['Mandarina Clementina', 'Naranja de mesa', 'Limón', 'Kiwi', 'Manzana Golden', 'Pera', 'Plátano de Canarias'],
    greensAndVegetables: ['Rúcula fresca', 'Canónigos', 'Espinacas de hoja', 'Germinados de brócoli', 'Alcachofa de Tudela', 'Ajetes tiernos', 'Calabaza', 'Puerro', 'Acelga'],
    fishAndSeafood: ['Bacalao en sazón', 'Merluza', 'Dorada de estero', 'Lenguado', 'Sepia de bahía', 'Mejillones'],
    nutsAndLegumes: ['Nueces del país', 'Avellanas rebozadas', 'Almendras sin sal', 'Alubias blancas', 'Lentejas'],
    monthlyTip: 'Añade un puñado de germinados de brócoli o canónigos a tus cremas calientes de calabaza o puerro justo antes de servir para preservar la vitamina C.'
  },
  {
    monthIndex: 2,
    monthName: 'Marzo',
    season: 'Primavera',
    tagline: 'Transición a la primavera: primeros espárragos trigueros, fresones y hojas verdes crujientes.',
    fruits: ['Fresón de Huelva', 'Naranja sanguina', 'Limón', 'Kiwi', 'Manzana', 'Pera', 'Plátano de Canarias'],
    greensAndVegetables: ['Espárragos trigueros', 'Canónigos', 'Rúcula salvaje', 'Germinados variados', 'Espinacas', 'Guisantes frescos', 'Habas tiernas', 'Alcachofa'],
    fishAndSeafood: ['Boquerón del Cantábrico', 'Caballa', 'Merluza', 'Rape', 'Gamba blanca', 'Sepia'],
    nutsAndLegumes: ['Nueces', 'Almendras', 'Avellanas', 'Cacahuetes tostados sin sal', 'Garbanzos'],
    monthlyTip: 'Prepara un revuelto de huevos camperos con ajetes tiernos, espárragos trigueros y canónigos frescos aliñados con un buen chorro de AOVE.'
  },
  {
    monthIndex: 3,
    monthName: 'Abril',
    season: 'Primavera',
    tagline: 'Esplendor primaveral: fresas en su cénit, guisantes dulces y verdura de hoja.',
    fruits: ['Fresas y Fresones', 'Naranja', 'Níspero', 'Limón', 'Plátano de Canarias', 'Manzana'],
    greensAndVegetables: ['Rúcula', 'Canónigos', 'Cogollos de Tudela', 'Germinados de alfalfa', 'Espinacas tiernas', 'Espárragos blancos y verdes', 'Habas', 'Zanahoria con rama'],
    fishAndSeafood: ['Boquerón', 'Sardina de parrocha', 'Atún rojo (inicio de almadraba)', 'Caballa', 'Merluza', 'Gamba roja'],
    nutsAndLegumes: ['Almendras crudas', 'Nueces', 'Avellanas', 'Cacahuetes con cáscara', 'Guisantes de lágrima'],
    monthlyTip: 'Los cogollos de Tudela con atún claro, lonchas de huevo duro y germinados sobre vinagreta de virgen extra son una cena primaveral insuperable.'
  },
  {
    monthIndex: 4,
    monthName: 'Mayo',
    season: 'Primavera',
    tagline: 'Llegan las cerezas, los albaricoques y los pescados azules ricos en Omega-3.',
    fruits: ['Cerezas del Jerte', 'Albaricoque', 'Níspero', 'Fresa', 'Ciruela temprana', 'Plátano de Canarias'],
    greensAndVegetables: ['Canónigos', 'Rúcula', 'Germinados de rábano', 'Lechuga romana', 'Espárragos verdes', 'Calabacín tierno', 'Pepino', 'Tomate verde de ensalada'],
    fishAndSeafood: ['Sardina', 'Boquerón', 'Atún rojo de almadraba', 'Jurel', 'Pescadilla', 'Sepia'],
    nutsAndLegumes: ['Nueces', 'Almendras tostadas', 'Avellanas', 'Piñones de pino piñonero', 'Habas tiernas'],
    monthlyTip: 'Acompaña cualquier pescado a la plancha con una cama abundante de rúcula, nueces picadas y tomate de ensalada aliñado con orégano y AOVE.'
  },
  {
    monthIndex: 5,
    monthName: 'Junio',
    season: 'Verano',
    tagline: 'Entrada del verano: brevas dulces, melón, sandía y tomates cargados de sol.',
    fruits: ['Brevas', 'Cerezas', 'Melón de Villaconejos', 'Sandía', 'Melocotón', 'Nectarina', 'Albaricoque', 'Paraguayo'],
    greensAndVegetables: ['Tomate Raf y Muchamiel', 'Rúcula', 'Canónigos', 'Germinados', 'Pimiento verde de freír', 'Pepino', 'Calabacín', 'Berenjena'],
    fishAndSeafood: ['Sardina de espeto', 'Bonito del Norte', 'Boquerón', 'Calamar de potera', 'Jurel', 'Mejillones de batea'],
    nutsAndLegumes: ['Almendras peladas', 'Nueces de California o nacionales', 'Avellanas', 'Cacahuetes', 'Garbanzos en ensalada'],
    monthlyTip: 'Prepara ensaladas frías de garbanzos cocidos con tomate dador, pepino crujiente, canónigos, atún en lata y un puñado de almendras tostadas.'
  },
  {
    monthIndex: 6,
    monthName: 'Julio',
    season: 'Verano',
    tagline: 'Pleno verano: sandía refrescante, melocotones de viña, gazpachos y ensaladas camperas.',
    fruits: ['Sandía', 'Melón', 'Melocotón de Calanda', 'Nectarina', 'Paraguayo', 'Ciruela', 'Higos frescos', 'Frambuesas'],
    greensAndVegetables: ['Tomate rosa y de colgar', 'Pimiento rojo y verde', 'Pepino', 'Berenjena', 'Calabacín', 'Canónigos', 'Rúcula', 'Germinados de lenteja'],
    fishAndSeafood: ['Bonito del Norte', 'Sardina', 'Boquerón en vinagre', 'Sepia a la plancha', 'Calamar', 'Gamba de Huelva'],
    nutsAndLegumes: ['Nueces', 'Almendras tostadas con sal marina', 'Cacahuetes', 'Avellanas', 'Ensaladas de lentejas en conserva'],
    monthlyTip: 'Las ensaladas de hojas verdes (rúcula, canónigos) con fruta de verano picada (melocotón o higos), queso fresco y nueces aportan hidratación y proteínas excelentes.'
  },
  {
    monthIndex: 7,
    monthName: 'Agosto',
    season: 'Verano',
    tagline: 'Sabor intenso: higos maduros, uva temprana, pimientos de Padrón y salmorejo.',
    fruits: ['Higos', 'Melón', 'Sandía', 'Melocotón', 'Ciruela negra', 'Mango de la Axarquía', 'Uva blanca', 'Pera de San Juan'],
    greensAndVegetables: ['Pimientos de Padrón y de deliquete', 'Tomate corazón de buey', 'Berenjena de Almagro', 'Calabacín', 'Canónigos', 'Rúcula', 'Germinados'],
    fishAndSeafood: ['Bonito del Norte', 'Sardina', 'Pez espada / Emperador', 'Sepia', 'Choco', 'Coquinas'],
    nutsAndLegumes: ['Almendras', 'Nueces', 'Avellanas', 'Cacahuetes pelados', 'Legumbres cocidas en ensalada fría'],
    monthlyTip: 'Para cenas rápidas en noches calurosas, nada como una ensalada campera con patata cocida, huevo duro, atún, canónigos, pimientos asados y AOVE.'
  },
  {
    monthIndex: 8,
    monthName: 'Septiembre',
    season: 'Otoño',
    tagline: 'Cosecha de transición: uvas de mesa, granadas, membrillo y primeros frutos secos frescos.',
    fruits: ['Uva de mesa (Vinalopó)', 'Granada', 'Higos', 'Manzana Fuji', 'Pera', 'Membrillo', 'Melón tardío', 'Plátano de Canarias'],
    greensAndVegetables: ['Berenjena', 'Pimiento rojo de asar', 'Calabaza totanera', 'Canónigos', 'Rúcula', 'Germinados variados', 'Espinacas tiernas', 'Puerro'],
    fishAndSeafood: ['Dorada salvaje', 'Lubina', 'Sardina', 'Calamar', 'Sargo', 'Clam de carril / Almejas'],
    nutsAndLegumes: ['Nueces recién cosechadas', 'Almendras novales', 'Avellanas de Reus', 'Cacahuetes', 'Lentejas y garbanzos de otoño'],
    monthlyTip: 'Desgrana media granada sobre tus ensaladas de rúcula con las primeras nueces de la temporada y queso manchego o requesón.'
  },
  {
    monthIndex: 9,
    monthName: 'Octubre',
    season: 'Otoño',
    tagline: 'Otoño en la cocina: setas silvestres, castañas asadas, calabazas rústicas y membrillo.',
    fruits: ['Granada', 'Chirimoya de la Costa Tropical', 'Caqui Persimon', 'Manzana Reineta', 'Pera', 'Uva', 'Castaña'],
    greensAndVegetables: ['Setas (Níscalos, Boletus)', 'Calabaza', 'Espinacas frescas', 'Rúcula', 'Canónigos', 'Germinados', 'Acelga', 'Boniato / Batata', 'Coliflor'],
    fishAndSeafood: ['Dorada', 'Lubina', 'Salmonete de roca', 'Merluza', 'Calamares', 'Berberechos frescos'],
    nutsAndLegumes: ['Nueces con cáscara', 'Avellanas', 'Almendras', 'Cacahuetes', 'Castañas', 'Guisos de lentejas y garbanzos'],
    monthlyTip: 'Las cremas de calabaza o boniato con una cucharada de pipas de calabaza, nueces picadas y germinados por encima reconfortan en los primeros días fríos.'
  },
  {
    monthIndex: 10,
    monthName: 'Noviembre',
    season: 'Otoño',
    tagline: 'Guisos reconfortantes, castañas, caquis maduros y verduras de hoja bien verde.',
    fruits: ['Caqui Persimon', 'Chirimoya', 'Naranja temprana', 'Mandarina', 'Granada', 'Manzana', 'Castaña'],
    greensAndVegetables: ['Espinacas', 'Canónigos', 'Rúcula', 'Germinados de brócoli', 'Coliflor', 'Brócoli', 'Alcachofa temprana', 'Cardo', 'Lombarda', 'Puerro'],
    fishAndSeafood: ['Bacalao', 'Merluza', 'Dorada de estero', 'Besugo', 'Rape', 'Mejillones de Galicia'],
    nutsAndLegumes: ['Nueces', 'Avellanas', 'Almendras', 'Cacahuetes', 'Castañas asadas', 'Potajes de garbanzos y alubias'],
    monthlyTip: 'Un potaje tradicional de garbanzos con espinacas frescas y bacalao es el almuerzo otoñal perfecto rico en proteína y hierro.'
  },
  {
    monthIndex: 11,
    monthName: 'Diciembre',
    season: 'Invierno',
    tagline: 'Pleno invierno: cítricos de fiesta, cardo en salsa verde, escarola, canónigos y frutos secos.',
    fruits: ['Naranja de mesa', 'Mandarina Clementina', 'Chirimoya', 'Kiwi', 'Pera Conferencia', 'Manzana', 'Plátano de Canarias'],
    greensAndVegetables: ['Escarola', 'Canónigos', 'Rúcula', 'Germinados de alfalfa', 'Espinacas', 'Cardo de Navidad', 'Alcachofa', 'Col lombarda', 'Ajo porro'],
    fishAndSeafood: ['Besugo de la Cuaresma', 'Merluza de pincho', 'Bacalao salado', 'Lubina salvaje', 'Gamba blanca', 'Almeja fina'],
    nutsAndLegumes: ['Nueces para pelar', 'Almendras marcona', 'Avellanas', 'Cacahuetes', 'Piñones de Castilla', 'Lentejas pardinas'],
    monthlyTip: 'Los frutos secos (nueces, almendras, avellanas, piñones) combinados con cítricos y hojas verdes aportan antioxidantes para combatir los resfriados de invierno.'
  }
];
