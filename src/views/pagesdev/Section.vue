<template>
    <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="mb-4" />
    <div className="card">
        <h5>Section {{ section.check_date }}</h5>
        <p>Use this page to start from scratch and place your custom content.</p>
    </div>
    <div class="card">
        <h5>影像</h5>
        <TabView>
            <TabPanel header="已完成影像">

            </TabPanel>

            <TabPanel header="待物種檢視">
                <DataTable v-model:expandedRowGroups="expandedRowGroups" :value="detectedMedia"
                    tableStyle="min-width: 50rem" expandableRowGroups rowGroupMode="subheader" groupRowsBy="medium_date"
                    sortMode="single" sortField="medium_date" :sortOrder="1">
                    <template #groupheader="slotProps">
                        <span class="vertical-align-middle ml-2 font-bold line-height-3">{{
                            slotProps.data.medium_date }}</span>
                    </template>
                    <Column field="detected_medium_id" header="Medium ID"></Column>
                    <Column field="medium_datetime" header="拍攝時間"></Column>
                </DataTable>
            </TabPanel>
            <TabPanel header="待空拍檢查">
                <p class="line-height-3 m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                    ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
                    id est
                    laborum.
                </p>
            </TabPanel>
        </TabView>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import moment from 'moment'

import { getProjectByID } from '../../service/Projects'
import { getPerchMountByID } from '../../service/PerchMounts'
import { getSectionByID } from '../../service/Sections'
import { getDetectedMedia } from '../../service/DetectedMedia'

const route = useRoute()

const breadcrumbHome = ref()
const breadcrumbItems = ref([])

const project = ref({})
const perchMount = ref({})
const section = ref({})

const detectedMedia = ref([])
const expandedRowGroups = ref()

onBeforeMount(() => {
    breadcrumbHome.value = { icon: 'pi pi-home', to: '/' }
    const projectUrl = `/projects/${route.params.project_id}`
    const perchMountUrl = `${projectUrl}/perch_mounts/${route.params.perch_mount_id}`
    const sectionUrl = `${perchMountUrl}/sections/${route.params.section_id}`
    breadcrumbItems.value = [
        { label: null, to: projectUrl },
        { label: null, to: perchMountUrl },
        { label: null, to: sectionUrl },
    ]

    getProjectByID(route.params.project_id).then((data) => {
        project.value = data
        breadcrumbItems.value[0].label = data.name
    })
    getPerchMountByID(route.params.perch_mount_id).then((data) => {
        perchMount.value = data
        breadcrumbItems.value[1].label = data.perch_mounts.perch_mount_name
    })
    getSectionByID(route.params.section_id).then((data) => {
        section.value = data
        breadcrumbItems.value[2].label = data.check_date
    })
    getDetectedMedia(null, route.params.section_id, null, 20000).then((data) => {
        detectedMedia.value = data.media
        for (var medium of detectedMedia.value) {
            medium.medium_date = moment(medium.medium_datetime).format("YYYY-MM-DD")
        }
    })
})
</script>