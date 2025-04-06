"use client";

import React, { useEffect, useState } from "react";
import { useConversation } from "@11labs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, X, Send } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";

const VoiceChat = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [transcript, setTranscript] = useState(""); // Store transcript
  const [chat, setChat] = useState(""); // Store transcript
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
        setChat(message.message);
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
      setChat(""); // Clear transcript for a new conversation
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



  return (
    <div className="w-full h-full p-4">
      <Card className="w-full shadow-xl bg-white border rounded-lg">
        <CardHeader className="flex justify-between items-center p-4">
          <CardTitle className="text-lg font-semibold">AI Chat</CardTitle>
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

          <div className="flex justify-center">
            <Button variant="outline" size="icon" onClick={toggleMute} disabled={status !== "connected"}>
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </div>

          <div className="border p-3 rounded bg-gray-100 h-32 overflow-y-auto text-sm">
            {chat ? chat : <p className="text-gray-500">Waiting for speech...</p>}
          </div>

          {aiResponse && (
            <div className="border p-3 rounded bg-gray-50 h-24 overflow-y-auto text-sm">
              <strong>AI:</strong> {aiResponse}
            </div>
          )}

          <div className="text-center text-sm">
            {status === "connected" && (
              <p className="text-green-600">{isSpeaking ? "Agent is speaking..." : "Listening..."}</p>
            )}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {!hasPermission && (
              <p className="text-yellow-600">Please allow microphone access to use voice chat</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceChat;


