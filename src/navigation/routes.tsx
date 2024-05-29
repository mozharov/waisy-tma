import type {ComponentType, JSX} from 'react'
import {IndexPage} from '@/pages/IndexPage/IndexPage'
import {InitDataPage} from '@/pages/InitDataPage/InitDataPage'

interface Route {
  path: string
  Component: ComponentType
  title?: string
  icon?: JSX.Element
}

export const routes: Route[] = [
  {path: '/', Component: IndexPage},
  {path: '/init-data', Component: InitDataPage, title: 'Init Data'},
]
