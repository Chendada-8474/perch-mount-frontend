<template>
    <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="mb-4" />
    <div className="card">
        <ProgressBar :value="progressing" class="mb-4" style="height: 1rem">
        </ProgressBar>

        <div class="flex justify-content-between flex-wrap mb-4">
            <div>

                <h5>{{ perchMount.perch_mount_name }}</h5>

                <div class="flex flex-row flex-wrap">
                    <Tag class="mr-2" icon="pi pi-info-circle" v-if="perchMount.is_priority" severity="danger" rounded>
                        優先處裡
                    </Tag>
                    <Tag class="mr-2" icon="pi pi-user" v-if="perchMount.claim_by" rounded>
                        {{ member.first_name }}
                    </Tag>
                    <Tag class="mr-2" icon="pi pi-sun" severity="info" rounded>
                        {{ habitat.chinese_name }}
                    </Tag>
                    <Tag class="mr-2" icon="pi pi-times" severity="info" v-if="perchMount.terminated" rounded>
                        已撤收
                    </Tag>
                </div>

            </div>

            <div class="flex flex-row flex-wrap">
                <div v-if="currentUser.is_admin">
                    <Button label="編輯棲架" severity="secondary" icon="pi pi-pencil" class="p-button-rounded p-button-sm m-2"
                        @click="perchMountEditVisible = true" />
                </div>
                <div>
                    <Button v-if="currentUser.user_id == perchMount.claim_by"
                        label="取消認領"
                        severity="warning"
                        icon="pi pi-times"
                        class="p-button-rounded p-button-sm m-2"
                        @click="cancleClaim"
                    />
                    <Button v-else-if="perchMount.claim_by == null"
                        label="認領"
                        severity="warning"
                        icon="pi pi-check"
                        class="p-button-rounded p-button-sm m-2"
                        @click="claim"
                    />
                </div>
                <div v-if="currentUser.is_admin">
                    <Button v-if="!perchMount.terminated" label="撤收棲架" severity="help" icon="pi pi-ban"
                        class="p-button-rounded p-button-sm  m-2" @click="updateTerminate(true)" />
                    <Button v-if="perchMount.terminated" label="恢復棲架" severity="help" icon="pi pi-history"
                        class="p-button-rounded p-button-sm  m-2" @click="updateTerminate(false)" />
                </div>
            </div>
        </div>

        <div class="grid">

            <div class="col-12 md:col-6">
                <div class="grid m-4">

                    <div class="col-12 md:col-4">
                        <Card>
                            <template #content>
                                <p>已完成檔案</p>
                                <h4 class="m-0">{{ numberMedia }}</h4>
                            </template>
                        </Card>
                    </div>
                    <div class="col-12 md:col-4">
                        <Card>
                            <template #content>
                                <p>待空拍檢查檔案</p>
                                <h4 class="m-0">{{ numberEmpty }}</h4>
                                <RouterLink :to="emptyCheckPerchMountUrl(perchMount.perch_mount_id)">
                                    <Button label="去檢查空拍" severity="primary" icon="pi pi-search"
                                        class="p-button p-button-sm mt-4" outlined />
                                </RouterLink>
                            </template>
                        </Card>
                    </div>
                    <div class="col-12 md:col-4">
                        <Card>
                            <template #content>
                                <p>待物種檢視檔案</p>
                                <h4 class="m-0">{{ numberDetected }}</h4>
                                <RouterLink :to="reviewPerchMountUrl(perchMount.perch_mount_id)">
                                    <Button label="去檢視物種" severity="primary" icon="pi pi-eye"
                                        class="p-button p-button-sm mt-4" outlined />
                                </RouterLink>
                            </template>
                        </Card>
                    </div>
                </div>


                <p><span class="font-bold">棲架編號</span>：{{ perchMount.perch_mount_id }}</p>
                <p><span class="font-bold">座標</span>
                    <a :href="`https://www.google.com/maps/search/?api=1&query=${perchMount.latitude}%2C${perchMount.longitude}`"
                        target="_blank">
                        ：{{ perchMount.latitude }}, {{ perchMount.longitude }}
                    </a>
                </p>
                <p><span class="font-bold">認領人</span>：{{ member.first_name }}</p>
                <p><span class="font-bold">計畫</span>：{{ project.name }}</p>
                <p><span class="font-bold">最後一次備註</span>：{{ perchMount.latest_note }}</p>
            </div>

            <div class="col-12 md:col-6">
                <Location :center="[perchMount.longitude, perchMount.latitude]"
                    :point="[perchMount.longitude, perchMount.latitude]" style="height: 100%;">
                </Location>
            </div>

        </div>
    </div>



    <div class="card">
        <h5>Sections</h5>

        <DataTable :value="sections" v-model:expandedRows="expandedRows" dataKey="section_id" responsiveLayout="scroll">
            <Column :expander="true" headerStyle="min-width: 3rem" />
            <Column field="section_id" header="Section ID"></Column>
            <Column field="check_date" header="回收日期" :sortable="true">
                <template #body="slotProps">
                    <router-link :to="sectionUrl(perchMount.project, perchMount.perch_mount_id, slotProps.data.section_id)"
                        rel="noopener">
                        {{ slotProps.data.check_date }}
                    </router-link>
                </template>
            </Column>
            <Column header="回收人員">
                <template #body="slotProps">
                    <p v-for="operator in slotProps.data.operators">
                        {{ operators[operator].first_name }}
                    </p>
                </template>
            </Column>
            <Column header="空拍檢查">
                <template #body="slotProps">
                    <RouterLink :to="`/empty_check?section=${slotProps.data.section_id}`">
                        <Button :label="mediaCount.empty[slotProps.data.section_id]"
                            v-if="mediaCount.empty[slotProps.data.section_id]"
                            class="p-button-secondary p-button-text mr-2 mb-2" />
                    </RouterLink>
                </template>
            </Column>
            <Column header="檢查物種">
                <template #body="slotProps">
                    <RouterLink :to="`/review?section=${slotProps.data.section_id}`">
                        <Button :label="mediaCount.detected[slotProps.data.section_id]"
                            v-if="mediaCount.detected[slotProps.data.section_id]"
                            class="p-button-secondary p-button-text mr-2 mb-2" />
                    </RouterLink>
                </template>
            </Column>
            <Column header="獵物辨識">
                <template #body="slotProps">
                    <Button :label="mediaCount.prey[slotProps.data.section_id]"
                        v-if="mediaCount.prey[slotProps.data.section_id]"
                        class="p-button-secondary p-button-text mr-2 mb-2" />
                </template>
            </Column>
            <Column field="note" header="備註" style="max-width: 10rem;"></Column>
            <template #expansion="slotProps">
                <div class="p-3">

                    <DataTable :value="[slotProps.data]" responsiveLayout="scroll">
                        <Column field="section_id" header="Section ID" class="surface-ground"></Column>
                        <Column field="start_time" header="相機工作開始時間" class="surface-ground"></Column>
                        <Column field="end_time" header="相機工作結束時間" class="surface-ground"></Column>
                        <Column header="棲架類型" class="surface-ground">
                            <template #body="slotProps">
                                {{ mountTypes[slotProps.data.mount_type].name }}
                            </template>
                        </Column>
                        <Column header="相機" class="surface-ground">
                            <template #body="slotProps">
                                {{ cameras[slotProps.data.camera].model_name }}
                            </template>
                        </Column>

                        <Column field="note" header="備註" class="surface-ground"></Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>
    </div>



    <Dialog v-model:visible="perchMountEditVisible" modal header="Edit Profile" :style="{ width: '50rem' }">
        <template #header>
            <div class="inline-flex align-items-center justify-content-center gap-2">
                <span class="font-bold white-space-nowrap">{{ perchMount.perch_mount_name }}</span>
            </div>
        </template>

        <PerchMountEditer @changed="editorChanged" :perchMountID="perchMount.perch_mount_id">
        </PerchMountEditer>

        <template #footer>
            <Button label="Cancel" severity="secondary" @click="perchMountEditVisible = false" autofocus />
            <Button label="Save" severity="primary" @click="updatePerchMount" autofocus />
        </template>
    </Dialog>

    <Toast />
