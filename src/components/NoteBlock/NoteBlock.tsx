import {Textarea, Checkbox, Cell, ButtonCell} from '@telegram-apps/telegram-ui'
import {retrieveLaunchParams, useThemeParams} from '@tma.js/sdk-react'
import axios from 'axios'
import {useEffect, useMemo, useState, type FC} from 'react'

export interface Note {
  id: string
  text: string
  public: boolean
}

const origin = import.meta.env.VITE_API_ORIGIN
const maxLength = 10000

export const NoteBlock: FC<{note: Note; removeNote: (id: string) => void}> = ({
  note,
  removeNote,
}) => {
  const themeParams = useThemeParams()
  const {initDataRaw} = retrieveLaunchParams()
  const headers = useMemo(() => ({Authorization: `tma ${initDataRaw}`}), [initDataRaw])

  const [textareaValue, setTextareaValue] = useState(note.text)
  const [textareaHeight, setTextareaHeight] = useState(24)
  const [scrollHeight, setScrollHeight] = useState(56)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const textareaElement = document.querySelector(`#textarea-${note.id}`)
    if (!textareaElement) return

    if (textareaElement.scrollHeight !== scrollHeight) {
      setScrollHeight(textareaElement.scrollHeight)
      setTextareaHeight(textareaHeight + textareaElement.scrollHeight - scrollHeight)
    }
    setTimeout(() => {
      setIsLoaded(true)
    }, 0)
  }, [note.id, scrollHeight, textareaHeight])

  const saveNoteText = async (text: string) => {
    try {
      await axios.put(`${origin}/notes/${note.id}`, {text}, {headers})
    } catch (error) {
      console.error(error)
    }
  }

  const handleTextareaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target
    if (value.length > maxLength) return
    setTextareaValue(value)
    note.text = value
    // TODO: debounce
    void saveNoteText(value)

    if (event.target.scrollHeight !== scrollHeight) {
      setScrollHeight(event.target.scrollHeight)
      setTextareaHeight(textareaHeight + event.target.scrollHeight - scrollHeight)
    }
  }

  const [publicDisabled, setPublicDisabled] = useState(false)
  const savePublic = async (isPublic: boolean) => {
    try {
      await axios.put(`${origin}/notes/${note.id}`, {public: isPublic}, {headers})
    } catch (error) {
      console.error(error)
      note.public = !note.public
      setIsPublic(note.public)
    }
    setPublicDisabled(false)
  }

  const [isPublic, setIsPublic] = useState(note.public)

  const handlePublicChange = () => {
    setPublicDisabled(true)
    note.public = !note.public
    setIsPublic(note.public)
    void savePublic(note.public)
  }

  const [buttonDisabled, setButtonDisabled] = useState(false)
  const handleDelete = () => {
    setButtonDisabled(true)
    removeNote(note.id)
    axios.delete(`${origin}/notes/${note.id}`, {headers}).catch((error: unknown) => {
      console.error(error)
      setButtonDisabled(false)
    })
  }

  return (
    <div
      style={{
        backgroundColor: themeParams.secondaryBgColor,
        borderRadius: 20,
        padding: 10,
      }}
      className={isLoaded ? 'fade-in loaded' : 'fade-in'}
    >
      <div style={{paddingBottom: 10, display: 'flex', justifyContent: 'space-between'}}>
        <div>
          <ButtonCell
            onClick={handleDelete}
            disabled={buttonDisabled}
            style={{height: 32}}
            mode="destructive"
          >
            Delete
          </ButtonCell>
        </div>
        <div>
          <Cell
            after={
              <Checkbox disabled={publicDisabled} onClick={handlePublicChange} checked={isPublic} />
            }
            style={{
              backgroundColor: 'unset',
              height: 32,
            }}
            interactiveAnimation="background"
            subtitle="Public"
          />
        </div>
      </div>
      <Textarea
        id={`textarea-${note.id}`}
        value={textareaValue}
        onChange={handleTextareaChange}
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
