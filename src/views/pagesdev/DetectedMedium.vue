<template>
    <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="mb-4" />
    <div class="card">
        <h5>{{ medium.detected_medium_id }}</h5>
        <div class="grid">
            <div class="col-6">
                <Image v-if="medium.is_image" :src="medium.s3_path" alt="Image" width="100%" preview loading="lazy" />
                <video v-if="!medium.is_image" :src="getVideoEndpoint(medium.base32_path)" width="100%" loading="lazy"
                    controls></video>
            </div>
            <div class="col-6">
                <h6>AI 辨識物種</h6>
                <DataTable :value="medium.individuals" size="small">
                    <Column field="taxon_order_by_ai" header="Taxon Order"></Column>
                    <Column header="物種">
                        <template #body="slotProps">
                            {{ species[slotProps.data.taxon_order_by_ai].chinese_common_name }}
                        </template>
                    </Column>
                    <Column field="xmin" header="xmin"></Column>
                    <Column field="xmax" header="xmax"></Column>
                    <Column field="ymin" header="ymin"></Column>
                    <Column field="ymax" header="ymax"></Column>
                </DataTable>
                <p class="my-3 text-300">{{ medium.path }}</p>
                <p class="my-3 text-300">{{ medium.medium_datetime }}</p>
            </div>
        </div>
    </div>
</template>



<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { getProjectByID } from '../../service/Projects'
import { getPerchMountByID } from '../../service/PerchMounts'
import { getSectionByID } from '../../service/Sections'
import { getDetectedMediumByID } from '../../service/DetectedMedia'

import { getVideoEndpoint } from '../../service/utils/video'

const route = useRoute()
const project = ref({})
const perchMount = ref({})
const section = ref({})
const medium = ref({})

const species = ref({})

const breadcrumbHome = ref()
const breadcrumbItems = ref([])

breadcrumbHome.value = { icon: 'pi pi-home', to: '/' }
const projectUrl = `/projects/${route.params.project_id}`
const perchMountUrl = `${projectUrl}/perch_mounts/${route.params.perch_mount_id}`
const sectionUrl = `${perchMountUrl}/sections/${route.params.section_id}`
const emptyMediumUrl = `${perchMountUrl}/sections/${route.params.section_id}/detected_media/${route.params.detected_medium_id}`

breadcrumbItems.value = [
    { label: null, to: projectUrl },
    { label: null, to: perchMountUrl },
    { label: null, to: sectionUrl },
    { label: null, to: emptyMediumUrl },
]

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
    breadcrumbItems.value[2].label = data.check_date
})


getDetectedMediumByID(route.params.detected_medium_id).then(data => {
    medium.value = data
    species.value = data.species
    breadcrumbItems.value[3].label = medium.value.detected_medium_id

})


</script>