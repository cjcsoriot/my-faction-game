import * as THREE from 'three'

export default {
  name: "map",
  init({ scene }) {
    // Fond ciel bleu
    scene.background = new THREE.Color(0x87ceeb);

    // Sol 20x20 (à Y=0)
    const floorGeometry = new THREE.BoxGeometry(1, 1, 1);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x4caf50 });
    for (let x = 0; x < 20; x++) {
      for (let z = 0; z < 20; z++) {
        const cube = new THREE.Mesh(floorGeometry, floorMaterial.clone());
        cube.position.set(x, 0, z); // Y = 0
        cube.userData.isFloor = true;
        scene.add(cube);
      }
    }

    // Soleil sphérique
    if (!scene.getObjectByName('sun')) {
      const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
      const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xfff680 });
      const sun = new THREE.Mesh(sunGeometry, sunMaterial);
      sun.position.set(12, 18, -8);
      sun.name = 'sun';
      scene.add(sun);
    }

    // Lumière directionnelle (du soleil)
    if (!scene.getObjectByName('sunLight')) {
      const sunLight = new THREE.DirectionalLight(0xfffbe0, 1.6);
      sunLight.position.set(12, 18, -8);
      sunLight.name = 'sunLight';
      scene.add(sunLight);
    }

    // Ambiance
    if (!scene.getObjectByName('ambientLight')) {
      const ambient = new THREE.AmbientLight(0x87ceeb, 0.42);
      ambient.name = 'ambientLight';
      scene.add(ambient);
    }

    // Listener création murs custom (toujours même orientation X/Z !)
    window.addEventListener('map:create', e => {
      // Supprime anciens murs (pas le sol !)
      for (let obj of scene.children.slice()) {
        if (obj.userData && obj.userData.isCustomWall) scene.remove(obj);
      }
      const grid = e.detail.grid;
      const wallGeometry = new THREE.BoxGeometry(1, 1, 1);
      for (let z = 0; z < grid.length; z++) {
        for (let x = 0; x < grid[z].length; x++) {
          const color = grid[z][x];
          if (!color) continue;
          for (let h = 0; h < 3; h++) { // hauteur de 3
            const material = new THREE.MeshStandardMaterial({ color });
            const cube = new THREE.Mesh(wallGeometry, material);
            cube.position.set(x, h + 1, z); // Murs à partir de Y=1 !
            cube.userData.isCustomWall = true;
            scene.add(cube);
          }
        }
      }
    });
  }
}
