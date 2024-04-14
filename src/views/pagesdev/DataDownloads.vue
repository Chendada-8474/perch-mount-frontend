<template>
    <div className="card">
        <h5>資料下載</h5>
        <div class="flex flex-wrap gap-2">
            <p>計畫：</p>
            <Badge v-for="project of editor.projects" :value="project.name" severity="info"></Badge>
        </div>
        <div class="flex flex-wrap gap-2">
            <p>棲架：</p>
            <Badge v-for="perchMount of editor.perchMounts" :value="perchMount.name"  severity="info"></Badge>
        </div>
        <div class="flex flex-wrap gap-2">
            <p>時間：</p>
            <Badge :value="displayDate(editor.startTime)"  severity="info"></Badge>
            <p>~</p>
            <Badge :value="displayDate(editor.endTime)"  severity="info"></Badge>
        </div>
        <div class="flex flex-wrap gap-2">
            <p>獵物：</p>
            <Badge v-if="editor.prey" value="只要有獵物的資料" severity="info"></Badge>
            <Badge v-else value="不篩選獵物" severity="info"></Badge>
        </div>
        <div class="flex flex-wrap gap-2">
            <p>物種：</p>
            <Badge v-for="species of editor.taxonOrdersByHuman" :value="species.name"  severity="info"></Badge>
        </div>
        <div class="flex flex-wrap gap-2">
            <p>AI 物種：</p>
            <Badge v-for="species of editor.taxonOrdersByAI" :value="species.name"  severity="info"></Badge>
        </div>
        <div class="flex flex-wrap gap-2">
            <p>未 Review 資料：</p>
            <Badge v-if="editor.unreviewedData" value="連沒 Review 過的資料都要" severity="info"></Badge>
            <Badge v-else value="只要有 Review 過的" severity="info"></Badge>
        </div>
    </div>

    <div class="card">
        <div class="flex flex-wrap justify-content-between mb-5">
            <h5>資料預覽</h5>
            <div>
                <Button class="mr-4" label="篩選條件" icon="pi pi-filter" @click="editor.visible = true" />
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

    <Sidebar v-model:visible="editor.visible" header="Sidebar">
        <div class="flex flex-column gap-2 mb-4">
            <label for="project">計畫</label>
            <MultiSelect id="project" v-model="editor.projects" display="chip" :options="projectOptions" optionLabel="name" class="w-full" :showToggleAll="false" @focusout="refreshConditions"/>
        </div>

        <Divider />

        <div class="flex flex-column gap-2 mb-4">
            <label for="perchMount">棲架</label>
            <MultiSelect id="perchMount" v-model="editor.perchMounts" display="chip" :options="perchMountOptions" optionLabel="name" class="w-full" :showToggleAll="false" :filter="true" filterMatchMode="contains" :filterFields="['name', 'code']" @focusout="refreshConditions"/>
        </div>

        <Divider />

        <div class="flex flex-column mb-4">
            <p>時間篩選</p>
            <Calendar id="startTime" v-model="editor.startTime" @focusout="refreshConditions"/>
            <p>至</p>
            <Calendar id="endTime" v-model="editor.endTime" @focusout="refreshConditions"/>
        </div>

        <Divider />

        <div class="flex flex-column gap-2 mb-4">
            <ToggleButton v-model="editor.prey" onIcon="pi pi-check" offIcon="pi pi-times" invalid class="w-full" aria-label="Confirmation" onLabel="只要有獵物" offLabel="不篩選獵物" @click="refreshConditions"/>
        </div>

        <Divider />

        <div class="flex flex-column gap-2 mb-4">
            <label for="taxonOrdersByHuman">物種</label>
            <MultiSelect id="taxonOrdersByHuman" v-model="editor.taxonOrdersByHuman" display="chip" :options="speciesOptions" optionLabel="name" class="w-full" :showToggleAll="false" :filter="true" filterMatchMode="contains" :filterFields="['name', 'code']" @focusout="refreshConditions"/>
        </div>

        <Divider />

        <div class="flex flex-column gap-2 mb-4">
            <label for="taxonOrdersByAI">AI 物種</label>
            <MultiSelect id="taxonOrdersByHuman" v-model="editor.taxonOrdersByAI" display="chip" :options="speciesOptions" optionLabel="name" class="w-full" :showToggleAll="false" :filter="true" filterMatchMode="contains" :filterFields="['name', 'code']" @focusout="refreshConditions"/>
        </div>

        <Divider />

        <div class="flex flex-column gap-2 mb-4">
            <ToggleButton v-model="editor.unreviewedData" onIcon="pi pi-check" offIcon="pi pi-times" invalid class="w-full" aria-label="Confirmation" onLabel="加上沒 review 資料" offLabel="只要 review 過的" @click="refreshConditions"/>
        </div>

        <Divider />

        <Button class="mr-4" label="搜尋" icon="pi pi-search" @click="searchClicked" />
    </Sidebar>

    <Dialog v-model:visible="resultModalVisible" modal header="輸出成功" :style="{ width: '50rem' }">
        <p>下載連結：<a :href="exportedDataFileName" target="_blank">{{ exportedDataFileName }}</a></p>

        <br>
        <router-link to="/me/export_histories">你的輸出紀錄</router-link>
        <template #footer>
            <Button label="確認" severity="secondary" @click="resultModalVisible = false" autofocus />
        </template>
    </Dialog>

    <Toast />
