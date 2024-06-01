import {Button} from '@telegram-apps/telegram-ui'
import {FC} from 'react'
import {useTranslation} from 'react-i18next'

export const AddNoteButton: FC<{disabled: boolean; onClick: () => void}> = ({
  disabled,
  onClick,
}) => {
  const {t} = useTranslation()
  return (
    <div style={{padding: 20}}>
      <Button mode="filled" size="s" stretched={true} disabled={disabled} onClick={onClick}>
        {t('add_note')}
      </Button>
    </div>
  )
}
