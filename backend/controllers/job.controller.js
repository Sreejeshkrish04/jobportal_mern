import { Job } from "../models/job.model.js";

//admin
//posting a job
export const postJob = async (req, res) => {
  try {
    //getting data from request
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experienceLevel,
      position,
      company,
    } = req.body;

    // checking recvd data

    // Validate all fields exist
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experienceLevel ||
      !position ||
      !company
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        missing: {
          title: !title,
          description: !description,
          requirements: !requirements,
          salary: !salary,
          location: !location,
          jobType: !jobType,
          experienceLevel: !experienceLevel, // Changed
          position: !position,
          company: !company, // Changed
        },
      });
    }

    // if (
    //   !title ||
    //   !description ||
    //   !requirements ||
    //   !salary ||
    //   !location ||
    //   !jobType ||
    //   !experience ||
    //   !position ||
    //   !companyId
    // ) {
    //   return res.status(400).json({
    //     message: "Something is missing",
    //     success: false,
    //   });
    // }

    //creating db entry
    // Create job with properly mapped fields
    const job = await Job.create({
      title,
      description,
      requirements: Array.isArray(requirements) ? requirements : [requirements],
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: Number(experienceLevel), // Map to schema field name
      position: Number(position),
      company, // Map to schema field name
      created_by: req.id, // From auth middleware
    });
    // const job = await Job.create({
    //   title,
    //   description,
    //   requirements: requirements, //.split(","),
    //   salary: Number(salary),
    //   location,
    //   experienceLevel: experience,
    //   position,
    //   company: companyId,
    //   created_by: req.id,
    // });

    //printing success
    return res.status(201).json({
      message: "New job created successfully.",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//student
// searching Jobs
export const getAllJobs = async (req, res) => {
  try {
    /////will  discuss later (filtering jobs)
    const keyword = req.query.keyword || ""; //eg:filtering by job title

    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } }, //i for capital sensitivity, regex
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({ createdAt: -1 });
    /////will  discuss later (filtering jobs)

    if (!jobs) {
      return res.status(400).json({
        message: "Jobs not found",
        success: false,
      });
    }

    //printing success
    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//student
//search job by id
export const getJobById = async (req, res) => {
  try {
    //getting id from request
    const jobId = req.params.id;

    //searching db based on the id got from frontend
    const job = await Job.findById(jobId).populate({
      path: "applications",
    });
    if (!job) {
      return res.status(400).json({
        message: "Job not found",
        success: false,
      });
    }

    //return success
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
  }
};

//admin
//searching created jobs
export const getAdminJobs = async (req, res) => {
  try {
    //getting id from request
    const adminId = req.id;

    //searching db
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
    });

    //failure print
    if (!jobs) {
      return res.status(400).json({
        message: "Job not found",
        success: false,
      });
    }

    //success print
    return res.status(200).json({ jobs, success: true });
  } catch (error) {
    console.log(error);
  }
};
