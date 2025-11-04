/**
 * Simple fuzzy search implementation
 * Returns true if all characters in the pattern appear in order in the text
 */
export function fuzzyMatch(text: string, pattern: string): boolean {
  const textLower = text.toLowerCase();
  const patternLower = pattern.toLowerCase();
  
  let patternIdx = 0;
  let textIdx = 0;
  
  while (textIdx < textLower.length && patternIdx < patternLower.length) {
    if (textLower[textIdx] === patternLower[patternIdx]) {
      patternIdx++;
    }
    textIdx++;
  }
  
  return patternIdx === patternLower.length;
}

/**
 * Calculate fuzzy match score (higher is better)
 */
export function getFuzzyScore(text: string, pattern: string): number {
  if (!pattern) return 0;
  
  const textLower = text.toLowerCase();
  const patternLower = pattern.toLowerCase();
  
  // Exact match gets highest score
  if (textLower === patternLower) return 1000;
  
  // Starts with pattern gets high score
  if (textLower.startsWith(patternLower)) return 900;
  
  // Contains pattern as substring gets medium score
  if (textLower.includes(patternLower)) return 800;
  
  // Fuzzy match gets lower score based on pattern length
  if (fuzzyMatch(text, pattern)) {
    return 700 - (text.length - pattern.length) * 10;
  }
  
  return 0;
}

/**
 * Highlight matching text in a string
 */
export function highlightMatch(text: string, pattern: string): { text: string; isMatch: boolean }[] {
  if (!pattern) return [{ text, isMatch: false }];
  
  const patternLower = pattern.toLowerCase();
  const index = text.toLowerCase().indexOf(patternLower);
  
  if (index === -1) return [{ text, isMatch: false }];
  
  return [
    { text: text.slice(0, index), isMatch: false },
    { text: text.slice(index, index + pattern.length), isMatch: true },
    { text: text.slice(index + pattern.length), isMatch: false },
  ].filter(part => part.text.length > 0);
}

/**
 * Parse natural language price queries
 */
export function parsePriceQuery(query: string): { min?: number; max?: number } | null {
  const lowerQuery = query.toLowerCase();
  
  // "under X" or "below X" or "less than X"
  const underMatch = lowerQuery.match(/(?:under|below|less than)\s+(\d+)/);
  if (underMatch) {
    return { max: parseInt(underMatch[1]) };
  }
  
  // "over X" or "above X" or "more than X"
  const overMatch = lowerQuery.match(/(?:over|above|more than)\s+(\d+)/);
  if (overMatch) {
    return { min: parseInt(overMatch[1]) };
  }
  
  // "between X and Y"
  const betweenMatch = lowerQuery.match(/between\s+(\d+)\s+and\s+(\d+)/);
  if (betweenMatch) {
    return { min: parseInt(betweenMatch[1]), max: parseInt(betweenMatch[2]) };
  }
  
  return null;
}

/**
 * Get recent searches from localStorage
 */
export function getRecentSearches(maxItems: number = 5): string[] {
  try {
    const stored = localStorage.getItem('1health_recent_searches');
    if (!stored) return [];
    
    const searches = JSON.parse(stored) as string[];
    return searches.slice(0, maxItems);
  } catch {
    return [];
  }
}

/**
 * Add a search to recent searches
 */
export function addRecentSearch(query: string): void {
  if (!query.trim()) return;
  
  try {
    const recent = getRecentSearches(10);
    const filtered = recent.filter(s => s.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...filtered].slice(0, 5);
    
    localStorage.setItem('1health_recent_searches', JSON.stringify(updated));
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Clear recent searches
 */
export function clearRecentSearches(): void {
  try {
    localStorage.removeItem('1health_recent_searches');
  } catch {
    // Ignore localStorage errors
  }
}
