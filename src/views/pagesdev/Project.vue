<template>
    <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="mb-4" />
    <div className="card">
        <div class="flex justify-content-between flex-wrap mb-4">
            <h5>棲架</h5>
            <Button label="新增棲架" @click="newPerchMount.visible = true" icon="pi pi-plus"
                class="p-button-rounded p-button-sm m-2" />
        </div>
    </div>
    <div class="grid p-fluid mt-3">
        <div v-for="perchMount in workingPerchMounts" class="field col-12 md:col-3">
            <Card class="h-full">

                <template #title>
                    <div class="flex justify-content-between flex-wrap">
                        <router-link :to="perchMountUrl(perchMount.project, perchMount.perch_mount_id)" rel="noopener"
                            class="">
                            <Button :label="perchMount.perch_mount_name" class="p-button-lg px-1 py-0" text />
                        </router-link>
                        <Button @click="showPerchMountEditor(perchMount.perch_mount_id)" icon="pi pi-pencil"
                            class="p-button-rounded p-button-secondary p-button-text mr-2" />
                    </div>
                    <Tag class="mr-2" icon="pi pi-info-circle" v-if="perchMount.is_priority" severity="danger" rounded>優先處裡
                    </Tag>
                    <Tag class="mr-2" icon="pi pi-user" v-if="perchMount.claim_by" rounded>
                        {{ members[perchMount.claim_by].first_name }}
                    </Tag>
                    <Tag class="mr-2" icon="pi pi-sun" severity="info" rounded>
                        {{ habitats[perchMount.habitat].chinese_name }}
                    </Tag>
                </template>

                <template #content>
                    <div
                        class="surface-overlay white-space-nowrap overflow-hidden text-overflow-ellipsis text-color-secondary">
                        {{ perchMount.latest_note }}
                    </div>
                </template>
            </Card>
        </div>

        <div v-for="perchMount in terminatedPerchMounts" class="field col-12 md:col-3">
            <Card class="h-full">
                <template #title>
                    <div class="flex justify-content-between flex-wrap">
                        <router-link :to="perchMountUrl(perchMount.project, perchMount.perch_mount_id)" rel="noopener"
                            class="">
                            <Button :label="perchMount.perch_mount_name" class="p-button-lg p-button-secondary px-1 py-0"
                                text />
                        </router-link>

                        <Button @click="showPerchMountEditor(perchMount.perch_mount_id)" icon="pi pi-pencil"
                            class="p-button-rounded p-button-secondary p-button-text mr-2 mb-2" />

                    </div>
                    <Tag class="mr-2" icon="pi pi-user" value="Primary" v-if="perchMount.claim_by" rounded>
                        {{ members[perchMount.claim_by].first_name }}
                    </Tag>
                    <Tag class="mr-2" icon="pi pi-sun" severity="info" rounded>
                        {{ habitats[perchMount.habitat].chinese_name }}
                    </Tag>
                </template>
                <template #content>
                    <div
                        class="surface-overlay white-space-nowrap overflow-hidden text-overflow-ellipsis text-color-secondary">
                        {{ perchMount.latest_note }}
                    </div>
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

        <PerchMountEditer @changed="editorChanged" :perchMountID="perchMountEditor.perchMountID">
        </PerchMountEditer>

        <template #footer>
            <Button label="Cancel" severity="secondary" @click="perchMountEditor.visible = false" autofocus />
            <Button label="Save" severity="primary" @click="updatePerchMountClicked" autofocus />
        </template>
    </Dialog>

    <Dialog v-model:visible="newPerchMount.visible" modal header="新增棲架" :style="{ width: '50rem' }">
        <template #header>
            <div class="inline-flex align-items-center justify-content-center gap-2">
                <span class="font-bold white-space-nowrap">新增棲架</span>
            </div>
        </template>

        <NewPerchMountEditer @changed="newPerchMountChanged"></NewPerchMountEditer>

        <template #footer>
            <Button label="Cancel" severity="secondary" @click="newPerchMount.visible = false" autofocus />
            <Button label="Add" severity="primary" @click="addPerchMountClicked" autofocus />
        </template>
    </Dialog>

    <Toast />
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast';
import PerchMountEditer from '../../components/PerchMountEditer.vue'
import NewPerchMountEditer from '../../components/NewPerchMountEditer.vue'

import { getPerchMounts, updatePerchMountByID, addPerchMount } from '../../service/PerchMounts'
import { getProjectByID } from '../../service/Projects'

const route = useRoute()
const toast = useToast()

const terminatedPerchMounts = ref(null)
const workingPerchMounts = ref(null)

const projects = ref(null)
const habitats = ref(null)
const members = ref(null)

const breadcrumbHome = ref({});
const breadcrumbItems = ref([]);

