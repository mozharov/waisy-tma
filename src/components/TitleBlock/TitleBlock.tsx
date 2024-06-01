import {Headline, Placeholder} from '@telegram-apps/telegram-ui'
import {FC} from 'react'
import {useTranslation} from 'react-i18next'

export const TitleBlock: FC<{showTitle: boolean; isOwner: boolean}> = ({showTitle, isOwner}) => {
  const {t} = useTranslation()

  if (showTitle) {
    return (
      <div style={{padding: '0px 40px'}}>
        <Headline>{t('notes')}</Headline>
      </div>
    )
  }
  const description = isOwner ? t('empty_notes') : t('empty_public_notes')
  return (
    <div>
      <Placeholder description={description} />
    </div>
  )
}
