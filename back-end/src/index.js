import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { sequelize } from './models/index.js'

const app = express()
app.use(express.json())
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true, credentials: true }))


const PORT = process.env.PORT || 3000

async function start () {
  try {
    await sequelize.authenticate()
    console.log(' MySQL connecté')
    await sequelize.sync() 
    app.listen(PORT, () => console.log(`API sur http://localhost:${PORT}`))
  } catch (err) {
    console.error(' Échec de démarrage:', err.message)
    process.exit(1)
  }
}
start()
