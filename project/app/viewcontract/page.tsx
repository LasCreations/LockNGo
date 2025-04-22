// pages/contracts.jsx
import React from "react";
import ContractCard from "@/app/components/Contract";

const contracts = [
  { status: "Transaction Complete", client: "Ronald Boyle", company: "Lock n' Go Inc.", date: "March 2, 2024" },
  { status: "Delivery Complete", client: "Lilyana Tang", company: "Lock n' Go Inc.", date: "March 4, 2024" },
  { status: "In Progress", client: "Enzo Bradley", company: "Lock n' Go Inc.", date: "May 24, 2024" },
  { status: "Funds Held", client: "Alison Vu", company: "Lock n' Go Inc.", date: "September 14, 2024" },
  { status: "Dispute Raised", client: "Kamdyn Marks", company: "Lock n' Go Inc.", date: "January 17, 2025" },
];

const ContractsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Your Contracts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {contracts.map((contract, idx) => (
          <ContractCard key={idx} {...contract} />
        ))}
      </div>
    </div>
  );
};

export default ContractsPage;

