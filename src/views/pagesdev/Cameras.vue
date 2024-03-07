<template>
    <div className="card">
        <h5>相機</h5>
        <DataTable :value="cameras" stripedRows tableStyle="min-width: 50rem">
            <Column field="camera_id" header="Camera ID"></Column>
            <Column field="model_name" header="型號"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { getCameras } from '../../service/Cameras'

const cameras = ref(null)

getCameras().then((data) => {
    cameras.value = data.cameras
})

</script>