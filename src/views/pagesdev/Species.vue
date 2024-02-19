<template>
    <div className="card">
        <h5>物種</h5>
        <DataTable v-model:filters="filters" :value="species" paginator :rows="50" :rowsPerPageOptions="[50, 100, 200]"
            dataKey="id" filterDisplay="row">
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <Column field="chinese_common_name" header="中文俗名" style="min-width: 12rem" filterField="chinese_common_name">
                <template #body="{ data }">
                    {{ data.chinese_common_name }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
                        placeholder="Search by name" />
                </template>
            </Column>
            <Column field="english_common_name" header="英文俗名" style="min-width: 12rem" filterField="english_common_name">
                <template #body="{ data }">
                    {{ data.english_common_name }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
                        placeholder="Search by name" />
                </template>
            </Column>
            <Column field="scientific_name" header="英文俗名" style="min-width: 12rem" filterField="scientific_name">
                <template #body="{ data }">
                    {{ data.scientific_name }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter"
                        placeholder="Search by name" />
                </template>
            </Column>

            <Column field="category" header="Category" style="min-width: 12rem">
            </Column>
            <Column field="order" header="目" style="min-width: 12rem"></Column>
            <Column field="family_latin_name" header="科" style=" min-width: 12rem"></Column>
            <Column field="taiwan_status" header="台灣留棲狀態" style=" min-width: 12rem"></Column>
            <Column field="endemism" header="特有性" style=" min-width: 12rem"></Column>
            <Column field="conservation_status" header="保育等級" style=" min-width: 12rem"></Column>
        </DataTable>

    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from 'primevue/api';

import { getSpecies } from '../../service/Species'

const species = ref(null)
const categories = ref([])

onBeforeMount(() => {
    getSpecies().then((data) => {
        species.value = data
        const options = []
        for (var sp of data) {
            options.push(sp.category)
        }
        for (var option of [... new Set(options)]) {
            categories.value.push({ name: option })
        }
    })
})

const filters = ref({
    chinese_common_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    english_common_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    scientific_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    category: { value: null, matchMode: FilterMatchMode.IN },
});
</script>