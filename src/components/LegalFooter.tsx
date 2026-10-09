import React, { useState } from 'react';
import { Scale, ShieldCheck, FileText, AlertOctagon, XCircle, ExternalLink, HeartPulse, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface LegalFooterProps {}

export const LegalFooter: React.FC<LegalFooterProps> = () => {
  const [activeModal, setActiveModal] = useState<'aviso' | 'privacidad' | 'disclaimer' | 'terms' | null>(null);

  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50/80 pt-8 pb-28 md:py-8 px-4 text-slate-600 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        
        <div className="space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-900 font-extrabold text-sm flex-wrap">
            <BrandLogo size="xs" />
            <span>TuNutriLens</span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md">
              v2.7.0
            </span>
            <button
              type="button"
              onClick={() => {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then((regs) => {
                    regs.forEach((r) => r.unregister());
                  });
                }
                if ('caches' in window) {
                  caches.keys().then((names) => {
                    names.forEach((n) => caches.delete(n));
                  });
                }
                localStorage.removeItem('tunutilens_version');
                window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
              }}
              title="Forzar actualización y limpiar caché para ver los últimos cambios"
              className="text-[10px] font-semibold px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md transition cursor-pointer flex items-center gap-1 active:scale-95"
            >
              🔄 <span>Actualizar app</span>
            </button>
            <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md hidden sm:inline">
              Software Nutricional & IA Visional
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} TuNutriLens. Calibrado con BEDCA (Sanidad España) & USDA FoodData Central.
          </p>
        </div>

        {/* ENLACES LEGALES Y WEB OFICIAL */}
        <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-700">
          <a
            href="https://tunutrilens.es"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-700 text-emerald-800 transition-colors underline flex items-center gap-1 font-extrabold"
          >
            <span>Web Oficial (tunutrilens.es)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span>•</span>
          <button
            onClick={() => setActiveModal('aviso')}
            className="hover:text-emerald-700 transition-colors underline"
          >
            Aviso Legal (LSSI-CE)
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveModal('privacidad')}
            className="hover:text-emerald-700 transition-colors underline"
          >
            Política de Privacidad & RGPD
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveModal('disclaimer')}
            className="hover:text-emerald-700 transition-colors underline text-amber-800 font-black"
          >
            Descargo Médico (Disclaimer)
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveModal('terms')}
            className="hover:text-emerald-700 transition-colors underline"
          >
            Términos y Condiciones (T&C)
          </button>
        </div>

      </div>

      {/* MODAL DE TEXTOS LEGALES */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 my-8 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900">
                  {activeModal === 'aviso' && 'Aviso Legal (Cumplimiento LSSI-CE)'}
                  {activeModal === 'privacidad' && 'Política de Privacidad y Protección de Datos (RGPD)'}
                  {activeModal === 'disclaimer' && 'Descargo de Responsabilidad Médica y Nutricional'}
                  {activeModal === 'terms' && 'Términos y Condiciones Generales de Contratación'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* CONTENIDO AVISO LEGAL */}
            {activeModal === 'aviso' && (
              <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                <p>
                  En cumplimiento con el artículo 10 de la <strong>Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE)</strong>, se detallan a continuación los datos identificativos y legales del titular y prestador del servicio:
                </p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 font-mono text-[11px]">
                  <p><strong>Nombre Comercial / Marca:</strong> TuNutriLens AI (Gala Nutricion)</p>
                  <p><strong>Titular / Responsable Legal:</strong> Gala Rodríguez-Echebarrieta</p>
                  <p><strong>NIF / CIF / NIE:</strong> <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">[PENDIENTE DE ALTA EN HACIENDA - NIF/CIF DEL TITULAR]</span></p>
                  <p><strong>Domicilio Social / Fiscal:</strong> <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">[DOMICILIO FISCAL EN ESPAÑA / CIUDAD]</span></p>
                  <p><strong>Epígrafe IAE / CNAE:</strong> <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">[EPÍGRAFE IAE 763 / 844 O CNAE 6201 SERVICIOS INFORMÁTICOS / NUTRICIÓN]</span></p>
                  <p><strong>Correo Electrónico de Contacto:</strong> contacto@tunutrilens.es</p>
                  <p><strong>Actividad Principal:</strong> Software de asistencia nutricional, reconocimiento óptico de alimentos con IA y divulgación de hábitos saludables.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-xs">Propiedad Intelectual e Industrial</h4>
                  <p>
                    El código fuente, algoritmos de visión artificial, diseño gráfico, logotipos, bases de datos nutricionales y marcas asociadas a TuNutriLens son propiedad exclusiva de su titular o cuentan con las preceptivas licencias de uso, quedando prohibida su reproducción o explotación no autorizada.
                  </p>
                </div>
              </div>
            )}

            {/* CONTENIDO PRIVACIDAD RGPD */}
            {activeModal === 'privacidad' && (
              <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                <p>
                  TuNutriLens AI garantiza la protección y confidencialidad de los datos personales de conformidad con el <strong>Reglamento General de Protección de Datos (RGPD UE 2016/679)</strong> y la <strong>Ley Orgánica 3/2018 (LOPD-GDD)</strong> de garantía de los derechos digitales.
                </p>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">1. Responsable del Tratamiento</h4>
                    <p className="mt-0.5">
                      Titular: <strong>Gala Rodríguez-Echebarrieta</strong> &bull; NIF: <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-mono">[PENDIENTE ALTA HACIENDA]</span> &bull; Contacto DPO / Privacidad: <strong>contacto@tunutrilens.es</strong>
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">2. Tratamiento de Datos de Salud y Categoría Especial (Art. 9.2.a RGPD)</h4>
                    <p className="mt-0.5">
                      Los datos sobre alergias, intolerancias alimentarias, patologías digestivas, peso corporal, altura y etapas fisiológicas (embarazo, lactancia, infancia, senior, deportistas) son tratados bajo la base jurídica del <strong>consentimiento explícito e informado</strong> del usuario, recabado libremente al configurar el perfil. Dichos datos se emplean única y exclusivamente para calibrar las alertas alimentarias y necesidades calórico-nutricionales.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">3. Tratamiento de Imágenes y Fotografías de Alimentos</h4>
                    <p className="mt-0.5">
                      Las fotografías tomadas con la cámara (platos, etiquetas de supermercado o estantes de nevera) son procesadas de forma efímera y segura mediante visión artificial para identificar ingredientes y macronutrientes. <strong>Nunca se comercializan ni se ceden a redes publicitarias de terceros</strong>.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">4. Base Jurídica y Finalidad del Tratamiento</h4>
                    <ul className="list-disc list-inside mt-0.5 space-y-1 text-[11px]">
                      <li><strong>Ejecución del contrato / servicio:</strong> Proporcionar el diario nutricional, calculadora metabólica y menús.</li>
                      <li><strong>Consentimiento explícito (Art. 9 RGPD):</strong> Parametrización de requerimientos dietéticos y alérgenos.</li>
                      <li><strong>Cumplimiento legal y fiscal:</strong> Facturación conforme a la normativa tributaria española (AEAT).</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">5. Destinatarios y Proveedores (Encargados de Tratamiento)</h4>
                    <p className="mt-0.5">
                      Los datos se alojan en infraestructuras de computación segura en la nube dentro del Espacio Económico Europeo o bajo el marco Data Privacy Framework (EE.UU.-UE). No se efectúan cesiones de datos salvo obligación legal o requerimiento judicial.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs">6. Ejercicio de Derechos ARCO-POL</h4>
                    <p className="mt-0.5">
                      El usuario puede revocar su consentimiento y ejercer sus derechos de <strong>Acceso, Rectificación, Supresión (derecho al olvido), Limitación del tratamiento, Portabilidad y Oposición</strong> en cualquier momento enviando un correo electrónico a <strong>contacto@tunutrilens.es</strong> acompañado de copia de su documento de identidad. Asimismo, tiene derecho a formular reclamación ante la Agencia Española de Protección de Datos (AEPD - www.aepd.es).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CONTENIDO DISCLAIMER MEDICO */}
            {activeModal === 'disclaimer' && (
              <div className="space-y-4 text-xs text-slate-700 leading-relaxed border-l-4 border-amber-500 pl-4 py-1">
                <div className="p-3 bg-amber-50 text-amber-900 rounded-xl border border-amber-200 font-bold flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>DESCARGO DE RESPONSABILIDAD MÉDICA Y NUTRICIONAL</span>
                </div>
                <p className="font-semibold text-slate-800">
                  TuNutriLens AI es una herramienta de orientación y educación nutricional asistida por tecnología:
                </p>
                <ul className="list-disc list-inside space-y-2 font-medium text-slate-700">
                  <li><strong>No sustituye a un profesional sanitario:</strong> Las sugerencias de IA y los cálculos nutricionales no constituyen diagnóstico, prescripción médica ni plan terapéutico personalizado.</li>
                  <li><strong>Patologías previas:</strong> Personas con diabetes, enfermedades renales, cardiovasculares, alergias severas anafilácticas o antecedentes de trastornos alimentarios deben consultar siempre con su médico antes de modificar sus pautas de alimentación.</li>
                  <li><strong>Naturaleza estimativa:</strong> Los desgloses calóricos y de micronutrientes se basan en algoritmos de visión artificial y bases oficiales (BEDCA/USDA), sirviendo como guía de referencia orientativa.</li>
                </ul>
              </div>
            )}

            {/* CONTENIDO TERMINOS DE USO */}
            {activeModal === 'terms' && (
              <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                <p>
                  Las presentes Condiciones regulan el uso y contratación de servicios en TuNutriLens AI:
                </p>
                <ul className="list-disc list-inside space-y-2 font-medium text-slate-700">
                  <li><strong>Servicio y Funcionalidades:</strong> Permite el escaneo inteligente de alimentos, desglose de macronutrientes/micronutrientes a comida real, recetas personalizadas y seguimiento de hábitos.</li>
                  <li><strong>Política de Uso Justo (Fair Use) y Prohibición de Bots:</strong> La modalidad ilimitada está destinada con carácter exclusivo al uso personal, doméstico e individual del titular de la cuenta. Queda terminantemente prohibido el uso de herramientas de automatización, bots, emuladores, scripts, rastreadores (scrapers) o la explotación colectiva de una cuenta para fines comerciales o de hostelería. TuNutriLens AI implementa mecanismos automáticos de detección de ráfagas y un umbral de uso justo mensual (hasta 600 análisis/mes) para salvaguardar la integridad de los servidores y evitar ataques de denegación de servicio.</li>
                  <li><strong>Pagos, Suscripciones y Renovación:</strong> Las suscripciones se gestionan de forma segura a través de los canales autorizados (Google Play Billing / Pasarela Bancaria). La renovación es periódica automática salvo que el usuario cancele la suscripción con anterioridad al vencimiento del ciclo contratado (mensual o anual). Si no se cancela, se seguirá cobrando en cada periodo.</li>
                  <li><strong>Periodo de Prueba de 7 Días y Política de Reembolso:</strong> Se concede un periodo de prueba de 7 días naturales desde la contratación inicial para evaluar el servicio. Dentro de este plazo de 7 días, el usuario puede cancelar la suscripción y solicitar el reembolso íntegro. Transcurrido este periodo de prueba de 7 días naturales:
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1">
                      <li>En la suscripción <strong>mensual</strong>, el usuario puede cancelar la renovación automática en cualquier momento para que no se cobre el mes siguiente, manteniéndose el acceso hasta el fin del mes ya abonado.</li>
                      <li>En la suscripción <strong>anual</strong>, si pasan los 7 días de prueba el importe abonado no es reembolsable. El usuario puede cancelar la renovación cuando desee para evitar cargos en años sucesivos, continuando con su acceso activo durante todos los meses restantes del año contratado.</li>
                    </ul>
                  </li>
                  <li><strong>Propiedad Intelectual:</strong> Los diseños, marcas, logotipos y algoritmos son titularidad exclusiva de Gala Nutricion.</li>
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-slate-900 text-white font-black text-xs rounded-xl hover:bg-slate-800"
              >
                Entendido y Aceptar
              </button>
            </div>

          </div>
        </div>
      )}

    </footer>
  );
};
