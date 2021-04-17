const Classroom = require('../models/Classroom');
const User = require('../models/User');

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  const owner_class = req.user.profile.classrooms;
  console.log(owner_class);
  const promises = [];
  for (const oc of owner_class) {
    const split = oc.split(" ");
    const owner = split[0], name = split[1];
    const query = Classroom.find({name: name, owner: owner}, "description startingDate");
    promises.push(query);
  }
  const classrooms = [];
  Promise.all(promises).then(completed, err => {
    for(const classes of completed) {
      classrooms.extend(classes);
    }
    res.render('classroom/landing', {
      title: 'Classrooms',
      classrooms: classrooms
    });
  });
};
  
exports.create = (req, res) => {
  
}