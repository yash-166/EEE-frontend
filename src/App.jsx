import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import AppRouter from './routers/router';
import { ToastContainer } from "react-toastify";

function App() {

  return (
  

  <div className="relative h-screen w-full bg-cover bg-center " style={{ backgroundImage: "url('/pixelcut-export.png')" }}>
  {/* Overlay with a small blur effect */}
  <div className="absolute inset-0 backdrop-blur-xs"></div>

  {/* Your actual content */}
  <div className="relative z-10">
  <ToastContainer />
    <AppRouter />
  </div>
</div>

  )
}

export default App
