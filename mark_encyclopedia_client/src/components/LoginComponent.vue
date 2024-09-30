<template>
    <v-container class="transparentForm">
        <v-card>
            <v-card-title class="v-card-title">Авторизация</v-card-title>
            <v-card-text style="font-size: larger;">
                <v-form ref = "form" v-model="valid">
                    <v-text-field variant="underlined" label = "Email" v-model="email" :rules="emailRules" type="email" required class="v-text-field"/>
                    <v-text-field variant="underlined" label = "Password" v-model="password" :rules="passwordRules" type="password" required class="v-text-field"/>
                    <v-btn type = "submit" text = "Войти" color="primary" @click="login" :disabled="!valid"/>
                </v-form>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
    export default {
        data() {
            return {
                email: "",
                password: "",
                valid: false,
                emailRules: [
                    v => !!v || "Почта обязательна",
                    v => /.+@.+\..+/.test(v) || "Почта должна быть корректной",
                ],
                passwordRules: [
                    v => !!v || "Пароль обязателен",
                    v => (v.length >= 6) || "Пароль должен быть длинее 6 символов",
                ],
            };
        },
        methods: {
            login() {
                if (this.$refs.form.validate()) {
                    this.$router.push('/home');
                }
            }
        }
    }
</script>

<style lang="css" scoped>
    .transparentForm {
        box-sizing: border-box;
        background: rgba( 0,0,0,.6);
        border-radius: 5px;
        width: 400px;
        padding: 40px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: 'Gabriola';
        justify-content: center;
        backdrop-filter: blur(4px);
    }
    .v-card-title {
        color: #fff;
        font-size: 50px;     
        padding: 0;
        text-align: center;
        margin-bottom: 20px; 
    }
    .v-text-field {
        background: transparent;
        border: none;
        color: #fff;
    }

    .v-text-field >>> input {
        font-size: 4vh;
    }

    .v-text-field >>> label {
        font-size: large;
    }
    
    .v-text-field >>> .v-messages__message {
    font-size: 18px; 
}

    .v-messages {
        font-size: large;
    }

    .v-btn {
        font-size: 20px; 
        width: 100%;
    }
    .v-card {
        background: transparent; /* Прозрачный фон для карточки */
        box-shadow: none; /* Убираем тень, чтобы не было визуального блока */
    }
    .v-label {
        font-size: 24px; 
        color: #fff;
    }
</style>