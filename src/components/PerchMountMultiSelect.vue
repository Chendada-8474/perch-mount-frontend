<template>



</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getPerchMounts } from '../service/PerchMounts';



const perchMounts = ref(null)

onMounted(() => {
    getPerchMounts(data => {
        perchMounts.value = data.perch_mounts
    })
})

</script>