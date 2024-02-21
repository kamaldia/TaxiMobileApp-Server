import express from 'express';
import * as User from '../Controllers/user.js';
import { imageUpload } from '../Middleware/multer.js';

const router = express.Router();

router.post('/register', imageUpload.single('image'), User.register);
router.post('/login', User.login);

router.get('/', User.getAllUsers);
router.get('/:id', User.getUserById);
router.patch('/:id', imageUpload.single('image'), User.updateUser);
router.delete('/:id', User.deleteUser);

export default router;