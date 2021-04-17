const mongoose = require('mongoose');
const crypto = require('crypto');

const classroomSchema = new mongoose.Schema({
    owner:  { type: String, unique: true }, //email
    enforceMute: Boolean,
    enforceVideo: Boolean,
  }, { timestamps: true });


/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.owner).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};
const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;