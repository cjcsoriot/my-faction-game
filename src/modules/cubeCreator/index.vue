<template></template>
<script>
import * as THREE from 'three'

const CUBE_SIZE = 1
let group = null
const cubesMap = new Map()
const collisionMap = new Map()

function posToKey(x, y, z) {
  return `${x},${y},${z}`
}

export function setGroup(g) {
  group = g
}

export function addCube(x, y, z, color = 0x4caf50) {
  console.log('ok')
  if (!group) return
  const key = posToKey(x, y, z)
  if (cubesMap.has(key)) return

  const geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE)
  const material = new THREE.MeshStandardMaterial({ color })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.set(x * CUBE_SIZE, y * CUBE_SIZE, z * CUBE_SIZE)
  cube.castShadow = true
  cube.receiveShadow = true
  group.add(cube)
  cubesMap.set(key, cube)
  collisionMap.set(key, true)
}

export function removeCube(x, y, z) {
  const key = posToKey(x, y, z)
  const cube = cubesMap.get(key)
  if (!cube) return
  group.remove(cube)
  cubesMap.delete(key)
  collisionMap.delete(key)
}

export { collisionMap }
</script>
