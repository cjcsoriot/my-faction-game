<template></template>
<script setup>
import { onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

let soleil, sunSphere, animationId

function animate() {
  // Tourne le soleil autour de la scène
  const t = Date.now() * 0.0001
  const sunPos = new THREE.Vector3(Math.sin(t) * 30, Math.cos(t) * 30, 20)
  soleil.position.copy(sunPos)
  sunSphere.position.copy(sunPos)
  animationId = requestAnimationFrame(animate)
}

function addSun() {
  if (!window.scene) {
    setTimeout(addSun, 100)
    return
  }
  soleil = new THREE.DirectionalLight(0xffeeaa, 1.5)
  soleil.position.set(20, 30, 20)
  soleil.castShadow = true
  soleil.shadow.camera.left = -50
  soleil.shadow.camera.right = 50
  soleil.shadow.camera.top = 50
  soleil.shadow.camera.bottom = -50
  soleil.shadow.camera.near = 1
  soleil.shadow.camera.far = 100
  soleil.shadow.mapSize.width = 2048
  soleil.shadow.mapSize.height = 2048
  window.scene.add(soleil)

  // Ajoute une sphère jaune à la position du soleil
  const geometry = new THREE.SphereGeometry(1.3, 32, 32)
  const material = new THREE.MeshBasicMaterial({ color: 0xffd700, emissive: 0xffff99 })
  sunSphere = new THREE.Mesh(geometry, material)
  sunSphere.position.copy(soleil.position)
  window.scene.add(sunSphere)

  animate()
}

onMounted(addSun)
onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (soleil && window.scene) window.scene.remove(soleil)
  if (sunSphere && window.scene) window.scene.remove(sunSphere)
  soleil = null
  sunSphere = null
})
</script>
