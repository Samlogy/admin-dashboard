const { Schema, model }  = require("mongoose");

const notificationSchema = Schema({
  title: { 
    type: String 
  },
  content: {
    type: String
  },
  type: { 
    type: String 
  },
  status: { 
    type: String, 
    default: "unchecked" // unchecked - checked - hidden
  },
  createdAt: { 
    type: Date, 
    default: Date.now()
  },
  authorId: { 
    type: Schema.Types.ObjectId, 
  } 
})

const Notification = model("Notification", notificationSchema)

module.exports = Notification