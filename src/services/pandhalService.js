import { PANDHALS_DATA } from '../data/pandhals';

/**
 * Robust Fisher-Yates shuffle for fair, unbiased randomization
 */
export function shufflePandhals(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const pandhalService = {
  /**
   * Retrieves all 21 pandhal entries
   */
  getAllPandhals: () => {
    return [...PANDHALS_DATA];
  },

  /**
   * Retrieves all 21 pandhals in a randomized order
   */
  getRandomizedPandhals: () => {
    return shufflePandhals(PANDHALS_DATA);
  },

  /**
   * Retrieves a single pandhal by ID
   * @param {string} id 
   */
  getPandhalById: (id) => {
    return PANDHALS_DATA.find(p => p.id === id) || null;
  },

  /**
   * Filter and search pandhals with randomized fair exposure
   * @param {Array} baseList 
   * @param {string} query 
   * @param {string} category 
   * @param {Object} liveCounts 
   */
  filterPandhals: (baseList = PANDHALS_DATA, query = '', category = 'all', liveCounts = {}) => {
    const q = query.toLowerCase().trim();
    let list = (baseList || PANDHALS_DATA).filter(p => {
      const matchSearch = !q || 
        p.name.toLowerCase().includes(q) ||
        p.organization.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.theme.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (category === 'all') return true;
      if (category === 'eco') return p.badge.includes('Eco') || p.theme.includes('Botanical') || p.theme.includes('Clay');
      if (category === 'heritage') return p.badge.includes('Heritage') || p.badge.includes('Ancient') || p.establishedYear < 1980;
      if (category === 'darbar') return p.theme.includes('Darbar') || p.theme.includes('Throne') || p.theme.includes('Palace') || p.theme.includes('Raja');
      return true;
    });

    if (category === 'top') {
      list = [...list].sort((a, b) => {
        const countA = liveCounts[a.id] || 0;
        const countB = liveCounts[b.id] || 0;
        return countB - countA;
      });
    }

    return list;
  }
};
