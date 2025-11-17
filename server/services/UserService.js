const db = require('../database/database_queries')
const JWTService = require('../utils/jwt')

class UserService {
    constructor () {
        this.database = db;
    }

    async findAll() {
        const users = await this.database('users').select();
        return {
            data: users
        }
    }

    async findById(id) {
        const user = await this.database('users')
            .where({ id })
            .select()
            .first();

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async register(userData, files) {
        const { email, password, name, status, car_desc } = userData;

        const existingUser = await this.database('users').where({ email }).first();
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const userInsertData = {
            email,
            password, // TODO: добавить хеширование sha256 + соль + хэши хранить в отдельной таблице
            name,
            users_status_text: status || '',
            users_car_desc: car_desc || '',
            created_at: new Date()
        };

        if (files && files.profilePhoto) {
            userInsertData.profile_photo_path = `profilePhotos/${files.profilePhoto[0].filename}`;
        }

        const [userId] = await this.database('users').insert(userInsertData).returning('id');

        if (files && files.usersCarsPhotos) {
            const carPhotosData = files.usersCarsPhotos.map(file => ({
                user_id: userId,
                photo_path: `usersCarsPhotos/${file.filename}`
            }));
            
            await this.database('car_desc_photos').insert(carPhotosData);
        }

        // Генерируем токен
        const token = JWTService.generateToken({ 
            id: userId,
            email: userInsertData.email,
            name: userInsertData.name,
        });

        return {
            user: { id: userId, email, name },
            token
        };
    }

    async login(loginData) {
        const { email, password } = loginData;
        const user = await this.database('users')
            .where({ email })
            .select()
            .first();

        if (!user) {
            throw new Error('Invalid email or password');
        }

        if (user.password !== password) {
            throw new Error('Invalid email or password');
        }

        const token = JWTService.generateToken({
            id: user.id,
            email: user.email,
            name: user.name,
        });

        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            token: token
        };
    }

    async getProfile(id) {
        const user = await this.database('users')
            .where({ id })
            .select('id', 'email', 'name', 'profile_photo_path', 'users_status_text', 'users_car_desc', 'created_at')
            .first();

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async getUserStatusPhotos(userId) {
        const photos = await this.database('user_status_photos')
            .where({ user_id: userId })
            .select('photo_path');

        return photos;
    }

    async getUserCarPhotos(userId) {
        const photos = await this.database('car_desc_photos')
            .where({ user_id: userId })
            .select('id', 'photo_path');

        return photos;
    }

    async getUserName(userId) {
        const user = await this.database('users')
            .where({ id: userId })
            .select('name')
            .first();

        if (!user) {
            throw new Error('User not found');
        }
        
        return user;
    }

    async updateUser(userId, updateData, files) {
        // Валидация ID
        const id = parseInt(userId);
        if (isNaN(id) || id <= 0) {
            throw new Error('Invalid user ID');
        }

        // Проверяем существование пользователя
        const existingUser = await this.database('users').where({ id }).first();
        if (!existingUser) {
            throw new Error('User not found');
        }

        // Подготавливаем данные для обновления
        const allowedFields = ['name', 'email', 'users_status_text', 'users_car_desc'];
        const updateFields = {};

        // Фильтруем только разрешенные поля
        Object.keys(updateData).forEach(key => {
            if (allowedFields.includes(key) && updateData[key] !== undefined) {
                updateFields[key] = updateData[key];
            }
        });

        // Обработка файлов
        if (files && files.profile_photo) {
            updateFields.profile_photo_path = `profilePhotos/${files.profile_photo[0].filename}`;
        }

         if (files && files.car_photo) {
            const carPhotosData = files.car_photo.map(file => ({
                user_id: userId,
                photo_path: `usersCarsPhotos/${file.filename}`
            }));
            
            await this.database('car_desc_photos').insert(carPhotosData);
        }
        // Если нечего обновлять
        if (Object.keys(updateFields).length === 0 && !files) {
            throw new Error('No data to update');
        }

        // Выполняем обновление
        const [updatedUser] = await this.database('users')
            .where({ id })
            .update(updateFields)
            .returning(['id', 'email', 'name', 'profile_photo_path', 'users_status_text', 'users_car_desc', 'created_at']);

        return updatedUser;
    }
}

module.exports = UserService;