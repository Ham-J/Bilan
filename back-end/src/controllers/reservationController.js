import * as reservationService from '../services/reservationService.js'

export async function create(req, res) {
  try {
    const r = await reservationService.createReservation(req.body, req.user?.id)
    res.status(201).json(r)
  } catch (e) {
    if (e.message === 'RES_MISSING')   return res.status(400).json({ error: 'champs obligatoires manquants' })
    if (e.message === 'RES_BADSERVICE')return res.status(400).json({ error: 'service invalide (midi|soir)' })
    if (e.message === 'RES_BADNB')     return res.status(400).json({ error: 'nb_personnes doit être entre 1 et 40' })
    if (e.message === 'RES_JPLUSUN')   return res.status(400).json({ error: 'réservation au moins J+1' })
    if (e.message === 'RES_QUOTA')     return res.status(400).json({ error: 'capacité 40 dépassée pour ce service/jour' })
    return res.status(500).json({ error: 'erreur serveur' })
  }
}

export async function list(req, res) {
  const { jour, service, page } = req.query
  const { rows, count, page: p } = await reservationService.listReservations({ jour, service, page })
  res.json({ data: rows, total: count, page: p })
}

export async function detail(req, res) {
  try {
    const r = await reservationService.getReservation(req.params.id)
    res.json(r)
  } catch (e) {
    if (e.message === 'RES_NOTFOUND') return res.status(404).json({ error: 'introuvable' })
    return res.status(500).json({ error: 'erreur serveur' })
  }
}

export async function update(req, res) {
  try {
    const r = await reservationService.updateReservation(req.params.id, req.body)
    res.json(r)
  } catch (e) {
    if (e.message === 'RES_NOTFOUND') return res.status(404).json({ error: 'introuvable' })
    if (e.message === 'RES_MISSING')   return res.status(400).json({ error: 'champs obligatoires manquants' })
    if (e.message === 'RES_BADSERVICE')return res.status(400).json({ error: 'service invalide (midi|soir)' })
    if (e.message === 'RES_BADNB')     return res.status(400).json({ error: 'nb_personnes doit être entre 1 et 40' })
    if (e.message === 'RES_JPLUSUN')   return res.status(400).json({ error: 'réservation au moins J+1' })
    if (e.message === 'RES_QUOTA')     return res.status(400).json({ error: 'capacité 40 dépassée pour ce service/jour' })
    return res.status(500).json({ error: 'erreur serveur' })
  }
}

export async function remove(req, res) {
  try {
    await reservationService.deleteReservation(req.params.id)
    res.status(204).send('')
  } catch (e) {
    if (e.message === 'RES_NOTFOUND') return res.status(404).json({ error: 'introuvable' })
    return res.status(500).json({ error: 'erreur serveur' })
  }
}
