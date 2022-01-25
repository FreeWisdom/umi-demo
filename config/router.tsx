const router: any = [
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      // { path: '/', redirect: '/login' },
      { path: '/', redirect: '/planList' },
      {
        path: '/login',
        component: '@/pages/login/index',
        hiddenHeader: true,
        hiddenMenu: true,
      },
      {
        path: '/planList',
        name: 'planList',
        component: '@/pages/planList/index',
      },
      {
        path: '/KPI',
        name: 'KPI',
        routes: [
          {
            path: '/KPI/list',
            name: 'list',
            component: '@/pages/KPI/list',
          },
          {
            path: '/KPI/gant',
            name: 'gant',
            component: '@/pages/KPI/gant',
          },
        ]
      },
      {
        path: '/staffInfo',
        name: 'staffInfo',
        routes: [
          {
            path: '/staffInfo/list',
            name: 'list',
            component: '@/pages/staffInfo/list',
            routes: [
              {
                path: '/staffInfo/list/sleep',
                name: 'sleep',
                component: '@/pages/staffInfo/sleep',
              },
              {
                path: '/staffInfo/list/work',
                name: 'work',
                component: '@/pages/staffInfo/work',
              },
            ]
          },
          {
            path: '/staffInfo/gant',
            name: 'gant',
            component: '@/pages/staffInfo/gant',
          },
        ]
      },
      {
        path: '/app1',
        microApp: 'app1'
      },
    ],
  },
];

export default router;
