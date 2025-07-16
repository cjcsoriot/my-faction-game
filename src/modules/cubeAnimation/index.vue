<template></template>
<script setup>
import { onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

let cube
let animationId = null
let t = 0
let started = false
let handler

function animate() {
  t += 0.04
  if (cube) {
    cube.rotation.x += 0.08
    cube.rotation.y += 0.06
    cube.position.y = 1 + Math.abs(Math.sin(t) * 2)  // effet rebond
    cube.scale.setScalar(1 + 0.3 * Math.sin(t * 1.5)) // effet pulsation
  }
  animationId = requestAnimationFrame(animate)
}

function onClick(event) {
  // Trouve le canvas et la caméra
  const canvas = document.querySelector('canvas')
  const rect = canvas.getBoundingClientRect()
  // Normalise la position du clic
  const mouse = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  )
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, window.camera)
  const intersects = raycaster.intersectObject(cube)
  if (intersects.length && !started) {
    started = true
    animate()
  }
}

function tryAddCube() {
  if (window.scene && window.camera) {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffff, metalness: 0.5, roughness: 0.5 })
    cube = new THREE.Mesh(geometry, material)
    cube.position.x = -2
    window.scene.add(cube)
    // Ecoute le clic sur le canvas
    handler = onClick
    document.querySelector('canvas').addEventListener('mousedown', handler)
  } else {
    setTimeout(tryAddCube, 100)
  }
}

onMounted(() => {
  tryAddCube()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (cube && window.scene) window.scene.remove(cube)
  // Retire l'event listener
  const canvas = document.querySelector('canvas')
  if (canvas && handler) canvas.removeEventListener('mousedown', handler)
  cube = null
  started = false
})
</script>
