<template>
    <div className="card">
        <h5>{{ medium.detected_medium_id }}</h5>
        <p>Use this page to start from scratch and place your custom content.</p>
    </div>
</template>



<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getDetectedMediumByID } from '../../service/DetectedMedia'

const route = useRoute()
const medium = ref({})

getDetectedMediumByID(route.params.detected_medium_id).then(data => {
    medium.value = data
})


</script>