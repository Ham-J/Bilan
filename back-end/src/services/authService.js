import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

export async function register({ email, password, role }) {
  if (!email || !password) throw new Error('AUTH_MISSING')
  if (role && !['admin', 'employe'].includes(role)) throw new Error('AUTH_BADROLE')

  const exists = await User.findOne({ where: { email } })
  if (exists) throw new Error('AUTH_EXISTS')

  const user = await User.create({ email, password, role: role || 'employe' })
  return { id: user.id, email: user.email, role: user.role }
}

export async function login({ email, password }) {
  if (!email || !password) throw new Error('AUTH_MISSING')
  const user = await User.findOne({ where: { email } })
  if (!user || !(await user.checkPassword(password))) throw new Error('AUTH_INVALID')

  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' })
  return {
    token,
    user: { id: user.id, email: user.email, role: user.role }
  }
}
