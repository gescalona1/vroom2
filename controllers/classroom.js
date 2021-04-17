const Classroom = require('../models/Classroom');
/**
 * GET /
 * Home page.
 */
 exports.index = (req, res) => {
    res.render('home', {
      title: 'Home'
    });
  };
  