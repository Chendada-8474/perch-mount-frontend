<template>
    <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="mb-4" />
    <div className="card">
        <h5>棲架</h5>
    </div>
    <div class="grid p-fluid mt-3">
        <div v-for="perchMount in workingPerchMounts" class="field col-12 md:col-3">
            <Card>

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
                        <router-link :to="perchMountUrl(perchMount.project, perchMount.perch_mount_id)" rel="noopener"
                            class="">
                            <Button :label="perchMount.perch_mount_name" class="p-button-lg p-button-secondary px-1" text />
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

        <PerchMountEditer @changed="editorChanged" :perchMountID="perchMountEditor.perchMountID">
        </PerchMountEditer>

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
import PerchMountEditer from '../../components/PerchMountEditer.vue'

import { getPerchMounts } from '../../service/PerchMounts'
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

const perchMountEditor = ref(
    {
        visible: false,
        perchMountID: null,
    }
)


function showPerchMountEditor(perchMountID) {
    perchMountEditor.value.visible = true
    perchMountEditor.value.perchMountID = perchMountID
}

function updatePerchMount() {
    perchMountEditor.value.visible = false
    toast.add({ severity: 'success', summary: '棲架變更成功', detail: perchMountEditor.value.perchMountName, life: 3000 });
}


const perchMountUrl = (project, perchMount) => {
    return `/projects/${project}/perch_mounts/${perchMount}`
}

function editorChanged(test) {
    console.log(test)
}

</script>


<style>
.p-button {
    text-align: left;
}
</style>