// Base de Datos de Composición de Alimentos de Acceso Abierto y Dominio Público
// Fuentes Oficiales: BEDCA (Base de Datos Española de Composición de Alimentos / AESAN - Ministerio de Sanidad)
// y USDA FoodData Central (Departamento de Agricultura de los EE.UU. - Dominio Público)

export interface FoodCompositionItem {
  id: string;
  name: string;
  category: 'Cereales y derivados' | 'Lácteos y derivados' | 'Huevos' | 'Carnes y fiambres' | 'Pescados y mariscos' | 'Legumbres' | 'Verduras y hortalizas' | 'Frutas' | 'Frutos secos y semillas' | 'Aceites y grasas';
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  calciumMgPer100g: number;
  ironMgPer100g: number;
  potassiumMgPer100g: number;
  vitaminAMcgPer100g: number;
  vitaminCMgPer100g: number;
  source: 'BEDCA (Ministerio de Sanidad España)' | 'USDA FoodData Central';
}

export const OPEN_NUTRITIONAL_DATABASE_INFO = {
  primarySource: "BEDCA (Red Española de Composición de Alimentos - AESAN / Ministerio de Sanidad)",
  secondarySource: "USDA FoodData Central (U.S. Department of Agriculture - Public Domain)",
  licenseStatus: "Dominio Público / Datos Abiertos Oficiales (Open Access / Public Domain Data)",
  legalSafety: "100% Libre de Licencias de Autor Comerciales y Restricciones de Propiedad Intelectual",
  energyConversionFactors: {
    protein: "4 kcal/g (17 kJ/g)",
    carbs: "4 kcal/g (17 kJ/g)",
    fat: "9 kcal/g (37 kJ/g)",
    fiber: "2 kcal/g (8 kJ/g)"
  }
};

