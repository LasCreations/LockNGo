

"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";



export default function Navbar() {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/api/auth/signout" });
  };



  return (
    <nav className="w-full  bg-white border-b shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo or Brand Name */}
        <div className="text-2xl font-semibold text-gray-800">Trust n' Go</div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <a href="/dashboard" className="text-gray-600 hover:text-gray-800">
            Dashboard
          </a>
          <a href="/banks" className="text-gray-600 hover:text-gray-800">
            My Banks 
          </a>
          <a href="/transactions" className="text-gray-600 hover:text-gray-800">
            Transactions 
          </a>
          <a href="/contract" className="text-gray-600 hover:text-gray-800">
           Contracts 
          </a>
        </div>

        {/* User Avatar and Sign Out Button */}
        <div className="flex items-center space-x-4">
          {session?.user ? (
            <>
              <Avatar>
                <AvatarImage
                  src={session.user.image || ""}
                  alt={session.user.name || "User"}
                />
                <AvatarFallback>
                  {session.user.name
                    ? session.user.name.charAt(0).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-800 font-medium">
                  {session.user.name}
                </span>
              <Button
                variant="default"
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <a
              href="/api/auth/signout"
              className="text-blue-500 hover:underline"
            >
              Sign Out 
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

