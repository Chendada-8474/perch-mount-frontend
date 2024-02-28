<template>
    <div className="card">
        <h5>Behaviors</h5>
        <DataTable :value="behaviors" stripedRows tableStyle="min-width: 50rem">
            <Column field="behavior_id" header="Behavior ID"></Column>
            <Column field="chinese_name" header="行為"></Column>
        </DataTable>
    </div>
</template>
<script setup>

import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { getBehaviors } from '../../service/Behaviors'


const behaviors = ref(null)
getBehaviors().then((data) => {
    behaviors.value = data.behaviors
})

</script>