const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_KEY = process.env.KEY;

class JWTService {
  static generateToken(payload, expiresIn = '24h') {
    return jwt.sign(payload, JWT_KEY, { expiresIn });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_KEY);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static extractTokenFromHeader(authHeader) {
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }
    return null;
  }
}

module.exports = JWTService;