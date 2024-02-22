<template>
    <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="mb-4" />
    <div className="card">
        <h5>{{ perchMount.perch_mount_name }}</h5>
        <div class="grid">
            <div class="col-12 md:col-6">
                <p>Use this page to start from scratch and place your custom content.</p>
            </div>

            <div class="col-12 md:col-6">
                <Location :center="[perchMount.longitude, perchMount.latitude]"
                    :point="[perchMount.longitude, perchMount.latitude]" style="height: 15rem;">
                </Location>
            </div>

        </div>


    </div>



    <div class="card">
        <h5>Sections</h5>
        <DataTable :value="sections" v-model:expandedRows="expandedRows" dataKey="section_id" responsiveLayout="scroll">
            <Column :expander="true" headerStyle="min-width: 3rem" />
            <Column field="check_date" header="Name" :sortable="true">
                <template #body="slotProps">
                    {{ slotProps.data.check_date }}
                </template>
            </Column>
            <Column header="空拍檢查" :sortable="true">
                <template #body="slotProps">
                    50
                </template>
            </Column>
            <Column header="檢查物種" :sortable="true">
                <template #body="slotProps">
                    50
                </template>
            </Column>
            <Column header="獵物辨識" :sortable="true">
                <template #body="slotProps">
                    50
                </template>
            </Column>
            <template #expansion="slotProps">
                <div class="p-3">
                    <!-- <h5>Section {{ slotProps.data.check_date }} Info</h5> -->
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
                        <Column header="回收人員" class="surface-ground">
                            <template #body="slotProps">
                                <p v-for="operator in slotProps.data.operators">
                                    {{ operators[operator].first_name }}
                                </p>
                            </template>
                        </Column>
                        <Column field="note" header="備註" class="surface-ground"></Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>
    </div>
</template>


<script setup>
import { ref, onBeforeMount, watch } from 'vue'
import { useRoute } from 'vue-router'
import Location from '../../components/Location.vue'

import { getPerchMountByID } from '../../service/PerchMounts'
import { getSections } from '../../service/Sections'

const route = useRoute()

const perchMount = ref({})
const project = ref({})
const habitat = ref({})
const members = ref({})
const breadcrumbHome = ref({});
const breadcrumbItems = ref([]);

const sections = ref([])
const operators = ref({})
const cameras = ref({})
const mountTypes = ref({})

const expandedRows = ref([]);



onBeforeMount(() => {
    getPerchMountByID(route.params.perch_mount_id).then((data) => {
        findPerchMount(data)
    })
    getSections(route.params.perch_mount_id).then((data) => {
        findSection(data)
    })
    breadcrumbHome.value = { icon: 'pi pi-home', to: '/' }
})


watch(() => {
    getPerchMountByID(route.params.perch_mount_id).then((data) => {
        findPerchMount(data)
    })
    getSections(route.params.perch_mount_id).then((data) => {
        findSection(data)

    })
})


function findPerchMount(data) {
    perchMount.value = data.perch_mounts
    project.value = data.projects
    habitat.value = data.habitats
    members.value = data.members
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


</script>