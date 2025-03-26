"use client";

import Navbar from "@/app/components/Navbar";
import BankCardComponent from '@/app/components/BankCard';
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { RegisterDialog } from "@/app/components/BankFormDialog";

// ✅ Ensure API Key is loaded correctly
const GOOGLE_API_KEY = "AIzaSyCWwbrjqdHftKz13uDnmQfRT4CAm4PpcAI";
const GOOGLE_VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`;

export default function Home() {
  let [open, setOpen] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const [cardText, setCardText] = useState("");

  const captureAndProcess = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return alert("Failed to capture image");

    // ✅ Remove Base64 header
    const base64Image = imageSrc.replace(/^data:image\/\w+;base64,/, "");

    // ✅ Debugging logs
    console.log("Google API Key:", GOOGLE_API_KEY);
    console.log("Captured Image (Base64):", base64Image.substring(0, 100)); // Print first 100 characters

    // Construct Vision API request
    const requestBody = {
      requests: [
        {
          image: { content: base64Image },
          features: [{ type: "TEXT_DETECTION" }],
        },
      ],
    };

    try {
      const response = await axios.post(GOOGLE_VISION_API_URL, requestBody, {
        headers: { "Content-Type": "application/json" },
      });

      const text = response.data.responses[0]?.fullTextAnnotation?.text || "No text detected";
      console.log("OCR Output:", text);

      // Extract card details
      const cardNumber = text.match(/\b\d{4} \d{4} \d{4} \d{4}\b/);
      const expiryDate = text.match(/\b\d{2}\/\d{2}\b/);


      setCardText(
        `Card Number: ${cardNumber ? cardNumber[0] : "Not detected"}\n` +
        `Expiry Date: ${expiryDate ? expiryDate[0] : "Not detected"}`
      );
    } catch (error) {
      console.error("Google Vision API Error:", error.response?.data || error);
      setCardText("Error extracting card details.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2">Scan Your Card</h2>
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/png"
          className="w-[300px] h-[200px] rounded-lg border border-gray-100 shadow-md"
        />
        <button onClick={captureAndProcess} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
          Scan Card
        </button>
        <textarea className="mt-4 p-2 w-80 h-24 border rounded-lg bg-gray-100" value={cardText} readOnly />
      </div>

      <Button onClick={() => setOpen(true)}>Add Card</Button>
      <RegisterDialog open={open} setOpen={setOpen} />
      <main className="flex flex-wrap items-center justify-center min-h-screen gap-4 bg-gray-100">
        <BankCardComponent cardHolderName="Jane Smith" cardNumber="123456781231234" />
        <BankCardComponent cardHolderName="John Doe" cardNumber="123456781238947" />
        <BankCardComponent cardHolderName="Alice Brown" cardNumber="7584738923920938" />
      </main>
    </>
  );
}


