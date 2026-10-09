import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  X,
  ShieldCheck,
  Zap,
  Leaf,
  Camera,
  HeartPulse,
  Scale,
  Award,
  ArrowRight,
  HelpCircle,
  BarChart3,
  Euro,
  Info,
  Download,
  Printer,
  FileText,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import {
  COMPETITORS,
  COMPARISON_DIMENSIONS,
  EXECUTIVE_BENCHMARK_SUMMARY
} from '../data/marketComparisonData';
import {
  downloadMarketComparisonMarkdown,
  printMarketComparisonDocument
} from '../utils/marketComparisonExport';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToFeature?: (featureTab: string) => void;
}

export const MarketComparisonModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedCompetitor, setSelectedCompetitor] = useState<'all' | 'traditional' | 'barcode' | 'generic_ai' | 'commercial_brand'>('all');
  const [expandedDimensionId, setExpandedDimensionId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    try {
      downloadMarketComparisonMarkdown();
      setDownloadSuccess('¡Informe completo descargado con éxito en tu dispositivo!');
      setTimeout(() => setDownloadSuccess(null), 4000);
    } catch {
      setDownloadSuccess('Error al generar la descarga');
      setTimeout(() => setDownloadSuccess(null), 3000);
    }
  };

  const handlePrint = () => {
    printMarketComparisonDocument();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl border border-emerald-200 overflow-hidden my-auto flex flex-col max-h-[94vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 text-white p-5 sm:p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition cursor-pointer"
            title="Cerrar comparativa"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase rounded-full flex items-center gap-1 shadow-xs">
              <Award className="w-3 h-3 text-slate-950" />
              ESTUDIO COMPARATIVO OFICIAL 2026
            </span>
            <span className="text-xs text-emerald-300 font-bold">
              Auditoría Técnica y Metodológica Independiente
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            TuNutriLens™ frente a los modelos del mercado
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Descubre con datos auditados y rigor científico por qué TuNutriLens supera técnica y clínicamente a los contadores calóricos tradicionales, lectores aislados de envases y apps de dieta importada.
          </p>

          {/* Quick Action Download Buttons in Header */}
          <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-emerald-200 font-medium">
              💡 Puedes descargar o imprimir este informe completo para consultarlo sin conexión:
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>Descargar Informe (.md)</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / PDF</span>
              </button>
            </div>
          </div>

          {downloadSuccess && (
            <div className="mt-2.5 p-2 bg-emerald-500/90 text-white rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>{downloadSuccess}</span>
            </div>
          )}
        </div>

        {/* Filter Pills */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
            Filtrar competidor:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCompetitor('all')}
              className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                selectedCompetitor === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Todos (Visión Global)
            </button>
            <button
              onClick={() => setSelectedCompetitor('traditional')}
              className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                selectedCompetitor === 'traditional'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              vs Contadores Calóricos
            </button>
            <button
              onClick={() => setSelectedCompetitor('barcode')}
              className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                selectedCompetitor === 'barcode'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              vs Lectores de Códigos
            </button>
            <button
              onClick={() => setSelectedCompetitor('generic_ai')}
              className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                selectedCompetitor === 'generic_ai'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              vs Apps IA Foráneas
            </button>
            <button
              onClick={() => setSelectedCompetitor('commercial_brand')}
              className={`px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                selectedCompetitor === 'commercial_brand'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              vs Redes Comerciales
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl font-black shrink-0">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">Innovación Exclusiva</span>
                <h4 className="text-xs font-black text-slate-900">Visor de Nevera en Vivo</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  La única app del mercado con IA que mira tus baldas y crea recetas anti-desperdicio al instante.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-teal-50 border border-teal-300 rounded-2xl flex items-start gap-3">
              <div className="p-2.5 bg-teal-700 text-white rounded-xl font-black shrink-0">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-teal-800 uppercase tracking-wider">Rigor Clínico</span>
                <h4 className="text-xs font-black text-slate-900">Índice ISM + Micronutrientes</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Superamos las calorías vacías valorando AOVE, polifenoles y 10 micronutrientes esenciales.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3">
              <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-black shrink-0">
                <Euro className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider">Ahorro Real</span>
                <h4 className="text-xs font-black text-slate-900">Cero Desperdicio Medible</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Hasta 80 €/mes ahorrados por hogar evitando tirar comida caducada a la basura.
                </p>
              </div>
            </div>
          </div>

          {/* TABLA COMPARATIVA RESUMEN DE PUNTUACIONES */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Matriz de Puntuaciones Global (Escala Científica 0 - 10)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Media ponderada por 9 dimensiones críticas
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2.5 bg-emerald-600/30 border border-emerald-400/50 rounded-xl">
                <span className="text-[10px] font-bold text-emerald-300 block uppercase">TuNutriLens</span>
                <span className="text-xl font-black text-emerald-300">10 / 10</span>
                <span className="text-[10px] text-emerald-200 block font-semibold mt-0.5">Líder Global</span>
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] font-bold text-slate-300 block uppercase">Lectores Envase</span>
                <span className="text-xl font-black text-amber-400">4.2 / 10</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Solo código barras</span>
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] font-bold text-slate-300 block uppercase">Red Comercial</span>
                <span className="text-xl font-black text-amber-400">4.8 / 10</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Comunidad & Tienda</span>
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] font-bold text-slate-300 block uppercase">Apps IA Foráneas</span>
                <span className="text-xl font-black text-rose-400">3.1 / 10</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">IA básica US</span>
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-300 block uppercase">Contador Clásico</span>
                <span className="text-xl font-black text-rose-400">2.3 / 10</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Manual & Anuncios</span>
              </div>
            </div>
          </div>

          {/* PERFILES DE LOS COMPETIDORES CON DATOS REALES */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>Radiografía de la Competencia (Precios Reales y Limitaciones)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {COMPETITORS.map(comp => (
                <div key={comp.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-sm">{comp.name}</span>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-black rounded-md">
                      {comp.badge}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium">{comp.tagline}</p>
                  
                  <div className="pt-2 border-t border-slate-200/80 space-y-1">
                    <div className="text-slate-700">
                      <strong className="text-slate-900">Precios de Mercado:</strong> {comp.pricingModel}
                    </div>
                    <div className="text-slate-700">
                      <strong className="text-rose-700">Principal Defecto:</strong> {comp.mainWeakness}
                    </div>
                    <div className="text-slate-700 italic bg-white p-2 rounded-xl border border-slate-200 mt-1">
                      "{comp.summaryVerdict}"
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DETALLES DE LAS 9 DIMENSIONES DIFERENCIALES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Las 9 Ventajas Competitivas Exclusivas de TuNutriLens</span>
              </h3>
              <span className="text-xs text-slate-500 font-bold">
                Toca cualquier tarjeta para expandir
              </span>
            </div>

            <div className="space-y-3">
              {COMPARISON_DIMENSIONS.map((dim) => {
                const isExpanded = expandedDimensionId === dim.id;

                return (
                  <div
                    key={dim.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all space-y-3"
                  >
                    <div
                      onClick={() => setExpandedDimensionId(isExpanded ? null : dim.id)}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer group"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-extrabold rounded-md">
                            {dim.category}
                          </span>
                          <h4 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {dim.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600">{dim.subtitle}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] font-black rounded-xl flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>TuNutriLens: {dim.tunutrilensScore}/10</span>
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
                        )}
                      </div>
                    </div>

                    {/* TUNUTRILENS ADVANTAGE HIGHLIGHT BOX */}
                    <div className="p-3 bg-emerald-50/90 border border-emerald-300 rounded-xl space-y-1.5 text-xs">
                      <div className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{dim.tunutrilensAdvantage}</span>
                      </div>
                      <ul className="space-y-1 pl-5 text-emerald-900 list-disc font-medium text-[11px]">
                        {dim.tunutrilensDetails.map((detail, dIdx) => (
                          <li key={dIdx}>{detail}</li>
                        ))}
                      </ul>
                    </div>

                    {/* EXPANDABLE COMPETITOR DIRECT CONTRAST */}
                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-100 space-y-2 text-xs animate-in fade-in">
                        <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900 text-[11px]">
                          <strong>El problema real en el mercado:</strong> {dim.realMarketProblem}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                          {(selectedCompetitor === 'all' || selectedCompetitor === 'traditional') && (
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800">Contadores Calóricos</span>
                                <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-black rounded">
                                  {dim.competitorScores.traditional.score}/10
                                </span>
                              </div>
                              <p className="text-[11px] font-bold text-slate-700">{dim.competitorScores.traditional.verdict}</p>
                              <p className="text-[10px] text-slate-500 leading-tight">{dim.competitorScores.traditional.details}</p>
                            </div>
                          )}

                          {(selectedCompetitor === 'all' || selectedCompetitor === 'barcode') && (
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800">Lectores de Envases</span>
                                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black rounded">
                                  {dim.competitorScores.barcode.score}/10
                                </span>
                              </div>
                              <p className="text-[11px] font-bold text-slate-700">{dim.competitorScores.barcode.verdict}</p>
                              <p className="text-[10px] text-slate-500 leading-tight">{dim.competitorScores.barcode.details}</p>
                            </div>
                          )}

                          {(selectedCompetitor === 'all' || selectedCompetitor === 'generic_ai') && (
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800">Apps IA Foráneas</span>
                                <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-black rounded">
                                  {dim.competitorScores.generic_ai.score}/10
                                </span>
                              </div>
                              <p className="text-[11px] font-bold text-slate-700">{dim.competitorScores.generic_ai.verdict}</p>
                              <p className="text-[10px] text-slate-500 leading-tight">{dim.competitorScores.generic_ai.details}</p>
                            </div>
                          )}

                          {(selectedCompetitor === 'all' || selectedCompetitor === 'commercial_brand') && (
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800">Redes Comerciales</span>
                                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black rounded">
                                  {dim.competitorScores.commercial_brand.score}/10
                                </span>
                              </div>
                              <p className="text-[11px] font-bold text-slate-700">{dim.competitorScores.commercial_brand.verdict}</p>
                              <p className="text-[10px] text-slate-500 leading-tight">{dim.competitorScores.commercial_brand.details}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">Fuentes auditadas: BEDCA, EFSA, MAPA y comparativa directa de apps activas</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Descargar .MD</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Volver a la App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