</template>


<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Location from '../../components/Location.vue'
import PerchMountEditer from '../../components/PerchMountEditer.vue'

import { getPerchMountByID, getMediaCount, updatePerchMountByID, cancelClaimPerchMount } from '../../service/PerchMounts'
import { getSections } from '../../service/Sections'

import { me } from '../../service/Me'


const route = useRoute()
const toast = useToast()

const currentUser = ref({})

const perchMount = ref({})
const project = ref({})
const habitat = ref({})
const member = ref({})
const breadcrumbHome = ref({});
const breadcrumbItems = ref([]);

const mediaCount = ref({
    "empty": {},
    "detected": {},
    "media": {},
    "prey": {},
})

const numberEmpty = ref(0)
const numberDetected = ref(0)
const numberMedia = ref(0)

const sections = ref([])
const operators = ref({})
const cameras = ref({})
const mountTypes = ref({})

const expandedRows = ref([]);

const perchMountEditVisible = ref(false)

const progressing = ref(0)

breadcrumbHome.value = { icon: 'pi pi-home', to: '/' }

onMounted(() => {
    refresh()
})

function refresh() {
    me().then(data => {
        currentUser.value = data
    })
    getPerchMountByID(route.params.perch_mount_id).then((data) => {
        findPerchMount(data)
    })
    getSections(route.params.perch_mount_id).then((data) => {
        findSection(data)
    })
    getMediaCount(route.params.perch_mount_id).then(data => {
        mediaCount.value = data
        numberEmpty.value = 0
        numberDetected.value = 0
        numberMedia.value = 0
        for (const [section, count] of Object.entries(data.empty)) {
            numberEmpty.value += count

        }
        for (const [section, count] of Object.entries(data.detected)) {
            numberDetected.value += count

        }
        for (const [section, count] of Object.entries(data.media)) {
            numberMedia.value += count
        }
        progressing.value = Math.round(100 * (numberMedia.value / (numberDetected.value + numberEmpty.value + numberMedia.value)))
    })
}

