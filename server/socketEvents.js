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

// Interval timer handles
let statusTimeout = null
let refreshTimeout = null

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
    }
    io.emit('cricketData', msg.toString())
  })

  // Send the heartbeat message at regular intervals
  if (refreshTimeout) {
    clearInterval(refreshTimeout)
  }
  refreshTimeout = setInterval(() => {
    sendConfigMessage({ type: 'refresh', port: RECEIVE_PORT })
  }, 5000)

  if (statusTimeout) {
    clearInterval(statusTimeout)
  }
  statusTimeout = setInterval(() => {
    const now = new Date()
    if (now - lastStatus > 10000) {
      log('No status message received in 10 seconds.  Reconnecting.')
      cricketConnect()
      cricketRemoteLog(NXLINK_PORT)
      lastStatus = now
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
  log(data)
  sendConfigMessage({
    type: 'start',
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
  log(data)
  sendConfigMessage({
    type: 'stop',
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
    type: 'remoteLog',
    port: logPort
  })
}

/**
 * Connect the UDP socket to the cricket server
 */
export function cricketConnect () {
  sendConfigMessage({ type: 'connect', port: RECEIVE_PORT })
}

/**
 * Disconnect the UDP socket from the cricket server
 */
export function cricketDisconnect () {
  sendConfigMessage({ type: 'disconnect', port: RECEIVE_PORT })
}
