import React, { useState } from 'react';
import { SupermarketProductAnalysis, SupermarketProductAnalysisCard } from './SupermarketProductAnalysisCard';
import { ProductDuelModal } from './ProductDuelModal';
import { UserProfile, MealAnalysis } from '../types';
import {
  Bookmark,
  Search,
  Trash2,
  ExternalLink,
  PlusCircle,
  Filter,
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  Info,
  Flame,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Barcode,
  Grid,
  List,
  Swords
} from 'lucide-react';

interface Props {
  savedScans: SupermarketProductAnalysis[];
  onRemoveSavedScan: (id: string) => void;
  onSaveAsMeal: (product: SupermarketProductAnalysis, mealType: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack') => void;
  onSaveMealAnalysis: (meal: MealAnalysis) => void;
  userProfile?: UserProfile;
  onNavigateToScannerMode?: () => void;
}

export const SavedScansGallery: React.FC<Props> = ({
  savedScans,
  onRemoveSavedScan,
  onSaveAsMeal,
  onSaveMealAnalysis,
  userProfile,
  onNavigateToScannerMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVerdictFilter, setSelectedVerdictFilter] = useState<'todos' | 'excelente' | 'ocasional' | 'evitar'>('todos');
  const [selectedScanDetail, setSelectedScanDetail] = useState<SupermarketProductAnalysis | null>(null);
  const [mealTypeToLog, setMealTypeToLog] = useState<'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack'>('Almuerzo');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDuelModalOpen, setIsDuelModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredScans = savedScans.filter((scan) => {
    const matchesQuery =
      scan.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (scan.brand && scan.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      scan.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVerdict =
      selectedVerdictFilter === 'todos' || scan.verdict === selectedVerdictFilter;

    return matchesQuery && matchesVerdict;
  });

  const handleLogScanToDiary = (scan: SupermarketProductAnalysis) => {
    onSaveAsMeal(scan, mealTypeToLog);
    showToast(`" ${scan.productName}" añadido a tu diario como ${mealTypeToLog}`);
  };

  if (selectedScanDetail) {
    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setSelectedScanDetail(null)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Galería</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                handleLogScanToDiary(selectedScanDetail);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Añadir a mi Diario</span>
            </button>

            <button
              onClick={() => {
                onRemoveSavedScan(selectedScanDetail.id);
                setSelectedScanDetail(null);
                showToast('Producto eliminado de la galería');
              }}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
              title="Eliminar de la galería"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <SupermarketProductAnalysisCard
          product={selectedScanDetail}
          userProfile={userProfile}
          onSaveAsMeal={(prod) => handleLogScanToDiary(prod)}
          onSaveMealAnalysis={onSaveMealAnalysis}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs font-black px-4 py-3 rounded-2xl shadow-xl border border-amber-400 flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl shadow-xs">
            <Bookmark className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Galería de Escaneos Guardados
              </h2>
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-extrabold text-[10px] rounded-md border border-amber-200">
                {savedScans.length} {savedScans.length === 1 ? 'Producto' : 'Productos'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Guarda tus análisis de productos de supermercado sin necesidad de cargarlos a tu diario. Rescátalos cuando vayas a comprar o a cocinar.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsDuelModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer active:scale-95 border border-amber-400"
            title="Comparar dos productos frente a frente"
          >
            <Swords className="w-4 h-4" />
            <span>Duelo Saludable (Comparar 2)</span>
          </button>

          {onNavigateToScannerMode && (
            <button
              onClick={onNavigateToScannerMode}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
            >
              <Barcode className="w-4 h-4" />
              <span>Escanear Producto</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Meal Type Assignment Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar en mis escaneos por nombre, marca o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
            />
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs transition ${
                viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vista Rejilla"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-2 rounded-lg text-xs transition ${
                viewMode === 'compact' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vista Lista Compacta"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Verdict Filters & Meal Type Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/60 text-xs">
          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filtrar:
            </span>
            {(
              [
                { id: 'todos', label: 'Todos' },
                { id: 'excelente', label: '✅ Excelentes' },
                { id: 'ocasional', label: '⚠️ Ocasionales' },
                { id: 'evitar', label: '⛔ Evitar' },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedVerdictFilter(f.id)}
                className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedVerdictFilter === f.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Quick Meal Type Selector for direct diary log */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600 text-[11px]">Asignar como:</span>
            <select
              value={mealTypeToLog}
              onChange={(e) => setMealTypeToLog(e.target.value as any)}
              className="px-2.5 py-1 text-xs font-bold bg-white text-slate-800 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Desayuno">Desayuno</option>
              <option value="Almuerzo">Almuerzo</option>
              <option value="Cena">Cena</option>
              <option value="Snack">Snack</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gallery Cards List */}
      {filteredScans.length === 0 ? (
        <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-300">
            <Bookmark className="w-7 h-7 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">
              {searchQuery || selectedVerdictFilter !== 'todos'
                ? 'No hay escaneos que coincidan con tu búsqueda'
                : 'No tienes escaneos guardados en tu galería'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery || selectedVerdictFilter !== 'todos'
                ? 'Prueba a cambiar el filtro de búsqueda o borra las palabras clave.'
                : 'Cuando escanees la etiqueta de un producto en el supermercado, pulsa "Guardar en Galería" para tenerlo disponible aquí sin agregarlo a tu diario.'}
            </p>
          </div>
          {onNavigateToScannerMode && (
            <button
              onClick={onNavigateToScannerMode}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition inline-flex items-center gap-2 cursor-pointer"
            >
              <Barcode className="w-4 h-4" />
              <span>Escanear Primer Producto</span>
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredScans.map((scan) => {
            const isExcellent = scan.verdict === 'excelente';
            const isOcasional = scan.verdict === 'ocasional';

            return (
              <div
                key={scan.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-4 space-y-3 flex flex-col justify-between group"
              >
                {/* Top Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {scan.imageUri ? (
                        <img
                          src={scan.imageUri}
                          alt={scan.productName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                          <Barcode className="w-6 h-6" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {scan.productName}
                        </h4>
                        {scan.brand && (
                          <span className="text-[11px] font-bold text-slate-500 block">
                            {scan.brand}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-base font-black text-slate-900">
                        {scan.healthScore}<span className="text-[10px] text-slate-400">/10</span>
                      </div>
                      <span className="text-[9px] uppercase font-extrabold text-slate-400 block">Salud</span>
                    </div>
                  </div>

                  {/* Verdict & Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase ${
                        isExcellent
                          ? 'bg-emerald-100 text-emerald-800'
                          : isOcasional
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isExcellent ? '✅ Excelente' : isOcasional ? '⚠️ Ocasional' : '⛔ Evitar'}
                    </span>

                    <span className={`px-2 py-0.5 text-[10px] font-black rounded-md flex items-center gap-1 border ${
                      isExcellent
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : isOcasional
                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                        : 'bg-rose-50 text-rose-900 border-rose-300'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isExcellent ? 'bg-emerald-500' : isOcasional ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                      <span>{isExcellent ? 'Semáforo Verde' : isOcasional ? 'Semáforo Ámbar' : 'Semáforo Rojo'}</span>
                    </span>

                    <span className="px-2 py-0.5 bg-sky-50 text-sky-800 font-bold text-[10px] rounded-md border border-sky-200">
                      NOVA {scan.novaGroup}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {scan.verdictReason}
                  </p>

                  {/* Quick Macros Summary */}
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 grid grid-cols-4 gap-1 text-center text-[10px]">
                    <div>
                      <span className="text-slate-400 font-semibold block">Kcal</span>
                      <strong className="text-slate-900 font-black">{scan.calories100g}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Prot</span>
                      <strong className="text-emerald-700 font-black">{scan.protein100g}g</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">HC</span>
                      <strong className="text-sky-700 font-black">{scan.carbs100g}g</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Grasa</span>
                      <strong className="text-amber-700 font-black">{scan.fat100g}g</strong>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedScanDetail(scan)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ver Ficha</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleLogScanToDiary(scan)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition flex items-center gap-1 cursor-pointer"
                      title={`Añadir a mi diario como ${mealTypeToLog}`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Al Diario</span>
                    </button>

                    <button
                      onClick={() => {
                        onRemoveSavedScan(scan.id);
                        showToast('Producto eliminado de la galería');
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Eliminar de guardados"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Compact List View */
        <div className="space-y-2">
          {filteredScans.map((scan) => (
            <div
              key={scan.id}
              className="bg-white p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                {scan.imageUri ? (
                  <img
                    src={scan.imageUri}
                    alt={scan.productName}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <Barcode className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black text-slate-900 truncate">{scan.productName}</h4>
                    <span className={`px-2 py-0.5 text-[9px] font-black rounded-md flex items-center gap-1 border ${
                      scan.verdict === 'excelente'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : scan.verdict === 'ocasional'
                        ? 'bg-amber-50 text-amber-900 border-amber-300'
                        : 'bg-rose-50 text-rose-900 border-rose-300'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        scan.verdict === 'excelente' ? 'bg-emerald-500' : scan.verdict === 'ocasional' ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                      <span>{scan.verdict === 'excelente' ? 'Semáforo Verde' : scan.verdict === 'ocasional' ? 'Semáforo Ámbar' : 'Semáforo Rojo'}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {scan.brand ? `${scan.brand} • ` : ''}{scan.calories100g} kcal/100g | Prot: {scan.protein100g}g | Azúcar: {scan.sugar100g}g
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setSelectedScanDetail(scan)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition cursor-pointer"
                >
                  Ver
                </button>
                <button
                  onClick={() => handleLogScanToDiary(scan)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition flex items-center gap-1 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Al Diario</span>
                </button>
                <button
                  onClick={() => {
                    onRemoveSavedScan(scan.id);
                    showToast('Producto eliminado de la galería');
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Duelo Saludable Modal */}
      <ProductDuelModal
        isOpen={isDuelModalOpen}
        onClose={() => setIsDuelModalOpen(false)}
        savedScans={savedScans}
        onSaveAsMeal={(prod) => {
          handleLogScanToDiary(prod);
          setIsDuelModalOpen(false);
        }}
      />
    </div>
  );
};
