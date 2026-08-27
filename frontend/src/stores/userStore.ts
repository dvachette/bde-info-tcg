import { reactive, readonly } from "vue";
import type { User } from "@/types/user";
import { useAuthService } from "@/services/authService";
import { httpClient } from "@/services/httpService";
interface UserState extends User {
    isAuthenticated: boolean;
    isLoading: boolean;
}

const state = reactive<UserState>({
    id: -1,
    username: "",
    email: "",
    role: "USER",
    keysBalance: 0,
    isAuthenticated: false,
    isLoading: false,
});

async function fetchMe(): Promise<boolean> {
    state.isLoading = true;
    try {
        const { data } = await httpClient.get('/auth/me');
        state.id = data.id;
        state.username = data.username;
        state.email = data.email;
        state.role = data.role;
        state.keysBalance = data.keysBalance;
        state.isAuthenticated = true;
        return true;
    } catch {
        clearUser();
        return false;
    } finally {
        state.isLoading = false;
    }
}

function clearUser(): void {
    state.id = -1;
    state.username = "";
    state.email = "";
    state.role = "USER";
    state.keysBalance = 0;
    state.isAuthenticated = false;
}

async function logout(): Promise<void> {
    await httpClient.post('/auth/logout');
    clearUser();
}

export const userStore = {
    state: readonly(state),
    fetchMe,
    clearUser,
    logout,
};