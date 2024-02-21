import express from 'express';
import * as Vehicle from '../Controllers/vehicle.js';
import { VehicleFields, vehicleUpload } from '../Middleware/multer.js';

const router = express.Router();

router.post('/',vehicleUpload.fields(VehicleFields), Vehicle.postVehicle);
router.get('/', Vehicle.getAllVehicles);
router.get('/:id', Vehicle.getVehicleById);
router.patch('/:id', vehicleUpload.fields(VehicleFields), Vehicle.updateVehicle);
router.delete('/:id', Vehicle.deleteVehicleById);

export default router;