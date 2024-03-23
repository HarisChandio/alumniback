const route = require("express").Router();
const Job = require("../db/models/job");
const User = require("../db/models/user");
const authenticate = require("../middlewares/authenticator");
const Volunteer = require("../db/models/volunteer");
//post job
route.post("/job/post", authenticate, async (req, res) => {
  try {
    const newJob = new Job({
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      salary: req.body.salary,
      description: req.body.description,
      companyLogo: req.body.companyLogo,
      createdBy: req.id,
    });
    const job = await newJob.save();
    const user = await User.findById(req.id);
    user.postedJobs.push(job._id);
    await user.save();
    return res.status(200).json(job);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

//get all jobs
route.get("/get/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "username");
    res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//get job by id
route.get("/job/get/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "createdBy",
      "username"
    );
    res.status(200).json(job);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// route.get("/job/bulk", async (req, res) => {
//   try {
//     const filter = req.query.filter;

//     // Constructing regex pattern for case-insensitive matching
//     // Query to find jobs matching any of the specified fields
//     const jobs = await Job.find({
//       $or: [
//         {
//           title: {
//             $regex: filter,
//             $options: "i",
//           },
//         },
//         {
//           description: {
//             $regex: filter,
//             $options: "i",
//           },
//         },
//         {
//           company: {
//             $regex: filter,
//             $options: "i",
//           },
//         },
//         {
//           location: {
//             $regex: filter,
//             $options: "i",
//           },
//         },
//       ],
//     });

//     res.status(200).json(jobs);
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

//apply for job with jobId, by user Id
route.post("/job/apply/:id", authenticate, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (job.applicants.includes(req.user._id)) {
      return res.status(400).json("You have already applied for this job");
    }
    job.applicants.push(req.user._id);
    await job.save();
    //now update the user's appliedjobs
    const user = await User.findById(req.user._id);
    user.appliedJobs.push(req.params.id);
    await user.save();
    res.status(200).json("Applied successfully");
  } catch (error) {
    return res.status(500).json(error);
  }
});

//get all jobs applied by user
route.get("/job/get/applied/jobs", authenticate, async (req, res) => {
  try {
    const jobs = await Job.find({ applicants: req.user._id }).populate(
      "createdBy",
      "username"
    );
    res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//get all applicants for a job
route.get("/job/get/applicants/:id", authenticate, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "applicants",
      "username"
    );
    res.status(200).json(job.applicants);
  } catch (error) {
    return res.status(500).json(error);
  }
});

route.post("/volunteer", async (req, res) => {
  try {
    const { name, email, phoneNumber, reason } = req.body;
    const volunteer = new Volunteer({
      name,
      email,
      phoneNumber,
      reason,
    });
    await volunteer.save();
    return res.status(200).json({
      msg: "Volunteered successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "server error",
    });
  }
});
module.exports = route;
