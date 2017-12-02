module.exports = (Sequelize, DataTypes) => {
    const Model = Sequelize.define('AppDiff', {
        os:{
            type: DataTypes.STRING(255),
        },
        jsPath: {
            type: DataTypes.STRING(255),
        }
    }, {
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
        tableName: 'plus_app_jsbundle_diff'
    })

    Model.associate = (models) => {
        Model.belongsTo(models.AppJsBundle, {
            as: 'NewJsBundle'
        })
        Model.belongsTo(models.AppJsBundle, {
            as: 'OldJsBundle'
        })
    }

    return Model
}