<template>
    <div className="card">
        <div class="flex justify-content-between flex-wrap">
            <h5>事件</h5>
            <Button v-if="currentUser.is_admin" icon="pi pi-plus" label="新增事件" severity="primary"
                @click="eventEditor.visible = true" />
        </div>
        <DataTable :value="events" stripedRows tableStyle="min-width: 50rem">
            <Column field="event_id" header="Event ID"></Column>
            <Column field="chinese_name" header="事件"></Column>
        </DataTable>
    </div>

    <Dialog v-if="currentUser.is_admin" v-model:visible="eventEditor.visible" modal header="新增事件"
        :style="{ width: '30rem' }">

        <div class="flex flex-column gap-2 mb-3">
            <label for="chinese_name" class="font-semibold w-6rem">事件</label>
            <InputText id="chinese_name" v-model="eventEditor.chineseName" class="w-full" />
        </div>

        <template #footer>
            <Button label="Cancel" severity="secondary" @click="eventEditor.visible = false" autofocus />
            <Button label="Add" severity="primary" @click="addEventClicked" autofocus />
        </template>
    </Dialog>
    <Toast />
</template> 

<script setup>
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { useToast } from 'primevue/usetoast';
import { useCurrentUser } from '../../stores/currnetUser';
import { getEvents, addEvent } from '../../service/Events'

const currentUser = useCurrentUser()
const events = ref(null)

const toast = useToast()
const eventEditor = ref({
    visible: false,
    chineseName: "",
})

refresh()

function refresh() {
    getEvents().then((data) => {
        events.value = data.events
    })
}

function addEventClicked() {
    if (!eventEditor.value.chineseName) {
        toast.add({ severity: 'warn', summary: '新增失敗', detail: '沒填事件欸', life: 3000 });
        return
    }
    addEvent({
        chinese_name: eventEditor.value.chineseName,
    }).then((data) => {
        toast.add({ severity: 'success', summary: '事件新增成功', detail: eventEditor.value.chineseName, life: 3000 })
        refresh()
    }).catch((e) => {
        toast.add({ severity: 'error', summary: '事件新增失敗', detail: e, life: 3000 })
    })
}

</script>