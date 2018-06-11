const sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    const Ramp = sequelize.define('Ramp', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        coordinates: {
            type: DataTypes.GEOMETRY('POINT'),
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
    },
    {
        classMethods:{
            associate:function(models){
                Location.belongsTo(models.Location);
            }
        }
    });

    return Ramp;
}