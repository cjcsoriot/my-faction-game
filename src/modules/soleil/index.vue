<template></template>
<script setup>
import { onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

let soleil, sunSphere, animationId

function animate() {
  // Angle de 0 (gauche) à PI (droite) = lever → coucher
  const t = (Date.now() * 0.00006) % Math.PI // Lent, et toujours entre 0 et PI

  // Trajectoire : arc de cercle dans le plan XZ/Y
  const radius = 50
  const x = -Math.cos(t) * radius   // de gauche (-radius) à droite (+radius)
  const y = Math.sin(t) * 30 + 15   // monte puis descend, +15 pour jamais passer sous le sol
  const z = 0

  soleil.position.set(x, y, z)
  sunSphere.position.set(x, y, z)

  animationId = requestAnimationFrame(animate)
}

function addSun() {
  if (!window.scene) {
    setTimeout(addSun, 100)
    return
  }
  soleil = new THREE.DirectionalLight(0xffeeaa, 1.8)
  soleil.position.set(-50, 15, 0)
  soleil.castShadow = true
  soleil.shadow.camera.left = -80
  soleil.shadow.camera.right = 80
  soleil.shadow.camera.top = 80
  soleil.shadow.camera.bottom = -80
  soleil.shadow.camera.near = 1
  soleil.shadow.camera.far = 150
  soleil.shadow.mapSize.width = 2048
  soleil.shadow.mapSize.height = 2048
  window.scene.add(soleil)

  // Un SOLEIL TRÈS GROS ! (rayon = 5)
  const geometry = new THREE.SphereGeometry(5, 64, 64)
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
