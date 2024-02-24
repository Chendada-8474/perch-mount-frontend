<template>
    <div className="card">
        <h5>Review</h5>
        <p>Use this page to start from scratch and place your custom content.</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute()
const url = new URL(route.fullPath, import.meta.env.VITE_BASE_HOST);

const media = ref([])

console.log(url.searchParams.get('section'))


</script>