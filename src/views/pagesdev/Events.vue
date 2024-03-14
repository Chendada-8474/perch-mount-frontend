<template>
    <div className="card">
        <h5>事件</h5>
        <DataTable :value="events" stripedRows tableStyle="min-width: 50rem">
            <Column field="event_id" header="Event ID"></Column>
            <Column field="chinese_name" header="事件"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { getEvents } from '../../service/Events'

const events = ref(null)

getEvents().then((data) => {
    events.value = data.events
})

</script>