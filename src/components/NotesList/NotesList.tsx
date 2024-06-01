import {List} from '@telegram-apps/telegram-ui'
import {FC} from 'react'
import {Note, NoteBlock} from '../NoteBlock/NoteBlock'

export const NotesList: FC<{notes: Note[]; removeNote: (id: string) => void}> = ({
  notes,
  removeNote,
}) => {
  return (
    <List style={{paddingTop: 20}}>
      {notes.map(note => (
        <NoteBlock removeNote={removeNote} key={note.id} note={note} />
      ))}
    </List>
  )
}
