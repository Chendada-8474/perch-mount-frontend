<template>
    <div class="grid">
        <div class="col-12 md:col-6">
            <span class="p-text-secondary block mb-5">編輯棲架資訊</span>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="latitude" class="font-semibold w-6rem">緯度</label>
                <InputNumber id="latitude" v-model="perchMountEditer.latitude" @focusout="editorChanged"
                    inputId="minmaxfraction" :minFractionDigits="3" :maxFractionDigits="6" class="w-full" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="longitude" class="font-semibold w-6rem">經度</label>
                <InputNumber id="longitude" v-model="perchMountEditer.longitude" @focusout="editorChanged"
                    inputId="minmaxfraction" :minFractionDigits="3" :maxFractionDigits="6" class="w-full" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="project" class="font-semibold w-6rem">計畫</label>
                <Dropdown id="project" v-model="perchMountEditer.project" @change="editorChanged" :options="projectOptions"
                    optionLabel="name" optionValue="code" placeholder="Select a Project" class="w-full" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="habitat" class="font-semibold w-6rem">棲地</label>
                <Dropdown id="habitat" v-model="perchMountEditer.habitat" @change="editorChanged" :options="habitatOptions"
                    optionLabel="name" optionValue="code" placeholder="Select a Habitat" class="w-full" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="layer" class="font-semibold w-6rem">分層</label>
                <Dropdown id="layer" v-model="perchMountEditer.layer" @change="editorChanged" :options="layerOptions"
                    optionLabel="name" optionValue="code" placeholder="Select a Habitat" class="w-full" />
            </div>
            <div class="flex align-items-center gap-3 mb-3">
                <label for="claim_by" class="font-semibold w-6rem">指派認領</label>
                <Dropdown id="claim_by" v-model="perchMountEditer.claimBy" @change="editorChanged" :options="memberOptions"
                    optionLabel="name" optionValue="code" placeholder="Select a Member" class="w-full" />
            </div>
        </div>
        <div class="col-12 md:col-6">
            <Location :center="[longitude, latitude]" :point="[longitude, latitude]">
            </Location>
        </div>


    </div>
</template>


<script setup>
import { ref } from 'vue'

import Location from './Location.vue'

import { getProjects } from '../service/Projects'
import { getMembers } from '../service/Members'
import { getHabitats } from '../service/Habitats'
import { getLayers } from '../service/Layers'

const habitatOptions = ref()
const projectOptions = ref()
const memberOptions = ref()
const layerOptions = ref()
const perchMountEditer = ref({})

const props = defineProps({
    latitude: { type: Number, default: 22.645327 },
    longitude: { type: Number, default: 120.606588 },
    project: { type: Number, default: null },
    habitat: { type: Number, default: null },
    layer: { type: Number, default: null },
    claimBy: { type: Number, default: null },

})

perchMountEditer.value.latitude = props.latitude
perchMountEditer.value.longitude = props.longitude
perchMountEditer.value.project = props.project
perchMountEditer.value.habitat = props.habitat
perchMountEditer.value.layer = props.layer
perchMountEditer.value.claimBy = props.claimBy


const emit = defineEmits()


function editorChanged() {
    emit('editorChanged', perchMountEditer.value)
}


getProjects().then((data) => {
    var options = []
    for (const project of data.projects) {
        options.push({ name: project.name, code: project.project_id })
    }
    projectOptions.value = options
})

getMembers().then((data) => {
    var options = [{ name: "不指派", code: null }]
    for (const member of data.members) {
        options.push({ name: member.first_name, code: member.member_id })
    }
    memberOptions.value = options
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


</script>