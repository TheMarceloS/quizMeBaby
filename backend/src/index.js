import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import questionsRouter from './routes/questions.js'
import mediaRouter from './routes/media.js'
import { registerHandlers } from './socket/handlers.js'
import { getActiveSessions } from './socket/gameSession.js'
import { parseCorsOrigin } from './corsOrigin.js'

const app = express()
const httpServer = createServer(app)
const corsOrigin = parseCorsOrigin()

const io = new Server(httpServer, {
  cors: { origin: corsOrigin, methods: ['GET', 'POST'] },
})

app.use(cors({ origin: corsOrigin }))
app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok' }))
app.get('/api/session/active', (_req, res) => res.json({ sessions: getActiveSessions() }))
app.use('/api/questions', questionsRouter)
app.use('/api/media', mediaRouter)

io.on('connection', socket => {
  console.log(`[socket] connected: ${socket.id}`)
  registerHandlers(io, socket)
  socket.on('disconnect', () => console.log(`[socket] disconnected: ${socket.id}`))
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`)
})
