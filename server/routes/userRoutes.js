const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const UserService = require('../services/UserService');
const UserController = require('../controllers/UserController');
const { authUtil } = require('../utils/auth');

const userService = new UserService();
const userController = new UserController(userService);

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const isProfilePhoto = file.fieldname === 'profilePhoto';
            const uploadPath = isProfilePhoto ? 'profilePhotos' : 'usersCarsPhotos';
            cb(null, path.join(__dirname, '..', uploadPath));
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const filename = `${Date.now()}${ext}`;
            cb(null, filename);
        },
    }),
});

router.get('/', userController.getUsers);
router.get('/profile', authUtil, userController.getProfile);
router.get('/photos/status', authUtil, userController.getStatusPhotos);
router.get('/photos/cars', authUtil, userController.getCarPhotos);
router.post('/register', upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'usersCarsPhotos', maxCount: 3 },
]), userController.register);
router.post('/login', userController.login);

router.get('/:id', authUtil, userController.getUserById);

module.exports = router;