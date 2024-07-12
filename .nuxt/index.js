import Vue from 'vue'
import Vuex from 'vuex'
import Meta from 'vue-meta'
import ClientOnly from 'vue-client-only'
import NoSsr from 'vue-no-ssr'
import { createRouter } from './router.js'
import NuxtChild from './components/nuxt-child.js'
import NuxtError from './components/nuxt-error.vue'
import Nuxt from './components/nuxt.js'
import App from './App.js'
import { setContext, getLocation, getRouteData, normalizeError } from './utils'
import { createStore } from './store.js'

/* Plugins */

import nuxt_plugin_smoothscrollpolyfill_b8ee2e28 from 'nuxt_plugin_smoothscrollpolyfill_b8ee2e28' // Source: ../plugins/smoothscroll-polyfill.js (mode: 'client')
import nuxt_plugin_vuelightboxclient_c6d191a0 from 'nuxt_plugin_vuelightboxclient_c6d191a0' // Source: ../plugins/vue-lightbox.client.js (mode: 'client')
import nuxt_plugin_smartbannerclient_17a4afc6 from 'nuxt_plugin_smartbannerclient_17a4afc6' // Source: ../plugins/smartbanner.client.js (mode: 'client')

// Component: <ClientOnly>
Vue.component(ClientOnly.name, ClientOnly)

// TODO: Remove in Nuxt 3: <NoSsr>
Vue.component(NoSsr.name, {
  ...NoSsr,
  render (h, ctx) {
    if (process.client && !NoSsr._warned) {
      NoSsr._warned = true

      console.warn('<no-ssr> has been deprecated and will be removed in Nuxt 3, please use <client-only> instead')
    }
    return NoSsr.render(h, ctx)
  }
})

// Component: <NuxtChild>
Vue.component(NuxtChild.name, NuxtChild)
Vue.component('NChild', NuxtChild)

// Component NuxtLink is imported in server.js or client.js

// Component: <Nuxt>
Vue.component(Nuxt.name, Nuxt)

Object.defineProperty(Vue.prototype, '$nuxt', {
  get() {
    const globalNuxt = this.$root ? this.$root.$options.$nuxt : null
    if (process.client && !globalNuxt && typeof window !== 'undefined') {
      return window.$nuxt
    }
    return globalNuxt
  },
  configurable: true
})

Vue.use(Meta, {"keyName":"head","attribute":"data-n-head","ssrAttribute":"data-n-head-ssr","tagIDKeyName":"hid"})

const defaultTransition = {"name":"page","mode":"out-in","appear":false,"appearClass":"appear","appearActiveClass":"appear-active","appearToClass":"appear-to"}

const originalRegisterModule = Vuex.Store.prototype.registerModule

function registerModule (path, rawModule, options = {}) {
  const preserveState = process.client && (
    Array.isArray(path)
      ? !!path.reduce((namespacedState, path) => namespacedState && namespacedState[path], this.state)
      : path in this.state
  )
  return originalRegisterModule.call(this, path, rawModule, { preserveState, ...options })
}

