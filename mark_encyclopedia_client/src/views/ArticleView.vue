<template>
    
  <div v-if="loadingArticle">
    <p>Загрузка статьи...</p>
  </div>
  <div v-else-if="article && authorName">
    <h1>{{ article.title }}</h1>
    <p>{{ article.text_content }}</p>
    <p>Автор: {{ authorName.name }}</p>
    <p>Дата публикации: {{ article.created_at }}</p>
  </div>
  <p v-else>Статья не найдена или ошибка загрузки.</p>
  <p v-if = "loadingComments">Загрузка комментариев</p>
  <div v-else>
    <h1>Комментарии</h1>
    <v-form ref="form" @submit.prevent="saveComment">
        <v-text-field variant = "underlined" label = "Текст комментария" v-model="commentText"/>
        <v-btn type="submit">Оставить комментарий</v-btn>
    </v-form>
    <ul>
        <li v-for="comment in commentaries" :key="comment.id">
            <div>
                <p>{{ comment.author_name }}</p>
                <p>{{ comment.text_content }}, {{ comment.created_at }}</p>
            </div>
        </li>
    </ul>
  </div>
</template>

<script>
    import axios from 'axios';
import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'ArticleView',
        data() {
            return {
                token: localStorage.getItem('token') == null ? null : localStorage.getItem('token'),
                article: null,
                loadingArticle: true,
                loadingComments: true,
                authorName: null,
                commentaries: [],
                commentText: null,
                commentTextRules: [
                    v => !!v || "Текст обязателен",
                    v => (v.length >= 6) || "Комментарий должен быть длинее 6 символов"
                ]

            }
        },
        mounted() {
            this.getArticle();
        },
        methods: {
            async getArticle() {
                try {
                    let articleId = this.$route.params.id;
                    const response = await axios.get(`http://localhost:3001/api/articles/${articleId}`, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    });

                    if (response.status === 200) {
                        this.article = response.data.data;
                        console.log("Данные статьи:", this.article);
                    } else {
                        alert("Ошибка сервера. Код статуса:", response.status);
                    }
                } catch (err) {
                    console.log(err);
                }
                finally {
                    this.loadingArticle = false;
                    this.getAuthorName();
                    this.getComments();
                }
            },
            async getAuthorName() {
                try { 
                    const response = await axios.get(`http://localhost:3001/api/users/getUserNameById/${this.article.author_id}`, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    });

                    if (response.status == 200) {
                        this.authorName = response.data.data;
                    }
                } catch(err) {
                    console.log(err);
                }
            },
            async getComments() {
                try {
                    const response = await axios.get(`http://localhost:3001/api/comments/article/${this.article.id}`, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    });

                    if (response.status == 200) {
                        this.commentaries = response.data.data;
                    }
                } catch(err) {
                    console.log(err);
                } finally {
                    this.loadingComments = false;
                }
            } ,
            async saveComment() {
                if (this.commentText == null || this.commentText.length <= 6) {
                    alert("Введите комментарий")
                    return;
                }
                try {                    
                    const response = await axios.post(`http://localhost:3001/api/comments/createComment`, {
                            text_content: this.commentText,
                            article_id: this.article.id,
                            parent_comment_id: null
                         }, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    });

                    if (response.status == 201) {
                        alert("Коммент сохранён")
                        
                    }
                } catch(err) {
                    alert(err);
                } finally {
                    this.$router.go(0);
                }
            }
        }
    }) ;

    
</script>

<styles>

</styles>