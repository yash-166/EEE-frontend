import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
const BACK_URL = import.meta.env.VITE_BACK_URL

const ResultsPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    console.log("State is:",state);
    const { totalCorrectPairsCount, inCorrectPairs } = state || {};
    

    const successMessage = "⚡ Full voltage, no resistance! Perfect answers!";
    const failureMessage = "⚠️ There is a short circuit in your answers. Try again!";
    const isPerfectScore = totalCorrectPairsCount === 7;

    useEffect(() => {
        const teamId = localStorage.getItem("teamId");

        fetch(`${BACK_URL}/team/getSelection/${teamId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("data from reult page level1submitted:",data)
          
          if (data.firstLevelSubmitted) {
            navigate("/level-two"); // Redirect to home if Level One is not submitted
          }
        })
        .catch((err) => console.error("Error fetching selection:", err));

    },[])

    const handleSubmitFirstLevel = async () => {
        const teamId = localStorage.getItem("teamId"); // Fetch _id from localStorage
    
        if (!teamId) {
            alert("Team ID not found. Please register again.");
            return;
        }
    
        try {
            const response = await fetch(`${BACK_URL}/team/submit-firstlevel`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ teamId }), // Send _id instead of teamNumber
            });
    
            const data = await response.json();
            if (response.ok) {
                console.log("First level submitted successfully:", data);
                navigate("/level-two")
            } else {
                console.error("Submission failed:", data.message);
            }
        } catch (error) {
            console.error("Error submitting first level:", error);
        }
    };
    

    // Animation variants for step-by-step appearance
    const fadeInFromAir = (delay) => ({
        initial: { opacity: 0, y: -50 },
        animate: { opacity: 1, y: 0, transition: { delay, duration: 0.9, ease: "easeOut" } }
    });

    // Confetti Animation for Celebration Effect 🎉
    const confettiParticles = Array.from({ length: 20 }).map((_, i) => ({
        key: i,
        initial: { x: i % 2 === 0 ? -200 : 200, y: 0, opacity: 0 },
        animate: { x: 0, y: [0, -50, 100, -150, 200], opacity: [1, 1, 1, 0], rotate: [0, 90, 180] },
        transition: { delay: i * 0.1, duration: 1.5, ease: "easeOut" },
        style: { backgroundColor: ["#FF5733", "#FFC300", "#DAF7A6", "#900C3F", "#3498DB"][i % 5] }
    }));

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-white p-6">
            {/* Animated Header with Rotating Gears */}
            <motion.div 
                className="flex items-center justify-center gap-4 mb-6"
                {...fadeInFromAir(0.2)}
            >
                <motion.span 
                    className="text-yellow-400 text-3xl"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                >
                    ⚙️
                </motion.span>

                <motion.h1 
                    className="text-4xl font-extrabold text-yellow-400"
                >
                    Quiz Results
                </motion.h1>

                <motion.span 
                    className="text-yellow-400 text-3xl"
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                >
                    ⚙️
                </motion.span>
            </motion.div>

            {/* Performance Message */}
            <motion.p
                className={`text-2xl font-semibold text-center mb-6 ${isPerfectScore ? "text-green-400" : "text-red-500"}`}
                {...fadeInFromAir(0.4)}
            >
                {isPerfectScore ? successMessage : failureMessage}
            </motion.p>

            {/* Confetti Effect (Only when all answers are correct) */}
            {isPerfectScore && (
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {confettiParticles.map(({ key, ...props }) => (
                        <motion.div
                            key={key}
                            className="w-4 h-4 absolute"
                            {...props}
                        />
                    ))}
                </div>
            )}

            {/* Score Details */}
            <motion.div
                className="text-lg p-6 rounded-lg shadow-lg gap-30 w-50% text-center flex justify-between items-center"
                {...fadeInFromAir(0.8)}
            >
                <p className="mb-3">🔢 Total Logic Gates: <span className="text-yellow-400">{totalCorrectPairsCount + (inCorrectPairs?.length || 0)}</span></p>
                <p className="mb-3">✅ Correct Matches: <span className="text-green-400">{totalCorrectPairsCount}</span></p>
                <p className="mb-3">❌ Incorrect Matches: <span className="text-red-400">{inCorrectPairs?.length || 0}</span></p>
            </motion.div>

            {/* Incorrect Images Section */}
            {inCorrectPairs && inCorrectPairs.length > 0 && (
              <>
                <motion.h2 
                    className="text-3xl font-extrabold text-yellow-300 mt-8 flex items-center gap-3"
                    {...fadeInFromAir(0.8)}
                >
                    ⚠️ <span className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">Circuit Error Detected!</span> ⚠️
                </motion.h2>
                <motion.p className="text-lg text-white mt-2 italic" {...fadeInFromAir(1)}>
                    These gates are wrongly wired! 🚨
                </motion.p>

                <motion.div 
                    className="flex justify-center gap-4 p-4 mt-6 rounded-lg shadow-lg" 
                    {...fadeInFromAir(0.8)}
                >
                    {inCorrectPairs.map((item, index) => {
                        const imageName = `${item.gate}.jpg`;
                        console.log(imageName);
                        const imageUrl = `/${imageName}`;

                        return (
                            <motion.img 
                                key={index} 
                                src={imageUrl} 
                                alt={item.gate} 
                                className="w-32 h-32 object-contain border border-red-500 p-2 bg-white rounded-md"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                {...fadeInFromAir(1 + index * 0.2)} // Delayed appearance for each image
                            />
                        );
                    })}
                </motion.div>
              </>
            )}

            {/* Buttons Section */}
            <motion.div className="flex gap-98 justify-center mt-8" {...fadeInFromAir(1.2)}>
                {!isPerfectScore && (
                    <motion.button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate("/level-one")}
                    >
                        🔄 Back to Quiz
                    </motion.button>
                )}
                <motion.button 
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSubmitFirstLevel}
                >
                    🚀 Go to Round-2
                </motion.button>
            </motion.div>
        </div>
    );
};

export default ResultsPage;
