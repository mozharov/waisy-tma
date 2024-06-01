import {Skeleton, Image, Cell, Checkbox, ButtonCell, Text} from '@telegram-apps/telegram-ui'
import {FC, useState} from 'react'
import {Block} from '../Block/Block'
import {Contact} from '@/pages/ContactPage/ContactPage'
import {useThemeParams} from '@tma.js/sdk-react'

export const AvatarBlock: FC<{contact: Contact}> = ({contact}) => {
  const [visibleAvatarSkelet, setVisibleAvatarSkelet] = useState(!!contact.photo)
  const themeParams = useThemeParams()

  // TODO: возможность сделать страницу контакта публичной
  // TODO: кнопка поделиться и ссылка на просмотр чужих публичных контактов

  return (
    <Block>
      <div
        style={{
          paddingTop: 10,
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: 10,
        }}
      >
        <div style={{paddingLeft: 10}}>
          <ButtonCell style={{height: 32, opacity: contact.public ? undefined : 0.3}}>
            Share
          </ButtonCell>
        </div>
        <div>
          <Cell
            after={<Checkbox checked={contact.public} />}
            style={{
              backgroundColor: 'unset',
              height: 32,
            }}
            interactiveAnimation="background"
            subtitle="Public page"
          />
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
              style={{backgroundColor: themeParams.buttonColor}}
              src={contact.photo}
              children={<Text>{contact.name[0]}</Text>}
              className={`fade-in ${visibleAvatarSkelet ? '' : 'loaded'}`}
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
    </Block>
  )
}
