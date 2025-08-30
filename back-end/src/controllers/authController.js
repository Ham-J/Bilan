import * as authService from '../services/authService.js'

export async function register(req, res) {
  try {
    const u = await authService.register(req.body)
    res.status(201).json(u)
  } catch (e) {
    console.error('REGISTER_ERROR:', e);
    if (e.message === 'AUTH_MISSING') return res.status(400).json({ error: 'email et mot de passe requis' })
    if (e.message === 'AUTH_BADROLE') return res.status(400).json({ error: 'rôle invalide' })
    if (e.message === 'AUTH_EXISTS') return res.status(409).json({ error: 'email déjà utilisé' })
    return res.status(500).json({ error: 'erreur serveur' })
  }
}

export async function login(req, res) {
  try {
    const data = await authService.login(req.body)
    res.json(data)
  } catch (e) {
    if (e.message === 'AUTH_MISSING') return res.status(400).json({ error: 'email et mot de passe requis' })
    if (e.message === 'AUTH_INVALID') return res.status(401).json({ error: 'identifiants invalides' })
    return res.status(500).json({ error: 'erreur serveur' })
  }
}
