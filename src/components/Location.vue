<template>
    <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height: 100%;">
        <ol-view ref="view" :center="center" :zoom="zoom" projection="EPSG:4326" />

        <ol-tile-layer>
            <ol-source-osm />
        </ol-tile-layer>

        <ol-vector-layer>
            <ol-source-vector>
                <ol-feature>
                    <ol-geom-point :coordinates="point"></ol-geom-point>
                    <ol-style>
                        <ol-style-circle :radius="5">
                            <ol-style-fill color="white"></ol-style-fill>
                            <ol-style-stroke color="red" :width="2"></ol-style-stroke>
                        </ol-style-circle>
                    </ol-style>
                </ol-feature>
            </ol-source-vector>
        </ol-vector-layer>
    </ol-map>
</template>

<script setup>

const props = defineProps({
    center: { type: Array, default: [22.645327, 120.606588] },
    zoom: { type: Number, default: 12 },
    point: { type: Array[Number], default: [22.645327, 120.606588] },

})
</script>

<style>
canvas {
    border-radius: 0.375rem !important;
}
</style>