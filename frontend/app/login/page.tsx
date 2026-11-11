"use client"
/* eslint-disable react/no-unescaped-entities */
import PrimaryButton from "@/ui/PrimaryButton"
import { dmSans, playfair } from "@/ui/font"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { loginUser } from "@/lib/api"
import { googleAuthURL } from "@/lib/api"
import {useAuth} from "@/context/AuthProvider"
import {useNotification} from "@/context/NotificationProvider"
import axios from "axios"
import { useRouter } from 'next/navigation'
import {validateLogin} from "@/lib/auth/authValidation"
import { Eye, EyeOff } from "lucide-react";
function Home () {
    const [userDetails, setUserDetails]= useState ({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false); //true show paswsword and false hide password
    const router = useRouter()
    const{setAccessToken}= useAuth();
    const {notify} = useNotification();
    const handleLogin = async ()=>{
        try{
        const validationError = validateLogin(userDetails)
        if (validationError) {
        notify(validationError, "error");
        return }
        const response= await loginUser(userDetails)
        console.log(response)
        const {accessToken,message,user}= response
        setAccessToken(accessToken)
        notify(message ?? "Login successful!", "success")
        router.replace("/dashboard")}
    catch (error) {
    const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

    notify(
        Array.isArray(message)
        ? message.join(", ")
        : message ?? "Login failed. Please try again.",
        "error",
    );
    }}

      const handleGoogleLogin = ()=>{
        window.location.href=googleAuthURL }
   
return(
    <main className=" min-h-screen flex items-center justify-center flex-col bg-[#F8F9FA]">
        <div className="w-full max-w-md rounded-3xl shadow-2xl p-10 text-black ">
            <h1 className={`text-6xl font-bold tracking-tight mb-2 sm:text-5xl text-center ${playfair.className}`}>LOGIN</h1>
            {/*Google sign in button */}
            <div className="flex flex-col  mt-10">
            <PrimaryButton size= "large" background="#ff0000" color="#ffffff" onClick={handleGoogleLogin}> 
                 <Image src="https://www.google.com/favicon.ico" alt="Google logo" height={32} width={32} className="mr-4"/>Sign in with Google</PrimaryButton>
            </div>
            {/* Email local sign in */}
            <p className={`${dmSans.className} text-gray-700  mt-8 text-center flex flex-col items-center`}> Or sign in with Email</p>
            <div className="mt-6">
                <label className={`block text-sm font-medium ${dmSans.className}`}>
                    Email
                </label>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={userDetails.email}
                    onChange={(event)=> {setUserDetails(prevValue=>({...prevValue,email:event.target.value}))}}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                />
            </div>
            <div className="mt-6">
    <label className={`block text-sm font-medium ${dmSans.className}`}>
        Password
    </label>

    {/* Wrapper for input and visibility button */}
                <div className="relative mt-2 mb-6">

                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        value={userDetails.password}
                        onChange={(event) => {
                            setUserDetails(prevValue => ({
                                ...prevValue,
                                password: event.target.value
                            }));
                        }}
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-indigo-500"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>

                </div>
            </div>
            
            <div className="flex flex-col ">
            <PrimaryButton size= "large" background="#020618" color="#ffffff" onClick={handleLogin} >Login</PrimaryButton>
            </div>
            <Link href="/register" className={`${dmSans.className} text-gray-700  mt-8 text-center flex flex-col items-center`}> Don't have an account? Sign up</Link>


    </div>
    </main>
)
}
export default Home