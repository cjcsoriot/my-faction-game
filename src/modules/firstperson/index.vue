<template></template>
<script setup>
import { onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'

let controls, velocity, direction, moveForward, moveBackward, moveLeft, moveRight, canJump, prevTime, animationId

function setupControls() {
  const scene = window.scene
  const camera = window.camera
  const rendererCanvas = document.querySelector('canvas')
  if (!scene || !camera || !rendererCanvas) {
    setTimeout(setupControls, 100)
    return
  }

  controls = new PointerLockControls(camera, rendererCanvas)
  scene.add(controls.getObject())

  velocity = new THREE.Vector3()
  direction = new THREE.Vector3()
  moveForward = moveBackward = moveLeft = moveRight = false
  canJump = false
  prevTime = performance.now()

  // Mouse click to lock pointer
  rendererCanvas.addEventListener('click', () => {
    controls.lock()
  })

  // Keyboard controls
function onKeyDown(event) {
  switch (event.code) {
    case 'ArrowUp':
    case 'KeyW':
    case 'KeyZ': moveForward = true; break
    case 'ArrowLeft':
    case 'KeyA': moveRight = true; break     // ← ICI !
    case 'ArrowDown':
    case 'KeyS': moveBackward = true; break
    case 'ArrowRight':
    case 'KeyD': moveLeft = true; break      // ← ICI !
    case 'Space':
      if (canJump === true) velocity.y += 6
      canJump = false
      break
  }
}
function onKeyUp(event) {
  switch (event.code) {
    case 'ArrowUp':
    case 'KeyW':
    case 'KeyZ': moveForward = false; break
    case 'ArrowLeft':
    case 'KeyA': moveRight = false; break    // ← ICI !
    case 'ArrowDown':
    case 'KeyS': moveBackward = false; break
    case 'ArrowRight':
    case 'KeyD': moveLeft = false; break     // ← ICI !
  }
}

  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)

  // Simple ground at y=0
  function animate() {
    animationId = requestAnimationFrame(animate)
    const time = performance.now()
    const delta = (time - prevTime) / 1000

    velocity.x -= velocity.x * 10.0 * delta
    velocity.z -= velocity.z * 10.0 * delta
    velocity.y -= 25.0 * delta // gravity

    direction.z = Number(moveForward) - Number(moveBackward)
    direction.x = Number(moveRight) - Number(moveLeft)
    direction.normalize() // this ensures consistent movements in all directions

    
    if (moveForward) velocity.z -= 80.0 * delta
    if (moveBackward) velocity.z += 80.0 * delta
    if (moveLeft) velocity.x -= 80.0 * delta
    if (moveRight) velocity.x += 80.0 * delta

    controls.moveRight(-velocity.x * delta)
    controls.moveForward(-velocity.z * delta)

    controls.getObject().position.y += velocity.y * delta // new position

    if (controls.getObject().position.y < 1.5) {
      velocity.y = 0
      controls.getObject().position.y = 1.5
      canJump = true
    }
    prevTime = time
  }
  animate()

  // Unmount cleanup
  onUnmounted(() => {
    cancelAnimationFrame(animationId)
    document.removeEventListener('keydown', onKeyDown)
    document.removeEventListener('keyup', onKeyUp)
    if (scene && controls) scene.remove(controls.getObject())
  })
}

onMounted(setupControls)
</script>
