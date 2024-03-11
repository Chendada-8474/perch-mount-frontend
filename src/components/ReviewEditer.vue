<template>
    <div class="grid">
        <div class="col-12 md:col-6">
            <div>
                <div class="h-100 w-100 cursor-pointer">
                    <BoundingBoxCanva v-if="medium.is_image" :individuals="medium.individuals" :path="medium.s3_path"
                        @added="addIndividual">
                    </BoundingBoxCanva>
                    <video v-if="!medium.is_image" :src="medium.s3_path" width="100%" loading="lazy" controls></video>
                </div>
            </div>

        </div>
        <div class="col-12 md:col-6">
            <DataTable :value="medium.individuals" size="small">
                <Column header="物種">
                    <template #body="slotProps">
                        <Dropdown v-model="slotProps.data.selected" editable :options="slotProps.data.options"
                            optionLabel="name" @input="search(slotProps.index, slotProps.data.selected)" class="w-full" />
                    </template>
                </Column>
                <Column field="xmin" header="xmin"></Column>
                <Column field="xmax" header="xmax"></Column>
                <Column field="ymin" header="ymin"></Column>
                <Column field="ymax" header="ymax"></Column>
                <Column header="">
                    <template #body="slotProps">
                        <Button icon="pi pi-trash" class="p-button-danger p-button-text p-0"
                            @click="deleteIndividual(slotProps.index)" />
                    </template>
                </Column>
            </DataTable>
            <Button v-if="!medium.is_image" label="新增個體" icon="pi pi-plus" class="p-button my-5"
                @click="addIndividual({})" />
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue'
import { trieSearch } from '../service/Species'
import BoundingBoxCanva from './BoundingBoxCanva.vue';


const medium = ref({
    individuals: []
})

const props = defineProps({
    medium: { default: {} },
})


medium.value = props.medium


function search(individualIndex, phrase) {
    trieSearch(phrase).then(data => {
        medium.value.individuals[individualIndex].options = []
        for (const [key, value] of Object.entries(data.results)) {
            medium.value.individuals[individualIndex].options.push({ name: value, code: key })
        }
    })
}

function deleteIndividual(individualIndex) {
    medium.value.individuals.splice(individualIndex, 1)
}

function addIndividual(box) {

    medium.value.individuals.push({
        medium_index: props.medium.mediumIndex,
        xmin: box.xmin,
        xmax: box.xmax,
        ymin: box.ymin,
        ymax: box.ymax,
    })
}

</script>

<style>
.cursor-crosshair {
    cursor: crosshair;
}
</style>