import type {ComponentType, JSX} from 'react'
import {ContactPage} from '@/pages/ContactPage/ContactPage'

interface Route {
  path: string
  Component: ComponentType
  title?: string
  icon?: JSX.Element
}

export const routes: Route[] = [{path: '/', Component: ContactPage}]
