import express from 'express';
import * as Driver from '../Controllers/driver.js';
import { DriverFields, driverUpload } from '../Middleware/multer.js';

const router = express.Router();

router.post('/register', driverUpload.fields(DriverFields), Driver.register);
router.post('/login', Driver.login);

router.get('/', Driver.getAllDrivers);
router.get('/:id', Driver.getDriverById);
router.patch('/:id', driverUpload.fields(DriverFields), Driver.updateDriver);
router.delete('/:id', Driver.deleteDriver);

export default router;