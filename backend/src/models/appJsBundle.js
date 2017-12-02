module.exports = (Sequelize, DataTypes) => {
    const Model = Sequelize.define('AppJsBundle', {
        no: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: '标识'
        },
        iOS: {
            type: DataTypes.STRING(40),
            allowNull: false,
            defaultValue: '1.0.0',
            comment: '最低依赖苹果版本'
        },
        android: {
            type: DataTypes.STRING(40),
            allowNull: false,
            defaultValue: '1.0.0',
            comment: '最低依赖安卓版本'
        },
        jsVersion: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: 'eros build 自动生成的jsVersion'
        },
        timestamp: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        jsPath: {
            type: DataTypes.STRING(255),
            allowNull: false,
            comment: '包下载地址'
        }
    }, {
        timestamps: true,
        paranoid: true,
        freezeTableName: true,
        tableName: 'plus_app_jsbundle'
    })

    Model.associate = (models) => {
        Model.belongsTo(models.App)
    }

    return Model
}