<template>
    <div className="card">
        <h5>Review</h5>
        <p>Use this page to start from scratch and place your custom content.</p>
    </div>

    <div class="card">
        <h5>DataView</h5>
        <DataView :value="media" :layout="layout">
            <template #header>
                <div class="grid grid-nogutter">
                    <div class="col-6 text-left">
                    </div>
                    <div class="col-6 text-right">
                        <DataViewLayoutOptions v-model="layout" />
                    </div>
                </div>
            </template>
            <template #list="slotProps">
                <div class="col-12">
                    <div class="flex flex-column md:flex-row align-items-center p-3 w-full">
                        <img :src="'demo/images/product/' + slotProps.data.image" :alt="slotProps.data.name"
                            class="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5" />
                        <div class="flex-1 text-center md:text-left">
                            <div class="flex align-items-center">
                                <i class="pi pi-tag mr-2"></i>
                                <span class="font-semibold">{{ slotProps.data.detected_medium_id }}</span>
                            </div>
                        </div>
                        <div
                            class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                            <span class="text-2xl font-semibold mb-2 align-self-center md:align-self-end">
                                {{ slotProps.data.medium_datetime }}
                            </span>
                        </div>
                    </div>
                </div>
            </template>

            <template #grid="slotProps">
                <div class="col-12 md:col-4">
                    <div class="card m-3 border-1 surface-border">
                        <div class="flex align-items-center justify-content-between">
                            <div class="flex align-items-center">
                                <span class="font-semibold">{{ slotProps.data.detected_medium_id }}</span>
                            </div>

                        </div>
                        <div class="text-center">
                            <img :src="'demo/images/product/' + slotProps.data.image" :alt="slotProps.data.name"
                                class="w-9 shadow-2 my-3 mx-0" />
                        </div>
                        <div class="flex align-items-center justify-content-between">
                            <span class="text-2xl font-semibold">{{ slotProps.data.medium_datetime }}</span>
                        </div>
                    </div>
                </div>
            </template>
        </DataView>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router'
import { getDetectedMedia } from '../../service/DetectedMedia'

const route = useRoute()
const url = new URL(route.fullPath, import.meta.env.VITE_BASE_HOST);

const media = ref([])
const section = ref([])

const layout = ref('grid');

getDetectedMedia(
    url.searchParams.get('perch_mount'),
    url.searchParams.get('section'),
    url.searchParams.get('offset'),
    url.searchParams.get('limit'),
).then(data => {
    media.value = data.media
})


</script>