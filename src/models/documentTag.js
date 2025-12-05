'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DocumentTag extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            DocumentTag.belongsTo(models.Document, { foreignKey: 'documentId' }),
                DocumentTag.belongsTo(models.Tag, { foreignKey: 'tagId' })
        }
    }
    DocumentTag.init({
        documentId: DataTypes.INTEGER,
        tagId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'DocumentTag',
    });
    return DocumentTag;
};