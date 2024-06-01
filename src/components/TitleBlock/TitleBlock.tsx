import {Headline, Placeholder} from '@telegram-apps/telegram-ui'
import {FC} from 'react'

export const TitleBlock: FC<{showTitle: boolean; isOwner: boolean}> = ({showTitle, isOwner}) => {
  if (showTitle) {
    return (
      <div style={{padding: '0px 40px'}}>
        <Headline>Notes</Headline>
      </div>
    )
  }
  const description = isOwner
    ? "You don't have any notes"
    : 'There are no public notes about this user'
  return (
    <div>
      <Placeholder description={description} />
    </div>
  )
}
