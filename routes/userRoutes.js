import express from 'express';
import userAuth from '../middlewares/authMiddelware.js';
import { getUserController, updateUserController } from '../controller/userController.js';

//Router object
const router = express.Router();

//routes
//GET USER Data || GET
router.post('/getUser', userAuth, getUserController)



//UPDATE USER || PUT
router.put('/update-user', userAuth, updateUserController);

export default router;