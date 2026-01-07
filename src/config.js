// Centralized configuration from environment variables
export const config = {
  pocketbaseUrl: import.meta.env.VITE_POCKETBASE_URL || 'https://api.mdajam.com',
  publicUrl: import.meta.env.VITE_PUBLIC_URL || 'https://links.mdajam.com',
  portfolioUrl: import.meta.env.VITE_PORTFOLIO_URL || 'https://msharydajam.dev',
};
