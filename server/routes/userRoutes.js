const express = require('express');
const router = express.Router();
const UserService = require('../services/UserService');
const UserController = require('../controllers/UserController');

const userService = new UserService();
const userController = new UserController(userService);

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);

module.exports = router;