<template></template>
<script>
import * as THREE from 'three'
import { addCube, setGroup } from '../cubeCreator/index.vue'

function waitForSceneAndGroup() {
  return new Promise(resolve => {
    const check = () => {
      if (window.scene && window.camera) {
        const group = new THREE.Group()
        window.scene.add(group)
        setGroup(group)
        resolve()
      } else {
        setTimeout(check, 100)
      }
    }
    check()
  })
}

async function generateFlatGround(width, depth, y = 0) {
  await waitForSceneAndGroup()
  for (let x = 0; x < width; x++) {
    for (let z = 0; z < depth; z++) {
      addCube(x, y, z, 0x4caf50)
    }
  }
}

// Lancement automatique
generateFlatGround(20, 20, 0)
</script>
