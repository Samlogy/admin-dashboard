const mongoose = require('mongoose');

const ContactsSchema = new mongoose.Schema({
  email: {
    type: [String],
  },
  subject: {
    type: String
  },
  message: {
    type: String
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
  }, 
  responseTo: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt:{
      type: Date,
      default: Date.now()
  }
});


const Contacts = mongoose.model('Contacts', ContactsSchema);

module.exports = Contacts;
