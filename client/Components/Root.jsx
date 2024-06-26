import React from 'react'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Container, Stack } from '@mui/material'
import Header from './Header.jsx'
import { useRepeaterSocket } from '../data/repeaterSocket.js'

import LightDarkSwitch from './DarkModeSwitch.jsx'
import TransformWidget from './TransformWidget.jsx'
import GameInfo from './GameInfo.jsx'
import StatsWidget from './StatsWidget.jsx'

export default function Root (props) {
  // Light vs. dark mode
  const [mode, setMode] = React.useState('light')
  const theme = React.useMemo(() => createTheme({ palette: { mode } }), [mode])

  // All the streamed data from cricket
  const socketData = useRepeaterSocket()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <LightDarkSwitch
          onChange={() => setMode(mode === 'light' ? 'dark' : 'light')}
          sx={{ position: 'fixed', right: 16, bottom: 16 }}
        />

        <Header
          title="Tockit Client"
          subTitle="A Tears of the Kingdom client for sys-cricket"
        />

        <Stack spacing={2}>
          <StatsWidget
            health={socketData?.currentHealth?.[0]}
            bonusHealth={socketData?.bonusHealth?.[0]}
            maxHealth={socketData?.maxHealth?.[0]}
            stamina={socketData?.currentStamina?.[0]}
            bonusStamina={socketData?.bonusStamina?.[0]}
            maxStamina={socketData?.maxStamina?.[0]}
          />
          <TransformWidget
            playerMatrix={socketData?.currentPlayerTransform}
            havokMatrix={socketData?.currentHavokMatrix}
          />
          {socketData?.status && <GameInfo statusData={socketData?.status} />}
        </Stack>
      </Container>
    </ThemeProvider>
  )
}
