'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Favour extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Favour.belongsTo(models.User, { foreignKey: "userId" }),
                Favour.belongsTo(models.Document, { foreignKey: "documentId" })
        }
    }
    Favour.init({

        userId: DataTypes.STRING,
        documentId: DataTypes.STRING,

    }, {
        sequelize,
        modelName: 'Favour',
    });
    return Favour;
};