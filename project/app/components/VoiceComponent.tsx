"use client";

import React, { useEffect, useState } from "react";
import { useConversation } from "@11labs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, X, Send } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";

const VoiceChat = ({result, SetResult,currentDate,user,data,selectedRole,unselectedRole}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState(""); // Store transcript
  const [aiResponse, setAiResponse] = useState(""); // Store AI response
  const [loadingAi, setLoadingAi] = useState(false); // AI processing state
  const [loading, setLoading] = useState(false);

  const conversation = useConversation({
    onConnect: () => console.log("✅ Connected to ElevenLabs"),
    onDisconnect: () => console.log("❌ Disconnected from ElevenLabs"),
    onMessage: (message) => {
      console.log("📩 Received message object:", message);

      if (message?.message) {
        setTranscript((prev) => prev + " " + message.message);
        SetResult(transcript);
      } else {
        console.warn("⚠️ No valid 'message' property in received data:", message);
      }
    },
    onError: (error) => {
      setErrorMessage(typeof error === "string" ? error : error.message);
      console.error("❌ Error:", error);
    },
  });

  const { status, isSpeaking } = conversation;

  useEffect(() => {
    const requestMicPermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch (error) {
        setErrorMessage("Microphone access denied");
        console.error("🎙️ Error accessing microphone:", error);
      }
    };
    requestMicPermission();
  }, []);

  const handleStartConversation = async () => {
    try {
      const conversationId = await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!,
      });
      console.log("🎤 Started conversation:", conversationId);
      setTranscript(""); // Clear transcript for a new conversation
    } catch (error) {
      setErrorMessage("Failed to start conversation");
      console.error("❌ Error starting conversation:", error);
    }
  };

  const handleEndConversation = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      setErrorMessage("Failed to end conversation");
      console.error("❌ Error ending conversation:", error);
    }
  };

  const toggleMute = async () => {
    try {
      await conversation.setVolume({ volume: isMuted ? 1 : 0 });
      setIsMuted(!isMuted);
    } catch (error) {
      setErrorMessage("Failed to change volume");
      console.error("❌ Error changing volume:", error);
    }
  };


  const sendToAI = async () => {

    setLoading(true);
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const result = await model.generateContent([

      `You are an AI contract generator specializing in escrow-based peer-to-peer transactions. You will be given a transcript between a user and an ai chatbot. ${transcript}
Your task is to generate a structured **JSON-like contract** based on the provided details. 
 **Respond with JSON format ONLY & DO NOT ADD the triple back ticks just do as shown in the example below. Do NOT include explanations, introductions, or Markdown formatting. Do NOT wrap the JSON inside triple backticks. Just return raw JSON.** 

### **Contract Requirements**
- Generate a unique contract ID
- Give a description of the product based on the transcript 
- **Date**: ${currentDate}
- **Parties Involved**:
  "${selectedRole}": "${user}",
  "${unselectedRole}": "${data}"

- **Transaction Type**: Peer-to-peer OR Buyer-to-Seller
- **Payment Method**: Bank transfer via an application utilizing Stripe on the backend.

### **Contract Scope**
- **Item Condition**: Based on its visible condition in the image.
- **Payment Terms**: Specify due dates, penalties (if any), and refund conditions.
- **Delivery Conditions**: Address shipping, pickup location, and timelines.
- **Warranties & Liabilities**: Detail any guarantees or disclaimers.
- **Dispute Resolution**: Exclude mention of an escrow agent but outline conflict resolution steps.


### **JSON Output Format**
Respond in **JSON format only**, structured as follows:

{
  "contract_id": "",
  "item_desription":"",
  "date": "${currentDate}",
  "parties_involved": {
    "Buyer/Seller": "${user}",
    "Buyer/Seller": "${data}"
  },
  "transaction_type": "",
  "sale_price": {
    "amount": "",
    "currency": ""
  },
  "payment_method": "Bank transfer via Stripe",
  "product": {
    "name": "",
    "category": "",
    "quantity": "",
    "condition": ""
  },
  "delivery": {
    "method": "",
    "expected_delivery_date": "",
    "tracking_id": "",
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
      "Product is in working condition",
      "No visible damages or defects",
      "All included accessories are present"
    ]
  },
  "dispute_resolution": {
    "process": "If a dispute arises, the buyer must provide evidence within a dispute period (hours). A mediator will review and decide the outcome.",
    "escalation": "If unresolved, the case is escalated to arbitration."
  },
  "payment_release": {
    "on_success": "Funds released to seller after inspection period if no dispute is raised.",
    "on_dispute": "Funds held until resolution."
  }
}
`,
      ]);
      const response = await result.response;
      const text = response
        .text() 
         const parsedData = JSON.parse(text);
         console.log(parsedData);
        SetResult(parsedData);
        toast.success(`Contract Generated`);
    } catch (error) {
      console.error("Error identifying image:", error);
      if (error instanceof Error) {
        setResult(`Error identifying image: ${error.message}`);
      } else {
        setResult("An unknown error occurred while identifying the image.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      {/* Floating Button to Toggle Chat */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageSquare className="w-6 h-6 text-white" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-80 shadow-xl fixed bottom-20 right-4 bg-white border rounded-lg">
          <CardHeader className="flex justify-between items-center p-4">
            <CardTitle className="text-lg font-semibold">AI Chatbot</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            <div className="flex justify-center">
              {status === "connected" ? (
                <Button variant="destructive" onClick={handleEndConversation} className="w-full">
                  <MicOff className="mr-2 h-4 w-4" />
                  End Conversation
                </Button>
              ) : (
                <Button onClick={handleStartConversation} disabled={!hasPermission} className="w-full">
                  <Mic className="mr-2 h-4 w-4" />
                  Start Conversation
                </Button>
              )}
            </div>

            {/* Mute Button */}
            <div className="flex justify-center">
              <Button variant="outline" size="icon" onClick={toggleMute} disabled={status !== "connected"}>
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            </div>

            {/* Display Transcript */}
            <div className="border p-3 rounded bg-gray-100 h-32 overflow-y-auto text-sm">
              {transcript ? transcript : <p className="text-gray-500">Waiting for speech...</p>}
            </div>

            {/* Send to AI Button */}
            <div className="flex justify-center">
              <Button
                onClick={sendToAI}
                disabled={!transcript.trim() || loadingAi}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loadingAi ? "Processing..." : <><Send className="mr-2 h-4 w-4" /> Send to AI</>}
              </Button>
            </div>

            {/* AI Response */}
            {aiResponse && (
              <div className="border p-3 rounded bg-gray-50 h-24 overflow-y-auto text-sm">
                <strong>AI:</strong> {aiResponse}
              </div>
            )}

            {/* Status Messages */}
            <div className="text-center text-sm">
              {status === "connected" && (
                <p className="text-green-600">{isSpeaking ? "Agent is speaking..." : "Listening..."}</p>
              )}
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              {!hasPermission && <p className="text-yellow-600">Please allow microphone access to use voice chat</p>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoiceChat;


