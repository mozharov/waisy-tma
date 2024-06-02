import {Textarea, Checkbox, Cell, ButtonCell} from '@telegram-apps/telegram-ui'
import {initPopup, useThemeParams} from '@tma.js/sdk-react'
import axios from 'axios'
import {useCallback, useEffect, useState, type FC} from 'react'
import {Note} from './Note.types'
import {getHeaders} from '@/helpers'
import debounce from 'lodash/debounce'
import {useTranslation} from 'react-i18next'

const maxLength = 10000
const defaultTextareaHeight = 24
const defaltScrollHeight = 56
const popup = initPopup()

export const NoteBlock: FC<{note: Note; removeNote: (id: string) => void; isOwner: boolean}> = ({
  note,
  removeNote,
  isOwner,
}) => {
  const {t} = useTranslation()
  const themeParams = useThemeParams()
  const [textareaValue, setTextareaValue] = useState(note.text)
  const [textareaHeight, setTextareaHeight] = useState(defaultTextareaHeight)
  const [scrollHeight, setScrollHeight] = useState(defaltScrollHeight)

  useEffect(() => {
    const textareaElement = document.querySelector(`#textarea-${note.id}`)
    if (!textareaElement) return
    if (textareaElement.scrollHeight !== defaltScrollHeight) {
      setScrollHeight(textareaElement.scrollHeight)
      setTextareaHeight(defaultTextareaHeight + textareaElement.scrollHeight - defaltScrollHeight)
    }
  }, [note.id])

  const saveTextDebounced = useCallback(
    debounce((noteId: string, text: string) => {
      void saveText(noteId, text)
    }, 500),
    []
  )
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target
    if (value.length > maxLength) return
    setTextareaValue(value)
    saveTextDebounced(note.id, value)

    if (event.target.scrollHeight !== scrollHeight) {
      setScrollHeight(event.target.scrollHeight)
      setTextareaHeight(textareaHeight + event.target.scrollHeight - scrollHeight)
    }
  }

  const [publicDisabled, setPublicDisabled] = useState(false)
  const [isPublic, setIsPublic] = useState(note.public)
  const handlePublicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPublicDisabled(true)
    const value = event.target.checked
    setIsPublic(value)
    sendPublicValue(note.id, value)
      .catch(() => {
        setIsPublic(!value)
      })
      .finally(() => {
        setPublicDisabled(false)
      })
  }

  const handleDelete = () => {
    if (textareaValue.length && popup.supports('open')) {
      void popup
        .open({
          message: t('sure_delete'),
          buttons: [{text: t('delete'), type: 'destructive', id: 'delete'}, {type: 'cancel'}],
        })
        .then(buttonId => {
          if (buttonId === 'delete') {
            removeNote(note.id)
            void deleteNote(note.id)
          }
        })
      return
    }
    removeNote(note.id)
    void deleteNote(note.id)
  }

  return (
    <div
      style={{
        backgroundColor: themeParams.secondaryBgColor,
        borderRadius: 20,
        padding: 10,
      }}
    >
      {isOwner && (
        <div style={{paddingBottom: 10, display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <ButtonCell onClick={handleDelete} style={{height: 32}} mode="destructive">
              {t('delete')}
            </ButtonCell>
          </div>
          <div>
            <Cell
              after={
                <Checkbox
                  disabled={publicDisabled}
                  onChange={handlePublicChange}
                  checked={isPublic}
                />
              }
              style={{
                backgroundColor: 'unset',
                height: 32,
              }}
              interactiveAnimation="background"
              subtitle={t('public_note')}
            />
          </div>
        </div>
      )}
      <Textarea
        id={`textarea-${note.id}`}
        value={textareaValue}
        onChange={handleTextChange}
        disabled={!isOwner}
        style={{
          height: textareaHeight,
          backgroundColor: themeParams.bgColor,
          minHeight: 24,
          overflow: 'hidden',
        }}
      />
    </div>
  )
}

const apiOrigin = import.meta.env.VITE_API_ORIGIN
const headers = getHeaders()
async function sendPublicValue(noteId: string, value: boolean): Promise<void> {
  await axios.put(`${apiOrigin}/notes/${noteId}`, {public: value}, {headers})
}

async function deleteNote(noteId: string): Promise<void> {
  await axios.delete(`${apiOrigin}/notes/${noteId}`, {headers})
}

async function saveText(noteId: string, text: string): Promise<void> {
  await axios.put(`${apiOrigin}/notes/${noteId}`, {text}, {headers})
}
