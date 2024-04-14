<template>
    <div className="card">
        <h5>你輸出的資料</h5>

        <DataTable :value="exportHistories" tableStyle="min-width: 50rem">
            <Column field="file_name" header="檔案名稱">
                <template #body="slotProps">
                    <a :href="getExportDataUrl(slotProps.data.file_name)" target="_blank">{{ slotProps.data.file_name }}</a>
                </template>
            </Column>
            <Column field="create_time" header="輸出時間"></Column>
        </DataTable>

    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useCurrentUser } from '../../stores/currnetUser';
import { getExportHistoriesByExportor } from '../../service/DataExport';

const currentUser = storeToRefs(useCurrentUser())
const exportHistories = ref([])


onMounted(() => {
    getExportHistoriesByExportor(currentUser.user_id.value).then(data => {
        exportHistories.value = data.export_histories
    })
})

function getExportDataUrl(fileName) {
    return `${window.S3_HOST}/dataexport/${fileName}`
}

</script>