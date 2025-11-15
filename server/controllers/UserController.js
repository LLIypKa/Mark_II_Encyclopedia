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
}

module.exports = UserController;