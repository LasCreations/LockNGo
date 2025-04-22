"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Clock, Package, Truck, DollarSign } from "lucide-react";
import { useEffect, useState } from 'react';

const ContractCard = ({ contract }) => {

  const [user, setUser] = useState<any>(null);
  if (!contract) {
    return <p className="text-red-500 text-center">No contract data available.</p>;
  }
 useEffect(() => {
    const storedUsername = localStorage.getItem('username');

    setUser(storedUsername || '');
   }, []);

  return (
    <Card className="max-w-3xl mx-auto p-6 shadow-lg border border-gray-200 bg-white rounded-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold">Escrow Contract</CardTitle>
        <p className="text-gray-500 text-sm">Contract ID: {contract.contract_id || "N/A"}</p>
        <p className="text-gray-500 text-sm">Date: {contract.date || "N/A"}</p>
      </CardHeader>

      <CardContent>
        {/* Parties Involved */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Parties Involved</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">Buyer:</TableCell>
                <TableCell>{contract.parties_involved?.buyer || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Seller:</TableCell>
                <TableCell>{user}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Product Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Package className="w-5 h-5 mr-2" /> Product Details
          </h3>
          <Table>
            <TableBody>
              {Object.entries(contract.product || {}).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</TableCell>
                  <TableCell>{value || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Sale Price & Payment */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" /> Payment Details
          </h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">Sale Price:</TableCell>
                <TableCell>
                  {contract.sale_price?.amount || "N/A"} {contract.sale_price?.currency || ""}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Payment Method:</TableCell>
                <TableCell>{contract.payment_method || "N/A"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Delivery Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Truck className="w-5 h-5 mr-2" /> Delivery Information
          </h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">Method:</TableCell>
                <TableCell>{contract.delivery?.method || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Expected Date:</TableCell>
                <TableCell>{contract.delivery?.expected_delivery_date || "N/A"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Tracking ID:</TableCell>
                <TableCell>{contract.delivery?.tracking_id || "N/A"}</TableCell>
              </TableRow>
              {contract.delivery?.delivery_address && (
                <TableRow>
                  <TableCell className="font-semibold">Address:</TableCell>
                  <TableCell>
                    {Object.values(contract.delivery.delivery_address).join(", ") || "N/A"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Release Conditions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" /> Release Conditions
          </h3>
          <ul className="list-disc list-inside text-gray-700">
            {(contract.release_conditions?.criteria || []).map((criterion, index) => (
              <li key={index}>{criterion}</li>
            ))}
          </ul>
        </div>

        {/* Dispute Resolution */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" /> Dispute Resolution
          </h3>
          <p className="text-gray-700 mb-2">
            <strong>Process:</strong> {contract.dispute_resolution?.process || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Escalation:</strong> {contract.dispute_resolution?.escalation || "N/A"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractCard;


