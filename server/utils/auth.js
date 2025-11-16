const JWTService = require('./jwt');

const authUtil = (req, res, next) => {
    try {
        const token = JWTService.extractTokenFromHeader(req.headers['authorization']);
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        const decoded = JWTService.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

module.exports = { authUtil };