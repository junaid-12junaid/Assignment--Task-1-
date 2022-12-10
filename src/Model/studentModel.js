const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId;

const studentSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    studentName : { type:String, required:true, trim:true },
    subject : { 
        type:String, 
        required:true,
        enum:["Maths","SocialScience","English","Art","Science"],
         trim:true 
        },
    marks : { type:Number, required:true, trim:true },
    isDeleted:{
        type:Boolean,
        default:false
    }

},{timestamps:true})


module.exports = mongoose.model("student", studentSchema)