import express from 'express';
import userAuth from '../middlewares/authMiddelware.js';
import { createJobsController, deletejobsController, getAlljobsController, jobsStatsController, updatejobsController } from '../controller/jobsController.js';

const router = express.Router();

//routes
//Create Job || POST
router.post('/create-job', userAuth, createJobsController);

//GET JOBS || GET
router.get('/get-job',  userAuth, getAlljobsController);

//UPDATE JOBs || PUT || PATCH
router.patch("/update-job/:id", userAuth, updatejobsController);

//DELETE JOBS || DELETE
router.delete("/delete-job/:id", userAuth, deletejobsController);

//JOBS STATS FILTER || GET
router.get("/job-stats", userAuth, jobsStatsController);

export default router;