</template>
<script setup>
import moment from 'moment';
import {ref, onMounted} from 'vue'
import { useToast } from 'primevue/usetoast';

import { getProjects } from '../../service/Projects';
import { getPerchMounts } from '../../service/PerchMounts';
import { getSpecies } from '../../service/Species';
import { dataExport } from '../../service/DataExport';

const toast = useToast()

const perchMountOptions = ref([])
const projectOptions = ref([])
const speciesOptions = ref([])
const previewData = ref([])
const exportedDataFileName = ref("")
const resultModalVisible = ref(false)

const editor = ref({
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

const conditions = ref({
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
            speciesOptions.value.push({
                name: (species.chinese_common_name) ? species.chinese_common_name: species.english_common_name,
                code: species.taxon_order
            })
        }
    })

}

onMounted(() => {
    refresh()
})


function exportClicked() {
    if (previewData.value.length == 0) {
        toast.add(toast.add({ severity: 'warn', summary: '輸出失敗', detail: '沒有搜尋到任何資料', life: 3000 }))
        return
    }


    dataExport(
        conditions.value.projects,
        conditions.value.perchMounts,
        conditions.value.startTime,
        conditions.value.endTime,
        conditions.value.prey,
        conditions.value.taxonOrdersByHuman,
        conditions.value.taxonOrdersByAI,
        conditions.value.unreviewedData,
        false,
    ).then(data => {
        exportedDataFileName.value = data.filename
        resultModalVisible.value = true
    })
}


function searchClicked() {
    if (!isAnyCondition()) {
        toast.add({ severity: 'warn', summary: '搜尋失敗', detail: '請至少輸入一個搜尋條件', life: 3000 })
        return
    }

    dataExport(
        conditions.value.projects,
        conditions.value.perchMounts,
        conditions.value.startTime,
        conditions.value.endTime,
        conditions.value.prey,
        conditions.value.taxonOrdersByHuman,
        conditions.value.taxonOrdersByAI,
        conditions.value.unreviewedData,
        true,
    ).then(data => {
        previewData.value = data.data
    })
}

function findCodes(selectedOptions) {
    const ids = []
    for (const item of selectedOptions) {
        ids.push(item.code)
    }
    return ids
}

function refreshConditions() {
    conditions.value.projects = findCodes(editor.value.projects)
    conditions.value.perchMounts = findCodes(editor.value.perchMounts)
    conditions.value.startTime = editor.value.startTime
    conditions.value.endTime = editor.value.endTime
    conditions.value.prey = editor.value.prey
    conditions.value.taxonOrdersByHuman = findCodes(editor.value.taxonOrdersByHuman)
    conditions.value.taxonOrdersByAI = findCodes(editor.value.taxonOrdersByAI)
    conditions.value.unreviewedData = editor.value.unreviewedData
}

function displayDate(date) {
    if (!date) {
        return "null"
    }
    return moment(date).format("YYYY-MM-DD")
}

function isAnyCondition() {
    return conditions.value.projects.length > 0 ||
    conditions.value.perchMounts.length > 0 ||
    conditions.value.startTime != null ||
    conditions.value.endTime != null ||
    conditions.value.prey ||
    conditions.value.taxonOrdersByHuman.length > 0 ||
    conditions.value.taxonOrdersByAI.length > 0
}

</script>