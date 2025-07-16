<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import * as THREE from 'three'

const canvas = ref(null)
let scene, camera, renderer

onMounted(() => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(10, 15, 25)
  camera.lookAt(10, 0, 10)

  renderer = new THREE.WebGLRenderer({ canvas: canvas.value })
  renderer.setSize(window.innerWidth, window.innerHeight)

  // Récupère les modules
  const modules = getCurrentInstance().appContext.config.globalProperties.$modules
  for (const mod of modules) {
    mod.init && mod.init({ scene, camera, renderer })
  }

  // Boucle de rendu
  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
})
</script>

<style>
html, body, #app, canvas {
  width: 100%;
  height: 100%;
  margin: 0;
  display: block;
}
</style>
