const sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    const Ramp = sequelize.define('Ramp', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        rampNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        lat: {
            type: DataTypes.FLOAT(10, 6),
            allowNull: false
        },
        lng: {
            type: DataTypes.FLOAT(10, 6),
            allowNull: false
        },
        occupiedSince: {
            type: DataTypes.DATE,
            allowNull: true
        },
        timesBooked: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    });

    Ramp.associate = function(models) {
        Ramp.belongsTo(models.Location, {
            foreignKey: 'locationId'
        });
    }

    return Ramp;
}