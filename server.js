import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import AdminRoutes from './Routes/admin.js';
import DriverRoutes from './Routes/driver.js';
import OnlineDriverRoutes from './Routes/online-driver.js';
import OrderRoutes from './Routes/order.js';
import ReviewRoutes from './Routes/review.js';
import UserRoutes from './Routes/user.js';
import VehicleRoutes from './Routes/vehicle.js';
import bodyParser from 'body-parser'
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express(); 
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser());
app.use(cors());

// app.use('/images', express.static('images')); //uncomment if a fetch problem occured later
app.use('/api/admin', AdminRoutes);
app.use('/api/driver', DriverRoutes);
app.use('/api/online-driver', OnlineDriverRoutes);
app.use('/api/order', OrderRoutes);
app.use('/api/review', ReviewRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/vehicle', VehicleRoutes);

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`DB connected, server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Error connecting to DB', error);
  });