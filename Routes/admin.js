import express from 'express';
import * as Admin from '../Controllers/admin.js';

const router = express.Router();

router.post('/register', Admin.register);
router.post('/login', Admin.login);

router.get('/', Admin.getAllAdmins);
router.get('/:id', Admin.getAdminById);
router.put('/:id', Admin.updateAdmin);
router.delete('/:id', Admin.deleteAdmin);

export default router;