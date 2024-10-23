<template>
  <v-container>
    <div class="generalDiv">
      <h1 align = "center">
        Здравствуй, {{ this.name }}
      </h1>
      <label>Обо мне:<br> {{ this.status }}</label>
     
      <br>
      <label>О моем марчке:<br>{{ this.carDesc }}</label>
       <div id="statusPhotos" style="display:flex; justify-content: space-around;">
        <v-row>
          <v-col
            v-for="(photo, index) in statusPhotos"
            :key="index"
            class="photoInPhotosDiv"
          >
            <img :src="'http://localhost:3001/' + photo" alt="Status Photo"/>
          </v-col>
        </v-row>
      </div>
    </div>
    <div class = "generalDiv1">
      <h1 style="margin-left: 1%;">
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
  import {jwtDecode} from 'jwt-decode'

  export default {
    
    name: 'MainHomeComponent',
    mounted() {
      this.getUsersStatus();
      this.getUserName();
      this.getCarDesc();
      this.getPhotos();
    },
    data() {
      return {
        name: null,
        status: null,
        carDesc: null,
        statusPhotos: [],
        token: sessionStorage.getItem("token") == null ? null : sessionStorage.getItem("token")
      }
    },
    methods: {
      async getUsersStatus () {
        if (this.token != null) {
          try {
            const response = await axios.get(`http://localhost:3001/users-status`, {
              headers: {
                'Authorization': `Bearer ${this.token}`
              },
              responseType: 'text'
            });
            this.status = response.data;
          }
          catch (error) {
            alert(`Не удалось загрузить статус профиля - ${error}`);
          }
        }
      },
      async getUserName() {
        const decodedToken = jwtDecode(this.token);
        this.name = decodedToken.name;
      },
      async getCarDesc() {
        if (this.token != null) {
          try {
            const response = await axios.get(`http://localhost:3001/users-car-desc`, {
              headers: {
                'Authorization': `Bearer ${this.token}`
              },
              responseType: 'text'
            });
            this.carDesc = response.data;
          }
          catch (error) {
            alert(`Не удалось загрузить описание машины - ${error}`);
          }
        }
      },
      async getPhotos() {
        if (this.token != null) {
          try {
            const response = await axios.get(`http://localhost:3001/get-car-desc-photos`, {
              headers: {
                'Authorization': `Bearer ${this.token}`
              }
            });

            console.log(response.data)
            /*for (let photo in response.data.photos) {
              this.statusPhotos.push(URL.createObjectURL(photo));
            }*/
            this.statusPhotos = response.data.photos; // Предполагается, что API возвращает массив путей к фото
          } catch (error) {
            alert(`Не удалось загрузить фотографии статуса - ${error}`);
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
   
    min-height: 44vh;
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

  .h1 {
    align-self: center;
    margin-left: 1%;
  }

  .photoInPhotosDiv {
    width: auto;
    height: auto;
    justify-content: space-around;
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
  }
</style>