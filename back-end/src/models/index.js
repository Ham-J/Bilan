import { Sequelize } from 'sequelize'
import 'dotenv/config'
import UserModel from './user.js'
import ReservationModel from './reservation.js'

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  { host: process.env.DB_HOST, port: process.env.DB_PORT, dialect: 'mysql', logging: false }
)

export const User = UserModel(sequelize)
export const Reservation = ReservationModel(sequelize)

User.hasMany(Reservation, { foreignKey: 'userId' })
Reservation.belongsTo(User, { as: 'user', foreignKey: 'userId' })
