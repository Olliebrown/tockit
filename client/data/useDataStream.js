import React from 'react'

const activeStreams = {}

export default function useDataStream (dataObj, socket, defaultValue = null) {
  const [value, setValue] = React.useState(defaultValue)

  if (!activeStreams[dataObj.nickname]) {
    socket.emit('cricketStart', dataObj)
    activeStreams[dataObj.nickname] = true
  }

  const stopStream = () => {
    socket.emit('cricketStop', dataObj)
    delete activeStreams[dataObj.nickname]
  }

  return { value, setValue, stopStream }
}
