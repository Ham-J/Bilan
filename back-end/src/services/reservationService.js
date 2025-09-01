import { Op } from 'sequelize'
import { Reservation, sequelize } from '../models/index.js'

// ----- helpers -----
const inRange = (h, min, max) => h >= min && h < max

function validateServiceHour(heure, service) {
  const hhmm = (heure || '').slice(0, 5) // "HH:MM"
  if (service === 'midi') {
    if (!inRange(hhmm, '12:00', '14:00')) throw new Error('RES_BADTIME')
  } else if (service === 'soir') {
    if (!inRange(hhmm, '19:00', '21:00')) throw new Error('RES_BADTIME')
  } else {
    throw new Error('RES_BADSERVICE')
  }
}

function assertPayload(p) {
  const required = ['nom', 'prenom', 'email', 'jour', 'heure', 'nb_personnes', 'service']
  for (const k of required) if (!p[k] && p[k] !== 0) throw new Error('RES_MISSING')

  if (!['midi', 'soir'].includes(p.service)) throw new Error('RES_BADSERVICE')

  const nb = parseInt(p.nb_personnes, 10)
  if (Number.isNaN(nb) || nb < 1 || nb > 40) throw new Error('RES_BADNB')

  // J+1
  const today = new Date(); today.setHours(0,0,0,0)
  const d = new Date(p.jour); d.setHours(0,0,0,0)
  if (d <= today) throw new Error('RES_JPLUSUN')

  validateServiceHour(p.heure, p.service)
}

async function checkCapacity({ jour, service, nb_personnes, excludeId = null }) {
  const where = { jour, service }
  if (excludeId) where.id = { [Op.ne]: excludeId }

  const { sum } = await Reservation.findOne({
    where,
    attributes: [[sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('nb_personnes')), 0), 'sum']],
    raw: true
  })

  const total = Number(sum || 0) + Number(nb_personnes)
  if (total > 40) throw new Error('RES_CAPACITY')
}

// ----- API -----
export async function listReservations({ page = 1, pageSize = 50, jour, service }) {
  const where = {}
  if (jour) where.jour = jour
  if (service) where.service = service

  const offset = (page - 1) * pageSize
  const { rows, count } = await Reservation.findAndCountAll({
    where,
    order: [['jour', 'ASC'], ['heure', 'ASC']],
    offset,
    limit: pageSize
  })
  return { data: rows, total: count, page, pageSize }
}

export async function createReservation(payload, userId = null) {
  assertPayload(payload)
  await checkCapacity(payload)
  const res = await Reservation.create({ ...payload, userId })
  return res
}

export async function updateReservation(id, data) {
  const r = await Reservation.findByPk(id)
  if (!r) { const e = new Error('RES_NOTFOUND'); throw e }

  // merge champs modifiables
  const next = {
    nom: data.nom ?? r.nom,
    prenom: data.prenom ?? r.prenom,
    email: data.email ?? r.email,
    jour: data.jour ?? r.jour,
    heure: data.heure ?? r.heure,
    nb_personnes: data.nb_personnes ?? r.nb_personnes,
    service: data.service ?? r.service
  }

  assertPayload(next)
  await checkCapacity({ ...next, excludeId: r.id })

  Object.assign(r, next)
  await r.save()
  return r
}

export async function deleteReservation(id) {
  const n = await Reservation.destroy({ where: { id } })
  if (!n) { const e = new Error('RES_NOTFOUND'); throw e }
  return true
}
