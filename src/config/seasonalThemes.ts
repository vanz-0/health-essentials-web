export type SeasonalTheme = {
  id: string;
  name: string;
  gradient: {
    from: string;
    to: string;
  };
  accentGradient: {
    from: string;
    to: string;
  };
  bannerEmoji: string;
  saleBadgeText: string;
  saleBadgeEmoji: string;
  activeMonths: number[]; // 1-12
};

export const seasonalThemes: SeasonalTheme[] = [
  {
    id: 'default',
    name: 'Default',
    gradient: {
      from: 'hsl(24 95% 53%)',   // orange
      to: 'hsl(330 81% 60%)',    // pink
    },
    accentGradient: {
      from: 'hsl(24 95% 53%)',
      to: 'hsl(330 81% 60%)',
    },
    bannerEmoji: '🔥',
    saleBadgeText: 'Hot Deal',
    saleBadgeEmoji: '🔥',
    activeMonths: [], // fallback theme
  },
  {
    id: 'new-year',
    name: 'New Year',
    gradient: {
      from: 'hsl(45 93% 47%)',   // gold
      to: 'hsl(24 95% 53%)',     // orange
    },
    accentGradient: {
      from: 'hsl(45 93% 47%)',
      to: 'hsl(280 60% 50%)',    // purple
    },
    bannerEmoji: '✨',
    saleBadgeText: 'New Year Deal',
    saleBadgeEmoji: '✨',
    activeMonths: [1],
  },
  {
    id: 'valentines',
    name: "Valentine's Day",
    gradient: {
      from: 'hsl(330 81% 60%)',  // pink
      to: 'hsl(0 72% 51%)',      // red
    },
    accentGradient: {
      from: 'hsl(330 81% 60%)',
      to: 'hsl(340 82% 52%)',
    },
    bannerEmoji: '💕',
    saleBadgeText: 'Love Deal',
    saleBadgeEmoji: '💕',
    activeMonths: [2],
  },
  {
    id: 'easter',
    name: 'Easter/Spring',
    gradient: {
      from: 'hsl(270 60% 60%)',  // lavender
      to: 'hsl(330 70% 70%)',    // soft pink
    },
    accentGradient: {
      from: 'hsl(270 60% 60%)',
      to: 'hsl(150 60% 50%)',    // spring green
    },
    bannerEmoji: '🌸',
    saleBadgeText: 'Spring Special',
    saleBadgeEmoji: '🌸',
    activeMonths: [3, 4],
  },
  {
    id: 'summer',
    name: 'Summer',
    gradient: {
      from: 'hsl(45 100% 51%)',  // yellow
      to: 'hsl(24 95% 53%)',     // orange
    },
    accentGradient: {
      from: 'hsl(188 94% 43%)',  // cyan
      to: 'hsl(45 100% 51%)',    // yellow
    },
    bannerEmoji: '☀️',
    saleBadgeText: 'Summer Sale',
    saleBadgeEmoji: '☀️',
    activeMonths: [6, 7, 8],
  },
  {
    id: 'halloween',
    name: 'Halloween',
    gradient: {
      from: 'hsl(24 95% 53%)',   // orange
      to: 'hsl(270 50% 40%)',    // purple
    },
    accentGradient: {
      from: 'hsl(24 95% 53%)',
      to: 'hsl(0 0% 10%)',       // black
    },
    bannerEmoji: '🎃',
    saleBadgeText: 'Spooky Deal',
    saleBadgeEmoji: '🎃',
    activeMonths: [10],
  },
  {
    id: 'black-friday',
    name: 'Black Friday',
    gradient: {
      from: 'hsl(0 0% 10%)',     // black
      to: 'hsl(24 95% 53%)',     // orange
    },
    accentGradient: {
      from: 'hsl(45 93% 47%)',   // gold
      to: 'hsl(24 95% 53%)',     // orange
    },
    bannerEmoji: '💰',
    saleBadgeText: 'Black Friday',
    saleBadgeEmoji: '💰',
    activeMonths: [11],
  },
  {
    id: 'christmas',
    name: 'Christmas',
    gradient: {
      from: 'hsl(0 72% 51%)',    // red
      to: 'hsl(142 71% 45%)',    // green
    },
    accentGradient: {
      from: 'hsl(0 72% 51%)',
      to: 'hsl(45 93% 47%)',     // gold
    },
    bannerEmoji: '🎄',
    saleBadgeText: 'Holiday Deal',
    saleBadgeEmoji: '🎄',
    activeMonths: [12],
  },
];

export function getThemeForMonth(month: number): SeasonalTheme {
  const theme = seasonalThemes.find(t => t.activeMonths.includes(month));
  return theme || seasonalThemes[0]; // Default fallback
}

export function getCurrentSeasonalTheme(): SeasonalTheme {
  const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed
  return getThemeForMonth(currentMonth);
}
