import {Textarea, Checkbox, Cell, ButtonCell} from '@telegram-apps/telegram-ui'
import {useThemeParams} from '@tma.js/sdk-react'
import {useEffect, useState, type FC} from 'react'

export interface Note {
  id: string
  text: string
  public: boolean
}

const maxLength = 10000

export const NoteBlock: FC<{note: Note}> = ({note}) => {
  const themeParams = useThemeParams()

  const [textareaValue, setTextareaValue] = useState(note.text)
  const [textareaHeight, setTextareaHeight] = useState(24)
  const [scrollHeight, setScrollHeight] = useState(56)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true)
    }, 0)
  })

  const handleTextareaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target
    if (value.length > maxLength) return
    setTextareaValue(value)

    if (event.target.scrollHeight !== scrollHeight) {
      setScrollHeight(event.target.scrollHeight)
      setTextareaHeight(textareaHeight + event.target.scrollHeight - scrollHeight)
    }
  }

  // TODO: удаление заметки
  // TODO: изменение текста заметки
  // TODO: возможность сделать заметку публичной
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
          <ButtonCell style={{height: 32}} mode="destructive">
            Delete
          </ButtonCell>
        </div>
        <div>
          <Cell
            after={<Checkbox checked={note.public} />}
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
