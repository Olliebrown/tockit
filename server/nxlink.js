import { createServer } from 'net'
import debug from 'debug'
import Dotenv from 'dotenv'

const log = debug('cricket:nxlink')

// Load environment variables
Dotenv.config()

const NXLINK_PORT = Number(process.env.NXLINK_PORT) ?? 42424
let nxLinkServer = null

const decoder = new TextDecoder('utf-8')

export function startNXLinkServer () {
  nxLinkServer = createServer((socket) => {
    socket.on('connect', () => {
      log('== Connected ==')
    })

    socket.on('data', (data) => {
      const message = decoder.decode(data)
      log(message.trimEnd())
    })

    socket.on('end', () => {
      log('== Client disconnected ==')
    })

    socket.on('error', (err) => {
      log.error('== Socket Error: ==')
      log.error(err)
      log.error('===================')
    })

    socket.on('timeout', () => {
      log('== Socket timeout ==')
    })

    socket.on('close', () => {
      log('== Socket closed ==')
    })
  })

  nxLinkServer.listen(NXLINK_PORT, () => {
    log(`NXLink server is listening on port ${NXLINK_PORT}`)
  })
}
