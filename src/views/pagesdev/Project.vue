<template>
    <div className="card">
        <h5>棲架</h5>
    </div>
    <div class="grid p-fluid mt-3">
        <div v-for="perchMount in workingPerchMounts" class="field col-12 md:col-3">
            <Card>

                <template #title>
                    <div class="flex justify-content-between flex-wrap">
                        <NuxtLink to="https://vuejs.org/" target="_blank" rel="noopener" class="">
                            <Button :label="perchMount.perch_mount_name" class="p-button-lg px-1 py-1" text />
                        </NuxtLink>
                        <Button @click="showPerchMountEditor(perchMount.perch_mount_id)" icon="pi pi-pencil"
                            class="p-button-rounded p-button-secondary p-button-text mr-2 mb-2" />
                    </div>
                </template>

                <template #content>
                    <Tag class="mr-2" icon="pi pi-info-circle" v-if="perchMount.is_priority" severity="danger" rounded>優先處裡
                    </Tag>
                    <Tag class="mr-2" icon="pi pi-user" v-if="perchMount.claim_by" rounded>
                        {{ members[perchMount.claim_by].first_name }}
                    </Tag>
                    <Tag class="mr-2" icon="pi pi-sun" severity="info" rounded>
                        {{ habitats[perchMount.habitat].chinese_name }}
                    </Tag>
                    <p class="m-0">
                        {{ perchMount.latest_note }}
                    </p>
                </template>
            </Card>
        </div>

        <div v-for="perchMount in terminatedPerchMounts" class="field col-12 md:col-3">
            <Card>
                <template #title>
                    <div class="flex justify-content-between flex-wrap">
                        <NuxtLink to="https://vuejs.org/" target="_blank" rel="noopener" class="">
                            <Button :label="perchMount.perch_mount_name" class="p-button-lg p-button-secondary px-1" text />
                        </NuxtLink>
                        <div class="flex flex-row flex-wrap">
                            <Button @click="showPerchMountEditor(perchMount.perch_mount_id)" icon="pi pi-pencil"
                                class="p-button-rounded p-button-secondary p-button-text mr-2 mb-2" />
                        </div>
                    </div>
                </template>
                <template #content>
                    <Tag class="mr-2" icon="pi pi-user" value="Primary" v-if="perchMount.claim_by" rounded>
                        {{ members[perchMount.claim_by].first_name }}
                    </Tag>
                    <Tag class="mr-2" icon="pi pi-sun" severity="info" rounded>
                        {{ habitats[perchMount.habitat].chinese_name }}
                    </Tag>
                    <p class=" m-0">
                        {{ perchMount.latest_note }}
                    </p>
                </template>
            </Card>
        </div>
    </div>

    <Dialog v-model:visible="perchMountEditor.visible" modal header="Edit Profile" :style="{ width: '50rem' }">
        <template #header>
            <div class="inline-flex align-items-center justify-content-center gap-2">
                <span class="font-bold white-space-nowrap">{{ perchMountEditor.perchMountName }}</span>
            </div>
        </template>

        <div class="grid">
            <div class="col-12 md:col-6">
                <span class="p-text-secondary block mb-5">編輯棲架資訊</span>
                <div class="flex align-items-center gap-3 mb-3">
                    <label for="latitude" class="font-semibold w-6rem">緯度</label>
                    <InputNumber id="latitude" v-model="perchMountEditor.latitude" inputId="minmaxfraction"
                        :minFractionDigits="3" :maxFractionDigits="6" />
                </div>
                <div class="flex align-items-center gap-3 mb-2">
                    <label for="longitude" class="font-semibold w-6rem">經度</label>
                    <InputNumber id="longitude" v-model="perchMountEditor.longitude" inputId="minmaxfraction"
                        :minFractionDigits="3" :maxFractionDigits="6" />
                </div>
                <div class="flex align-items-center gap-3 mb-3">
                    <label for="project" class="font-semibold w-6rem">計畫</label>
                    <Dropdown id="project" v-model="perchMountEditor.project" :options="projectOptions" optionLabel="name"
                        optionValue="code" placeholder="Select a Project" class="w-full md:w-14rem" />
                </div>
                <div class="flex align-items-center gap-3 mb-3">
                    <label for="habitat" class="font-semibold w-6rem">棲地</label>
                    <Dropdown id="habitat" v-model="perchMountEditor.habitat" :options="habitatOptions" optionLabel="name"
                        optionValue="code" placeholder="Select a Habitat" class="w-full md:w-14rem" />
                </div>
                <div class="flex align-items-center gap-3 mb-3">
                    <label for="layer" class="font-semibold w-6rem">分層</label>
                    <Dropdown id="layer" v-model="perchMountEditor.layer" :options="layerOptions" optionLabel="name"
                        optionValue="code" placeholder="Select a Habitat" class="w-full md:w-14rem" />
                </div>
                <div class="flex align-items-center gap-3 mb-3">
                    <label for="claim_by" class="font-semibold w-6rem">指派認領</label>
                    <Dropdown id="claim_by" v-model="perchMountEditor.claimBy" :options="memberOptions" optionLabel="name"
                        optionValue="code" placeholder="Select a Member" class="w-full md:w-14rem" />
                </div>
                <div class="flex align-items-center gap-3 mb-3">
                    <ToggleButton v-model="perchMountEditor.isPriority" onLabel="優先處裡" offLabel="優先處裡"
                        onIcon="pi pi-check-circle" offIcon="pi pi-circle" class="w-9rem" />
                </div>
            </div>
            <div class="col-12 md:col-6">
                <Location :center="[perchMountEditor.longitude, perchMountEditor.latitude]"
                    :point="[perchMountEditor.longitude, perchMountEditor.latitude]">
                </Location>
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" severity="secondary" @click="perchMountEditor.visible = false" autofocus />
            <Button label="Save" severity="primary" @click="updatePerchMount" autofocus />
        </template>
    </Dialog>

    <Toast />
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast';
import Location from '../../components/Location.vue'

