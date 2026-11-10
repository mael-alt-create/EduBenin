// Stockage en mémoire : pratique pour le développement et les tests.
export function createMemoryStore() {
  const data = new Map();
  return {
    async progress(device) {
      return [...(data.get(device) ?? new Map())].map(([key, points]) => ({ key, points }));
    },
    // Renvoie true si les points sont attribués, false s'ils l'étaient déjà.
    async award(device, key, points) {
      const rows = data.get(device) ?? new Map();
      data.set(device, rows);
      if (rows.has(key)) return false;
      rows.set(key, points);
      return true;
    },
  };
}
