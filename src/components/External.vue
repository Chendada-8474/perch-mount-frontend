<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const map = {
    release: 'https://github.com/Chendada-8474/perch-mount-frontend/releases'
}

if (!map[route.params.service]) {
    window.location.replace("/pages/notfound")
} else {
    window.open(map[route.params.service], '_blank')
}

history.back()

</script>