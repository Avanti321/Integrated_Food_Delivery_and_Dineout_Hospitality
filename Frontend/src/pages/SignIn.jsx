import React, { useState } from 'react';
import { FaRegEye } from "react-icons/fa";
import { IoEyeOffOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from "../App";
import axios from "axios";

function SignIn() {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";
  const [showPassword, setShowPassword] = useState(false)
  const navigate=useNavigate()
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [errorMsg, setErrorMsg]=useState("")   // ✅ Added: to show error on screen
  
  const handleSignIn=async() => {
    setErrorMsg("")  // clear previous error
    try {
      const result=await axios.post(`${serverUrl}/api/auth/signin`,{
        email,
        password
      },{withCredentials:true})
      console.log("Sign In Success:", result.data);
      navigate("/");
    } catch(error){
      console.error("Sign In Error:", error.message);
      console.error("Response data:", error.response?.data);
      console.error("Status code:", error.response?.status);

      // ✅ Show the backend error message on screen
      const backendMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (typeof error.response?.data === "string" ? error.response.data : null) ||
        "Sign in failed. Please check your email and password.";
      setErrorMsg(backendMsg);
    }
  }
  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4' style=
      {{ backgroundColor: bgColor }}>
      <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px] `} style={{
        border: `1px solid ${borderColor}`
      }}>
        <h1 className={`text-3xl font-bold mb-2 `} style={{ color: primaryColor }}>Food_Delivery</h1>

        <p className='text-gray-600 mb-8'>Sign In to create your acoount to get started with delicious food deliveries</p>

        {/* ✅ Error message box — only shows when there's an error */}
        {errorMsg && (
          <div className='mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-300 text-red-600 text-sm'>
            {errorMsg}
          </div>
        )}

        {/* Email */}
        <div className='mb-4'>
          <label htmlFor="Email" className='block text-gray-700 font-medium mb-1'>Email</label>
          <input type="email" className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter your email id' style={{ border: `1px solid ${borderColor}` }} onChange={(e)=>setEmail(e.target.value)} value={email}/>
        </div>

        {/* Password */}
        <div className='mb-4'>
          <label htmlFor="Password" className='block text-gray-700 font-medium mb-1'>Password</label>
          <div className='relative'>
            <input type={`${showPassword ? "text" : "password"}`} className='w-full border 
              rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500' placeholder='Enter your Password'
              style={{ border: `1px solid ${borderColor}` }} onChange={(e)=>setPassword(e.target.value)} value={password}/>
            <button className="absolute right-3 cursor-pointer top-[14px] text-gray-500"
              onClick={() => setShowPassword(prev => !prev)}>{!showPassword ? <FaRegEye /> : <IoEyeOffOutline />}</button>
          </div>
        </div>
        <div className='text-right mb-4 cursor-pointer text-[#ff4d2d] font-medium' onClick={()=>navigate("/forgot-password")}>
          Forgot Password
        </div>

        <button className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`} onClick={handleSignIn}>
          Sign In
        </button>

        <button className='w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100'>
          <FcGoogle size={20}/>
          <span>Sign In with Google</span>
        </button>
        <p className='text-center mt-6 cursor-pointer' onClick={()=>navigate("/signup")}>Want to create a new account? <span className='text-[#ff4d2d]'>Sign Up</span></p>
      </div>
    </div>
  )
}

export default SignIn;