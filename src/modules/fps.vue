<template>
  <div v-if="visible" class="playmap-ui">
    <button @click="play">Jouer en FPS</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
let controlsActive = false
let scene = null, camera = null, renderer = null
let velocity = { x: 0, z: 0 }
let direction = { x: 0, z: 0 }
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false

function activateFPS() {
  controlsActive = true
  visible.value = false

  // --- TROUVER POSITION DE SPAWN SUR LE SOL (première case libre, Y = 1.7) ---
  let spawnX = 8, spawnZ = 8
  if (scene) {
    let found = false
    for (let z = 0; z < 16; z++) {
      for (let x = 0; x < 16; x++) {
        let hasWall = false
        for (let obj of scene.children) {
          if (obj.userData && obj.userData.isCustomWall
            && Math.abs(obj.position.x - x) < 0.5
            && Math.abs(obj.position.z - z) < 0.5) {
            hasWall = true
            break
          }
        }
        if (!hasWall) {
          spawnX = x
          spawnZ = z
          found = true
          break
        }
      }
      if (found) break
    }
  }

  // Place la caméra juste au-dessus du sol
  if (camera) {
    camera.position.set(spawnX, 1.7, spawnZ)
    camera.rotation.set(0, 0, 0)
    camera.lookAt(spawnX, 1.7, spawnZ + 1)
  }

  document.body.requestPointerLock()
  animateFPS()
}

function onKeyDown(event) {
  switch (event.code) {
    case 'KeyW': moveForward = true; break
    case 'KeyA': moveLeft = true; break
    case 'KeyS': moveBackward = true; break
    case 'KeyD': moveRight = true; break
  }
}
function onKeyUp(event) {
  switch (event.code) {
    case 'KeyW': moveForward = false; break
    case 'KeyA': moveLeft = false; break
    case 'KeyS': moveBackward = false; break
    case 'KeyD': moveRight = false; break
  }
}
function onMouseMove(event) {
  if (!controlsActive) return
  if (camera && document.pointerLockElement) {
    camera.rotation.y += event.movementX * 0.002
    camera.rotation.x += event.movementY * 0.002
    camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x))
  }
}

function animateFPS() {
  if (!controlsActive) return
  requestAnimationFrame(animateFPS)

  // Mouvement
  direction.x = Number(moveRight) - Number(moveLeft)
  direction.z = Number(moveForward) - Number(moveBackward)

  // Normalisation et vitesse
  let speed = 0.13
  if (direction.x !== 0 || direction.z !== 0) {
    let len = Math.sqrt(direction.x * direction.x + direction.z * direction.z)
    direction.x /= len
    direction.z /= len
    let angle = camera.rotation.y
    let moveX = Math.sin(angle) * direction.z + Math.cos(angle) * direction.x
    let moveZ = Math.cos(angle) * direction.z - Math.sin(angle) * direction.x
    // Calcul nouvelle position
    let nextX = camera.position.x + moveX * speed
    let nextZ = camera.position.z + moveZ * speed
    // Collision : si y a un mur, on ne bouge pas
    if (!collide(nextX, nextZ)) {
      camera.position.x = nextX
      camera.position.z = nextZ
    }
  }
  // Toujours garder la caméra à hauteur
  camera.position.y = 1.7
}

function collide(x, z) {
  // Collision murs :
  if (!scene) return false
  for (let obj of scene.children) {
    if (obj.userData && obj.userData.isCustomWall) {
      let dist = Math.sqrt((x - obj.position.x) ** 2 + (z - obj.position.z) ** 2)
      if (dist < 0.45 && Math.abs(camera.position.y - obj.position.y) < 2) return true
    }
  }
  // Limite sur les bords de la map
  if (x < 0.5 || z < 0.5 || x > 19.5 || z > 19.5) return true
  return false
}

function play() {
  activateFPS()
}

function onMapCreate() {
  visible.value = true
}
onMounted(() => {
  setTimeout(() => {
    const inst = window._threeContext
    if (inst) {
      scene = inst.scene
      camera = inst.camera
      renderer = inst.renderer
    }
  }, 500)
  window.addEventListener('map:create', onMapCreate)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('mousemove', onMouseMove)
})
onUnmounted(() => {
  window.removeEventListener('map:create', onMapCreate)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  window.removeEventListener('mousemove', onMouseMove)
})
</script>

<style scoped>
.playmap-ui {
  position: fixed; z-index: 9999; inset: 0;
  display: flex; justify-content: center; align-items: center;
  pointer-events: all;
}
button {
  background: #111; color: #fff; border-radius: 1em;
  font-size: 2em; border: none; padding: 1em 2em;
  box-shadow: 0 8px 40px #0009;
  cursor: pointer; font-weight: bold; transition: background 0.2s;
}
button:hover { background: #194fa3; }
</style>