onBeforeMount(() => {
    getPerchMounts(route.params.project_id).then((data) => {
        findResources(data)
    })
    getProjectByID(route.params.project_id).then((data) => {
        findBreadcrumb(data)
    })
    breadcrumbHome.value = { icon: 'pi pi-home', to: '/' }
})

watch(() => {
    getPerchMounts(route.params.project_id).then((data) => {
        findResources(data)
    })
    getProjectByID(route.params.project_id).then((data) => {
        findBreadcrumb(data)
    })
})

function findResources(perchMountsBody) {
    terminatedPerchMounts.value = perchMountsBody.perch_mounts.filter(perch_mount => perch_mount.terminated)
    workingPerchMounts.value = perchMountsBody.perch_mounts.filter(perch_mount => !perch_mount.terminated)
    projects.value = perchMountsBody.projects
    habitats.value = perchMountsBody.habitats
    members.value = perchMountsBody.members
}

function findBreadcrumb(data) {
    breadcrumbItems.value = [
        { label: data.name, to: `/projects/${data.project_id}` },
    ]

}

function refresh() {
    getPerchMounts(route.params.project_id).then((data) => {
        findResources(data)
    })
}

const perchMountEditor = ref(
    {
        visible: false,
        perchMountID: null,
        latitude: null,
        longitude: null,
        project: null,
        habitat: null,
        layer: null,
        claimBy: null,
    }
)


function showPerchMountEditor(perchMountID) {
    perchMountEditor.value.visible = true
    perchMountEditor.value.perchMountID = perchMountID
}

function updatePerchMountClicked() {
    if (!isPerchMountEditerValid()) {
        toast.add({ severity: 'warn', summary: '新增失敗', detail: '棲架資料沒填完欸', life: 3000 });
        return
    }
    perchMountEditor.value.visible = false
    updatePerchMountByID(perchMountEditor.value.perchMountID, {
        latitude: perchMountEditor.value.latitude,
        longitude: perchMountEditor.value.longitude,
        project: perchMountEditor.value.project,
        habitat: perchMountEditor.value.habitat,
        layer: perchMountEditor.value.layer,
        claim_by: perchMountEditor.value.claimBy,
    })
        .then((data) => {
            toast.add({ severity: 'success', summary: '棲架變更成功', detail: perchMountEditor.value.perchMountName, life: 3000 })
            refresh()
        })
        .catch((e) => {
            toast.add({ severity: 'error', summary: '棲架變更失敗', detail: e, life: 3000 })
        })
}


const perchMountUrl = (project, perchMount) => {
    return `/projects/${project}/perch_mounts/${perchMount}`
}

function editorChanged(changedPerchMount) {
    perchMountEditor.value.latitude = changedPerchMount.latitude
    perchMountEditor.value.longitude = changedPerchMount.longitude
    perchMountEditor.value.project = changedPerchMount.project
    perchMountEditor.value.habitat = changedPerchMount.habitat
    perchMountEditor.value.layer = changedPerchMount.layer
    perchMountEditor.value.claimBy = changedPerchMount.claimBy
}

function isPerchMountEditerValid() {
    return !(!perchMountEditor.value.latitude || !perchMountEditor.value.longitude || !perchMountEditor.value.habitat || !perchMountEditor.value.project)
}

const newPerchMount = ref({
    visible: false,
    perchMountName: null,
    latitude: null,
    longitude: null,
    project: route.params.project_id,
    habitat: null,
    layer: null,
})

function newPerchMountChanged(emitedNewPerchMount) {
    newPerchMount.value.perchMountName = emitedNewPerchMount.perchMountName
    newPerchMount.value.latitude = emitedNewPerchMount.latitude
    newPerchMount.value.longitude = emitedNewPerchMount.longitude
    newPerchMount.value.habitat = emitedNewPerchMount.habitat
    newPerchMount.value.layer = emitedNewPerchMount.layer
}

function addPerchMountClicked() {

    if (!isNewPerchMountValid()) {
        toast.add({ severity: 'warn', summary: '新增失敗', detail: '棲架資料沒填完欸', life: 3000 });
        return
    }
    newPerchMount.value.visible = false
    addPerchMount({
        perch_mount_name: newPerchMount.value.perchMountName,
        latitude: newPerchMount.value.latitude,
        longitude: newPerchMount.value.longitude,
        project: newPerchMount.value.project,
        habitat: newPerchMount.value.habitat,
        layer: newPerchMount.value.layer,
    }).then((data) => {
        toast.add({ severity: 'success', summary: '棲架新增成功', detail: newPerchMount.value.perchMountName, life: 3000 })
        refresh()
    }).catch((e) => {
        toast.add({ severity: 'error', summary: '棲架新增失敗', detail: e, life: 3000 })
    })
}

function isNewPerchMountValid() {
    return !(!newPerchMount.value.perchMountName || !newPerchMount.value.latitude || !newPerchMount.value.longitude || !newPerchMount.value.habitat)
}




</script>


<style>
.p-button {
    text-align: left;
}
</style>