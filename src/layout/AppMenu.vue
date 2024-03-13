<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

import { getProjects } from '@/service/projects'


const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: '計畫',
        items: []
    },
    {
        label: '影像',
        items: [
            { label: '待辨識棲架', icon: 'pi pi-fw pi-eye', to: '/pending' },
            { label: '來點空拍檢查', icon: 'pi pi-fw pi-check-square', to: '/empty_check' },
            { label: '來點檢視物種', icon: 'pi pi-fw pi-pencil', to: '/review' },
            { label: '精選', icon: 'pi pi-fw pi-star' },
        ]
    },
    {
        label: '選項',
        items: [
            { label: '成員', icon: 'pi pi-fw pi-user', to: '/members' },
            { label: '行為', icon: 'pi pi-fw pi-thumbs-up', to: '/behaviors' },
            { label: '相機', icon: 'pi pi-fw pi-camera', to: '/cameras' },
            { label: '事件', icon: 'pi pi-fw pi-camera', to: '/events' },
            { label: '物種', icon: 'pi pi-fw pi-align-left', to: '/species' },
        ]
    },
]);


getProjects().then((data) => {
    for (var project of data.projects) {
        model.value[1].items.push(
            {
                label: project.name,
                icon: 'pi pi-fw pi-flag',
                to: `/projects/${project.project_id}`,
            }
        )
    }
})

</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
