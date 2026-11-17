import * as THREE from 'three';

export type CityScene = {
  setProgress: (progress: number) => void;
  setPointer: (x: number, y: number) => void;
  destroy: () => void;
};

export function mountCity(canvas: HTMLCanvasElement): CityScene {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x07060c, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07060c, 0.028);
  scene.background = new THREE.Color(0x07060c);

  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 200);
  camera.position.set(0, 2.4, 22); // start far back for cinematic approach

  // ── Lighting ──────────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x8ea0c8, 0.28));

  const moon = new THREE.DirectionalLight(0xc9d4ff, 1.4);
  moon.position.set(-8, 14, 6);
  scene.add(moon);

  // Neon city glow lights — gold, magenta, cyan
  const gold = new THREE.PointLight(0xf5b400, 24, 32);
  gold.position.set(-3.2, 2.8, 8);
  scene.add(gold);

  const magenta = new THREE.PointLight(0xff2f86, 20, 30);
  magenta.position.set(3.4, 2.4, 4);
  scene.add(magenta);

  const cyan = new THREE.PointLight(0x39d0ff, 14, 26);
  cyan.position.set(0, 4, -6);
  scene.add(cyan);

  const sunset2 = new THREE.PointLight(0xff6b3d, 10, 20);
  sunset2.position.set(5, 1.5, 12);
  scene.add(sunset2);

  // ── Road ──────────────────────────────────────────────────────────────────
  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 110),
    new THREE.MeshStandardMaterial({ color: 0x0e1118, roughness: 0.9, metalness: 0.08 }),
  );
  road.rotation.x = -Math.PI / 2;
  road.position.z = -20;
  scene.add(road);

  // Road center dashes
  const dashGeo = new THREE.BoxGeometry(0.11, 0.015, 1.05);
  const dashMat = new THREE.MeshStandardMaterial({
    color: 0xf5b400,
    emissive: 0xf5b400,
    emissiveIntensity: 1.2,
  });
  const dashes = new THREE.InstancedMesh(dashGeo, dashMat, 32);
  const dashDummy = new THREE.Object3D();
  for (let i = 0; i < 32; i += 1) {
    dashDummy.position.set(0, 0.02, 14 - i * 2.6);
    dashDummy.updateMatrix();
    dashes.setMatrixAt(i, dashDummy.matrix);
  }
  scene.add(dashes);

  // Sidewalk strips
  for (const side of [-1, 1]) {
    const walk = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 110),
      new THREE.MeshStandardMaterial({ color: 0x1a1d28, roughness: 0.95 }),
    );
    walk.rotation.x = -Math.PI / 2;
    walk.position.set(side * 5.9, 0.005, -20);
    scene.add(walk);
  }

  // ── Buildings ─────────────────────────────────────────────────────────────
  const buildingGeo = new THREE.BoxGeometry(1, 1, 1);
  const buildingMat = new THREE.MeshStandardMaterial({
    color: 0x181d2a,
    roughness: 0.58,
    metalness: 0.48,
  });
  const buildings = new THREE.InstancedMesh(buildingGeo, buildingMat, 70);
  const dummy = new THREE.Object3D();

  for (let i = 0; i < 70; i += 1) {
    const side = i % 2 === 0 ? -1 : 1;
    const row = Math.floor(i / 2);
    const height = 1.8 + ((i * 19) % 11) * 0.5;
    const width = 0.9 + ((i * 5) % 5) * 0.2;
    const depth = 0.7 + (i % 4) * 0.22;
    dummy.position.set(side * (3.8 + (row % 3) * 0.9), height / 2, 12 - row * 1.6);
    dummy.scale.set(width, height, depth);
    dummy.updateMatrix();
    buildings.setMatrixAt(i, dummy.matrix);
    // Most buildings dark, some neon-accented
    const neon = i % 4 === 0;
    const neonColors = [0xf5b400, 0xff2f86, 0x39d0ff, 0xff6b3d];
    buildings.setColorAt(i, new THREE.Color(neon ? neonColors[i % neonColors.length] : 0x1e2438));
  }
  if (buildings.instanceColor) buildings.instanceColor.needsUpdate = true;
  scene.add(buildings);

  // ── Neon signs on buildings ───────────────────────────────────────────────
  const neonSignColors = [0xf5b400, 0xff2f86, 0x39d0ff, 0xff6b3d, 0xffe56a];
  const neonSigns: THREE.Mesh[] = [];

  function addNeonSign(x: number, y: number, z: number, w: number, h: number, colorHex: number) {
    const signMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 4.5,
      transparent: true,
      opacity: 0.92,
    });
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(w, h), signMat);
    sign.position.set(x, y, z);
    scene.add(sign);
    neonSigns.push(sign);
    // Add a small point light for the glow
    const glow = new THREE.PointLight(colorHex, 6, 5);
    glow.position.set(x, y, z + 0.1);
    scene.add(glow);
  }

  addNeonSign(-5.2, 4.8, 2, 1.1, 0.35, neonSignColors[0]);
  addNeonSign(5.6, 5.5, -2, 0.9, 0.3, neonSignColors[1]);
  addNeonSign(-5.8, 3.2, -4, 1.3, 0.28, neonSignColors[2]);
  addNeonSign(6, 6, -6, 0.8, 0.32, neonSignColors[0]);
  addNeonSign(-4.5, 7, -8, 1.0, 0.3, neonSignColors[3]);
  addNeonSign(5.2, 4, -10, 1.2, 0.26, neonSignColors[4]);
  addNeonSign(-6.2, 5.5, -12, 0.9, 0.3, neonSignColors[1]);
  addNeonSign(6.5, 3.5, 6, 1.1, 0.28, neonSignColors[2]);

  // ── Palm trees ────────────────────────────────────────────────────────────
  function palm(x: number, z: number) {
    const group = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.11, 1.8, 7),
      new THREE.MeshStandardMaterial({ color: 0x3a2a1c, roughness: 0.9 }),
    );
    trunk.position.y = 0.9;
    group.add(trunk);
    const frondMat = new THREE.MeshStandardMaterial({
      color: 0x1f6b3a,
      emissive: 0x0c3a22,
      emissiveIntensity: 0.3,
      side: THREE.DoubleSide,
    });
    for (let i = 0; i < 6; i += 1) {
      const frond = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.26), frondMat);
      frond.position.y = 1.9;
      frond.rotation.y = (i / 6) * Math.PI * 2;
      frond.rotation.z = -0.65;
      group.add(frond);
    }
    group.position.set(x, 0, z);
    scene.add(group);
  }

  palm(-4.5, 8);
  palm(4.6, 4);
  palm(-4.8, -2);
  palm(4.8, -6);
  palm(-5, -10);
  palm(5.2, -14);

  // ── Car with headlights ───────────────────────────────────────────────────
  const car = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xf5b400,
    metalness: 0.75,
    roughness: 0.22,
    emissive: 0x5a3d00,
    emissiveIntensity: 0.3,
  });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.34, 3.4), bodyMat);
  body.position.y = 0.4;
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(1.22, 0.3, 1.4),
    new THREE.MeshStandardMaterial({
      color: 0x10141c,
      metalness: 0.82,
      roughness: 0.12,
      emissive: 0x39d0ff,
      emissiveIntensity: 0.2,
    }),
  );
  cabin.position.set(0, 0.68, -0.12);
  car.add(body, cabin);

  // Headlamps
  const lampMat = new THREE.MeshStandardMaterial({
    color: 0xfff4d0,
    emissive: 0xfff4d0,
    emissiveIntensity: 3,
  });
  const leftLamp = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.09, 0.07), lampMat);
  const rightLamp = leftLamp.clone();
  leftLamp.position.set(-0.46, 0.42, 1.72);
  rightLamp.position.set(0.46, 0.42, 1.72);
  car.add(leftLamp, rightLamp);

  // Headlight cones (SpotLight for each)
  const headlightL = new THREE.SpotLight(0xfff4d0, 20, 12, Math.PI / 9, 0.3);
  headlightL.position.set(-0.46, 0.42, 2);
  headlightL.target.position.set(-0.5, 0, 10);
  car.add(headlightL, headlightL.target);

  const headlightR = new THREE.SpotLight(0xfff4d0, 20, 12, Math.PI / 9, 0.3);
  headlightR.position.set(0.46, 0.42, 2);
  headlightR.target.position.set(0.5, 0, 10);
  car.add(headlightR, headlightR.target);

  car.position.set(2.9, 0, 10);
  scene.add(car);

  // ── Stars ─────────────────────────────────────────────────────────────────
  const starCount = 220;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i += 1) {
    starPositions[i * 3] = (Math.random() - 0.5) * 50;
    starPositions[i * 3 + 1] = 5 + Math.random() * 18;
    starPositions[i * 3 + 2] = -25 + Math.random() * 50;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starGroup = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0xffe56a, size: 0.04, transparent: true, opacity: 0.85 }),
  );
  scene.add(starGroup);

  // ── Rain particle system ───────────────────────────────────────────────────
  const rainCount = 900;
  const rainPos = new Float32Array(rainCount * 3);
  const rainVel = new Float32Array(rainCount); // per-particle fall speed
  for (let i = 0; i < rainCount; i += 1) {
    rainPos[i * 3] = (Math.random() - 0.5) * 36;
    rainPos[i * 3 + 1] = Math.random() * 22;
    rainPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    rainVel[i] = 0.08 + Math.random() * 0.12;
  }
  const rainGeo = new THREE.BufferGeometry();
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
  const rainMesh = new THREE.Points(
    rainGeo,
    new THREE.PointsMaterial({
      color: 0x8dd8f8,
      size: 0.012,
      transparent: true,
      opacity: 0.55,
    }),
  );
  scene.add(rainMesh);

  // ── State ─────────────────────────────────────────────────────────────────
  let progress = 0;
  let pointerX = 0;
  let pointerY = 0;
  let running = true;
  let frame = 0;

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function render(time: number) {
    if (!running) return;
    frame = requestAnimationFrame(render);
    const t = time * 0.001;

    // Camera: cinematic approach — starts at z=22, ends at z=3
    const targetZ = 22 - progress * 19;
    const targetY = 1.9 + Math.sin(progress * Math.PI) * 0.9;
    camera.position.x += (pointerX * 1.6 - camera.position.x) * 0.045;
    camera.position.y += (targetY + pointerY * 0.5 - camera.position.y) * 0.04;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(pointerX * 0.35, 1.0, camera.position.z - 10);

    // Car float
    car.position.y = 0.02 + Math.sin(t * 2.1) * 0.014;

    // Neon pulse lights
    gold.intensity = 20 + Math.sin(t * 2.3) * 5;
    magenta.intensity = 18 + Math.cos(t * 1.8) * 4;
    cyan.intensity = 12 + Math.sin(t * 3.1) * 3;

    // Neon signs pulse
    for (let i = 0; i < neonSigns.length; i++) {
      const mat = neonSigns[i].material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 3.5 + Math.sin(t * (1.5 + i * 0.4) + i) * 1.5;
    }

    // Slow star drift
    starGroup.rotation.y = t * 0.008;

    // Rain: update positions
    const rPos = rainGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < rainCount; i++) {
      rPos.array[i * 3 + 1] -= rainVel[i];
      if ((rPos.array as Float32Array)[i * 3 + 1] < -1) {
        (rPos.array as Float32Array)[i * 3 + 1] = 22;
        // slight horizontal drift
        (rPos.array as Float32Array)[i * 3] += (Math.random() - 0.5) * 0.1;
      }
    }
    rPos.needsUpdate = true;

    renderer.render(scene, camera);
  }

  resize();
  window.addEventListener('resize', resize);
  frame = requestAnimationFrame(render);

  return {
    setProgress(value) {
      progress = Math.min(1, Math.max(0, value));
    },
    setPointer(x, y) {
      pointerX = x;
      pointerY = y;
    },
    destroy() {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      renderer.dispose();
    },
  };
}
