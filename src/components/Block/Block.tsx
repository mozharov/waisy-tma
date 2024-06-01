import {useThemeParams} from '@tma.js/sdk-react'
import {PropsWithChildren, type FC} from 'react'

export const Block: FC<PropsWithChildren> = ({children}: PropsWithChildren) => {
  const themeParams = useThemeParams()
  return (
    <div style={{padding: 20}}>
      <div
        style={{
          backgroundColor: themeParams.secondaryBgColor,
          borderRadius: 20,
          padding: '0px 0px 10px 0px',
        }}
      >
        {children}
      </div>
    </div>
  )
}
