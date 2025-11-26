'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Document extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Document.belongsTo(models.User, { foreignKey: 'userId' }),
                Document.hasMany(models.Favour, { foreignKey: "documentId" })
        }
    }
    Document.init({
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        fileName: DataTypes.STRING,
        filePath: DataTypes.STRING,
        fileType: DataTypes.STRING,
        facultyId: DataTypes.STRING,
        majorId: DataTypes.STRING,
        userId: DataTypes.INTEGER,
        status: DataTypes.STRING,
        download: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Document',
    });
    return Document;
};