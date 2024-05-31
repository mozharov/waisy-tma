import {
  List,
  Placeholder,
  Avatar,
  Button,
  Headline,
  Spinner,
  Skeleton,
} from '@telegram-apps/telegram-ui'
import {useEffect, useMemo, useState, type FC} from 'react'
import {Block} from '@/components/Block/Block'
import {NoteBlock} from '@/components/NoteBlock/NoteBlock'
import axios from 'axios'
import notFoundLottie from './not-found.json'
import Lottie from 'lottie-react'
import {retrieveLaunchParams} from '@tma.js/sdk-react'

interface Contact {
  id: string
  name: string
  username: string
  photo: string
  public: boolean
  owner: {
    id: string
    telegramId: string
  }
}

export const ContactPage: FC = () => {
  const {initDataRaw} = retrieveLaunchParams()
  const search = window.location.search
  const userId = useMemo(() => new URLSearchParams(search).get('userId'), [search])
  const [contact, setContact] = useState<Contact | null>(null)
  const [visibleAvatarSkelet, setVisibleAvatarSkelet] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!userId) throw new Error('No userId')
    void axios
      .get(`${import.meta.env.VITE_API_ORIGIN}/contacts/${userId}`, {
        headers: {
          Authorization: `tma ${initDataRaw}`,
        },
      })
      .then(response => {
        const data = response.data as Contact
        data.username = `@${data.username}`
        setContact(data)
      })
      .catch(() => {
        setNotFound(true)
      })
  }, [userId, initDataRaw])

  if (notFound) {
    return (
      <div
        style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
      >
        <Placeholder description="Contact not found">
          <Lottie animationData={notFoundLottie} style={{width: 150}} />
        </Placeholder>
      </div>
    )
  }

  if (!contact) {
    return (
      <div
        style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
      >
        <Placeholder>
          <Spinner size="l" />
        </Placeholder>
      </div>
    )
  }

  return (
    <div>
      <Block>
        <Placeholder header={contact.name} description={contact.username}>
          {contact.photo ? (
            <Skeleton
              visible={visibleAvatarSkelet}
              style={{borderRadius: '100%', overflow: 'hidden', width: 96, height: 96}}
            >
              <Avatar
                size={96}
                src={contact.photo}
                className={visibleAvatarSkelet ? 'fade-in' : 'fade-in-loaded'}
                onLoad={() => {
                  setVisibleAvatarSkelet(false)
                }}
              />
            </Skeleton>
          ) : null}
        </Placeholder>
      </Block>

      <div style={{padding: '0px 20px'}}>
        <Headline>Notes</Headline>
      </div>
      <List style={{paddingTop: 20}}>
        <NoteBlock />
        <NoteBlock />
      </List>

      <div style={{padding: 20}}>
        <Button mode="filled" size="s" stretched={true}>
          Add a note
        </Button>
      </div>
    </div>
  )
}
