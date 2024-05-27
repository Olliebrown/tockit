import debug from 'debug'
import Dotenv from 'dotenv'
import udp from 'node:dgram'

// Load environment variables
Dotenv.config()

// Debug loggers
const logReceive = debug('cricket:udp:receive')
const logSend = debug('cricket:udp:send')

// Address and port of the switch
const CRICKET_SERVER_PORT = process.env.CRICKET_SERVER_PORT ?? 3000
const CRICKET_SERVER_ADDRESS =
  process.env.CRICKET_SERVER_ADDRESS ?? '192.168.0.1'

// Receive socket (receives from switch server)
const receiveSocket = udp.createSocket('udp4')

// Port for receiving messages from the switch (will be assigned after connection)
export let RECEIVE_PORT = 0

export function sendConfigMessage (message) {
  // Send socket (sends to switch server)
  const sendSocket = udp.createSocket('udp4')
  sendSocket.send(
    JSON.stringify(message),
    CRICKET_SERVER_PORT,
    CRICKET_SERVER_ADDRESS,
    (error) => {
      if (error) {
        logSend.error('Client send error:')
        logSend.error(error)
      } else {
        logSend(`Sent message: ${message.type}`)
      }
      sendSocket.close()
    }
  )
}

export function startReceiver (
  receiveCallback,
  errorCallback = null,
  closeCallback = null
) {
  // Emits when socket is ready and listening for datagram msgs
  receiveSocket.on('listening', () => {
    const address = receiveSocket.address()
    RECEIVE_PORT = address.port
    logReceive(`Receiving UDP socket is listening on port ${address.port}`)
  })

  // emits on new datagram msg
  receiveSocket.on('message', (msg, info) => {
    if (receiveCallback) {
      receiveCallback(msg, info)
    }
  })

  // Emits when any error occurs
  receiveSocket.on('error', (error) => {
    logReceive.error(error)
    receiveSocket.close()
    if (errorCallback) {
      errorCallback(error)
    }
  })

  // Emits after the socket is closed using socket.close();
  receiveSocket.on('close', () => {
    logReceive('Receive socket is closed')
    if (closeCallback) {
      closeCallback()
    }
  })

  // Bind the socket to a random local port (which begins listening)
  receiveSocket.bind()
}
