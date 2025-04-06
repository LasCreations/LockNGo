"use client";

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Character from '@/app/components/Character';

import VoiceComponent from "@/app/components/VoiceComponent";

export default function Contract(){
  return(
  <div className="w-full h-screen flex flex-row">
    {/* 3D Canvas */}
      <div className="flex-1 h-full">
        <Canvas camera={{ position: [0, 2, 4], fov: 50 }}>
          <ambientLight />
          <directionalLight position={[-5, 5, 5]} />
          <Character />
        </Canvas>
      </div>
      {/* Voice Chat Panel */}
      <div className="w-[300px] h-full bg-white shadow-lg z-10 overflow-auto">
        <VoiceComponent />
      </div>

      
    </div>
  );


