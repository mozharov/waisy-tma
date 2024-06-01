import {Contact} from '@/pages/ContactPage/Contact.types'
import {Cell, Skeleton, Image, Text} from '@telegram-apps/telegram-ui'
import {useThemeParams} from '@tma.js/sdk-react'
import {FC, useState} from 'react'

const apiOrigin = import.meta.env.VITE_API_ORIGIN

export const AvatarCell: FC<{contact: Contact}> = ({contact}) => {
  const themeParams = useThemeParams()
  const [visibleAvatarSkelet, setVisibleAvatarSkelet] = useState(!!contact.photo)
  const char = contact.name ? contact.name[0] : '?'

  const photoUrl = contact.photo && `${apiOrigin}/files/${contact.photo}`
  return (
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
      subtitle={contact.username}
    >
      {contact.name}
    </Cell>
  )
}
