"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  uniform float uTime;
  attribute float size;
  attribute vec3 customColor;
  varying vec3 vColor;
  varying float vGlow;

  void main() {
    vColor = customColor;
    vec3 pos = position;
    pos.x += sin(uTime * 0.5 + pos.y * 2.0) * 0.2;
    pos.y += cos(uTime * 0.3 + pos.x * 2.0) * 0.2;
    pos.z += sin(uTime * 0.4 + pos.z * 1.0) * 0.3;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (30.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vGlow = (pos.z + 10.0) / 20.0;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vGlow;

  void main() {
    vec2 xy = gl_PointCoord.xy - vec2(0.5);
    float ll = length(xy);
    if (ll > 0.5) discard;
    float alpha = (0.5 - ll) * 2.0;
    vec3 coreColor = vec3(0.95, 0.96, 0.98);
    vec3 finalColor = mix(vColor, coreColor, alpha * 0.8);
    gl_FragColor = vec4(finalColor, alpha * 0.6);
  }
`;

export function OrganismField() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050608, 0.04);
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const paleGold = new THREE.Color(0xe8d9a0);
    const powderBlue = new THREE.Color(0x8ba4f9);
    const amber = new THREE.Color(0xc28b5e);
    const lavender = new THREE.Color(0xa589cc);

    for (let i = 0; i < particleCount; i += 1) {
      const t = Math.random() * Math.PI * 2;
      const u = Math.random() * Math.PI * 2;
      const radiusMajor = 8 + Math.sin(t * 3) * 2;
      const radiusMinor = 3 + Math.cos(u * 5) * 1.5;
      let x = (radiusMajor + radiusMinor * Math.cos(t)) * Math.cos(u);
      let y = (radiusMajor + radiusMinor * Math.cos(t)) * Math.sin(u);
      let z = radiusMinor * Math.sin(t) + Math.sin(u * 4) * 2;
      x += (Math.random() - 0.5) * 3;
      y += (Math.random() - 0.5) * 3;
      z += (Math.random() - 0.5) * 3;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const mixed = new THREE.Color();
      if (x > 0 && y > 0) mixed.lerpColors(powderBlue, lavender, Math.random());
      else if (x < 0 && y < 0) mixed.lerpColors(paleGold, amber, Math.random());
      else mixed.lerpColors(powderBlue, paleGold, Math.random());
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
      sizes[i] = Math.random() * 4 + 1;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("customColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    const material = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
    });
    const particles = new THREE.Points(geometry, material);

    const linePositions: number[] = [];
    const maxDistance = 2.5;
    for (let i = 0; i < particleCount; i += 2) {
      for (let j = i + 1; j < particleCount; j += 4) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < maxDistance * maxDistance) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2],
          );
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.03, blending: THREE.AdditiveBlending });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    const structure = new THREE.Group();
    structure.add(particles, lines);
    scene.add(structure);

    let mouseX = 0;
    let mouseY = 0;
    let halfX = window.innerWidth / 2;
    let halfY = window.innerHeight / 2;
    const clock = new THREE.Clock();

    function onPointerMove(event: PointerEvent) {
      mouseX = (event.clientX - halfX) * 0.001;
      mouseY = (event.clientY - halfY) * 0.001;
      const x = document.getElementById("coord-x");
      const y = document.getElementById("coord-y");
      if (x) x.textContent = (event.clientX / window.innerWidth).toFixed(3);
      if (y) y.textContent = (event.clientY / window.innerHeight).toFixed(3);
    }

    function onResize() {
      halfX = window.innerWidth / 2;
      halfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      const elapsed = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsed;
      structure.rotation.y += 0.001;
      structure.rotation.x = Math.sin(elapsed * 0.1) * 0.1;
      const targetX = mouseX * 2;
      const targetY = mouseY * 2;
      structure.rotation.y += 0.05 * (targetX - structure.rotation.y);
      structure.rotation.x += 0.05 * (targetY - structure.rotation.x);
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 5 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);
    renderer.setAnimationLoop(animate);

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="webglBackdrop" aria-hidden="true" />;
}
