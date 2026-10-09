import React, { useState } from 'react';
import {
  X,
  Star,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Copy,
  Mail,
  Smartphone,
  Bug,
  Lightbulb,
  Heart,
  Award,
  Gift
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeTabName?: string;
}

interface StoredFeedback {
  id: string;
  rating: number;
  category: string;
  message: string;
  timestamp: number;
  dateStr: string;
  appVersion: string;
  deviceInfo: string;
}

export const TesterFeedbackModal: React.FC<Props> = ({ isOpen, onClose, activeTabName }) => {
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<string>('camara');
  const [message, setMessage] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const categories = [
    { id: 'camara', label: '📸 Cámara / Reconocimiento', icon: Smartphone },
    { id: 'nutricion', label: '🥗 Precisión Nutricional', icon: Sparkles },
    { id: 'error', label: '🐞 Reportar un Fallo / Bug', icon: Bug },
    { id: 'sugerencia', label: '💡 Nueva Idea de Función', icon: Lightbulb },
    { id: 'felicitacion', label: '⭐ Experiencia General', icon: Heart },
  ];

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const feedbackItem: StoredFeedback = {
      id: 'fb_' + Date.now(),
      rating,
      category,
      message,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleString(),
      appVersion: '2.7.0 (Google Play Closed Testing)',
      deviceInfo: `${navigator.userAgent} | Pantalla: ${window.innerWidth}x${window.innerHeight}`,
    };

    try {
      const existing = JSON.parse(localStorage.getItem('tunutrilens_tester_feedback') || '[]');
      localStorage.setItem('tunutrilens_tester_feedback', JSON.stringify([feedbackItem, ...existing]));
    } catch (err) {
      console.error(err);
    }

    setIsSubmitted(true);
  };

  const generateDiagnosticText = () => {
    return `🧪 [FEEDBACK TESTER TUNUTRILENS]
⭐ Calificación: ${rating}/5 estrellas
📌 Categoría: ${category}
💬 Comentario: "${message}"
📱 Versión: 2.7.0 (Closed Testing)
📅 Fecha: ${new Date().toLocaleString()}
📍 Pantalla activa: ${activeTabName || 'Principal'}`;
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(generateDiagnosticText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                Cuéntame tu opinión
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Tu opinión nos ayuda a perfeccionar la app cada día
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

        {/* Banner de Compromiso con el Usuario */}
        <div className="bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-3.5 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-black text-emerald-950">
            <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Tu opinión construye TuNutriLens</span>
          </div>
          <p className="text-emerald-900/90 text-[11px] leading-relaxed">
            Leemos cada sugerencia personalmente para mejorar la precisión del escaneo, añadir nuevas recetas y perfeccionar tu experiencia. ¡Gracias por ayudarnos a crecer!
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSendFeedback} className="space-y-4">
            {/* Rating Stars */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center space-y-2">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                ¿Cómo calificarías tu experiencia hoy?
              </span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1.5 hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-700 block">
                {rating === 5 && '🌟 ¡Excelente! Rápida y precisa'}
                {rating === 4 && '👍 Muy buena, con pequeños detalles'}
                {rating === 3 && '😐 Correcta, pero se puede mejorar'}
                {rating === 2 && '⚠️ Tuve dificultades o lentitud'}
                {rating === 1 && '❌ Falló algún punto importante'}
              </span>
            </div>

            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Tema del comentario:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-2 rounded-xl text-[11px] font-bold text-left transition flex items-center gap-2 cursor-pointer border ${
                        category === cat.id
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-black shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${category === cat.id ? 'text-emerald-700' : 'text-slate-400'}`} />
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed feedback text */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Tu sugerencia o detalle del reporte:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ej: 'El plato de salmón lo reconoció a la primera en 1 segundo' o 'Me gustaría poder escanear códigos de barras de productos locales'..."
                rows={3}
                required
                className="w-full text-xs p-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={!message.trim()}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Enviar mi opinión</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4 animate-in fade-in">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h4 className="text-base font-black text-slate-900">
                ¡Muchas gracias por tu opinión!
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tu opinión se ha registrado con éxito. <strong>Para ayudarnos a publicar la app en Google Play</strong>, es fundamental que dejes también tu comentario en la tienda:
              </p>
            </div>

            {/* Direct Google Play Store Review Action */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-left">
              <div className="flex items-center gap-2 text-amber-900 font-black text-xs">
                <span>⭐</span>
                <span>Paso Clave: Comentario en Google Play</span>
              </div>
              <p className="text-[11px] text-amber-950/90 leading-relaxed font-medium">
                Google Play exige ver comentarios de testers reales en la ficha de la tienda para habilitar el acceso público. Pulsa el botón para abrir la Play Store y dejar tu opinión privada:
              </p>
              <a
                href="https://play.google.com/store/apps/details?id=com.tunutrilens.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-xs cursor-pointer text-center"
              >
                <span>📲 Abrir Google Play y Dejar Comentario</span>
              </a>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left text-[11px] font-mono text-slate-700 whitespace-pre-line max-h-28 overflow-y-auto">
              {generateDiagnosticText()}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyClipboard}
                className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
              </button>

              <a
                href={`mailto:contacto@tunutrilens.es?subject=Opinión TuNutriLens (${category})&body=${encodeURIComponent(generateDiagnosticText())}`}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Mail className="w-4 h-4 text-slate-600" />
                <span>Email</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition mt-1 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
