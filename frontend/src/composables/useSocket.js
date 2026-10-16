import { io } from 'socket.io-client'
import { getSocketUrl } from '../config/server.js'

let socket = null

export function useSocket() {
  if (!socket) {
    socket = io(getSocketUrl(), {
      autoConnect: true,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    })
  }
  return socket
}

/** Resolve when the socket is connected, or reject after timeoutMs. */
export function waitForSocket(timeoutMs = 5000) {
  const s = useSocket()
  if (s.connected) return Promise.resolve(s)

  return new Promise((resolve, reject) => {
    let settled = false
    const finish = (fn, value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      s.off('connect', onConnect)
      s.off('connect_error', onConnectError)
      fn(value)
    }
    const onConnect = () => finish(resolve, s)
    const onConnectError = () => {
      // keep waiting until timeout — reconnection may succeed
    }
    const timer = setTimeout(() => {
      finish(reject, new Error('socket_connect_timeout'))
    }, timeoutMs)

    s.on('connect', onConnect)
    s.on('connect_error', onConnectError)
    if (!s.active) s.connect()
  })
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
