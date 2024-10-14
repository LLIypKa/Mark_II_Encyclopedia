<template>
    <v-container>
      <img :src="profilePhotoUrl" alt="Profile Photo" v-if="profilePhotoUrl"/>
    </v-container>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'PhotoAndMainCommandsAsideComponent',
    
    data() {
      return {
        token: sessionStorage.getItem("token"),
        profilePhotoUrl: null
      };
    },
    mounted() {
      this.getProfilePhoto();
    },
    methods: {
      async getProfilePhoto() {
        try {
          const response = await axios.get(`http://localhost:3001/profile-photo`, {
            headers: {
              'Authorization': `Bearer ${this.token}`
            },
            responseType: 'blob'
          });
          this.profilePhotoUrl = URL.createObjectURL(response.data);
        }
        catch (error) {
          alert(`Не удалось загрузить фото профиля - ${error}`)
        }
      }
    }
  }
</script>
