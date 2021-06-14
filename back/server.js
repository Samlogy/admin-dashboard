const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

// require('dotenv').config();
// const { roles } = require('./utils/constants');

// Initialization
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// setup CORS
const allowList = ['http://localhost:3000']

const corsControl = (req, cb) => {
  let corsoptions;
  if ( allowList.indexOf(req.header('origin')) !== -1 ) {
    corsoptions = { orgin: true }
  } else {
    corsoptions = { orgin: false }
  }
  cb(null, corsControl)
}
app.use(cors(corsControl));

// dev dependency
app.use(morgan('dev'));

// Making a connection to MongoDB
const MONGODB_URI = "mongodb://localhost:27017"
const DB_NAME = "panel_admin"
mongoose.connect(MONGODB_URI, {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
})
.then(() => {
  console.log('MongoDB ON');    
})
.catch((err) => console.log(err.message));

// add routes
const manageUserRoutes = require('./routes/manageUser.route')
const newsletterRoutes = require('./routes/newsletter.route')
const notificatonsRoutes = require("./routes/notifications.route")
const productsRoutes = require("./routes/products.route")

app.use('/admin/manageUser', manageUserRoutes)
app.use('/admin/newsletter', newsletterRoutes)
app.use("/admin/notifications", notificatonsRoutes)
app.use("/admin/products", productsRoutes)

  // Setting the PORT
const PORT = 5000
app.listen(PORT, () => console.log(`Server 🚀: ${PORT}`));