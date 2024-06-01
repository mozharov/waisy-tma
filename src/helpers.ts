import {retrieveLaunchParams} from '@tma.js/sdk-react'

export function getContactId(): string | null {
  const search = window.location.search
  const contactId = new URLSearchParams(search).get('contactId')
  if (contactId) return contactId
  const {startParam} = retrieveLaunchParams()
  return startParam ?? null
}

export function getHeaders() {
  const {initDataRaw} = retrieveLaunchParams()
  const headers = {Authorization: `tma ${initDataRaw}`}
  return headers
}
