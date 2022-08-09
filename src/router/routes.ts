import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PageIndex.vue') },
      { path: 'collections', component: () => import('pages/PageCollections.vue') },
      { path: 'collection/:id', component: () => import('pages/PageCollection.vue') },
      { path: 'voids', component: () => import('pages/PageVoids.vue') },
      { path: 'void/:id', component: () => import('pages/PageVoid.vue') },
      { path: 'me', component: () => import('pages/PageMe.vue') },
      { path: 'user/:address', component: () => import('pages/PageUser.vue') },
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
