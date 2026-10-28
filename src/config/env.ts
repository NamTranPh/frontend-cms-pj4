export const env = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3004/api/v1',
  appName: import.meta.env.VITE_APP_NAME || 'Hệ Thống Admin',
} as const;
