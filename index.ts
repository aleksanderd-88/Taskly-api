import  express, { Application } from 'express'
import cors from 'cors'
import routes from './src/router'

const app: Application = express()
const port = process.env.PORT || 1234

app.use(express.json())
app.use(cors({ origin: ['http://localhost:5173', 'https://taskly-dev.vercel.app'] }))
app.use('/', routes)

app.listen(port, () => console.log(`API started and listening to port ${port}`))

export default app