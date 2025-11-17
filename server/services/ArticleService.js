const db = require('./database/database_queries')

class ArticleService {
  constructor(database) {
    this.database = db;
  }
  async findAll() {
    const articles = await this.database('articles')
      .select()
    if (article===null) {
      throw Error('empty articles);
    }

    return articles;
  }

  async findTopThreeArticles() {
    const articles = await this.database('articles')
      .select()
      .sort((a, b) => a.created_at < b.created_at)

    if (article===null) {
      throw Error('empty articles);
    }

    return articles;
  }
}
