import {Textarea} from '@telegram-apps/telegram-ui'
import {useThemeParams} from '@tma.js/sdk-react'
import {useState, type FC} from 'react'

export const NoteBlock: FC = () => {
  const themeParams = useThemeParams()

  const [textareaValue, setTextareaValue] = useState('')
  const [textareaHeight, setTextareaHeight] = useState(24)
  const [scrollHeight, setScrollHeight] = useState(56)

  const handleTextareaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target
    setTextareaValue(value)

    if (event.target.scrollHeight !== scrollHeight) {
      setScrollHeight(event.target.scrollHeight)
      setTextareaHeight(textareaHeight + event.target.scrollHeight - scrollHeight)
    }
  }

  return (
    <Textarea
      value={textareaValue}
      onChange={handleTextareaChange}
      style={{
        height: textareaHeight,
        backgroundColor: themeParams.secondaryBgColor,
        minHeight: 24,
        overflow: 'hidden',
      }}
    />
  )
}
