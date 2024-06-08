import {List} from '@telegram-apps/telegram-ui'
import {FC} from 'react'
import {NoteBlock} from '../NoteBlock/NoteBlock'
import {TitleBlock} from '../TitleBlock/TitleBlock'
import {Note} from '../NoteBlock/Note.types'

export const NotesList: FC<{
  notes: Note[]
  removeNote: (id: string) => void
  isOwner: boolean
  publicPage: boolean
}> = ({notes, removeNote, isOwner, publicPage}) => {
  const showTitle = !!notes.length

  return (
    <div>
      <TitleBlock showTitle={showTitle} isOwner={isOwner} />
      <List style={{paddingTop: 20}}>
        {notes.map(note => (
          <NoteBlock
            removeNote={removeNote}
            key={note.id}
            note={note}
            isOwner={isOwner}
            publicPage={publicPage}
          />
        ))}
      </List>
    </div>
  )
}
