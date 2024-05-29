import React from 'react'
import ReactDOM from 'react-dom/client'
import {Root} from '@/components/Root'
import '@telegram-apps/telegram-ui/dist/styles.css'
import './index.css'

const $root = document.getElementById('root')
if (!$root) throw new Error('No root element found')

ReactDOM.createRoot($root).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
