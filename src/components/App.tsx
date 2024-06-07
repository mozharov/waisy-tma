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
import {Navigate, Route, Router, Routes} from 'react-router-dom'
import {routes} from '@/navigation/routes.tsx'

export const App: FC = () => {
  const miniApp = useMiniApp()
  const themeParams = useThemeParams()
  const viewport = useViewport()
  const launchParams = useLaunchParams()

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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AppRoot>
  )
}
