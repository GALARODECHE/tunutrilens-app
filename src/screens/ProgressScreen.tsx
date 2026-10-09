import React, { useState } from 'react';
import { UserProfile, WeightEntry } from '../types';
import { TrendingUp, Scale, Target, Calendar, Plus, Trophy, Flame } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  userProfile: UserProfile;
  weightEntries: WeightEntry[];
  onAddWeightEntry: (weightKg: number, dateStr: string) => void;
}

export const ProgressScreen: React.FC<Props> = ({
  userProfile,
  weightEntries,
  onAddWeightEntry,
}) => {
  const [newWeight, setNewWeight] = useState<string>('');
  const [newDate, setNewDate] = useState<string>('Hoy');
  const [showAddForm, setShowAddForm] = useState(false);

  const currentWeight = userProfile.currentWeightKg;
  const targetWeight = userProfile.targetWeightKg;
  const remaining = Math.abs(currentWeight - targetWeight).toFixed(1);
  const isLossGoal = userProfile.goal.includes('Pérdida');

  // Prepare data for chart (reversed so chronological left-to-right)
  const chartData = [...weightEntries]
    .reverse()
    .map((e) => ({
      date: e.dateString,
      peso: e.weightKg,
      meta: targetWeight,
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeight);
    if (!isNaN(val) && val > 30 && val < 250) {
      onAddWeightEntry(val, newDate || 'Hoy');
      setNewWeight('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-12">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Evolución Corporal</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Progreso de Peso</h1>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Peso</span>
        </button>
      </div>

      {/* Add Weight Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 border border-emerald-300 shadow-md space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-slate-900">Añadir Nuevo Registro de Peso</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Peso en kg</label>
              <input
                type="number"
                step="0.1"
                placeholder="Ej: 74.5"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Fecha / Etiqueta</label>
              <input
                type="text"
                placeholder="Ej: Hoy, 22 Jul"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              Guardar Registro
            </button>
          </div>
        </form>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Scale className="w-4 h-4 text-teal-600" />
            <span>Peso Actual</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{currentWeight} kg</div>
          <span className="text-[11px] text-slate-500">Última actualización</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Peso Objetivo</span>
          </div>
          <div className="text-2xl font-black text-emerald-600">{targetWeight} kg</div>
          <span className="text-[11px] text-slate-500">Meta configurada</span>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50/50 rounded-2xl p-4 border border-emerald-200/80 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span>Faltante</span>
          </div>
          <div className="text-2xl font-black text-emerald-950">{remaining} kg</div>
          <span className="text-[11px] text-emerald-800 font-semibold">
            {isLossGoal ? 'por reducir' : 'por aumentar'}
          </span>
        </div>
      </div>

      {/* Weight History Chart */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Gráfico de Evolución</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                formatter={(val: any) => [`${val} kg`, 'Peso']}
              />
              <Area type="monotone" dataKey="peso" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorPeso)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-slate-900">Historial de Registros</h3>
        <div className="divide-y divide-slate-100">
          {weightEntries.map((e) => (
            <div key={e.id} className="py-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-800">{e.dateString}</span>
              </div>
              <span className="font-bold text-slate-900">{e.weightKg} kg</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
