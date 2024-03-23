<template>
    <div class="relative">
        <div class="absolute cursor-crosshair z-5"
            :style="{ height: canvaSize.height + 'px', width: canvaSize.width + 'px' }" @mousemove="trackMouseMove"
            @mouseup="mouseUp" @mousedown="mouseDown">
        </div>
        <div v-show="insertingBox.visible" class="absolute border-round border-3 border-white-alpha-50"
            :style="insertingBoxStyle"></div>
        <div v-for="individual of individuals" class="absolute border-round border-3 border-primary-500 z-0"
            :style="individual.boxStyle">
        </div>
        <div class="absolute border-white border-bottom-1" :style="hotizontalLineStyles"></div>
        <div class="absolute border-white border-right-1" :style="verticalLineStyles"></div>
        <img ref="image" :src="props.path" class="max-w-full cursor-crosshair" alt="" draggable="false">
    </div>
    <p>x: {{ (mousePos.x / canvaSize.width).toFixed(4) }} y: {{ (mousePos.y / canvaSize.height).toFixed(4) }}</p>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'

const image = ref(null)
const canvaSize = ref({ width: 1, height: 1 })
const mousePos = ref({ x: 0, y: 0 })
const individuals = ref([])
const hotizontalLineStyles = ref({})
const verticalLineStyles = ref({})

const emit = defineEmits()

const insertingBox = ref({
    visible: false,
    startX: 0,
    startY: 0,
})

const insertingBoxStyle = ref({
    left: '0px',
    top: '0px',
    width: '0px',
    height: '0px',
})

const props = defineProps({
    path: { type: String },
    individuals: {},
})

individuals.value = props.individuals

onMounted(() => {
    canvaSize.value.width = image.value.width
    canvaSize.value.height = image.value.height
    for (const individual of individuals.value) {
        individual.boxStyle = individualBoxStyle(individual.xmin, individual.xmax, individual.ymin, individual.ymax)
    }
})

watch(() => {
    for (const individual of individuals.value) {
        individual.boxStyle = individualBoxStyle(individual.xmin, individual.xmax, individual.ymin, individual.ymax)
    }
})

function trackMouseMove(event) {
    mousePos.value.x = event.offsetX
    mousePos.value.y = event.offsetY
    canvaSize.value.width = image.value.width
    canvaSize.value.height = image.value.height
    hotizontalLineStyles.value = {
        height: Math.max(event.offsetY) + 'px', width: image.value.width + 'px'
    }
    verticalLineStyles.value = {
        height: image.value.height + 'px', width: Math.max(event.offsetX) + 'px'
    }
    insertingBoxStyle.value.left = Math.min(insertingBox.value.startX, mousePos.value.x) + 'px'
    insertingBoxStyle.value.top = Math.min(insertingBox.value.startY, mousePos.value.y) + 'px'
    insertingBoxStyle.value.width = Math.abs(insertingBox.value.startX - mousePos.value.x) + 'px'
    insertingBoxStyle.value.height = Math.abs(insertingBox.value.startY - mousePos.value.y) + 'px'
}

function mouseUp(event) {
    insertingBox.value.visible = false
    const left = Math.min(insertingBox.value.startX, event.offsetX)
    const top = Math.min(insertingBox.value.startY, event.offsetY)
    const right = Math.max(insertingBox.value.startX, event.offsetX)
    const bottom = Math.max(insertingBox.value.startY, event.offsetY)

    emit('added', {
        xmin: (left / canvaSize.value.width).toFixed(4),
        xmax: (right / canvaSize.value.width).toFixed(4),
        ymin: (top / canvaSize.value.height).toFixed(4),
        ymax: (bottom / canvaSize.value.height).toFixed(4),
    })
}

function mouseDown(event) {
    insertingBox.value.visible = true
    insertingBox.value.startX = event.offsetX
    insertingBox.value.startY = event.offsetY
    insertingBoxStyle.value.width = '0px'
    insertingBoxStyle.value.height = '0px'
}


function individualBoxStyle(xmin, xmax, ymin, ymax) {
    var left = xmin * canvaSize.value.width
    var top = ymin * canvaSize.value.height
    var width = (xmax - xmin) * canvaSize.value.width
    var height = (ymax - ymin) * canvaSize.value.height
    return {
        left: left + 'px',
        top: top + 'px',
        width: width + 'px',
        height: height + 'px',
    }
}



</script>
