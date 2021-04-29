export default [
  {
    name: 'Index',
    path: '/',
    routes: [
      {
        name: 'Home',
        path: '/',
        component: '@/pages/index',
      },

      {
        name: 'payment',
        path: '/pay',
        routes: [
          {
            path: '/pay',
            redirect: '/pay/index',
          },

          {
            path: 'index',
            component: '@/pages/pay/index',
            title: 'Motion Pay',
          },
          {
            path: 'payInit',
            component: '@/pages/pay/PayInit',
            title: 'Motion Pay',
          },

          {
            redirect: '/404',
          },
        ],
      },

      {
        name: '404',
        path: '404',
        component: '@/pages/common/NotFound',
      },
      {
        name: 'error',
        path: 'error',
        component: '@/pages/common/Error',
      },

      {
        component: '@/pages/common/NotFound',
      },
    ],
  },
];

export const root = '';
