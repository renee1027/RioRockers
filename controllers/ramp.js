/**
 * POST /
 * Occupy ramp
 */
const db = require('../models');
const moment = require('moment');

exports.occupyRamp = (req, res) => {
    return db.Ramp.findById(req.params.id).then(function (ramp) {
        let waitingListNum = ramp.waitingList > 0 ? ramp.waitingList - 1 : 0;
        if (ramp.occupiedSince == null) {
            return ramp.update({
                occupiedSince: moment(),
                timesBooked: ramp.timesBooked + 1,
                waitingList: waitingListNum
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

exports.freeRamp = (req, res) => {
    return db.Ramp.findById(req.params.id).then(function(ramp) {
        let duration = moment.duration(moment().diff(ramp.occupiedSince)).asHours();
        let prevDuration = ramp.totalHoursBooked;
        if (ramp.occupiedSince) {
            return ramp.update({
                occupiedSince: null,
                totalHoursBooked: prevDuration + duration
            }).then(function() {
                res.status(200);
            });
        } else {
            res.status(302);
        }
    }).catch(function (err) {
        res.status(500)
        console.log(err);
        throw new Error(err);
    }).finally(function() {
        res.send();
    })
}

exports.addToWaitingList = (req, res) => {
    return db.Ramp.findById(req.params.id).then(function(ramp) {
        if (ramp.occupiedSince) {
            return ramp.update({
                waitingList: ramp.waitingList + 1
            }).then(function(ramp) {
                res.status(200).send({ count: ramp.waitingList});
            });
        } else {
            res.sendStatus(302);
        }
    }).catch(function (err) {
        console.log(err);
        res.sendStatus(500)
        throw new Error(err);
    });
}