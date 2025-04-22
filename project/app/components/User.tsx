"use client";

import { useEffect } from "react";

export default function User({ user }: { user: any }) {
  useEffect(() => {
      localStorage.setItem("username", user);
    
  }, []);

  
}
