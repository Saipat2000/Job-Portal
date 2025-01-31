import jobsModels from "../models/jobsModels.js";
import mongoose from "mongoose";
import moment from 'moment';
// ====== CREATE JOB ======
export const createJobsController = async (req, res, next) => {
  const { company, position } = req.body;
  if (!company || !position) {
    next("Please Provide All Fields");
  }
  req.body.createdBy = req.user.userId;
  const job = await jobsModels.create(req.body);
  res.status(201).json({ job });
};

//====== GET JOB ========
export const getAlljobsController = async (req, res, next) => {
  const { status, workType, search, sort } = req.query;
  //Condition for searching
  const queryObject = {
    createdBy: req.user.userId
  };
  // Logic filter
  if (status && status !== 'all') {
    queryObject.status = status;
  };
  if (workType && workType !== 'all') {
    queryObject.workType = workType;
  };
  if (search) {
    queryObject.position = { $regex: search, $options: 'i' };
  };
  let queryResult = jobsModels.find(queryObject);

  // Sorting 
  if (sort === 'latest') {
    queryResult = queryResult.sort('-createdAt');
  };
  if (sort === 'oldest') {
    queryResult = queryResult.sort('createdAt');
  };
  if (sort === 'a-z') {
    queryResult = queryResult.sort('position');
  };
  if (sort === 'z-a') {
    queryResult = queryResult.sort('-position');
  };

  //pagination 
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
 
  queryResult = queryResult.skip(skip).limit(limit);
  //jobs count
  const totalJobs = await jobsModels.countDocuments(queryResult);
  const numOfPage = Math.ceil(totalJobs/limit);

  const jobs = await queryResult;


  //const jobs = await jobsModels.find({ createdBy: req.user.userId });
  res.status(200).json({
    totalJobs,
    jobs,
    numOfPage,
  });
};

// ====== UPDATE JOBS =======
export const updatejobsController = async (req, res, next) => {
  const { id } = req.params;
  const { company, position } = req.body;
  //validation
  if (!company || !position) {
    return next('Please Provide all Fiels');
  }
  //Find job
  const job = await jobsModels.findOne({ _id: id });

  //validation
  if (!job) {
    next(`no jobs found with this id ${id}`);
  };
  if (!req.user.userId === job.createdBy.toString()) {
    next('You are Not Authorized to update this job');
    return;
  };
  const updatejob = await jobsModels.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  ///Res
  res.status(200).json({ updatejob });
};

// ======  DELETE JOBS ======
export const deletejobsController = async (req, res, next) => {
  const { id } = req.params;
  //find job
  const job = await jobsModels.findOne({ _id: id });
  //validation
  if (!job) {
    next(`No Job found with this ID ${id}`);
  };
  if (req.user.userId !== job.createdBy.toString()) {
    next('You are not Authorized to delete this job');
    return;
  };
  await job.deleteOne();
  res.status(200).json({ message: "success, Job deleted" });
};

//======= JOBS STATS & FILTER =======
export const jobsStatsController = async (req, res) => {
  const stats = await jobsModels.aggregate([
    //Search by User Jobs
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },

    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  //default  stats
  const defaultStats = {
    pending: stats.pending || 0,
    reject: stats.reject || 0,
    interview: stats.interview || 0,
  };

  //monthly yearly  stats
  let monthlyApplication = await jobsModels.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId)
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  monthlyApplication = monthlyApplication.map(item => {
    const { _id: { year, month }, count } = item;
    const date = moment().month(month - 1).year(year).format('MMM Y');
    return { date, count };
  })
    .reverse();
  res.status(200).json({ totalJobs: stats.length, defaultStats, monthlyApplication });
};