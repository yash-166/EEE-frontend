import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const instructions = [
  "In first level You have to match the logic gates and its statement.",
  "Please tap two times in the middle of the card respectively to select the cards.",
  "After submitting the results, the score will be displayed.",
  "Players will upgraded to the 2nd level without considering the score of 1st level.",
  "In level 2 select a card in the four flash cards.",
  "You have only one chance to select a card .So select the card correctly.",
  "Instructor reveal the card which is choosen by most of the players.",
  "The flash card will display on the screens with the statement (logic circuit) which is revealed by the instructor.",
  "The timer will be started by the instructor.",
  "After completing your circuit in multisim ,save it and   stop the timer by yourself by clicking the submit button.",
  "Then upload the file which is saved by you in the website.",
  "Then ROUND 1 of the brightest minds is successfully completed."

];

const InstructionsPage = () => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const isRegistered = localStorage.getItem("teamId");
    if (!isRegistered) {
      navigate("/");
    }
  }, [navigate]);

  const handleProceed = () => {
    localStorage.setItem("instructionsSeen", "true");
    navigate("/level-one");
};

  

  return (
    <div className="flex flex-col items-center  bg-darkblue text-white p-6 relative overflow-hidden">
      <motion.h2
        className="text-4xl font-bold mb-6 text-cyan-400"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Instructions
      </motion.h2>

      <motion.h2
        className="text-[22px] font-bold mb-1 text-red-600"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Please read the instructions carefully
      </motion.h2>

      <div className="p-4 px-9 rounded-lg shadow-lg bg-opacity-30 backdrop-blur-sm max-w-[900px] custom-scrollbar w-full max-h-[515px] overflow-y-auto flex flex-col">
        {instructions.map((instruction, index) => (
          <motion.p
            key={index}
            className="mb-4 text-lg text-gray-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.3 }}
          >
            {index + 1}. {instruction}
          </motion.p>
        ))}

        <div className="flex items-center mb-4 mt-4 ms-auto me-auto">
          <input
            type="checkbox"
            id="agree"
            className="mr-2 w-5 h-5"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <label htmlFor="agree" className="text-lg  text-gray-300">
            I have read and agree to the instructions.
          </label>
        </div>

        <motion.button
          onClick={handleProceed}
          disabled={!isChecked}
          className={`ms-auto me-auto py-2 w-fit px-6 mt-2 rounded text-white font-bold transition-all duration-300 ${
            isChecked
              ? "bg-cyan-500 hover:bg-cyan-600 cursor-pointer"
              : "bg-gray-700 cursor-not-allowed"
          }`}
          whileHover={isChecked ? { scale: 1.05 } : {}}
        >
          Proceed
        </motion.button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
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

export default InstructionsPage;