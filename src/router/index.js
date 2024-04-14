import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/projects',
                    children: [
                        {
                            path: '/projects/:project_id(\\d+)',
                            name: 'project',
                            component: () => import('@/views/pagesdev/Project.vue'),
                        },
                    ]
                },
                {
                    path: '/projects/:id(\\d+)/perch_mounts',
                    children: [
                        {
                            path: '/projects/:project_id(\\d+)/perch_mounts/:perch_mount_id(\\d+)',
                            name: 'perch_mount',
                            component: () => import('@/views/pagesdev/PerchMount.vue')
                        }
                    ]
                },
                {
                    path: '/projects/:project_id(\\d+)/perch_mounts/:perch_mount_id(\\d+)',
                    children: [
                        {
                            path: '/projects/:project_id(\\d+)/perch_mounts/:perch_mount_id(\\d+)/sections/:section_id(\\d+)',
                            name: 'section',
                            component: () => import('@/views/pagesdev/Section.vue')
                        }
                    ]
                },
                {
                    path: '/projects/:project_id(\\d+)/perch_mounts/:perch_mount_id(\\d+)/sections/:section_id(\\d+)',
                    children: [
                        {
                            path: '/projects/:project_id(\\d+)/perch_mounts/:perch_mount_id(\\d+)/sections/:section_id(\\d+)/detected_media/:detected_medium_id',
                            name: 'detected_medium',
                            component: () => import('@/views/pagesdev/DetectedMedium.vue')
                        },
                        {
                            path: '/projects/:project_id(\\d+)/perch_mounts/:perch_mount_id(\\d+)/sections/:section_id(\\d+)/empty_media/:empty_medium_id',
                            name: 'empty_medium',
                            component: () => import('@/views/pagesdev/EmptyMedium.vue')
                        },
                        {
                            path: '/projects/:project_id(\\d+)/perch_mounts/:perch_mount_id(\\d+)/sections/:section_id(\\d+)/media/:medium_id',
                            name: 'medium',
                            component: () => import('@/views/pagesdev/Medium.vue')
                        },
                    ]
                },

                {
                    path: '/review',
                    component: () => import('@/views/pagesdev/Review.vue'),
                },
                {
                    path: '/empty_check',
                    component: () => import('@/views/pagesdev/EmptyCheck.vue'),
                },
                {
                    path: '/pending',
                    component: () => import('@/views/pagesdev/Pending.vue'),
                },
                {
                    path: '/highlights',
                    component: () => import('@/views/pagesdev/Highlights.vue'),
                },
                {
                    path: '/members',
                    component: () => import('@/views/pagesdev/Members.vue'),
                },
                {
                    path: '/species',
                    component: () => import('@/views/pagesdev/Species.vue'),

                },
                {
                    path: '/cameras',
                    component: () => import('@/views/pagesdev/Cameras.vue'),

                },
                {
                    path: '/behaviors',
                    component: () => import('@/views/pagesdev/Behaviors.vue'),

                },
                {
                    path: '/events',
                    component: () => import('@/views/pagesdev/Events.vue'),

                },
                {
                    path: '/data_download',
                    component: () => import('@/views/pagesdev/DataDownloads.vue')
                },
                {
                    path: '/upload_params',
                    component: () => import('@/views/pagesdev/UploadParams.vue')
                },
                {
                    path: '/me',
                    component: () => import('@/views/pagesdev/Me.vue'),
                },
                {
                    path: '/me/export_histories',
                    component: () => import('@/views/pagesdev/ExportHistories.vue')
                },

                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
            ]
        },
        {
            path: '/external',
            children: [
                {
                    path: '/external/:service',
                    name: 'externalService',
                    component: () => import('@/components/External.vue'),
                },
            ]
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: import('@/views/pages/NotFound.vue')
        },
    ]
});

export default router;
