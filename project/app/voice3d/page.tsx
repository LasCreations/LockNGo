"use client";

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Character from '@/app/components/Character';

import VoiceComponent from "@/app/components/VoiceComponent";

export default function Contract(){
  return(
  <>
   <main className="flex-1 p-8 flex flex-col justify-between">
        {/* Header + Progress */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Contract Details</h2>

          {/* Step Progress */}
          <div className="flex space-x-2 mb-6 items-center">
            {[1, 2, 3, 4].map((step, idx) => (
              <div
                key={idx}
                className={`w-8 h-2 rounded-full ${
                  step <= 1 ? 'bg-green-500' : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>

          {/* Text + Input */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <p className="font-medium mb-2">
                Provide information about the product or transaction terms with
                voice or text
              </p>
              <input
                type="text"
                placeholder="Enter description/details..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            <div className="w-[300px] h-full bg-white shadow-lg z-10 overflow-auto">
               <VoiceComponent />
              </div>
              <p className="mt-4 text-gray-600">
                Thanks for that. Please click "Next" to begin verifying your
                product!
              </p>

            </div>

            {/* 3D Assistant */}
            <div className="rounded-md overflow-hidden border h-[400px] bg-white shadow">
              <Canvas camera={{ position: [0, 2, 4], fov: 50 }}>
                <ambientLight />
                <directionalLight position={[-5, 5, 5]} />
                <OrbitControls enablePan={false} />
                <Character />
              </Canvas>
            </div>
          </div>
        </div>
      </main>
  </>



 
  );
