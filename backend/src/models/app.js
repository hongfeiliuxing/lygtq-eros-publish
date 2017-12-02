module.exports = (Sequelize, DataTypes) => {
    const Model = Sequelize.define('App', {
        name:{
            type: DataTypes.STRING(255),
            allowNull: false
        },
        appName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
    }, {
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
        tableName: 'plus_app'
    })

    Model.associate = (models) => {
        Model.hasMany(models.AppJsBundle)
    }

    return Model
}