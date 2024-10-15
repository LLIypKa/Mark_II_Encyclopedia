<template>
  <div class="mainDiv">
    <PhotoAndMainCommandsAsideComponent style="width: 30%;"/>
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
    justify-content: flex-start;
    align-items: flex-start;
    font-family: 'Gabriola';
  }
</style>