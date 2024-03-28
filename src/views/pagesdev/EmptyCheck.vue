<template>
    <div class="card">

        <DataView :value="media" :layout="layout">
            <template #header>
                <div class="grid grid-nogutter">
                    <div class="col-6 text-left">
                        <h5>Empty Check</h5>
                    </div>
                </div>
                <div>請選擇不是空拍的影像</div>
            </template>

            <template #grid="slotProps">
                <div class="col-12 md:col-4">
                    <div class="card m-3"
                        :class="(slotProps.data.selected) ? 'border-blue-500 border-3' : 'surface-border border-1'">
                        <div class="grid grid-nogutter mb-4">
                            <div class="col-6 text-left">
                                <div class="flex align-items-center">
                                    <Checkbox v-model="slotProps.data.selected" :binary="true"
                                        @change.shift="shiftSelectClicked(slotProps.index)"
                                        @change="selectClicked(slotProps.index)" />
                                </div>
                            </div>
                        </div>

                        <div class="text-center">
                            <Image v-if="slotProps.data.is_image" :src="slotProps.data.s3_path" alt="Image" width="100%"
                                preview />
                            <video v-if="!slotProps.data.is_image" :src="getVideoEndpoint(slotProps.data.base32_path)"
                                width="100%" loading="lazy" controls></video>
                        </div>
                        <p class="text-xs text-300">{{ slotProps.data.path }}</p>
                    </div>
                </div>
            </template>
        </DataView>

        <Button v-show="media.length != 0" label="Submit" class="mr-2 mb-2" @click="openCheckModal"></Button>
    </div>

    <Dialog v-model:visible="submitVisible" modal header="確認要送出嗎？" :style="{ width: '20%' }">
        <p>你選擇了 {{ numberOfSelected }} 個不是空拍的檔案</p>
        <template #footer>
            <Button label="Close" severity="secondary" @click="submitVisible = false" autofocus />
            <Button label="Submit" severity="primary" @click="submit" autofocus />
        </template>
    </Dialog>

    <Card class="my-4" v-show="media.length == 0">

        <template #content>
            <p>如果繼續沒反應的話就是沒得看了~</p>
            <p class="m-0">
                <Button label="繼續" severity="primary" @click="getMoreMedia" autofocus />
            </p>
        </template>
    </Card>

    <Button icon="pi pi-undo" @click="cancleAllSection" class="fixed right-0 top-50" />
    <Toast />
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast';

import { getEmptyMedia } from '../../service/EmptyMedia'
import { emptyCheck } from '../../service/EmptyCheck'
import { me } from '../../service/Me'
import { getVideoEndpoint } from '../../service/utils/video'

const toast = useToast()
const route = useRoute()
const url = new URL(route.fullPath, import.meta.env.VITE_BASE_HOST)
const submitVisible = ref(false)

const currentUser = ref({})

const media = ref([])
const numberOfSelected = ref(0)

const layout = ref('grid');



refresh()

function refresh() {

    me().then(data => {
        currentUser.value = data
    })

    getEmptyMedia(
        url.searchParams.get('perch_mount'),
        url.searchParams.get('section'),
        url.searchParams.get('offset'),
        url.searchParams.get('limit'),
    ).then(data => {
        media.value = data.media
        for (const medium of media.value) {
            medium.selected = false
            medium.empty_checker = currentUser.value.user_id
        }
    })

}

watch(() => {
    refresh()
})

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


function cancleAllSection() {
    for (const medium of media.value) {
        medium.selected = false
    }
}

function openCheckModal() {
    numberOfSelected.value = 0
    for (const medium of media.value) {
        if (medium.selected) {
            numberOfSelected.value += 1
        }
    }

    submitVisible.value = true

}

function submit() {

    for (const medium of media.value) {
        medium.empty = !medium.selected
    }

    emptyCheck({ media: media.value })
        .then((data) => {
            toast.add({ severity: 'success', summary: '資料已成功送出', life: 3000 })
            media.value = []
            submitVisible.value = false
        })
        .catch((e) => {
            toast.add({ severity: 'error', summary: '資料變更失敗', detail: e.message, life: 3000 })
        })

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