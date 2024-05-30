import {List, Placeholder, Avatar, Button, Headline} from '@telegram-apps/telegram-ui'
import {useEffect, useMemo, type FC} from 'react'
import {Block} from '@/components/Block/Block'
import {NoteBlock} from '@/components/NoteBlock/NoteBlock'
// import axios from 'axios'

export const ContactPage: FC = () => {
  const search = window.location.search
  const userId = useMemo(() => {
    return new URLSearchParams(search).get('userId')
  }, [search])

  // useEffect(() => {
  //   if (!userId) throw new Error('No userId')
  //   void axios
  //     .get(`https://concise-herring-primary.ngrok-free.app/contacts/${userId}`)
  //     .then(response => {
  //       console.log('RESPONSE', response.data)
  //     })
  //     .catch((error: unknown) => {
  //       console.log('ERROR', error)
  //     })
  // })

  console.log('TEST', userId)
  return (
    <div>
      <Block>
        <Placeholder header="Vladislav Mozharov" description="@vmozharov">
          <Avatar size={96} src="https://avatars.githubusercontent.com/u/84640980?v=4" />
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
