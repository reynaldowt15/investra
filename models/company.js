'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    get formatCompany() {
      return `${this.name} - ${this.address.split(`,`)[1]}`
    }

    static associate(models) {
      // define association here
      Company.hasMany(models.PortofolioCompany)
      Company.belongsToMany(models.Portofolio, { through: models.PortofolioCompany })
    }
  }
  Company.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    sector: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Company',
  });
  return Company;
};