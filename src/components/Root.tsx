import {SDKProvider} from '@tma.js/sdk-react'
import {type FC, useEffect} from 'react'
import '@/i18n/i18n.ts'
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
  useEffect(() => {
    if (import.meta.env.DEV) {
      import('eruda')
        .then(lib => {
          lib.default.init()
        })
        .catch(() => null)
    }
  }, [])

  return (
    <SDKProvider acceptCustomStyles debug={import.meta.env.DEV}>
      <App />
    </SDKProvider>
  )
}

export const Root: FC = () => (
  <ErrorBoundary fallback={ErrorBoundaryError}>
    <Inner />
  </ErrorBoundary>
)
