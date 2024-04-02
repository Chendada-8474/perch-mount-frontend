<template>
    <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="mb-4" />
    <div className="card">
        <div class="flex justify-content-between flex-wrap mb-4">
            <h5>Section {{ section.check_date }}</h5>
            <SplitButton label="編輯" :model="editItems" />
        </div>
        <div class="grid">
            <div class="col-12 md:col-4">
                <p><span class="font-bold">Section ID：</span>{{ section.section_id }}</p>
                <p><span class="font-bold">計畫：</span>{{ project.name }}</p>
                <p><span class="font-bold">棲架：</span>{{ perchMount.perch_mount_name }}</p>
            </div>
            <div class="col-12 md:col-4">
                <p><span class="font-bold">回收日期：</span>{{ section.check_date }}</p>
                <p><span class="font-bold">工作開始時間：</span>{{ section.start_time }}</p>
                <p><span class="font-bold">工作結束時間：</span>{{ section.end_time }}</p>
            </div>
            <div class="col-12 md:col-4">
                <p><span class="font-bold">相機：</span>{{ camera.model_name }}</p>
                <p>
                    <span class="font-bold">回收人員：</span>
                    {{ memberStringList(section.operators, "first_name") }}
                </p>
                <p><span class="font-bold">備註：</span>{{ section.note }}</p>
            </div>
        </div>
    </div>
    <div class="card">
        <h5>影像</h5>
        <TabView>
            <TabPanel :header="`已完成影像 (${media.length})`">
                <DataTable v-model:expandedRowGroups="expandedRowGroups" :value="media" tableStyle="min-width: 50rem"
                    expandableRowGroups rowGroupMode="subheader" groupRowsBy="medium_date" sortMode="single"
                    sortField="medium_date" :sortOrder="1">
                    <template #groupheader="slotProps">
                        <span class="vertical-align-middle ml-2 font-bold line-height-3">{{
                            slotProps.data.medium_date }}</span>
                    </template>
                    <Column field="medium_id" header="Medium ID">
                        <template #body="slotProps">
                            <router-link
                                :to="mediumUrl(perchMount.project, perchMount.perch_mount_id, slotProps.data.section, slotProps.data.medium_id)"
                                rel="noopener">
                                {{ slotProps.data.medium_id }}
                            </router-link>
                        </template>
                    </Column>
                    <Column field="medium_datetime" header="拍攝時間"></Column>
                </DataTable>
            </TabPanel>

            <TabPanel :header="`待物種檢視 (${detectedMedia.length})`">
                <DataTable v-model:expandedRowGroups="expandedRowGroups" :value="detectedMedia"
                    tableStyle="min-width: 50rem" expandableRowGroups rowGroupMode="subheader" groupRowsBy="medium_date"
                    sortMode="single" sortField="medium_date" :sortOrder="1">
                    <template #groupheader="slotProps">
                        <span class="vertical-align-middle ml-2 font-bold line-height-3">{{
                            slotProps.data.medium_date }}</span>
                    </template>
                    <Column field="detected_medium_id" header="Medium ID">
                        <template #body="slotProps">
                            <router-link
                                :to="detectedMediumUrl(perchMount.project, perchMount.perch_mount_id, slotProps.data.section, slotProps.data.detected_medium_id)"
                                rel="noopener">
                                {{ slotProps.data.detected_medium_id }}
                            </router-link>
                        </template>
                    </Column>
                    <Column field="medium_datetime" header="拍攝時間"></Column>
                </DataTable>
            </TabPanel>
            <TabPanel :header="`待空拍檢查 (${emptyMedia.length})`">
                <DataTable v-model:expandedRowGroups="expandedRowGroups" :value="emptyMedia" tableStyle="min-width: 50rem"
                    expandableRowGroups rowGroupMode="subheader" groupRowsBy="medium_date" sortMode="single"
                    sortField="medium_date" :sortOrder="1">
                    <template #groupheader="slotProps">
                        <span class="vertical-align-middle ml-2 font-bold line-height-3">{{
                            slotProps.data.medium_date }}</span>
                    </template>
                    <Column field="empty_medium_id" header="Medium ID">
                        <template #body="slotProps">
                            <router-link
                                :to="emptyMediumUrl(perchMount.project, perchMount.perch_mount_id, slotProps.data.section, slotProps.data.empty_medium_id)"
                                rel="noopener">
                                {{ slotProps.data.empty_medium_id }}
                            </router-link>
                        </template>
                    </Column>
                    <Column field="medium_datetime" header="拍攝時間"></Column>
                </DataTable>
            </TabPanel>
        </TabView>
    </div>

    <Dialog v-model:visible="timeShiftEditor.visible" modal header="請選擇新的開始時間" :style="{ width: '20rem' }">
        <div class="gird">
            <div class="col-12 flex flex-column gap-2">
                <label for="start_time">開始時間</label>
                <Calendar id="start_time" v-model="timeShiftEditor.newStartTime" showTime hourFormat="24" @date-select=""
                    aria-describedby="start-time-help" />
            </div>
        </div>
        <template #footer>
            <Button label="Cancel" severity="secondary" @click="timeShiftEditor.visible = false" autofocus />
            <Button label="Save" severity="primary" @click="shiftSectionTimeClicked" autofocus />
        </template>
    </Dialog>
    <Toast />
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import moment from 'moment'

