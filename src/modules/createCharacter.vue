<template>
  <div v-if="visible" class="map-creator">
    <form @submit.prevent="saveMap">
      <label>Nom de la map :
        <input v-model="mapName" placeholder="Nom de ta map" required />
      </label>
      <div class="palette">
        <div v-for="color in colors"
             :key="color"
             class="palette-color"
             :class="{selected: color === selectedColor}"
             :style="{ background: color }"
             @click="selectedColor = color"/>
      </div>
      <div class="grid">
        <div v-for="(row, y) in grid" :key="y" class="row">
          <div v-for="(color, x) in row" :key="x"
               class="pixel"
               :style="{ background: color || '#fff' }"
               @click="pickPixel(x, y)" />
        </div>
      </div>
      <button type="submit">Construire la map</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const mapName = ref('')
const colors = [
  "#4caf50", // vert
  "#795548", // marron
  "#ffeb3b", // jaune
  "#607d8b", // gris
  "#fff",    // blanc
  "#000"     // noir
]
const selectedColor = ref(colors[0])
const grid = ref(
  Array.from({ length: 16 }, () =>
    Array.from({ length: 16 }, () => null)
  )
)

function pickPixel(x, y) {
  grid.value[y][x] = selectedColor.value
}

function saveMap() {
  // Événement global : map à afficher en 3D
  window.dispatchEvent(new CustomEvent('map:create', { detail: {
    mapName: mapName.value,
    grid: grid.value.map(row => [...row])
  }}))
  visible.value = false
}

function onGameStart() {
  visible.value = true
}
onMounted(() => {
  window.addEventListener('game:start', onGameStart)
})
onUnmounted(() => {
  window.removeEventListener('game:start', onGameStart)
})
</script>

<style scoped>
.map-creator { background: #f0f0f0cc; border-radius: 1em; padding: 2em; display: inline-block; }
.grid { display: flex; flex-direction: column; margin: 1em 0; }
.row { display: flex; }
.pixel {
  width: 18px; height: 18px;
  border: 1px solid #ccc; cursor: pointer;
  transition: background 0.1s;
}
.palette { display: flex; margin-bottom: 1em; }
.palette-color {
  width: 24px; height: 24px; margin-right: 5px; border-radius: 4px;
  border: 2px solid #aaa; cursor: pointer;
}
.palette-color.selected { border-color: #222; }
button { margin-top: 1em; }
</style>
