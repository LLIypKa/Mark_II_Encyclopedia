const db = require('../database/database_queries')

class CommentsService {
    constructor() {
        this.database = db;
    }

    async createComment(commentData) {
        const { article_id, author_id, text_content, parent_comment_id } = commentData;

        if (!article_id || !author_id || !text_content) {
            throw new Error('Article ID, author ID and text content are required');
        }

        const article = await this.database('articles')
            .where({ id: article_id })
            .first();
        
        if (!article) {
            throw new Error('Article not found');
        }

        const author = await this.database('users')
            .where({ id: author_id })
            .first();
        
        if (!author) {
            throw new Error('Author not found');
        }

        if (parent_comment_id) {
            const parentComment = await this.database('comments')
                .where({ id: parent_comment_id })
                .first();
            
            if (!parentComment) {
                throw new Error('Parent comment not found');
            }

            if (parentComment.article_id !== parseInt(article_id)) {
                throw new Error('Parent comment does not belong to the same article');
            }
        }

        const insertData = {
            article_id,
            author_id,
            text_content,
            parent_comment_id: parent_comment_id || null,
            created_at: new Date()
        };

        const [commentId] = await this.database('comments').insert(insertData).returning('id');

        return;
    }

    async getCommentsByArticleId(articleId) {
        const article = await this.database('articles')
            .where({ id: articleId })
            .first();
        
        if (!article) {
            throw new Error('Article not found');
        }

        const comments = await this.database('comments as c')
            .leftJoin('users as u', 'c.author_id', 'u.id')
            .where({ 'c.article_id': articleId })
            .select(
                'c.id',
                'c.article_id',
                'c.author_id',
                'c.text_content',
                'c.parent_comment_id',
                'c.created_at',
                'u.name as author_name',
                'u.profile_photo_path as author_avatar'
            )
            .orderBy('c.created_at', 'asc');

        return this.buildCommentTree(comments);
    }

    buildCommentTree(comments) {
        const commentMap = new Map();
        const rootComments = [];

        comments.forEach(comment => {
            commentMap.set(comment.id, { ...comment, children: [] });
        });

        comments.forEach(comment => {
            const commentNode = commentMap.get(comment.id);
            
            if (comment.parent_comment_id) {
                const parent = commentMap.get(comment.parent_comment_id);
                if (parent) {
                    parent.children.push(commentNode);
                }
            } else {
                rootComments.push(commentNode);
            }
        });

        return rootComments;
    }
}

module.exports = CommentsService;