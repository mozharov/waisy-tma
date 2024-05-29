import {List, Placeholder, Avatar, Button, Divider} from '@telegram-apps/telegram-ui'
import {type FC} from 'react'
import {Block} from '@/components/Block/Block'
import {NoteBlock} from '@/components/NoteBlock/NoteBlock'

export const ContactPage: FC = () => {
  return (
    <div>
      <Block>
        <Placeholder header="Vladislav Mozharov" description="@vmozharov">
          <Avatar size={96} src="https://avatars.githubusercontent.com/u/84640980?v=4" />
        </Placeholder>
      </Block>

      <div style={{padding: '10px 60px'}}>
        <Divider />
      </div>

      <List style={{paddingTop: 20}}>
        <NoteBlock />
        <NoteBlock />
      </List>

      <div style={{padding: 20}}>
        <Button mode="filled" size="s" stretched={true}>
          Add a block
        </Button>
      </div>
    </div>
  )
}
