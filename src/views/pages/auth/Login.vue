<script setup>
import { ref } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useToast } from 'primevue/usetoast';

import { loginRequest } from '../../../service/utils/login'

const toast = useToast()

const userName = ref('');
const phoneNumber = ref('');

function login() {
    loginRequest(userName.value, phoneNumber.value)
        .then(data => {
            if (data.login) {
                window.location.replace("/")
            }
        }).catch(e => {
            toast.add({ severity: 'error', summary: '登入失敗', detail: e, life: 3000 })
        })
}

</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Welcome!</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">User Name</label>
                        <InputText id="email1" type="text" placeholder="user name" class="w-full md:w-30rem mb-5"
                            style="padding: 1rem" v-model="userName" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="phoneNumber" placeholder="Password" class="w-full mb-3"
                            inputClass="w-full" :inputStyle="{ padding: '1rem' }" :feedback="false"></Password>


                        <Button label="Sign In" class="w-full p-3 text-xl mt-5" @click="login"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
    <Toast></Toast>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
