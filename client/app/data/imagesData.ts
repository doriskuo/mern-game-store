const BASE_URL = import.meta.env.VITE_IMG_BASE_URL;

export const images = Array.from(
  { length: 12 },
  (_, i) => `${BASE_URL}/games/game${i + 1}.jpg`
);
