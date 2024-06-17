import {useEffect, useState, type FC} from 'react'
import axios, {AxiosError} from 'axios'
import {ContactInfo} from '@/components/ContactInfo/ContactInfo'
import {NotFound} from '@/components/NotFound/NotFound'
import {Loader} from '@/components/Loader/Loader'
import {NotesList} from '@/components/NotesList/NotesList'
import {AddNoteButton} from '@/components/AddNoteButton/AddNoteButton'
import {Contact} from './Contact.types'
import {getHeaders} from '@/helpers'
import {UnknownError} from '@/components/UnknownError/UnknownError'
import {Note} from '@/components/NoteBlock/Note.types'
import {retrieveLaunchParams} from '@tma.js/sdk-react'
import {Button} from '@telegram-apps/telegram-ui'
import {useNavigate, useParams} from 'react-router-dom'
import {useTranslation} from 'react-i18next'

const maxNotes = 300

const {initData} = retrieveLaunchParams()
const user = initData?.user

export const ContactPage: FC = () => {
  const [unknownError, setUnknownError] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const {id} = useParams()

  const [contact, setContact] = useState<Contact | null>(null)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    if (!id) return
    setContact(null)
    setIsOwner(false)
    getContact(id)
      .then(contact => {
        setContact(contact)
        if (contact.owner) setIsOwner(true)
      })
      .catch((error: unknown) => {
        if (error instanceof AxiosError) {
          const status = error.response?.status
          if (status === 404 || status === 403) {
            console.error(error)
            setNotFound(true)
            return
          }
        }
        console.error(error)
        setUnknownError(true)
      })
  }, [id])

  const [notes, setNotes] = useState<Note[] | null>(null)
  useEffect(() => {
    if (!id) return
    setNotes(null)
    getNotes(id)
      .then(setNotes)
      .catch((error: unknown) => {
        if (error instanceof AxiosError) {
          const status = error.response?.status
          if (status === 404 || status === 403) {
            console.error(error)
            setNotFound(true)
            return
          }
        }
        console.error(error)
        setUnknownError(true)
      })
  }, [id])

  const removeNote = (id: string) => {
    if (notes) setNotes(notes.filter(note => note.id !== id))
  }
  const addNote = (note: Note) => {
    if (notes) setNotes([...notes, note])
  }
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const handleAddNote = () => {
    if (!id) return
    setButtonDisabled(true)
    void sendNote(id)
      .then(addNote)
      .catch((error: unknown) => {
        console.error(error)
      })
      .finally(() => {
        setButtonDisabled(false)
      })
  }

  const navigate = useNavigate()
  const {t} = useTranslation()

  if (notFound || !id) return <NotFound />
  if (unknownError || !initData || !user) return <UnknownError />
  if (!contact || !notes) return <Loader />

  const maxNotesReached = notes.length >= maxNotes
  return (
    <div>
      <ContactInfo contact={contact} isOwner={isOwner} setContact={setContact} />

      <div style={{padding: '0px 40px 0px'}}>
        <Button
          mode="gray"
          size="s"
          stretched={true}
          onClick={() => {
            navigate(`/users/${contact.telegramId}`)
          }}
        >
          {t('all_public_notes')}
        </Button>
      </div>
      <div style={{padding: '10px 0px'}}></div>
      <NotesList
        removeNote={removeNote}
        notes={notes}
        isOwner={isOwner}
        publicPage={contact.public}
      />

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
