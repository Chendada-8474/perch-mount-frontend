<template>
    <div className="card">
        <h5>{{ member.last_name }} {{ member.first_name }} ( {{ member.user_name }} )</h5>
        <p>頁面製作中...</p>
    </div>
</template>
<script setup>
import { ref, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'

import { useCurrentUser } from '../../stores/currnetUser';
import { getMemberByID } from '../../service/Members'


const currentUser = ref()
const member = ref({})

onBeforeMount(() => {
    currentUser.value = storeToRefs(useCurrentUser())
    getMemberByID(currentUser.value.user_id).then(data => {
        member.value = data
    })
})

</script>