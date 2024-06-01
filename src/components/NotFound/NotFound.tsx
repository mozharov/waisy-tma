import {Placeholder} from '@telegram-apps/telegram-ui'
import Lottie from 'lottie-react'
import {FC} from 'react'
import notFoundLottie from './not-found.json'

export const NotFound: FC = () => {
  return (
    <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Placeholder description="Contact not found">
        <Lottie animationData={notFoundLottie} style={{width: 150}} />
      </Placeholder>
    </div>
  )
}
