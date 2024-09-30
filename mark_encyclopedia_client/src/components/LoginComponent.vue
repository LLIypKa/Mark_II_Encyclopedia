<template>
    <v-container>
        <v-card>
            <v-card-title style="align-content: center;">Авторизация</v-card-title>
            <v-card-text>
                <v-form ref = "form" v-model="valid">
                    <v-text-field label = "Email" v-model="email" :rules="emailRules" type="email" required/>
                    <v-text-field label = "Password" v-model="password" :rules="passwordRules" type="password" required/>
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