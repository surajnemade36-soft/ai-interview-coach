import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { getWebsiteNotice } from "../services/firestore";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

function Home() {
    const navigate = useNavigate();
     const [notice,setNotice] = useState("");

const handleLogout = async () => {
  try {
    await signOut(auth);
    alert("Logged out successfully");
   navigate("/login", { replace: true });
  } catch (error) {
    console.error(error);
    alert("Logout failed");
  }
};

useEffect(()=>{

  const unsubscribe = getWebsiteNotice((data)=>{

    if(data){

      setNotice(data.notice);

    }

  });


  return ()=>unsubscribe();

},[]);


  return (
  <div className="relative bg-slate-100 min-h-screen">

    {/* Logout Button */}
    <button
      onClick={handleLogout}
      className="absolute top-4 right-1 bg-red-600 hover:bg-red-500 text-black px-5 py-2 rounded-xl shadow-lg z-60"
    >
                🚪 Logout
    </button>
    

    <Navbar />
    {
 notice && (

  <div className="bg-yellow-400 text-black p-2 rounded-lg text-center">

    📢 {  notice}

  </div>

 )
}

    <Hero />

    <div className="max-w-6xl mx-auto px-6 mt-6">

      
      <button
        onClick={() => navigate("/analytics")}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-lg font-semibold"
      >
        📊 Analytics Dashboard
      </button>
    </div>
    
  </div>
  
);
}

export default Home;