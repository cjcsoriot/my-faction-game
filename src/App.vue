<template>
  <canvas ref="canvas"></canvas>
  <div class="modules-ui">
    <component
      v-for="(mod, i) in vueModules"
      :is="mod"
      :key="i"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'

// Auto-import de tous les modules
const jsModules = []
const vueModules = []
const filesJS = import.meta.glob('./modules/*.js', { eager: true })
const filesVue = import.meta.glob('./modules/*.vue', { eager: true })
for (const path in filesJS) if (filesJS[path].default) jsModules.push(filesJS[path].default)
for (const path in filesVue) if (filesVue[path].default) vueModules.push(filesVue[path].default)

const canvas = ref(null)
let scene, camera, renderer

onMounted(() => {
  // --- 1. Création de la scène principale
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(10, 15, 25)
  camera.lookAt(10, 0, 10)
  renderer = new THREE.WebGLRenderer({ canvas: canvas.value })
  renderer.setSize(window.innerWidth, window.innerHeight)

  // --- 2. Partage du contexte global pour les modules Vue (.vue)
  window._threeContext = { scene, camera, renderer }

  // --- 3. Initialisation de tous les modules JS (map.js, etc.)
  for (const mod of jsModules) mod.init && mod.init({ scene, camera, renderer })

  // --- 4. Boucle d’animation classique Three.js
  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
})
</script>

<style>
html, body, #app, canvas { width: 100%; height: 100%; margin: 0; display: block; }
.modules-ui {
  position: absolute; top: 20px; right: 20px; z-index: 10;
}
</style>
