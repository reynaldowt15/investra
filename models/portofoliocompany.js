'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PortofolioCompany extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PortofolioCompany.belongsTo(models.Portofolio)
      PortofolioCompany.belongsTo(models.Company)
    }
  }
  PortofolioCompany.init({
    PortofolioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Company required!`
        },
        notEmpty: {
          msg: `Company required!`
        }
      }
    },
    CompanyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: `Company required!`
        },
        notEmpty: {
          msg: `Company required!`
        }
      }
    },
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
    modelName: 'PortofolioCompany',
  });
  return PortofolioCompany;
};