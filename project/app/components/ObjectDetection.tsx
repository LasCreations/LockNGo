"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRouter } from 'next/navigation'

let detectInterval;

const ObjectDetection = ({ transcript }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasCaptured, setHasCaptured] = useState(false);
  const hasCapturedRef = useRef(false);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [verificationData, setVerificationData] = useState(null);
  const [verified, setVerified] = useState(null);
  const [showOverlay, setShowOverlay] = useState(true);
  // Overlay disappears after 3s
  useEffect(() => {
    const timer = setTimeout(() => setShowOverlay(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // TensorFlow setup
  useEffect(() => {
    const setup = async () => {
      await tf.setBackend("webgl");
      await tf.ready();

      console.log("TensorFlow Backend:", tf.getBackend());

      runCoco();
    };

    setup();

    return () => {
      if (detectInterval) clearInterval(detectInterval);
    };
  }, []);

  async function runCoco() {
    setIsLoading(true);
    const net = await cocoSSDLoad();
    setIsLoading(false);

    detectInterval = setInterval(() => {
      runObjectDetection(net);
    }, 1000); // 1 detection per second
  }

  async function runObjectDetection(net) {
    if (
      canvasRef.current &&
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      const video = webcamRef.current.video;

      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;

      const detectedObjects = await net.detect(video, undefined, 0.3);

      const context = canvasRef.current.getContext("2d");
      renderPredictions(detectedObjects, context);

      const nonPersonObjects = detectedObjects.filter(obj => obj.class !== "person");

      if (nonPersonObjects.length > 0 && !hasCapturedRef.current) {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
          localStorage.setItem("capturedImage", imageSrc);
          setHasCaptured(true);
          hasCapturedRef.current = true;
          identifyImage();
        }
      }
    }
  }

  const renderPredictions = (predictions, ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";

    predictions.forEach((prediction) => {
      if (prediction.class === "person") return;

      const [x, y, width, height] = prediction["bbox"];

      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      ctx.fillStyle = `rgba(0, 255, 255, 0.1)`;
      ctx.fillRect(x, y, width, height);

      const text = `${prediction.class} (${(prediction.score * 100).toFixed(1)}%)`;
      const textWidth = ctx.measureText(text).width;
      const textHeight = parseInt(font, 10);
      ctx.fillStyle = "#00FFFF";
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

      ctx.fillStyle = "#000000";
      ctx.fillText(text, x, y);
    });
  };

  const identifyImage = async () => {
    setLoading(true);
    const genAI = new GoogleGenerativeAI("AIzaSyBFconOprP4nUsMA9Y6KVVBwM3Zm8aMa1Q");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const imageSrc = localStorage.getItem("capturedImage");
      if (!imageSrc) return;

      const base64Data = imageSrc.replace(/^data:image\/\w+;base64,/, "");
      const image = {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      };

      const result = await model.generateContent([
        {
          text: `You are an AI contract generator specializing in escrow-based buyer transactions.

Given the following:
- Transcript with an agent: "${transcript}"
- Image of the product

Please determine whether the item in the image matches the transcript description.

If it matches, return the item details as a **clean JSON object**.

### Response format (JSON only):
{
  "Item Status": "Item matches" or "Item does not match",
  "MetaData": {
    "color": "",
    "size": "",
    "visible_damage": "",
    "brand": "",
    "type": "",
    "text": "",
    "additional_features": "",
    "material": "",
    "condition": ""
  }
}

Only return the JSON. Do not include explanations or extra text.`,
        },
        image,
      ]);

      const response = await result.response;

      // Parse the JSON from the response
      const rawText = response.candidates[0].content.parts[0].text;

      // Try to extract JSON safely
      let extractedJson = "";

      const jsonBlock = rawText.match(/```json([\s\S]*?)```/);
      if (jsonBlock && jsonBlock[1]) {
        extractedJson = jsonBlock[1];
      } else {
        // fallback to first valid-looking object
        const fallbackJson = rawText.match(/{[\s\S]*}/);
        if (fallbackJson) extractedJson = fallbackJson[0];
      }

      try {
        const parsed = JSON.parse(extractedJson.trim());
        setVerificationData(parsed);
         // 👇 Check if item DOES NOT match
        const status = parsed?.["Item Status"]?.toLowerCase() || "";
        if (!status.includes("item matches")) {
          setVerified(false);
          console.log("Item did not match — resetting capture");
          setHasCaptured(false);
          hasCapturedRef.current = false;
        }else{

          setVerified(true);
        }

      } catch (err) {
          console.error("JSON parsing failed. Raw response:\n", rawText);
          console.error("Extracted:\n", extractedJson);
      } 

    } catch (error) {
      console.error("AI Identification Error:", error);
    } finally {
      setLoading(false);
    }
  };
    const router = useRouter()

   const handleClick = () => {
    //localStorage.setItem('transcript', transcript)
    localStorage.setItem('transcript', transcript)
    localStorage.setItem('metadata', JSON.stringify(verificationData))
    router.push('/contract')
  }

  return (
    <div className="flex-1 p-8">
      <h2 className="text-xl font-semibold mb-4">Product Verification</h2>

      {/* Step Progress */}
      <div className="flex space-x-2 mb-6 items-center">
        {[1, 2, 3, 4].map((step, idx) => (
          <div
            key={idx}
            className={`w-8 h-2 rounded-full ${
              step <= 2 ? "bg-green-500" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>

      <p className="mb-4 font-medium">
        Scan your product below to ensure it matches the details you provided.
      </p>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Webcam Panel */}
        <div className="relative rounded-md border p-2 bg-black">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}
            className="rounded-md w-full h-[300px] object-cover"
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
          />
          {showOverlay && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-semibold text-lg z-20 rounded-md">
              <div className="text-center">
                <div className="mb-2">📦</div>
                Move slowly around your object...
              </div>
            </div>
          )}
        </div>

        {/* Status Panel */}
        <div className="rounded-md border p-4 h-[300px] bg-white overflow-auto">
          <h3 className="font-semibold mb-2">Verification Status</h3>
          {loading ? (
            <p className="text-blue-500">Analyzing...</p>
          ) : verificationData ? (
            <ul className="text-sm space-y-2">
              <li>
                ✅ <strong>Item Status:</strong> {verificationData["Item Status"]}
              </li>
              <li>
                ✅ <strong>Type:</strong> {verificationData.MetaData?.type}
              </li>
              <li>
                ✅ <strong>Color:</strong> {verificationData.MetaData?.color}
              </li>
              <li>
                ✅ <strong>Brand:</strong> {verificationData.MetaData?.brand}
              </li>
              <li>
                ✅ <strong>Material:</strong> {verificationData.MetaData?.material}
              </li>
              {verificationData.MetaData?.visible_damage && (
                <li className="text-yellow-700">
                  ⚠️ <strong>Visible Damage:</strong> {verificationData.MetaData.visible_damage}
                </li>
              )}
              <li>
                ✅ <strong>Condition:</strong> {verificationData.MetaData?.condition}
              </li>
            </ul>
          ) : (
            <p className="text-gray-600">Waiting for scan results...</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-between">
        <button className="bg-[#00A9C9] text-white px-6 py-2 rounded-md">
          Update Listing
        </button>
        <button
          onClick={handleClick}
          disabled={!verified}
          className={`px-6 py-2 rounded-md transition-colors ${
         verified 
            ? "bg-[#0B3D91] text-white hover:bg-[#092d6f]"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
        Next
      </button>
        
      </div>
    </div>
  );
};

export default ObjectDetection;


