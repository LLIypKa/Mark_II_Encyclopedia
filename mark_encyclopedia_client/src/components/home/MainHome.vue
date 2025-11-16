<template>
  <v-container>
    <div class="generalDiv">
      <h1 align = "center" class="h1">
        Здравствуй, {{ this.name }}
      </h1>
      <label>Обо мне:<br> {{ this.status }}</label>
     
      <br>
      <label>О моем марчке:<br>{{ this.carDesc }}</label>
      <div id="statusPhotos" class="carsPhotoDiv">
        <img v-for="(photo, index) in statusPhotos"
          :key="index" :src="'http://localhost:3001/' + photo" alt="car photo" class="photoInPhotosDiv">
      </div>
    </div>
    <div class = "generalDiv1">
      <h1 align = "left" class="h1">
        Моя активность
      </h1>
      <a class="a">Оставлен комментарий “марк в поисках столба” на статью “статья 1”</a>
      <a class="a">Создана статья “История маркообразных. Часть 1”</a>
      <a class="a">Создана статья "Двигатель 1jz-gte. Часть 1. Строение"</a>
    </div>
  </v-container>
</template>

<script>
  import axios from 'axios';

  export default {
    
    name: 'MainHomeComponent',
    mounted() {
      //this.getPhotos();
      this.getProfile();
    },
    data() {
      return {
        name: null,
        status: null,
        carDesc: null,
        statusPhotos: [],
        token: localStorage.getItem('token') == null ? null : localStorage.getItem('token')
      }
    },
    methods: {
      async getProfile() {
        if (this.token != null) {
          try {
            const response = await axios.get(`http://localhost:3001/api/users/profile`, {
              headers: {
                'Authorization': `Bearer ${this.token}`
              }
            });
            alert(response);
            const userData = response.data.data.user;
            this.name = userData.name;
            this.status = userData.users_status_text;
            this.carDesc = userData.users_car_desc;
            this.statusPhotos = response.data.data.statusPhotos.map(photoObj => photoObj.photo_path);
          }
          catch (error) {
            alert(`Не удалось загрузить статус профиля - ${error}`);
          }
        }
      }
    }
  }
</script>

<style lang="css" scoped>
  .generalDiv {
    min-width: 100%;
    background: rgba( 0,0,0,.6);
    height: 70%;
    min-height: 50vh;
    border-radius: 5px;
    backdrop-filter: blur(2px);
    color: #fff;
    font-size: 3.5vh;
    margin-bottom: 1%;
  }

  .generalDiv1 {
    min-width: 100%;
    background: rgba( 0,0,0,.6);
   
    min-height: 27.8vh;
    border-radius: 5px;
    backdrop-filter: blur(2px);
    color: #fff;
    font-size: 3.5vh;
    display: flex; 
    flex-direction: column; 
    justify-content: left; 
    align-items: flex-start;
    text-align: left; 
  }

  .carsPhotoDiv {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  .h1 {
    align-self: center;
    margin-left: 1%;
    font-size: 6vh;
  }

  .photoInPhotosDiv {
    max-width: 45vh;
    height: auto;
    margin-bottom: 2%;
    margin-top: 2%;
    box-shadow: 5px 5px 5px 2px rgb(158, 0, 155), 0 0 2em blueviolet;
  }

  .a {
    background: linear-gradient(to right, #2042ff, 50%, #b200ff);
    color: #ffffff;
    font-size: 3vh;
    width: 98%;
    border-radius: 5px;
    margin-bottom: 1%;
    margin-right: 1%;
    margin-left: 1%;
    padding-left: 1%;
  }
</style>