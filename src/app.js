import express from 'express'
import fileUpload from 'express-fileupload'
import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'

const app = express()

app.use(express.json())
app.use(fileUpload())

app.use(authRoutes)
app.use(userRoutes)

export default app