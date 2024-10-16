<template>
  <v-container>
    <div class="generalDiv">
      <h1 align = "center">
        Здравствуй, {{ this.name }}
      </h1>
      <label>Обо мне:<br> {{ this.status }}</label>
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
    },
    data() {
      return {
        name: null,
        status: null,
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
      }
    }
  }
</script>

<style lang="css" scoped>
  .generalDiv, .profilePhotoDiv, .inputDiv, .commandsDiv {
    min-width: 100%;
    background: rgba( 0,0,0,.6);
    height: 70%;
    min-height: 50vh;
    border-radius: 5px;
    backdrop-filter: blur(2px);
    color: #fff;
    font-size: 4vh;
  }

  .h1 {
    align-self: center;
  }
</style>