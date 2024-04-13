<template>
    <div className="card">
        <h5>資料下載</h5>

    </div>

    <div class="card">
        <div class="flex flex-wrap justify-content-between mb-5">
            <h5>資料預覽</h5>
            <div>
                <Button class="mr-4" label="篩選條件" icon="pi pi-filter" @click="filter.visible = true" />
                <Button class="mr-4" label="輸出資料" icon="pi pi-file-export" @click="exportClicked" />

            </div>
        </div>
        <div>
            <DataTable :value="previewData" scrollable tableStyle="min-width: 50rem">
                <Column field="project" header="project"></Column>
                <Column field="perch_mount_name" header="perch_mount_name"></Column>
                <Column field="chinese_common_name_by_human" header="chinese_common_name_by_human"></Column>
                <Column field="scientific_name_by_human" header="scientific_name_by_human"></Column>
                <Column field="taxon_order_by_human" header="taxon_order_by_human"></Column>
                <Column field="chinese_common_name_by_ai" header="chinese_common_name_by_ai"></Column>
                <Column field="scientific_name_by_ai" header="scientific_name_by_ai"></Column>
                <Column field="taxon_order_by_ai" header="taxon_order_by_ai"></Column>
                <Column field="habitat" header="habitat"></Column>
                <Column field="latitude" header="latitude"></Column>
                <Column field="longitude" header="longitude"></Column>
                <Column field="mount_type" header="mount_type"></Column>
                <Column field="camera" header="camera"></Column>
                <Column field="medium_datetime" header="medium_datetime"></Column>
                <Column field="prey" header="prey"></Column>
                <Column field="prey_name" header="prey_name"></Column>
                <Column field="ring_number" header="ring_number"></Column>
                <Column field="xmax" header="xmax"></Column>
                <Column field="xmin" header="xmin"></Column>
                <Column field="ymax" header="ymax"></Column>
                <Column field="ymin" header="ymin"></Column>
            </DataTable>

        </div>
    </div>

    <Sidebar v-model:visible="filter.visible" header="Sidebar">
        <div class="flex flex-column gap-2 mb-4">
            <label for="project">計畫</label>
            <MultiSelect id="project" v-model="filter.projects" display="chip" :options="projectOptions" optionLabel="name" class="w-full" :showToggleAll="false"/>
        </div>

        <hr>

        <div class="flex flex-column gap-2 mb-4">
            <label for="perchMount">棲架</label>
            <MultiSelect id="perchMount" v-model="filter.perchMounts" display="chip" :options="perchMountOptions" optionLabel="name" class="w-full" :showToggleAll="false" :filter="true" filterMatchMode="contains" :filterFields="['name', 'code']" />
        </div>

        <hr>

        <div class="flex flex-column mb-4">
            <p>時間篩選</p>
            <Calendar id="startTime" v-model="filter.startTime" />
            <p>至</p>
            <Calendar id="endTime" v-model="filter.endTime" />
        </div>

        <hr>

        <div class="flex flex-column gap-2 mb-4">
            <ToggleButton v-model="filter.prey" onIcon="pi pi-check" offIcon="pi pi-times" invalid class="w-full" aria-label="Confirmation" onLabel="只要有獵物" offLabel="不篩選獵物"/>
        </div>

        <hr>

        <div class="flex flex-column gap-2 mb-4">
            <label for="taxonOrdersByHuman">物種</label>
            <MultiSelect id="taxonOrdersByHuman" v-model="filter.taxonOrdersByHuman" display="chip" :options="speciesOptions" optionLabel="name" class="w-full" :showToggleAll="false" :filter="true" filterMatchMode="contains" :filterFields="['name', 'code']" />
        </div>

        <hr>

        <div class="flex flex-column gap-2 mb-4">
            <label for="taxonOrdersByAI">AI 物種</label>
            <MultiSelect id="taxonOrdersByHuman" v-model="filter.taxonOrdersByAI" display="chip" :options="speciesOptions" optionLabel="name" class="w-full" :showToggleAll="false" :filter="true" filterMatchMode="contains" :filterFields="['name', 'code']" />
        </div>

        <hr>

        <div class="flex flex-column gap-2 mb-4">
            <ToggleButton v-model="filter.unreviewedData" onIcon="pi pi-check" offIcon="pi pi-times" invalid class="w-full" aria-label="Confirmation" onLabel="加上沒 review 資料" offLabel="只要 review 過的"/>
        </div>

        <hr>

        <Button class="mr-4" label="搜尋" icon="pi pi-search" @click="searchClicked" />
    </Sidebar>
</template>
<script setup>
import {ref, onMounted} from 'vue'

import { getProjects } from '../../service/Projects';
import { getPerchMounts } from '../../service/PerchMounts';
import { getSpecies } from '../../service/Species';
import { dataExport } from '../../service/DataExport';

const perchMountOptions = ref([])
const projectOptions = ref([])
const speciesOptions = ref([])
const previewData = ref([])

const filter = ref({
    visible: false,
    projects: [],
    perchMounts: [],
    startTime: null,
    endTime: null,
    prey: false,
    taxonOrdersByHuman: [],
    taxonOrdersByAI: [],
    unreviewedData: false,
})


function refresh() {
    getProjects().then(data => {
        projectOptions.value = []
        for (const project of data.projects) {
            projectOptions.value.push({ name: project.name, code: project.project_id })
        }

    })
    getPerchMounts().then(data => {
        perchMountOptions.value = []
        for (const perchMount of data.perch_mounts) {
            perchMountOptions.value.push({ name: perchMount.perch_mount_name, code: perchMount.perch_mount_id })
        }
    })

    getSpecies().then(data => {
        speciesOptions.value = []
        for (const species of data.species) {
            speciesOptions.value.push({ name: species.chinese_common_name, code: species.taxon_order })
        }
    })

}

onMounted(() => {
    refresh()
})


function exportClicked() {

}


function searchClicked() {
    dataExport(
        findIDs(filter.value.projects),
        findIDs(filter.value.perchMounts),
        filter.value.startTime,
        filter.value.endTime,
        filter.value.prey,
        findIDs(filter.value.taxonOrdersByHuman),
        findIDs(filter.value.taxonOrdersByAI),
        filter.value.unreviewedData,
        true,
    ).then(data => {
        previewData.value = data.data
    })
}

function findIDs(selectedOptions) {
    const ids = []
    for (const item of selectedOptions) {
        ids.push(item.code)
    }
    return ids
}

</script>