import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connnectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import detectMissedAppointments from './middlewares/missedAppointment.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

// app config
const app = express();
const port = process.env.PORT || 3000;  
connectDB();
connnectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());
app.use(detectMissedAppointments);
app.use('/api/appointments', appointmentRoutes);

// api endpoints
app.use('/api/admin', adminRouter) // localhost:4000/api/admin/add-doctor
app.use('/api/doctor', doctorRouter) // localhost:4000/api/doctor/list
app.use('/api/user', userRouter)

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(port, () => console.log(`Server is running on port http://localhost:${port}/`));
