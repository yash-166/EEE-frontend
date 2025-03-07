// // import React from "react";

// // const Completed = () => {
// //   return (
// //     <div className="flex items-center justify-center min-h-screen bg-darkblue">
// //       <h1 className="text-9xl font-bold text-white italic">Thank You!...</h1>

// //     </div>
// //   );
// // };

// // export default Completed;


// import React, { useState } from "react";

// const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/raw/upload";
// const UPLOAD_PRESET = "EEE_EVENT";

// const FileUploadPage = () => {
//   const [file, setFile] = useState(null);
//   const [fileUrl, setFileUrl] = useState(null);
//   const [submitted, setSubmitted] = useState(false);

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleFileUpload = async () => {
//     if (!file) return;
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", UPLOAD_PRESET);

//     try {
//       const response = await fetch(CLOUDINARY_UPLOAD_URL, {
//         method: "POST",
//         body: formData,
//       });
//       const data = await response.json();
//       setFileUrl(data.secure_url);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };

//   const handleSubmit = () => {
//     if (!fileUrl) return;
//     setSubmitted(true);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A192F] text-white">
//       {!submitted ? (
//         <div className="flex flex-col items-center gap-6 p-8 border border-gray-700 rounded-lg">
//           <input type="file" onChange={handleFileChange} className="hidden" id="fileInput" />
//           <label
//             htmlFor="fileInput"
//             className="py-2 px-5 bg-gray-700 hover:bg-gray-500 rounded text-white font-bold cursor-pointer"
//           >
//             Upload File
//           </label>
//           <span className="text-lg font-semibold">
//             {file ? file.name : "No file chosen"}
//           </span>
//           <button
//             onClick={handleFileUpload}
//             disabled={!file}
//             className={`py-2 px-5 bg-green-700 hover:bg-green-500 rounded text-white font-bold ${
//               file ? "cursor-pointer" : "cursor-not-allowed opacity-50"
//             }`}
//           >
//             Upload
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={!fileUrl}
//             className={`py-3 px-8 bg-blue-900 hover:bg-blue-700 rounded text-white font-bold ${
//               fileUrl ? "cursor-pointer hover:scale-105" : "cursor-not-allowed opacity-80"
//             }`}
//           >
//             Submit
//           </button>
//         </div>
//       ) : (
//         <h1 className="text-3xl font-bold mt-8">Thank You</h1>
//       )}
//     </div>
//   );
// };

// export default FileUploadPage;




// import React, { useState } from "react";

// const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dgelue5vg/raw/upload";
// const UPLOAD_PRESET = "EEE_EVENT";
// const BACK_URL = import.meta.env.VITE_BACK_URL

// const FileUploadPage = () => {
//   const [file, setFile] = useState(null);
//   const [fileUrl, setFileUrl] = useState(null);
//   const [submitted, setSubmitted] = useState(false);
  
//   const handleFileUpload = async (event) => {
//     const selectedFile = event.target.files[0];
//     if (!selectedFile) return;
//     setFile(selectedFile);
    
//     const formData = new FormData();
//     formData.append("file", selectedFile);
//     formData.append("upload_preset", UPLOAD_PRESET);


//     const originalFileName = selectedFile.name.split(".").slice(0, -1).join(".");
//     const fileExtension = selectedFile.name.split(".").pop();

//     // Setting the file name in Cloudinary
//     formData.append("public_id", originalFileName); 
//     formData.append("resource_type", "raw");
    
//     try {
//       const response = await fetch(CLOUDINARY_UPLOAD_URL, {
//         method: "POST",
//         body: formData,
//       });
//       const data = await response.json();
//       setFileUrl(data.secure_url);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };

//   const handleSubmit = async() => {
//     if (!fileUrl) return;
//     setSubmitted(true);
//     const teamId = localStorage.getItem("teamId");

//     try {
//       const response = await fetch(`${BACK_URL}/team/uploadFile`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ teamId, fileUrl }),
//       });

//       console.log("resposne is",response)
//       if (response.ok) {
//         // localStorage.clear();
//       }
//     } catch (error) {
//       console.error("Submission Error:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen  text-white">
//       {!submitted ? (
//         <div className="flex  justify-around items-center gap-5  py-8 px-4 w-[350px] h-[150px] border border-gray-700 rounded-lg">
//           <div className="flex flex-col gap-2">
//           <input type="file" onChange={handleFileUpload} className="hidden" id="fileInput" />
//           <span className="text-lg font-semibold">
//             {file ? file.name : "No file chosen"}
//           </span>
//           <label
//             htmlFor="fileInput"
//             className="py-2 px-5 bg-gray-700 hover:bg-gray-500 rounded text-white font-bold cursor-pointer"
//           >
//             Upload File
//           </label>
//           </div>
          
//           <div>
//           <button
//             onClick={handleSubmit}
//             disabled={!fileUrl}
//             className={`py-[8px] mt-8 px-8 bg-blue-900 hover:bg-blue-700 rounded text-white font-bold ${
//               fileUrl ? "cursor-pointer hover:scale-105" : "cursor-not-allowed opacity-80"
//             }`}
//           >
//             Submit
//           </button>
//           </div>
//         </div>
//       ) : (
//         <h1 className="text-3xl font-bold mt-8">Thank You</h1>
//       )}
//     </div>
//   );
// };

// export default FileUploadPage;





import React, { useState,useEffect } from "react";
import { motion } from "framer-motion";
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dgelue5vg/raw/upload";
const UPLOAD_PRESET = "EEE_EVENT";
const BACK_URL = import.meta.env.VITE_BACK_URL

const FileUploadPage = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [loading,setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const teamId = localStorage.getItem("teamId"); 

  useEffect(() => {
    if (!teamId) {
      setSubmitted(true);
    }
  },[]);
  
  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setLoading(true)
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", UPLOAD_PRESET);


    const originalFileName = selectedFile.name.split(".").slice(0, -1).join(".");
    const fileExtension = selectedFile.name.split(".").pop();

    // Setting the file name in Cloudinary
    formData.append("public_id", originalFileName); 
    formData.append("resource_type", "auto");
    
    try {
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setLoading(false)
      setFileUrl(data.secure_url);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSubmit = async() => {
    if (!fileUrl) return;
    setSubmitted(true);
    const teamId = localStorage.getItem("teamId");

    try {
      const response = await fetch(`${BACK_URL}/team/uploadFile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, fileUrl }),
      });

      console.log("resposne is",response)
      if (response.ok) {
        localStorage.clear();
      }
    } catch (error) {
      console.error("Submission Error:", error);
    }
  };

  return (
   <> 


    <div className="flex flex-col items-center justify-center min-h-screen  text-white">
     {!submitted && <h2
        className="text-3xl font-bold mb-[50px]"
      >
       🚀  Please upload Your File
      </h2>} 

      {!submitted && <span className="text-lg mb-5 font-semibold">
            File is:  {file ? file.name : "No file chosen"}
          </span>}
      

      {!submitted ? (
        <div className="flex  justify-around items-center gap-5  py-8 px-4 w-[350px] h-[150px] border border-gray-700 rounded-lg">
          <div className="flex flex-col gap-2">
          <input type="file" onChange={handleFileUpload} className="hidden" id="fileInput" />
          
          <label
            htmlFor="fileInput"
            className="py-2 px-5 bg-gray-700 hover:bg-gray-500 rounded text-white font-bold cursor-pointer"
          >
            {loading ? "Uploading..." : "Upload File"}
          </label>
          </div>
          
          <div>
          <button
            onClick={handleSubmit}
            disabled={!fileUrl}
            className={`py-[8px]  px-8 bg-blue-900 hover:bg-blue-700 rounded text-white font-bold ${
              fileUrl ? "cursor-pointer hover:scale-105" : "cursor-not-allowed opacity-80"
            }`}
          >
            Submit
          </button>
          </div>
        </div>
      ) : (
        // <h1 className="text-3xl font-bold mt-8">Thank You</h1>
        <h1 className="text-9xl font-bold text-white italic">Thank You!...</h1>
      )}
    </div>
    </>
  );
};

export default FileUploadPage;

