const mongoose = require('mongoose')
const colors = require('colors')
const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology: true,
        })
        const msg = "COnnected to:" + conn.connection.host
        console.log(msg.cyan.underline)
    }catch(error){
        console.log(error)
    }
}

module.exports = connectDB;