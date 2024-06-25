import {Button, ButtonCell, Cell, Divider} from '@telegram-apps/telegram-ui'
import {FC, useState} from 'react'
import {Block} from '../Block/Block'
import {Contact} from '@/pages/ContactPage/Contact.types'
import {AvatarCell} from '../AvatarCell/AvatarCell'
import {PublicPageCell} from '../PublicPageCell/PublicPageCell'
import {getHeaders} from '@/helpers'
import axios from 'axios'
import {initUtils, initPopup} from '@tma.js/sdk'
import {retrieveLaunchParams} from '@tma.js/sdk-react'
import {useTranslation} from 'react-i18next'
import {useNavigate} from 'react-router-dom'
import {usePostHog} from 'posthog-js/react'

const utils = initUtils()
const popup = initPopup()
const appName = import.meta.env.VITE_MINI_APP_NAME
const botUsername = import.meta.env.VITE_BOT_USERNAME
const {initData} = retrieveLaunchParams()

export const ContactInfo: FC<{
  contact: Contact
  isOwner: boolean
  setContact?: (contact: Contact | null) => void
}> = ({contact, isOwner, setContact}) => {
  const {t} = useTranslation()
  const [isPublic, setIsPublic] = useState(contact.public)
  const [publicDisabled, setPublicDisabled] = useState(false)
  const posthog = usePostHog()

  const handlePublic = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPublicDisabled(true)
    const {checked} = event.target
    posthog.capture('clicked make contact public button', {contactId: contact.id, public: checked})
    setIsPublic(checked)
    setContact && setContact({...contact, public: checked})
    sendPublicValue(contact.id, checked)
      .catch((error: unknown) => {
        setIsPublic(!checked)
        console.error(error)
      })
      .finally(() => {
        setPublicDisabled(false)
      })
  }

  const handleShare = () => {
    posthog.capture('clicked share button from private notes', {contactId: contact.id})
    if (!isPublic) {
      void popup.open({message: t('make_public')})
      return
    }
    let text = t('share_text')
    if (contact.username) text += `@${contact.username}`
    else if (contact.firstName) text += `${contact.firstName} ${contact.lastName ?? ''}`
    else text += t('share_text_end')
    utils.openTelegramLink(
      `https://t.me/share/url?url=https://t.me/${botUsername}/${appName}?startapp=${contact.id}&text=${text}`
    )
  }

  const navigate = useNavigate()
  const [openNotesDisabled, setOpenNotesDisabled] = useState(false)
  const handleOpenNotes = () => {
    posthog.capture('clicked open private notes button from someone\'s notes', {contactId: contact.id})
    setOpenNotesDisabled(true)
    if (!initData?.user?.id) {
      console.error('no user id')
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

  return (
    <div>
      <Block>
        {isOwner ? (
          <div
            style={{
              paddingTop: 10,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div style={{paddingLeft: 10}}>
              <ButtonCell
                onClick={handleShare}
                style={{height: 32, opacity: isPublic ? undefined : 0.3}}
              >
                {t('share')}
              </ButtonCell>
            </div>
            <PublicPageCell disabled={publicDisabled} onChange={handlePublic} checked={isPublic} />
          </div>
        ) : (
          <div style={{paddingTop: 10}} />
        )}

        <AvatarCell contact={contact} />
        {!isOwner && (
          <div>
            <div style={{padding: 10}}>
              <Divider />
            </div>
            <div>
              <Cell
                description={t('public_notes')}
                style={{height: 32, backgroundColor: 'unset'}}
              />
            </div>
          </div>
        )}
      </Block>
      {!isOwner && (
        <div style={{padding: '0px 40px 10px'}}>
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
      )}
    </div>
  )
}

const headers = getHeaders()
const apiOrigin = import.meta.env.VITE_API_ORIGIN
async function sendPublicValue(contactId: string, value: boolean): Promise<void> {
  await axios.put(`${apiOrigin}/contacts/${contactId}`, {public: value}, {headers})
}

async function sendContact(contact: Contact, ownerTelegramId: number): Promise<{id: string}> {
  const res = await axios.post(
    `${apiOrigin}/contacts`,
    {
      firstName: contact.firstName,
      lastName: contact.lastName,
      username: contact.username,
      photo: contact.photo,
      ownerTelegramId,
      telegramId: contact.telegramId,
    },
    {headers}
  )

  return res.data as {id: string}
}
