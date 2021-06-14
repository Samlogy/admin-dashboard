const mongoose = require("mongoose")

mongoose.connect(process.env.LOCAL_DB_URL || process.env.ATLAS_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => {
    console.log('MongoDB ON')
})
.catch(err => {
    console.log(err.message)
});

mongoose.connection.on('error', (err) => {
    console.log(err.message)
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose OFF')
});
    
process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit(0)
});