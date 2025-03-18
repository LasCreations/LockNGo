"use client";

import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = () => {
  useEffect(() => {
    toast("Welcome!");
  }, []);

  return <ToastContainer />;
};

export default ToastNotification;

