<template>
    <div className="card">
        <h5>成員</h5>
        <DataTable :value="members" stripedRows tableStyle="min-width: 50rem">
            <Column field="user_name" header="使用者名稱"></Column>
            <Column header="姓名">
                <template #body="{ data }">
                    {{ data.last_name }}{{ data.first_name }}
                </template>
            </Column>
            <Column field="is_admin" header="管理員"></Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from 'primevue/api';

import { getMembers } from '../../service/Members'

const members = ref(null)

getMembers().then((data) => {
    members.value = data
})

</script>