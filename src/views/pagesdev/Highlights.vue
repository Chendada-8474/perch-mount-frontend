<template>
    <div className="card">
        <h5>精選</h5>
        <p>搜尋條件</p>

    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'

import { getMedia } from '../../service/Media'
import { getBehaviors } from '../../service/Behaviors'
import { getMembers } from '../../service/Members'
import { getSpecies } from '../../service/Species'


const members = ref([])
const species = ref([])
const behariors = ref([])
const media = ref([])


</script>