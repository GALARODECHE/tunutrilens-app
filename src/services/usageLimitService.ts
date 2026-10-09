/**
 * Servicio de control de límites de consumo mensual (Fair Use Policy & Cost Protection)
 * Controla y unifica el consumo de los 3 escáneres fotográficos con IA:
 * 1. Escáner de Plato / Comida
 * 2. Escáner de Supermercado / Etiqueta / Producto
 * 3. Escáner de Nevera Residuo Cero
 * 
 * Tarifas:
 * - Plan Gratuito (b2c_free): 5 escaneos fotográficos totales al mes (suma de los 3 escáneres). Todas las funciones abiertas.
 * - Plan Premium Pro (b2c_pro): 150 escaneos fotográficos totales al mes (suma de los 3 escáneres).
 * - Plan Premium Ilimitado (b2c_unlimited): Escaneos fotográficos 100% ILIMITADOS en los 3 escáneres.
 * 
 * Al suscribirse o cambiar de tarifa, el contador de escaneos se reinicia automáticamente a cero.
 */

export const MONTHLY_FREE_SCANS_LIMIT = 5; // 5 fotos al mes en total (Plato y Supermercado)
export const MONTHLY_PREMIUM_SCANS_LIMIT = 40; // 40 fotos al mes en total para Premium Pro (para empujar a la tarifa Ilimitada)
export const UNLIMITED_FAIR_USE_SOFT_CAP = 600; // 600 fotos/mes: Política de Uso Justo (Fair Use) para blindaje anti-abuso masivo
export const ANTI_BOT_MIN_INTERVAL_MS = 3000; // 3 segundos mínimos entre capturas (evita scripts/bots que envían ráfagas automáticas)

export type SubscriptionPlanId = 'b2c_free' | 'b2c_pro' | 'b2c_unlimited';

const STORAGE_KEYS = {
  USAGE_MONTH: 'tunutrilens_usage_month_v2',
  SCANS_COUNT: 'tunutrilens_monthly_scans_count_v2',
  SUBSCRIPTION: 'user_subscription_plan',
  LAST_SCAN_TIMESTAMP: 'tunutrilens_last_scan_ts_v2',
};

/**
 * Devuelve el año y mes actual en formato "AAAA-MM"
 */
function getCurrentMonthString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Reinicia los contadores el día 1 de cada nuevo mes
 */
function checkAndResetIfNewMonth(): void {
  try {
    const currentMonth = getCurrentMonthString();
    const savedMonth = localStorage.getItem(STORAGE_KEYS.USAGE_MONTH);
    if (savedMonth !== currentMonth) {
      localStorage.setItem(STORAGE_KEYS.USAGE_MONTH, currentMonth);
      localStorage.setItem(STORAGE_KEYS.SCANS_COUNT, '0');
    }
  } catch (err) {
    console.warn('Error al verificar mes de consumo:', err);
  }
}

/**
 * Obtiene el plan de suscripción actual del usuario
 */
export function getSubscriptionPlan(): SubscriptionPlanId {
  try {
    const plan = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    if (plan === 'b2c_unlimited') return 'b2c_unlimited';
    if (plan === 'b2c_pro' || (plan && plan !== 'b2c_free')) return 'b2c_pro';
    return 'b2c_free';
  } catch {
    return 'b2c_free';
  }
}

export function isUserSubscribed(): boolean {
  const plan = getSubscriptionPlan();
  return plan === 'b2c_pro' || plan === 'b2c_unlimited';
}

/**
 * Pone el contador de escaneos a cero
 */
export function resetScanUsage(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCANS_COUNT, '0');
    localStorage.setItem(STORAGE_KEYS.USAGE_MONTH, getCurrentMonthString());
  } catch (err) {
    console.warn('Error al reiniciar contador de escaneos:', err);
  }
}

/**
 * Registra una nueva suscripción o cambio de plan y REINICIA el contador a cero
 */
export function activateSubscriptionPlan(planId: SubscriptionPlanId): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, planId);
    resetScanUsage(); // Si se inscriben a la tarifa empieza el contador a cero
  } catch (err) {
    console.warn('Error al activar plan:', err);
  }
}

