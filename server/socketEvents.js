// eslint-disable-next-line no-unused-vars
import * as socketIO from 'socket.io'
import debug from 'debug'
import Dotenv from 'dotenv'

import { startReceiver, sendConfigMessage, RECEIVE_PORT } from './cricketUDP.js'
import { startNXLinkServer } from './nxlink.js'

// Debug loggers
const log = debug('cricket:socket')

// Load environment variables
Dotenv.config()
const NXLINK_PORT = Number(process.env.NXLINK_PORT) ?? 42424

// Last status message received
let lastStatus = new Date()
let lastConnect = new Date()

// Interval timer handles
let statusTimeout = null
let refreshTimeout = null
const RECONNECT_TIMEOUT = 10000

// List of all connected sockets and their active data streams
const connectedSockets = {}

/**
 * Set up the socket server and initialize the connection event.
 *
 * @param {socketIO.Server} io
 */
export function setupSocketServer (io) {
  log('Starting socket server')
  io.on('connection', (socket) => socketInit(socket))
  io.engine.on('connection_error', (err) => {
    log('Connection Error:', err.code)
    log(err.message)
  })

  // Echo cricket messages to the client
  startReceiver((msg, info) => {
    const type = JSON.parse(msg.toString())?.messageType
    if (type === 'status') {
      lastStatus = new Date()
      lastConnect = lastStatus
    }
    io.emit('cricketData', msg.toString())
  })

  // Send the heartbeat message at regular intervals
  if (refreshTimeout) {
    clearInterval(refreshTimeout)
  }
  refreshTimeout = setInterval(() => {
    sendConfigMessage({ messageType: 'refresh', port: RECEIVE_PORT })
  }, 5000)

  // Detect a disconnection (no status messages received in 10 seconds)
  if (statusTimeout) {
    clearInterval(statusTimeout)
  }
  statusTimeout = setInterval(() => {
    const now = new Date()
    if (now - lastConnect > RECONNECT_TIMEOUT) {
      log(
        `No status message received in ${RECONNECT_TIMEOUT / 1000} seconds. Reconnecting.`
      )
      cricketConnect()
      cricketRemoteLog(NXLINK_PORT)
      lastConnect = now
    }
  }, 1000)

  // Echo NXLink messages to the client
  startNXLinkServer()
}

/**
 * Initialize a new socket connection
 * @param {socketIO.Socket} socket The newly connected socket
 */
function socketInit (socket) {
  // Log the new connection
  log('Connect:', socket.id)
  if (!connectedSockets[socket.id]) {
    connectedSockets[socket.id] = []
  }

  // Initialize socket events
  socket.on('disconnect', () => disconnect(socket))
  socket.on('error', (err) => error(socket, err))

  // Custom events for cricket server
  socket.on('cricketStart', (data) => cricketStart(socket, data))
  socket.on('cricketStop', (data) => cricketStop(socket, data))
}

// Individual socket events
/**
 * Handle a socket disconnection
 * @param {socketIO.Socket} socket The socket that is disconnecting
 */
function disconnect (socket) {
  log('SocketIO Disconnect:', socket.id)

  // Stop any active streams
  connectedSockets[socket.id].forEach((streamData) => {
    cricketStop(socket, streamData)
  })

  // Remove the socket from the list
  delete connectedSockets[socket.id]
}

/**
 * Handle any socket errors
 * @param {socketIO.Socket} socket The socket that created the error
 * @param {Error} err The error that was emitted
 */
function error (socket, err) {
  log('SocketIO Error:', socket.id, err)
}

/**
 * Poke a value into memory
 * @param {socketIO.Socket} socket The socket that created the event
 * @param {Object} data Extra data you want to send to the server
 */
function cricketStart (socket, data) {
  log('Cricket start:', socket.id)
  log(data.nickname)

  // Store the stream data for later
  connectedSockets[socket.id].push(data)

  sendConfigMessage({
    messageType: 'start',
    port: RECEIVE_PORT,
    ...data
  })
}

/**
 * Stops a previously established request interval stream.
 * @param {socketIO.Socket} socket The socket that created the event
 * @param {Object} data Extra data you want to send to the server
 */
function cricketStop (socket, data) {
  log('Cricket stop:', socket.id)
  log(data.nickname)

  sendConfigMessage({
    messageType: 'stop',
    port: RECEIVE_PORT,
    ...data
  })
}

/**
 * Stops a previously established request interval stream.
 * @param {socketIO.Socket} socket The socket that created the event
 * @param {Object} data Extra data you want to send to the server
 */
export function cricketRemoteLog (logPort) {
  sendConfigMessage({
    messageType: 'remoteLog',
    port: logPort
  })
}

/**
 * Connect the UDP socket to the cricket server
 */
export function cricketConnect () {
  sendConfigMessage({ messageType: 'connect', port: RECEIVE_PORT })

  // Wait a bit then check status
  setTimeout(() => {
    if (new Date() - lastStatus < RECONNECT_TIMEOUT) {
      // Restore data streams
      Object.keys(connectedSockets).forEach((socketId) => {
        connectedSockets[socketId].forEach((streamData) => {
          cricketStart({ id: socketId }, streamData)
        })
      })
    }
  }, 1000)
}

/**
 * Disconnect the UDP socket from the cricket server
 */
export function cricketDisconnect () {
  sendConfigMessage({ messageType: 'disconnect', port: RECEIVE_PORT })
}
