import {Headline, Placeholder} from '@telegram-apps/telegram-ui'
import {useEffect, useMemo, useState, type FC} from 'react'
import {Note} from '@/components/NoteBlock/NoteBlock'
import axios from 'axios'
import {retrieveLaunchParams} from '@tma.js/sdk-react'
import {AvatarBlock} from '@/components/AvatarBlock/AvatarBlock'
import {NotFound} from '@/components/NotFound/NotFound'
import {Loader} from '@/components/Loader/Loader'
import {NotesList} from '@/components/NotesList/NotesList'
import {AddNoteButton} from '@/components/AddNoteButton/AddNoteButton'

const origin = import.meta.env.VITE_API_ORIGIN
const maxNotes = 300

export interface Contact {
  id: string
  telegramId: number
  name: string
  username: string
  photo: string
  public: boolean
  owner: {
    id: string
    telegramId: string
  }
}

// TODO: изменить скролл на красивый

export const ContactPage: FC = () => {
  const {initDataRaw} = retrieveLaunchParams()
  const headers = useMemo(() => ({Authorization: `tma ${initDataRaw}`}), [initDataRaw])
  const search = window.location.search
  const telegramContactId = useMemo(() => {
    return Number(new URLSearchParams(search).get('telegramContactId'))
  }, [search])
  const [contact, setContact] = useState<Contact | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [notes, setNotes] = useState<Note[] | null>(null)
  const [buttonDisabled, setButtonDisabled] = useState(false)

  const removeNote = (id: string) => {
    if (!notes) return
    setNotes(notes.filter(note => note.id !== id))
  }

  const handleAddNote = () => {
    setButtonDisabled(true)
    if (!contact || !notes) return
    axios
      .post(`${origin}/notes/${contact.telegramId}`, {text: ''}, {headers})
      .then(res => {
        const data = res.data as Note
        setNotes([...notes, data])
      })
      .catch((error: unknown) => {
        console.error(error)
      })
      .finally(() => {
        setButtonDisabled(false)
      })
  }

  useEffect(() => {
    if (!telegramContactId || isNaN(telegramContactId)) {
      console.error('Invalid userId')
      setNotFound(true)
      return
    }
    axios
      .get(`${origin}/contacts/${telegramContactId}`, {headers})
      .then(res => {
        const data = res.data as Contact
        data.username = `@${data.username}`
        setContact(data)
      })
      .catch((error: unknown) => {
        console.error(error)
        setNotFound(true)
      })
  }, [telegramContactId, initDataRaw, headers])

  useEffect(() => {
    if (!contact) return
    axios
      .get(`${origin}/notes/${telegramContactId}`, {headers})
      .then(res => {
        const data = res.data as Note[]
        setNotes(data)
      })
      .catch((error: unknown) => {
        console.error(error)
        setNotFound(true)
      })
  }, [contact, telegramContactId, initDataRaw, headers])

  const [headlineLoaded, setHeadlineLoaded] = useState(false)
  const showHeadline = !!notes?.length
  useEffect(() => {
    if (!showHeadline) return
    setTimeout(() => {
      setHeadlineLoaded(true)
    }, 0)
  }, [showHeadline])

  if (notFound) return <NotFound />
  if (!contact || !notes) return <Loader />

  return (
    <div>
      <AvatarBlock contact={contact} />

      {notes.length ? (
        <div
          style={{padding: '0px 40px'}}
          className={headlineLoaded ? 'fade-in loaded' : 'fade-in'}
        >
          <Headline>Notes</Headline>
        </div>
      ) : (
        <Placeholder description="You don't have any notes about this contact" />
      )}

      <NotesList removeNote={removeNote} notes={notes} />

      <AddNoteButton
        disabled={notes.length >= maxNotes || buttonDisabled}
        onClick={handleAddNote}
      />
    </div>
  )
}
