import React from 'react'
import PropTypes from 'prop-types'

import { Box } from '@mui/material'
import { LazyLog, ScrollFollow } from 'react-lazylog'

const decoder = new TextDecoder('utf-8')

export default function SwitchLog ({ socket }) {
  const [logData, setLogData] = React.useState(['Sys-Cricket Log\n'])

  React.useEffect(() => {
    socket.on('nxLinkData', (message) => {
      if (message instanceof ArrayBuffer) {
        setLogData([...logData, decoder.decode(message)])
      }
    })

    socket.on('nxLinkError', (message) => {
      if (message instanceof ArrayBuffer) {
        setLogData([...logData, decoder.decode(message)])
      }
    })
  })

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <ScrollFollow
        startFollowing
        render={({ onScroll, follow }) => (
          <LazyLog
            extraLines={1}
            enableSearch
            onScroll={onScroll}
            follow={follow}
            text={logData.join('')}
          />
        )}
      />
    </Box>
  )
}

SwitchLog.propTypes = {
  socket: PropTypes.object.isRequired
}
