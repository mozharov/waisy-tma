import {Block} from '@/components/Block/Block'
import {Loader} from '@/components/Loader/Loader'
import {NotFound} from '@/components/NotFound/NotFound'
import {Note} from '@/components/NoteBlock/Note.types'
import {NotesList} from '@/components/NotesList/NotesList'
import {UnknownError} from '@/components/UnknownError/UnknownError'
import {getHeaders} from '@/helpers'
import {Cell, Skeleton, Image, Text, Divider, Button, ButtonCell} from '@telegram-apps/telegram-ui'
import {retrieveLaunchParams, useThemeParams, useUtils} from '@tma.js/sdk-react'
import axios, {AxiosError} from 'axios'
import {FC, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useNavigate, useParams} from 'react-router-dom'
import {usePostHog} from 'posthog-js/react'

const apiOrigin = import.meta.env.VITE_API_ORIGIN
const appName = import.meta.env.VITE_MINI_APP_NAME
const botUsername = import.meta.env.VITE_BOT_USERNAME

interface PublicContact {
  telegramId: number
  firstName?: string | null
  lastName?: string | null
  username?: string | null
  photo?: string | null
}

const {initData} = retrieveLaunchParams()

export const PublicPages: FC = () => {
  const {id} = useParams()
  const themeParams = useThemeParams()
  const [notFound, setNotFound] = useState(false)
  const [unknownError, setUnknownError] = useState(false)
  const posthog = usePostHog()

  const [contact, setContact] = useState<PublicContact | null>(null)
  useEffect(() => {
    if (!id) return
    posthog.capture('opened public contact page', {contactId: id})
    getPublicContact(Number(id))
      .then(contact => {
        setContact(contact)
      })
      .catch((error: unknown) => {
        if (error instanceof AxiosError) {
          const status = error.response?.status
          if (status === 404 || status === 403) {
            console.error(error)
            setNotFound(true)
            return
          }
        }
        console.error(error)
        setUnknownError(true)
      })
  }, [id, posthog])

  const [notes, setNotes] = useState<Note[] | null>(null)
  useEffect(() => {
    getNotes(Number(id))
      .then(setNotes)
      .catch((error: unknown) => {
        if (error instanceof AxiosError) {
          const status = error.response?.status
          if (status === 404 || status === 403) {
            console.error(error)
            setNotFound(true)
            return
          }
        }
        console.error(error)
        setUnknownError(true)
      })
  }, [id])

  const [visibleAvatarSkelet, setVisibleAvatarSkelet] = useState(true)
  useEffect(() => {
    if (contact && !contact.photo) {
      setVisibleAvatarSkelet(false)
    }
  }, [contact])

  const navigate = useNavigate()
  const [openNotesDisabled, setOpenNotesDisabled] = useState(false)
  const handleOpenNotes = () => {
    posthog.capture('opened private contact notes from public page', {contactId: id})
    setOpenNotesDisabled(true)
    if (!initData?.user?.id) {
      console.error('no user id')
      setOpenNotesDisabled(false)
      return
    }
    if (!contact) {
      console.error('no contact')
      setOpenNotesDisabled(false)
      return
    }
    sendContact(contact)
      .then(({id}) => {
        navigate(`/contacts/${id}`)
      })
      .catch((error: unknown) => {
        console.error(error)
      })
      .finally(() => {
        setOpenNotesDisabled(false)
      })
  }
  const {t} = useTranslation()
  const utils = useUtils()

  const handleShare = () => {
    posthog.capture('shared public contact', {contactId: id})
    let text = t('share_public_text')
    if (contact?.username) text += `@${contact.username}`
    else if (contact?.firstName) text += `${contact.firstName} ${contact.lastName ?? ''}`
    else text += t('share_text_end')
    utils.openTelegramLink(
      `https://t.me/share/url?url=https://t.me/${botUsername}/${appName}?startapp=${contact?.telegramId}&text=${text}`
    )
  }

  if (!contact || !notes) return <Loader />

  const photoUrl = contact.photo ? `${apiOrigin}/files/${contact.photo}` : undefined
  const char = contact.firstName ? contact.firstName[0] : '?'
  if (notFound || !id) return <NotFound />
  if (unknownError) return <UnknownError />
  return (
    <div>
      <Block>
        <div
          style={{
            paddingTop: 10,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div style={{paddingLeft: 10}}>
            <ButtonCell onClick={handleShare} style={{height: 32}}>
              {t('share')}
            </ButtonCell>
          </div>
        </div>
        <Cell
          style={{backgroundColor: 'unset'}}
          before={
            <Skeleton
              visible={visibleAvatarSkelet}
              style={{borderRadius: '12px', overflow: 'hidden', width: 48, height: 48}}
            >
              <Image
                size={48}
                style={{
                  backgroundColor: themeParams.buttonColor,
                  transition: 'opacity 0.3s ease',
                  opacity: !visibleAvatarSkelet ? 1 : 0,
                }}
                src={photoUrl}
                children={<Text>{char}</Text>}
                onLoad={() => {
                  setVisibleAvatarSkelet(false)
                }}
              />
            </Skeleton>
          }
          subtitle={`@${contact.username}`}
        >
          {contact.firstName} {contact.lastName}
        </Cell>
        <div>
          <div style={{padding: 10}}>
            <Divider />
          </div>
          <div>
            <Cell
              description={t('public_notes_list')}
              style={{height: 32, backgroundColor: 'unset'}}
            />
          </div>
        </div>
      </Block>
      <div style={{padding: '0px 40px 40px'}}>
        <Button
          disabled={openNotesDisabled}
          mode="gray"
          size="s"
          stretched={true}
          onClick={handleOpenNotes}
        >
          {t('my_notes')}
        </Button>
      </div>
      <NotesList removeNote={() => null} notes={notes} isOwner={false} publicPage={true} />
    </div>
  )
}

const headers = getHeaders()
async function getPublicContact(telegramId: number): Promise<PublicContact> {
  const res = await axios.get(`${apiOrigin}/public/${telegramId}`, {headers})
  return res.data as PublicContact
}

async function getNotes(telegramId: number): Promise<Note[]> {
  const res = await axios.get(`${apiOrigin}/public/${telegramId}/notes`, {headers})
  return res.data as Note[]
}

async function sendContact(contact: PublicContact): Promise<{id: string}> {
  const res = await axios.post(
    `${apiOrigin}/contacts`,
    {
      firstName: contact.firstName,
      lastName: contact.lastName,
      username: contact.username,
      photo: contact.photo,
      telegramId: contact.telegramId,
    },
    {headers}
  )

  return res.data as {id: string}
}