async function createApp(ssrContext, config = {}) {
  const store = createStore(ssrContext)
  const router = await createRouter(ssrContext, config, { store })

  // Add this.$router into store actions/mutations
  store.$router = router

  // Fix SSR caveat https://github.com/nuxt/nuxt.js/issues/3757#issuecomment-414689141
  store.registerModule = registerModule

  // Create Root instance

  // here we inject the router and store to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = {
    head: {"title":"Touraine Tech 2024- Conférence sur les nouvelles technologie du numérique","htmlAttrs":{"lang":"fr"},"meta":[{"charset":"utf-8"},{"name":"google-site-verification","content":"aloBwm93e88RJEH5XUhpIl9yuBphazWNYt6Al0PR7cM"},{"name":"viewport","content":"width=device-width, initial-scale=1"},{"hid":"description","name":"description","content":"La conférence technique en région centre sur les nouvelles technologies du numérique"},{"hid":"ogtitle","property":"og:title","content":"Touraine Tech 2024- Conférence sur les nouvelles technologie du numérique"},{"hid":"ogdescription","property":"og:description","content":"La conférence technique en région centre sur les nouvelles technologies du numérique"},{"hid":"ogtype","property":"og:type","content":"website"},{"hid":"ogurl","property":"og:url","content":"https:\u002F\u002Ftouraine.tech\u002F"},{"hid":"ogimage","property":"og:image","content":"https:\u002F\u002Ftouraine.tech\u002Flogo.jpg"},{"property":"og:locale","content":"fr_FR"},{"hid":"twittercard","name":"twitter:card","content":"summary"},{"hid":"twittersite","name":"twitter:site","content":"@tourainetech"},{"hid":"twittertitle","name":"twitter:title","content":"Touraine Tech 2024- Conférence sur les nouvelles technologie du numérique"},{"hid":"twitterdescription","name":"twitter:description","content":"La conférence technique en région centre sur les nouvelles technologies du numérique"},{"hid":"twitterimage","name":"twitter:image","content":"https:\u002F\u002Ftouraine.tech\u002Flogo.jpg"},{"hid":"twitterimagealt","name":"twitter:image:alt","content":"Touraine tech logo"},{"name":"apple-mobile-web-app-title","content":"Touraine Tech"},{"name":"application-name","content":"Touraine Tech"},{"name":"msapplication-TileColor","content":"#ffffff"},{"name":"theme-color","content":"#ffffff"},{"name":"apple-itunes-app","content":"app-id=1599891078"},{"name":"google-play-app","content":"app-id=to.chapi.tnt"}],"link":[{"rel":"stylesheet","href":"https:\u002F\u002Ffonts.googleapis.com\u002Fcss?family=Noto+Sans&display=swap"},{"rel":"apple-touch-icon","sizes":"180x180","href":"\u002Fapple-touch-icon.png?v=WGoYma5yEm"},{"rel":"icon","type":"image\u002Fpng","sizes":"32x32","href":"\u002Ffavicon-32x32.png?v=WGoYma5yEm"},{"rel":"icon","type":"image\u002Fpng","sizes":"16x16","href":"\u002Ffavicon-16x16.png?v=WGoYma5yEm"},{"rel":"manifest","href":"\u002Fsite.webmanifest?v=WGoYma5yEm"},{"rel":"mask-icon","href":"\u002Fsafari-pinned-tab.svg?v=WGoYma5yEm","color":"#333333"},{"rel":"shortcut icon","href":"\u002Ffavicon.ico?v=WGoYma5yEm"}],"style":[],"script":[]},

    store,
    router,
    nuxt: {
      defaultTransition,
      transitions: [defaultTransition],
      setTransitions (transitions) {
        if (!Array.isArray(transitions)) {
          transitions = [transitions]
        }
        transitions = transitions.map((transition) => {
          if (!transition) {
            transition = defaultTransition
          } else if (typeof transition === 'string') {
            transition = Object.assign({}, defaultTransition, { name: transition })
          } else {
            transition = Object.assign({}, defaultTransition, transition)
          }
          return transition
        })
        this.$options.nuxt.transitions = transitions
        return transitions
      },

      err: null,
      dateErr: null,
      error (err) {
        err = err || null
        app.context._errored = Boolean(err)
        err = err ? normalizeError(err) : null
        let nuxt = app.nuxt // to work with @vue/composition-api, see https://github.com/nuxt/nuxt.js/issues/6517#issuecomment-573280207
        if (this) {
          nuxt = this.nuxt || this.$options.nuxt
        }
        nuxt.dateErr = Date.now()
        nuxt.err = err
        // Used in src/server.js
        if (ssrContext) {
          ssrContext.nuxt.error = err
        }
        return err
      }
    },
    ...App
  }

  // Make app available into store via this.app
  store.app = app

  const next = ssrContext ? ssrContext.next : location => app.router.push(location)
  // Resolve route
  let route
  if (ssrContext) {
    route = router.resolve(ssrContext.url).route
  } else {
    const path = getLocation(router.options.base, router.options.mode)
    route = router.resolve(path).route
  }

  // Set context to app.context
  await setContext(app, {
    store,
    route,
    next,
    error: app.nuxt.error.bind(app),
    payload: ssrContext ? ssrContext.payload : undefined,
    req: ssrContext ? ssrContext.req : undefined,
    res: ssrContext ? ssrContext.res : undefined,
    beforeRenderFns: ssrContext ? ssrContext.beforeRenderFns : undefined,
    beforeSerializeFns: ssrContext ? ssrContext.beforeSerializeFns : undefined,
    ssrContext
  })

  function inject(key, value) {
    if (!key) {
      throw new Error('inject(key, value) has no key provided')
    }
    if (value === undefined) {
      throw new Error(`inject('${key}', value) has no value provided`)
    }

    key = '$' + key
    // Add into app
    app[key] = value
    // Add into context
    if (!app.context[key]) {
      app.context[key] = value
    }

    // Add into store
    store[key] = app[key]

    // Check if plugin not already installed
    const installKey = '__nuxt_' + key + '_installed__'
    if (Vue[installKey]) {
      return
    }
    Vue[installKey] = true
    // Call Vue.use() to install the plugin into vm
    Vue.use(() => {
      if (!Object.prototype.hasOwnProperty.call(Vue.prototype, key)) {
        Object.defineProperty(Vue.prototype, key, {
          get () {
            return this.$root.$options[key]
          }
        })
      }
    })
  }

  // Inject runtime config as $config
  inject('config', config)

  if (process.client) {
    // Replace store state before plugins execution
    if (window.__NUXT__ && window.__NUXT__.state) {
      store.replaceState(window.__NUXT__.state)
    }
  }

  // Add enablePreview(previewData = {}) in context for plugins
  if (process.static && process.client) {
    app.context.enablePreview = function (previewData = {}) {
      app.previewData = Object.assign({}, previewData)
      inject('preview', previewData)
    }
  }
  // Plugin execution

  if (process.client && typeof nuxt_plugin_smoothscrollpolyfill_b8ee2e28 === 'function') {
    await nuxt_plugin_smoothscrollpolyfill_b8ee2e28(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_vuelightboxclient_c6d191a0 === 'function') {
    await nuxt_plugin_vuelightboxclient_c6d191a0(app.context, inject)
  }

  if (process.client && typeof nuxt_plugin_smartbannerclient_17a4afc6 === 'function') {
    await nuxt_plugin_smartbannerclient_17a4afc6(app.context, inject)
  }

  // Lock enablePreview in context
  if (process.static && process.client) {
    app.context.enablePreview = function () {
      console.warn('You cannot call enablePreview() outside a plugin.')
    }
  }

  // Wait for async component to be resolved first
  await new Promise((resolve, reject) => {
    // Ignore 404s rather than blindly replacing URL in browser
    if (process.client) {
      const { route } = router.resolve(app.context.route.fullPath)
      if (!route.matched.length) {
        return resolve()
      }
    }
    router.replace(app.context.route.fullPath, resolve, (err) => {
      // https://github.com/vuejs/vue-router/blob/v3.4.3/src/util/errors.js
      if (!err._isRouter) return reject(err)
      if (err.type !== 2 /* NavigationFailureType.redirected */) return resolve()

      // navigated to a different route in router guard
      const unregister = router.afterEach(async (to, from) => {
        if (process.server && ssrContext && ssrContext.url) {
          ssrContext.url = to.fullPath
        }
        app.context.route = await getRouteData(to)
        app.context.params = to.params || {}
        app.context.query = to.query || {}
        unregister()
        resolve()
      })
    })
  })

  return {
    store,
    app,
    router
  }
}

export { createApp, NuxtError }
