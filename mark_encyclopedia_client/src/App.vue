<template>
  <v-app>
    <v-main :style="{ backgroundImage: `url(${BackgroundImage})` }">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import BackgroundImage from "@/assets/mark2110_bgimage.jpg";

export default {
  name: 'App',

  data() {
    return {
      BackgroundImage
    };
  },
}
</script>

<style scoped>
.v-main {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
}
</style>