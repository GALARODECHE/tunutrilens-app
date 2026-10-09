import React from 'react';
import { SeasonalCalendarView } from '../components/SeasonalCalendarView';

interface Props {
  onNavigateToRecipes?: () => void;
  onNavigateToWeeklyPlan?: () => void;
}

export const SeasonalCalendarScreen: React.FC<Props> = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-3 space-y-6 pb-24 md:pb-12">
      {/* Main Interactive Seasonal View */}
      <SeasonalCalendarView />
    </div>
  );
};
