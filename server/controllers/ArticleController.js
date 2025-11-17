class ArticleController {
    constructor(articleService) {
        this.articleService = articleService;
    }

    getAllArticles = async (req, res) => {
        try {
            const articles = await this.articleService.findAll();
            
            res.json({
                success: true,
                data: articles,
                count: articles.length
            });
        } catch (error) {
            console.error('Error in getAllArticles:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при получении статей',
                error: error.message
            });
        }
    }

    getTopArticles = async (req, res) => {
        try {
            const articles = await this.articleService.findTopThreeArticles();
            
            res.json({
                success: true,
                data: articles,
                count: articles.length
            });
        } catch (error) {
            console.error('Error in getTopArticles:', error);
            if (error.message === 'empty articles') {
                return res.status(404).json({
                    success: false,
                    message: 'Статьи не найдены'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Ошибка при получении популярных статей',
                error: error.message
            });
        }
    }

    createArticle = async (req, res) => {
        try {
            const { title, textContent } = req.body;
            const authorId = req.user.id; // Из JWT токена

            if (!title || !textContent) {
                return res.status(400).json({
                    success: false,
                    message: 'Заголовок и содержимое статьи обязательны'
                });
            }

            const articleData = {
                authorId,
                title,
                textContent
            };

            const articleId = await this.articleService.saveArticle(articleData);
            
            res.status(201).json({
                success: true,
                message: 'Статья успешно создана',
                data: { id: articleId }
            });
        } catch (error) {
            console.error('Error in createArticle:', error);
            if (error.message === 'There is an article with the same title') {
                return res.status(409).json({
                    success: false,
                    message: 'Статья с таким названием уже существует'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Ошибка при создании статьи',
                error: error.message
            });
        }
    }

    getArticleById = async (req, res) => {
        try {
            const article = await this.articleService.findById(req.params.id);
            
            res.json({
                success: true,
                data: article
            });
        } catch (error) {
            console.error('Error in getArticleById:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при получении статьи',
                error: error.message
            });
        }
    }
}

module.exports = ArticleController;