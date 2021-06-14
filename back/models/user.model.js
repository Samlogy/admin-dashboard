const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const createHttpError = require('http-errors');
const { roles } = require('../utils/roles');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: [roles.admin, roles.moderator, roles.user, roles.author],
    default: roles.user,
  },
  active: {
      type: Boolean,
      default: false
  }, 
  createdAt:{
      type: Date,
      default: Date.now()
  },
  editedAt:{
    type: Date
},
});

// userSchema.pre('save', async function (next) {
//   try {
//     if (this.isNew) {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(this.password, salt);
//       this.password = hashedPassword;
//       if (this.email === process.env.ADMIN_EMAIL.toLowerCase()) {
//         this.role = roles.admin;
//       }
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// userSchema.methods.isValidPassword = async function (password) {
//   try {
//     return await bcrypt.compare(password, this.password);
//   } catch (error) {
//     throw createHttpError.InternalServerError(error.message);
//   }
// };

const User = mongoose.model('user', userSchema);

module.exports = User;
