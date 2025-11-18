<template>
    <br><br><br><br>
    <v-form @submit.prevent="createArticle">
        <v-text-field variant = "underlined" label = "Заголовок" v-model="newArticleTitle"/>
        <v-text-field variant = "underlined" label = "Текст" v-model="newArticleContent"/>
        <v-btn type="submit">Создать статью</v-btn>
    </v-form>
</template>

<script>
import axios from 'axios';

    export default {
        name: 'CreateArticleComponent',
        data() {
            return {
                token: localStorage.getItem('token') == null ? null : localStorage.getItem('token'),
                newArticleTitle: null,
                newArticleContent: null
            }
        },
        methods: {
            async createArticle() {
                if (this.newArticleContent && this.newArticleContent.length <= 6 
                    && this.newArticleTitle && this.newArticleTitle.length <= 6) {
                        alert('Введите данные');
                        return;
                    }
                
                try {
                    const response = await axios.post('http://localhost:3001/api/articles/create', {
                        newArticleContent: this.newArticleContent,
                        newArticleTitle: this.newArticleTitle,
                        date: new Date().toISOString()
                    },
                    {
                        headers:{
                            'Authorization': `Bearer ${this.token}`
                        }
                    });

                    if (response.status == 200) {
                        alert("Статья сохранена");
                        this.$router.push('/home');
                    } 
                }
                catch (err) {
                    alert(err);
                }
            }
        }
    }
</script>