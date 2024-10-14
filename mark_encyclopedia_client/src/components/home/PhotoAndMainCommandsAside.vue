<template>
    <v-container>
      <div class="profilePhotoDiv">
        <img :src="profilePhotoUrl" alt="Profile Photo" v-if="profilePhotoUrl" class="profilePhoto"/>
        <label class="label">id:{{ this.id }}</label>
      </div>
      
    </v-container>
</template>

<script>
  import axios from 'axios';
  import {jwtDecode} from 'jwt-decode'

  export default {
    name: 'PhotoAndMainCommandsAsideComponent',
    
    data() {
      return {
        token: sessionStorage.getItem("token"),
        profilePhotoUrl: null,
        id: null
      };
    },
    mounted() {
      this.getProfilePhoto();
      this.getUserId();
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
      },
      async getUserId() {
        const decodedToken = jwtDecode(this.token);
        this.id = decodedToken.id;
      }
    }
  }
</script>


<style lang="css" scoped>
  .profilePhoto {
    width: 90%;
    margin: 5% 5% 0% 5%;
    border-radius: 5px;
  }
  .profilePhotoDiv {
    width: 100%;
    background: rgba( 0,0,0,.6);
    border-radius: 5px;
    backdrop-filter: blur(2px);
    display: flex; /* Используем flexbox */
    flex-direction: column; /* Строки по вертикали */
    justify-content: center; /* Центрируем по вертикали */
    align-items: center; /* Центрируем по горизонтали */
    text-align: center; /* Центрируем текст */
  }
  .label {
    align-items: center;
    color: #ffffff;
    font-size: 30px;
  }
</style>