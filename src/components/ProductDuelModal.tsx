import React, { useState } from 'react';
import { SupermarketProductAnalysis } from './SupermarketProductAnalysisCard';
import {
  X,
  Swords,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Wheat,
  Droplets,
  PlusCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  savedScans: SupermarketProductAnalysis[];
  onSaveAsMeal: (prod: SupermarketProductAnalysis) => void;
  initialProduct?: SupermarketProductAnalysis | null;
}

// Sample market staples for quick battle if user has few scans
const defaultBenchmarkProducts: SupermarketProductAnalysis[] = [
  {
    id: 'bench_1',
    timestamp: 1700000000000,
    productName: 'Yogur Griego Natural (Sin Azúcar)',
    brand: 'Lácteos Artesanales',
    category: 'Lácteos',
    verdict: 'excelente',
    verdictTitle: '✅ EXCELENTE ELECCIÓN',
    verdictReason: 'Fermentación láctica pura, rico en proteínas saciantes y sin azúcares añadidos.',
    trafficLightScore: 'verde_oscuro',
    trafficLightLabel: 'Excelente',
    novaGroup: 1,
    novaLabel: 'NOVA 1: Sin procesar',
    healthScore: 9.5,
    calories100g: 115,
    protein100g: 9.0,
    carbs100g: 3.5,
    fat100g: 7.0,
    sugar100g: 3.2,
    saturatedFat100g: 4.8,
    salt100g: 0.1,
    ingredientsList: ['Leche pasteurizada de vaca', 'Nata', 'Fermentos lácticos vivos'],
    additivesFound: [],
    mediterraneanQualities: ['Probióticos naturales beneficiosos para microbiota', 'Sin edulcorantes'],
    warnings: [],
    healthyAlternative: 'Consumir con un puñado de nueces o frambuesas frescas.',
  },
  {
    id: 'bench_2',
    timestamp: 1700000000000,
    productName: 'Yogur Sabor Fresa Azucarado',
    brand: 'Marca Blanca Industrial',
    category: 'Lácteos',
    verdict: 'evitar',
    verdictTitle: '❌ ULTRA-PROCESADO',
    verdictReason: 'Contiene 14g de azúcares libres por envase, almidones modificados y aromas artificiales.',
    trafficLightScore: 'rojo',
    trafficLightLabel: 'Evitar / Ultraprocesado',
    novaGroup: 4,
    novaLabel: 'NOVA 4: Ultraprocesado',
    healthScore: 3.5,
    calories100g: 135,
    protein100g: 3.0,
    carbs100g: 16.5,
    fat100g: 2.8,
    sugar100g: 14.2,
    saturatedFat100g: 1.8,
    salt100g: 0.25,
    ingredientsList: ['Leche desnatada', 'Azúcar añadido (12%)', 'Almidón modificado E-1422', 'Colorante carmín E-120', 'Aromas'],
    additivesFound: [
      { code: 'E-1422', name: 'Almidón modificado', risk: 'medio' },
      { code: 'E-120', name: 'Colorante carmín', risk: 'medio' }
    ],
    mediterraneanQualities: [],
    warnings: ['Pico glucémico elevado', 'Más de 3 terrones de azúcar por ración'],
    healthyAlternative: 'Yogur natural con fruta picada por ti.',
  },
  {
    id: 'bench_3',
    timestamp: 1700000000000,
    productName: 'Pan 100% Integral de Masa Madre',
    brand: 'Panadería Tradicional',
    category: 'Panes',
    verdict: 'excelente',
    verdictTitle: '✅ EXCELENTE ELECCIÓN',
    verdictReason: 'Grano entero con todo el salvado y germen. Fermentación lenta con índice glucémico moderado.',
    trafficLightScore: 'verde',
    trafficLightLabel: 'Saludable',
    novaGroup: 2,
    novaLabel: 'NOVA 2: Procesado culinario',
    healthScore: 9.0,
    calories100g: 235,
    protein100g: 9.5,
    carbs100g: 44.0,
    fat100g: 2.2,
    sugar100g: 1.5,
    saturatedFat100g: 0.4,
    salt100g: 1.1,
    ingredientsList: ['Harina integral de trigo 100%', 'Agua', 'Masa madre de cultivo', 'Sal marina', 'Levadura'],
    additivesFound: [],
    mediterraneanQualities: ['Alto contenido en fibra fermentable', 'Sin azúcares añadidos'],
    warnings: [],
    healthyAlternative: 'Ideal tostado con tomate rallado y AOVE.',
  },
  {
    id: 'bench_4',
    timestamp: 1700000000000,
    productName: 'Pan de Molde Blanco Familiar',
    brand: 'Marca Industrial',
    category: 'Panes',
    verdict: 'ocasional',
    verdictTitle: '⚠️ CONSUMO OCASIONAL',
    verdictReason: 'Harina refinada sin fibra, con aceite vegetal refinado y emulsionantes para retrasar el endurecimiento.',
    trafficLightScore: 'ambar',
    trafficLightLabel: 'Consumo Equilibrado / Moderar',
    novaGroup: 4,
    novaLabel: 'NOVA 4: Ultraprocesado',
    healthScore: 4.8,
    calories100g: 260,
    protein100g: 7.8,
    carbs100g: 48.0,
    fat100g: 3.8,
    sugar100g: 4.5,
    saturatedFat100g: 1.2,
    salt100g: 1.3,
    ingredientsList: ['Harina de trigo refinada', 'Agua', 'Aceite de girasol refinado (3%)', 'Azúcar', 'Emulsionantes E-471', 'Conservantes E-282'],
    additivesFound: [
      { code: 'E-471', name: 'Mono y diglicéridos', risk: 'bajo' },
      { code: 'E-282', name: 'Propionato de calcio', risk: 'medio' }
    ],
    mediterraneanQualities: [],
    warnings: ['Poco saciante', 'Harina refinada que eleva rápidamente la insulina'],
    healthyAlternative: 'Sustituir por pan 100% integral.',
  },
];

