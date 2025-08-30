import { User } from '../models/index.js'

function assertRole(role) {
  if (!['admin', 'employe'].includes(role)) {
    const e = new Error('USER_BADROLE'); throw e
  }
}

export async function listUsers() {
  return User.findAll({ attributes: ['id', 'email', 'role'], order: [['id', 'ASC']] })
}

export async function getUser(id) {
  const u = await User.findByPk(id, { attributes: ['id','email','role'] })
  if (!u) { const e = new Error('USER_NOTFOUND'); throw e }
  return u
}

export async function createUser({ email, password, role = 'employe' }) {
  if (!email || !password) { const e = new Error('USER_MISSING'); throw e }
  assertRole(role)
  const exists = await User.findOne({ where: { email } })
  if (exists) { const e = new Error('USER_EXISTS'); throw e }
  const u = await User.create({ email, password, role })
  return { id: u.id, email: u.email, role: u.role }
}

export async function updateUser(id, { email, password, role }) {
  const u = await User.findByPk(id)
  if (!u) { const e = new Error('USER_NOTFOUND'); throw e }

  if (role !== undefined) assertRole(role)
  if (email !== undefined) u.email = email
  if (password !== undefined && password !== '') u.password = password // sera hashé par beforeUpdate
  if (role !== undefined) u.role = role

  await u.save()
  return { id: u.id, email: u.email, role: u.role }
}

export async function deleteUser(id) {
  const n = await User.destroy({ where: { id } })
  if (!n) { const e = new Error('USER_NOTFOUND'); throw e }
  return true
}
