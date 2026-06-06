/**
 * Application Configuration
 *
 * Configuration values can be overridden using environment variables.
 * For Vite, use VITE_ prefix for environment variables.
 *
 * Create a .env file in the frontend root to override defaults:
 * VITE_API_DOMAIN=http://localhost:8080
 * VITE_ATM_IBAN=NL01INHO0000000001
 */

const config = {
  apiDomain: import.meta.env.VITE_API_DOMAIN || 'http://localhost:8080',
  atmIban:   import.meta.env.VITE_ATM_IBAN   || 'NL01INHO0000000001',
};

// Freeze config to prevent accidental mutations
export default Object.freeze(config);