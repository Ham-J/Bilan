import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

export function authRequired (req, res, next) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null
  if (!token) return res.status(401).json({ error: 'missing token' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.sub
    req.userRole = payload.role
    next()
  } catch {
    return res.status(401).json({ error: 'invalid token' })
  }
}

export async function currentUser (req, _res, next) {
  if (!req.userId) return next()
  req.user = await User.findByPk(req.userId)
  next()
}

export function requireRole (...roles) {
  return (req, res, next) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ error: 'forbidden' })
    }
    next()
  }
}
