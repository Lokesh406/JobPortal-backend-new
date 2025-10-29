import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };

        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }

        // Check if resume link is provided
        const { resumeLink } = req.body;
        if (!resumeLink) {
            return res.status(400).json({
                message: "Resume link is required to apply for this job.",
                success: false
            });
        }

        // create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            resume: resumeLink,
            status: 'pending',
            coverLetter: req.body.coverLetter || '',
            experience: req.body.experience || '',
            skills: req.body.skills ? req.body.skills.split(',') : [],
            education: req.body.education || '',
            phone: req.body.phone || '',
            linkedin: req.body.linkedin || '',
            portfolio: req.body.portfolio || '',
            expectedSalary: req.body.expectedSalary ? Number(req.body.expectedSalary) : null,
            availabilityDate: req.body.availabilityDate || null,
            additionalInfo: req.body.additionalInfo || ''
        });

        job.applications.push(newApplication._id);
        await job.save();

        return res.status(201).json({
            message: "Job applied successfully.",
            application: newApplication,
            success: true
        })
    } catch (error) {
        console.error('Apply job error:', error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false
        });
    }
};
export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;

        if (!status || !['accepted', 'rejected', 'pending'].includes(status.toLowerCase())) {
            return res.status(400).json({
                message: 'Invalid status. Status must be pending, accepted, or rejected',
                success: false
            });
        }

        // find the application by application id
        const application = await Application.findOne({_id: applicationId});
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Status updated successfully.",
            application,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}