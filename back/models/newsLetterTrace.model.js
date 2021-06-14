const mongoose = require('mongoose');

const newsLetterTraceSchema = new mongoose.Schema({
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
  createdAt:{
      type: Date,
      default: Date.now()
  }
});


const NewsLetterTrace = mongoose.model('NewsLetterTrace', newsLetterTraceSchema);

module.exports = NewsLetterTrace;
