'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Portofolio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static async fetchDataToEdit(id) {
      return await Portofolio.findByPk(id, { include: { model: sequelize.models.Company, attributes: { exclude: ['createdAt', 'updatedAt'] } }, attributes: { exclude: ['createdAt', 'updatedAt'] } })
    }

    static associate(models) {
      // define association here
      Portofolio.belongsTo(models.User, { foreignKey: 'UserId' })
      Portofolio.hasMany(models.PortofolioCompany)
      Portofolio.belongsToMany(models.Company, { through: models.PortofolioCompany })
    }
  }
  Portofolio.init({
    UserId: DataTypes.INTEGER,
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Value required!`
        },
        notEmpty: {
          msg: `Value required!`
        },
        min: {
          args: 50000,
          msg: `Value minimum 50.000`
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Portofolio',
  });
  return Portofolio;
};