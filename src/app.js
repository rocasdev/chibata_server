import express from 'express'
import fileUpload from 'express-fileupload'
import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import eventRoutes from './routes/event.routes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
app.use(fileUpload())
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}))

app.use(authRoutes)
app.use(userRoutes)
app.use(dashboardRoutes)
app.use(eventRoutes)

export default app