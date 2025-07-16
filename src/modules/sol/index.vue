<template></template>
<script setup>
import { onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const CUBE_SIZE = 2
const WIDTH = 25
const DEPTH = 25
let group

function addCubesGround() {
  if (!window.scene) return setTimeout(addCubesGround, 50)
  group = new THREE.Group()
  for (let x = 0; x < WIDTH; x++) {
    for (let z = 0; z < DEPTH; z++) {
      const geo = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE)
      const mat = new THREE.MeshStandardMaterial({ color: 0x65a840 })
      const cube = new THREE.Mesh(geo, mat)
      cube.castShadow = true
      cube.receiveShadow = true
      cube.position.set(
        x * CUBE_SIZE - (WIDTH * CUBE_SIZE) / 2,
        -CUBE_SIZE / 2,
        z * CUBE_SIZE - (DEPTH * CUBE_SIZE) / 2
      )
      group.add(cube)
    }
  }
  window.scene.add(group)
}
onMounted(addCubesGround)
onUnmounted(() => {
  if (group && window.scene) window.scene.remove(group)
})
</script>
