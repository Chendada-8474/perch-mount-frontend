<template>
    <div class="card">

        <DataView :value="media" :layout="layout">
            <template #header>
                <div class="grid grid-nogutter">
                    <div class="col-6 text-left">
                        <h5>Review</h5>
                    </div>
                </div>
            </template>

            <template #grid="slotProps">
                <div class="col-12 md:col-4">
                    <div class="card m-3 "
                        :class="(slotProps.data.error) ? 'border-red-500 border-3' : 'surface-border border-1'">
                        <div class="grid grid-nogutter">
                            <div class="col-6 text-left">
                                <div class="flex align-items-center">
                                    <Checkbox v-model="slotProps.data.selected" :binary="true"
                                        @change.shift="shiftSelectClicked(slotProps.index)"
                                        @change="selectClicked(slotProps.index)" />
                                </div>
                            </div>
                            <div class="col-6 text-right">
                                <Button
                                    :icon="`pi ${(!slotProps.data.featured_behavior.code) ? 'pi-heart' : 'pi-heart-fill'}`"
                                    @click="slotProps.data.featureVisibale = !slotProps.data.featureVisibale"
                                    class="p-button-rounded p-button-danger p-button-text mr-2 mb-2" />
                                <Dialog v-model:visible="slotProps.data.featureVisibale" modal header="編輯精選資訊"
                                    :style="{ width: '25rem' }">
                                    <div class="mb-4">
                                        <InputText v-model="slotProps.data.featured_title" type="text" placeholder="標題"
                                            class="w-full my-2"></InputText>
                                        <Dropdown v-model="slotProps.data.featured_behavior" :options="behaviors"
                                            optionLabel="name" placeholder="Select a Behavior" class="w-full" />
                                    </div>
                                    <Button type="button" label="Close" severity="secondary"
                                        @click="slotProps.data.featureVisibale = false" class="my-2"></Button>
                                </Dialog>

                                <Button icon="pi pi-pencil" @click="optionEditer(slotProps.index)"
                                    class="p-button-rounded p-button-secondary p-button-text mr-2 mb-2" />
                            </div>
                        </div>

                        <div class="text-center">
                            <Image :src="demoImage" alt="Image" width="100%" preview loading="lazy" />
                        </div>
                        <DataTable :value="slotProps.data.individuals" size="small">
                            <Column header="物種">
                                <template #body="slotProps">
                                    <Dropdown v-model="slotProps.data.selected" editable :options="slotProps.data.options"
                                        optionLabel="name"
                                        @input="search(slotProps.data.medium_index, slotProps.index, slotProps.data.selected)"
                                        class="w-full" />
                                </template>
                            </Column>
                            <Column header="獵物">
                                <template #body="slotProps">
                                    <Checkbox v-model="slotProps.data.prey" :binary="true" />
                                </template>
                            </Column>
                            <Column header="">
                                <template #body="slotProps">
                                    <Button icon="pi pi-trash" class="p-button-danger p-button-text p-0"
                                        @click="deleteIndividual(slotProps.data.medium_index, slotProps.index)" />
                                </template>
                            </Column>
                        </DataTable>
                        <div class="mt-3 grid grid-nogutter">

                            <div class="col-6 text-left">
                                <p class="text-xs text-300">{{ slotProps.data.path }}</p>
                            </div>
                            <div class="col-6 text-right">

                                <Dropdown v-model="slotProps.data.event" :options="events" optionLabel="name"
                                    placeholder="選擇事件" />
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DataView>

        <Button v-show="media.length != 0" label="Submit" class="mr-2 mb-2" @click="openCheckModal"></Button>
    </div>

    <Card class="my-4" v-show="media.length == 0">

        <template #content>
            <p>如果繼續沒反應的話就是沒得看了~</p>
            <p class="m-0">
                <Button label="繼續" severity="primary" @click="getMoreMedia" autofocus />
            </p>
        </template>
    </Card>

    <Dialog v-model:visible="mediumEditerVisible" modal header="編輯" :style="{ width: '95%' }">
        <ReviewEditer :medium="mediumEditer"></ReviewEditer>
        <template #footer>
            <Button label="Close" severity="primary" @click="mediumEditerVisible = false" autofocus />
        </template>
    </Dialog>
    <Dialog v-model:visible="submitVisible" modal header="確認送出" :style="{ width: '20%' }">
        <p>請確認一下你選擇的物種：</p>
        <ul class="list-disc">
            <li v-for="species of selectedSpecies">{{ species }}</li>
        </ul>
        <template #footer>
            <Button label="Close" severity="secondary" @click="submitVisible = false" autofocus />
            <Button label="Submit" severity="primary" @click="submit" autofocus />
        </template>
    </Dialog>

    <Button icon="pi pi-pencil" @click="visibleRight = true" class="fixed right-0 top-50" />
    <Sidebar v-model:visible="visibleRight" header="Right Sidebar" position="right">
        <h5>編輯選擇的資料</h5>

        <p>選擇物種</p>
        <div>
            <Dropdown v-model="rightEditerSelectedSpecies" editable :options="rightEditerSpeciesOptions" optionLabel="name"
                @input="editorSearch(rightEditerSelectedSpecies)" class="my-2" />
            <Button icon="pi pi-check" label="變更物種" severity="primary" @click="updateIndividualsClicked"
                class="p-button-sm m-2" autofocus />
        </div>

        <hr>

        <div>
            <Dropdown v-model="rightEditerSelectedEvent" :options="events" optionLabel="name" placeholder="選擇事件" />
            <Button icon="pi pi-check" label="變更事件" severity="primary" @click="updateEventClicked" class="p-button-sm m-2"
                autofocus />
        </div>

        <hr>

        <div>
            <Button icon="pi pi-check" label="標記為有獵物" severity="primary" @click="tagAllPreysAs(true)"
                class="p-button-sm m-2" autofocus />
            <Button icon="pi pi-times" label="取消標記獵物" severity="primary" @click="tagAllPreysAs(false)"
                class="p-button-sm m-2" autofocus />
        </div>


        <hr>

        <div>
            <Button icon="pi pi-undo" label="取消全選" severity="secondary" @click="cancleSelections" class="p-button-sm m-2"
                autofocus />
            <Button icon="pi pi-trash" label="刪除個體" severity="danger" @click="deleteIndividuals" class="p-button-sm m-2"
                autofocus />
        </div>

    </Sidebar>
    <Toast />
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast';
import ReviewEditer from '../../components/ReviewEditer.vue';

