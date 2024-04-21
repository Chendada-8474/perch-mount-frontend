<script setup>

</script>

<template>
    <div class="grid">
        <div class="col-12 md:col-4">
            <Card>
                <template #title>
                    <div class="flex justify-content-between flex-wrap">
                        <p>計畫</p>
                        <Button v-if="currentUser.is_admin" type="button" label="新增" icon="pi pi-plus" @click="projectEditer.visible = true" />
                    </div>
                </template>
                <template #content>
                    <DataTable :value="projects">
                        <Column field="project_id" header="Project ID"></Column>
                        <Column field="name" header="計畫名稱"></Column>
                    </DataTable>
                </template>
            </Card>
        </div>
        <div class="col-12 md:col-4"></div>
        <div class="col-12 md:col-4"></div>
        <div class="col-12 md:col-4"></div>
    </div>
    <Dialog v-model:visible="projectEditer.visible" modal header="新增計畫" :style="{ width: '25rem' }">

        <div class="flex align-items-center gap-3 mb-3">
            <label for="projectName">計畫名稱</label>
            <InputText id="projectName" type="text" v-model="projectEditer.name" />
        </div>
        <template #footer>
            <Button label="Cancel" severity="secondary" @click="projectEditer.visible = false" autofocus />
            <Button label="Save" severity="primary" @click="addProjectClicked" autofocus />
        </template>
    </Dialog>
    <Toast />
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'

import { useCurrentUser } from '../stores/currnetUser';
import { getProjects, addProject } from '../service/Projects.js'

const projects = ref([])
const toast = useToast()

const currentUser = storeToRefs(useCurrentUser())

const projectEditer = ref({
    visible: false,
    name: null,
})


onMounted(data => {
    refresh()
})

function refresh() {
    getProjects().then(data => {
        projects.value = data.projects
    })
}

function addProjectClicked() {
    if (!projectEditer.value.name) {
        toast.add({ severity: 'warn', summary: '新增失敗', detail: '還沒輸入計畫名稱欸', life: 3000 });
        return
    }
    addProject(projectEditer.value.name).then(data => {
        toast.add({ severity: 'success', summary: '新增成功', detail: projectEditer.value.name, life: 3000 });
    }).catch(e => {
        toast.add({ severity: 'error', summary: '新增失敗', detail: e, life: 3000 });
    })
    refresh()
}


</script>