import { getProjectByID } from '../../service/Projects'
import { getPerchMountByID } from '../../service/PerchMounts'
import { getSectionByID } from '../../service/Sections'
import { getMedia } from '../../service/Media'
import { getDetectedMedia } from '../../service/DetectedMedia'
import { getEmptyMedia } from '../../service/EmptyMedia'
import { shiftSectionTime } from '../../service/toolapi/shiftSectionTime'
import Toast from 'primevue/toast'

const toast = useToast()
const route = useRoute()

const breadcrumbHome = ref()
const breadcrumbItems = ref([])

const project = ref({})
const perchMount = ref({})
const section = ref({})
const camera = ref({})

const media = ref([])
const detectedMedia = ref([])
const emptyMedia = ref([])
const expandedRowGroups = ref()

const timeShiftEditor = ref({
    visible: false,
    newStartTime: null
})

breadcrumbHome.value = { icon: 'pi pi-home', to: '/' }
const projectUrl = `/projects/${route.params.project_id}`
const perchMountUrl = `${projectUrl}/perch_mounts/${route.params.perch_mount_id}`
const sectionUrl = `${perchMountUrl}/sections/${route.params.section_id}`
breadcrumbItems.value = [
    { label: null, to: projectUrl },
    { label: null, to: perchMountUrl },
    { label: null, to: sectionUrl },
]

const editItems = ref([
    {
        label: 'Shift Time',
        command: () => {
            timeShiftEditor.value.visible = true
        }
    },
])

getProjectByID(route.params.project_id).then((data) => {
    project.value = data
    breadcrumbItems.value[0].label = data.name
})
getPerchMountByID(route.params.perch_mount_id).then((data) => {
    perchMount.value = data.perch_mounts
    breadcrumbItems.value[1].label = data.perch_mounts.perch_mount_name
})
getSectionByID(route.params.section_id).then((data) => {
    section.value = data
    camera.value = data.camera
    breadcrumbItems.value[2].label = data.check_date
})
getDetectedMedia(null, route.params.section_id, null, 20000).then((data) => {
    detectedMedia.value = data.media
    for (var medium of detectedMedia.value) {
        medium.medium_date = formatMediumDate(medium.medium_datetime)
    }
})
getEmptyMedia(null, route.params.section_id, null, 20000).then(data => {
    emptyMedia.value = data.media
    for (const medium of emptyMedia.value) {
        medium.medium_date = formatMediumDate(medium.medium_datetime)
    }
})
getMedia(null, route.params.section_id, null, 20000).then(data => {
    media.value = data.media
    for (const medium of media.value) {
        medium.medium_date = formatMediumDate(medium.medium_datetime)
    }
})

function formatMediumDate(isoDatetime) {
    return moment(isoDatetime).format("YYYY-MM-DD")
}

const memberStringList = (operators, field) => {
    if (!operators) {
        return ""
    }
    var members = []
    for (const [memberID, operator] of Object.entries(operators)) {
        members.push(operator[field])
    }
    return members.join(", ")
}


function mediumUrl(project, perchMount, sectionID, mediumID) {
    return `/projects/${project}/perch_mounts/${perchMount}/sections/${sectionID}/media/${mediumID}`
}
function detectedMediumUrl(project, perchMount, sectionID, detectedMediumID) {
    return `/projects/${project}/perch_mounts/${perchMount}/sections/${sectionID}/detected_media/${detectedMediumID}`
}
function emptyMediumUrl(project, perchMount, sectionID, emptyMediumID) {
    return `/projects/${project}/perch_mounts/${perchMount}/sections/${sectionID}/empty_media/${emptyMediumID}`
}


function shiftSectionTimeClicked() {
    if (!timeShiftEditor.value.newStartTime) {
        toast.add({ severity: 'warn', summary: '還沒填時間欸', life: 3000 });
        return
    }
    console.log(timeShiftEditor.value.newStartTime.toISOString())
    shiftSectionTime(route.params.section_id, timeShiftEditor.value.newStartTime.toISOString()).then(data => {
        toast.add({ severity: 'success', summary: '時間變更成功', detail: `新的開始時間：${timeShiftEditor.value.newStartTime}`, life: 3000 });
    }).catch(e => {
        toast.add({ severity: 'error', summary: '變更失敗', detail: e, life: 3000 });
    })
}

</script>