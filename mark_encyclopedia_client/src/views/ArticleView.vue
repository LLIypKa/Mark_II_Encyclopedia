<template>
    
  <div v-if="loading">
    <p>Загрузка статьи...</p>
  </div>
  <div v-else-if="article">
    <h1>{{ article.title }}</h1>
    <p>{{ article.text_content }}</p>
    <p>Автор: {{ article.author_id }}</p>
    <p>Дата публикации: {{ article.created_at }}</p>
  </div>
  <p v-else>Статья не найдена или ошибка загрузки.</p>
</template>

<script>
    import axios from 'axios';
import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'ArticleView',
        data() {
            return {
                token: sessionStorage.getItem("token") == null ? null : sessionStorage.getItem("token"),
                article: null,
                loading: true
            }
        },
        mounted() {
            this.getArticle();
        },
        methods: {
            async getArticle() {
                try {
                    let articleId = this.$route.params.id;
                    const response = await axios.get(`http://localhost:3001/articles/${articleId}`, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    });

                    if (response.status === 200) {
                        this.article = response.data;
                        console.log("Данные статьи:", this.article);
                    } else {
                        alert("Ошибка сервера. Код статуса:", response.status);
                    }
                } catch (err) {
                    alert(err);
                }
                finally {
                    this.loading = false;
                }
            }
        }
    }) ;

    
</script>

<styles>

</styles>