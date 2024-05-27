import React from 'react'
import { io } from 'socket.io-client'

import useDataStream from './useDataStream.js'
import * as TOTKData from './TOTKData.js'

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:12321'

export const repeaterSocket = io(URL)

let dataMap = {}
export function useRepeaterSocket () {
  const [socketConnected, setSocketConnected] = React.useState(false)
  const [status, setStatus] = React.useState(null)

  // Start data stream for each data object (does not change at runtime)
  for (const property in TOTKData) {
    if (TOTKData[property].nickname) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      dataMap[TOTKData[property].nickname] = useDataStream(
        TOTKData[property],
        repeaterSocket,
        TOTKData[property].dataCount > 1 ? [] : 0
      )
    }
  }

  React.useEffect(() => {
    repeaterSocket.on('connect', () => {
      console.log('Connected to the server')
      setSocketConnected(true)
    })

    repeaterSocket.on('cricketData', (peekData) => {
      const dataObj = JSON.parse(peekData)
      switch (dataObj.messageType) {
        case 'status':
          setStatus(dataObj)
          break

        case 'data':
          if (dataMap[dataObj.nickname]) {
            dataMap[dataObj.nickname].setValue(dataObj.data)
          } else {
            console.error('Unknown data message nickname:', dataObj.nickname)
          }
          break

        default:
          console.error('Unknown message type:', dataObj.messageType)
          break
      }
    })

    return () => {
      Object.values(dataMap).forEach((data) => {
        data.stopStream()
      })
      dataMap = {}
    }
  }, [])

  const output = {
    socketConnected,
    status
  }

  for (const property in TOTKData) {
    output[TOTKData[property].nickname] =
      dataMap[TOTKData[property].nickname]?.value
  }

  return output
}

export function onConnect (setStatus) {
  console.log('Connected to the server')
  setStatus(true)
}
