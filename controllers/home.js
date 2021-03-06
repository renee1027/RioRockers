/**
 * GET /
 * Home page.
 */
const db = require('../models');
exports.index = (req, res) => {
  db.Location.findAll({
    include: [db.Ramp]
  }).then(function(locations) {
    res.render('home', {
      title: 'TRUQR',
      locations,
      google_map_api_key: process.env.GOOGLE_MAP_API_KEY
    });
  }).catch(function(err) {
    throw new Error(err);
  });
};

exports.qrScanner = (req, res) => {
  res.render('qrScanner', {
      title: 'Scan QR Code Located on Ramp'
  });
};