import { getDetectedMedia } from '../../service/DetectedMedia'
import { getBehaviors } from '../../service/Behaviors'
import { trieSearch } from '../../service/Species'
import { getEvents } from '../../service/Events'

import { me } from '../../service/Me'

const toast = useToast()
const route = useRoute()
const url = new URL(route.fullPath, import.meta.env.VITE_BASE_HOST)

const currentUser = ref({})

const media = ref([])
const species = ref({})

const layout = ref('grid');

const mediumEditerVisible = ref(false)
const mediumEditer = ref({})

const submitVisible = ref(false)
const selectedSpecies = ref(new Set())

const visibleRight = ref(false)
const rightEditerSelectedSpecies = ref(null)
const rightEditerSelectedEvent = ref(null)
const rightEditerSpeciesOptions = ref([])

const behaviors = ref([])
const events = ref([])

const demoImage = ref('../../demo/images/trailcam/155_20220511_115417_3fVAF9Gz.JPG')


getBehaviors().then(data => {
    behaviors.value.push({ name: "--", code: null })
    for (const behavior of data.behaviors) {
        behaviors.value.push({ name: behavior.chinese_name, code: behavior.behavior_id })
    }
})

getEvents().then(data => {
    events.value.push({ name: "--", code: null })
    for (const event of data.events) {
        events.value.push({ name: event.chinese_name, code: event.event_id })
    }
})

refresh()

watch(() => {
    refresh()
})

function refresh() {
    me().then(data => {
        currentUser.value = data
    })
    getDetectedMedia(
        url.searchParams.get('perch_mount'),
        url.searchParams.get('section'),
        url.searchParams.get('offset'),
        url.searchParams.get('limit'),
    ).then(data => {
        media.value = data.media
        species.value = data.species
        embedMediaIndexInIndividuals(media.value, species.value)
        for (const medium of media.value) {
            medium.error = false
            medium.selected = false
            medium.featureVisibale = false
            medium.featured_title = null
            medium.event = null
            medium.featured_behavior = { name: "--", code: null }
            medium.reviewer = currentUser.value.user_id
        }
    })
}

