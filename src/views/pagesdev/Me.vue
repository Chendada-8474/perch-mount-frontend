<template>
    <div className="card">
        <h5>{{ member.last_name }} {{ member.first_name }} ( {{ member.user_name }} )</h5>
        <p>頁面製作中...</p>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useCurrentUser } from '../../stores/currnetUser';
import { getMemberByID } from '../../service/Members'

const currentUser = storeToRefs(useCurrentUser())
const member = ref({})

getMemberByID(currentUser.user_id.value).then(data => {
    member.value = data
})

</script>