import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sequelize } from './models/index.js';
import authRoutes from './routes/auth.js'


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true, credentials: true }))


const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoutes);


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