function deleteIndividual(mediumIndex, individualIndex) {
    media.value[mediumIndex].individuals.splice(individualIndex, 1)
}

function embedMediaIndexInIndividuals(mediaValue, speciesValue) {
    for (let i = 0; i < mediaValue.length; i++) {
        for (const individual of mediaValue[i].individuals) {
            individual.medium_index = i
            individual.chinese_common_name = speciesValue[`${individual.taxon_order_by_ai}`].chinese_common_name
            individual.selected = { name: individual.chinese_common_name, code: individual.taxon_order_by_ai }
            individual.options = [{ name: individual.chinese_common_name, code: individual.taxon_order_by_ai }]
            individual.prey = false
        }
    }
}

function search(mediumIndex, individualIndex, phrase) {
    trieSearch(phrase).then(data => {
        media.value[mediumIndex].individuals[individualIndex].options = []
        for (const [key, value] of Object.entries(data.results)) {
            media.value[mediumIndex].individuals[individualIndex].options.push({ name: value, code: key })
        }
    })
}

function optionEditer(mediumIndex) {
    mediumEditerVisible.value = true
    mediumEditer.value = media.value[mediumIndex]
    mediumEditer.value.mediumIndex = mediumIndex
}

function openCheckModal() {
    selectedSpecies.value.clear()
    var error = false
    for (const medium of media.value) {
        for (const individual of medium.individuals) {

            if (!individual.selected || !individual.selected.name) {
                error = true
                medium.error = true
            } else {
                medium.error = false
                selectedSpecies.value.add(individual.selected.name)
            }
        }
    }
    if (error) {
        toast.add(toast.add({ severity: 'error', summary: '送出錯誤', detail: '有不正確的物種名稱', life: 3000 }))
        return
    }
    submitVisible.value = true

}

function submit() {
    submitVisible.value = false
    media.value = []
}


const lastTimeSelectedIndex = ref(0)

function selectClicked(mediumIndex) {

    if (media.value[mediumIndex].selected) {
        lastTimeSelectedIndex.value = mediumIndex
    }
}


function shiftSelectClicked(mediumIndex) {
    if (media.value[mediumIndex].selected) {
        var start = Math.min(lastTimeSelectedIndex.value, mediumIndex)
        var end = Math.max(lastTimeSelectedIndex.value, mediumIndex)
        for (let i = start; i < end + 1; i++) {
            media.value[i].selected = true
        }
    }

}

function editorSearch(phrase) {
    trieSearch(phrase).then(data => {
        rightEditerSpeciesOptions.value = []
        for (const [key, value] of Object.entries(data.results)) {
            rightEditerSpeciesOptions.value.push({ name: value, code: key })
        }
    })
}

function cancleSelections() {
    for (const medium of media.value) {
        medium.selected = false
    }
}

function deleteIndividuals() {
    for (const medium of media.value) {
        if (medium.selected) {
            medium.individuals = []
        }
    }
}

function updateIndividuals() {
    for (const medium of media.value) {
        if (medium.selected) {
            for (const individual of medium.individuals) {
                individual.options = [rightEditerSelectedSpecies.value]
                individual.selected = rightEditerSelectedSpecies.value
            }
        }
    }
}

function updateIndividualsClicked() {
    if (!rightEditerSelectedSpecies.value) {
        toast.add({ severity: 'info', summary: '', detail: '請先選擇物種', life: 3000 })
        return
    }
    updateIndividuals()
    rightEditerSelectedSpecies.value = null
    rightEditerSpeciesOptions.value = []
}


function tagAllPreysAs(checked) {
    for (const medium of media.value) {
        if (medium.selected) {
            for (const individual of medium.individuals) {
                individual.prey = checked

            }
        }
    }
}

function updateEventClicked() {
    console.log(rightEditerSelectedEvent.value)
    for (const medium of media.value) {
        if (medium.selected) {
            medium.event = rightEditerSelectedEvent.value
        }
    }
}

function getMoreMedia() {
    refresh()
}

</script>


<style>
img {
    border-radius: 0.25rem;
    /* width: 100%; */
}
</style>