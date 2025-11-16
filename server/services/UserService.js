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
            email: user.email,
            name: user.name,
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
}

module.exports = UserService;