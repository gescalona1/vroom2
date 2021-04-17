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
    const query = Classroom.find({name: name, owner: owner});
    promises.push(query);
  }
  const classrooms = [];
  Promise.all(promises).then((completed, err) => {
    if (completed) {
        for(const classes of completed) {
            console.log(classes);
            classrooms.push(...classes);
        }
    }  
    console.log("T");
    console.log(classrooms);
    for (const c of classrooms) {
      console.log(c.gravatar(160));
    }
    res.render('classroom/landing', {
      title: 'Classrooms',
      userClassrooms: classrooms
    });
  });
};
  
exports.create = (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  res.render('classroom/create', {
    title: 'Create Classroom'
  });
}

exports.postCreate = (req, res, next) => {
    const classroom = new Classroom({
        owner: req.user.email,
        name: req.body.name,
        description: req.body.description,
        startingDate: new Date().toDateString(),
        enforceMute: true,
        enforceVideo: true,
        incall: 0
    });

    Classroom.findOne({name: req.body.name, owner: req.user.email}, (err, existingClassroom) => {
        if (err) return next(err);
        console.log("wtf");
        console.log(existingClassroom);
        if (existingClassroom) {
            req.flash('errors', { msg: "There is already a classroom with that name that you own, choose a different name!"});
            return res.redirect('/classroom/create');
        }
        classroom.save((err) => {
            if (err) { return next(err); }
            User.findOne({email: req.user.email}, (err, user) => {
                if (err) { next(err); }
                console.log(user);
                user.profile.classrooms.push(`${req.user.email} ${req.body.name}`);
                user.save();
                res.redirect("/classroom");
            });
        });
    });    
}

exports.join = (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  Classroom.find({owner: { $ne: req.user.email}}, (err, classes) => {
    if (err) {
      req.flash("errors", "something went wrong.."); 
      return req.redirect("/classroom");  
    }
    res.render('classroom/join', {
      classrooms: classes
    });
  });
}

exports.postJoin = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/');
  }
  User.findOne({email: req.user.email}, (err, user) => {
    if (err) { next(err); }
    console.log(user);
    user.profile.classrooms.push(req.body.classroom);
    user.save();
    res.redirect("/classroom"); 
  });
}