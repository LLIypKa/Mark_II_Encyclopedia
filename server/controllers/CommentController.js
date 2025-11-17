class CommentController {
    constructor(commentService) {
        this.commentService = commentService;
    }

    createComment = async (req, res) => {
        try {
            const { article_id, text_content, parent_comment_id } = req.body;
            const author_id = req.user.id; 

            const commentData = {
                article_id: parseInt(article_id),
                author_id,
                text_content,
                parent_comment_id: parent_comment_id ? parseInt(parent_comment_id) : null
            };

            const comment = await this.commentService.createComment(commentData);

            res.status(201).json({
                success: true,
                message: 'Comment created successfully',
                data: comment
            });
        } catch (error) {
            console.error('Error in createComment:', error);
            
            if (error.message === 'Article not found' || 
                error.message === 'Author not found' ||
                error.message === 'Parent comment not found' ||
                error.message === 'Parent comment does not belong to the same article') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message === 'Article ID, author ID and text content are required') {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error creating comment',
                error: error.message
            });
        }
    }

    getCommentsByArticleId = async (req, res) => {
        try {
            const { articleId } = req.params;
            const article_id = parseInt(articleId);

            if (isNaN(article_id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid article ID'
                });
            }

            const comments = await this.commentService.getCommentsByArticleId(article_id);

            res.json({
                success: true,
                data: comments
            });
        } catch (error) {
            console.error('Error in getCommentsByArticleId:', error);
            
            if (error.message === 'Article not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error fetching comments',
                error: error.message
            });
        }
    }
}

module.exports = CommentController;