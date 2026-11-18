export const ROUTES = {
  PUBLIC: {
    LOGIN: '/login',
  },
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    MOVIES: '/admin/movies',
    GENRES: '/admin/genres',
    EPISODES: '/admin/episodes',
    ACTORS: '/admin/actors',
    USERS: '/admin/users',
    MEMBERSHIP: '/admin/membership',
    PAYMENTS: '/admin/payments',
    REFUNDS: '/admin/refunds',
    PROFILE: '/admin/profile',
  },
} as const;

export type AppRoutes = typeof ROUTES;