export const OPEN_FOODS_DATABASE: FoodCompositionItem[] = [
  // Cereales y derivados
  { id: 'bedca_1', name: 'Arroz blanco pulido', category: 'Cereales y derivados', caloriesPer100g: 354, proteinPer100g: 7.0, carbsPer100g: 78.6, fatPer100g: 0.9, fiberPer100g: 1.4, calciumMgPer100g: 14, ironMgPer100g: 1.0, potassiumMgPer100g: 110, vitaminAMcgPer100g: 0, vitaminCMgPer100g: 0, source: 'BEDCA (Ministerio de Sanidad España)' },
  { id: 'bedca_2', name: 'Arroz integral', category: 'Cereales y derivados', caloriesPer100g: 340, proteinPer100g: 8.0, carbsPer100g: 74.1, fatPer100g: 2.2, fiberPer100g: 3.5, calciumMgPer100g: 23, ironMgPer100g: 1.6, potassiumMgPer100g: 220, vitaminAMcgPer100g: 0, vitaminCMgPer100g: 0, source: 'BEDCA (Ministerio de Sanidad España)' },
  { id: 'bedca_3', name: 'Avena en copos', category: 'Cereales y derivados', caloriesPer100g: 367, proteinPer100g: 13.5, carbsPer100g: 58.7, fatPer100g: 7.0, fiberPer100g: 10.0, calciumMgPer100g: 54, ironMgPer100g: 4.7, potassiumMgPer100g: 355, vitaminAMcgPer100g: 0, vitaminCMgPer100g: 0, source: 'BEDCA (Ministerio de Sanidad España)' },
  { id: 'bedca_4', name: 'Pan de trigo integral', category: 'Cereales y derivados', caloriesPer100g: 221, proteinPer100g: 9.0, carbsPer100g: 42.0, fatPer100g: 1.8, fiberPer100g: 7.5, calciumMgPer100g: 54, ironMgPer100g: 2.7, potassiumMgPer100g: 230, vitaminAMcgPer100g: 0, vitaminCMgPer100g: 0, source: 'BEDCA (Ministerio de Sanidad España)' },
  
  // Carnes y fiambres
  { id: 'bedca_5', name: 'Pechuga de pollo (sin piel)', category: 'Carnes y fiambres', caloriesPer100g: 110, proteinPer100g: 22.8, carbsPer100g: 0.0, fatPer100g: 2.1, fiberPer100g: 0.0, calciumMgPer100g: 12, ironMgPer100g: 1.1, potassiumMgPer100g: 330, vitaminAMcgPer100g: 16, vitaminCMgPer100g: 0, source: 'BEDCA (Ministerio de Sanidad España)' },
  { id: 'bedca_6', name: 'Pechuga de pavo', category: 'Carnes y fiambres', caloriesPer100g: 105, proteinPer100g: 24.0, carbsPer100g: 0.0, fatPer100g: 1.0, fiberPer100g: 0.0, calciumMgPer100g: 10, ironMgPer100g: 1.0, potassiumMgPer100g: 350, vitaminAMcgPer100g: 0, vitaminCMgPer100g: 0, source: 'BEDCA (Ministerio de Sanidad España)' },
  { id: 'bedca_7', name: 'Solomillo de ternera magra', category: 'Carnes y fiambres', caloriesPer100g: 131, proteinPer100g: 20.8, carbsPer100g: 0.0, fatPer100g: 5.2, fiberPer100g: 0.0, calciumMgPer100g: 8, ironMgPer100g: 2.4, potassiumMgPer100g: 340, vitaminAMcgPer100g: 0, vitaminCMgPer100g: 0, source: 'BEDCA (Ministerio de Sanidad España)' },
  
  // Pescados y mariscos
  { id: 'bedca_8', name: 'Salmón fresco', category: 'Pescados y mariscos', caloriesPer100g: 182, proteinPer100g: 18.4, carbsPer100g: 0.0, fatPer100g: 12.0, fiberPer100g: 0.0, calciumMgPer100g: 27, ironMgPer100g: 0.7, potassiumMgPer100g: 310, vitaminAMcgPer100g: 13, vitaminCMgPer100g: 0, source: 'BEDCA (Ministerio de Sanidad España)' },
  { id: 'bedca_9', name: 'Merluza fresca', category: 'Pescados y mariscos', caloriesPer100g: 64, proteinPer100g: 11.8, carbsPer100g: 0.0, fatPer100g: 1.8, fiberPer100g: 0.0, calciumMgPer100g: 33, ironMgPer100g: 1.0, potassiumMgPer100g: 290, vitaminAMcgPer100g: 0, vitaminCMgPer100g: 0, source: 'BEDCA (Ministerio de Sanidad España)' },

  // Huevos y lácteos
  { id: 'bedca_10', name: 'Huevo de gallina entero', category: 'Huevos', caloriesPer100g: 150, proteinPer100g: 12.5, carbsPer100g: 0.7, fatPer100g: 11.1, fiberPer100g: 0.0, calciumMgPer100g: 56, ironMgPer100g: 2.2, potassiumMgPer100g: 140, vitaminAMcgPer100g: 227, vitaminCMgPer100g: 0, source: 'BEDCA (Ministerio de Sanidad España)' },
  { id: 'usda_11', name: 'Yogur griego 0%', category: 'Lácteos y derivados', caloriesPer100g: 59, proteinPer100g: 10.3, carbsPer100g: 3.6, fatPer100g: 0.2, fiberPer100g: 0.0, calciumMgPer100g: 110, ironMgPer100g: 0.1, potassiumMgPer100g: 140, vitaminAMcgPer100g: 10, vitaminCMgPer100g: 0, source: 'USDA FoodData Central' },

  // Legumbres y Verduras
  { id: 'bedca_12', name: 'Garbanzos cocidos', category: 'Legumbres', caloriesPer100g: 138, proteinPer100g: 8.4, carbsPer100g: 19.3, fatPer100g: 2.6, fiberPer100g: 6.8, calciumMgPer100g: 58, ironMgPer100g: 2.2, potassiumMgPer100g: 290, vitaminAMcgPer100g: 3, vitaminCMgPer100g: 1, source: 'BEDCA (Ministerio de Sanidad España)' },
  { id: 'bedca_13', name: 'Lentejas cocidas', category: 'Legumbres', caloriesPer100g: 116, proteinPer100g: 9.0, carbsPer100g: 15.2, fatPer100g: 0.8, fiberPer100g: 4.2, calciumMgPer100g: 19, ironMgPer100g: 3.3, potassiumMgPer100g: 210, vitaminAMcgPer100g: 2, vitaminCMgPer100g: 1, source: 'BEDCA (Ministerio de Sanidad España)' },
  { id: 'bedca_14', name: 'Espinacas frescas', category: 'Verduras y hortalizas', caloriesPer100g: 22, proteinPer100g: 2.7, carbsPer100g: 1.2, fatPer100g: 0.3, fiberPer100g: 2.6, calciumMgPer100g: 117, ironMgPer100g: 2.7, potassiumMgPer100g: 550, vitaminAMcgPer100g: 580, vitaminCMgPer100g: 30, source: 'BEDCA (Ministerio de Sanidad España)' },
  { id: 'usda_15', name: 'Aceite de oliva virgen extra', category: 'Aceites y grasas', caloriesPer100g: 888, proteinPer100g: 0.0, carbsPer100g: 0.0, fatPer100g: 100.0, fiberPer100g: 0.0, calciumMgPer100g: 0, ironMgPer100g: 0.1, potassiumMgPer100g: 1, vitaminAMcgPer100g: 0, vitaminCMgPer100g: 0, source: 'USDA FoodData Central' }
];
