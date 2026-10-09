import React, { useState } from 'react';
import { SEASONAL_CALENDAR, MonthSeasonalData } from '../data/seasonalCalendar';
import {
  Apple,
  Fish,
  Nut,
  CheckCircle2,
  Lightbulb,
  Sun,
  Snowflake,
  Flower2,
  Leaf,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export const SeasonalCalendarView: React.FC = () => {
  // Default to current month (0 - 11)
  const currentRealMonthIndex = new Date().getMonth();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(currentRealMonthIndex);
  const [activeCategory, setActiveCategory] = useState<'todos' | 'frutas' | 'verduras' | 'pescados' | 'frutosSecos'>('todos');

  const monthData: MonthSeasonalData = SEASONAL_CALENDAR[selectedMonthIndex] || SEASONAL_CALENDAR[0];

  const isCurrentMonth = selectedMonthIndex === currentRealMonthIndex;

  const handlePrevMonth = () => {
    setSelectedMonthIndex((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonthIndex((prev) => (prev === 11 ? 0 : prev + 1));
  };

  const getSeasonIcon = (season: MonthSeasonalData['season']) => {
    switch (season) {
      case 'Invierno':
        return <Snowflake className="w-5 h-5 text-sky-500" />;
      case 'Primavera':
        return <Flower2 className="w-5 h-5 text-emerald-500" />;
      case 'Verano':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'Otoño':
        return <Leaf className="w-5 h-5 text-orange-500" />;
    }
  };

  const filteredFruits = monthData.fruits;
  const filteredGreens = monthData.greensAndVegetables;
  const filteredFish = monthData.fishAndSeafood;
  const filteredNuts = monthData.nutsAndLegumes;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100/80 space-y-6">
      {/* Month Selector Bar */}
      <div className="flex items-center justify-between bg-slate-50 p-2 rounded-2xl border border-slate-200/80">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-white rounded-xl transition text-slate-600 hover:text-emerald-700 shadow-xs"
          title="Mes anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Desktop months buttons */}
        <div className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
          {SEASONAL_CALENDAR.map((m) => {
            const isSelected = m.monthIndex === selectedMonthIndex;
            const isCurrent = m.monthIndex === currentRealMonthIndex;
            return (
              <button
                key={m.monthIndex}
                onClick={() => setSelectedMonthIndex(m.monthIndex)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : isCurrent
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                <span>{m.monthName}</span>
                {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
              </button>
            );
          })}
        </div>

        {/* Mobile Month Select Dropdown */}
        <div className="lg:hidden flex items-center gap-2">
          <select
            value={selectedMonthIndex}
            onChange={(e) => setSelectedMonthIndex(Number(e.target.value))}
            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
          >
            {SEASONAL_CALENDAR.map((m) => (
              <option key={m.monthIndex} value={m.monthIndex}>
                {m.monthName} {m.monthIndex === currentRealMonthIndex ? '(Mes Actual)' : ''}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-white rounded-xl transition text-slate-600 hover:text-emerald-700 shadow-xs"
          title="Mes siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Selected Month Banner */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold flex items-center gap-1">
                {getSeasonIcon(monthData.season)}
                <span className="text-white">{monthData.season}</span>
              </span>
              {isCurrentMonth && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-xs font-bold shadow-xs">
                  ★ Mes Actual
                </span>
              )}
            </div>
            <h3 className="text-3xl font-black tracking-tight">{monthData.monthName} en España</h3>
            <p className="text-emerald-100 text-sm mt-1 max-w-2xl font-medium">
              "{monthData.tagline}"
            </p>
          </div>

          <button
            onClick={() => setSelectedMonthIndex(currentRealMonthIndex)}
            className={`self-start md:self-auto px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs whitespace-nowrap ${
              isCurrentMonth
                ? 'bg-white/20 text-white cursor-default'
                : 'bg-white text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            {isCurrentMonth ? 'Viendo Mes Actual' : 'Ir al Mes Actual'}
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory('todos')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeCategory === 'todos'
              ? 'bg-slate-800 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Todos los Grupos
        </button>
        <button
          onClick={() => setActiveCategory('verduras')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeCategory === 'verduras'
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          <span>Hojas Verdes y Verduras ({filteredGreens.length})</span>
        </button>
        <button
          onClick={() => setActiveCategory('frutosSecos')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeCategory === 'frutosSecos'
              ? 'bg-amber-600 text-white'
              : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          <Nut className="w-3.5 h-3.5" />
          <span>Frutos Secos y Legumbres ({filteredNuts.length})</span>
        </button>
        <button
          onClick={() => setActiveCategory('frutas')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeCategory === 'frutas'
              ? 'bg-rose-600 text-white'
              : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
          }`}
        >
          <Apple className="w-3.5 h-3.5" />
          <span>Frutas ({filteredFruits.length})</span>
        </button>
        <button
          onClick={() => setActiveCategory('pescados')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeCategory === 'pescados'
              ? 'bg-sky-600 text-white'
              : 'bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100'
          }`}
        >
          <Fish className="w-3.5 h-3.5" />
          <span>Pescados y Mariscos ({filteredFish.length})</span>
        </button>
      </div>

      {/* Grid of Seasonal Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Hojas Verdes & Verduras */}
        {(activeCategory === 'todos' || activeCategory === 'verduras') && (
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Hojas Verdes y Verduras</h4>
                  <p className="text-xs text-slate-500">Rúcula, canónigos, espinacas, germinados y hortalizas</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                {filteredGreens.length} de temporada
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {filteredGreens.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No hay coincidencias para la búsqueda.</p>
              ) : (
                filteredGreens.map((item, idx) => {
                  const isHighlight =
                    item.toLowerCase().includes('rúcula') ||
                    item.toLowerCase().includes('canónigos') ||
                    item.toLowerCase().includes('germinados') ||
                    item.toLowerCase().includes('espinacas');

                  return (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium ${
                        isHighlight
                          ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                          : 'bg-white text-slate-700 border border-emerald-200'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isHighlight ? 'text-emerald-200' : 'text-emerald-500'}`} />
                      <span>{item}</span>
                    </span>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Frutos Secos & Legumbres */}
        {(activeCategory === 'todos' || activeCategory === 'frutosSecos') && (
          <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-amber-200/60 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                  <Nut className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Frutos Secos y Legumbres</h4>
                  <p className="text-xs text-slate-500">Nueces, avellanas, almendras, cacahuetes y legumbres</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                {filteredNuts.length} disponibles
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {filteredNuts.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No hay coincidencias para la búsqueda.</p>
              ) : (
                filteredNuts.map((item, idx) => {
                  const isHighlight =
                    item.toLowerCase().includes('nueces') ||
                    item.toLowerCase().includes('avellanas') ||
                    item.toLowerCase().includes('almendras') ||
                    item.toLowerCase().includes('cacahuetes');

                  return (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium ${
                        isHighlight
                          ? 'bg-amber-600 text-white font-semibold shadow-xs'
                          : 'bg-white text-slate-700 border border-amber-200'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isHighlight ? 'text-amber-200' : 'text-amber-500'}`} />
                      <span>{item}</span>
                    </span>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Frutas de Temporada */}
        {(activeCategory === 'todos' || activeCategory === 'frutas') && (
          <div className="bg-rose-50/50 border border-rose-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-rose-200/60 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center">
                  <Apple className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Frutas de Temporada</h4>
                  <p className="text-xs text-slate-500">Cítricos, frutas de hueso, melón, sandía y manzana</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full">
                {filteredFruits.length} en punto dulce
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {filteredFruits.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No hay coincidencias para la búsqueda.</p>
              ) : (
                filteredFruits.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium bg-white text-slate-700 border border-rose-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>{item}</span>
                  </span>
                ))
              )}
            </div>
          </div>
        )}

        {/* Pescados y Mariscos */}
        {(activeCategory === 'todos' || activeCategory === 'pescados') && (
          <div className="bg-sky-50/50 border border-sky-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-sky-200/60 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                  <Fish className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Pescados y Mariscos</h4>
                  <p className="text-xs text-slate-500">Pescado azul, pescado blanco y marisco de lonja</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-sky-100 text-sky-800 rounded-full">
                {filteredFish.length} de lonja
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {filteredFish.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No hay coincidencias para la búsqueda.</p>
              ) : (
                filteredFish.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium bg-white text-slate-700 border border-sky-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
                    <span>{item}</span>
                  </span>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Monthly Nutritional Tip Box */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-amber-500 text-white rounded-xl mt-0.5 shadow-xs">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-900">
            Consejo Mediterráneo para {monthData.monthName}
          </h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            {monthData.monthlyTip}
          </p>
        </div>
      </div>
    </div>
  );
};
