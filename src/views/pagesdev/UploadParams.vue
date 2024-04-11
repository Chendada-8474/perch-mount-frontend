<template>
    <div className="card">
        <h5>上傳參數產生器</h5>

        <div class="grid">
            <div class="col-6">

                <div class="grid">
                    <div class="col-4 flex flex-column gap-2">
                        <label for="perch_mount_id">棲架</label>
                        <Dropdown id="perch_mount_id" editable v-model="params.perchMount" :options="perchMountOptions"
                            :filter="true" filterMatchMode="contains" :filterFields="['name', 'code']"
                            optionLabel="name" placeholder="Select a Perch Mount" @change="editorChanged" />
                    </div>
                    <div class="col-4 flex flex-column gap-2">
                        <label for="valid">是否有效</label>
                        <ToggleButton id="valid" v-model="params.valid" onIcon="pi pi-check" offIcon="pi pi-times"
                            invalid class="w-full sm:w-10rem" aria-label="Confirmation" @change="editorChanged" />

                    </div>
                </div>

                <div class="grid">
                    <div class="col-4 flex flex-column gap-2">
                        <label for="check_date">回收日期</label>
                        <Calendar id="check_date" v-model="params.checkDate" dateFormat="yy-mm-dd"
                            @date-select="editorChanged" />
                    </div>
                    <div class="col-4 flex flex-column gap-2">
                        <label for="camera_id">相機</label>
                        <Dropdown id="camera_id" v-model="params.camera" :options="cameraOptions" optionLabel="name"
                            placeholder="Select a Camera" @change="editorChanged" />

                    </div>
                    <div class="col-4 flex flex-column gap-2">
                        <label for="mount_type_id">棲架類型</label>
                        <Dropdown id="mount_type_id" v-model="params.mountType" :options="mountTypeOptions"
                            optionLabel="name" placeholder="Select a Mount Type" @change="editorChanged" />
                    </div>
                </div>

                <div class="grid">
                    <div class="col-12 flex flex-column gap-2">
                        <label for="operators">操作人員</label>
                        <MultiSelect id="operators" v-model="params.operators" display="chip" :options="memberOptions"
                            optionLabel="name" placeholder="Select operators" @change="editorChanged" />
                    </div>
                </div>

                <div class="grid">
                    <div class="col-12 flex flex-column gap-2">
                        <label for="note">備註</label>
                        <Textarea v-model="params.note" rows="5" @input="editorChanged" />
                    </div>
                </div>

                <div class="grid">
                    <div class="col-4 flex flex-column gap-2">
                        <label for="start_time">開始時間</label>
                        <Calendar id="start_time" v-model="params.startTime" showTime hourFormat="24"
                            @date-select="editorChanged" aria-describedby="start-time-help" />
                        <small id="start-time-help">若不需要校正開始時間，請不要填寫這個欄位。</small>
                    </div>
                </div>

            </div>

            <div class="col-6">
                <VCodeBlock :code="paramString" highlightjs lang="yaml" theme="stackoverflow-dark"
                    class="line-height-3 text-lg" copyTab>
                </VCodeBlock>
                <Button label="下載參數檔" icon="pi pi-download" @click="downloadClicked" />
            </div>
        </div>
    </div>
    <Toast />
</template>
<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast';
import moment from 'moment';

import VCodeBlock from '@wdns/vue-code-block';
import { getPerchMounts } from '../../service/PerchMounts'
import { getCameras } from '../../service/Cameras'
import { getMountTypes } from '../../service/MounTypes'
import { getMembers } from '../../service/Members'

const toast = useToast()

const projectMap = ref([])

const perchMountOptions = ref([])
const mountTypeOptions = ref([])
const cameraOptions = ref([])
const memberOptions = ref([])

const params = ref({
    perchMount: null,
    projectName: null,
    checkDate: "",
    camera: null,
    modelName: "",
    mountType: null,
    note: "",
    valid: true,
    operators: [],
    startTime: null,
})
const paramString = ref("")
paramString.value = getParamString(params.value)

getPerchMounts().then(data => {
    for (const perchMount of data.perch_mounts) {
        perchMountOptions.value.push({
            name: `${perchMount.perch_mount_name}`,
            // name: `${perchMount.perch_mount_id}. ${perchMount.perch_mount_name}`,
            perchMountName: perchMount.perch_mount_name,
            code: perchMount.perch_mount_id,
            projectID: perchMount.project,
        })
    }
    projectMap.value = data.projects
})

getCameras().then(data => {
    for (const camera of data.cameras) {
        cameraOptions.value.push({ name: camera.model_name, code: camera.camera_id })
    }
})

getMountTypes().then(data => {
    for (const mountType of data.mount_types) {
        mountTypeOptions.value.push({ name: mountType.name, code: mountType.mount_type_id })
    }
})

getMembers().then(data => {
    for (const member of data.members) {
        memberOptions.value.push({ name: member.first_name, code: member.member_id })
    }
})

function getParamString(params) {

    var perchMountName = (params.perchMount) ? params.perchMount.perchMountName : "<未選擇棲架>"
    var perchMountID = (params.perchMount) ? params.perchMount.code : "<未選擇棲架>"
    var projectName = (params.perchMount && projectMap.value[params.perchMount.projectID]) ? projectMap.value[params.perchMount.projectID].name : ""
    var checkDate = (params.checkDate) ? moment(params.checkDate).format('YYYY-MM-DD') : ""
    var cameraID = (params.camera) ? params.camera.code : ""
    var modelName = (params.camera) ? params.camera.name : ""
    var mountTypeID = (params.mountType) ? params.mountType.code : ""
    var mountTypeName = (params.mountType) ? params.mountType.name : ""

    var operators = []
    for (const operator of params.operators) {
        operators.push(operator.code)
    }

    var code = `# 將 ${perchMountName}_${checkDate}.yaml 檔案放在要上傳的資料夾中
perch_mount_id: ${perchMountID}
perch_mount_name: ${perchMountName}
project: ${projectName}
check_date: ${checkDate}
camera: ${cameraID}      # ${modelName}
mount_type: ${mountTypeID}       # ${mountTypeName}
note: ${params.note}
valid: ${params.valid}
operators: [${operators.join(', ')}]
start_time: ${moment(params.startTime).toISOString()}`
    return code
}

function editorChanged() {
    paramString.value = getParamString(params.value)
}


function downloadClicked() {
    if (!isParamsValid()) {
        toast.add({ severity: 'warn', summary: '下載失敗', detail: "資料還沒填完欸", life: 3000 })
        return
    }
    downloadString(paramString.value, 'text/yaml', `${params.value.perchMount.name}_${moment(params.value.checkDate).format('YYYY-MM-DD')}.yaml`)
}


function downloadString(text, fileType, fileName) {
    var save_text = text + "\nuploaded: false"
    var blob = new Blob([save_text], { type: fileType });

    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
}

function isParamsValid() {
    return params.value.perchMount && params.value.checkDate && params.value.camera && params.value.mountType && params.value.operators && params.value.note
}
</script>