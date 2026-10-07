import Link from "next/link";
import { dmSans, playfair } from "@/ui/font";

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center px-6">
      <div className="max-w-3xl text-center text-white rounded-xl">
        <h1 className={`animate-slide-up delay-200 text-5xl font-bold tracking-tight mb:2 sm:text-6xl ${playfair.className}`}>
          Plan your day around your energy.
        </h1> 

        <p className={`animate-slide-up delay-400 mt-6 text-lg text-slate-300 sm:text-xl ${dmSans.className}`}>
          A smarter daily planner that learns how you work and helps you build
          a realistic schedule around your energy, tasks, and calendar.
        </p>

        <Link
          href="/login"
          className=" animate-slide-up delay-600 mt-8 inline-block rounded-lg bg-white px-10 py-4 font-semibold text-slate-900 transition hover:bg-slate-200"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}