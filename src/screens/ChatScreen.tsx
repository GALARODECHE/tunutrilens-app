import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MealAnalysis, UserProfile } from '../types';
import { Bot, Send, Sparkles, User, RefreshCw, Lightbulb, Zap } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { getChatUsage, recordChatMessage, UsageStatus } from '../services/usageLimitService';

interface Props {
  userProfile: UserProfile;
  loggedMeals: MealAnalysis[];
  chatMessages: ChatMessage[];
  onSendMessage: (sender: 'user' | 'assistant', text: string) => void;
  onNavigateToPricing?: () => void;
}

export const ChatScreen: React.FC<Props> = ({
  userProfile,
  loggedMeals,
  chatMessages,
  onSendMessage,
  onNavigateToPricing,
}) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatUsage, setChatUsage] = useState<UsageStatus>(() => getChatUsage());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const totalCal = loggedMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProt = loggedMeals.reduce((acc, m) => acc + m.proteinGrams, 0);
  const totalCarbs = loggedMeals.reduce((acc, m) => acc + m.carbsGrams, 0);
  const totalFat = loggedMeals.reduce((acc, m) => acc + m.fatGrams, 0);

  const restrictionsStr = (userProfile.dietaryRestrictions || []).length > 0
    ? userProfile.dietaryRestrictions.join(', ')
    : 'Ninguna';

  const quickPrompts = [
    '¿Cuántas calorías me quedan hoy?',
    'Sugiéreme una cena según mis alérgenos',
    '¿Qué opinas de mi consumo proteico de hoy?',
    'Sustitutos saludables para el gluten/lactosa',
    '¿Qué comer antes de entrenar?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    onSendMessage('user', text);
    if (!textToSend) setInput('');
    setIsTyping(true);

    const currentUsage = getChatUsage();
    setChatUsage(currentUsage);

    if (!currentUsage.canProceed) {
      setTimeout(() => {
        onSendMessage(
          'assistant',
          currentUsage.isUnlimited
            ? `⚠️ **Cupo mensual de uso responsable alcanzado (${currentUsage.total}/${currentUsage.total})**\n\nHas completado las consultas asignadas a tu plan Premium este mes. Tu saldo se restablecerá el próximo día 1 del mes.`
            : `🔒 **Has disfrutado de tus 2 consultas de bienvenida gratuitas**\n\nEl acceso a **NutriCoach IA** con asesoramiento nutricional personalizado 24/7, cálculo de macros y adaptación a tus objetivos es una función exclusiva del **Plan Premium**.\n\nPuedes consultar nuestros planes en la sección de **Planes y Precios** para desbloquear consultas continuas.`
        );
        setIsTyping(false);
      }, 500);
      return;
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const contextPrompt = `Eres NutriCoach IA, un nutricionista clínico experto, empático y profesional de TuNutriLens.
Tus cálculos y referencias de composición de alimentos se basan estrictamente en la Red Española BEDCA (AESAN - Ministerio de Sanidad) y USDA FoodData Central (Dominio Público Open Data).
Perfil del cliente: ${userProfile.gender}, ${userProfile.age} años, peso actual ${userProfile.currentWeightKg}kg, meta ${userProfile.targetWeightKg}kg (${userProfile.goal}).
Alérgenos / Restricciones prohibidos: ${restrictionsStr}.
Objetivo diario: ${userProfile.dailyCalorieTarget} kcal, ${userProfile.dailyProteinTargetG}g proteínas, ${userProfile.dailyCarbsTargetG}g carbos, ${userProfile.dailyFatTargetG}g grasa.
Hoy ha consumido: ${totalCal} kcal, ${Math.round(totalProt)}g proteína, ${Math.round(totalCarbs)}g carbos, ${Math.round(totalFat)}g grasa.
Platos registrados hoy: ${loggedMeals.map(m => m.dishName).join(', ') || 'Ningún plato registrado aún'}.

Pregunta o duda del cliente: "${text}"

IMPORTANTE:
1. Ten SIEMPRE en cuenta sus alérgenos (${restrictionsStr}) en cualquier recomendación de alimentos.
2. Aplica la referencia clínica oficial de BEDCA y USDA para valorar macros, densidad nutricional y micronutrientes.
3. Prioriza SIEMPRE la DIETA MEDITERRÁNEA ESPAÑOLA TRADICIONAL con recetas sencillas e ingredientes habituales de cualquier supermercado o mercado de proximidad en España.
4. REGLA DE INGREDIENTES: Promueve verduras de hoja verde (rúcula, canónigos, germinados, espinacas frescas, cogollos) y frutos secos (nueces, avellanas, almendras, cacahuetes, piñones). Para un toque dulce opcional recomienda únicamente miel natural.
5. EXCLUYE Y PROHIBE recomendar alimentos exóticos o procesados como sirope de agave, espirulina, açaí, porridge, overnight oats, granola, chía, edamame, tempeh o poke bowls.
6. Responde en español con un tono cercano, técnico pero fácil de entender, muy motivador e instructivo.
7. Formatea tu respuesta con negritas y viñetas para que sea muy legible.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: contextPrompt,
        });

        if (response.text) {
          recordChatMessage();
          setChatUsage(getChatUsage());
          onSendMessage('assistant', response.text);
          setIsTyping(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Fallback chat response:', err);
    }

    // Fallback intelligent reply
    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();
      if (lower.includes('calorías') || lower.includes('quedan')) {
        const rem = userProfile.dailyCalorieTarget - totalCal;
        reply = `Hasta el momento has consumido **${totalCal} kcal** de tu objetivo de **${userProfile.dailyCalorieTarget} kcal**. ${
          rem > 0
            ? `Te quedan **${rem} kcal** disponibles para hoy.`
            : 'Has alcanzado el límite planificado para hoy.'
        } En proteínas llevas **${Math.round(totalProt)}g / ${userProfile.dailyProteinTargetG}g**.`;
      } else if (lower.includes('cena') || lower.includes('sugiéreme') || lower.includes('receta')) {
        reply = `Para una cena óptima en tu meta de **${userProfile.goal.toLowerCase()}**, te recomiendo:\n\n• **Salmón o Pollo a la plancha** con brócoli al vapor y un toque de aceite de oliva.\n• **Tortilla de 2 claras + 1 huevo entero** con espinacas y champiñones.\n• **Tazón de queso fresco batido o yogur griego 0%** con un puñado de frutos secos.\n\nEsto mantendrá tus proteínas elevadas y baja la carga insulínica nocturna.`;
      } else {
        reply = `¡Excelente consulta! Teniendo en cuenta que tu meta es **${userProfile.goal}** y llevas **${totalCal} kcal** consumidas hoy, lo ideal es mantener el enfoque en fuentes de proteína magra, verduras ricas en fibra y buena hidratación (2.5L de agua al día). ¿Te gustaría profundizar en algún macro en particular?`;
      }
      onSendMessage('assistant', reply);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-5rem)] pb-24 md:pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-4 shadow-sm border border-emerald-500 flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">NutriCoach IA</h2>
            <p className="text-xs text-emerald-100">Asistente nutricional personalizado 24/7</p>
          </div>
        </div>
        <div className="text-right text-xs text-white">
          <div><strong className="text-white">{totalCal}</strong> / {userProfile.dailyCalorieTarget} kcal</div>
          <div className="text-[10px] text-emerald-100">Consumidas hoy</div>
        </div>
      </div>

      {/* Quota indicator bar */}
      <div className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 mb-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-700">
          <Zap className={`w-3.5 h-3.5 ${chatUsage.isUnlimited ? 'text-emerald-600' : 'text-amber-500'}`} />
          <span className="font-semibold">
            {chatUsage.isUnlimited
              ? `Plan Premium: ${chatUsage.remaining} consultas disponibles este mes`
              : `Consultas de prueba: ${chatUsage.remaining} de ${chatUsage.total} restantes`}
          </span>
        </div>
        {!chatUsage.isUnlimited && onNavigateToPricing && (
          <button
            type="button"
            onClick={onNavigateToPricing}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
          >
            Desbloquear con Premium
          </button>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[82%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-line'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-white p-3 rounded-2xl border border-slate-200 w-fit">
            <Bot className="w-4 h-4 text-emerald-600 animate-bounce" />
            <span>NutriCoach está escribiendo...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <Lightbulb className="w-4 h-4 text-teal-600 flex-shrink-0" />
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-900 px-3 py-1.5 rounded-full border border-teal-200 font-medium whitespace-nowrap transition-colors flex-shrink-0"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-2 flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-300 shadow-sm focus-within:border-emerald-500"
      >
        <input
          type="text"
          placeholder="Pregunta algo sobre tu nutrición..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 text-sm focus:outline-none bg-transparent"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all active:scale-95 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
