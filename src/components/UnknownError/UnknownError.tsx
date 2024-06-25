import {Placeholder} from '@telegram-apps/telegram-ui'
import Lottie from 'lottie-react'
import {FC, useState} from 'react'
import {useTranslation} from 'react-i18next'

export const UnknownError: FC = () => {
  const {t} = useTranslation()
  const [animationData, setAnimationData] = useState<unknown>(null)
  void import('./unknown-error.json').then(setAnimationData)
  return (
    <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Placeholder description={t('unknown_error')}>
        <Lottie animationData={animationData} style={{width: 150}} />
      </Placeholder>
    </div>
  )
}
