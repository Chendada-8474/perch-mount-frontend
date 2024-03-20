<template>
    <div className="card">
        <div class="flex justify-content-between flex-wrap">
            <h5>相機</h5>
            <Button v-if="currentUser.is_admin" icon="pi pi-plus" label="新增相機" severity="primary"
                @click="cameraEditor.visible = true" />
        </div>
        <DataTable :value="cameras" stripedRows tableStyle="min-width: 50rem">
            <Column field="camera_id" header="Camera ID"></Column>
            <Column field="model_name" header="型號"></Column>
        </DataTable>
    </div>

    <Dialog v-if="currentUser.is_admin" v-model:visible="cameraEditor.visible" modal header="新增相機"
        :style="{ width: '30rem' }">

        <div class="flex flex-column gap-2 mb-3">
            <label for="model_name" class="font-semibold w-6rem">型號</label>
            <InputText id="model_name" v-model="cameraEditor.modelName" class="w-full" />
        </div>

        <template #footer>
            <Button label="Cancel" severity="secondary" @click="cameraEditor.visible = false" autofocus />
            <Button label="Add" severity="primary" @click="addCameraClicked" autofocus />
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
import { getCameras, addCamera } from '../../service/Cameras'

const cameras = ref(null)

const currentUser = useCurrentUser()
const toast = useToast()

const cameraEditor = ref({
    visible: false,
    modelName: ""
})

refresh()

function refresh() {
    getCameras().then((data) => {
        cameras.value = data.cameras
    })
}


function addCameraClicked() {
    if (!cameraEditor.value.modelName) {
        toast.add({ severity: 'warn', summary: '新增失敗', detail: '沒填型號欸', life: 3000 });
        return
    }
    addCamera({
        model_name: cameraEditor.value.modelName,
    }).then((data) => {
        toast.add({ severity: 'success', summary: '相機新增成功', detail: cameraEditor.value.modelName, life: 3000 })
        refresh()
    }).catch((e) => {
        toast.add({ severity: 'error', summary: '相機新增失敗', detail: e, life: 3000 })
    })
}

</script>