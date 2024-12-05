<template>
    <v-container>
        <div>
            <h1>Редактирование данных пользователя</h1>
            <v-form ref="form" @submit.prevent="updateUser">
                <v-text-field label="Имя" v-model="userData.name" required/>
                <v-text-field label="Email" v-model="userData.email" required type="email"/>
                <v-text-field label="Текст статуса" v-model="userData.users_status_text"/>
                <v-text-field label="Описание машины" v-model="userData.users_car_desc"/>

                <div>
                    <label>Фото профиля:</label>
                    <input type="file" @change="onProfilePhotoChange" />
                </div>

                <div>
                    <label>Фото машины:</label>
                    <input type="file" @change="onCarPhotoChange" />
                </div>

                <v-btn type="submit" color="primary">Сохранить изменения</v-btn>
            </v-form>
            <v-btn color="secondary" @click="cancelEdit">Отмена</v-btn>
        </div>
    </v-container>
</template>

<script>
    import axios from "axios";
    import {jwtDecode} from 'jwt-decode'

    export default {
        name: "EditUser",
        data() {
            return {
                token: localStorage.getItem('token'),
                userId: null,
                userData: {
                    name: "",
                    email: "",
                    users_status_text: "",
                    users_car_desc: "",
                },
                profilePhoto: null, // Данные для фото профиля
                carPhoto: null,     // Данные для фото машины
            };
        },
        mounted() {
            const decodedToken = jwtDecode(this.token);
            this.userId = decodedToken.id;
            this.loadUserData();
        },
        methods: {
            async loadUserData() {
                try {
                    const response = await axios.get(`http://localhost:3001/user/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${this.token}`,
                        },
                    });
                    if (response.status === 200) {
                        this.userData = response.data;
                    }
                } catch (error) {
                    console.error("Ошибка при загрузке данных пользователя:", error);
                    alert("Не удалось загрузить данные пользователя.");
                }
            },
            onProfilePhotoChange(event) {
                this.profilePhoto = event.target.files[0];
            },
            onCarPhotoChange(event) {
                this.carPhoto = event.target.files[0];
            },
            async updateUser() {
                try {
                    const formData = new FormData();
                    formData.append("name", this.userData.name);
                    formData.append("email", this.userData.email);
                    formData.append("users_status_text", this.userData.users_status_text);
                    formData.append("users_car_desc", this.userData.users_car_desc);

                    if (this.profilePhoto) {
                        formData.append("profile_photo", this.profilePhoto);
                    }
                    if (this.carPhoto) {
                        formData.append("car_photo", this.carPhoto);
                    }

                    const response = await axios.put(`http://localhost:3001/user/${this.userId}`, formData, {
                        headers: {
                            Authorization: `Bearer ${this.token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    });

                    if (response.status === 200) {
                        alert("Данные успешно обновлены.");
                        const newToken = response.data.token;
                        sessionStorage.setItem("token", newToken);
                        this.$router.push("/home");
                    }
                } catch (error) {
                    console.error("Ошибка при обновлении данных пользователя:", error);
                    alert("Не удалось обновить данные пользователя.");
                }
            },
            cancelEdit() {
                this.$router.push("/home"); // Перенаправление на предыдущую страницу
            },
        },
    };
</script>

<style lang="css" scoped>

</style>