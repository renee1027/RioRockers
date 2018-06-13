/**
 * POST /
 * Occupy ramp
 */
const db = require('../models');
const moment = require('moment');

exports.occupyRamp = (req, res) => {
    return db.Ramp.findById(req.params.id).then(function (ramp) {
        if (ramp.occupiedSince == null) {
            return ramp.update({
                occupiedSince: moment(),
                timesBooked: ramp.timesBooked + 1
            }).then(function () {
                res.status(200);
            })
        } else {
            res.status(302);
        }
    }).catch(function (err) {
        console.log(err)
        res.status(500);
        throw new Error(err);
    }).finally(function() {
        res.send();
    });
};

exports.rampOccupied = (req, res) => {
    return db.Ramp.find({
        where: {
            id: req.params.id
        },
        include: [db.Location]
    }).then(function(ramp) {
        res.render('rampOccupied', {
            title: 'Ramp Occupied!',
            ramp,
            time: moment(ramp.occupiedSince).format('YYYY-MM-DD HH:mm')
        });
    }).catch(function (err) {
        console.log(err);
        throw new Error(err);
    })
}