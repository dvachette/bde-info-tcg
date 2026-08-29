<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useAuthService } from '@/services/authService'
import { useRouter } from 'vue-router'

const authService = useAuthService()
const router = useRouter()

const loginScreen = ref<boolean>(true)

const username = ref<string>('')
const password = ref<string>('')
const email = ref<string>('')
const identifiant = ref<string>('')
const registerPassword = ref<string>('')

// erreur générique liée à la tentative de login/register (réponse serveur)
const loginError = ref<string>('')
const registerError = ref<string>('')

// message d'erreur de validation par champ, vide = pas d'erreur
const errors = reactive({
  identifiant: '',
  loginPassword: '',
  username: '',
  email: '',
  registerPassword: '',
})

// compteur incrémenté à chaque shake pour forcer le redémarrage de l'animation CSS
const shakeKey = reactive({
  identifiant: 0,
  loginPassword: 0,
  username: 0,
  email: 0,
  registerPassword: 0,
})

function setError(field: keyof typeof errors, message: string): void {
  errors[field] = message
  shakeKey[field]++
}

function clearError(field: keyof typeof errors): void {
  errors[field] = ''
}

const isLoginDisabled = computed<boolean>(() => {
  return (
    identifiant.value.trim() === '' ||
    password.value.trim() === '' ||
    errors.identifiant !== '' ||
    errors.loginPassword !== ''
  )
})

