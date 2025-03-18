import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, DollarSign } from 'lucide-react';

const BankCardComponent = ({ cardHolderName , cardNumber }) => {
  return (
    <Card className="w-60 p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl shadow-lg">
      <CardContent className="flex flex-col justify-between h-full">
        <div className="flex justify-between items-center mb-4">
          <CreditCard className="w-10 h-10" />
          <span className="text-lg font-semibold">Bank Card</span>
        </div>
        <div className="mb-4">
          <p className="text-sm">Card Holder</p>
          <p className="text-lg font-bold">{cardHolderName}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm">Card Number</p>
          <p className="text-lg font-mono tracking-widest">●●●● ●●●● ●●●● {cardNumber.slice(-4)}</p>
        </div>
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-sm">Expiry</p>
            <p className="text-lg font-bold"> ●● / ●● </p>
          </div>
          <div>
            <p className="text-sm">CVV</p>
            <p className="text-lg font-bold">●●●</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankCardComponent;

