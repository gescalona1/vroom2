const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
    owner:  { type: String, unique: true }, //email
    enforceMute: Boolean,
    enforceVideo: Boolean,
  }, { timestamps: true });

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;