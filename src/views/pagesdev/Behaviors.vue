<template>
    <div className="card">
        <div class="flex justify-content-between flex-wrap">
            <h5>Behaviors</h5>
            <Button v-if="currentUser.is_admin" icon="pi pi-plus" label="新增行為" severity="primary"
                @click="behaviorEditor.visible = true" />
        </div>
        <DataTable :value="behaviors" stripedRows tableStyle="min-width: 50rem">
            <Column field="behavior_id" header="Behavior ID"></Column>
            <Column field="chinese_name" header="行為"></Column>
        </DataTable>
    </div>

    <Dialog v-if="currentUser.is_admin" v-model:visible="behaviorEditor.visible" modal header="新增行為"
        :style="{ width: '30rem' }">

        <div class="flex flex-column gap-2 mb-3">
            <label for="chinese_name" class="font-semibold w-6rem">行為名稱</label>
            <InputText id="chinese_name" v-model="behaviorEditor.chineseName" class="w-full" />
        </div>

        <template #footer>
            <Button label="Cancel" severity="secondary" @click="behaviorEditor.visible = false" autofocus />
            <Button label="Add" severity="primary" @click="addBehaviorClicked" autofocus />
        </template>
    </Dialog>
    <Toast />
</template>
<script setup>

import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { useCurrentUser } from '../../stores/currnetUser';
import { getBehaviors, addBehavior } from '../../service/Behaviors'

const currentUser = useCurrentUser()
const toast = useToast()
const behaviorEditor = ref({
    visible: false,
    chineseName: ""
})

const behaviors = ref(null)

refresh()

function refresh() {
    getBehaviors().then((data) => {
        behaviors.value = data.behaviors
    })
}


function addBehaviorClicked() {
    if (!behaviorEditor.value.chineseName) {
        toast.add({ severity: 'warn', summary: '新增失敗', detail: '沒填行為名稱欸', life: 3000 });
        return
    }
    addBehavior({
        chinese_name: behaviorEditor.value.chineseName,
    }).then((data) => {
        toast.add({ severity: 'success', summary: '行為新增成功', detail: behaviorEditor.value.chineseName, life: 3000 })
        refresh()
    }).catch((e) => {
        toast.add({ severity: 'error', summary: '行為新增失敗', detail: e, life: 3000 })
    })
}

</script>