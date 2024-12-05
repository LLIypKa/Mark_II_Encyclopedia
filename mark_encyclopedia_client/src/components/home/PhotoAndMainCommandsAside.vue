<template>
    <v-container>
      <div class="profilePhotoDiv">
        <img :src="profilePhotoUrl" alt="Profile Photo" v-if="profilePhotoUrl" class="profilePhoto"/>
        <label class="label">id:{{ this.id }}</label>
      </div>
      <div class="inputDiv">
        <v-form ref="form" style="width: 100%; ">
          <v-text-field placeholder="Введите название статьи" v-model="stateName" hide-details="true" class="v-text-field"/>
        </v-form>
        <label class="labelInInputDiv">Последние статьи</label>
        <div v-if="this.loading">
          <label class="label">
            Загрузка...
          </label>
        </div> 
        <ul v-else>
          <li v-for="state in states" :key="state.id">
            <router-link class="a" :to="`/articles/${state.id}`">{{ state.title }}</router-link>
          </li>
        </ul>
      </div>
      <div class = "commandsDiv">
        <v-btn type = "button" class="logoutButtonBtn" @click = "logout">Выйти</v-btn>
        <v-btn type = "button" class="changePersonalDataBtn" @click = "toChangeData">Изменить данные</v-btn>
        <v-btn type = "button" class="createNewStateBtn" @click = "toCreateNewArticle">Создать статью</v-btn>
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
        token: sessionStorage.getItem("token") == null ? null : sessionStorage.getItem("token"),
        profilePhotoUrl: null,
        id: null,
        stateName: null,
        states: [],
        loading: true
      };
    },
    mounted() {
      this.getProfilePhoto();
      this.getUserId();
      this.getTop3Articles();
    },
    methods: {
      async getProfilePhoto() {
        if (this.token != null) {
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
      },
      async getUserId() {
        const decodedToken = jwtDecode(this.token);
        this.id = decodedToken.id;
      },
      async logout() {
        this.$router.push('/login');
      },
      async toChangeData() {
        this.$router.push('/changeData');
      },
      async getTop3Articles() {
        try {
          const response = await axios.get(`http://localhost:3001/articles/summary-top-3`, {
             headers: {
                'Authorization': `Bearer ${this.token}`
              }
          });

          this.states = response.data;
          this.loading = !this.loading;
        } catch (ex) {
          alert(`Ошибка при загрузке последних статей ${ex}`);
        }
      },
      async toCreateNewArticle() {
        this.$router.push('/create-article');
      }
    }
  }
</script>


<style lang="css" scoped>
  .generalDiv, .profilePhotoDiv, .inputDiv, .commandsDiv {
    width: 100%;
    background: rgba( 0,0,0,.6);
    border-radius: 5px;
    backdrop-filter: blur(2px);
  }

  .profilePhotoDiv, .commandsDiv {
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    align-items: center; 
    text-align: center; 
  }

  .inputDiv {
    display: flex; 
    flex-direction: column; 
    justify-content: left; 
    align-items: flex-start;
    text-align: left; 
    margin-top: 2%;
    margin-bottom: 2%;
    padding: 2% 2% 2% 2%;
  }

  .logoutButtonBtn, .createNewStateBtn, .changePersonalDataBtn {
    color: #ffffff;
    width: 90%;
    max-width: 90%;
    min-height: 3vh;
    max-height: 5vh;
    font-size: 3vh;
  }

  .createNewStateBtn, .changePersonalDataBtn {
    background: linear-gradient(to right, #37FF70, 50%, #0A7127);
  }

  .createNewStateBtn {
    margin: 4% 1% 4% 1%;
  }

  .logoutButtonBtn {
    background: linear-gradient(to right, #FF5555, 50%, #993333);
    margin: 4% 1% 4% 1%;
  }

  .profilePhoto {
    width: 80%;
    margin: 5% 5% 0% 5%;
    border-radius: 5px;
  }

  .label {
    align-items: center;
    color: #ffffff;
    font-size: 3.25vh;
  }

  .labelInInputDiv {
    align-items: center;
    color: #ffffff;
    font-size: 3vh;
  }

  .v-text-field {
    width: 100%;
    border-radius: 5px;
    background: linear-gradient(to right, #2042ff, 50%, #b200ff);
    border: none;
    color: #ffffff;
    box-sizing: border-box;
  }

  .v-text-field >>> input {
    width: 18vh;
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

  .a {
    background: linear-gradient(to right, #2042ff, 50%, #b200ff);
    color: #ffffff;
    font-size: 3vh;
    width: 100%; /* или можно установить max-width */
    white-space: nowrap; /* чтобы предотвратить перенос */
    border-radius: 5px;
    margin-bottom: 1%;
    display: inline-block;
    padding-left: 1%;
    padding-right: 0%;
  }
</style>