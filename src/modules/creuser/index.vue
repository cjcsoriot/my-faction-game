<template></template>
<script setup>
import { onMounted, onUnmounted, nextTick } from 'vue'
import * as THREE from 'three'

let highlight = null
let lastTarget = null
let stopHighlight = false

function addHighlight(target) {
  if (highlight && window.scene) window.scene.remove(highlight)
  highlight = new THREE.BoxHelper(target, 0xffff00)
  window.scene.add(highlight)
}

function removeHighlight() {
  if (highlight && window.scene) window.scene.remove(highlight)
  highlight = null
  lastTarget = null
}

function highlightLoop() {
  if (stopHighlight) return
  const camera = window.camera
  const scene = window.scene
  if (!camera || !scene) return requestAnimationFrame(highlightLoop)
  const group = scene.children.find(obj => obj.isGroup)
  if (!group) return requestAnimationFrame(highlightLoop)
  const cubes = group.children.filter(c => c.visible)
  const mouse = new THREE.Vector2(0, 0) // CENTRE ECRAN
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(cubes)
  if (intersects.length) {
    const target = intersects[0].object
    if (lastTarget !== target) {
      addHighlight(target)
      lastTarget = target
    }
  } else {
    if (highlight) removeHighlight()
  }
  if (highlight && lastTarget) highlight.update()
  requestAnimationFrame(highlightLoop)
}

function creuserCube(event) {
  const camera = window.camera
  const scene = window.scene
  if (!camera || !scene) return
  const group = scene.children.find(obj => obj.isGroup)
  if (!group) return
  const cubes = group.children.filter(c => c.visible)
  const mouse = new THREE.Vector2(0, 0) // CENTRE ECRAN (crosshair FPS)
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(cubes)
  if (!intersects.length) return
  const target = intersects[0].object
  target.visible = false
  if (lastTarget === target) removeHighlight()
}

onMounted(() => {
  nextTick(() => {
    stopHighlight = false
    highlightLoop()
    function wait() {
      const canvas = document.querySelector('canvas')
      if (!canvas) return setTimeout(wait, 50)
      canvas.addEventListener('mousedown', creuserCube)
    }
    wait()
  })
})
onUnmounted(() => {
  stopHighlight = true
  removeHighlight()
  const canvas = document.querySelector('canvas')
  if (canvas) canvas.removeEventListener('mousedown', creuserCube)
})
</script>
