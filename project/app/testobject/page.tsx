"use client";
import Navbar from "@/app/components/Navbar";
import ObjectDetection from "@/app/components/ObjectDetection";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
export default function Object(){
  const [transcript, setTranscript] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('transcript')
    setTranscript(stored)
    console.log(stored);
  }, [])

  return(
       <ObjectDetection transcript={transcript}/>
  );
}
