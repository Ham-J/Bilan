import { Reservation } from '../models/index.js'
import { Op } from 'sequelize'

const isService = s => s === 'midi' || s === 'soir'
const iso = d => new Date(d).toISOString().slice(0, 10)

function assertPayload(p) {
  const required = ['nom', 'prenom', 'email', 'jour', 'heure', 'nb_personnes', 'service']
  for (const k of required) if (p[k] === undefined || p[k] === null || p[k] === '') throw new Error('RES_MISSING')
  if (!isService(p.service)) throw new Error('RES_BADSERVICE')

  const nb = parseInt(p.nb_personnes, 10)
  if (Number.isNaN(nb) || nb < 1 || nb > 40) throw new Error('RES_BADNB')

  // J+1
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const d = new Date(p.jour); d.setHours(0, 0, 0, 0)
  if (d <= today) throw new Error('RES_JPLUSUN')
}

async function assertQuota({ jour, service, nb_personnes, excludeId = null }) {
  const where = { jour: iso(jour), service }
  if (excludeId) where.id = { [Op.ne]: excludeId }
  const total = (await Reservation.sum('nb_personnes', { where })) || 0
  if (total + parseInt(nb_personnes, 10) > 40) {
    const err = new Error('RES_QUOTA')
    err.meta = { total }
    throw err
  }
}

export async function createReservation(payload, userId = null) {
  assertPayload(payload)
  await assertQuota(payload)

  return Reservation.create({
    nom: payload.nom,
    prenom: payload.prenom,
    email: payload.email,
    jour: iso(payload.jour),
    heure: payload.heure,
    nb_personnes: parseInt(payload.nb_personnes, 10),
    service: payload.service,
    userId: userId ?? null
  })
}

export async function listReservations({ jour, service, page = 1 }) {
  const where = {}
  if (jour) where.jour = iso(jour)
  if (service && isService(service)) where.service = service
  const limit = 20
  const offset = (parseInt(page, 10) - 1) * limit
  const { rows, count } = await Reservation.findAndCountAll({
    where, limit, offset, order: [['jour', 'ASC'], ['heure', 'ASC'], ['id', 'ASC']]
  })
  return { rows, count, page: parseInt(page, 10) }
}

export async function getReservation(id) {
  const r = await Reservation.findByPk(id)
  if (!r) throw new Error('RES_NOTFOUND')
  return r
}

export async function updateReservation(id, payload) {
  const r = await Reservation.findByPk(id)
  if (!r) throw new Error('RES_NOTFOUND')

  const to = {
    nom: payload.nom ?? r.nom,
    prenom: payload.prenom ?? r.prenom,
    email: payload.email ?? r.email,
    jour: iso(payload.jour ?? r.jour),
    heure: payload.heure ?? r.heure,
    nb_personnes: payload.nb_personnes !== undefined ? parseInt(payload.nb_personnes, 10) : r.nb_personnes,
    service: payload.service ?? r.service
  }


  assertPayload(to)
  await assertQuota({ ...to, excludeId: r.id })

  await r.update(to)
  return r
}

export async function deleteReservation(id) {
  const n = await Reservation.destroy({ where: { id } })
  if (!n) throw new Error('RES_NOTFOUND')
  return true
}
