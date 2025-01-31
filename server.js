// packages imports
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
import "express-async-errors";
import dotenv from "dotenv";
import colors from "colors";
import cors from 'cors';
import morgan from 'morgan';
//  Security Packages
import helmet from 'helmet';
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
//import mongoose  from "mongoose";
// Files import
import connectDB from "./config/db.js";
// routes import
import testRoutes from './routes/testRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorMiddelware from "./middlewares/error Middelware.js";
import jobsRoutes from './routes/jobsRoutes.js';
import userRoutes from './routes/userRoutes.js';


//Dotenv Config
dotenv.config();

//MongoDB connnection 
connectDB();

//swagger api config
const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: 'Job Portal Application',
            description: "Node Expressjs Job Portal Application"
        },
        servers: [
            {
                url: "http://localhost:8080",
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const spec = swaggerDoc(options);

//rest object
const app = express();

//Middelwares 
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));


//routes
app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/job', jobsRoutes);

//home route
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

//Validation Middelware
app.use(errorMiddelware);

//Ports
const PORT = process.env.PORT || 8080;


//listen
app.listen(PORT, () => {
    console.log(
        `Server Running In ${process.env.DEV_MODE} Mode on port ${PORT}`.bgCyan.white
    );
});