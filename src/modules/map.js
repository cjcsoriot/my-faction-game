// src/modules/map.js
import * as THREE from 'three'

export default {
  name: "map",
  init({ scene }) {
    // Crée un sol de 20x20 cubes (taille 1)
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({ color: 0x4caf50 })

    for (let x = 0; x < 20; x++) {
      for (let z = 0; z < 20; z++) {
        const cube = new THREE.Mesh(geometry, material.clone())
        cube.position.set(x, 0, z)
        scene.add(cube)
      }
    }

    // Optionnel : ajoute une lumière si tu veux voir le sol
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(10, 20, 10)
    scene.add(light)
  }
}
