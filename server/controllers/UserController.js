class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    getUsers = async(req, res) => {
        try {
            const result = await this.userService.findAll();

            res.json({
                success: true,
                ...result
            });
        } catch (error) {
            console.error('Error in getUsers:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при получении пользователей',
                error: error.message
            });
        }
    }

    getUserById = async(req, res) => {
        try {
            const user = await this.userService.findById(req.params.id);
            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Error in getUserById:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при получении пользователя',
                error: error.message
            });
        }
    }

      register = async (req, res) => {
        try {
            const result = await this.userService.register(req.body, req.files);
            
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    login = async (req, res) => {
        try {
            const result = await this.userService.login(req.body);
            
            res.json({
                success: true,
                message: 'Login successful',
                token: result.token,
                user: result.user
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    getProfile = async (req, res) => {
        try {
            const user = await this.userService.getProfile(req.user.id);
            const statusPhotos = await this.userService.getUserStatusPhotos(req.user.id);
            
            res.json({
                success: true,
                data: {
                    user: user, 
                    statusPhotos: statusPhotos
                }
            });
        } catch (error) {
            console.error('Profile error:', error);
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // Дополнительные методы
    getStatusPhotos = async (req, res) => {
        try {
            const photos = await this.userService.getUserStatusPhotos(req.user.id);
            
            res.json({
                success: true,
                data: photos
            });
        } catch (error) {
            console.error('Error getting status photos:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при получении фото статусов'
            });
        }
    }

    getCarPhotos = async (req, res) => {
        try {
            const photos = await this.userService.getUserCarPhotos(req.user.id);
            
            res.json({
                success: true,
                data: photos
            });
        } catch (error) {
            console.error('Error getting car photos:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при получении фото машин'
            });
        }
    }

    getUserNameById = async (req, res) => {
        try {
            const name = await this.userService.getUserName(req.params.id);

            res.json({
                success: true,
                data: name
            });
        } catch (error) {
            console.error('Error getting while getting article author user name', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при получении имени автора статьи'
            });
        }
    }
    updateUser = async (req, res) => {
        try {
            const userId = req.params.id;
            const updateData = req.body;
            const files = req.files;

            const updatedUser = await this.userService.updateUser(userId, updateData, files);

            res.json({
                success: true,
                message: 'User updated successfully',
                data: updatedUser
            });
        } catch (error) {
            console.error('Error updating user:', error);
            if (error.message === 'Invalid user ID' || error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    message: 'Пользователь не найден'
                });
            }
            if (error.message === 'No data to update') {
                return res.status(400).json({
                    success: false,
                    message: 'Нет данных для обновления'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Ошибка при обновлении пользователя',
                error: error.message
            });
        }
    }
}

module.exports = UserController;