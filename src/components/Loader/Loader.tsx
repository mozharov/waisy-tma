import {Placeholder, Spinner} from '@telegram-apps/telegram-ui'
import {FC} from 'react'

export const Loader: FC = () => {
  return (
    <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Placeholder>
        <Spinner size="l" />
      </Placeholder>
    </div>
  )
}
