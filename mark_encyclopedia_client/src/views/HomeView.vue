<template>
  <div class="mainDiv">
    <PhotoAndMainCommandsAsideComponent/>
    <MainHomeComponent/>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import MainHomeComponent from '../components/home/MainHome.vue';
import PhotoAndMainCommandsAsideComponent from '../components/home/PhotoAndMainCommandsAside.vue'

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
    PhotoAndMainCommandsAsideComponent
  },
});
</script>

<style lang="css" scoped>
  .mainDiv {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
</style>