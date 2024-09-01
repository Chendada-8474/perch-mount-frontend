<template>
    <div className="card">
        <h5>{{ member.last_name }} {{ member.first_name }} ( {{ member.user_name }} )</h5>
        <p>頁面製作中...</p>
    </div>
</template>
<script setup>
import { ref } from 'vue'

import { getMemberByID } from '../../service/Members'
import { me } from '../../service/Me'

const member = ref({})
const currentUser = ref({})



me().then(data => {
    currentUser.value = data
    getMemberByID(currentUser.value.user_id).then(data => {
        member.value = data
    })
})



</script>