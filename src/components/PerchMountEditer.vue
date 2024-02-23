<template>
    <div class="grid">
        <div class="col-12 md:col-6">
            <span class="p-text-secondary block mb-5">編輯棲架資訊</span>
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
                <label for="project" class="font-semibold w-6rem">計畫</label>
                <Dropdown id="project" v-model="perchMountEditer.project" :options="projectOptions" optionLabel="name"
                    optionValue="code" placeholder="Select a Project" @change="editorChanged" class="w-full" />
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
            <div class="flex align-items-center gap-3 mb-3">
                <label for="claim_by" class="font-semibold w-6rem">指派認領</label>
                <Dropdown id="claim_by" v-model="perchMountEditer.claimBy" :options="memberOptions" optionLabel="name"
                    optionValue="code" placeholder="Select a Member" @change="editorChanged" class="w-full" />
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
import { ref, watch } from 'vue'

import Location from './Location.vue'

import { getProjects } from '../service/Projects'
import { getMembers } from '../service/Members'
import { getHabitats } from '../service/Habitats'
import { getLayers } from '../service/Layers'
import { getPerchMountByID } from '../service/PerchMounts'


const emit = defineEmits()

const habitatOptions = ref()
const projectOptions = ref()
const memberOptions = ref()
const layerOptions = ref()
const perchMountEditer = ref({})

const localVisible = ref(false)

const props = defineProps({
    visible: { type: Boolean, default: false },
    perchMountID: { type: Number, default: null },
})

watch(() => {
    getPerchMountByID(props.perchMountID).then((data) => {
        findPerchMountEditer(data)
    })
    localVisible.value = props.visible
})


function findPerchMountEditer(data) {
    perchMountEditer.value.perchMountName = data.perch_mounts.perch_mount_name
    perchMountEditer.value.latitude = data.perch_mounts.latitude
    perchMountEditer.value.longitude = data.perch_mounts.longitude
    perchMountEditer.value.project = data.perch_mounts.project
    perchMountEditer.value.habitat = data.perch_mounts.habitat
    perchMountEditer.value.layer = data.perch_mounts.layer
    perchMountEditer.value.claimBy = data.perch_mounts.claim_by
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

function editorChanged() {
    emit("changed", perchMountEditer.value)
}



</script>