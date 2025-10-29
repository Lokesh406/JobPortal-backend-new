import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salaryMin, salaryMax, location, jobType, experience, position, companyId, industryCategory } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salaryMin || !salaryMax || !location || !jobType || !experience || !position || !companyId || !industryCategory) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            })
        };

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salaryRange: {
                min: Number(salaryMin),
                max: Number(salaryMax)
            },
            location,
            jobType,
            experienceLevel: experience,
            position,
            industryCategory,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log("Error creating job:", error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false
        });
    }
}
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const location = req.query.location || "";
        const industry = req.query.industry || "";
        const salaryMin = req.query.salaryMin ? Number(req.query.salaryMin) : 0;
        const salaryMax = req.query.salaryMax ? Number(req.query.salaryMax) : Number.MAX_VALUE;

        // Build query object
        let query = {};

        // Text search
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { requirements: { $regex: keyword, $options: "i" } },
                { industryCategory: { $regex: keyword, $options: "i" } }
            ];
        }

        // Location filter
        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        // Industry filter
        if (industry) {
            query.industryCategory = { $regex: industry, $options: "i" };
        }

        // Salary range filter - only apply if valid numbers
        if (!isNaN(salaryMin) && !isNaN(salaryMax) && salaryMin >= 0 && salaryMax > salaryMin) {
            query["salaryRange.min"] = { $lte: salaryMax };
            query["salaryRange.max"] = { $gte: salaryMin };
        }

        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };

        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
