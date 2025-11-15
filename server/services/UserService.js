const db = require('../database/database_queries')

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
}

module.exports = UserService;