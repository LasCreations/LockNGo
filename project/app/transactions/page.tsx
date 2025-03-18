
"use client";
import VoiceComponent from "@/app/components/VoiceComponent";
import Navbar from "@/app/components/Navbar";
import ContractCard from "@/app/components/ContractCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import React, { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useEffect } from "react";

 const  getDate = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${month}/${date}/${year}`;
  };


export default function Transactions() {

  useEffect(() => {
    findBaseUser();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [inputValue, setInputValue] = useState("");
  const [inputPrice, setInputPrice] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [unselectedRole, setUnselectedRole] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [relatedQuestions, setRelatedQuestions] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(getDate());



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // Update state with the input field's value
  };

  const handleInputPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPrice(e.target.value); // Update state with the input field's value
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

   const handleRadioChange = (value) => {
      setSelectedRole(value);
      setUnselectedRole(value === "buyer" ? "seller" : "buyer");
  };
    
  const identifyImage = async (additionalPrompt: string = "", price: string = "" ) => {
    if (!image) return;

    setLoading(true);
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const imageParts = await fileToGenerativePart(image);
      const result = await model.generateContent([

      `You are an AI contract generator specializing in escrow-based peer-to-peer transactions. You should also give a description of the image provided.
Your task is to generate a structured **JSON-like contract** based on the provided details. 
 **Respond with JSON format ONLY & DO NOT ADD the triple back ticks just do as shown in the example below. Do NOT include explanations, introductions, or Markdown formatting. Do NOT wrap the JSON inside triple backticks. Just return raw JSON.**

### **Contract Requirements**
- Generate a unique contract ID
- Give a description of the image attached to the prompt 
- **Date**: ${currentDate}
- **Parties Involved**:
  - **${selectedRole}**: ${user.name}  
  - **${unselectedRole}**: ${data.name} 
- **Transaction Type**: Peer-to-peer OR Buyer-to-Seller
- **Sale Price**: ${price} 
- **Payment Method**: Bank transfer via an application utilizing Stripe on the backend.

### **Contract Scope**
- **Item Condition**: Based on its visible condition in the image.
- **Payment Terms**: Specify due dates, penalties (if any), and refund conditions.
- **Delivery Conditions**: Address shipping, pickup location, and timelines.
- **Warranties & Liabilities**: Detail any guarantees or disclaimers.
- **Dispute Resolution**: Exclude mention of an escrow agent but outline conflict resolution steps.
### **Additional Seller Information**:
(Note: If a section is blank, the seller did not provide details.)
${additionalPrompt}

### **JSON Output Format**
Respond in **JSON format only**, structured as follows:

{
  "contract_id": "",
  "item_desription":"",
  "date": "${currentDate}",
  "parties_involved": {
    "${selectedRole}": "${user.name}",
    "${unselectedRole}": "${data.name}"
  },
  "transaction_type": "",
  "sale_price": {
    "amount": ${price},
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
`,imageParts,
      ]);
      const response = await result.response;
      const text = response
        .text() 
         const parsedData = JSON.parse(text);
         console.log(parsedData);
        setResult(parsedData);
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


  const regenerateContent = (text: string) => {
    identifyImage(`Focus more on aspects related to "${keyword}".`);
  };

  async function fileToGenerativePart(file: File): Promise<{
    inlineData: { data: string; mimeType: string };
  }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        const base64Content = base64data.split(",")[1];
        resolve({
          inlineData: {
            data: base64Content,
            mimeType: file.type,
          },
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }



  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a name to search.");
      return;
    }

    try {
      const response = await fetch(`/api/search?username=${searchQuery}`);
      if (!response.ok) {
        //throw new Error("Failed to fetch user");
      }
      
      const result = await response.json();

      if (result.message === "User not found") {
       setIsVisible(false);
       toast("User not found", {
          description: `No user with the name ${searchQuery} exists.`,
        });
        setData(null);
      } else {
        setData(result); 
        if(!isVisible){
          setIsVisible(true);
        }
        toast.success(`User found: ${result.name}`);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      toast.error("An error occurred while searching for the user.");
    }
  };


  const findBaseUser = async () => {
    try {
      const response = await fetch(`/api/user`);
      if (!response.ok) {
        //throw new Error("Failed to fetch user");
      }
      
      const result = await response.json();

      if (result.message === "User not found") {
       toast("User not found", {
          description: `Error finding your data`,
        });
      } else {
        toast.success(`Found your data`);

        setUser(result); 
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      toast.error("An error occurred while searching for the user.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-100">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search a username ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button variant="default" onClick={handleSearch}>
            Search
          </Button>
        </div>
        
        {isVisible && (
        
     <div className="min-h-screen bg-gray-100">
        {<VoiceComponent result={result} SetResult={setResult} currentDate={currentDate} user={user.name} data={data.name} selectedRole={selectedRole} unselectedRole={unselectedRole} />}
      <RadioGroup defaultValue="buyer" value={selectedRole} onValueChange={handleRadioChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="buyer" id="r2" />
            <Label htmlFor="r2">Buyer</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="seller" id="r1" />
            <Label htmlFor="r1">Seller</Label>
          </div>
        </RadioGroup>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="mb-8">
              <label
                htmlFor="image-upload"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload an image
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-150 ease-in-out"
              />
            </div>
            {image && (
              <div className="mb-8 flex justify-center">
                <Image
                  src={URL.createObjectURL(image)}
                  alt="Uploaded image"
                  width={300}
                  height={300}
                  className="rounded-lg shadow-md"
                />
              </div>
            )}
        <Input
        type="text"
        placeholder="Price & Currency (i.e: 30000JMD) "
        value={inputPrice}
        onChange={handleInputPrice}
        className="w-64"
      />    
       <Input
        type="text"
        placeholder="Enter additional info/description."
        value={inputValue}
        onChange={handleInputChange}
        className="w-64"
      />
            <button
              onClick={() => identifyImage(inputValue, inputPrice)}
              disabled={!image || loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
            >
              {loading ? "Generating..." : "Generate Contract"}
            </button>
          </div>
          {<ContractCard contract={result} />}
        </div>
    </div>
)}
      </main>
    </>
  );
}


