import {Cell, Checkbox} from '@telegram-apps/telegram-ui'
import {FC} from 'react'
import {useTranslation} from 'react-i18next'

export const PublicPageCell: FC<{
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  checked: boolean
  disabled?: boolean
}> = ({onChange, checked, disabled}) => {
  const {t} = useTranslation()
  return (
    <div>
      <Cell
        after={<Checkbox disabled={disabled} onChange={onChange} checked={checked} />}
        style={{
          backgroundColor: 'unset',
          height: 32,
        }}
        interactiveAnimation="background"
        subtitle={t('public_page')}
      />
    </div>
  )
}
