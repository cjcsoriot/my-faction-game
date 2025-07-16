<template></template>
<script setup>
import { onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

let cube

function tryAddCube() {
  if (window.scene) {
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 })
    cube = new THREE.Mesh(geometry, material)
    window.scene.add(cube)
  } else {
    // Re-tente dans 100ms si la scène n'est pas prête
    setTimeout(tryAddCube, 100)
  }
}

onMounted(() => {
  tryAddCube()
})

onUnmounted(() => {
  // Enlève le cube si on démonte le module
  if (cube && window.scene) window.scene.remove(cube)
})
</script>
