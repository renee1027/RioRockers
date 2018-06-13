const sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    const Location = sequelize.define('Location', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        lat: {
            type: DataTypes.FLOAT(10, 6),
            allowNull: false
        },
        lng: {
            type: DataTypes.FLOAT(10, 6),
            allowNull: false
        },
        address: {
            type: DataTypes.STRING
        }
    });

    Location.associate = function(models) {
        Location.hasMany(models.Ramp, {
            foreignKey: 'locationId'
        });
    }

    return Location;
}