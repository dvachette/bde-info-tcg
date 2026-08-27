<script setup lang="ts">
    import { ref } from "vue";
    import { useAuthService } from "@/services/authService";
    import { useRouter } from "vue-router";

    const authService = useAuthService();

    const router = useRouter();

    const loginScreen = ref<boolean>(true);

    const loginError = ref<string>("");
    const registerError = ref<string>("");

    const username = ref<string>("");
    const password = ref<string>("");
    const email = ref<string>("");
    const identifiant = ref<string>("");

    async function register(): Promise<void> {
        const {success, message} = await authService.register(username.value, email.value, password.value);
        if (!success) {
            registerError.value = message;
        } else {
            console.log("Registration successful", message);
            router.push({ name: 'home'})
        }
    }

    async function login(): Promise<void> {
        const {success, message} = await authService.login(identifiant.value, password.value);
        if (!success) {
            loginError.value = message;
        } else {
            console.log("Login successful", message);
            router.push({ name: 'home'})
        }
    }
    
</script>
<template>
    <div class="page-container">
        <section class="login-container" v-if="loginScreen">
            <form @submit.prevent="login">
                <h1>Login</h1>
                <div class="input-group">
                    <label for="username">Nom d'utilisateur ou email</label>
                    <input type="text" id="identifier" v-model="identifiant" required />
                </div>
                <div class="input-group">
                    <label for="password">Mot de passe</label>
                    <input type="password" id="password" v-model="password" required />
                </div>
                <button type="submit">Login</button>
                <p class="error-message" v-if="loginError">{{ loginError }}</p>
                <p class="switch-screen" @click="loginScreen = false">Pas encore de compte ? Inscrivez-vous</p>
            </form>
        </section>
        <section class="register-container" v-else>
            <form @submit.prevent="register">
                <h1>Register</h1>
                <div class="input-group">
                    <label for="username">Nom d'utilisateur</label>
                    <input type="text" id="username" v-model="username" required />
                </div>
                <div class="input-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="email" required />
                </div>
                <div class="input-group">
                    <label for="password">Mot de passe</label>
                    <input type="password" id="password" v-model="password" required />
                </div>
                <button type="submit">Register</button>
                <p class="error-message" v-if="registerError">{{ registerError }}</p>
                <p class="switch-screen" @click="loginScreen = true">Déjà un compte ? Connectez-vous</p>
            </form>
        </section>
        <aside :class="`side-image-${loginScreen ? 'login' : 'register'}`">
        </aside>
    </div>
    
</template>