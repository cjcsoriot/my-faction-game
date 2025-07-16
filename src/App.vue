<template>
  <div>
    <component
      v-for="mod in loadedModules"
      :key="mod.name"
      :is="mod.component"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, markRaw } from 'vue'

const loadedModules = ref([])

async function loadModules() {
  // Charge tous les modules automatiquement
  const modules = import.meta.glob('./modules/*/index.js', { eager: true })

  for (const path in modules) {
    const mod = modules[path].default
    if (mod.autostart) {
      const comp = await mod.component()
      // 👉 C’est ici qu’il faut mettre markRaw :
      loadedModules.value.push({ name: mod.name, component: markRaw(comp.default) })
    }
  }
}

onMounted(loadModules)
</script>
