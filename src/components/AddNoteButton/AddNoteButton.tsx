import {Button} from '@telegram-apps/telegram-ui'
import {FC} from 'react'

export const AddNoteButton: FC<{disabled: boolean; onClick: () => void}> = ({
  disabled,
  onClick,
}) => {
  return (
    <div style={{padding: 20}}>
      <Button mode="filled" size="s" stretched={true} disabled={disabled} onClick={onClick}>
        Add a note
      </Button>
    </div>
  )
}
