export type AppRoutes = {
  '/listener/player': {
    bookId: string;
  };
  '/listener/home': undefined;
  '/volunteer/record': undefined;
  '/volunteer/home': undefined;
  '/': undefined;
};

export type RouteKeys = keyof AppRoutes; 