<template>
    <div class="card">
        <h5>{{ medium.detected_medium_id }}</h5>
        <div class="grid">
            <div class="col-6">
                <Image :src="demoImage" alt="Image" width="100%" preview loading="lazy" />
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
            </div>
        </div>
    </div>
</template>



<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getDetectedMediumByID } from '../../service/DetectedMedia'

const route = useRoute()
const medium = ref({})
const species = ref({})

const demoImage = ref('../../demo/images/trailcam/155_20220511_115417_3fVAF9Gz.JPG')

getDetectedMediumByID(route.params.detected_medium_id).then(data => {
    medium.value = data
    species.value = data.species
})


</script>