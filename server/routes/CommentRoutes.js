const express = require('express');
const router = express.Router();
const CommentsService = require('../services/CommentsService');
const CommentController = require('../controllers/CommentController');
const { authUtil } = require('../utils/auth');

const commentService = new CommentsService();
const commentController = new CommentController(commentService);

router.post('/createComment', authUtil, commentController.createComment);

router.get('/article/:articleId', commentController.getCommentsByArticleId);

module.exports = router;