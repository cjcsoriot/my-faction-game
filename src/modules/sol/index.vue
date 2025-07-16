<template></template>
<script setup>
import { onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

let sol

function addGround() {
  if (!window.scene) {
    setTimeout(addGround, 100)
    return
  }
  // Un sol immense (1000x1000, tu peux mettre plus)
  const geometry = new THREE.PlaneGeometry(1000, 1000)
  // Material simple vert clair
  const material = new THREE.MeshStandardMaterial({ color: 0x7ec850 })
  sol = new THREE.Mesh(geometry, material)
  sol.rotation.x = -Math.PI / 2 // à plat (horizontal)
  sol.position.y = 0
  sol.receiveShadow = true
  window.scene.add(sol)
}

onMounted(addGround)
onUnmounted(() => {
  if (sol && window.scene) window.scene.remove(sol)
  sol = null
})
</script>
