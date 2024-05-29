import {useThemeParams} from '@tma.js/sdk-react'
import {PropsWithChildren, type FC} from 'react'

export const Block: FC<PropsWithChildren> = ({children}: PropsWithChildren) => {
  const themeParams = useThemeParams()
  return (
    <div style={{padding: 20}}>
      <div
        style={{backgroundColor: themeParams.secondaryBgColor, borderRadius: 20, padding: '0 20'}}
      >
        {children}
      </div>
    </div>
  )
}