function findPerchMount(data) {
    perchMount.value = data.perch_mounts
    project.value = data.projects
    habitat.value = data.habitats
    member.value = data.members
    breadcrumbItems.value = [
        { label: project.value.name, to: `/projects/${project.value.project_id}` },
        { label: perchMount.value.perch_mount_name, to: `/projects/${project.value.project_id}/perch_mounts/${perchMount.value.perch_mount_id}` },
    ]
}

function findSection(data) {
    sections.value = data.sections
    operators.value = data.members
    cameras.value = data.cameras
    mountTypes.value = data.mount_types
}

function updatePerchMount() {
    perchMountEditVisible.value = false
}

function claim() {
    updatePerchMountByID(perchMount.value.perch_mount_id, { "claim_by": currentUser.value.user_id })
        .then(data => {
            toast.add({ severity: 'success', summary: '認領成功', detail: perchMount.value.perch_mount_name, life: 3000 });
            refresh()
        }).catch(e => {
            toast.add({ severity: 'error', summary: '認領失敗', detail: e, life: 3000 });
        })
}

function updateTerminate(isTerminated) {
    updatePerchMountByID(perchMount.value.perch_mount_id, { "terminated": isTerminated })
        .then(data => {
            toast.add({ severity: 'success', summary: '變更成功', detail: perchMount.value.perch_mount_name, life: 3000 });
            refresh()
        }).catch(e => {
            toast.add({ severity: 'error', summary: '變更失敗', detail: e, life: 3000 });
        })
}

function editorChanged(updatedPerchMount) {
    console.log(updatedPerchMount)
}

function sectionUrl(project, perchMount, sectionID) {
    return `/projects/${project}/perch_mounts/${perchMount}/sections/${sectionID}`
}

function reviewPerchMountUrl(perchMountID) {
    return `/review?perch_mount=${perchMountID}`
}

function emptyCheckPerchMountUrl(perchMountID) {
    return `/empty_check?perch_mount=${perchMountID}`
}

function cancleClaim() {
    cancelClaimPerchMount(perchMount.value.perch_mount_id)
    .then(data => {
        toast.add({ severity: 'success', summary: '取消成功', detail: perchMount.value.perch_mount_name, life: 3000 });
        refresh()
    })
    .catch(e => {
        toast.add({ severity: 'error', summary: '取消失敗', life: 3000 });
    })
}

</script>

<style></style>