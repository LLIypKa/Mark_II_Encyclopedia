<template>
  <HelloWorld />
</template>

<script>
import { defineComponent } from 'vue';

// Components
import HelloWorld from '../components/home/Home.vue';

export default defineComponent({
  name: 'HomeView',
  mounted() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.$router.push('/login');
    }
  },
  components: {
    HelloWorld,
  },
});
</script>
