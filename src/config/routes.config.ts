export const ROUTES = {
  PUBLIC: {
    LOGIN: '/login',
  },
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    MOVIES: '/admin/movies',
    EPISODES: '/admin/episodes',
    USERS: '/admin/users',
    MEMBERSHIP: '/admin/membership',
    PAYMENTS: '/admin/payments',
    PROFILE: '/admin/profile',
  },
} as const;

export type AppRoutes = typeof ROUTES;
