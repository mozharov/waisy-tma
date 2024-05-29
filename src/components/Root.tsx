import {SDKProvider, useLaunchParams} from '@tma.js/sdk-react'
import {type FC, useEffect} from 'react'
import {App} from './App.tsx'
import {ErrorBoundary} from '@/components/ErrorBoundary.tsx'

const ErrorBoundaryError: FC<{error: unknown}> = ({error}) => (
  <div>
    <p>An unhandled error occurred:</p>
    <blockquote>
      <code>
        {error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : JSON.stringify(error)}
      </code>
    </blockquote>
  </div>
)

const Inner: FC = () => {
  const debug = useLaunchParams().startParam === 'debug'

  useEffect(() => {
    if (debug) {
      import('eruda')
        .then(lib => {
          lib.default.init()
        })
        .catch(() => null)
    }
  }, [debug])

  return (
    <SDKProvider acceptCustomStyles debug={debug}>
      <App />
    </SDKProvider>
  )
}

export const Root: FC = () => (
  <ErrorBoundary fallback={ErrorBoundaryError}>
    <Inner />
  </ErrorBoundary>
)
