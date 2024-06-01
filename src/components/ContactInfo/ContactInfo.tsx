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

const utils = initUtils()
const popup = initPopup()
const appName = import.meta.env.VITE_MINI_APP_NAME
const botUsername = import.meta.env.VITE_BOT_USERNAME
const {initData} = retrieveLaunchParams()

export const ContactInfo: FC<{contact: Contact; isOwner: boolean}> = ({contact, isOwner}) => {
  const [isPublic, setIsPublic] = useState(contact.public)
  const [publicDisabled, setPublicDisabled] = useState(false)

  const handlePublic = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPublicDisabled(true)
    const {checked} = event.target
    setIsPublic(checked)
    sendPublicValue(contact.id, checked)
      .catch((error: unknown) => {
        setIsPublic(!checked)
        console.error(error)
      })
      .finally(() => setPublicDisabled(false))
  }

  const handleShare = () => {
    if (!isPublic) {
      popup.open({message: 'Make page public before sharing'})
      return
    }
    let text = `There is my notes about `
    if (contact.username) text += `@${contact.username}`
    else if (contact.name) text += `${contact.name}`
    else text += 'this user.'
    utils.openTelegramLink(
      `https://t.me/share/url?url=https://t.me/${botUsername}/${appName}?startapp=${contact.id}&text=${text}`
    )
  }

  const [openNotesDisabled, setOpenNotesDisabled] = useState(false)
  const handleOpenNotes = () => {
    setOpenNotesDisabled(true)
    if (!initData?.user?.id) {
      console.error('no user id')
      return
    }
    sendContact(contact, initData.user.id)
      .then(({id}) => {
        utils.openTelegramLink(`https://t.me/${botUsername}/${appName}?startapp=${id}`)
      })
      .catch((error: unknown) => {
        console.error(error)
      })
      .finally(() => setOpenNotesDisabled(false))
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
              paddingBottom: 10,
            }}
          >
            <div style={{paddingLeft: 10}}>
              <ButtonCell
                onClick={handleShare}
                style={{height: 32, opacity: isPublic ? undefined : 0.3}}
              >
                Share
              </ButtonCell>
            </div>
            <PublicPageCell disabled={publicDisabled} onChange={handlePublic} checked={isPublic} />
          </div>
        ) : (
          <div style={{paddingTop: 10}} />
        )}

        <AvatarCell contact={contact} />
        <div style={{padding: 10}}>
          <Divider />
        </div>
        <div>
          <Cell
            description="Someone's public notes about this user"
            style={{height: 32, backgroundColor: 'unset'}}
          />
        </div>
      </Block>
      {!isOwner && (
        <div style={{padding: '0px 40px 40px'}}>
          <Button
            disabled={openNotesDisabled}
            mode="gray"
            size="s"
            stretched={true}
            onClick={handleOpenNotes}
          >
            Open my notes
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
