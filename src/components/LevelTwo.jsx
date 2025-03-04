import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
const BACK_URL = import.meta.env.VITE_BACK_URL
const socket = io(BACK_URL);

const LevelTwo = () => {
  const navigate = useNavigate();
  // const [isAuthorized, setIsAuthorized] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [startRotation, setStartRotation] = useState(false); // Track rotation start
  const [finishTime, setFinishTime] = useState(null);
  const [cardCounts, setCardCounts] = useState([0, 0, 0, 0])
  const [revealedContent,setReveleadContent] = useState(null);
  const [disabledButton,setDisabledButton] = useState(false);
const [showStartMessage, setShowStartMessage] = useState(false);
const [isVisible, setIsVisible] = useState(() => {
  return localStorage.getItem("level2Active") === "true"; // Retrieve stored value
});


console.log("showStartMessage",showStartMessage);
    
  useEffect(() => {
    const teamId = localStorage.getItem("teamId");
    if (!teamId) {
      navigate("/");
      return;
    }

    setTimeout(() => setShowContent(true), 300); // Delays showing content for smooth transition

    fetch(`${BACK_URL}/team/get-revealed-card`)
      .then((res) => res.json())
      .then(data => {
        console.log("revealed data is:",data);
        const revealedCard = data.revealedCard;
        if (revealedCard !== null) {
          setReveleadContent(revealedCard)
          setSelectedCard(2);
          setAnimateCard(false);
          setIsFlipped(true);
        }

      })
      
     
    
    if (teamId) {
      fetch(`${BACK_URL}/team/getSelection/${teamId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("data is of:",data)
          
          if (!data.firstLevelSubmitted) {
            navigate("/level-one"); // Redirect to home if Level One is not submitted
          }

          if (data.selectedCard !== null && selectedCard === null) {
            setSelectedCard(data.selectedCard); // ✅ Set the selected card
            setAnimateCard(true);
          }
        })
        .catch((err) => console.error("Error fetching selection:", err));
    }


    

    // Listen for real-time card selection updates from other teams
    socket.on("update_click_counts", (updatedCounts) => {
      setCardCounts(updatedCounts);
    });

   
    socket.on("toggle_level2", (status) => {
      setIsVisible(status);
      localStorage.setItem("level2Active", status);
    });;

    socket.on("card_revealed", ({ statement }) => {
      setReveleadContent(statement);
      setSelectedCard(1);
      setAnimateCard(true);
      setStartRotation(true);
    });

    socket.on("revealed_card_reset", () => {
      setSelectedCard(null);
      setReveleadContent("");
      setAnimateCard(false);
      setStartRotation(false);
      setIsFlipped(false);
    });

    socket.on("start_level", () => {
      setShowStartMessage(true);
      setDisabledButton(true);
    });

   
   

    return () => {
      socket.off("update_click_counts");
      socket.off("revealed_card_status");
      socket.off("card_revealed");
      socket.off("revealed_card_reset");
      socket.off("toggle_level2");
      socket.off("start_level");

    };
  }, [navigate]);


  console.log("selectedCard is", selectedCard)


  const commonImage = "/teckzite_logo.jpeg";


  const handleCardClick = (cardIndex) => {
    const teamId = localStorage.getItem("teamId");
    if (!teamId || selectedCard !== null) return;

    setSelectedCard(cardIndex);
    console.log("cardIndex is:", cardIndex);
    setTimeout(() => setAnimateCard(true), 100);

    socket.emit("card_clicked", { teamId, cardIndex });

    // ✅ Save selected card in the backend
    fetch(`${BACK_URL}/team/saveSelection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId, selectedCard: cardIndex }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Selection saved:", data))
      .catch((err) => console.error("Error saving selection:", err));
  };


  const handleFinish = async () => {
    const now = new Date();
    const formattedFinishTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });

    setFinishTime(formattedFinishTime);

    const teamId = localStorage.getItem("teamId"); // Retrieve stored teamId
    if (!teamId) {
      console.error("No teamId found in localStorage");
      return;
    }

    try {
      const response = await fetch(`${BACK_URL}/team/submitSecondLevel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, finishTime: formattedFinishTime }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Success:", result);
        localStorage.clear();
        navigate("/completed");
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Network Error:", error);
    }
  };


  const cards = [
    { id: 0, image: "/card1.jpeg", position: { top: "7%", left: "10%" }, animation: "animate-slideLeft" },
    { id: 1, image: "/card2.jpeg", position: { top: "7%", right: "10%" }, animation: "animate-slideRight" },
    { id: 2, image: "/card3.jpeg", position: { bottom: "12%", left: "10%" }, animation: "animate-slideLeft" },
    { id: 3, image: "/card4.jpeg", position: { bottom: "12%", right: "10%" }, animation: "animate-slideRight" },
  ];
  const handleRotationEnd = () => {
    setIsFlipped(true); // Set `isFlipped` to true only after 180-degree rotation
  };

  console.log("data is:", selectedCard, cards)

  return (
    <>
    {isVisible ? 

    (<div className="flex flex-col items-center justify-center min-h-screen text-white">
      {/* Heading with Drop-In Animation */}
      <h2
        className={`text-3xl font-bold mb-4 mt-4 transition-transform duration-1000 ease-out ${showContent ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"
          }`}
      >
        Level Two - Flipping Card Game
      </h2>
      
      {showStartMessage && (
  <motion.h1
    className="absolute text-white font-bold top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    initial={{ scale: 8, opacity: 0 }}
    animate={{ scale: 1.2, opacity: 1 }}
    transition={{ duration: 3, ease: "easeOut" }}
  >
    🚀 Start the Level-2!
  </motion.h1>
)}



<div className="flex items-center justify-center mt-3 space-y-3 gap-2">
  <h2 className="text-3xl font-extrabold text-white tracking-wide">
    Finish Time: 
  </h2>
  <p className="text-2xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 
                px-6 py-4 rounded-xl shadow-lg transform transition duration-300 hover:scale-105">
    {finishTime}
  </p>
</div>

      
      

      <div className="relative w-[800px] h-[500px] flex items-center justify-center  rounded-lg ">
        {selectedCard === null ? (
          // Show all four cards with animations
          cards.map((card) => (
            <>

              <div
                key={card.id}
                className={`absolute w-44 gap-1 h-46 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-transform duration-1000 ease-out hover:scale-110 hover:rotate-3 ${showContent ? card.animation : "opacity-0"
                  }`}
                style={card.position}
                onClick={() => handleCardClick(card.id)}
              ><h1 className="font-bold">CARD-{card.id + 1}</h1>
                <img src={commonImage} alt="Card Back" className="w-full h-full rounded-lg" />
              </div>
            </>
          ))
        ) : (
          // Animate selected card moving to center
          <div
            className={`absolute w-48 h-57 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-[2.5s] ease-in-out ${animateCard ? "top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%] scale-100 opacity-100" : "opacity-0"
              }`}
          // onClick={() => setStartRotation(true)}
          >
            <div
              className={`relative w-full h-full transition-transform duration-1800 ease-in-out ${startRotation ? "rotate-y-360" : ""
                }`}
              onTransitionEnd={handleRotationEnd}
            >
              {isFlipped ? (
                // <img src='/AND Gate.jpg' alt="Selected Card" className="w-full h-full rounded-xl" />
                <div className="rounded-md  h-full w-full text-[18px] bg-gray-700 white font-bold items-center flex text-center">
                  <p>{revealedContent}</p>
                </div>
              ) : (
                <img src={commonImage} alt="Card Back" className="w-full h-full rounded-xl" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Finish Button */}
      <button
        onClick={handleFinish}
        disabled={!disabledButton}
        className="cursor-pointer mb-5 -mt-5 py-3 px-8 bg-blue-900 hover:bg-blue-700 rounded text-white font-bold transition-transform duration-300 hover:scale-105"
      >
        Finish
      </button>

      {/* Inline CSS for animations */}
      <style>
        {`
        @keyframes slideLeft {
          0% { transform: translateX(-150px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideRight {
          0% { transform: translateX(150px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes fadeIn {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        .animate-slideLeft {
          animation: slideLeft 2s ease-out forwards;
        }

        .animate-slideRight {
          animation: slideRight 2s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        `}
      </style>
    </div>
  ) : 
  <div className="flex items-center justify-center min-h-screen text-white text-2xl font-bold">
  Level Two is not yet available....
</div>
  
  }

  </>
  );
};

export default LevelTwo;



