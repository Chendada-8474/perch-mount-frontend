import { me } from '../service/Me'
import { ref } from 'vue'
import { defineStore } from 'pinia'




var user = {}
me().then(data => {
    user = data
})

// export const useCurrentUser = defineStore('currentUser', () => {
//     const currentUser = ref({})

//     currentUser.value = user
//     return currentUser
// })

export const useCurrentUser = defineStore({
    id: 'currentUser',
    state: () => (user),
})