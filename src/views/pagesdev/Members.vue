<template>
    <div className="card">
        <div class="flex justify-content-between flex-wrap">
            <h5>成員</h5>
            <Button v-if="currentUser.is_admin" icon="pi pi-user-plus" label="新增成員" severity="primary"
                @click="memberEditor.visible = true" />
        </div>
        <DataTable :value="members" stripedRows tableStyle="min-width: 50rem">
            <Column field="user_name" header="使用者名稱"></Column>
            <Column header="姓名">
                <template #body="{ data }">
                    {{ data.last_name }}{{ data.first_name }}
                </template>
            </Column>
            <Column field="position_name" header="職稱"></Column>
            <Column field="is_admin" header="管理員">
                <template #body="{ data }">
                    <i class="pi" :class="{ 'pi-check-circle text-green-500': data.is_admin }"></i>
                </template>
            </Column>
        </DataTable>
    </div>
    <Dialog v-model:visible="memberEditor.visible" modal header="新增成員" :style="{ width: '30rem' }">
        <template #header>
            <div class="inline-flex align-items-center justify-content-center gap-2">
                <span class="font-bold white-space-nowrap">新增成員</span>
            </div>
        </template>

        <div class="flex flex-column gap-2 mb-3">
            <label for="user_name" class="font-semibold w-6rem">使用者名稱</label>
            <InputText id="user_name" v-model="memberEditor.userName" class="w-full" />
        </div>

        <div class="grid">
            <div class="col-12 md:col-6">
                <div class="flex flex-column gap-2 mb-3">
                    <label for="last_name" class="font-semibold w-6rem">姓氏</label>
                    <InputText id="last_name" v-model="memberEditor.lastName" class="w-full" />
                </div>
            </div>
            <div class="col-12 md:col-6">
                <div class="flex flex-column gap-2 mb-3">
                    <label for="first_name" class="font-semibold w-6rem">名</label>
                    <InputText id="first_name" v-model="memberEditor.firstName" class="w-full" />
                </div>
            </div>
        </div>

        <div class="flex flex-column gap-2 mb-3">
            <label for="phone_number" class="font-semibold w-6rem">手機號碼</label>
            <InputText id="phone_number" v-model="memberEditor.phoneNumber" class="w-full" />
        </div>


        <div class="flex flex-column gap-2 mb-3">
            <label for="position" class="font-semibold w-6rem">職稱</label>
            <Dropdown id="position" v-model="memberEditor.position" :options="positionOptions" optionLabel="name"
                optionValue="code" placeholder="Select a Position" class="w-full" />
        </div>

        <div class="flex flex-column gap-2 mb-3">
            <ToggleButton v-model="memberEditor.isAdmin" onLabel="是管理員" offLabel="不是管理員" onIcon="pi pi-check"
                offIcon="pi pi-times" invalid class="w-full sm:w-10rem" aria-label="Confirmation" />
        </div>

        <template #footer>
            <Button label="Cancel" severity="secondary" @click="memberEditor.visible = false" autofocus />
            <Button label="Add" severity="primary" @click="addMemberClicked" autofocus />
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
import { getMembers, addMember } from '../../service/Members'
import { getPositions } from '../../service/Positions'

const currentUser = useCurrentUser()
const toast = useToast()

const positionOptions = ref([])
const members = ref(null)
const memberEditor = ref({
    visible: false,
    userName: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    position: null,
    isAdmin: false,
})

getMembers().then((data) => {
    members.value = data.members
})

getPositions().then((data) => {
    var options = []
    for (const position of data.positions) {
        options.push({ name: position.name, code: position.position_id })
    }
    positionOptions.value = options
})

function addMemberClicked() {
    if (!isNewMemberValid()) {
        toast.add({ severity: 'warn', summary: '新增失敗', detail: '成員資料沒填完欸', life: 3000 });
        return
    }
    addMember({
        user_name: memberEditor.value.userName,
        first_name: memberEditor.value.firstName,
        last_name: memberEditor.value.lastName,
        position: memberEditor.value.position,
        phone_number: memberEditor.value.phoneNumber,
        is_admin: memberEditor.value.isAdmin,
    }).then((data) => {
        toast.add({ severity: 'success', summary: '成員新增成功', detail: newPerchMount.value.perchMountName, life: 3000 })
        refreshPerchMount()
    }).catch((e) => {
        toast.add({ severity: 'error', summary: '成員新增失敗', detail: e, life: 3000 })
    })
}

function isNewMemberValid() {
    return memberEditor.value.userName && memberEditor.value.phoneNumber && memberEditor.value.firstName && memberEditor.value.position
}

</script>