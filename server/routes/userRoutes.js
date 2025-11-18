const express = require("express");
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
            console.log('Multer обрабатывает файл:', file.fieldname, file.originalname);
            if (file.fieldname === 'profilePhoto') {
                console.log('Сохранение в profilePhotos');
                cb(null, path.join(__dirname, '..', 'profilePhotos'));
            }
            else if (file.fieldname === 'car_photo' || file.fieldname === 'usersCarsPhotos') {
                console.log('Сохранение в usersStatusPhotos');
                cb(null, path.join(__dirname, '..', 'usersStatusPhotos'));
            }
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const filename = `${Date.now()}${ext}`;
            console.log('Сгенерировано имя файла:', filename);
            cb(null, filename);
        },
    }),
});

const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error('Multer Error:', err);
        return res.status(400).json({
            success: false,
            message: `File upload error: ${err.message}`
        });
    } else if (err) {
        console.error('Unknown Upload Error:', err);
        return res.status(500).json({
            success: false,
            message: 'Unknown file upload error'
        });
    }
    next();
};

router.get('/', userController.getUsers);
router.get('/profile', authUtil, userController.getProfile);
router.get('/photos/status', authUtil, userController.getStatusPhotos);
router.get('/photos/cars', authUtil, userController.getCarPhotos);
router.get('/getUserNameById/:id', userController.getUserNameById);
router.post('/register', 
    upload.fields([
        { name: 'profilePhoto', maxCount: 1 },
        { name: 'usersCarsPhotos', maxCount: 3 },
]),
handleMulterError, 
userController.register);
router.post('/login', userController.login);

router.put('/:id', authUtil, upload.fields([
    { name: 'profile_photo', maxCount: 1 },
    { name: 'car_photo', maxCount: 3 } // или больше, в зависимости от требований
]), userController.updateUser)

module.exports = router;