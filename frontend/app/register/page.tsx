"use client"
import PrimaryButton from "@/ui/PrimaryButton"
import { dmSans, playfair } from "@/ui/font"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { registerUser } from "@/lib/api"
import { googleAuthURL } from "@/lib/api"
import { useNotification } from "@/context/NotificationProvider"
import axios from "axios"
import { useRouter } from 'next/navigation'
import { validateRegister } from "@/lib/auth/authValidation"
import { Eye, EyeOff } from "lucide-react";
function Home () {
    const [user,setUser] = useState({
        name:"",
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false); //true show paswsword and false hide password
    const { notify }= useNotification();
    const router = useRouter()
    const handleRegister = async ()=>{
        try{
        const validationError = validateRegister(user)
        if (validationError) {
            notify(validationError, "error");
            return 
        }
        const response = await registerUser(user)
        const{message}= response
        notify(message ?? "Registration successful!", "success")
        router.replace("/login")
    } 
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
            <h1 className={`text-6xl font-bold tracking-tight mb-2 sm:text-5xl text-center ${playfair.className}`}> Sign up </h1>
            {/*Google sign in button */}
            <div className="flex flex-col  mt-10">
            <PrimaryButton size= "large" background="#ff0000" color="#ffffff" onClick={handleGoogleLogin}> 
                 <Image src="https://www.google.com/favicon.ico" alt="Google logo" height={32} width={32} className="mr-4"/>Sign up with Google</PrimaryButton>
            </div>
            {/* Email local sign in */}
            <p className={`${dmSans.className} text-gray-700  mt-8 text-center flex flex-col items-center`}> Or sign up with Email</p>
            <div className="mt-6">
                <label className={`block text-sm font-medium ${dmSans.className}`}>
                    Name
                </label>
                <input
                    placeholder="Enter your name"
                    value= {user.name}
                    onChange={(event) => {setUser(prevValue=>({...prevValue, name:event.target.value}))}}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                />
            </div>
            
            <div className="mt-6">
                <label className={`block text-sm font-medium ${dmSans.className}`}>
                    Email
                </label>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value= {user.email}
                    onChange={(event) => {setUser(prevValue=>({...prevValue, email:event.target.value}))}}
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
                        value={user.password}
                        onChange={(event) => {
                            setUser(prevValue => ({
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
                    </button></div> </div>           
            <div className="flex flex-col ">
            <PrimaryButton size= "large" background="#020618" color="#ffffff" onClick={handleRegister} > Sign up </PrimaryButton>
            </div>
            <Link href="/login" className={`${dmSans.className} text-gray-700  mt-8 text-center flex flex-col items-center`}> Already have an account ? Sign in</Link>
    </div>
    </main>
)
}
export default Home