const isRegisterDisabled = computed<boolean>(() => {
  return (
    username.value.trim() === '' ||
    email.value.trim() === '' ||
    registerPassword.value.trim() === '' ||
    errors.username !== '' ||
    errors.email !== '' ||
    errors.registerPassword !== ''
  )
})

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePassword(password: string): boolean {
  // Password must be at least 8 characters long and contain at least one number, one uppercase letter, and one lowercase letter, an a symbol
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

function validateUsername(username: string): boolean {
  // Username must be at least 3 characters long and contain only letters, numbers, underscores, or hyphens
  const usernameRegex = /^[a-zA-Z0-9_-]{3,}$/
  return usernameRegex.test(username)
}

function validateIdentifiant(identifiant: string): boolean {
  // Identifiant can be either a valid email or a valid username
  return validateEmail(identifiant) || validateUsername(identifiant)
}

function validateLoginForm(): boolean {
  let valid = true

  if (!validateIdentifiant(identifiant.value)) {
    setError('identifiant', 'Identifiant invalide.')
    valid = false
  } else {
    clearError('identifiant')
  }

  if (password.value.trim() === '') {
    setError('loginPassword', 'Le mot de passe est requis.')
    valid = false
  } else {
    clearError('loginPassword')
  }
  loginError.value = '' // Clear any previous login error when validating
  return valid
}

function validateRegisterForm(): boolean {
  let valid = true

  if (!validateUsername(username.value)) {
    setError('username', '3 caractères minimum, lettres/chiffres/_/- uniquement.')
    valid = false
  } else {
    clearError('username')
  }

  if (!validateEmail(email.value)) {
    setError('email', 'Adresse email invalide.')
    valid = false
  } else {
    clearError('email')
  }

  if (!validatePassword(registerPassword.value)) {
    setError('registerPassword', '8 caractères min., majuscule, minuscule, chiffre et symbole.')
    valid = false
  } else {
    clearError('registerPassword')
  }
  registerError.value = '' // Clear any previous register error when validating
  return valid
}

async function register(): Promise<void> {
  registerError.value = ''

  if (!validateRegisterForm()) {
    return
  }

  const { success, message } = await authService.register(
    username.value,
    email.value,
    registerPassword.value,
  )
  if (!success) {
    registerError.value = message
  } else {
    console.log('Registration successful', message)

    router.push({ name: 'home' })
  }
}

async function login(): Promise<void> {
  loginError.value = ''

  if (!validateLoginForm()) {
    return
  }

  const { success, message } = await authService.login(identifiant.value, password.value)
  if (!success) {
    loginError.value = "Le mot de passe ou l'identifiant est incorrect."
  } else {
    console.log('Login successful', message)
    if (router.currentRoute.value.query.redirect) {
      router.push(router.currentRoute.value.query.redirect as string)
    } else {
      router.push({ name: 'home' })
    }
  }
}
</script>
<template>
  <div class="page-container">
    <section class="login-container" v-if="loginScreen">
      <form @submit.prevent="login">
        <h1>Se connecter</h1>
        <div
          class="form-field"
          :class="{ invalid: errors.identifiant }"
          :key="'id-shake-' + shakeKey.identifiant"
        >
          <input
            type="text"
            id="identifier"
            v-model="identifiant"
            required
            placeholder=" "
            @input="clearError('identifiant')"
          />
          <label for="identifier">Nom d'utilisateur ou email</label>
          <p class="field-error" v-if="errors.identifiant">{{ errors.identifiant }}</p>
        </div>
        <div
          class="form-field"
          :class="{ invalid: errors.loginPassword }"
          :key="'pw-shake-' + shakeKey.loginPassword"
        >
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder=" "
            @input="clearError('loginPassword')"
          />
          <label for="password">Mot de passe</label>
          <p class="field-error" v-if="errors.loginPassword">{{ errors.loginPassword }}</p>
        </div>
        <p class="form-error" v-if="loginError">{{ loginError }}</p>
        <button type="submit" :disabled="isLoginDisabled">Login</button>
      </form>
      <p class="switch-screen" @click="loginScreen = false">Créer un compte</p>
    </section>
    <section class="register-container" v-else>
      <form @submit.prevent="register">
        <h1>Créer un compte</h1>
        <div
          class="form-field"
          :class="{ invalid: errors.username }"
          :key="'user-shake-' + shakeKey.username"
        >
          <input
            type="text"
            id="username"
            v-model="username"
            required
            placeholder=" "
            @input="clearError('username')"
          />
          <label for="username">Nom d'utilisateur</label>
          <p class="field-error" v-if="errors.username">{{ errors.username }}</p>
        </div>
        <div
          class="form-field"
          :class="{ invalid: errors.email }"
          :key="'email-shake-' + shakeKey.email"
        >
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder=" "
            @input="clearError('email')"
          />
          <label for="email">Email</label>
          <p class="field-error" v-if="errors.email">{{ errors.email }}</p>
        </div>
        <div
          class="form-field"
          :class="{ invalid: errors.registerPassword }"
          :key="'rpw-shake-' + shakeKey.registerPassword"
        >
          <input
            type="password"
            id="register-password"
            v-model="registerPassword"
            required
            placeholder=" "
            @input="clearError('registerPassword')"
          />
          <label for="register-password">Mot de passe</label>
          <p class="field-error" v-if="errors.registerPassword">{{ errors.registerPassword }}</p>
        </div>
        <p class="form-error" v-if="registerError">{{ registerError }}</p>
        <button type="submit" :disabled="isRegisterDisabled">Register</button>
      </form>
      <p class="switch-screen" @click="loginScreen = true">Se connecter</p>
    </section>
    <aside class="side-image">
      <img src="/assets/images/site/logo_bde_info.png" alt="Logo BDE INFO" />
    </aside>
  </div>
</template>
<style lang="scss" scoped>
@use '@/constants/colors.scss';

.page-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
  height: 100vh;
  background-color: colors.$background-color;
  .login-container,
  .register-container {
    width: 80%;
    max-width: 400px;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: darken(colors.$background-color, 10%);
    display: flex;
    flex-direction: column;
    height: 50%;
    .switch-screen {
      color: colors.$text-color;
      cursor: pointer;
      margin-top: 1rem;
      text-decoration: underline;
      margin-top: auto;
    }
    .form-field {
      position: relative;
      margin-bottom: 1.5rem;

      input {
        width: 100%;
        padding: 0.5rem 0;
        border: none;
        border-bottom: 1px solid #ccc;
        background: transparent;
        outline: none;
        font-size: 1rem;

        &:autofill,
        &:-webkit-autofill {
          // le délai de transition est énorme pour "geler" indéfiniment
          // le fond avant que le navigateur ne l'applique visuellement
          transition:
            background-color 600000s 0s,
            color 600000s 0s;
          -webkit-text-fill-color: colors.$text-color;
          box-shadow: inset 0 0 0 1000px transparent;
        }

        &:autofill:focus,
        &:-webkit-autofill:focus {
          -webkit-text-fill-color: colors.$text-color;
        }

        &:not(:placeholder-shown),
        &:focus {
          border-bottom: 1px solid colors.$text-color;
        }

        &:focus::placeholder {
          color: transparent;
        }
      }

      label {
        position: absolute;
        top: 0.5rem;
        left: 0;
        font-size: 1rem;
        color: #999;
        pointer-events: none;
        transition:
          top 0.2s ease,
          font-size 0.2s ease,
          color 0.2s ease;
      }

      input:not(:placeholder-shown) ~ label,
      input:focus ~ label {
        top: -1em;
        left: 0;
        font-size: small;
        color: colors.$text-color;
      }

      &:has(input:focus)::before {
        content: '';
        width: 100%;
        position: absolute;
        border-bottom: 1px solid colors.$text-color;
        right: 0;
        bottom: 0;
        animation: border-reveal 0.3s ease-in-out forwards;
      }

      .field-error {
        position: absolute;
        bottom: -1.2rem;
        left: 0;
        font-size: 0.75rem;
        color: colors.$text-color-error;
        margin: 0;
      }

      // état d'erreur
      &.invalid {
        animation: shake 0.4s ease-in-out;

        input {
          border-bottom: 1px solid colors.$text-color-error;
        }

        label {
          color: colors.$text-color-error;
        }
      }
    }

    .form-error {
      color: colors.$text-color-error;
      font-size: 0.875rem;
      margin: 0 0 1rem 0;
      text-align: center;
    }

    button {
      width: 100%;
      padding: 0.5rem;
      border: none;
      border-radius: 4px;
      background-color: colors.$text-color;
      color: #fff;
      cursor: pointer;
      &:hover {
        background-color: darken(colors.$text-color, 10%);
      }
      &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
    }
  }
}

@keyframes border-reveal {
  0% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-6px);
  }
  40% {
    transform: translateX(6px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
}

.side-image {
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.3);
  border-radius: 8px 0 0 8px;
  overflow: hidden;
  width: 98%;
  height: 95%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2% 0 2% 2%;
  background-color: lighten(colors.$background-color, 80%);
}
</style>
