import {useEffect, useMemo, useState, type FC} from 'react'
import axios, {AxiosError} from 'axios'
import {ContactInfo} from '@/components/ContactInfo/ContactInfo'
import {NotFound} from '@/components/NotFound/NotFound'
import {Loader} from '@/components/Loader/Loader'
import {NotesList} from '@/components/NotesList/NotesList'
import {AddNoteButton} from '@/components/AddNoteButton/AddNoteButton'
import {Contact} from './Contact.types'
import {getContactId, getHeaders} from '@/helpers'
import {UnknownError} from '@/components/UnknownError/UnknownError'
import {Note} from '@/components/NoteBlock/Note.types'
import {retrieveLaunchParams} from '@tma.js/sdk-react'

const maxNotes = 300

const {initData} = retrieveLaunchParams()
const user = initData?.user

export const ContactPage: FC = () => {
  const [unknownError, setUnknownError] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const contactId = useMemo(() => getContactId(), [])

  const [contact, setContact] = useState<Contact | null>(null)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    if (!contactId) return
    getContact(contactId)
      .then(contact => {
        setContact(contact)
        if (contact.owner.telegramId.toString() === user?.id.toString()) setIsOwner(true)
      })
      .catch((error: unknown) => {
        if (error instanceof AxiosError) {
          const status = error.response?.status
          if (status === 404 || status === 403) {
            setNotFound(true)
            return
          }
        }
        setUnknownError(true)
      })
  }, [contactId])

  const [notes, setNotes] = useState<Note[] | null>(null)
  useEffect(() => {
    if (!contactId) return
    getNotes(contactId)
      .then(setNotes)
      .catch((error: unknown) => {
        if (error instanceof AxiosError) {
          const status = error.response?.status
          if (status === 404 || status === 403) {
            setNotFound(true)
            return
          }
        }
        setUnknownError(true)
      })
  }, [contactId])

  const removeNote = (id: string) => {
    if (notes) setNotes(notes.filter(note => note.id !== id))
  }
  const addNote = (note: Note) => {
    if (notes) setNotes([...notes, note])
  }
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const handleAddNote = () => {
    if (!contactId) return
    setButtonDisabled(true)
    void sendNote(contactId)
      .then(addNote)
      .finally(() => {
        setButtonDisabled(false)
      })
  }

  if (notFound || !contactId) return <NotFound />
  if (unknownError || !initData || !user) return <UnknownError />
  if (!contact || !notes) return <Loader />

  const maxNotesReached = notes.length >= maxNotes
  return (
    <div>
      <ContactInfo contact={contact} isOwner={isOwner} />

      <NotesList removeNote={removeNote} notes={notes} isOwner={isOwner} />

      {isOwner && (
        <AddNoteButton disabled={maxNotesReached || buttonDisabled} onClick={handleAddNote} />
      )}
    </div>
  )
}

const headers = getHeaders()
const apiOrigin = import.meta.env.VITE_API_ORIGIN
async function getContact(id: string): Promise<Contact> {
  const res = await axios.get(`${apiOrigin}/contacts/${id}`, {headers})
  return res.data as Contact
}

async function getNotes(contactId: string): Promise<Note[]> {
  const res = await axios.get(`${apiOrigin}/contacts/${contactId}/notes`, {headers})
  return res.data as Note[]
}

async function sendNote(contactId: string): Promise<Note> {
  const res = await axios.post(`${apiOrigin}/notes`, {contactId}, {headers})
  return res.data as Note
}
