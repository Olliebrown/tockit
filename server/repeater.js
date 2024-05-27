import Express from 'express'
import http from 'http'
import * as socketIO from 'socket.io'

import Dotenv from 'dotenv'
import debug from 'debug'
import {
  setupSocketServer,
  cricketConnect,
  cricketDisconnect,
  cricketRemoteLog
} from './socketEvents.js'

// Debug loggers
const log = debug('cricket:root')

// Load environment variables
Dotenv.config()
const LISTEN_PORT = Number(process.env.LISTEN_PORT) ?? 3000
const NXLINK_PORT = Number(process.env.NXLINK_PORT) ?? 42424

// Create an express HTTP server with socketIO enabled
const app = new Express()
const server = http.createServer(app)
const io = new socketIO.Server(server, { serveClient: false })

// Socket connection initialization
setupSocketServer(io)

// Express routes
app.use((req, res, next) => {
  log(`Request: ${req.method} ${req.url}`)
  next()
})

// Serve all files in the public folder
app.use(Express.static('public'))

// Start the server
server.listen(LISTEN_PORT, () => {
  log(`Cricket repeater running on localhost:${LISTEN_PORT}`)
  cricketConnect()
  cricketRemoteLog(NXLINK_PORT)
})

// Respond to SIGINT (Ctrl+C) to close the server
process.on('SIGINT', () => {
  log('Received SIGINT: Shutting down...')
  cricketDisconnect()
  server.close()
  process.exit()
})
