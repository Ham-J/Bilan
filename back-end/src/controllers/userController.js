import * as userService from '../services/userService.js'

export async function listUsers(_req, res) {
  const users = await userService.listUsers()
  res.json(users)
}

export async function getUser(req, res) {
  try {
    const u = await userService.getUser(req.params.id)
    res.json(u)
  } catch (e) {
    if (e.message === 'USER_NOTFOUND') return res.status(404).json({ error: 'utilisateur introuvable' })
    return res.status(500).json({ error: 'erreur serveur' })
  }
}

export async function createUser(req, res) {
  try {
    const u = await userService.createUser(req.body)
    res.status(201).json(u)
  } catch (e) {
    if (e.message === 'USER_MISSING') return res.status(400).json({ error: 'email et mot de passe requis' })
    if (e.message === 'USER_BADROLE') return res.status(400).json({ error: 'rôle invalide' })
    if (e.message === 'USER_EXISTS') return res.status(409).json({ error: 'email déjà utilisé' })
    return res.status(500).json({ error: 'erreur serveur' })
  }
}

export async function updateUser(req, res) {
  try {
    const u = await userService.updateUser(req.params.id, req.body)
    res.json(u)
  } catch (e) {
    if (e.message === 'USER_BADROLE') return res.status(400).json({ error: 'rôle invalide' })
    if (e.message === 'USER_NOTFOUND') return res.status(404).json({ error: 'utilisateur introuvable' })
    return res.status(500).json({ error: 'erreur serveur' })
  }
}

export async function deleteUser(req, res) {
  try {
    await userService.deleteUser(req.params.id)
    res.status(204).send('')
  } catch (e) {
    if (e.message === 'USER_NOTFOUND') return res.status(404).json({ error: 'utilisateur introuvable' })
    return res.status(500).json({ error: 'erreur serveur' })
  }
}