import { getPerchMounts, getPerchMountByID } from '../../service/PerchMounts'
import { getProjects } from '../../service/Projects'
import { getMembers } from '../../service/Members'
import { getHabitats } from '../../service/Habitats'
import { getLayers } from '../../service/Layers'

const route = useRoute()
const terminatedPerchMounts = ref(null)
const workingPerchMounts = ref(null)
const projects = ref(null)
const habitats = ref(null)
const members = ref(null)

const toast = useToast()

onBeforeMount(() => {
    console.log(route.params.project_id)
    getPerchMounts(route.params.project_id).then((data) => {
        findResources(data)
    })
})

watch(() => {
    getPerchMounts(route.params.project_id).then((data) => {
        findResources(data)
    })
})

function findResources(perchMountBody) {
    terminatedPerchMounts.value = perchMountBody.perch_mounts.filter(perch_mount => perch_mount.terminated)
    workingPerchMounts.value = perchMountBody.perch_mounts.filter(perch_mount => !perch_mount.terminated)
    projects.value = perchMountBody.projects
    habitats.value = perchMountBody.habitats
    members.value = perchMountBody.members
}


const habitatOptions = ref(null)
const projectOptions = ref(null)
const memberOptions = ref()
const layerOptions = ref()
const perchMountEditor = ref(
    {
        visible: false,
        perchMountName: "",
        longitude: null,
        latitude: null,
        habitat: null,
        project: null,
        layer: null,
        claimBy: null,
        isPriority: null
    }
)

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


function showPerchMountEditor(perchMountID) {
    getPerchMountByID(perchMountID).then((data) => {
        console.log(data)
        perchMountEditor.value.visible = true
        perchMountEditor.value.perchMountName = data.perch_mounts.perch_mount_name
        perchMountEditor.value.longitude = data.perch_mounts.longitude
        perchMountEditor.value.latitude = data.perch_mounts.latitude
        perchMountEditor.value.project = data.perch_mounts.project
        perchMountEditor.value.layer = data.perch_mounts.layer
        perchMountEditor.value.habitat = data.perch_mounts.habitat
        perchMountEditor.value.claimBy = data.perch_mounts.claim_by
        perchMountEditor.value.isPriority = data.perch_mounts.is_priority
    })
}

function updatePerchMount() {
    perchMountEditor.value.visible = false
    toast.add({ severity: 'success', summary: '棲架變更成功', detail: perchMountEditor.value.perchMountName, life: 3000 });
}

</script>


<style>
.p-button {
    text-align: left;
}
</style>