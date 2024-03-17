<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

import { getProjects } from '@/service/Projects'


const model = ref([
    {
        label: 'Home',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
            { label: '資料下載器', icon: 'pi pi-fw pi-database', to: '/data_download' },
            { label: '上傳參數產生器', icon: 'pi pi-fw pi-file-edit', to: '/upload_params' },
        ]
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
            { label: '精選', icon: 'pi pi-fw pi-star', to: '/highlights' },
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
    {
        label: '外部連結',
        items: [
            { label: 'Release Infomation', icon: 'pi pi-fw pi-github', to: '/external/release' },
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
