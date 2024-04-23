const mongoose=require("mongoose")
mongoose.connect("mongodb://0.0.0.0:27017/collide")
.then(()=>{
    console.log("mongodb connected");
})
.catch(()=>{
    console.log('failed');
})


const newSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    salt:{
        type:String,
        required:true
    }
})

const collections = mongoose.model("collections",newSchema)

module.exports=collections
