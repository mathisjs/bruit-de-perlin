import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { createNoise2D } from 'simplex-noise';
import './App.css';

const terrainPerlin = () => {
  let scale = 0.05;
  const noise2D = createNoise2D();
  const positions = [];
  const colors = [];
  const indices = [];
  const wSeg = 150 - 1;
  const hSeg = 150 - 1;
  const color = new THREE.Color();

  const smoothNoise = (x, y) => {
    const base = noise2D(x * scale, y * scale) * 10;
    const octave1 = noise2D(x * scale * 0.5, y * scale * 0.5) * 5;
    const octave2 = noise2D(x * scale * 0.25, y * scale * 0.25) * 2.5;
    return base + octave1 + octave2;
  };

  for (let i = 0; i <= hSeg; i++) {
    for (let j = 0; j <= wSeg; j++) {
      const x = j - 150 / 2;
      const z = -(i - 150 / 2);
      const hValue = smoothNoise(j, i);
      positions.push(x, hValue, z);



      // couleurs blabla
      if (hValue < 2) {
        color.set('blue');
      }
      else if (hValue < 5) {
        color.set('green');
      }
      else if (hValue < 10) {
        color.set('red');
      }
      else {
        color.set('white');
      }

      colors.push(color.r, color.g, color.b);
    }
  }

  for (let i = 0; i < hSeg; i++) {
    for (let j = 0; j < wSeg; j++) {
      const a = i * (wSeg + 1) + j;
      const b = i * (wSeg + 1) + j + 1;
      const c = (i + 1) * (wSeg + 1) + j;
      const d = (i + 1) * (wSeg + 1) + j + 1;
      indices.push(a, b, d);
      indices.push(a, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
};





// main

const Terrain = () => {
  const terrain = React.useMemo(() => terrainPerlin(), []);
  return (
    <mesh geometry={terrain}>
      <meshStandardMaterial vertexColors wireframe={false} />
    </mesh>
  );
};

export default function App() {
  return (
    <div className="app">
      <Canvas
        camera={{
          position: [0, 50, 150],
          fov: 60,
        }}
        style={{ height: '100vh', width: '100vw' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[20, 50, 20]} intensity={1} />
        <pointLight position={[-90, 30, -30]} intensity={0.8} />
        <Terrain />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
