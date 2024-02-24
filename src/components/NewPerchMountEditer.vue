<template>
    <div class="grid">
        <div class="col-12 md:col-6">

            <div class="flex align-items-center gap-3 mb-3">
                <label for="perch_mount_name" class="font-semibold w-6rem">棲架名稱</label>
                <InputText id="perch_mount_name" type="text" v-model="perchMountEditer.perchMountName"
                    @focusout="editorChanged" class="w-full" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="latitude" class="font-semibold w-6rem">緯度</label>
                <InputNumber id="latitude" v-model="perchMountEditer.latitude" inputId="minmaxfraction"
                    :minFractionDigits="3" :maxFractionDigits="6" @focusout="editorChanged" class="w-full" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="longitude" class="font-semibold w-6rem">經度</label>
                <InputNumber id="longitude" v-model="perchMountEditer.longitude" inputId="minmaxfraction"
                    :minFractionDigits="3" :maxFractionDigits="6" @focusout="editorChanged" class="w-full" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="habitat" class="font-semibold w-6rem">棲地</label>
                <Dropdown id="habitat" v-model="perchMountEditer.habitat" :options="habitatOptions" optionLabel="name"
                    optionValue="code" placeholder="Select a Habitat" @change="editorChanged" class="w-full" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="layer" class="font-semibold w-6rem">分層</label>
                <Dropdown id="layer" v-model="perchMountEditer.layer" :options="layerOptions" optionLabel="name"
                    optionValue="code" placeholder="Select a Habitat" @change="editorChanged" class="w-full" />
            </div>

        </div>
        <div class="col-12 md:col-6">
            <Location :center="[perchMountEditer.longitude, perchMountEditer.latitude]"
                :point="[perchMountEditer.longitude, perchMountEditer.latitude]">
            </Location>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue'

import Location from './Location.vue'

import { getHabitats } from '../service/Habitats'
import { getLayers } from '../service/Layers'


const emit = defineEmits()

const props = defineProps({
    visible: { type: Boolean, default: false },
})

const habitatOptions = ref()
const layerOptions = ref()
const perchMountEditer = ref({
    latitude: 22.645327,
    longitude: 120.606588,
})

getHabitats().then((data) => {
    var options = []
    for (const habitat of data.habitats) {
        options.push({ name: habitat.chinese_name, code: habitat.habitat_id })
    }
    habitatOptions.value = options
})
getLayers().then((data) => {
    var options = [{ name: "無分層", code: null }]
    for (const layer of data.layers) {
        options.push({ name: layer.name, code: layer.layer_id })
    }
    layerOptions.value = options
})

function editorChanged() {
    emit("changed", perchMountEditer.value)
}



</script>