export const ProductDuelModal: React.FC<Props> = ({
  isOpen,
  onClose,
  savedScans,
  onSaveAsMeal,
  initialProduct,
}) => {
  // Pool of available products
  const allProducts = [...(savedScans || []), ...defaultBenchmarkProducts];

  // Default product A & B
  const [productA, setProductA] = useState<SupermarketProductAnalysis>(() => {
    return initialProduct || allProducts[0] || defaultBenchmarkProducts[0];
  });

  const [productB, setProductB] = useState<SupermarketProductAnalysis>(() => {
    return (
      allProducts.find((p) => p.id !== productA.id && p.category === productA.category) ||
      defaultBenchmarkProducts[1]
    );
  });

  if (!isOpen) return null;

  // Evaluation logic
  const scoreA = (productA.healthScore || 5) * 10 - (productA.sugar100g || 0) * 2 - (productA.novaGroup || 1) * 5;
  const scoreB = (productB.healthScore || 5) * 10 - (productB.sugar100g || 0) * 2 - (productB.novaGroup || 1) * 5;

  const isAWinner = scoreA >= scoreB;
  const winner = isAWinner ? productA : productB;
  const loser = isAWinner ? productB : productA;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-sm">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight flex items-center gap-2">
                <span>Duelo Saludable: Comparativa Frente a Frente</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Descubre en 2 segundos qué producto es más mediterráneo y menos procesado
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="space-y-1">
            <label className="text-[11px] font-black text-blue-900 uppercase tracking-wider block">
              🥊 Producto A:
            </label>
            <select
              value={productA.id}
              onChange={(e) => {
                const found = allProducts.find((p) => p.id === e.target.value);
                if (found) setProductA(found);
              }}
              className="w-full text-xs font-bold p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.productName} ({p.brand || 'Super'}) - NOVA {p.novaGroup}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-black text-rose-900 uppercase tracking-wider block">
              🥊 Producto B:
            </label>
            <select
              value={productB.id}
              onChange={(e) => {
                const found = allProducts.find((p) => p.id === e.target.value);
                if (found) setProductB(found);
              }}
              className="w-full text-xs font-bold p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {allProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.productName} ({p.brand || 'Super'}) - NOVA {p.novaGroup}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Winner Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white rounded-2xl p-4 shadow-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-inner">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider block">
                GANADOR POR CALIDAD MEDITERRÁNEA
              </span>
              <h4 className="text-sm sm:text-base font-black text-white">
                {winner.productName}
              </h4>
              <p className="text-xs text-emerald-100 font-medium line-clamp-1">
                {winner.verdictReason}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onSaveAsMeal(winner);
              onClose();
            }}
            className="px-3.5 py-2 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-black rounded-xl shadow-xs transition shrink-0 active:scale-95 cursor-pointer"
          >
            Añadir Ganador
          </button>
        </div>

        {/* Comparative Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 uppercase font-black text-[10px]">
              <tr>
                <th className="p-2.5 sm:p-3">Indicador Clave</th>
                <th className="p-2.5 sm:p-3 text-center bg-blue-50/70 text-blue-950">
                  {productA.productName.slice(0, 20)}...
                </th>
                <th className="p-2.5 sm:p-3 text-center bg-rose-50/70 text-rose-950">
                  {productB.productName.slice(0, 20)}...
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {/* Grado de Procesamiento NOVA */}
              <tr>
                <td className="p-2.5 sm:p-3 font-bold text-slate-700">Clasificación NOVA</td>
                <td className="p-2.5 sm:p-3 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                      productA.novaGroup <= 2
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    NOVA {productA.novaGroup}
                  </span>
                </td>
                <td className="p-2.5 sm:p-3 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                      productB.novaGroup <= 2
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    NOVA {productB.novaGroup}
                  </span>
                </td>
              </tr>

              {/* Semáforo de Salud */}
              <tr>
                <td className="p-2.5 sm:p-3 font-bold text-slate-700">Semáforo de Salud</td>
                <td className="p-2.5 sm:p-3 text-center font-black text-xs">
                  <span className={`px-2 py-0.5 rounded-md text-white font-black inline-flex items-center gap-1 ${
                    productA.verdict === 'excelente' ? 'bg-emerald-600' : productA.verdict === 'ocasional' ? 'bg-amber-500' : 'bg-rose-600'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span>{productA.verdict === 'excelente' ? 'Verde (Excelente)' : productA.verdict === 'ocasional' ? 'Ámbar (Medio)' : 'Rojo (Evitar)'}</span>
                  </span>
                </td>
                <td className="p-2.5 sm:p-3 text-center font-black text-xs">
                  <span className={`px-2 py-0.5 rounded-md text-white font-black inline-flex items-center gap-1 ${
                    productB.verdict === 'excelente' ? 'bg-emerald-600' : productB.verdict === 'ocasional' ? 'bg-amber-500' : 'bg-rose-600'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span>{productB.verdict === 'excelente' ? 'Verde (Excelente)' : productB.verdict === 'ocasional' ? 'Ámbar (Medio)' : 'Rojo (Evitar)'}</span>
                  </span>
                </td>
              </tr>

              {/* Azúcares por 100g */}
              <tr>
                <td className="p-2.5 sm:p-3 font-bold text-slate-700">Azúcares (100g)</td>
                <td className={`p-2.5 sm:p-3 text-center font-black ${productA.sugar100g > 10 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {productA.sugar100g} g
                  {productA.sugar100g < productB.sugar100g && ' ✨ Menos'}
                </td>
                <td className={`p-2.5 sm:p-3 text-center font-black ${productB.sugar100g > 10 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {productB.sugar100g} g
                  {productB.sugar100g < productA.sugar100g && ' ✨ Menos'}
                </td>
              </tr>

              {/* Proteína por 100g */}
              <tr>
                <td className="p-2.5 sm:p-3 font-bold text-slate-700">Proteína (100g)</td>
                <td className="p-2.5 sm:p-3 text-center font-black text-teal-800">
                  {productA.protein100g} g
                </td>
                <td className="p-2.5 sm:p-3 text-center font-black text-teal-800">
                  {productB.protein100g} g
                </td>
              </tr>

              {/* Grasa Saturada */}
              <tr>
                <td className="p-2.5 sm:p-3 font-bold text-slate-700">Grasas Saturadas</td>
                <td className="p-2.5 sm:p-3 text-center">{productA.saturatedFat100g} g</td>
                <td className="p-2.5 sm:p-3 text-center">{productB.saturatedFat100g} g</td>
              </tr>

              {/* Sal */}
              <tr>
                <td className="p-2.5 sm:p-3 font-bold text-slate-700">Sal (100g)</td>
                <td className="p-2.5 sm:p-3 text-center">{productA.salt100g} g</td>
                <td className="p-2.5 sm:p-3 text-center">{productB.salt100g} g</td>
              </tr>

              {/* Aditivos críticos */}
              <tr>
                <td className="p-2.5 sm:p-3 font-bold text-slate-700">Aditivos Encontrados</td>
                <td className="p-2.5 sm:p-3 text-center text-[11px]">
                  {productA.additivesFound?.length ? (
                    <span className="text-amber-700 font-bold">{productA.additivesFound.length} aditivos</span>
                  ) : (
                    <span className="text-emerald-700 font-bold">0 (Limpio)</span>
                  )}
                </td>
                <td className="p-2.5 sm:p-3 text-center text-[11px]">
                  {productB.additivesFound?.length ? (
                    <span className="text-amber-700 font-bold">{productB.additivesFound.length} aditivos</span>
                  ) : (
                    <span className="text-emerald-700 font-bold">0 (Limpio)</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Recommendation tip */}
        <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Regla de oro TuNutriLens:</strong> Elige siempre productos NOVA 1 o 2 con menos de 5g de azúcar por 100g y sin aditivos artificiales para proteger tu microbiota intestinal y prevenir la inflamación celular.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cerrar Comparador
          </button>
        </div>

      </div>
    </div>
  );
};
