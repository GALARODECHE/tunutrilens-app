import React from 'react';
import { SCIENTIFIC_REFERENCES } from '../data/scientificReferences';
import { BookOpen, ExternalLink, ShieldCheck, X, Award, CheckCircle2, Globe, Building2, Scale } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ScientificReferencesModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-emerald-100 text-slate-800 rounded-3xl max-w-4xl w-full my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 bg-slate-50/80 border-b border-emerald-100 flex items-start justify-between gap-4 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Fuentes Científicas y Referencias Oficiales</h2>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-md border border-emerald-200 uppercase tracking-wider">
                  100% Auditado
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Bases de datos públicas, instituciones gubernamentales y guías clínicas internacionales que avalan TuNutriLens
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-all"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-xs sm:text-sm">
          {/* Legal Safety Banner */}
          <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                Seguridad Jurídica y Licencia Libre Garantizada
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Todas las fuentes integradas en esta aplicación proceden de <strong>organismos públicos oficiales (Ministerio de Sanidad, USDA, EFSA, OMS, FAO)</strong> bajo licencias de <strong>Dominio Público y Reutilización del Sector Público</strong>. No existen royalties ni riesgos por derechos de autor comerciales.
              </p>
            </div>
          </div>

          {/* References Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-emerald-100 pb-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Directorio de Fuentes Bromatológicas y Guías Clínicas</span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {SCIENTIFIC_REFERENCES.map((ref) => (
                <div
                  key={ref.id}
                  className="bg-white border border-emerald-100/90 hover:border-emerald-300 rounded-2xl p-5 space-y-3 shadow-xs hover:shadow-md transition-all"
                >
                  {/* Card Top */}
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-bold text-[10px] rounded-md uppercase tracking-wider border border-emerald-200">
                        {ref.category}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-1.5 flex items-center gap-2">
                        {ref.title}
                      </h4>
                    </div>

                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-all shrink-0"
                    >
                      <span>Sitio Oficial</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Institution & Scope */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>Institución:</strong> {ref.institution}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>Ámbito:</strong> {ref.countryOrScope}</span>
                    </div>
                  </div>

                  {/* Citation */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-800 font-mono text-[11px] leading-relaxed">
                    <strong className="text-slate-600 font-sans block mb-0.5">Cita Oficial / Referencia Bibliográfica:</strong>
                    "{ref.citation}"
                  </div>

                  {/* Usage in App */}
                  <div className="text-xs space-y-1">
                    <p className="text-slate-700">
                      <strong className="text-emerald-700">Aplicación en TuNutriLens:</strong> {ref.usageInApp}
                    </p>
                  </div>

                  {/* Key Data Points */}
                  <div className="pt-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Parámetros extraídos e integrados:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ref.keyDataPoints.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-emerald-50/70 text-slate-800 font-medium text-xs rounded-lg border border-emerald-100 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{item}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* License status */}
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-emerald-600" />
                      <strong>Licencia:</strong> {ref.licenseType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>TuNutriLens — Transparencia Científica y Seguridad Legal</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-all shadow-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
