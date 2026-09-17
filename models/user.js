'use strict';
const bcrypt = require('bcryptjs')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserProfile, { foreignKey: 'UserId' })
      User.hasMany(models.Portofolio, { foreignKey: 'UserId' })

    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        notEmpty: {
          msg: 'Email is required'
        },
        isEmail: {
          msg: 'Please enter a valid email'
        }
      }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        notEmpty: {
          msg: 'Password is required'
        },

        len: {
          args: [8, 100],
          msg: 'Password must be at least 8 characters'
        }
      }
    },


    role: {
      type: DataTypes.STRING,
      allowNull: false
    },

    confirmPassword: {
      type: DataTypes.VIRTUAL,

      validate: {
        matchPassword(value) {

          if (value !== this.password) {
            throw new Error('Passwords do not match');
          }

        }
      }
    },

    agree: {
      type: DataTypes.VIRTUAL,

      validate: {
        mustAgree(value) {

          if (value !== true) {
            throw new Error(
              'Please agree to the Terms & Conditions and Privacy Policy'
            );
          }

        }
      }
    }

  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(async (h) => {
    h.password = await bcrypt.hash(h.password, 10)
  })

  return User;
};