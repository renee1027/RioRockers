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