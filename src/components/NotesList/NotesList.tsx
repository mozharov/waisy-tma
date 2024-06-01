import {List} from '@telegram-apps/telegram-ui'
import {FC} from 'react'
import {Note, NoteBlock} from '../NoteBlock/NoteBlock'

export const NotesList: FC<{notes: Note[]}> = ({notes}) => {
  return (
    <List style={{paddingTop: 20}}>
      {notes.map(note => (
        <NoteBlock key={note.id} note={note} />
      ))}
    </List>
  )
}
