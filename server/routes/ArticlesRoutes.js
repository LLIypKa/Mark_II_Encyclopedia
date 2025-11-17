const express = require('express');
const router = express.Router();
const ArticleService = require('../services/ArticleService');
const ArticleController = require('../controllers/ArticleController');
const { authUtil } = require('../utils/auth');

const articleService = new ArticleService();
const articleController = new ArticleController(articleService);

// Public routes
router.get('/', articleController.getAllArticles);
router.get('/top', articleController.getTopArticles);
router.get('/:id', articleController.getArticleById);

// Protected routes (require authentication)
router.post('/', authUtil, articleController.createArticle);

module.exports = router;