<template>
  <canvas ref="canvas" style="display:block;width:100vw;height:100vh;"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'

const canvas = ref(null)

onMounted(() => {
  const renderer = new THREE.WebGLRenderer({ canvas: canvas.value })
  renderer.setSize(window.innerWidth, window.innerHeight)
  const scene = new THREE.Scene()
  window.scene = scene
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 5
  window.camera = camera

  // Ajout d'une lumière pour voir les MeshStandardMaterial
  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(10, 10, 10)
  scene.add(light)

  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
})
</script>
