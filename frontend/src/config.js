/** Backend origin without trailing slash. Override with VITE_API_URL (see .env.production). */
export const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(
  /\/$/,
  ''
);
