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
  background-position: left bottom;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
</style>