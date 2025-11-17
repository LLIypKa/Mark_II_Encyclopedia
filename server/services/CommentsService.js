const db = require('../database/database_queries')
const JWTService = require('../utils/jwt')

class CommentService {
    constructor(database) {
        this.database = db;
    }

    async saveComment(commentData) {
        
    }
}