import { RouteRecordRaw } from 'vue-router'
import needAuth from './needAuth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PageIndex.vue') },
      {
        path: 'collections',
        component: () => import('pages/PageCollections.vue'),
      },
      {
        path: 'collections/:id',
        component: () => import('pages/PageCollection.vue'),
      },
      { path: 'voids', component: () => import('pages/PageVoids.vue') },
      { path: 'voids/:id', component: () => import('pages/PageVoid.vue') },
      { path: 'fgrs', component: () => import('pages/PageFgrs.vue') },
      { path: 'fgrs/:id', component: () => import('pages/PageFgr.vue') },
      {
        path: 'me',
        component: () => import('pages/PageMe.vue'),
        beforeEnter: needAuth,
      },
      { path: 'users/:address', component: () => import('pages/PageUser.vue') },
      { path: 'manifesto', component: () => import('pages/PageManifesto.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/PageError404.vue'),
  },
]

export default routes
