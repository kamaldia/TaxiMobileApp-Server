import express from 'express';
import * as OnlineDriver from '../Controllers/online-driver.js';

const router = express.Router();

router.post('/', OnlineDriver.addOnlineDriver);
router.get('/', OnlineDriver.getAllOnlineDrivers);
router.get('/deliver', OnlineDriver.getDeliveryOnlineDrivers );
router.get('/ride', OnlineDriver.getRideOnlineDrivers);
router.get('/:id', OnlineDriver.getOnlineDriverById);
router.patch('/:id', OnlineDriver.updateOnlineDriverById);
router.delete('/:id', OnlineDriver.deleteOnlineDriverById);

export default router;