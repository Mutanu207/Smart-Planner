import PrimaryButton from "@/ui/PrimaryButton"
import { dmSans, playfair } from "@/ui/font"
import Link from "next/link"
import Image from "next/image"
function Home () {
return(
    <main className=" min-h-screen flex items-center justify-center flex-col bg-[#F8F9FA]">
        <div className="w-full max-w-md rounded-3xl shadow-2xl p-10 text-black ">
            <h1 className={`text-6xl font-bold tracking-tight mb-2 sm:text-5xl text-center ${playfair.className}`}> Sign up </h1>
            {/*Google sign in button */}
            <div className="flex flex-col  mt-10">
            <PrimaryButton size= "large" background="#ff0000" color="#ffffff"> 
                 <Image src="https://www.google.com/favicon.ico" alt="Google logo" height={32} width={32} className="mr-4"/>Sign up with Google</PrimaryButton>
            </div>
            {/* Email local sign in */}
            <p className={`${dmSans.className} text-gray-700  mt-8 text-center flex flex-col items-center`}> Or sign up with Email</p>
            <div className="mt-6">
                <label className={`block text-sm font-medium ${dmSans.className}`}>
                    Email
                </label>

                <input
                    type="email"
                    placeholder="Enter your email"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                />
            </div>
            <div className="mt-6">
                <label className={`block text-sm font-medium  ${dmSans.className}`}>
                    Password</label>
                <input 
                type= "password"
                placeholder="Enter your password"
                className="mt-2 mb-6 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"/> </div>
            <div className="flex flex-col ">
            <PrimaryButton size= "large" background="#020618" color="#ffffff" > Sign up </PrimaryButton>
            </div>
            <Link href="/login" className={`${dmSans.className} text-gray-700  mt-8 text-center flex flex-col items-center`}> Already have an account ? Sign in</Link>


    </div>
    </main>
)
}
export default Home