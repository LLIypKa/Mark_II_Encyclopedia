<template>
    <v-container>
      <div class="profilePhotoDiv">
        <img :src="profilePhotoUrl" alt="Profile Photo" v-if="profilePhotoUrl" class="profilePhoto"/>
        <label class="label">id:{{ this.id }}</label>
      </div>
      <div class="inputDiv">
        <v-form ref="form">
          <v-text-field placeholder="Введите название статьи" v-model="stateName" hide-details="true" class="v-text-field"/>
        </v-form>
        <label class="labe">Последние статьи</label>
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
        id: null,
        stateName: null
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
  .generalDiv, .profilePhotoDiv, .inputDiv {
    width: 100%;
    background: rgba( 0,0,0,.6);
    border-radius: 5px;
    backdrop-filter: blur(2px);
  }

  .profilePhotoDiv {
    display: flex; /* Используем flexbox */
    flex-direction: column; /* Строки по вертикали */
    justify-content: center; /* Центрируем по вертикали */
    align-items: center; /* Центрируем по горизонтали */
    text-align: center; /* Центрируем текст */
  }

  .inputDiv {
    display: flex; 
    flex-direction: column; 
    justify-content: left; 
    align-items: flex-start; /* Центрируем по горизонтали */
    text-align: center; /* Центрируем текст */
    margin-top: 2%;
    margin-bottom: 2%;
    padding: 2% 2% 2% 2%;
  }

  .profilePhoto {
    width: 90%;
    margin: 5% 5% 0% 5%;
    border-radius: 5px;
  }
  .label {
    align-items: center;
    color: #ffffff;
    font-size: 30px;
  }

  .v-text-field {
    width: 100%;
    max-width: 100%;
    background: #ffffff;
    border: none;
    color: #000000;
    box-sizing: border-box;
    margin: 1% 1% 1% 1%;
  }
  .v-text-field >>> input {
    width: calc(100%-20px);
    font-size: 3vh;
  }

  .v-text-field >>> label {
    font-size: 2vh;
  }
  
  .v-text-field >>> .v-messages__message {
    font-size: 18px; 
  }

  .v-messages {
    font-size: large;
  }

</style>