<template>
    <div className="card">
        <h5>精選</h5>
        <p>搜尋條件</p>
        <div class="field grid">
            <div class="field col">
                <label for="firstname2">物種（中文俗名）</label>
                <Dropdown v-model="mediafilter.taxonOrder" :options="speciesOptions" filter optionLabel="name" class="w-full" />
            </div>
            <div class="field col">
                <label for="firstname2">棲架</label>
                <Dropdown v-model="mediafilter.perchMountID" :options="perchMountOptions" filter optionLabel="name" class="w-full" />
            </div>
            <div class="field col">
                <label for="firstname2">精選行為</label>
                <Dropdown v-model="mediafilter.behaviorID" :options="behaviorOptions" filter optionLabel="name" class="w-full" />
            </div>
            <div class="field col">
                <label for="firstname2">誰選的</label>
                <Dropdown v-model="mediafilter.memberID" :options="memberOptions" filter optionLabel="name" class="w-full" />
            </div>
            <div class="field col">
                <label for="firstname2">時間</label>
                <Calendar v-model="mediafilter.dateRange" selectionMode="range" :manualInput="false" class="w-full" />
            </div>
        </div>
        <Button icon="pi pi-filter" label="篩選" severity="primary" class="p-button-sm m-2" autofocus @click="searchMedia"/>
    </div>

    <div class="card">
        <DataView :value="media" :layout="layout">
            <template #header>
                <div class="grid grid-nogutter">
                    <div class="col-6 text-left"></div>
                    <div class="col-6 text-right">
                        <DataViewLayoutOptions v-model="layout" />
                    </div>
                </div>
            </template>

            <template #list="slotProps">
            </template>

            <template #grid="slotProps">
                <div class="col-12 md:col-4">
                    <div class="card m-3">
                        <div class="grid grid-nogutter">
                            <div class="grid grid-nogutter">
                                <div class="col-6 text-left">
                                    <div class="flex align-items-center">

                                    </div>
                                </div>
                                <div class="col-6 text-right">

                                    <Button icon="pi pi-pencil" @click="optionEditer(slotProps.index)"
                                        class="p-button-rounded p-button-secondary p-button-text mr-2 mb-2" />
                                </div>
                            </div>
                            <div class="text-center">
                                <Image v-if="slotProps.data.is_image" :src="slotProps.data.s3_path" alt="Image" width="100%"
                                    preview />
                                <video v-if="!slotProps.data.is_image" :src="getVideoEndpoint(slotProps.data.base32_path)"
                                    width="100%" loading="lazy" controls></video>
                            </div>
                        </div>
                    </div>
                </div>

            </template>
        </DataView>

    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'

import { getMedia } from '../../service/Media'
import { getBehaviors } from '../../service/Behaviors'
import { getMembers } from '../../service/Members'
import { getSpecies } from '../../service/Species'
import { getPerchMounts } from '../../service/Perchmounts'
import { getVideoEndpoint } from '../../service/utils/video'

const layout = ref('grid');

const members = ref([])
const species = ref([])
const perchMounts = ref([])
const behaviors = ref([])
const media = ref([])

const speciesOptions = ref([])
const perchMountOptions = ref([])
const behaviorOptions = ref([])
const memberOptions = ref([])

const mediafilter = ref({
    taxonOrder: {},
    perchMountID: {},
    behaviorID: {},
    memberID: {},
    dateRange: "",
    offset: 0,
    limit: 50,
})

onMounted(() => {
    initOptions()
})

function initOptions() {
    getMembers().then(data => {
        findOptions(memberOptions, "first_name", "member_id", data.members)
    })
    getSpecies().then(data => {
        findOptions(speciesOptions, "chinese_common_name", "taxon_order", data.species)
    })
    getPerchMounts().then(data => {
        findOptions(perchMountOptions, "perch_mount_name", "perch_mount_id", data.perch_mounts)
    })
    getBehaviors().then(data => {
        findOptions(behaviorOptions, "chinese_name", "behavior_id", data.behaviors)
    })
}

function findOptions(options, nameColumnName, codeColumnName, data) {
    options.value = []
    for (const row of data) {
        options.value.push({ name: row[nameColumnName], code: row[codeColumnName] })
    }

}


function searchMedia() {
    getMedia().then(data => {
        media.value = data.media
        console.log(media.value)
    })
}


</script>