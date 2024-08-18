'use client'
import Image from "next/image";
import { Canvas, useFrame } from '@react-three/fiber'
import { Box } from './components/cube'
import { OrbitControls } from '@react-three/drei'


export default function Home() {


  return (
    <main className="w-screen h-screen overflow-hidden">
      <Box/>
    </main>
  );
}