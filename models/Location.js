const sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    const Location = sequelize.define('Location', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: { type: DataTypes.STRING },
        address: { type: DataTypes.STRING }
    },
    {
        classMethods:{
            associate:function(models){
                Location.hasMany(models.Ramp);
            }
        }
    });

    return Location;
}