"use client";

import { useEffect, useState, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ContractCard from '@/app/components/ContractCard';
import { CheckCircle } from "lucide-react";

export default function Contract() {
  const [transcript, setTranscript] = useState('');
  const [metadata, setMetadata] = useState<any>(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const codeRef = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const storedTranscript = localStorage.getItem('transcript');
    const storedMetadata = localStorage.getItem('metadata');

    setTranscript(storedTranscript || '');
    if (storedMetadata) {
      try {
        const parsedMetadata = JSON.parse(storedMetadata);
        setMetadata(parsedMetadata);
      } catch (err) {
        console.error('Failed to parse metadata:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (transcript && metadata) {
      generateContract(transcript, metadata);
    }
  }, [transcript, metadata]);

  const generateContract = async (transcript: string, metadata: any) => {
    setLoading(true);
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an AI contract generator specializing in escrow-based transactions.
Using the transcript and item metadata below, generate a full JSON-based contract.
Do NOT include markdown, explanations, or triple backticks. Just return raw JSON.

Transcript:
"""
${transcript}
"""

Metadata:
${JSON.stringify(metadata, null, 2)}

The contract should include:
- Unique contract ID
- Date
- Buyer/Seller inferred from context
- Description of item
- Condition, visible damage, brand, etc.
- Delivery terms
- Inspection criteria
- Dispute process
- Payment and release conditions

Respond in this structure:
{
  "contract_id": "",
  "date": "${today}",
  "parties_involved": {
    "buyer": "",
    "seller": ""
  },
  "item_description": "",
  "sale_price": {
    "amount": "",
    "currency": ""
  },
  "product": ${JSON.stringify(metadata.MetaData, null, 2)},
  "delivery": {
    "method": "",
    "expected_delivery_date": "",
    "delivery_address": {
      "street": "",
      "city": "",
      "country": "",
      "postal_code": ""
    }
  },
  "release_conditions": {
    "inspection_period": "",
    "criteria": [
      "Product matches description",
      "No visible damages",
      "Includes all listed features"
    ]
  },
  "dispute_resolution": {
    "process": "",
    "escalation": ""
  },
  "payment_method": "Bank transfer via Sagicor Payment Gateway",
  "payment_release": {
    "on_success": "Funds released after inspection period if no dispute is raised.",
    "on_dispute": "Funds held until dispute resolution."
  }
}`;

    try {
      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = response.candidates[0].content.parts[0].text;

      const jsonStart = text.indexOf("{");
      const parsed = JSON.parse(text.slice(jsonStart));
      setContract(parsed);
    } catch (error) {
      console.error("Error generating contract:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setGeneratedCode(code);
    setShowPopup(true);
  };

  const handleCopy = () => {
    if (codeRef.current) {
      codeRef.current.select();
      navigator.clipboard.writeText(codeRef.current.value);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-4">Contract Review and Confirmation</h1>
        <p className="font-medium mb-2">
          Double-check all details before proceeding. Once confirmed, the contract is final and cannot be edited.
        </p>

        <div className="flex space-x-2 mb-6 items-center">
          {[1, 2, 3, 4].map((step, idx) => (
            <div
              key={idx}
              className={`w-8 h-2 rounded-full ${step <= 4 ? 'bg-green-500' : 'bg-gray-300'}`}
            ></div>
          ))}
        </div>

        {loading ? (
          <p className="text-blue-600">Generating contract...</p>
        ) : contract ? (
          <>
            <div className="flex justify-end mb-2">
              <button
                onClick={() => window.print()}
                className="text-sm text-blue-600 hover:underline"
              >
                Download PDF
              </button>
            </div>

            <ContractCard contract={contract} />

            <div className="flex justify-center mt-6">
              <button
                className="bg-[#1DB5C1] hover:bg-[#169aa4] text-white font-semibold py-3 px-8 rounded-lg shadow transition duration-150"
                onClick={handleConfirm}
              >
                Confirm and Generate Code
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600">Waiting for transcript and metadata...</p>
        )}

        {/* Popup Modal */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full text-center">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <h2 className="text-lg font-semibold mb-2">Code Generated!</h2>
              <p className="mb-2 text-gray-600">Use the code below to proceed with contract confirmation:</p>
              <input
                ref={codeRef}
                value={generatedCode}
                readOnly
                className="w-full border rounded px-3 py-2 text-center font-mono text-lg mb-3"
              />
              <button
                onClick={handleCopy}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Copy Code
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="mt-3 text-sm text-gray-500 hover:underline block w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}


