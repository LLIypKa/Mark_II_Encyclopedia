<template>
  <div :style="mainDiv">
    <MainHomeComponent/>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import MainHomeComponent from '../components/home/MainHome.vue';

export default defineComponent({
  name: 'HomeView',
  mounted() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      this.$router.push('/login');
    }
  },
  components: {
    MainHomeComponent,
  },
});
</script>

<style lang="css" scoped>
  .mainDiv {
    align-content: center;
    justify-content: space-between;
  }
</style>