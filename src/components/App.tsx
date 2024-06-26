import {useIntegration} from '@tma.js/react-router-integration'
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  bindViewportCSSVars,
  initNavigator,
  useMiniApp,
  useThemeParams,
  useViewport,
  useLaunchParams,
} from '@tma.js/sdk-react'
import {AppRoot} from '@telegram-apps/telegram-ui'
import {type FC, useEffect, useMemo} from 'react'
import {Route, Router, Routes} from 'react-router-dom'
import {routes} from '@/navigation/routes.tsx'
import {getContactId} from '@/helpers'
import {usePostHog} from 'posthog-js/react'

export const App: FC = () => {
  const miniApp = useMiniApp()
  const themeParams = useThemeParams()
  const viewport = useViewport()
  const launchParams = useLaunchParams()
  const posthog = usePostHog()

  const user = launchParams.initData?.user
  useEffect(() => {
    if (!user) return
    posthog.identify(user.id.toString(), {
      first_name: user.firstName,
      last_name: user.lastName,
      username: user.username,
      telegram_premium: user.isPremium,
      language_code: user.languageCode,
      allows_write_to_pm: user.allowsWriteToPm
    })
  }, [posthog, user])

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams)
  }, [miniApp, themeParams])

  useEffect(() => {
    return bindThemeParamsCSSVars(themeParams)
  }, [themeParams])

  useEffect(() => {
    return viewport && bindViewportCSSVars(viewport)
  }, [viewport])

  const navigator = useMemo(() => initNavigator('app-navigation-state'), [])
  const [location, reactNavigator] = useIntegration(navigator)
  useEffect(() => {
    const contactId = getContactId()
    if (!isNaN(Number(contactId))) {
      navigator.replace(`/users/${contactId}`)
    } else {
      navigator.replace(`/contacts/${contactId}`)
    }
    void navigator.attach()
    return () => {
      navigator.detach()
    }
  }, [navigator])

  const backgroundColor =
    launchParams.platform === 'ios' ? themeParams.sectionBgColor : themeParams.bgColor

  return (
    <AppRoot
      appearance={miniApp.isDark ? 'dark' : 'light'}
      platform={'ios'}
      style={{
        backgroundColor,
        height: '100vh',
      }}
    >
      <Router location={location} navigator={reactNavigator}>
        <Routes>
          {routes.map(route => (
            <Route key={route.path} {...route} />
          ))}
        </Routes>
      </Router>
    </AppRoot>
  )
}
