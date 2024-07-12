import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _ccf290aa = () => interopDefault(import('../pages/coc.vue' /* webpackChunkName: "pages/coc" */))
const _8dafc7da = () => interopDefault(import('../pages/schedule.vue' /* webpackChunkName: "pages/schedule" */))
const _a2c3f960 = () => interopDefault(import('../pages/speakers.vue' /* webpackChunkName: "pages/speakers" */))
const _7e63973c = () => interopDefault(import('../pages/timer/index.vue' /* webpackChunkName: "pages/timer/index" */))
const _11a43af4 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))
const _2ab4368c = () => interopDefault(import('../pages/speaker/_displayName.vue' /* webpackChunkName: "pages/speaker/_displayName" */))
const _56eb8469 = () => interopDefault(import('../pages/sponsor/_name.vue' /* webpackChunkName: "pages/sponsor/_name" */))
const _6186915a = () => interopDefault(import('../pages/talk/_id.vue' /* webpackChunkName: "pages/talk/_id" */))
const _5c0357e3 = () => interopDefault(import('../pages/timer/_day.vue' /* webpackChunkName: "pages/timer/_day" */))
const _4a0cc60c = () => interopDefault(import('../pages/timer/_someDay/_room.vue' /* webpackChunkName: "pages/timer/_someDay/_room" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/coc",
    component: _ccf290aa,
    name: "coc"
  }, {
    path: "/schedule",
    component: _8dafc7da,
    name: "schedule"
  }, {
    path: "/speakers",
    component: _a2c3f960,
    name: "speakers"
  }, {
    path: "/timer",
    component: _7e63973c,
    name: "timer"
  }, {
    path: "/",
    component: _11a43af4,
    name: "index"
  }, {
    path: "/speaker/:displayName?",
    component: _2ab4368c,
    name: "speaker-displayName"
  }, {
    path: "/sponsor/:name?",
    component: _56eb8469,
    name: "sponsor-name"
  }, {
    path: "/talk/:id?",
    component: _6186915a,
    name: "talk-id"
  }, {
    path: "/timer/:day",
    component: _5c0357e3,
    name: "timer-day"
  }, {
    path: "/timer/:someDay/:room?",
    component: _4a0cc60c,
    name: "timer-someDay-room"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
