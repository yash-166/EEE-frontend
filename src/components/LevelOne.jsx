import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const BACK_URL = import.meta.env.VITE_BACK_URL

const MatchingGame = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const teamId = localStorage.getItem("teamId");
    if (!teamId) {
        navigate("/"); // Redirect to registration if no teamId
    }

    if (localStorage.getItem("instructionsSeen") !== "true") {
      navigate("/instructions"); // Redirect to instructions if not seen
  }
}, [navigate]);


  const logicGateStatements = [
    { gate: "NOR Gate", statement: "Output is high only when the two inputs are low" },
    { gate: "XOR Gate", statement: "Output is high only when both inputs are not same" },
    { gate: "AND Gate", statement: "Output is high only when both inputs are high" },
    { gate: "XNOR Gate", statement: "Output is high only when both the inputs are same" },
    { gate: "NOT Gate", statement: "Output is complement to the input" },
    { gate: "NAND Gate", statement: "Output is high except when both inputs are high" },
    { gate: "OR Gate", statement: "Output is high if any one of the input is high" },
  ];

  
  const logicGates = [
    { name: "NOR Gate", image: "NOR Gate.jpg" },
    { name: "XOR Gate", image: "XOR Gate.jpg" },
    { name: "AND Gate", image: "AND Gate.jpg" },
    { name: "XNOR Gate", image: "XNOR Gate.jpg" },
    { name: "NOT Gate", image: "NOT Gate.jpg" },
    { name: "NAND Gate", image: "NAND Gate.jpg" },
    { name: "OR Gate", image: "OR Gate.jpg" },
  ];

  const statements = [
    "Output is high only when both the inputs are same",
    "Output is high only when the two inputs are low",
    "Output is high only when both inputs are not same",
    "Output is high only when both inputs are high",
    "Output is complement to the input",
    "Output is high except when both inputs are high",
    "Output is high if any one of the input is high",
  ];


  // const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFD700", "#A133FF", "#00D4FF"];
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFD700", "#A133FF", "#00D4FF"];


  const [selectedGate, setSelectedGate] = useState(null);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [error, setError] = useState(""); // State for error message
  const [availableColorIndices, setAvailableColorIndices] = useState(Array.from({ length: colors.length }, (_, i) => i));


  console.log("num is",availableColorIndices);
  const handleSelect = (type, item) => {
    if (type === "gate") {
      setSelectedGate(item);
      if(selectedColorIndex === null){
        setSelectedColorIndex(availableColorIndices[0]);
      }

    } else if (type === "statement") {
      setSelectedStatement(item);
      if(selectedColorIndex === null){
        setSelectedColorIndex(availableColorIndices[0]);
      }
      
    }

    if (selectedGate && selectedStatement) {
      setAvailableColorIndices((prev) => prev.slice(1));
      setMatchedPairs((prev) => [
        ...prev,
        { gate: selectedGate, statement: selectedStatement, color: colors[selectedColorIndex] },
      ]);
      setSelectedGate(null);
      setSelectedStatement(null);
      setSelectedColorIndex(null);
    }
  };

  

  const handleSubmit = async() => {
    if (matchedPairs.length !== logicGates.length) {
      setError("Please match all pairs before submitting!");
      return // Set error if all pairs are not matched
    }
    setError("");
    try {
      const response = await fetch(`${BACK_URL}/team/match`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({logicGateStatements,matchedPairs}),
      });
  
      const result = await response.json();
      console.log("Response:", result);
      if(response.ok){
        navigate('/resultPage',{
          state: {
            totalCorrectPairsCount: result.correctCount,
            inCorrectPairs: result.incorrectPairs,
          },
        })
      }
    } catch (error) {
      console.error("Error sending data:", error);
    }
    
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen overflow-hidden bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/background.jpg')" }}>
      
      {/* Heading */}
      <motion.h1
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 mb-4"
      >
        LEVEL-1 MATCHING
      </motion.h1>
      
      <motion.div 
        initial={{ y: -200, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.8 }}
        className="flex gap-20 bg-opacity-80 p-8 rounded-lg shadow-xl max-w-4xl w-full justify-between items-center"
      >
        
        {/* Left Side - Logic Gates */}
        <div className="max-h-[450px] w-40 overflow-y-auto custom-scrollbar"
        style={{ direction: "rtl", paddingLeft: "10px" }}
        >
          {logicGates.map((gate, index) => {
            const match = matchedPairs.find((pair) => pair.gate === gate.name);
            return (
              <motion.div
                key={gate.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, delay: index * 0.5 }}
                className="w-35 h-25 flex justify-center items-center border-4 border-gray-600 bg-white rounded-lg shadow-lg cursor-pointer mb-4"
                style={{
                  backgroundColor: match ? match.color : selectedGate === gate.name ? colors[selectedColorIndex] : "white",
                }}
                
                
                onClick={() => handleSelect("gate", gate.name)}
              >
                <img src={gate.image} alt={gate.name} className="w-24 h-24 object-contain" />
              </motion.div>
            );
          })}
        </div>

        {/* Right Side - Statements */}
        <div className="max-h-[450px] w-80 overflow-y-auto custom-scrollbar"
        style={{ direction: "ltr", paddingRight: "14px" }}>
          {statements.map((stmt, index) => {
            const match = matchedPairs.find((pair) => pair.statement === stmt);
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, delay: index * 0.5 }}
                className="w-full p-3 text-black text-lg font-semibold bg-blue-700 rounded-lg shadow-md hover:bg-blue-600 transition cursor-pointer mb-4"
                style={{
                  backgroundColor: match
                    ? match.color
                    : selectedStatement === stmt && selectedColorIndex !== null
                    ? colors[selectedColorIndex]
                    : "whitesmoke",
                }}
                
                
                onClick={() => handleSelect("statement", stmt)}
              >
                {stmt}
              </motion.button>
            );
          })}
        </div>
      </motion.div>


{/* Error Message */}
{error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-red-600 text-lg font-bold mt-4"
        >
          {error}
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className={`absolute bottom-10 px-4 py-2 text-white font-bold rounded-md transition ${
          matchedPairs.length !== logicGates.length
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600 cursor-pointer"
        }`}
        onClick={handleSubmit}
        disabled={matchedPairs.length !== logicGates.length} // Disable button when all are not matched
      >
         Submit
         </motion.button>
      

     

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2.5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 255, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 255, 255, 0.7);
        }
      `}</style>
    </div>
  );
};

export default MatchingGame;