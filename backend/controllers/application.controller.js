import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

//apply for job
export const applyJob = async (req, res) => {
  try {
    console.log("applyJob hit with userId:", req.id, "jobId:", req.params.id);
    const userId = req.id;
    const jobId = req.params.id;

    //check if jonId is entered
    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required",
        success: false,
      });
    }

    //check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    //check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    //create new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
      status: "pending",
    });

    //adding the new application to the job model, to keep track of the  applications for a particular job
    job.applications.push(newApplication._id); ////J or j
    await job.save();

    //printing success
    return res.status(201).json({
      message: "Job applied successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//list of applied jobs(user)
export const getAppliedJobs = async (req, res) => {
  try {
    //getting user id and checking Application db, populate used to get details of job and company
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });

    //error print (no applications)
    if (!application) {
      return res.status(400).json({
        message: "No applications",
        success: false,
      });
    }
    //success print
    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//get applicants for a job(Admin)
export const getApplicants = async (req, res) => {
  try {
    //get  job id from request and search job, from there applications using populate and applicant details using nested populate
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });

    //if no job exist error print
    if (!job) {
      return res.status(400).json({
        message: "Job not found",
        success: false,
      });
    }

    //success print
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//update application status(Admin)
export const updateStatus = async (req, res) => {
  try {
    //get new status from frontend (admin)
    const { status } = req.body;
    //get application id where change to be made
    const applicationId = req.params.id;
    //no new status given error
    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false,
      });
    }

    //get the application from db using given application id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(400).json({
        message: "Application not found",
        success: false,
      });
    }

    // Update the status field
    application.status = status;
    await application.save(); // Save the updated application

    //success print
    return res.status(200).json({
      message: "Status updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
