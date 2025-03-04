const BACK_URL = import.meta.env.VITE_BACK_URL

import React, { useState, useRef , useEffect } from "react";
import { io } from "socket.io-client";
const socket = io(BACK_URL); 
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegistrationPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const teamId = localStorage.getItem("teamId");
    if (teamId) {
        navigate("/instructions"); // Redirect if already registered
    }
}, [navigate]);

  const inputRefs = useRef([]);
  const [Loading,setLoading] = useState(false);
  const [team, setTeam] = useState([
    { name: "", teckziteId: "", errors: {} },
    { name: "", teckziteId: "", errors: {} },
    { name: "", teckziteId: "", errors: {} },
    { name: "", teckziteId: "", errors: {} },
  ]);


  // Validation function
  const validateField = (index, field, value) => {
    let errorMessage = "";

    if (field === "name") {
      if (!/^[A-Za-z ]{3,}$/.test(value)) {
        errorMessage = "Name must be at least 3 letters.";
      }
    }

    if (field === "teckziteId") {
      if (!/^TZK25\d{4}$/.test(value)) {
        errorMessage = "ID must be TZK25XXXX (4 digits).";
      }
    }

    const updatedTeam = [...team];
    updatedTeam[index][field] = value;
    updatedTeam[index].errors[field] = errorMessage;
    setTeam(updatedTeam);
  };

  console.log("team is:",team);

  const handleChange = (index, field, value) => {
    validateField(index, field, value);
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let firstErrorField = null;
    const updatedTeam = [...team];
    let isValid = true;
    const teckziteIdSet = new Set();
  
    updatedTeam.forEach((member, index) => {
      if (!member.name) {
        updatedTeam[index].errors.name = "Name is required.";
        if (!firstErrorField) firstErrorField = `name-${index}`;
        isValid = false;
      } else {
        updatedTeam[index].errors.name = "";
      }
  
      if (!member.teckziteId) {
        updatedTeam[index].errors.teckziteId = "Teckzite ID is required.";
        if (!firstErrorField) firstErrorField = `teckziteId-${index}`;
        isValid = false;
      } else if (teckziteIdSet.has(member.teckziteId)) {
        updatedTeam[index].errors.teckziteId = "Teckzite ID must be unique.";
        if (!firstErrorField) firstErrorField = `teckziteId-${index}`;
        isValid = false;
      } else {
        updatedTeam[index].errors.teckziteId = "";
        teckziteIdSet.add(member.teckziteId);
      }
    });
  
    setTeam(updatedTeam);
  
    if (!isValid) {
      if (firstErrorField && inputRefs.current[firstErrorField]) {
        inputRefs.current[firstErrorField].focus();
      }
      return;
    }
  
    // ✅ Send data to backend
    setLoading(true); // Show loading state
    try {
      const response = await fetch(`${BACK_URL}/team/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team }),
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log("Success:", result);
        socket.emit("new_registration");
        
        localStorage.setItem("teamId", result.teamId);
        
        toast.success("Successfully Registered!", {
          position: "top-center",
          autoClose: 1400, // Closes after 2 seconds
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "light",
        });

        
  
        // ✅ Delay navigation until toast disappears
        setTimeout(() => {
          navigate("/instructions");
        }, 1700);
        // navigate("/instructions");
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Network Error:", error);
    }
    setLoading(false);
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-6 bg-cover bg-center">
      <motion.h2
        className="text-3xl md:text-6xl mb-6 font-extrabold text-[#00D9FF] neon-text  text-center"
        initial={{ opacity: 0, y: -50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeIn" }}
      >
         {/* Brightest Minds  */}
        ⚡ Brightest Minds 💡
        
      </motion.h2>


      
      
      <motion.form
        onSubmit={handleSubmit}
        className=" bg-gray-1000 bg-opacity-30 backdrop-blur-[2px] p-3 rounded-lg shadow-lg max-w-[780px] w-full h-full"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeIn" }}
      >
        <motion.h2
          className="text-3xl font-bold mb-10 text-center text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Team Registration
        </motion.h2>

        {team.map((member, index) => (
          <motion.div
            key={index}
            className="flex flex-col gap-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.0 + index * 0.5 }}
          >
            <div className="flex gap-20 mb-6">
              {/* Name Input */}
              <input
                ref={(el) => (inputRefs.current[`name-${index}`] = el)}
                type="text"
                placeholder={`Member ${index + 1} Name`}
                value={member.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                className={`w-1/2 py-3 text-center bg-[#061B34] text-[#1EC8E6] border ${
                  member.errors.name ? "border-red-500" : "border-[#2389DA]"
                } rounded-lg shadow-md focus:ring-2 ${
                  member.errors.name ? "focus:ring-red-500" : "focus:ring-[#38BDF8]"
                } placeholder-[#73C7E6] transition-all duration-300 hover:border-[#00D9FF]`}
                required
              />
              {/* Teckzite ID Input */}
              <input
                ref={(el) => (inputRefs.current[`teckziteId-${index}`] = el)}
                type="text"
                placeholder={`Teckzite ID`}
                value={member.teckziteId}
                onChange={(e) => handleChange(index, "teckziteId", e.target.value)}
                className={`w-1/2 py-3 text-center bg-[#061B34] text-[#1EC8E6] border ${
                  member.errors.teckziteId ? "border-red-500" : "border-[#2389DA]"
                } rounded-lg shadow-md focus:ring-2 ${
                  member.errors.teckziteId ? "focus:ring-red-500" : "focus:ring-[#38BDF8]"
                } placeholder-[#73C7E6] transition-all duration-300 hover:border-[#00D9FF]`}
                required
              />
            </div>

            {/* Error Messages */}
            <div className="flex gap-20  text-center">
              <span className="w-1/2 text-red-500 text-sm">{member.errors.name}</span>
              <span className="w-1/2 text-red-500 text-sm">{member.errors.teckziteId}</span>
            </div>
          </motion.div>
        ))}

        <motion.button
          type="submit"
          className="py-2 w-fit mt-[40px] px-5 bg-blue-1000 hover:bg-blue-900 text-white font-bold mx-auto block border border-gray-400 rounded focus:ring-2 focus:ring-blue-1000"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          Register & Proceed
        </motion.button>
      </motion.form>
    </div>
  );
};

export default RegistrationPage;
