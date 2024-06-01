import {Cell, Checkbox} from '@telegram-apps/telegram-ui'
import {FC} from 'react'

export const PublicPageCell: FC<{
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  checked: boolean
  disabled?: boolean
}> = ({onChange, checked, disabled}) => {
  return (
    <div>
      <Cell
        after={<Checkbox disabled={disabled} onChange={onChange} checked={checked} />}
        style={{
          backgroundColor: 'unset',
          height: 32,
        }}
        interactiveAnimation="background"
        subtitle="Public page"
      />
    </div>
  )
}
