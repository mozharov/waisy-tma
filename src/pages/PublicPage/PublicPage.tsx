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

const apiOrigin = import.meta.env.VITE_API_ORIGIN
const appName = import.meta.env.VITE_MINI_APP_NAME
const botUsername = import.meta.env.VITE_BOT_USERNAME

interface User {
  telegramId: number
  name?: string
  username?: string
  photo?: string
}

const {initData} = retrieveLaunchParams()

export const PublicPages: FC = () => {
  const {id} = useParams()
  const themeParams = useThemeParams()
  const [notFound, setNotFound] = useState(false)
  const [unknownError, setUnknownError] = useState(false)

  const [contact, setContact] = useState<User | null>(null)
  useEffect(() => {
    getUser(Number(id))
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
  }, [id])

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
    sendContact(contact, initData.user.id)
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
    let text = t('shate_public_text')
    if (contact?.username) text += `@${contact.username}`
    else if (contact?.name) text += contact.name
    else text += t('shate_text_end')
    utils.openTelegramLink(
      `https://t.me/share/url?url=https://t.me/${botUsername}/${appName}?startapp=${contact?.telegramId}&text=${text}`
    )
  }

  if (!contact || !notes) return <Loader />

  const photoUrl = contact.photo && `${apiOrigin}/files/${contact.photo}`
  const char = contact.name ? contact.name[0] : '?'

  if (notFound || !id) return <NotFound />
  if (unknownError) return <UnknownError />
  // TODO: кнопка поделиться публичной страницей
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
          {contact.name}
        </Cell>
        <div>
          <div style={{padding: 10}}>
            <Divider />
          </div>
          <div>
            <Cell
              description="All public notes about this user"
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
async function getUser(telegramId: number): Promise<User> {
  const res = await axios.get(`${apiOrigin}/public/${telegramId}`, {headers})
  return res.data as User
}

async function getNotes(telegramId: number): Promise<Note[]> {
  const res = await axios.get(`${apiOrigin}/public/${telegramId}/notes`, {headers})
  return res.data as Note[]
}

async function sendContact(contact: User, ownerTelegramId: number): Promise<{id: string}> {
  const res = await axios.post(
    `${apiOrigin}/contacts`,
    {
      name: contact.name,
      username: contact.username,
      photo: contact.photo,
      ownerTelegramId,
      telegramId: contact.telegramId,
    },
    {headers}
  )

  return res.data as {id: string}
}
