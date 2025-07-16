<template>
  <div v-if="visible" class="loading-screen">
    <div class="loading-content">
      <div v-if="!ready">Chargement du jeu...</div>
      <button v-else @click="startGame">Cliquez pour jouer</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(true)
const ready = ref(false)

// Simulation du chargement (remplace par tes vrais assets/events)
onMounted(() => {
  setTimeout(() => {
    ready.value = true
  }, 1500) // 1.5s de chargement simulé
})

function startGame() {
  visible.value = false

  // Pour communiquer le “démarrage du jeu” aux autres modules
  window.dispatchEvent(new Event('game:start'))
}
</script>

<style scoped>
.loading-screen {
  position: fixed;
  z-index: 9999;
  inset: 0;
  background: #151e2d;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loading-content {
  color: #fff;
  font-size: 2em;
  text-align: center;
}
button {
  background: #48f372;
  color: #151e2d;
  font-weight: bold;
  font-size: 1em;
  border: none;
  border-radius: 0.7em;
  padding: 1em 2em;
  margin-top: 1.5em;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover {
  background: #2fbb55;
}
</style>
