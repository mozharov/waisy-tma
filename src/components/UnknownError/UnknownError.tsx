import {Placeholder} from '@telegram-apps/telegram-ui'
import Lottie from 'lottie-react'
import {FC} from 'react'
import unknownErrorLottie from './unknown-error.json'

export const UnknownError: FC = () => {
  return (
    <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Placeholder description="Something went wrong">
        <Lottie animationData={unknownErrorLottie} style={{width: 150}} />
      </Placeholder>
    </div>
  )
}
