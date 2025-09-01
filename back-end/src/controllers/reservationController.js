import * as reservationService from '../services/reservationService.js'

export async function list(req, res) {
  const { page, pageSize, jour, service } = req.query
  const data = await reservationService.listReservations({
    page: page ? Number(page) : 1,
    pageSize: pageSize ? Number(pageSize) : 50,
    jour, service
  })
  res.json(data)
}

export async function create(req, res) {
  try {
    const userId = req.user?.id ?? null // visiteur: null ; employé/admin: id
    const r = await reservationService.createReservation(req.body, userId)
    res.status(201).json(r)
  } catch (e) {
    if (e.message === 'RES_MISSING') return res.status(400).json({ error: 'champs requis manquants' })
    if (e.message === 'RES_BADSERVICE') return res.status(400).json({ error: 'service invalide (midi/soir)' })
    if (e.message === 'RES_BADNB') return res.status(400).json({ error: 'nombre de personnes 1..40' })
    if (e.message === 'RES_JPLUSUN') return res.status(400).json({ error: 'réservation au minimum J+1' })
    if (e.message === 'RES_BADTIME') return res.status(400).json({ error: "l'heure ne correspond pas au service (midi: 12h-14h, soir: 19h-21h)" })
    if (e.message === 'RES_CAPACITY') return res.status(400).json({ error: 'capacité de 40 couverts par créneau atteinte' })
    return res.status(500).json({ error: 'erreur serveur' })
  }
}

export async function update(req, res) {
  try {
    const r = await reservationService.updateReservation(req.params.id, req.body)
    res.json(r)
  } catch (e) {
    if (e.message === 'RES_NOTFOUND') return res.status(404).json({ error: 'réservation introuvable' })
    if (e.message === 'RES_MISSING') return res.status(400).json({ error: 'champs requis manquants' })
    if (e.message === 'RES_BADSERVICE') return res.status(400).json({ error: 'service invalide (midi/soir)' })
    if (e.message === 'RES_BADNB') return res.status(400).json({ error: 'nombre de personnes 1..40' })
    if (e.message === 'RES_JPLUSUN') return res.status(400).json({ error: 'réservation au minimum J+1' })
    if (e.message === 'RES_BADTIME') return res.status(400).json({ error: "l'heure ne correspond pas au service (midi: 12h-14h, soir: 19h-21h)" })
    if (e.message === 'RES_CAPACITY') return res.status(400).json({ error: 'capacité de 40 couverts par créneau atteinte' })
    return res.status(500).json({ error: 'erreur serveur' })
  }
}

export async function remove(req, res) {
  try {
    await reservationService.deleteReservation(req.params.id)
    res.status(204).send('')
  } catch (e) {
    if (e.message === 'RES_NOTFOUND') return res.status(404).json({ error: 'réservation introuvable' })
    return res.status(500).json({ error: 'erreur serveur' })
  }
}
