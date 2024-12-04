<template>
    <ArticleMainComponent/>
</template>

<script>
    import ArticleMainComponent from '@/components/articles/ArticleMainComponent.vue';
    import { defineComponent } from 'vue';

    export default defineComponent({
        name: 'ArticleView',
        components: {
            ArticleMainComponent
        }
    }) ;

    
</script>

<styles>

</styles>