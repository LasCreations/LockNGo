// components/ContractCard.jsx
import React from "react";
import { CheckCircle, AlertTriangle, Loader, DollarSign, Truck } from "lucide-react";

const statusStyles = {
  "Transaction Complete": {
    icon: <CheckCircle className="text-green-500" />,
    buttonText: "View Details",
    buttonStyle: "bg-blue-500 text-white",
  },
  "Delivery Complete": {
    icon: <Truck className="text-green-500" />,
    buttonText: "Raise Dispute",
    buttonStyle: "border border-blue-500 text-blue-500",
  },
  "In Progress": {
    icon: <Loader className="text-blue-500 animate-spin" />,
    buttonText: "View Details",
    buttonStyle: "bg-blue-500 text-white",
  },
  "Funds Held": {
    icon: <DollarSign className="text-blue-600" />,
    buttonText: "View Details",
    buttonStyle: "bg-blue-500 text-white",
  },
  "Dispute Raised": {
    icon: <AlertTriangle className="text-orange-500" />,
    buttonText: "View Details",
    buttonStyle: "bg-blue-500 text-white",
  },
};

const ContractCard = ({ status, client, company, date }) => {
  const style = statusStyles[status];

  return (
    <div className="bg-white shadow rounded-xl p-5 w-full max-w-sm flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {style.icon}
        <div>
          <h2 className="text-lg font-bold">{status}</h2>
          <p className="text-gray-500 text-sm">Status</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Contract Details</h3>
        <p className="text-sm text-gray-700"><strong>Effective Date:</strong> {date}</p>
        <p className="text-sm text-gray-700"><strong>Client:</strong> {client}</p>
      </div>

      <button className={`px-4 py-2 rounded-lg text-sm font-semibold ${style.buttonStyle}`}>
        {style.buttonText}
      </button>
    </div>
  );
};

export default ContractCard;

