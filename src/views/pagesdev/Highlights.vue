<template>
    <div className="card">
        <h5>精選</h5>
        <p>搜尋條件</p>
        <div class="field grid">
            <div class="field col">
                <label for="firstname2">物種（中文俗名）</label>
                <Dropdown v-model="mediafilter.taxonOrder" :options="speciesOptions" showClear filter optionLabel="name" class="w-full" />
            </div>
            <div class="field col">
                <label for="firstname2">棲架</label>
                <Dropdown v-model="mediafilter.perchMountID" :options="perchMountOptions" showClear filter optionLabel="name" class="w-full" />
            </div>
            <div class="field col">
                <label for="firstname2">精選行為</label>
                <Dropdown v-model="mediafilter.behaviorID" :options="behaviorOptions" showClear filter optionLabel="name" class="w-full" />
            </div>
            <div class="field col">
                <label for="firstname2">誰選的</label>
                <Dropdown v-model="mediafilter.memberID" :options="memberOptions" showClear filter optionLabel="name" class="w-full" />
            </div>
            <div class="field col">
                <label for="firstname2">時間</label>
                <Calendar v-model="mediafilter.dateRange" selectionMode="range" showButtonBar :manualInput="false" class="w-full" />
            </div>
        </div>
        <Button icon="pi pi-filter" label="篩選" severity="primary" class="p-button-sm m-2" autofocus @click="search"/>
    </div>

    <div class="card">
        <DataView :value="media" :layout="layout">
            <template #header>
                <div class="grid grid-nogutter">
                    <div class="col-6 text-left">搜尋結果</div>
                </div>
            </template>


            <template #grid="slotProps">
                <div class="col-12 md:col-4">
                    <div class="card m-3">
                        <div class="grid grid-nogutter">
                            <div class="col-6 text-left">
                                {{ defineMediumtitle(slotProps.data) }}
                            </div>
                            <div class="col-6 text-right">
                                <Button icon="pi pi-download" @click="downloadMeida(slotProps.data.s3_path)"
                                    class="p-button-rounded p-button-secondary p-button-text" />
                            </div>
                        </div>
                        <div class="grid grid-nogutter">
                            <div class="text-center">
                                <Image v-if="slotProps.data.is_image" :src="slotProps.data.s3_path" alt="Image" width="100%"
                                preview />
                                <video v-if="!slotProps.data.is_image" :src="getVideoEndpoint(slotProps.data.base32_path)"
                                width="100%" loading="lazy" controls></video>
                            </div>
                        </div>
                        <Panel :header="slotProps.data.medium_id" class="mt-3" toggleable collapsed>
                            <p class="m-0">
                                計畫：{{ slotProps.data.project_name }}<br>
                                棲架：{{ slotProps.data.perch_mount_name }}<br>
                                拍攝時間：{{ slotProps.data.medium_datetime }}<br>
                                精選人：{{ membersMap[slotProps.data.featured_by] }}<br>
                                NAS Path：{{ slotProps.data.path }}<br>
                                S3 Path：{{ slotProps.data.s3_path }}
                            </p>
                        </Panel>
                    </div>
                </div>

            </template>
        </DataView>
    </div>
    <Paginator :rows="limit" :totalRecords="total" :rowsPerPageOptions="[50, 100]" @page="selectPage"></Paginator>
</template>
<script setup>
import { ref, onMounted } from 'vue'

import { getMediaByFeature } from '../../service/Media'
import { getBehaviors } from '../../service/Behaviors'
import { getMembers } from '../../service/Members'
import { getSpecies } from '../../service/Species'
import { getPerchMounts } from '../../service/Perchmounts'
import { getVideoEndpoint } from '../../service/utils/video'
import Dropdown from 'primevue/dropdown'
import moment from 'moment'

const layout = ref('grid');

const total = ref(0)
const limit = ref(50)

const perchMounts = ref([])
const behaviorsMap = ref({})
const membersMap = ref({})
const media = ref([])
const featuredSpecies = ref([])

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
})

onMounted(() => {
    initOptions()
})

function initOptions() {
    getMembers().then(data => {
        findOptions(memberOptions, "first_name", "member_id", data.members)
        findMap(membersMap, "member_id", "first_name", data.members)
    })
    getSpecies().then(data => {
        findOptions(speciesOptions, "chinese_common_name", "taxon_order", data.species)
    })
    getPerchMounts().then(data => {
        findOptions(perchMountOptions, "perch_mount_name", "perch_mount_id", data.perch_mounts)
    })
    getBehaviors().then(data => {
        findOptions(behaviorOptions, "chinese_name", "behavior_id", data.behaviors)
        findMap(behaviorsMap, "behavior_id", "chinese_name", data.behaviors)
    })
}

function findOptions(options, nameColumnName, codeColumnName, data) {
    options.value = []
    for (const row of data) {
        options.value.push({ name: row[nameColumnName], code: row[codeColumnName] })
    }

}

function findMap(map, keyColumnName, valueColumnName, data) {
    map.value = {}
    for (const row of data) {
        map.value[row[keyColumnName]] = row[valueColumnName]
    }
}

function search() {
    searchMedia()
}


function searchMedia(offset = 0) {

    if (!mediafilter.value.dateRange) {
        mediafilter.value.dateRange = [null, null]
    }

    var taxonOrder = (mediafilter.value.taxonOrder) ? mediafilter.value.taxonOrder.code : null
    var perchMountID = (mediafilter.value.perchMountID) ? mediafilter.value.perchMountID.code : null
    var behaviorID = (mediafilter.value.behaviorID) ? mediafilter.value.behaviorID.code : null
    var memberID = (mediafilter.value.memberID) ? mediafilter.value.memberID.code : null
    var from = (mediafilter.value.dateRange[0]) ? moment(mediafilter.value.dateRange[0]).toISOString() : null
    var to = (mediafilter.value.dateRange[1]) ? moment(mediafilter.value.dateRange[1]).toISOString() : null

    getMediaByFeature(
        taxonOrder,
        perchMountID,
        behaviorID,
        memberID,
        from,
        to,
        offset,
        limit.value,
    ).then(data => {
        media.value = data.media
        total.value = data.total
        featuredSpecies.value = data.species
    })

}


function selectPage(state) {
    limit.value = state.rows
    searchMedia(state.first)
}

function downloadMeida(url) {
    window.open(url, '_blank')
}

function defineMediumtitle(medium) {

    const behaviorName = behaviorsMap.value[medium.featured_behavior]

    if (!medium.individuals.length) {
        return behaviorName
    }

    return `${behaviorName} 的 ${featuredSpecies.value[medium.individuals[0].taxon_order_by_human].chinese_common_name}`
}

</script>