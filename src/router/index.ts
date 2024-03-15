import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import useUserStore from '@/stores/user'
import { GUEST_ROUTES, PUBLIC_ROUTES } from '@/configs/App'
import { Layout } from '@/enums/Layout'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        layout: Layout.DEFAULT
      }
    },
    {
      path: '/login',
      name: 'auth.login',
      component: () => import('@/views/Auth/LoginView.vue'),
      meta: {
        layout: Layout.DEFAULT
      }
    },
    {
      path: '/forgot-password',
      name: 'auth.forgot-password',
      component: () => import('@/views/Auth/ForgotPasswordView.vue'),
      meta: {
        layout: Layout.DEFAULT
      }
    },
    {
      path: '/reset-password',
      name: 'auth.reset-password',
      component: () => import('@/views/Auth/ResetPasswordView.vue'),
      meta: {
        layout: Layout.DEFAULT
      }
    },
    {
      path: '/login/:provider/validate',
      name: 'auth.login.provider.validate',
      component: () => import('@/views/Auth/LoginProviderValidateView.vue'),
      meta: {
        layout: Layout.DEFAULT
      }
    },
    {
      path: '/register',
      name: 'auth.register',
      component: () => import('@/views/Auth/RegisterView.vue'),
      meta: {
        layout: Layout.DEFAULT
      }
    },
    {
      path: '/paths/:businessSlug/:pathSlug/:pathHash',
      name: 'paths.show',
      component: () => import('@/views/Paths/PathView.vue'),
      meta: {
        layout: Layout.APP
      },
      children: [
        {
          path: 'pages/:pageHash',
          name: 'paths.show.pages.show',
          component: () => import('@/views/Paths/PathView.vue'),
          meta: {
            layout: Layout.APP
          }
        }
      ]
    },
    {
      path: '/pages/:pageHash',
      name: 'pages.show',
      component: () => import('@/views/Pages/PageView.vue'),
      meta: {
        layout: Layout.APP
      }
    },
    {
      path: '/invitations/reg-and-join-path/accept',
      name: 'invitations.reg-and-join-path',
      component: () => import('@/views/Invitations/InvitationRegisterAndJoinPath.vue'),
      meta: {
        layout: Layout.DEFAULT
      }
    },
    {
      path: '/invitations/join-path/accept',
      name: 'invitations.join-path',
      component: () => import('@/views/Invitations/InvitationJoinPath.vue'),
      meta: {
        layout: Layout.DEFAULT
      }
    },
    {
      path: '/gmail/authenticate/',
      name: 'gmail.authenticate',
      component: () => import('@/views/Auth/GmailAuthenticateView.vue'),
      meta: {
        layout: Layout.DEFAULT
      }
    },
    {
      path: '/waveapps/authenticate/',
      name: 'waveapps.authenticate',
      component: () => import('@/views/Auth/WaveAppsAuthenticateView.vue'),
    },
    {
      path: '/gdrive/callback/',
      name: 'gdrive.callback',
      component: () => import('@/views/Auth/GdriveAuthenticateView.vue'),
      meta: {
        layout: Layout.DEFAULT
      }
    },
    {
      path: '/magic-link/',
      name: 'auth.magic-link',
      component: () => import('@/views/Auth/MagicLinkView.vue'),
      meta: {
        layout: Layout.DEFAULT
      }
    }
  ]
})

router.beforeEach((to, _, next) => {
  const { isAuthenticated } = useUserStore()

  // Determines whether the route being accessed is one of the `PUBLIC_ROUTES`
  const isRoutePublic = to.matched.some((record: any) => PUBLIC_ROUTES.includes(record.name))

  // Determines whether the route being accessed is one of the `GUEST_ROUTES`
  const isRouteForGuestsOnly = to.matched.some((record: any) => GUEST_ROUTES.includes(record.name))

  /**
   * If the route being accessed is for guests only and the user is authenticated,
   * redirect it to the home page.
   *
   * Otherwise, allow it to access the page.
   */
  if (isRouteForGuestsOnly) {
    return isAuthenticated ? next({ name: 'home' }) : next()
  }

  /**
   * If the route being accessed is available for all (meaning it's a public page) and
   * the user is authenticated, allow access the page.
   *
   * Otherwise, redirect the user to the login page.
   */
  return isRoutePublic || isAuthenticated ? next() : next({ name: 'auth.login' })
})

export default router
