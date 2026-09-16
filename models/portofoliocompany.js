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
      PortofolioCompany.belongsTo(models.Portofolio, {foreignKey: 'portofolioId'})
      PortofolioCompany.belongsTo(models.Company, {foreignKey: 'companyId'})
    }
  }
  PortofolioCompany.init({
    portofolioId: DataTypes.INTEGER,
    companyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PortofolioCompany',
  });
  return PortofolioCompany;
};