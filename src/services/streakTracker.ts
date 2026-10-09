import { MealAnalysis } from '../types';

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  hasLoggedToday: boolean;
  activeDaysLast30Days: number;
  loggedDaysCount: number;
  badgeLevel: 'bronce' | 'plata' | 'oro' | 'diamante';
  badgeTitle: string;
  nextMilestone: number;
  daysRemainingForMilestone: number;
}

const getLocalDateKey = (d: Date | number): string => {
  const date = typeof d === 'number' ? new Date(d) : d;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const calculateStreakStats = (loggedMeals: MealAnalysis[]): StreakStats => {
  if (!loggedMeals || loggedMeals.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      hasLoggedToday: false,
      activeDaysLast30Days: 0,
      loggedDaysCount: 0,
      badgeLevel: 'bronce',
      badgeTitle: 'Iniciando Hábito',
      nextMilestone: 3,
      daysRemainingForMilestone: 3,
    };
  }

  const now = new Date();
  const todayKey = getLocalDateKey(now);

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getLocalDateKey(yesterday);

  // Set of unique dates logged
  const loggedDateKeys = new Set(
    loggedMeals.map((m) => getLocalDateKey(m.timestamp || Date.now()))
  );

  const hasLoggedToday = loggedDateKeys.has(todayKey);

  // Count streak backwards
  let streak = 0;
  let checkDate = new Date(now);

  // If haven't logged today, check if logged yesterday to keep streak alive
  if (!hasLoggedToday) {
    if (loggedDateKeys.has(yesterdayKey)) {
      checkDate = yesterday;
    } else {
      streak = 0;
    }
  }

  if (hasLoggedToday || loggedDateKeys.has(yesterdayKey)) {
    while (true) {
      const key = getLocalDateKey(checkDate);
      if (loggedDateKeys.has(key)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Active days in last 30 days
  let active30 = 0;
  const runner = new Date(now);
  for (let i = 0; i < 30; i++) {
    const k = getLocalDateKey(runner);
    if (loggedDateKeys.has(k)) {
      active30++;
    }
    runner.setDate(runner.getDate() - 1);
  }

  // Determine badge level & milestones (tailored for 14 days Google Play testing!)
  let badgeLevel: 'bronce' | 'plata' | 'oro' | 'diamante' = 'bronce';
  let badgeTitle = 'Hábito Inicial (1-3 días)';
  let nextMilestone = 3;

  if (streak >= 14) {
    badgeLevel = 'diamante';
    badgeTitle = 'Tester Maestro Mediterráneo (14+ días)';
    nextMilestone = 30;
  } else if (streak >= 7) {
    badgeLevel = 'oro';
    badgeTitle = 'Constancia de Oro (7-13 días)';
    nextMilestone = 14;
  } else if (streak >= 3) {
    badgeLevel = 'plata';
    badgeTitle = 'Hábito en Marcha (3-6 días)';
    nextMilestone = 7;
  }

  const daysRemainingForMilestone = Math.max(0, nextMilestone - streak);

  return {
    currentStreak: streak,
    longestStreak: Math.max(streak, 1),
    hasLoggedToday,
    activeDaysLast30Days: active30,
    loggedDaysCount: loggedDateKeys.size,
    badgeLevel,
    badgeTitle,
    nextMilestone,
    daysRemainingForMilestone,
  };
};
