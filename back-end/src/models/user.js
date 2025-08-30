import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'

export default (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING(180), allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'employe'), allowNull: false, defaultValue: 'employe' }
  }, {
    tableName: 'users',
    hooks: {
      beforeCreate: async (u) => { u.password = await bcrypt.hash(u.password, 10) }
    }
  })

  User.prototype.checkPassword = function (plain) {
    return bcrypt.compare(plain, this.password)
  }

  return User
}
