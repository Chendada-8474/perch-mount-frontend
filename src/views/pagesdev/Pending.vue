<template>
    <div class="card">
        <h5>待處裡棲架</h5>
        <DataTable :value="perch_mounts" responsiveLayout="scroll">
            <Column header="棲架" class="surface-ground">
                <template #body="slotProps">
                    <RouterLink :to="`/projects/${slotProps.data.project}/perch_mounts/${slotProps.data.perch_mount_id}`">{{
                        slotProps.data.perch_mount_name }}
                    </RouterLink>
                </template>
            </Column>
            <Column header="認領" class="surface-ground">
                <template #body="slotProps">
                    <Button v-if="!slotProps.data.claim_by" label="去認領" severity="warning" icon="pi pi-check"
                        class="p-button-rounded p-button-sm  m-2" @click="claim" />
                    <p v-if="slotProps.data.claim_by">{{ claimers[slotProps.data.claim_by].first_name }}</p>
                </template>
            </Column>
            <Column field="empty_count" header="待空拍檢查" class="surface-ground" sortable>
                <template #body="slotProps">
                    <RouterLink v-if="slotProps.data.empty_count"
                        :to="emptyCheckPerchMountUrl(slotProps.data.perch_mount_id)">

                        <Button :label="slotProps.data.empty_count" severity="secondary"
                            class="p-button-rounded p-button-sm m-2" />
                    </RouterLink>
                </template>
            </Column>
            <Column field="detected_count" header="待物種檢視" class="surface-ground" sortable>
                <template #body="slotProps">
                    <RouterLink v-if="slotProps.data.detected_count"
                        :to="reviewPerchMountUrl(slotProps.data.perch_mount_id)">
                        <Button :label="slotProps.data.detected_count" severity="secondary"
                            class="p-button-rounded p-button-sm m-2" />
                    </RouterLink>
                </template>
            </Column>
        </DataTable>
    </div>
    <Toast></Toast>
</template>

<script setup>

import { ref, watch } from 'vue';
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast';

import { getPerchMountPending } from '../../service/PerchMounts'


const toast = useToast()

const perch_mounts = ref([])
const claimers = ref({})

refresh()

watch(() => {
    refresh()
})

function refresh() {
    getPerchMountPending().then(data => {
        perch_mounts.value = data.perch_mounts
        claimers.value = data.members
    })
}

function reviewPerchMountUrl(perchMountID) {
    return `/review?perch_mount=${perchMountID}`
}

function emptyCheckPerchMountUrl(perchMountID) {
    return `/empty_check?perch_mount=${perchMountID}`
}

function claim() {
    toast.add({ severity: 'success', summary: '認領成功', life: 3000 });
}


</script>