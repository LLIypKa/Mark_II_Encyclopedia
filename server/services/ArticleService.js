const db = require('../database/database_queries')

class ArticleService {
  constructor() {
    this.database = db;
  }
  async findAll() {
    const articles = await this.database('articles')
      .select()
    if (!articles) {
      throw new Error('empty articles');
    }

    return articles;
  }

  async findTopThreeArticles() {
    const articles = await this.database('articles')
      .select()
      .orderBy('created_at', 'desc')  
      .limit(3);

    if (!articles) {
      throw new Error('empty articles');
    }

    return articles;
  }

  async saveArticle(articleData) {
    const { authorId, title, textContent } = articleData;

    const existingArticle = await this.database('articles')
      .where({title: title})
      .first();

    if (existingArticle) {
      if (authorId != existingArticle.author_id) {
        throw new Error('There is an article with the same title');
      }
    }

    const insertData = {
      author_id: authorId,
      title,
      text_content: textContent,
      created_at: new Date()
    };

    const [articleId] = await this.database('articles').insert(insertData).returning('id');

    return articleId;
  }

  async findById(id) {
    const article = await this.database('articles')
      .where({ id })
      .select('id', 'title', 'text_content', 'author_id', 'created_at')
      .first();

    if (!article) {
      throw new Error('Article not found');
    }

    return article;
  }
}

module.exports = ArticleService;