export interface UsageStatus {
  used: number;
  total: number;
  remaining: number;
  isUnlimited: boolean; // Si tiene escaneos 100% ilimitados (Plan Ilimitado)
  isPro: boolean; // Si es Premium Pro (150 escaneos)
  isFree: boolean; // Si es Plan Gratuito (5 escaneos)
  canProceed: boolean;
  period: 'monthly';
  daysUntilReset: number;
  planId: SubscriptionPlanId;
  planLabel: string;
  isFairUseExceeded?: boolean; // Si un bot o abuso supera las 600 fotos mensuales en la tarifa ilimitada
}

/**
 * Comprueba si la llamada actual proviene de una ráfaga automatizada o bot (< 3 segundos)
 */
export function checkBotVelocityViolation(): { isBotSuspicious: boolean; waitSeconds: number } {
  try {
    const lastTimestampStr = localStorage.getItem(STORAGE_KEYS.LAST_SCAN_TIMESTAMP);
    const now = Date.now();
    if (lastTimestampStr) {
      const lastTimestamp = parseInt(lastTimestampStr, 10);
      const elapsed = now - lastTimestamp;
      if (elapsed < ANTI_BOT_MIN_INTERVAL_MS) {
        const waitSeconds = Math.ceil((ANTI_BOT_MIN_INTERVAL_MS - elapsed) / 1000);
        return { isBotSuspicious: true, waitSeconds };
      }
    }
  } catch (err) {
    console.warn('Error al chequear velocidad anti-bot:', err);
  }
  return { isBotSuspicious: false, waitSeconds: 0 };
}

/**
 * Calcula cuántos días faltan para que comience el siguiente mes
 */
function getDaysUntilNextMonth(): number {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const diffTime = nextMonth.getTime() - now.getTime();
  return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

/**
 * Consulta el estado global unificado de escaneos fotográficos de este mes
 * (Suma de los 3 escáneres: Plato, Supermercado y Nevera)
 */
export function getScanUsage(): UsageStatus {
  checkAndResetIfNewMonth();
  const planId = getSubscriptionPlan();

  let used = 0;
  try {
    const val = localStorage.getItem(STORAGE_KEYS.SCANS_COUNT);
    used = val ? parseInt(val, 10) || 0 : 0;
  } catch {
    used = 0;
  }

  const daysUntilReset = getDaysUntilNextMonth();

  if (planId === 'b2c_unlimited') {
    // Blindaje de Uso Justo (Fair Use): hasta 600 fotos/mes (equivalente a 20 fotos diarias)
    // Protege contra scripts, cuentas compartidas masivas o reventa a restaurantes
    const hasExceededFairUse = used >= UNLIMITED_FAIR_USE_SOFT_CAP;

    return {
      used,
      total: UNLIMITED_FAIR_USE_SOFT_CAP,
      remaining: Math.max(0, UNLIMITED_FAIR_USE_SOFT_CAP - used),
      isUnlimited: true,
      isPro: false,
      isFree: false,
      canProceed: !hasExceededFairUse,
      period: 'monthly',
      daysUntilReset,
      planId: 'b2c_unlimited',
      planLabel: 'Premium Ilimitado (Uso Personal)',
      isFairUseExceeded: hasExceededFairUse
    };
  }

  if (planId === 'b2c_pro') {
    const total = MONTHLY_PREMIUM_SCANS_LIMIT;
    const remaining = Math.max(0, total - used);
    return {
      used,
      total,
      remaining,
      isUnlimited: false,
      isPro: true,
      isFree: false,
      canProceed: remaining > 0,
      period: 'monthly',
      daysUntilReset,
      planId: 'b2c_pro',
      planLabel: 'Premium Pro'
    };
  }

  // Plan Gratuito
  const total = MONTHLY_FREE_SCANS_LIMIT;
  const remaining = Math.max(0, total - used);
  return {
    used,
    total,
    remaining,
    isUnlimited: false,
    isPro: false,
    isFree: true,
    canProceed: remaining > 0,
    period: 'monthly',
    daysUntilReset,
    planId: 'b2c_free',
    planLabel: 'Gratuito'
  };
}

/**
 * Registra un escaneo fotográfico realizado con IA (compartido entre los 3 escáneres)
 */
export function recordScan(): void {
  checkAndResetIfNewMonth();
  try {
    const current = getScanUsage().used;
    localStorage.setItem(STORAGE_KEYS.SCANS_COUNT, String(current + 1));
    localStorage.setItem(STORAGE_KEYS.LAST_SCAN_TIMESTAMP, String(Date.now()));
  } catch (err) {
    console.warn('No se pudo registrar escaneo mensual:', err);
  }
}

export const getChatUsage = getScanUsage;
export const recordChatMessage = recordScan;

