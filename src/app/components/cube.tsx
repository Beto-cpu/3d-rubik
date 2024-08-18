
import * as THREE from 'three'
import { createRoot } from 'react-dom/client'
import React, { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, ThreeElements, Euler } from '@react-three/fiber'
import { OrbitControls, Edges } from '@react-three/drei'
import { degToRad } from 'three/src/math/MathUtils.js'

interface IBoxPart {
  position: [number, number, number]
  color: [string, string, string, string, string, string]
  test?: boolean
  rotation?: Euler
  degrees?: number
}

function rectangularToPolar(x: number, y: number): { r: number, theta: number } {
  // Calculate the radius r
  const r = Math.sqrt(x * x + y * y);

  // Calculate the angle θ in radians
  const theta = Math.atan2(y, x);

  return { r, theta };
}
function polarToRectangular(r: number, theta: number): { x: number, y: number } {
  // Calculate the x coordinate
  const x = r * Math.cos(theta);

  // Calculate the y coordinate
  const y = r * Math.sin(theta);

  return { x, y };
}


function BoxPart({ position, color, degrees }: IBoxPart) {
  const meshRef = useRef<THREE.Mesh>(null!)


  useEffect(() => {
    if (!meshRef) return;

    const geometry = meshRef.current.geometry.toNonIndexed();

    const positionAttribute = geometry.getAttribute('position');
    const colors = [];
    const face_color = new THREE.Color();

    for (let i = 0; i < positionAttribute.count; i += 1) {
      face_color.set(color[Math.floor(i / 6)]);
      colors.push(face_color.r, face_color.g, face_color.b);
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    meshRef.current.geometry = geometry;

  }, [meshRef, color]);

  const initial_polar = rectangularToPolar(position[0], position[1])
  const rectangular = degrees? polarToRectangular(initial_polar.r, initial_polar.theta + degToRad(degrees)) : null;
  const actual_position : [x: number, y: number, z: number] = rectangular? [rectangular.x, rectangular.y, 1] : position;
  const actual_rotation = new THREE.Euler(0, 0, degrees? THREE.MathUtils.degToRad(degrees) : 0);

  return (
    <mesh
      position={actual_position}
      rotation={actual_rotation}
      ref={meshRef}>
      <boxGeometry />
      <meshBasicMaterial vertexColors={true} />
      <Edges color="black" lineWidth={5} />
    </mesh>
  )
}

function Rubik() {
  const colors = ["#c5002b", "#f56b18", "e2e2e2", "e6d44f", "#00aa4b", "003cb6"]
  let side_size = 3;
  let rubik: React.JSX.Element[] = [];

  const [degrees, setDegrees] = useState(1);
  const degreesRef = useRef(degrees);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDegrees(prevDegrees => {
        const newDegrees = prevDegrees >= 359 ? 0 : prevDegrees + 1;
        degreesRef.current = newDegrees;

        return newDegrees;
      });
    }, 17);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      for (let k = -1; k <= 1; k++) {

        if (k == 1) {
          rubik.push(<BoxPart position={[i, j, k]} color={
            [
              i == 1 ? '#b71234' : '#000000',
              i == -1 ? '#ff5800' : '#000000',
              j == 1 ? '#ffffff' : '#000000',
              j == -1 ? '#ffd500' : '#000000',
              k == 1 ? '#009b48' : '#000000',
              k == -1 ? '#0046ad' : '#000000'
            ]
          } degrees={degrees} />)
        } else {
          rubik.push(<BoxPart position={[i, j, k]} color={
            [
              i == 1 ? '#b71234' : '#000000',
              i == -1 ? '#ff5800' : '#000000',
              j == 1 ? '#ffffff' : '#000000',
              j == -1 ? '#ffd500' : '#000000',
              k == 1 ? '#009b48' : '#000000',
              k == -1 ? '#0046ad' : '#000000'
            ]
          } />)
        }
      }
    }
  }

  return rubik
}

export function Box() {
  return (
    <Canvas className="w-full h-full bg-slate-300">
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />

      <Rubik />

      <OrbitControls rotateSpeed={1} />
    </Canvas>
  )
}