const mongoose = require('mongoose')
const Mongo_URI = "mongodb://localhost:27017"

const dbConnect = ()=>{
    mongoose.connect(Mongo_URI)
    .then(()=>console.log("mongoBD connect succesfully")
    // .catch((err)=>console.log("mongoDB connection error",err)
    )
    
}
module.exports = dbConnect