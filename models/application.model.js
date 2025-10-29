import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['pending', 'accepted', 'rejected'],
        default:'pending'
    },
    resume: {
        type: String, // Google Drive link or URL to resume
        required: true
    },
    resumeOriginalName: {
        type: String,
        required: false // Optional since we're using Google Drive links
    },
    coverLetter: {
        type: String
    },
    experience: {
        type: String
    },
    skills: [{
        type: String
    }],
    education: {
        type: String
    },
    phone: {
        type: String
    },
    linkedin: {
        type: String
    },
    portfolio: {
        type: String
    },
    expectedSalary: {
        type: Number
    },
    availabilityDate: {
        type: Date
    },
    additionalInfo: {
        type: String
    }
},{timestamps:true});
export const Application  = mongoose.model("Application", applicationSchema);