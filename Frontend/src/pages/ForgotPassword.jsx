import React,{ useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
function ForgotPassword() {
    const [step,setStep] = useState(1)
    const [email,setEmail] = useState("")
    const [OTP,setOTP] = useState("")
    const [newPassword,setNewPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")
    const navigate = useNavigate()

    return (
        <div className='flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]'>
            <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8'>
                <div className='flex items-center gap-4 mb-4'>

                    <IoIosArrowRoundBack size={30} className='text-[#ff4d2d] cursor-pointer' onClick={()=>navigate("/signin")}/>
                    <h1 className='text-2xl font-bold text-center text-[#ff4d2d]'>Forgot Password</h1>
                </div>
                {step == 1
                &&
                <div>
                    <div className='mb-6'>
                    <label htmlFor="Email" className='block text-gray-700 font-medium mb-1'>Email</label>
                    <input type="email" className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none' placeholder='Enter your email id' onChange={(e)=>setEmail(e.target.value)} value={email}/>
                    </div>

                    <button className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`} >
                    Send OTP
                    </button>


                </div>}

                {step == 2
                &&
                <div>
                    <div className='mb-6'>
                    <label htmlFor="Email" className='block text-gray-700 font-medium mb-1'>OTP</label>
                    <input type="email" className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none' placeholder='Enter the OTP' onChange={(e)=>setOTP(e.target.value)} value={OTP}/>
                    </div>

                    <button className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`} >
                    Verify OTP
                    </button>


                </div>}


                {step == 3
                &&
                <div>
                    <div className='mb-6'>
                    <label htmlFor="newPassword" className='block text-gray-700 font-medium mb-1'>New Password</label>
                    <input type="email" className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none' placeholder='Enter New Password' onChange={(e)=>setNewPassword(e.target.value)} value={newPassword}/>
                    </div>

                    <div className='mb-6'>
                    <label htmlFor="confirmPassword" className='block text-gray-700 font-medium mb-1'>Confirm Password</label>
                    <input type="email" className='w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none' placeholder='Confirm Password' onChange={(e)=>setConfirmPassword(e.target.value)} value={confirmPassword}/>
                    </div>

                    <button className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`} >
                   Reset Password
                    </button>


                </div>}
            </div>
        </div>
    )
}

export default ForgotPassword;