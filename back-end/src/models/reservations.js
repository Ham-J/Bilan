import { DataTypes } from 'sequelize'

export default (sequelize) => {
  const Reservation = sequelize.define('Reservation', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: { type: DataTypes.STRING(120), allowNull: false },
    prenom: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(180), allowNull: false, validate: { isEmail: true } },
    jour: { type: DataTypes.DATEONLY, allowNull: false },
    heure: { type: DataTypes.TIME, allowNull: false },
    nb_personnes: { type: DataTypes.TINYINT, allowNull: false, validate: { min: 1, max: 40 } },
    service: { type: DataTypes.ENUM('midi','soir'), allowNull: false }
  }, { tableName: 'reservations' })

  return Reservation
}
