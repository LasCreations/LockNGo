"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function JoinTransaction() {
  const [code, setCode] = useState("");

  const handleConfirm = () => {
    if (!code.trim()) {
      toast.error("Please enter a code.");
      return;
    }
    // Here you could validate the code against your backend or state
    toast.success(`Code \"${code}\" accepted. Joining transaction...`);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Join Transaction</h1>

      <p className="font-medium text-center mb-6 text-lg">
        Please paste the <span className="font-bold text-[#1DB5C1]">CODE</span> you received from the person
        you are transacting with.
      </p>

      <div className="max-w-md mx-auto space-y-4">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter code here"
          className="text-center text-lg tracking-widest"
        />

        <Button
          onClick={handleConfirm}
          className="w-full bg-[#1DB5C1] hover:bg-[#169aa4] text-white font-semibold py-3 rounded-lg shadow"
        >
          Confirm
        </Button>
      </div>
    </main>
  );
}

